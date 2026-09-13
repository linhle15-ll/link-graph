import Anthropic from "@anthropic-ai/sdk";
import type { ZodType } from "zod";
import { getClient } from "./client.js";
import { config } from "../../config/index.js";
import { AppError } from "../../middleware/errorHandler.js";

/**
 * ai/index.ts is the ONLY module in this codebase that is allowed to call
 * the Anthropic SDK directly. Every AI-driven feature (summaries, edge
 * detection, edge scoring, the discussion chat) goes through the three
 * primitives below instead of building its own client/retry/parsing logic,
 * the same way every HTTP scrape goes through the one axios client in
 * scrappingService.ts instead of each caller instantiating its own.
 */

const DEFAULT_RETRIES = 2;
const RETRYABLE_STATUS = new Set([408, 409, 429, 500, 502, 503, 504]);

// centralized retry policy, mirroring the axios-retry setup in scrappingService.ts
const withRetry = async <T>(fn: () => Promise<T>): Promise<T> => {
  let attempt = 0;

  for (;;) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      const status =
        error instanceof Anthropic.APIError ? error.status : undefined;
      const retryable = status !== undefined && RETRYABLE_STATUS.has(status);

      if (!retryable || attempt > DEFAULT_RETRIES) {
        throw normalizeError(error);
      }

      console.log(`AI request retry #${attempt} after status ${status}`);
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
};

const normalizeError = (error: unknown): AppError => {
  if (error instanceof Anthropic.APIError) {
    console.error("AI provider error: ", error.status, error.message);
    return AppError.badRequest(`AI request failed: ${error.message}`);
  }
  console.error("Unknown AI error: ", error);
  return AppError.badRequest("AI request failed");
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * Plain-text completion — for summaries, free-form reasoning, anything
 * where the caller just wants prose back.
 */
export const complete = async (
  prompt: string,
  system?: string,
): Promise<string> => {
  const anthropic = getClient();

  const response = await withRetry(() =>
    anthropic.messages.create({
      model: config.ai.model,
      max_tokens: config.ai.maxTokens,
      ...(system ? { system } : {}),
      messages: [{ role: "user", content: prompt }],
    }),
  );

  const textBlock = response.content.find(
    (block: Anthropic.ContentBlock) => block.type === "text",
  );
  if (!textBlock || textBlock.type !== "text") {
    throw AppError.badRequest("AI response did not contain text");
  }

  return textBlock.text;
};

/**
 * Structured-output completion. Forces the model to answer via a tool call
 * (tool_choice) so the reply is guaranteed-shaped JSON rather than prose we
 * have to hope is parseable, then validates that JSON against a zod schema
 * before it ever reaches a caller. Callers never see raw model text.
 *
 * `inputSchema` is the JSON Schema shown to the model (defines the tool's
 * input shape). `schema` is the zod schema used to validate what comes
 * back. They describe the same shape in two different systems the SDK/
 * model needs (JSON Schema) vs. what we validate at runtime (zod) - keep
 * them in sync when you add a new structured call.
 */
export const completeJSON = async <T>(options: {
  prompt: string;
  system?: string;
  toolName: string;
  toolDescription: string;
  inputSchema: Anthropic.Tool["input_schema"];
  schema: ZodType<T>;
}): Promise<T> => {
  const anthropic = getClient();

  const response = await withRetry(() =>
    anthropic.messages.create({
      model: config.ai.model,
      max_tokens: config.ai.maxTokens,
      ...(options.system ? { system: options.system } : {}),
      messages: [{ role: "user", content: options.prompt }],
      tools: [
        {
          name: options.toolName,
          description: options.toolDescription,
          input_schema: options.inputSchema,
        },
      ],
      tool_choice: { type: "tool", name: options.toolName },
    }),
  );

  const toolUse = response.content.find(
    (block: Anthropic.ContentBlock) =>
      block.type === "tool_use" && block.name === options.toolName,
  );

  if (!toolUse || toolUse.type !== "tool_use") {
    throw AppError.badRequest(
      "AI did not return the expected structured output",
    );
  }

  const parsed = options.schema.safeParse(toolUse.input);
  if (!parsed.success) {
    console.error("AI structured output failed validation: ", parsed.error);
    throw AppError.badRequest("AI returned malformed structured output");
  }

  return parsed.data;
};

/**
 * Streaming completion for the interactive "discuss this connection" chat
 * (client/components/ai/chat.tsx). Yields text deltas as they arrive so a
 * controller can pipe them straight into an SSE response instead of making
 * the user wait for the full reply.
 */
export async function* streamChat(
  messages: ChatMessage[],
  system?: string,
): AsyncGenerator<string> {
  const anthropic = getClient();

  const stream = anthropic.messages.stream({
    model: config.ai.model,
    max_tokens: config.ai.maxTokens,
    ...(system ? { system } : {}),
    messages,
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
}
