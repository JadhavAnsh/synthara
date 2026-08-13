import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { OwnershipError, assertProjectOwner } from "@/lib/auth/ownership";
import { requireVerifiedApiSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/mongoose";
import { Citation, DocumentModel } from "@/lib/db/models";
import { updateDocumentSchema, validateEditorStateSize } from "@/lib/validation/document";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function serializeDocument(document: {
  _id: mongoose.Types.ObjectId;
  citationStyle: string;
  editorState?: unknown;
  exportStatus: string;
  updatedAt?: Date;
}) {
  return {
    id: document._id.toString(),
    citationStyle: document.citationStyle,
    editorState: document.editorState ?? null,
    exportStatus: document.exportStatus,
    updatedAt: document.updatedAt,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  const authResult = await requireVerifiedApiSession();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { session } = authResult;
  const { id } = await context.params;

  try {
    await assertProjectOwner(id, session.user.id);
    await connectDB();

    const document = await DocumentModel.findOne({ projectId: id }).lean();

    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    return NextResponse.json({
      document: serializeDocument({
        ...document,
        _id: document._id,
      }),
    });
  } catch (error) {
    if (error instanceof OwnershipError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unable to fetch document." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const authResult = await requireVerifiedApiSession();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { session } = authResult;
  const { id } = await context.params;

  const body = await request.json();
  const parsed = updateDocumentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (parsed.data.editorState !== null && !validateEditorStateSize(parsed.data.editorState)) {
    return NextResponse.json({ error: "Document is too large to save." }, { status: 413 });
  }

  try {
    await assertProjectOwner(id, session.user.id);
    await connectDB();

    const document = await DocumentModel.findOneAndUpdate(
      { projectId: id },
      { editorState: parsed.data.editorState },
      { new: true },
    ).lean();

    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    return NextResponse.json({
      document: serializeDocument({
        ...document,
        _id: document._id,
      }),
    });
  } catch (error) {
    if (error instanceof OwnershipError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unable to save document." }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const authResult = await requireVerifiedApiSession();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { session } = authResult;
  const { id } = await context.params;

  const body = await request.json();
  const sourceId = typeof body.sourceId === "string" ? body.sourceId : "";
  const range =
    typeof body.range === "object" &&
    body.range !== null &&
    typeof body.range.from === "number" &&
    typeof body.range.to === "number"
      ? { from: body.range.from, to: body.range.to }
      : { from: 0, to: 0 };

  if (!mongoose.Types.ObjectId.isValid(sourceId)) {
    return NextResponse.json({ error: "Invalid source id." }, { status: 400 });
  }

  try {
    await assertProjectOwner(id, session.user.id);
    await connectDB();

    const document = await DocumentModel.findOne({ projectId: id }).lean();
    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    const cslJson =
      typeof body.cslJson === "object" && body.cslJson !== null
        ? body.cslJson
        : {};

    const citation = await Citation.create({
      documentId: document._id,
      sourceId,
      cslJson,
      range,
    });

    const existingCount = await Citation.countDocuments({ documentId: document._id });

    return NextResponse.json(
      {
        citation: {
          id: citation._id.toString(),
          sourceId,
          label: `[${existingCount}]`,
          range,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof OwnershipError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unable to create citation." }, { status: 500 });
  }
}
