# Partuno Landing Page Design

## Goal

Add a minimal pre-release landing page at `https://jpmarhefka.com/partuno` inside the existing Next.js portfolio. The page should explain Partuno at a high level and collect early-access emails without adding a custom backend or database.

## Scope

The first release includes:

- A single `/partuno` route
- The supplied Partuno logo
- A clear `COMING SOON` label
- The headline `From BOM to build-ready.`
- A short product description
- Three capability labels: BOM analysis, component matching, and supplier and pricing research
- One email waitlist form
- Success and error feedback
- Responsive styling that reuses the portfolio's current visual system

The release excludes authentication, a dashboard, product demos, pricing, supplier API calls, analytics, and a separate Partuno deployment.

## Architecture

Create the page within the existing Next.js App Router project:

```text
src/app/partuno/page.tsx
src/app/partuno/partuno.module.css
src/components/partuno/PartunoWaitlistForm.tsx
public/images/partuno-logo.png
```

The root layout continues to provide the existing portfolio header and footer. The page uses `next/image` for the logo and a small client component only for form submission state.

## Page Layout

The page is a centered, compact product introduction with two responsive columns on larger screens and a single column on mobile.

The primary content order is:

1. Partuno logo
2. `COMING SOON` status label
3. `Partuno` product name
4. `From BOM to build-ready.` headline
5. Short description: `Partuno is a procurement and design assistant that helps engineers analyze BOMs, match components, and research supplier options in one workflow.`
6. Capability labels
7. Early-access email form
8. Small note: `Partuno is currently in development.`

The page reuses the site's existing dark background, typography, cyan and blue accents, borders, spacing conventions, and reduced-motion behavior. It should not introduce a separate design system.

## Waitlist Form

Formspree handles submissions. The client posts to the endpoint supplied through the public environment variable:

```text
NEXT_PUBLIC_PARTUNO_FORMSPREE_ENDPOINT
```

The production value will use the full Formspree endpoint created for the Partuno waitlist. The endpoint is deployment configuration and is not committed to the repository.

Form behavior:

- Require a syntactically valid email address
- Disable the submit button while sending
- Button text changes from `Join the Waitlist` to `Joining...`
- On success, replace the form feedback with `You're on the list.` and clear the field
- On failure, show `Something went wrong. Please try again.`
- If the endpoint is not configured, disable submission and show `Waitlist signups are not available yet.`
- Include an accessible label and `aria-live` status feedback

No email addresses are stored in the portfolio repository or application runtime.

## Metadata

The route metadata is:

- Title: `Partuno | Coming Soon`
- Description: `Partuno is a procurement and design assistant for BOM analysis, component matching, and supplier research.`

## Error Handling

The form treats non-successful Formspree responses and network failures as submission failures. The page itself remains usable when Formspree is unavailable. No stack traces, endpoint details, or user-entered data appear in error messages.

## Testing

Before merge:

- Run the repository lint command
- Run a production build
- Confirm `/partuno` renders at desktop and mobile widths
- Confirm the logo preserves its aspect ratio
- Confirm empty and malformed emails cannot be submitted
- Confirm successful Formspree submission displays the success state
- Confirm failed submission displays the error state and allows retrying
- Confirm keyboard focus and visible labels work correctly
- Confirm the page still renders with the Formspree environment variable missing

## Deployment

The page ships through the portfolio's existing deployment. Before enabling live submissions, create the Partuno form in Formspree and add `NEXT_PUBLIC_PARTUNO_FORMSPREE_ENDPOINT` to the portfolio project's production environment variables. No DNS or hosting changes are required.
