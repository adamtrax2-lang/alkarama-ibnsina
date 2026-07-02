# AlKarama Ibn Sina Tourisme - Website Project

Client website build for a Tunisian travel agency. Built by Adam (Krateon), not a coder.

## Rules (hard)
- NEVER use em-dashes or en-dashes ("--", any dash-as-punctuation). Use periods, commas, parentheses. Adam hates them.
- Bilingual FR + EN. Everything visible must translate. Content strings live in `src/i18n.tsx`.
- Never invent prices or data. Use placeholders clearly flagged if real data is missing.
- Adam is token-conscious: batch changes, keep verification cheap (DOM checks, not screenshots), do not re-download/re-process assets that already exist in /public.
- Content (packages, prices, hotels, photos, text) must eventually be editable by the client via an admin panel, no code.

## Stack & run
- Vite + React + TypeScript + Tailwind v3. Node 24.
- Run: `npm run dev` (port 5173). Or double-click `Voir-Site-AlKarama.bat` on Adam's Desktop.
- Typecheck: `npx tsc --noEmit`.
- All content in `src/data.ts`; all text in `src/i18n.tsx`; components in `src/components/`.

## Current state + remaining work
See `HANDOFF.md` in this folder. Read it first.
