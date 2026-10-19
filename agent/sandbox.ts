import { defineSandbox } from "eve/sandbox";
import { vercel } from "eve/sandbox/vercel";
import {
  agentBrowserRevalidationKey,
  installAgentBrowser,
} from "@agent-browser/eve/sandbox";

export default defineSandbox({
  backend: vercel({
    resources: { vcpus: 2 },
  }),
  revalidationKey: () => agentBrowserRevalidationKey(),
  async bootstrap({ use }) {
    const sandbox = await use();
    await installAgentBrowser(sandbox);
  },
});
