# Production Pipeline (Writers + Videomakers Together)

Use this skill whenever the user wants a complete video package — not just a script or just a title.

## Mandatory sequence

Run these steps in order. Do not skip or reorder.

### Step 1 — Route the lane
Confirm which lane:
1. Rebootv2 Psychology
2. Python Course
3. AI Automation Course

### Step 2 — Writer
Delegate to the matching writer:
- Psychology → `writer-psychology`
- Python or AI Automation → `writer-course`

Writer returns: full spoken script + word count + any critical visual notes.

### Step 3 — Production videomaker
Pass the **exact script** from Step 2 to `videomaker-production`.

Production returns:
- Scene plan (beat → visual → timing)
- On-screen text / overlays
- Caption & QA notes
- Recording checklist
- Lane-specific style notes

### Step 4 — Packaging videomaker
Pass **script + production notes** to `videomaker-packaging`.

Packaging returns:
- Primary title + alternates
- Thumbnail text (3–4 words)
- Full description (hook, body, chapters if any, disclaimer, tags)
- Pinned diagnostic comment
- End-screen / related video suggestion when a series exists

### Step 5 — Assemble for the user
Present one clean package in this order:

1. Script (from writer)
2. Production plan (from production)
3. Studio packaging (from packaging)
4. Ready-to-record checklist summary

## Collaboration rules

- Writers do not invent titles or thumbnail text.
- Packaging does not rewrite the script’s meaning.
- Production does not change banned-word policy or lane voice.
- If any specialist’s output conflicts with lane rules, fix it before delivering.
- Always show the user the combined package, not three disconnected dumps.

## Short-circuit

If the user only asks for a script, stop after Step 2.
If they only ask for titles/thumbnails on an existing script, start at Step 4.
If they ask for “full package,” “ready to film,” or “everything,” run the full pipeline.
