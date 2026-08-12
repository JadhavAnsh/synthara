import { generateResearchAssistantReply, type GeminiMessage } from "@/lib/ai/gemini";
import { requireVerifiedApiSession } from "@/lib/auth/session";

export const runtime = "nodejs";

type AiRequestBody = {
  messages?: GeminiMessage[];
};

export async function POST(request: Request) {
  try {
    const authResult = await requireVerifiedApiSession();
    if ("response" in authResult) {
      return authResult.response;
    }

    const body = (await request.json()) as AiRequestBody;
    const messages = body.messages?.filter((message) => message.text?.trim());

    if (!messages?.length) {
      return Response.json(
        { error: "Send at least one message with role and text." },
        { status: 400 },
      );
    }

    const result = await generateResearchAssistantReply(messages);

    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown AI error.";

    return Response.json({ error: message }, { status: 500 });
  }
}
