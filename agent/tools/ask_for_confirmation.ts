import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Ask the user for explicit confirmation before performing an important or irreversible action on a YouTube channel (upload, publish, delete, change settings, mass replies, etc.).",
  inputSchema: z.object({
    action: z.string().describe("Short description of the action you want to take"),
    reason: z.string().describe("Why confirmation is needed"),
    risk: z
      .enum(["low", "medium", "high"])
      .default("medium")
      .describe("How consequential the action is"),
  }),
  approval: true,
  async execute({ action, reason, risk }) {
    return {
      confirmed: true,
      action,
      reason,
      risk,
      message: `User confirmed the action: ${action}`,
    };
  },
});
