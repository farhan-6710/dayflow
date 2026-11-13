import { ASSISTANT_TOOLS } from "./assistantTools.ts";

export interface AssistantPart {
  text?: string;
  thought?: boolean;
  thoughtSignature?: string;
  functionCall?: { id?: string; name: string; args?: Record<string, unknown> };
  functionResponse?: { id?: string; name: string; response: Record<string, unknown> };
}

export interface AssistantContent {
  role: "user" | "model";
  parts: AssistantPart[];
}

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models";
/**
 * Free-tier models only (Google AI Studio pricing, Nov 2026). Paid-only models such as gemini-4-carbon,
 * gemini-4-argon and gemini-3.1-pro are never sent, even if GEMINI_MODEL names one.
 */
const FREE_MODELS = ["gemini-3.6-flash", "gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-4-hydrogen"];
const DEFAULT_MODEL = "gemini-3.6-flash";

function pickModel(requested: string | undefined): string {
  return requested && FREE_MODELS.includes(requested) ? requested : DEFAULT_MODEL;
}
const TIMEOUT_MS = 30_000;

interface GeminiResponse {
  candidates?: { content?: AssistantContent }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
}

/** One generateContent call. Returns the model's turn untouched, so thought signatures survive the round trip. */
export async function generateTurn(systemInstruction: string, contents: AssistantContent[]): Promise<AssistantContent> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");
  const model = pickModel(Deno.env.get("GEMINI_MODEL") ?? undefined);

  const response = await fetch(`${GEMINI_URL}/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents,
      tools: ASSISTANT_TOOLS,
      generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
    }),
  });
  const data = (await response.json()) as GeminiResponse;

  if (response.status === 429) throw new Error("FREE_QUOTA");
  if (!response.ok) throw new Error(data.error?.message ?? `Gemini returned ${response.status}.`);
  if (data.promptFeedback?.blockReason) throw new Error("That message was blocked. Try rephrasing it.");
  const content = data.candidates?.[0]?.content;
  if (!content?.parts?.length) throw new Error("The assistant had no answer. Try asking another way.");
  return { role: "model", parts: content.parts };
}
