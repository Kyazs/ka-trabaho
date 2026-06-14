# Vercel Serverless Deployment Fix - Design Document

**Date:** 2026-06-14
**Project:** tesda-skills-to-jobs-matcher
**Approach:** A (Minimal Targeted Fixes)

---

## 1. Problem Statement

The current setup has critical issues that will prevent successful deployment to Vercel:

1. **Module-level crash in `api/_utils.ts`**: The OpenAI client is initialized at the top of the file and throws an error if `FIREWORKS_API_KEY` is missing. This causes Vercel's build process to crash during module resolution/pre-build, even before any API request is made.
2. **Overriding `buildCommand` in `vercel.json`**: The explicit `"buildCommand": "vite build"` may interfere with Vercel's native `@vercel/node` builder for the API functions.
3. **Windows-incompatible `clean` script**: Uses `rm -rf`, which is a Unix command and fails on Windows.
4. **Missing deployment documentation**: The `FIREWORKS_API_KEY` environment variable must be manually configured in the Vercel dashboard.

---

## 2. Goals

- Fix the critical deployment blocker (module-level crash).
- Ensure Vercel auto-builds both the frontend (Vite) and the API functions correctly.
- Maintain the local Express server (`server.ts`) for development.
- Ensure the Fireworks API key works correctly in production.
- Make the project cross-platform compatible for local development.

---

## 3. Architecture

```
Local Dev (Express)          Production (Vercel)
------------------           -------------------
server.ts (express)          ┌─────────────────┐
  ├── /api/chat              │ Vite Static SPA │  <- served from dist/
  ├── /api/recommendation    └─────────────────┘
  └── /api/job-recommendation         │
                                      │
                               ┌──────┴──────┐
                               │ Vercel      │
                               │ Functions   │  <- built by @vercel/node
                               │ (api/*.ts)  │
                               └─────────────┘
```

- **Frontend**: Vite-built SPA, served as static files from `dist/`.
- **API**: 3 serverless functions in `api/` (chat, recommendation, job-recommendation).
- **Local dev**: `server.ts` (Express) continues to work unchanged.
- **Production**: Vercel handles the frontend and API functions via auto-detected builders.

---

## 4. Design Decisions

### 4.1 Lazy Initialization of API Client (Critical Fix)

**Rationale:** Vercel's serverless environment evaluates modules during the build and cold-start phases. A top-level `throw` in a module causes the entire build or function invocation to fail. Moving the client initialization into a lazy getter ensures that the module can be safely imported without the `FIREWORKS_API_KEY` being present at build time. The error will only be thrown when a request is actually made and the key is missing.

**Implementation:**
- In `api/_utils.ts`, remove the module-level `throw` on missing `FIREWORKS_API_KEY`. Set `apiKey` to `"dummy_key_for_build"` as a fallback if the env var is missing.
- Keep `isDummyKey` as a top-level boolean (`export const isDummyKey = apiKey === "dummy_key_for_build"`), which will be `true` when the key is missing.
- Replace the top-level `const client = new OpenAI(...)` with a `getClient()` function.
- The `getClient()` function checks for the environment variable and throws only if it's missing/dummy and an actual request is in progress.
- Update all API handlers (`api/chat.ts`, `api/recommendation.ts`, `api/job-recommendation.ts`) to call `getClient()` instead of using the top-level `client` variable.

### 4.2 Fix `vercel.json` Build Configuration

**Rationale:** Vercel natively supports Vite for the frontend and `@vercel/node` for the `api/` directory. By explicitly setting `buildCommand: "vite build"`, we risk overriding the default build pipeline that handles both frontend and API functions. Removing it allows Vercel to auto-detect and use the correct builders for each part of the project.

**Implementation:**
- Remove the `buildCommand` key from `vercel.json`.
- Keep `outputDirectory`, `framework`, and `rewrites` as they are correct.

### 4.3 Fix Windows-incompatible `clean` Script

**Rationale:** The `rm -rf` command is specific to Unix-like shells. Developers on Windows will encounter an error when running `npm run clean`. Using a cross-platform solution ensures the project is accessible to all developers.

**Implementation:**
- Replace `"clean": "rm -rf dist server.js"` with `"clean": "rimraf dist server.js"`.
- Add `rimraf` as a devDependency (cross-platform file removal utility).

### 4.4 Environment Variable Documentation

**Rationale:** The `FIREWORKS_API_KEY` is a production secret. It must be set in the Vercel dashboard and not committed to the repository. Clear documentation prevents deployment misconfigurations.

**Implementation:**
- Add a section to the project documentation (e.g., README or a new `DEPLOYMENT.md`) detailing how to set the `FIREWORKS_API_KEY` in the Vercel dashboard.
- Document the required scopes: Production (and optionally Preview/Development).

---

## 5. Files to Modify

| File | Change Type | Description |
|------|-------------|-------------|
| `api/_utils.ts` | Modify | Refactor OpenAI client to use lazy initialization via `getClient()`. |
| `api/chat.ts` | Modify | Import and use `getClient()` instead of the `client` variable. |
| `api/recommendation.ts` | Modify | Import and use `getClient()` instead of the `client` variable. |
| `api/job-recommendation.ts` | Modify | Import and use `getClient()` instead of the `client` variable. |
| `vercel.json` | Modify | Remove the `buildCommand` key. |
| `package.json` | Modify | Fix the `clean` script for Windows compatibility. |

---

## 6. Validation Plan

1. **Pre-deploy Check**:
   - Run `npx vercel build` locally to verify that both the frontend and the API functions compile without errors.
2. **Post-deploy Check**:
   - Hit `GET /api/chat` and `GET /api/recommendation`.
   - Expected response: `{ status: "ok", endpoint: "chat", env: "live" }` (or similar, confirming the key is detected).
3. **Functional Check**:
   - Submit a test assessment profile via the frontend.
   - Verify that the API returns a valid recommendation and not a fallback or error.

---

## 7. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| The `api/` functions import `../src/data/tesdaData.ts`. | Verified that `tesdaData.ts` is a pure data file with no frontend or runtime dependencies. This import is safe for Vercel's build process. |
| `getClient()` introduces a slight runtime overhead. | Negligible. The function is simple and the client object is cached after the first call. |
| `rimraf` adds a new dev dependency. | It is a standard, lightweight, and widely-used package for cross-platform file removal. |

---

## 8. Out of Scope

- Restructuring the `api/` directory or the data file locations (Approach B).
- Removing the local Express server (Approach C).
- Changing the API logic or the AI prompt engineering.
- Adding automated CI/CD pipelines (GitHub Actions, etc.).
