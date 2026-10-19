# grok — YouTube Channel Agent

Eve agent specialized for running and growing YouTube channels.

It can research topics, write scripts, generate titles & descriptions, design thumbnail concepts, plan Shorts, review analytics, and build content calendars. Sensitive actions always require your confirmation.

## Quick start

```bash
pnpm install
eve dev          # local TUI
# or open the web chat after deploy
eve deploy
```

## What it can do

| Skill | Use it for |
|-------|------------|
| Content | Full scripts, titles, descriptions, tags, chapters |
| Research | Competitor analysis, topic & search research |
| Thumbnails | Concepts + A/B test plans |
| Shorts | Vertical short-form scripts & hooks |
| Analytics | CTR / retention diagnosis & next actions |
| Series | Content pillars & multi-week calendars |

## Prompt library (copy-paste)

### Research & ideas
```
Research the top videos for "[topic]" on YouTube. Summarize what is working and give me 5 fresh video ideas with working titles.
```

```
Analyze these competitor channels: [list]. What content gaps can I own?
```

### Long-form video
```
Write a complete 10–12 minute script on "[topic]". Include a strong hook, clear sections, visual notes, and a CTA. Then give me 8 title options, a full description with chapters, and tags.
```

```
Turn this outline into a spoken script + packaging (titles, description, tags, thumbnail concepts):
[paste outline]
```

### Thumbnails
```
Give me 5 thumbnail concepts for this video: "[title/topic]". Include exact text overlay, visual idea, and which 2 I should A/B test first.
```

### Shorts
```
Create 3 YouTube Shorts scripts (20–40 seconds each) about "[topic]". Include spoken words, on-screen text, and a hook in the first 2 seconds.
```

```
Pull 3 Shorts ideas from this long-form video script:
[paste script]
```

### Analytics
```
Here are my numbers for the last video:
- Impressions: 
- CTR: 
- Average view duration / retention: 
- Top traffic sources: 
What is the biggest problem and what should I change next?
```

### Planning
```
Build a 4-week content calendar for my channel about "[niche]". Mix long-form and Shorts. Include working titles and the content pillar each video belongs to.
```

```
Design a 8-episode series on "[theme]". Give series name, episode titles, and the format for each episode.
```

## Safety

- The agent will **not** upload, publish, delete, or change channel settings without calling the confirmation tool first.

## Project structure (relevant parts)

```
agent/
├── agent.ts
├── instructions.md          # YouTube-focused system prompt
├── sandbox.ts               # Pre-installs Chromium + agent-browser
├── tools/ask_for_confirmation.ts
└── skills/
    ├── youtube-content.md
    ├── youtube-research.md
    ├── youtube-thumbnails.md
    ├── youtube-shorts.md
    ├── youtube-analytics.md
    └── youtube-series.md
```

## Browser tools (temporarily disabled)

`@agent-browser/eve` 0.39.1 (latest release) was built against eve 0.57 and uses a tool
contract (v44) that eve 0.66 has dropped, so mounting it fails `eve build` with
`Selected module binding "extensions/browser.ts" has no compile or runtime usage`.
The mount was removed until a compatible release ships. The sandbox still pre-installs
agent-browser + Chromium. To restore, recreate `agent/extensions/browser.ts`:

```ts
import browser from "@agent-browser/eve";

export default browser({
  allowedDomains: [
    "youtube.com", "*.youtube.com", "youtu.be", "studio.youtube.com",
    "*.studio.youtube.com", "google.com", "*.google.com",
    "accounts.google.com", "www.googleapis.com",
  ],
  maxOutputChars: 60_000,
  contentBoundaries: true,
  inlineScreenshots: true,
});
```

## Deploy

```bash
eve deploy
```

See the [eve deployment docs](https://eve.dev/docs/guides/deployment/vercel) for environment variables and authentication.
