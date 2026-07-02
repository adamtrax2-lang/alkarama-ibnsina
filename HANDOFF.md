# HANDOFF - AlKarama Ibn Sina Tourisme website

Read this to continue the build without re-reading the old chat.

## The deal
- Client: owner of AlKarama Ibn Sina Tourisme, a travel agency in Tunis, Tunisia.
- Price: 2000 TND total = 1150 (frontend) + 850 (backend/admin panel client can self-edit).
- Client saw a Lovable demo and liked it. We build custom React (free hosting, own admin panel, no monthly fee).
- Design inspired by elitemasar.com (layout only, NOT a copycat). Saved copy: `D:\EliteMasar Travel Agency (25_06_2026 14_34_09).html`.

## Business info (real, in src/data.ts)
- Name: AlKarama Ibn Sina Tourisme. Tagline: "Une autre approche pour faire du tourisme".
- Phones: 93 996 300 and 90 007 555. WhatsApp intl: 21693996300.
- Address: Carrefour Market Avicenne, Centre Commercial Lawand Ibn Sina, Tunis 2066.
- Rating: 5.0 from 15 Google reviews.
- Facebook link set. Instagram: https://www.instagram.com/alkarama.ibnsina.agency/ (real, confirmed by Adam).

## Brand
- Colors: gold #C9A227, charcoal #222, cream #FAF8F3 (in tailwind.config.js).
- Logo in nav is TEXT only ("ALKARAMA" + "TOURISME · IBN SINA"). Client hated the logo image and the "A" box. Do not add an image logo unless Adam sends a clean white one.
- Fonts: Playfair Display (headings), Poppins (body).

## Services (4)
1. Omra & Hajj (partner: Al Morchidoun / المرشدون)
2. Hotels & Sejours
3. Visas (Pays Arabes, Europe/Schengen, Arabie Saoudite)
4. Billets avion et bateau (flight + ferry)

## Mobile
- Hero's offer card (the small box with badge/price/book button) was completely hidden below `lg` breakpoint (`hidden lg:block`) - invisible on phones. Fixed: now shown on all sizes, stacked below the headline on mobile, smaller image/padding on small screens. Section height changed from fixed `h-screen` to `min-h-screen` (mobile can grow if content is taller than the viewport) while staying `lg:h-screen` (exact one-viewport hero unchanged on desktop). Partner logo band flows normally after the content on mobile instead of being absolutely pinned to the bottom, to avoid overlap risk.

## Homepage (built, in order)
Hero (4 rotating service slides, Ken Burns zoom, side offer card with urgency -> WhatsApp, white partner logos overlaid at bottom) -> Omra (3 packages Essentiel/Confort/VIP, VIP highlighted gold "Le + choisi", prices for 4/3/2 people per room) -> Hotels (3 cards Tunisie/Mecque/Istanbul, hover-zoom photo, overlay stars+name+location+price, green Reserver corner) -> Visas (3 package cards with "Inclus dans votre dossier" bullets + Demander le visa) -> Billets (2 image cards plane+ferry, green Book now) -> WhyUs -> Reviews (3 Google 5-star) -> Contact (Google map + WhatsApp) -> Footer.
- Nav: Accueil, Omra & Hajj, Hotels, Visas, Billets + green "Contactez-nous" button -> WhatsApp. Transparent glass on scroll.
- Social rail on RIGHT side, brand colors (FB blue, IG gradient, WhatsApp green). Chatbot icon/mock window REMOVED entirely per Adam ahead of the client demo (was previously a visual-only preview, no real bot) - `Icon.chat` and all `chat.*` i18n keys deleted too.
- All CTAs go to WhatsApp with a prefilled message.

## Real content captured
- Umrah: real flyer data now in src/data.ts. `umrahPacks` (3 featured, shown on homepage): Essentiel + VIP (both dates 20/23/27 juil + 3/6/10 aout, same 2 hotel tiers: Ramada 4*/Arkan Al Manar and Abraj Al Safwa 5*/Arkan Al Manar) + Mawlid Ennabaoui (25 aout, Manarat Ghazah 4*/Arkan Al Manar, cheapest of 7 tiers for that date). `umrahMoreDepartures` (6 more real hotel tiers for 25 aout, not displayed anywhere yet, waiting on the "Decouvrir tout" full listing page). Adam picked the 2-normal-plus-1-VIP homepage layout and confirmed grouping same-price dates under one card with a date badge instead of duplicating cards.
- Real hotels: Four Seasons Hotel Tunis (Gammarth, 1550 DT), Makkah Clock Royal Tower Fairmont (630 DT), Swissotel The Bosphorus Istanbul (915 DT). Real photos in public/hotels/.
- Real reviews (3, from Google): Essaim Ben Chorod, Chaib Amna, Rafia Temimi. In src/data.ts reviews.
- Real Instagram: https://www.instagram.com/alkarama.ibnsina.agency/
- Hero background/card images updated with real photos: Omra/Hajj slide background = hajj.png (small offer card keeps old mecca.jpg), Visas slide background = vienna-austria.jpg, small offer card = visas-france.jpg (Schengen offer). Homepage Visas section "Pays Arabes" card image = dubai.png. `HeroSlide` type now has an optional `cardImg` separate from the main background `img`.
- Egypt packages (spreadsheet `D:\doc site web.xlsx`): Cairo-Sharm 3990 DT, Cairo-Alexandria 2790 DT. Turkey packages (Istanbul/Antalya). Visa country lists. Not all surfaced on homepage yet.
- Partner logos (white PNG in public/partners/): Saudi Tourism, Al Morchidoun, Inspiring Tunisia, IATA, Go Turkiye. Amadeus = text wordmark only (no logo file). Source logos on `D:\` (IATA logo.PNG, saudi tourism authoirty logo.PNG, inspiring tunia logo.PNG, go turkey logo.PNG). Whitening script pattern: Pillow, corner-detect bg (white/black/transparent), recolor to white, alpha threshold.

## Routing (built)
- react-router-dom, `BrowserRouter`. Routes: `/` (HomePage, all sections), `/omra` (full Omra/Hajj listing, 9 packs), `/hotels` (full hotel listing, current 3 + "more on request" note), `/visas` (full detail per visa category incl. country lists), `/reserver-billet` (ticket booking form, reads `?type=avion|bateau`).
- SPA fallback configs added for whichever host is picked later: `public/_redirects` (Netlify) and `vercel.json` (Vercel).
- Nav links use `to="/#omra"` style (react-router Link); `HomePage.tsx` scroll-to-hash on mount/hash change so cross-page anchor nav works. `App.tsx` has a `ScrollToTop` on route change (skipped when there's a hash).
- "Decouvrir tout" (`DiscoverAll` in Sections.tsx) is now a filled pill button (was plain text link) linking to the real pages above.
- Reusable card components extracted for reuse between homepage teasers and full pages: `OmraPackCard`, `HotelCard` (both exported from Sections.tsx).

## Ticket booking form (built, mailto only - Adam rejected Formspree)
- `/reserver-billet` collects only: type (avion/bateau), name, phone, destination, depart date, return date (optional), people count, notes (optional). No fictional fields per Adam's "minimum info, rest by phone" instruction.
- Originally built against Formspree (free form-to-email relay) with a mailto fallback. Adam rejected using any third-party tool ("we don't want any additional tools"), so Formspree was removed entirely. It now ALWAYS opens the visitor's own email app via `mailto:` to `bookingEmail` (placeholder in `src/data.ts`, needs Adam's real address) with the form fields pre-filled in the body.
- IMPORTANT tradeoff Adam should understand: a static site with no backend cannot silently deliver an email by itself; it can only ask something else to do it (a form relay service, or a backend). `mailto:` is the zero-account option, but it is NOT silent: it opens the visitor's own email app and THEY must click send there (can fail quietly if they have no mail app configured, common on Android). A truly silent "just lands in the inbox" experience needs either a form relay service (Formspree/EmailJS, which Adam declined) or a real backend email sender (Supabase Edge Function + an email API like Resend) - that's part of the PENDING backend phase below, not built yet.
- Booking page banner is dynamic: crossfades between the plane and ferry photo depending on the selected ticket type, plus a subtle Ken Burns zoom (same treatment now applied to all `PageBanner` instances: Omra/Hotels/Visas pages too) so it reads less like a generic stock photo.
- Billets section cards and the Hero billets-slide CTA link here instead of opening WhatsApp directly (`HeroSlide.card.formLink` field added for that special case).

## Hotels search (built, basic/preview - real system integration is future work)
- `/hotels` has a search bar (destination text, check-in/out dates, people count). Destination filters the 3 real hotels client-side (genuinely works). Dates/people are NOT filtered against anything real (no availability data exists) - they're collected and relayed via the WhatsApp CTA message instead of pretending to check live availability.
- Clearly labelled to the visitor as "real-time availability coming soon." Adam's plan: once backend work starts, wire this to whatever booking system the client already uses so it shows real availability - noted as pending below.

## Pre-deploy fixes (2026-07-02, verified via actual screenshots, not just code review)
- Hotels page search bar had a `-mt-24` negative margin meant to overlap the banner photo, but it actually overlapped the banner's title/subtitle text, breaking the design. Removed the overlap trick; search bar now sits in normal flow below the banner.
- Booking form (`/reserver-billet`): submit handler used `window.location.href = "mailto:..."`, which in some browsers triggers a visible page reload/reset before the "almost done" confirmation can show (confirmed via testing). Fixed by triggering the mailto via a throwaway `<a>` element's `.click()` instead, which doesn't reload the page.
- `vite.config.ts` now reads `server.port` from `process.env.PORT` (falls back to 5173) so the preview tooling's auto-port assignment actually lands where Vite listens - fixes flaky screenshot/preview tool from earlier sessions. Doesn't affect Adam's normal `npm run dev` (still defaults to 5173).
- Confirmed via screenshots at 390px (mobile) and 1440px (desktop): hero offer card now visible and correctly stacked on mobile, hotels search bar and results grid render cleanly at both sizes, chatbot icon is gone, all internal routes (`/`, `/omra`, `/hotels`, `/visas`, `/reserver-billet`) load without console errors, and every `<a href>` on every page was enumerated and checked (no dead/empty hrefs).
- `npm run build` (the command Vercel will run) verified to succeed cleanly.

## PENDING - frontend
- Amadeus logo missing (text only). Adam to provide or leave as text.
- Background photo for the homepage Omra packs section (dark charcoal section): Adam said he'd send a separate photo for this, not yet received.
- Hotels full listing page only shows the current 3 real hotels (Adam confirmed this is fine for now); add more when he sends real data.
- Hotel search is a client-side filter only; Adam wants it eventually wired to his real hotel booking/availability system (unspecified which one yet) - ask him which system when that phase starts.
- A "Nos Services" page (nav item planned) - not built yet.

## Deployment
- Deploying frontend-only today via Vercel (backend/Supabase not started yet, so this is static content from src/data.ts - client can't self-edit until the 850 phase).
- No git repo in this folder yet (`git init` not run). Fastest path without git: `npx vercel --prod` from the project root, which uploads the local build directly - no GitHub needed. `vercel.json` (SPA rewrite) already in place for the React Router routes.
- Recommended: separate Vercel account (or at least a separate Team) from Adam's personal one - keeps usage/limits and ownership separate, and makes it easy to hand off access to the client later if ever needed.
- Heads up on Vercel's free "Hobby" tier: its terms are technically for personal/non-commercial use. Using it to host a paid client's site is extremely common among freelancers and low risk for a small low-traffic site like this, but it is not strictly "by the book." If Adam wants to be fully compliant, Cloudflare Pages' free tier explicitly allows commercial use, or Vercel Pro (~$20/mo) is the sanctioned commercial option. Charging the client an ongoing "hosting/maintenance" fee while the underlying platform costs Adam nothing is normal agency practice either way - not an issue by itself.
- After deploy: connect Adam's purchased domain in the Vercel project's Domains settings (standard DNS/CNAME step).

## Backend admin panel (DEMO built 2026-07-02, local-first)
- Goal for the client meeting: a working, clickable admin panel that proves he can self-edit packs/dates/prices with no code. Built local-first (saves in the browser) so it needs zero accounts and demos instantly. The database swap is a later, isolated change.
- Data layer is isolated in `src/store.tsx` (`ContentProvider` + `useContent()`). Today it seeds from `src/data.ts` (the defaults) and persists edits to `localStorage` (key `alkarama_content_v1`). ONLY three functions in that file (loadContent / save / reset) touch storage. Swapping to Supabase = rewrite those three to async DB calls; the admin UI and the public site do NOT change.
- Store currently manages: `umrahPacks`, `umrahMoreDepartures`, `hotels`, `business`. Public consumers now read from the store: `Sections.tsx` (Omra, Hotels, Reviews, Contact, Footer), `OmraPage`, `HotelsPage`. Everything else (visas, hero, reviews text, whyUs, billets, `wa()` WhatsApp links) still reads static from `src/data.ts` (not yet client-editable). Note: `wa()` deep links keep the fixed `business.phoneIntl` even if the phone is edited in the panel, wire that up when needed.
- Admin at `/admin` (App.tsx renders it as a standalone shell: no public navbar/footer/social rail). `src/pages/AdminPage.tsx`. Tabs: Formules Omra (accueil) / Autres departs / Hotels / Coordonnees. Full add/edit/delete of packs (bilingual name, dates, duration, stars, highlight toggle, services list, prices-by-occupancy) and hotels; contact info editor. "Enregistrer" (dirty-aware), "Voir le site", "Reinitialiser tout", "Se deconnecter".
- Admin UI language is FRENCH ONLY (internal tool, one French-speaking user). The CONTENT it edits stays bilingual FR+EN (both fields editable per string).
- LOGIN IS A DEMO GATE, NOT REAL SECURITY: front-end password `alkarama2026` (const `ADMIN_PASSWORD` in AdminPage.tsx), auth flag in sessionStorage. Anyone with the URL + password can edit; edits live only in that browser. Real auth (one admin account) comes with Supabase. Say this to Adam so he understands it is a preview of the workflow, not production.
- Verified end to end via preview: login works, edit a pack price -> Enregistrer -> persists to localStorage -> survives full reload -> homepage renders the new price. Demo data reset to defaults after testing (pristine for the meeting). `npx tsc --noEmit` clean, no console errors.

## PENDING - backend (the Supabase swap, NOT started)
- Supabase (free tier): tables for packages/hotels/visas/reviews/prices + Auth (one admin user = the client) + Storage (photos).
- Swap `src/store.tsx` loadContent/save/reset to Supabase (async). Add a real login to `/admin` (replace the demo password gate). Add photo upload to Storage (the hotel image field currently just points at an existing /public path).
- Extend the store to cover the sections still static (visas, hero slides, reviews) if the client wants to edit those too.
- RLS: public can SELECT active rows, only authenticated admin can write. Storage bucket public-read.
- Deploy: Vercel or Netlify (free) + Adam's custom domain (only real cost, ~40 TND/yr).
- Deliver a short Loom showing the client how to use the admin panel.

## Business / monetization notes (from Adam, for continuity)
- Deal so far: 2000 TND one-time (1150 frontend + 850 admin backend). Only recurring line currently is a small hosting fee. Adam wants real monthly recurring revenue (MRR).
- Hotel booking API integration: client uses some Tunisian hotel-booking system (NAME UNKNOWN, ask at meeting) and wants visitors to see his real admin-panel prices and message him to book. This is a SEPARATE paid item, price it as setup fee + monthly (it runs a live service that drives his bookings). Blocked until we know which system it is and whether it exposes an API/feed + credentials.
- Separate/bigger project: a multi-office bookings-left dashboard for the whole brand (multiple offices tracking remaining seats per Omra/Hajj package). License per office/seat, monthly = the real MRR play. Adam may mock this in Manus.ai for the pricing conversation.

## Verify without burning tokens
- `npx tsc --noEmit` for types. DOM checks via preview_eval. Screenshot tool has been flaky/timing out; prefer letting Adam view in the browser.
- Do NOT re-download or re-process images already in public/.
