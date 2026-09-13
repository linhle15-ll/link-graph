import Anthropic from "@anthropic-ai/sdk";
import { config } from "../../config/index.js";
import { AppError } from "../../middleware/errorHandler.js";

let client: Anthropic | undefined;

/**
 * Construct the Anthropic client.
 *
 * Lazy on purpose: AI features are an optional, later phase of this project
 * (see PROJECT_IDEA.md - Phase 4). The server should still boot and serve
 * every non-AI route if AI_API_KEY is unset. The error only surfaces when
 * something actually tries to call the model.
 */
export const getClient = (): Anthropic => {
  if (!config.ai.apiKey) {
    throw AppError.badRequest(
      "AI features are not configured (missing AI_API_KEY)",
    );
  }

  if (!client) {
    client = new Anthropic({ apiKey: config.ai.apiKey });
  }

  return client;
};
