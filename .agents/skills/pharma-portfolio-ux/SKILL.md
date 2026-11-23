---
name: pharma-portfolio-ux
description: Design, review and improve the UX, accessibility, reading experience and Next.js performance of Harsh Mishra's B.Pharm learning portfolio.
---

# Pharma Portfolio UX

## Product goal

This is a pharmacy learning site and personal notebook, not a generic developer portfolio. The main user is a B.Pharm student with basic pharmacy knowledge who wants to understand a concept, revise it and test their understanding.

Design promise: **Understand first. Memorise later.**

## Design direction

- Calm editorial design, clear hierarchy, generous but purposeful whitespace.
- One accent colour, readable serif display headings and sans-serif body text.
- Prioritise content, diagrams and learning flow over decoration.
- Make light and dark themes equally readable.
- Keep primary navigation limited to major destinations. Do not add every utility or sub-feature to the navbar.
- Avoid skill bars, fake progress, stock capsule imagery, carousels, autoplay, parallax and unnecessary animation.

## Lesson UX

A lesson page should make the next action obvious and feel easy to scan:

1. Breadcrumb and subject context.
2. One clear H1, beginner-friendly summary and useful metadata.
3. “In one minute” summary near the top.
4. Main lesson in short sections: basic idea → definitions → how it works → example/diagram → pharmacy relevance → GPAT/NIPER takeaways.
5. A visible **Lesson quiz** at the end (normally 3–5 questions).
6. Revision actions and references.
7. Previous/next lesson and relevant follow-up links.

Keep reading width around 680–740px, body text around 17–18px and line height around 1.65–1.75. On mobile, keep diagrams readable with horizontal scrolling rather than shrinking labels to illegible sizes.

## Assessment UX

Present the assessment layers separately and label them clearly:

- Lesson quiz: attached to an individual lesson, immediate explanation and retry.
- Practice quiz: topic-wise, reusable question bank with filters and review.
- Mock test: timed mode, clear progress, result screen, subject breakdown and review incorrect.
- PYQs: only verified source-based previous-year questions. Generated items must say **Practice Questions — not official PYQs**.

Quiz requirements: keyboard access, visible focus, large touch targets, answer feedback announced with aria-live, clear selected/correct/incorrect states, no answer leak before submission in timed mode, retry/reset, and useful empty/error states.

## Performance and rendering

Default to static generation for stable learning content and articles. Use server components for data access and initial HTML, but avoid dynamic rendering and request-time server work when the content does not change per request.

- Pre-render lesson/article routes at build time using generateStaticParams or static route generation where possible.
- Keep filesystem/MDX parsing on the server/build side; do not ship it to the browser.
- Use client components only for genuine interactions: quiz state, search, filters, theme toggle, saved notes and progress.
- Keep client boundaries small; do not mark whole pages or layouts as client components just to support one interactive widget.
- Avoid unnecessary fetch calls or API round-trips when content is already available at build time.
- Use Link and Next.js client navigation for internal routes. Check whether latency comes from dynamic route rendering, large JS bundles, heavy client components, font/image payloads or cache misses before changing architecture.
- Do not force every route to static if it depends on per-user or request-specific data. Preserve correctness and privacy.
- Lazy-load below-the-fold media; use responsive image sizes and explicit dimensions to avoid layout shift.
- Measure before/after with build output, route classification, Lighthouse/Web Vitals and a real preview. Never claim speed improvements without measurements.

## Accessibility and responsive behaviour

Target WCAG 2.2 AA:
- Logical heading order and one H1 per page.
- Visible focus rings and complete keyboard navigation.
- Body text contrast at least 4.5:1; large text/UI contrast at least 3:1 in both themes.
- Touch targets ideally at least 44px.
- Meaningful alt text, semantic table headers and labelled controls.
- Respect prefers-reduced-motion.
- Avoid hover-only interactions.
- Test narrow mobile, tablet and desktop layouts.

## SEO and content integrity

- Unique page title, description, canonical URL and Open Graph/Twitter metadata.
- Canonical and og:url must point to the current page, not always the homepage.
- One H1; avoid repeating the title inside MDX.
- Use actual publication/update dates, not build timestamps.
- Preserve citations, scope caveats and “not official PYQs” labels.
- Never invent content counts, dates, test scores or research evidence.

## Workflow

Before changing code:
1. Inspect the current implementation and the real route structure.
2. State what is verified from code versus what needs visual/browser testing.
3. Identify the smallest change that solves the user problem.
4. Define mobile, desktop, light, dark, keyboard and loading/empty/error states.

After changing code:
1. Run lint, typecheck and production build where available.
2. Review route rendering output and bundle impact.
3. Verify internal navigation, accessibility and responsive layout in a preview.
4. Report exactly what was changed and tested. Do not claim visual QA or deployment without evidence.

## Acceptance checklist

- Does a beginner understand the first explanation without looking up jargon?
- Is the lesson scannable and readable on a phone?
- Is there a lesson quiz at the end?
- Are Practice Questions and PYQs clearly separated?
- Are stable pages pre-rendered where safe?
- Are client components limited to interactive islands?
- Are both themes, keyboard interaction and reduced motion handled?
- Are metadata, references and dates truthful?
- Are performance improvements measured rather than assumed?
