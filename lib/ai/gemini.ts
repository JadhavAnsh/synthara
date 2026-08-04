export type GeminiMessage = {
  role: "user" | "model";
  text: string;
};

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

const GEMINI_API_VERSION = "v1beta";

function getGeminiApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY. Create a free key in Google AI Studio and add it to .env.local.");
  }

  return apiKey;
}

export function getGeminiModel() {
  return process.env.GEMINI_MODEL || "gemini-2.5-flash";
}

export async function generateResearchAssistantReply(messages: GeminiMessage[]) {
  const apiKey = getGeminiApiKey();
  const model = getGeminiModel();
  const endpoint = new URL(
    `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}/models/${model}:generateContent`,
  );

  endpoint.searchParams.set("key", apiKey);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text: "You are Synthara, an AI research assistant. Help researchers summarize sources, outline documents, compare evidence, and draft cited sections. Be explicit when source evidence is missing.",
          },
        ],
      },
      contents: messages.map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      })),
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1200,
      },
    }),
  });

  const payload = (await response.json()) as GeminiGenerateResponse;

  if (!response.ok) {
    throw new Error(payload.error?.message || "Gemini request failed.");
  }

  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return {
    provider: "google-gemini",
    model,
    text,
  };
}
