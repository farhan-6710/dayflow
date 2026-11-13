import { FunctionsHttpError } from "@supabase/supabase-js";

import { supabase } from "@/services/supabaseClient";
import type { AssistantContent, AssistantContext } from "@/shared/types/assistant";

const FUNCTION_NAME = "assistant";

type AssistantReply = { ok: true; content: AssistantContent } | { ok: false; error: string };

/** One model turn from the `assistant` Edge Function. supabase-js sends the user's session token. */
export async function requestAssistantTurn(contents: AssistantContent[], context: AssistantContext): Promise<AssistantContent> {
  const { data, error } = await supabase.functions.invoke<AssistantReply>(FUNCTION_NAME, { body: { contents, context } });

  if (error) {
    const body = error instanceof FunctionsHttpError ? ((await error.context.json().catch(() => null)) as AssistantReply | null) : null;
    throw new Error(body && !body.ok ? body.error : "The assistant is unavailable right now.");
  }
  if (!data) throw new Error("The assistant is unavailable right now.");
  if (!data.ok) throw new Error(data.error);
  return data.content;
}
