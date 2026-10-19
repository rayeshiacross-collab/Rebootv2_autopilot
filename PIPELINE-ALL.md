# REBOOTv2 Production Pipeline — All Versions

Three deployable versions of the same writer → production → packaging pipeline.

| Version | Repo | Storage | Free tier highlight |
|---------|------|---------|---------------------|
| **AWS Lambda** | [rebootv2-lambda-pipeline](https://github.com/rayeshiacross-collab/rebootv2-lambda-pipeline) | S3 | 1M requests/month |
| **Cloudflare Workers** | [rebootv2-workers-pipeline](https://github.com/rayeshiacross-collab/rebootv2-workers-pipeline) | R2 | 100k requests/day, commercial OK |
| **Vercel Edge** | [Rebootv2_autopilot](https://github.com/rayeshiacross-collab/Rebootv2_autopilot) (`app/api/generate/route.ts`) | Vercel Blob | Integrated with existing app |

## Shared request body

```json
{
  "channel": "psychology",
  "topic": "Why people stay in bad habits",
  "lane": "system-glitch",
  "style_notes": "optional",
  "steps": "full"
}
```

`steps`: `"writer"` | `"production"` | `"packaging"` | `"full"`

`channel`: `"psychology"` | `"course"` | `"high-thoughts"`

## Quick deploy pointers

### Lambda
```bash
git clone https://github.com/rayeshiacross-collab/rebootv2-lambda-pipeline.git
# Follow README.md (S3 + IAM + Lambda + optional API Gateway + EventBridge)
```

### Workers
```bash
git clone https://github.com/rayeshiacross-collab/rebootv2-workers-pipeline.git
cd rebootv2-workers-pipeline
npm install
npx wrangler r2 bucket create rebootv2-packages
npx wrangler secret put OPENROUTER_API_KEY
npx wrangler deploy
```

### Vercel (already in Rebootv2_autopilot)
1. Set `OPENROUTER_API_KEY` (or `DEEPSEEK_API_KEY`) and `BLOB_READ_WRITE_TOKEN` in Vercel project settings. Optional: `OPENROUTER_MODEL` (default `deepseek/deepseek-chat`) or `DEEPSEEK_MODEL` (default `deepseek-chat`).
2. Redeploy.
3. Endpoint: `POST /api/generate`

## Test (replace URL)
```bash
curl -X POST https://YOUR_URL/generate \
  -H "Content-Type: application/json" \
  -d '{"channel":"psychology","topic":"Why people stay in bad habits","steps":"full"}'
```
