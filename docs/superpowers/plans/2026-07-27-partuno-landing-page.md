# Partuno Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a polished, minimal Partuno pre-release page at `/partuno` that matches the portfolio and collects waitlist emails through Formspree.

**Architecture:** Use a server-rendered Next.js App Router page for metadata and layout, a focused client component for form state, and a pure submission helper for Formspree communication. Reuse the portfolio's existing `Container`, `SectionLabel`, `Button`, global design tokens, header, and footer. Keep the Formspree endpoint directly in the submission helper because it is a public form identifier, not a secret.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, native Fetch API, Formspree.

## Global Constraints

- Route must be exactly `/partuno`.
- Use the supplied Partuno logo at `public/images/partuno-logo.png`.
- Show `COMING SOON`, `Partuno`, and `From BOM to build-ready.`.
- Keep the first release limited to the landing page and waitlist form.
- Submit waitlist emails to `https://formspree.io/f/mwvgagrn`.
- Do not add a custom backend, database, authentication, dashboard, pricing, analytics, or supplier API calls.
- Match the existing portfolio's dark background, typography, cyan and blue accents, borders, spacing, responsive behavior, and reduced-motion behavior.
- Provide accessible labels, keyboard focus, and `aria-live` form feedback.

---

### Task 1: Formspree submission behavior

**Files:**
- Create: `src/components/partuno/submitPartunoWaitlist.ts`
- Create: `src/components/partuno/submitPartunoWaitlist.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `submitPartunoWaitlist(email: string, fetcher?: Fetcher): Promise<void>`
- Produces: `PARTUNO_FORMSPREE_ENDPOINT: string`

- [ ] Write failing tests for successful submission, blank email rejection, and unsuccessful Formspree responses.
- [ ] Run `node --experimental-strip-types --test src/components/partuno/submitPartunoWaitlist.test.ts` and verify the tests fail before implementation.
- [ ] Implement the minimal URL-encoded POST helper with `Accept: application/json`.
- [ ] Add `test:partuno` to `package.json` and verify all focused tests pass.

### Task 2: Accessible waitlist form

**Files:**
- Create: `src/components/partuno/PartunoWaitlistForm.tsx`

**Interfaces:**
- Consumes: `submitPartunoWaitlist(email: string): Promise<void>`
- Produces: `PartunoWaitlistForm(): JSX.Element`

- [ ] Implement `idle`, `submitting`, `success`, and `error` states.
- [ ] Require an email input, use `autoComplete="email"`, disable the action while submitting, clear the input after success, and announce feedback with `aria-live="polite"`.
- [ ] Reuse the shared `Button` component with its primary variant.

### Task 3: Partuno route and visual styling

**Files:**
- Create: `src/app/partuno/page.tsx`
- Create: `src/app/partuno/partuno.module.css`
- Create: `public/images/partuno-logo.png`

**Interfaces:**
- Consumes: `PartunoWaitlistForm`, `Container`, `SectionLabel`, and the supplied logo.
- Produces: Next.js route `/partuno` with route-specific metadata.

- [ ] Add route metadata, one semantic `h1`, the approved copy, capability labels, and the waitlist form.
- [ ] Build a responsive two-column hero using the existing global CSS variables and components.
- [ ] Store the supplied 613 by 613 PNG at `public/images/partuno-logo.png` and render it with `next/image`.

### Task 4: Verification

- [ ] Run `npm run test:partuno`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build` and confirm `/partuno` appears in the generated routes.
- [ ] Review the branch diff for unintended changes, secrets, or user data.
