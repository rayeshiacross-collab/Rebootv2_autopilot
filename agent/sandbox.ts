import { defineSandbox } from "eve/sandbox";
import { VercelSandbox } from "eve/sandbox/vercel";
import { installAgentBrowser } from "@agent-browser/eve/sandbox";

// Reusable Vercel Sandbox snapshot with agent-browser (and Chromium) pre-installed,
// so every new session starts from a warm template.
export const environment = VercelSandbox.environment({
  prepare: async (sandbox) => {
    // installAgentBrowser only needs run(); the prepare-time sandbox has no
    // session id, so adapt it to the shape agent-browser expects.
    await installAgentBrowser({
      id: "prepare",
      run: (options) => sandbox.run(options),
    });
  },
});

export default defineSandbox(() =>
  environment.open({
    resources: { vcpus: 2 },
  }),
);
