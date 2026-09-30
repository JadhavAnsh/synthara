import mongoose from "mongoose";

import { connectDB } from "@/lib/db/mongoose";
import { AiUsage } from "@/lib/db/models/ai-usage";
import type { AssistantAction } from "@/lib/validation/assistant";

const DEFAULT_MONTHLY_TOKEN_BUDGET = 1_000_000;

export function getDevelopmentTokenBudget() {
  const configured = Number(process.env.AI_DEVELOPMENT_TOKEN_BUDGET);
  return Number.isFinite(configured) && configured > 0
    ? Math.floor(configured)
    : DEFAULT_MONTHLY_TOKEN_BUDGET;
}

function startOfCurrentMonth() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export async function recordAiUsage(input: {
  userId: string;
  projectId: string;
  action: AssistantAction;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}) {
  await connectDB();
  await AiUsage.create({
    ...input,
    projectId: new mongoose.Types.ObjectId(input.projectId),
    inputTokens: input.inputTokens ?? 0,
    outputTokens: input.outputTokens ?? 0,
    totalTokens: input.totalTokens ?? 0,
  });
}

export async function getProjectAiUsage(userId: string, projectId: string) {
  await connectDB();

  const [summary] = await AiUsage.aggregate<{
    requestCount: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  }>([
    {
      $match: {
        userId,
        projectId: new mongoose.Types.ObjectId(projectId),
        createdAt: { $gte: startOfCurrentMonth() },
      },
    },
    {
      $group: {
        _id: null,
        requestCount: { $sum: 1 },
        inputTokens: { $sum: "$inputTokens" },
        outputTokens: { $sum: "$outputTokens" },
        totalTokens: { $sum: "$totalTokens" },
      },
    },
  ]);

  const budget = getDevelopmentTokenBudget();
  const totalTokens = summary?.totalTokens ?? 0;

  return {
    requestCount: summary?.requestCount ?? 0,
    inputTokens: summary?.inputTokens ?? 0,
    outputTokens: summary?.outputTokens ?? 0,
    totalTokens,
    budget,
    remainingTokens: Math.max(0, budget - totalTokens),
    period: startOfCurrentMonth().toISOString(),
  };
}
