import { defineTool } from "eve";
import { z } from "zod";

export default defineTool({
  description:
    "Ask the user for explicit confirmation before performing an important or irreversible action on a YouTube channel (upload, publish, delete, change settings, mass replies, etc.).",
  parameters: z.object({
    action: z.string().describe("Short description of the action you want to take"),
    reason: z.string().describe("Why confirmation is needed"),
    risk: z
      .enum(["low", "medium", "high"])
      .default("medium")
      .describe("How consequential the action is"),
  }),
  approval: true,
  execute: async ({ action, reason, risk }) => {
    return {
      confirmed: true,
      action,
      reason,
      risk,
      message: `User confirmed the action: ${action}`,
    };
  },
});
