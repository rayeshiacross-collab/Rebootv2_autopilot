import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Videomaker specialist for production direction: scene plans, shot lists, on-screen text timing, caption/QA notes, visual style, and recording checklists.",
  model: "spacexai/grok-build-0.1",
});
