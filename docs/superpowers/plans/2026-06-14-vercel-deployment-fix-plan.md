# Vercel Serverless Deployment Fix - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix Vercel deployment by eliminating module-level crashes, correcting build configuration, and ensuring cross-platform compatibility while maintaining the local Express server for development.

**Architecture:** Keep local Express server (`server.ts`) for development. Use Vercel serverless functions in `api/` for production. Frontend is a Vite-built SPA served statically. Fireworks API client is lazily initialized to avoid build-time crashes.

**Tech Stack:** TypeScript, Vite, React, Express (local), Vercel Functions (production), OpenAI SDK (for Fireworks), rimraf

---

## File Structure Summary

| File | Action | Responsibility |
|------|--------|--------------|
| `api/_utils.ts` | Modify | Shared utilities, lazy API client initialization, CORS helpers, fallbacks |
| `api/chat.ts` | Modify | Serverless handler for chat endpoint, uses `getClient()` |
| `api/recommendation.ts` | Modify | Serverless handler for course recommendation, uses `getClient()` |
| `api/job-recommendation.ts` | Modify | Serverless handler for job recommendation, uses `getClient()` |
| `vercel.json` | Modify | Remove `buildCommand` to let Vercel auto-detect builders |
| `package.json` | Modify | Add `rimraf`, fix `clean` script for Windows compatibility |

---

### Task 1: Fix `api/_utils.ts` — Lazy API Client Initialization

**Files:**
- Modify: `api/_utils.ts`

**Context:** Currently, `api/_utils.ts` initializes `new OpenAI(...)` at the top level and throws immediately if `FIREWORKS_API_KEY` is missing. This causes Vercel builds to crash. We need to (1) remove the module-level throw, (2) use a fallback dummy key, (3) export a `getClient()` function that lazily creates the client, and (4) keep `isDummyKey` working.

- [ ] **Step 1: Read current `api/_utils.ts`**

Verify the current file has:
- `const apiKey = process.env.FIREWORKS_API_KEY;` (line ~11)
- `if (!apiKey) { throw new Error("FIREWORKS_API_KEY..."); }` (line ~12-14)
- `export const client = new OpenAI(...)` (line ~15-18)
- `export const isDummyKey = apiKey === "dummy_key_for_build";` (line ~20)

- [ ] **Step 2: Replace the top-level API key check and client initialization**

Find this block (lines 8-21):
```typescript
// Load environment variables
dotenv.config();

// Initialize Fireworks Client
const apiKey = process.env.FIREWORKS_API_KEY;
if (!apiKey) {
  throw new Error("FIREWORKS_API_KEY environment variable is required");
}
export const client = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://api.fireworks.ai/inference/v1",
});

export const isDummyKey = apiKey === "dummy_key_for_build";
```

Replace it with:
```typescript
// Load environment variables
dotenv.config();

// Initialize Fireworks Client (lazy-safe for Vercel builds)
const apiKey = process.env.FIREWORKS_API_KEY || "dummy_key_for_build";
export const isDummyKey = apiKey === "dummy_key_for_build";

let _client: OpenAI | null = null;

export const getClient = (): OpenAI => {
  if (!_client) {
    if (isDummyKey) {
      throw new Error("FIREWORKS_API_KEY environment variable is required for production API calls.");
    }
    _client = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://api.fireworks.ai/inference/v1",
    });
  }
  return _client;
};
```

- [ ] **Step 3: Verify the import at the top of the file still works**

Ensure the file still has `import OpenAI from 'openai';` at the top. No change needed there.

- [ ] **Step 4: Verify the rest of the file is unchanged**

The rest of `api/_utils.ts` (from `getTesdaGroundingContext` down to `setCorsHeaders`) should remain exactly as-is.

- [ ] **Step 5: Commit**

```bash
git add api/_utils.ts
git commit -m "fix: lazy-init Fireworks API client to prevent Vercel build crashes

Removes module-level throw when FIREWORKS_API_KEY is missing.
Uses a fallback dummy key at module load so Vercel can safely
import and build the api/_utils.ts module. The real error is now
thrown only when getClient() is called during a live request."
```

---

### Task 2: Fix `api/chat.ts` — Use `getClient()` Instead of `client`

**Files:**
- Modify: `api/chat.ts`

**Context:** The handler currently imports `client` from `_utils.ts` and uses `client.chat.completions.create()`. We need to change this to `getClient()`.

- [ ] **Step 1: Read current `api/chat.ts` imports**

Verify the current import line (line ~2-7):
```typescript
import {
  client,
  isDummyKey,
  getTesdaGroundingContext,
  setCorsHeaders
} from './_utils';
```

- [ ] **Step 2: Replace `client` with `getClient` in the import**

Replace the import block with:
```typescript
import {
  getClient,
  isDummyKey,
  getTesdaGroundingContext,
  setCorsHeaders
} from './_utils';
```

- [ ] **Step 3: Replace the API call from `client.chat.completions.create(...)` to `getClient().chat.completions.create(...)`**

Find the call (around line ~71):
```typescript
const response = await client.chat.completions.create({
```

Replace it with:
```typescript
const response = await getClient().chat.completions.create({
```

- [ ] **Step 4: Verify `isDummyKey` is still used correctly**

The `isDummyKey` check on line ~32 should still work correctly because it is exported from `_utils.ts` and was updated in Task 1 to use the fallback dummy key logic.

- [ ] **Step 5: Commit**

```bash
git add api/chat.ts
git commit -m "fix: update chat handler to use lazy getClient()"
```

---

### Task 3: Fix `api/recommendation.ts` — Use `getClient()` Instead of `client`

**Files:**
- Modify: `api/recommendation.ts`

**Context:** Same pattern as Task 2. The handler imports `client` and uses it for the API call.

- [ ] **Step 1: Read current `api/recommendation.ts` imports**

Verify the current import line (line ~2-8):
```typescript
import {
  client,
  isDummyKey,
  getTesdaGroundingContext,
  extractJsonFromText,
  FALLBACK_RECOMMENDATION,
  setCorsHeaders
} from './_utils';
```

- [ ] **Step 2: Replace `client` with `getClient` in the import**

Replace the import block with:
```typescript
import {
  getClient,
  isDummyKey,
  getTesdaGroundingContext,
  extractJsonFromText,
  FALLBACK_RECOMMENDATION,
  setCorsHeaders
} from './_utils';
```

- [ ] **Step 3: Replace the API call from `client.chat.completions.create(...)` to `getClient().chat.completions.create(...)`**

Find the call (around line ~84):
```typescript
const response = await client.chat.completions.create({
```

Replace it with:
```typescript
const response = await getClient().chat.completions.create({
```

- [ ] **Step 4: Commit**

```bash
git add api/recommendation.ts
git commit -m "fix: update recommendation handler to use lazy getClient()"
```

---

### Task 4: Fix `api/job-recommendation.ts` — Use `getClient()` Instead of `client`

**Files:**
- Modify: `api/job-recommendation.ts`

**Context:** Same pattern as Task 2 and 3.

- [ ] **Step 1: Read current `api/job-recommendation.ts` imports**

Verify the current import line (line ~2-10):
```typescript
import {
  client,
  isDummyKey,
  getTesdaGroundingContext,
  extractJsonFromText,
  FALLBACK_JOB_RECOMMENDATION,
  mapAiJobsToExistingData,
  PHILIPPINES_REGIONS,
  setCorsHeaders
} from './_utils';
```

- [ ] **Step 2: Replace `client` with `getClient` in the import**

Replace the import block with:
```typescript
import {
  getClient,
  isDummyKey,
  getTesdaGroundingContext,
  extractJsonFromText,
  FALLBACK_JOB_RECOMMENDATION,
  mapAiJobsToExistingData,
  PHILIPPINES_REGIONS,
  setCorsHeaders
} from './_utils';
```

- [ ] **Step 3: Replace the API call from `client.chat.completions.create(...)` to `getClient().chat.completions.create(...)`**

Find the call (around line ~89):
```typescript
const response = await client.chat.completions.create({
```

Replace it with:
```typescript
const response = await getClient().chat.completions.create({
```

- [ ] **Step 4: Commit**

```bash
git add api/job-recommendation.ts
git commit -m "fix: update job-recommendation handler to use lazy getClient()"
```

---

### Task 5: Fix `vercel.json` — Remove `buildCommand`

**Files:**
- Modify: `vercel.json`

**Context:** The `buildCommand` key overrides Vercel's auto-detection. Removing it allows Vercel to correctly use Vite for the frontend and `@vercel/node` for the `api/` directory.

- [ ] **Step 1: Read current `vercel.json`**

Current content:
```json
{
  "version": 2,
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

- [ ] **Step 2: Remove the `buildCommand` line**

Replace the entire file with:
```json
{
  "version": 2,
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "fix: remove explicit buildCommand from vercel.json

Allows Vercel to auto-detect Vite for frontend and @vercel/node
for serverless functions. The explicit buildCommand was overriding
the default pipeline and could cause API function build failures."
```

---

### Task 6: Fix `package.json` — Add `rimraf` and Fix `clean` Script

**Files:**
- Modify: `package.json`

**Context:** The `clean` script uses `rm -rf`, which fails on Windows. We need to add `rimraf` as a devDependency and update the script.

- [ ] **Step 1: Read current `package.json` scripts and devDependencies**

Current scripts:
```json
"scripts": {
  "dev": "tsx server.ts",
  "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
  "start": "node dist/server.cjs",
  "preview": "vite preview",
  "clean": "rm -rf dist server.js",
  "lint": "tsc --noEmit"
}
```

Current devDependencies (relevant):
```json
"devDependencies": {
  "@types/express": "^4.17.21",
  "@types/node": "^22.14.0",
  "@types/react": "^19.2.17",
  "@vercel/node": "^5.8.17",
  "autoprefixer": "^10.4.21",
  "esbuild": "^0.25.0",
  "tailwindcss": "^4.1.14",
  "tsx": "^4.21.0",
  "typescript": "~5.8.2",
  "vite": "^6.2.3"
}
```

- [ ] **Step 2: Add `rimraf` to `devDependencies`**

Add `"rimraf": "^5.0.5"` to `devDependencies`. The updated block should be:
```json
"devDependencies": {
  "@types/express": "^4.17.21",
  "@types/node": "^22.14.0",
  "@types/react": "^19.2.17",
  "@vercel/node": "^5.8.17",
  "autoprefixer": "^10.4.21",
  "esbuild": "^0.25.0",
  "rimraf": "^5.0.5",
  "tailwindcss": "^4.1.14",
  "tsx": "^4.21.0",
  "typescript": "~5.8.2",
  "vite": "^6.2.3"
}
```

- [ ] **Step 3: Update the `clean` script**

Replace `"clean": "rm -rf dist server.js"` with:
```json
"clean": "rimraf dist server.js"
```

The full updated scripts block should be:
```json
"scripts": {
  "dev": "tsx server.ts",
  "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
  "start": "node dist/server.cjs",
  "preview": "vite preview",
  "clean": "rimraf dist server.js",
  "lint": "tsc --noEmit"
}
```

- [ ] **Step 4: Install `rimraf`**

Run:
```bash
npm install rimraf --save-dev
```

Expected output: `rimraf` and its dependencies are added to `node_modules` and `package-lock.json` is updated.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "fix: replace rm -rf with rimraf for cross-platform clean script

Adds rimraf as a devDependency to ensure the 'clean' script works
on Windows, macOS, and Linux without shell-specific commands."
```

---

### Task 7: Verification — Local Build Test

**Files:**
- No file changes

- [ ] **Step 1: Verify TypeScript compiles without errors**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors. The `api/` files should compile successfully because `getClient()` is used correctly and the types are consistent.

- [ ] **Step 2: Verify the Vite frontend builds**

Run:
```bash
npm run build
```

Expected: The `dist/` directory is created with the Vite output. The `dist/server.cjs` file is also created by esbuild (for local Express use). No errors.

- [ ] **Step 3: Test the local Express server (optional but recommended)**

If you have a `.env.local` with `FIREWORKS_API_KEY` set, run:
```bash
npm run dev
```

Expected: Server starts on `http://localhost:3000`. The API endpoints (`/api/chat`, `/api/recommendation`, `/api/job-recommendation`) should work as before.

- [ ] **Step 4: Verify `clean` script works**

Run:
```bash
npm run clean
```

Expected: The `dist/` directory and `server.js` (if it exists) are removed without errors.

- [ ] **Step 5: Final sanity check — review all changes**

Run:
```bash
git log --oneline -10
```

Expected: 6 commits visible (one per task). Example:
```
abc1234 fix: replace rm -rf with rimraf for cross-platform clean script
abc1233 fix: remove explicit buildCommand from vercel.json
abc1232 fix: update job-recommendation handler to use lazy getClient()
abc1231 fix: update recommendation handler to use lazy getClient()
abc1230 fix: update chat handler to use lazy getClient()
abc123f fix: lazy-init Fireworks API client to prevent Vercel build crashes
```

---

## Post-Deployment Checklist (Manual)

After deploying to Vercel, perform these checks:

1. **Environment Variable Set:**
   - In the Vercel dashboard: Project → Settings → Environment Variables
   - Add `FIREWORKS_API_KEY` with your actual production key
   - Ensure the scope includes "Production" (and optionally "Preview")

2. **Deploy the Project:**
   - Push the commits to the connected Git repository (e.g., `git push origin main`)
   - Or run `vercel --prod` if deploying manually from the CLI

3. **Verify API Endpoints:**
   - Visit `https://<your-project>.vercel.app/api/chat`
   - Expected: `{"status":"ok","endpoint":"chat","env":"live"}`
   - Visit `https://<your-project>.vercel.app/api/recommendation`
   - Expected: `{"status":"ok","endpoint":"recommendation","env":"live"}`

4. **Verify Frontend:**
   - Visit `https://<your-project>.vercel.app/`
   - The landing page should load correctly
   - Complete the assessment wizard and verify that the recommendation API returns real AI-generated results (not just the fallback)

5. **Check Vercel Logs (if something fails):**
   - Vercel Dashboard → Deployments → [Latest] → Functions → select an API function → Logs
   - Look for any runtime errors from `getClient()` or the Fireworks API

---

## Spec Coverage Checklist

| Spec Requirement | Implementing Task(s) |
|------------------|----------------------|
| Fix module-level crash in `api/_utils.ts` | Task 1 |
| Export `getClient()` function | Task 1 |
| Keep `isDummyKey` working with fallback | Task 1 |
| Update `api/chat.ts` to use `getClient()` | Task 2 |
| Update `api/recommendation.ts` to use `getClient()` | Task 3 |
| Update `api/job-recommendation.ts` to use `getClient()` | Task 4 |
| Remove `buildCommand` from `vercel.json` | Task 5 |
| Fix `clean` script for Windows | Task 6 |
| Add `rimraf` as devDependency | Task 6 |
| Verify build succeeds | Task 7 |
| Document environment variable setup | Post-Deployment Checklist |

---

## Plan Self-Review

**1. Spec coverage:** All 4 design decisions (lazy init, vercel.json buildCommand, clean script, env var docs) are covered. ✅
**2. Placeholder scan:** No TBD, TODO, or vague instructions. Every step has exact code, file paths, and expected output. ✅
**3. Type consistency:** `getClient()` returns `OpenAI` (same type as the old `client` variable). All handlers use `.chat.completions.create()` on the result, so types are consistent. ✅
**4. DRY:** The lazy initialization pattern is defined once in `_utils.ts` and reused by all 3 handlers. ✅
