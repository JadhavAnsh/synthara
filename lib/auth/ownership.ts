import mongoose from "mongoose";

import { connectDB } from "@/lib/db/mongoose";
import { Project } from "@/lib/db/models/project";

export class OwnershipError extends Error {
  status = 403;

  constructor(message = "You do not have access to this project.") {
    super(message);
    this.name = "OwnershipError";
  }
}

export async function assertProjectOwner(projectId: string, userId: string) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new OwnershipError("Invalid project id.");
  }

  const project = await Project.findById(projectId).lean();

  if (!project) {
    const error = new OwnershipError("Project not found.");
    error.status = 404;
    throw error;
  }

  if (project.userId !== userId) {
    throw new OwnershipError();
  }

  return project;
}
