import { NextResponse } from "next/server";

import { requireVerifiedApiSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/mongoose";
import { DocumentModel, Project } from "@/lib/db/models";
import { createProjectSchema } from "@/lib/validation/project";

export async function GET() {
  const authResult = await requireVerifiedApiSession();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { session } = authResult;

  await connectDB();

  const projects = await Project.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    projects: projects.map((project) => ({
      id: project._id.toString(),
      topic: project.topic,
      title: project.title,
      citationStyle: project.citationStyle,
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    })),
  });
}

export async function POST(request: Request) {
  const authResult = await requireVerifiedApiSession();
  if ("response" in authResult) {
    return authResult.response;
  }
  const { session } = authResult;

  const body = await request.json();
  const parsed = createProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  await connectDB();

  const { topic, citationStyle } = parsed.data;

  const project = await Project.create({
    userId: session.user.id,
    topic,
    title: topic,
    citationStyle,
    status: "draft",
  });

  await DocumentModel.create({
    projectId: project._id,
    citationStyle,
    editorState: null,
    exportStatus: "none",
  });

  return NextResponse.json(
    {
      project: {
        id: project._id.toString(),
        topic: project.topic,
        title: project.title,
        citationStyle: project.citationStyle,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    },
    { status: 201 },
  );
}
