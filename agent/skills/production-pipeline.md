# Production Pipeline (Writers + Videomakers Together)

Use this skill whenever the user wants a complete video package — not just a script or just a title.

Match the real REBOOTv2 handoff shape (see `production-handoff` skill).

## Mandatory sequence

### Step 0 — Lane + status
Confirm lane and whether this is:
- Full psychology package (LF + 3 Shorts + essay + packaging)
- System Glitch short only
- Course lesson package
- Research-only (stop before writing)

### Step 1 — Writer
- Psychology → `writer-psychology`
- Course → `writer-course`

Writer returns narration (and for psychology LF packages: sectioned long-form + 3 shorts + essay when requested).

### Step 2 — Production videomaker
Pass the exact script(s) to `videomaker-production`.

Returns scene plan, overlays, caption/QA, recording checklist, style notes (cyberpunk palette when System Glitch / illustrated psychology).

### Step 3 — Packaging videomaker
Pass script + production notes to `videomaker-packaging`.

Returns titles, thumbnail A/B concepts, description, tags, pinned comment, playlist recommendations, status block.

### Step 4 — Assemble
Main agent delivers **one** package using the production-handoff section order.
Include explicit production status:
`WRITING_COMPLETE | MEDIA_NOT_STARTED | PUBLICATION_HOLD | youtube_video_id: null`

## Collaboration rules

- Writers do not invent Studio packaging.
- Packaging does not rewrite spoken meaning.
- Production does not break banned-word or claim boundaries.
- No fake upload/schedule claims.
- Research-only work never drafts narration unless the user explicitly advances it.

## Short-circuit

- Script only → stop after writer
- Packaging only on existing script → start at packaging
- “Full package” / “complete handoff” → full pipeline + handoff structure
