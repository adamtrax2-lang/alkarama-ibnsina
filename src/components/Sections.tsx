import { Link } from "react-router-dom";
import { useLang } from "../i18n";
import { useContent } from "../store";
import {
  visaCats,
  visaIncludes,
  billetsCards,
  whyUs,
  reviews,
  wa,
  business,
  destinations,
  includedServices,
  type Destination,
  type UmrahPack,
  type Hotel,
} from "../data";
import { Icon, type IconName } from "./Icons";

function SectionHead({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto mb-8 max-w-2xl text-center">
      <p className="eyebrow">{kicker}</p>
      <h2 className="section-title mt-3">{title}</h2>
      {sub && <p className="mt-4 text-charcoal/60">{sub}</p>}
    </div>
  );
}

// "Discover all" button, right aligned above a section's grid, links to the full listing page
function DiscoverAll({ to, dark = false }: { to: string; dark?: boolean }) {
  const { tr } = useLang();
  return (
    <div className="mb-6 flex justify-end">
      <Link
        to={to}
        className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg transition ${
          dark
            ? "bg-gold text-charcoal hover:bg-gold-light"
            : "bg-charcoal text-white hover:bg-charcoal-soft"
        }`}
      >
        {tr("common.discoverAll")}
        <Icon.arrow className="h-4 w-4 transition group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function Stars({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span className={`inline-flex ${className}`}>
      {Array.from({ length: n }).map((_, i) => (
        <Icon.star key={i} className="h-4 w-4 text-gold" />
      ))}
    </span>
  );
}

/* ---------------- Umrah pack card (reused on homepage + full Omra page) ---------------- */
export function OmraPackCard({ p }: { p: UmrahPack }) {
  const { tr, lang } = useLang();
  const hi = p.highlight;
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-3xl transition ${
        hi
          ? "bg-gradient-to-b from-gold-light to-gold text-charcoal shadow-2xl shadow-gold/30 md:-mt-4 md:mb-4 ring-2 ring-gold-light"
          : "bg-white/[0.04] text-white ring-1 ring-white/10"
      }`}
    >
      {p.img && (
        <div className="relative h-32 w-full shrink-0">
          <img src={p.img} alt={p.name[lang]} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      {hi && (
        <span className="absolute right-5 top-5 rounded-full bg-charcoal px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-light">
          {tr("omra.popular")}
        </span>
      )}
      <div className="flex flex-1 flex-col p-7">
        {/* date badge */}
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
            hi ? "bg-charcoal/10 text-charcoal" : "bg-gold/15 text-gold-light"
          }`}
        >
          <Icon.calendar className="h-3.5 w-3.5" /> {p.dateLabel[lang]}
        </span>
        {p.otherDates && (
          <p className={`mt-1.5 text-[11px] ${hi ? "text-charcoal/55" : "text-white/40"}`}>{p.otherDates[lang]}</p>
        )}

        {/* name */}
        <div className="mt-3 flex items-center justify-between">
          <h3 className="font-display text-3xl font-bold">{p.name[lang]}</h3>
          <Stars n={p.stars} className={hi ? "[&_svg]:text-charcoal" : ""} />
        </div>

        {/* services */}
        <ul className={`mt-5 space-y-2.5 text-sm ${hi ? "text-charcoal/85" : "text-white/75"}`}>
          {p.services.map((s) => (
            <li key={s.fr} className="flex gap-2.5">
              <Icon.check className={`mt-0.5 h-4 w-4 shrink-0 ${hi ? "text-charcoal" : "text-gold-light"}`} />
              <span>{s[lang]}</span>
            </li>
          ))}
        </ul>

        {/* not included */}
        {p.notIncluded && (
          <p className={`mt-3 text-xs italic ${hi ? "text-charcoal/60" : "text-white/45"}`}>{p.notIncluded[lang]}</p>
        )}

        {/* occupancy prices, or a "price on request" note when no prices are set yet */}
        {p.prices.length > 0 ? (
          <>
            <p className={`mt-6 text-center text-xs font-bold uppercase tracking-wide ${hi ? "text-charcoal" : "text-gold-light"}`}>
              {tr("omra.priceLabel")}
            </p>
            <div className={`mt-2 grid grid-cols-3 gap-2 rounded-2xl p-3 text-center ${hi ? "bg-charcoal/10" : "bg-white/5"}`}>
              {p.prices.map((pr) => (
                <div key={pr.people}>
                  <p className={`text-[10px] font-medium ${hi ? "text-charcoal/60" : "text-white/45"}`}>
                    {pr.people} {tr("omra.people")}
                  </p>
                  <p className="mt-1 font-display text-xl font-bold leading-none">{pr.val}</p>
                  <p className={`text-[10px] ${hi ? "text-charcoal/60" : "text-white/45"}`}>DT</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          p.priceNote && (
            <div className={`mt-6 rounded-2xl p-3 text-center text-sm font-semibold ${hi ? "bg-charcoal/10 text-charcoal" : "bg-white/5 text-gold-light"}`}>
              {p.priceNote[lang]}
            </div>
          )
        )}

        <a
          href={wa(`Bonjour, je suis interesse par la formule Omra ${p.name.fr}.`)}
          target="_blank"
          rel="noreferrer"
          className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition ${
            hi ? "bg-charcoal text-white hover:bg-charcoal-soft" : "btn-green !w-full"
          }`}
        >
          <Icon.whatsapp className="h-4 w-4" /> {tr("hero.book")}
        </a>
      </div>
    </div>
  );
}

/* ---------------- Umrah & Hajj (first section) ---------------- */
export function Omra() {
  const { tr } = useLang();
  const { content } = useContent();
  return (
    <section id="omra" className="relative overflow-hidden bg-charcoal py-20 text-white">
      <div className="container-x">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow text-gold-light">{tr("omra.kicker")}</p>
          <h2 className="section-title mt-3 text-white">{tr("omra.title")}</h2>
          <p className="mt-4 text-white/70">{tr("omra.sub")}</p>
          <span className="mx-auto mt-5 block h-0.5 w-20 rounded bg-gold" />
        </div>

        <DiscoverAll to="/omra" dark />
        <div className="grid items-stretch gap-6 md:grid-cols-3">
          {content.umrahPacks.map((p, i) => (
            <OmraPackCard key={i} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Hotel card (reused on homepage + full Hotels page) ---------------- */
export function HotelCard({ h }: { h: Hotel }) {
  const { tr, lang } = useLang();
  return (
    <div className="group relative h-80 overflow-hidden rounded-3xl shadow-lg">
      <img
        src={h.img}
        alt={h.name}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/25 to-transparent" />

      {/* green reserve button, top-right corner */}
      <a
        href={wa(`Bonjour, je souhaite reserver a l'hotel ${h.name}.`)}
        target="_blank"
        rel="noreferrer"
        className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100 hover:bg-emerald-700"
      >
        <Icon.whatsapp className="h-4 w-4" /> {tr("hotels.book")}
      </a>
      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-charcoal">
        {h.country[lang]}
      </span>

      {/* info overlay on the photo */}
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <div className="mb-1 flex items-center gap-1">
          {Array.from({ length: h.stars }).map((_, i) => (
            <Icon.star key={i} className="h-4 w-4 text-gold-light" />
          ))}
        </div>
        <h3 className="font-display text-xl font-semibold">{h.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-white/80">
          <Icon.pin className="h-4 w-4 text-gold-light" /> {h.city[lang]}
        </p>
        <p className="mt-2 text-sm">
          <span className="text-xs text-white/60">{tr("common.from")} </span>
          <span className="font-display text-lg font-bold text-gold-light">{h.price}</span>{" "}
          <span className="text-white/70">{tr("hotels.night")}</span>
        </p>
      </div>
    </div>
  );
}

/* ---------------- Hotels ---------------- */
export function Hotels() {
  const { tr } = useLang();
  const { content } = useContent();
  return (
    <section id="hotels" className="bg-cream py-20">
      <div className="container-x">
        <SectionHead kicker={tr("hotels.kicker")} title={tr("hotels.title")} sub={tr("hotels.sub")} />
        <DiscoverAll to="/hotels" />
        <div className="grid gap-6 md:grid-cols-3">
          {content.hotels.map((h, i) => (
            <HotelCard key={i} h={h} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Visas ---------------- */
export function Visas() {
  const { tr, lang } = useLang();
  return (
    <section id="visas" className="bg-sand py-20">
      <div className="container-x">
        <SectionHead kicker={tr("visas.kicker")} title={tr("visas.title")} sub={tr("visas.sub")} />
        <DiscoverAll to="/visas" />
        <div className="grid gap-6 md:grid-cols-3">
          {visaCats.map((v) => (
            <div key={v.name.fr} className="card group flex flex-col">
              <div className="relative overflow-hidden">
                <img
                  src={v.img}
                  alt={v.name[lang]}
                  className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
                <h3 className="absolute bottom-3 left-4 font-display text-xl font-semibold text-white">
                  {v.name[lang]}
                </h3>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gold">
                  {tr("visas.included")}
                </p>
                <ul className="mt-3 space-y-2">
                  {visaIncludes.map((inc) => (
                    <li key={inc.fr} className="flex items-start gap-2 text-sm text-charcoal/70">
                      <Icon.check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {inc[lang]}
                    </li>
                  ))}
                </ul>
                <a
                  href={wa(`Bonjour, je souhaite un visa (${v.name.fr}).`)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold mt-5"
                >
                  {tr("visas.apply")}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Billets (plane + ferry image cards) ---------------- */
export function Billets() {
  const { tr, lang } = useLang();
  return (
    <section id="billets" className="bg-cream py-20">
      <div className="container-x">
        <SectionHead kicker={tr("billets.kicker")} title={tr("billets.title")} sub={tr("billets.sub")} />
        <DiscoverAll to="/reserver-billet" />
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {billetsCards.map((c) => (
            <div key={c.id} className="group relative h-72 overflow-hidden rounded-3xl shadow-lg">
              <img
                src={c.img}
                alt={c.title[lang]}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-display text-2xl font-semibold">{c.title[lang]}</h3>
                <p className="mt-1 text-sm text-white/80">{c.desc[lang]}</p>
                <Link to={`/reserver-billet?type=${c.id}`} className="btn-green mt-4">
                  {c.id === "avion" ? <Icon.plane className="h-4 w-4" /> : <Icon.ferry className="h-4 w-4" />}
                  {tr("common.bookNow")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Destination card (reused on homepage + full destinations page) ---------------- */
export function DestinationCard({ d }: { d: Destination }) {
  const { tr, lang } = useLang();
  return (
    <div className="group relative h-72 overflow-hidden rounded-3xl shadow-lg">
      <img
        src={d.img}
        alt={d.title[lang]}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h3 className="font-display text-2xl font-semibold">{d.title[lang]}</h3>
        <p className="mt-1 text-sm text-white/80">{d.desc[lang]}</p>
        <a href={wa(d.waMsg)} target="_blank" rel="noreferrer" className="btn-green mt-4">
          <Icon.whatsapp className="h-4 w-4" /> {tr("common.bookNow")}
        </a>
      </div>
    </div>
  );
}

/* ---------------- Destinations & included services ---------------- */
export function TravelPacks() {
  const { tr, lang } = useLang();
  const featured = destinations.filter((d) => d.featured);
  return (
    <section id="packs" className="bg-sand py-20">
      <div className="container-x">
        <SectionHead kicker={tr("packs.kicker")} title={tr("packs.title")} sub={tr("packs.sub")} />
        <DiscoverAll to="/destinations" />
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((d) => (
            <DestinationCard key={d.id} d={d} />
          ))}
        </div>

        {/* Extra services included, shown as a compact icon strip (not full pack cards) */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {includedServices.map((s) => {
            const ServiceIcon = Icon[s.icon];
            return (
              <a
                key={s.id}
                href={wa(s.waMsg)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm ring-1 ring-charcoal/5 transition hover:shadow-md"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold/15 text-gold-dark">
                  <ServiceIcon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium text-charcoal">{s.title[lang]}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Connect (social media cards, EliteMasar style) ---------------- */
export function Connect() {
  const { tr, lang } = useLang();
  const AV = "/brand/avatar.png";
  const LG = "/brand/logo-white.png";
  const NAME = "AlKarama Ibn Sina";

  // NOTE: follower / like / view figures below are PLACEHOLDERS for the EliteMasar-style look.
  // Replace them with the agency's real numbers when the client provides them.
  const post =
    lang === "fr"
      ? "Nouvelles offres Omra 2026-2027 disponibles. Vols directs, hotels 4 et 5 etoiles, formules groupe et privees."
      : "New 2026-2027 Umrah offers available. Direct flights, 4 and 5 star hotels, group and private packages.";
  const igCaption =
    lang === "fr"
      ? "Vivez votre Omra en toute serenite avec AlKarama Ibn Sina."
      : "Live your Umrah in serenity with AlKarama Ibn Sina.";
  const followOn = (p: string) => (lang === "fr" ? `Suivre sur ${p}` : `Follow on ${p}`);
  const grid = ["/hero/hajj.png", "/hotels/istanbul.jpg", "/hero/resort.jpg", "/dest/sharm.jpg", "/hero/cappadocia.jpg", "/hero/dubai.jpg"];

  return (
    <section id="connect" className="bg-sand py-20">
      <div className="container-x">
        <div className="mb-10 max-w-2xl">
          <h2 className="section-title">{tr("connect.title")}</h2>
          <span className="mt-3 block h-1 w-16 rounded bg-charcoal" />
          <p className="mt-5 text-charcoal/60">{tr("connect.sub")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ---------- Facebook ---------- */}
          <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-charcoal/5">
            <div className="flex items-center justify-between bg-[#1877F2] px-4 py-3 text-white">
              <span className="flex items-center gap-2 text-sm font-semibold"><Icon.facebook className="h-5 w-5" /> {NAME}</span>
              <a href={business.facebook} target="_blank" rel="noreferrer" className="text-sm hover:underline">{tr("connect.follow")}</a>
            </div>
            <div className="relative grid h-24 place-items-center bg-gradient-to-br from-charcoal to-charcoal-soft">
              <img src={LG} alt="" className="h-11 w-auto opacity-90" />
            </div>
            <div className="relative px-4 pb-3 pt-8">
              <img src={AV} alt="" className="absolute -top-7 left-4 h-14 w-14 rounded-full object-cover ring-4 ring-white" />
              <p className="font-semibold text-charcoal">{NAME}</p>
              <p className="text-xs text-charcoal/50">{lang === "fr" ? "Agence de voyage" : "Travel Agency"}</p>
            </div>
            <div className="border-t border-charcoal/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <img src={AV} alt="" className="h-8 w-8 rounded-full object-cover" />
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-charcoal">{NAME}</p>
                  <p className="text-[10px] text-charcoal/40">{lang === "fr" ? "il y a 2 heures" : "2 hours ago"}</p>
                </div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-charcoal/70">{post}</p>
            </div>
            <img src="/hero/hajj.png" alt="" className="h-44 w-full object-cover" />
            <div className="mt-auto p-3">
              <a href={business.facebook} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1877F2] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1466d6]">
                <Icon.facebook className="h-4 w-4" /> {followOn("Facebook")}
              </a>
            </div>
          </div>

          {/* ---------- Instagram ---------- */}
          <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-charcoal/5">
            <div className="instagram-grad flex items-center justify-between px-4 py-3 text-white">
              <span className="flex items-center gap-2 text-sm font-semibold"><Icon.instagram className="h-5 w-5" /> @alkarama.ibnsina.agency</span>
              <a href={business.instagram} target="_blank" rel="noreferrer" className="text-sm hover:underline">{tr("connect.follow")}</a>
            </div>
            <div className="flex items-center gap-3 px-4 py-4">
              <img src={AV} alt="" className="h-12 w-12 rounded-full object-cover ring-1 ring-charcoal/10" />
              <div>
                <p className="text-sm font-semibold text-charcoal">{NAME}</p>
                <p className="text-xs text-charcoal/50">{lang === "fr" ? "Agence de voyage" : "Travel Agency"}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-0.5">
              {grid.map((g, i) => (
                <img key={i} src={g} alt="" className="aspect-square w-full object-cover" />
              ))}
            </div>
            <div className="px-4 py-3">
              <p className="text-xs text-charcoal/70"><span className="font-semibold text-charcoal">alkarama.ibnsina.agency</span> {igCaption}</p>
            </div>
            <div className="mt-auto p-3">
              <a href={business.instagram} target="_blank" rel="noreferrer" className="instagram-grad flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
                <Icon.instagram className="h-4 w-4" /> {followOn("Instagram")}
              </a>
            </div>
          </div>

          {/* ---------- TikTok ---------- */}
          <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-charcoal/5">
            <div className="flex items-center justify-between bg-black px-4 py-3 text-white">
              <span className="flex items-center gap-2 text-sm font-semibold"><Icon.tiktok className="h-5 w-5" /> @alkaramaibnsina</span>
              <a href={business.tiktok} target="_blank" rel="noreferrer" className="text-sm hover:underline">{tr("connect.follow")}</a>
            </div>
            <div className="relative grid h-24 place-items-center bg-gradient-to-br from-charcoal to-charcoal-soft">
              <img src={LG} alt="" className="h-11 w-auto opacity-90" />
            </div>
            <div className="relative px-4 pb-3 pt-8">
              <img src={AV} alt="" className="absolute -top-7 left-4 h-14 w-14 rounded-full object-cover ring-4 ring-white" />
              <p className="font-semibold text-charcoal">{NAME}</p>
              <p className="text-xs text-charcoal/50">{lang === "fr" ? "Agence de voyage" : "Travel Agency"}</p>
            </div>
            <div className="px-4 pb-3">
              <p className="text-xs leading-relaxed text-charcoal/70">{lang === "fr" ? "Agence de voyage a Tunis. Omra, sejours, visas et billetterie." : "Travel agency in Tunis. Umrah, stays, visas and ticketing."}</p>
            </div>
            <div className="relative">
              <img src="/hero/mecca.jpg" alt="" className="h-44 w-full object-cover" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-black/60 text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M8 5v14l11-7z" /></svg>
                </span>
              </span>
            </div>
            <div className="mt-auto p-3">
              <a href={business.tiktok} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-2.5 text-sm font-semibold text-white transition hover:bg-charcoal">
                <Icon.tiktok className="h-4 w-4" /> {followOn("TikTok")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Video (YouTube embed, hidden if no link is set) ---------------- */
function youtubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let id = "";
    if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
    else if (u.pathname.startsWith("/embed/")) id = u.pathname.replace("/embed/", "");
    else id = u.searchParams.get("v") ?? "";
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

export function Video() {
  const { tr } = useLang();
  const { content } = useContent();
  const embedUrl = youtubeEmbedUrl(content.business.featuredVideoUrl);
  if (!embedUrl) return null;

  return (
    <section id="video" className="bg-white py-20">
      <div className="container-x">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="eyebrow text-gold">{tr("video.kicker")}</p>
          <h2 className="section-title mt-3">{tr("video.title")}</h2>
          <p className="mt-4 text-charcoal/60">{tr("video.sub")}</p>
          <span className="mx-auto mt-5 block h-0.5 w-20 rounded bg-gold" />
        </div>
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl shadow-lg ring-1 ring-charcoal/5">
          <div className="aspect-video w-full">
            <iframe
              src={embedUrl}
              title={tr("video.title")}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        <div className="mt-6 text-center">
          <a
            href={content.business.featuredVideoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-white transition hover:bg-charcoal-soft"
          >
            {tr("video.watchOn")}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Why us ---------------- */
export function WhyUs() {
  const { tr, lang } = useLang();
  return (
    <section className="bg-sand py-20">
      <div className="container-x">
        <SectionHead kicker={tr("why.kicker")} title={tr("why.title")} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((w) => {
            const I = Icon[w.icon as IconName];
            return (
              <div key={w.title.fr} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-sand text-gold">
                  <I className="h-6 w-6" />
                </span>
                <p className="font-medium text-charcoal">{w.title[lang]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Reviews ---------------- */
export function Reviews() {
  const { tr, lang } = useLang();
  const { content } = useContent();
  const business = content.business;
  return (
    <section id="reviews" className="bg-cream py-20">
      <div className="container-x">
        <SectionHead kicker={tr("reviews.kicker")} title={tr("reviews.title")} sub={tr("reviews.sub")} />
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="card p-6">
              <Stars n={r.stars} />
              <blockquote className="mt-3 text-sm leading-relaxed text-charcoal/75">“{r.text[lang]}”</blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-charcoal/10 pt-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/15 font-semibold text-gold">
                  {r.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-charcoal">{r.name}</p>
                  <p className="text-xs text-charcoal/50">{r.city[lang]}</p>
                </div>
                <svg viewBox="0 0 48 48" className="ml-auto h-5 w-5" aria-label="Google">
                  <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
                  <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
                  <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
                  <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
                </svg>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center gap-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, n) => (
              <Icon.star key={n} className="h-6 w-6 text-gold" />
            ))}
          </div>
          <a href={business.facebook} target="_blank" rel="noreferrer" className="btn-outline mt-2">
            {business.rating} · {business.reviews} {tr("common.googleReviews")}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
export function Contact() {
  const { tr } = useLang();
  const { content } = useContent();
  const business = content.business;
  const items = [
    { icon: Icon.pin, label: tr("contact.address"), value: business.address },
    { icon: Icon.phone, label: tr("contact.phone"), value: `${business.phone} · ${business.phone2}` },
    { icon: Icon.clock, label: tr("contact.hours"), value: tr("contact.hoursval") },
  ];
  return (
    <section id="contact" className="bg-sand py-20">
      <div className="container-x">
        <SectionHead kicker={tr("contact.kicker")} title={tr("contact.title")} />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            {items.map((it) => (
              <div key={it.label} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-sand text-gold">
                  <it.icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/40">{it.label}</p>
                  <p className="mt-1 font-medium text-charcoal">{it.value}</p>
                </div>
              </div>
            ))}
            <a href={wa("Bonjour AlKarama, je souhaite reserver.")} target="_blank" rel="noreferrer" className="btn-gold w-full">
              <Icon.whatsapp className="h-5 w-5" /> {tr("contact.cta")}
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-sm">
            <iframe
              title="map"
              className="h-full min-h-[320px] w-full"
              loading="lazy"
              src="https://www.google.com/maps?q=Centre%20Commercial%20Lawand%20Ibn%20Sina%20Tunis&output=embed"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
export function Footer() {
  const { tr } = useLang();
  const { content } = useContent();
  const business = content.business;
  return (
    <footer className="bg-charcoal py-10 text-white/70">
      <div className="container-x flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <img src="/brand/logo-white.png" alt={business.name} className="h-14 w-auto" />
          <div>
            <p className="text-xs">{business.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href={business.facebook} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-[#1877F2] text-white transition hover:opacity-90">
            <Icon.facebook className="h-5 w-5" />
          </a>
          <a href={business.instagram} target="_blank" rel="noreferrer" className="instagram-grad grid h-10 w-10 place-items-center rounded-full text-white transition hover:opacity-90">
            <Icon.instagram className="h-5 w-5" />
          </a>
          {business.tiktok && (
            <a href={business.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="grid h-10 w-10 place-items-center rounded-full bg-black text-white transition hover:opacity-90">
              <Icon.tiktok className="h-5 w-5" />
            </a>
          )}
          {business.youtube && (
            <a href={business.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="grid h-10 w-10 place-items-center rounded-full bg-[#FF0000] text-white transition hover:opacity-90">
              <Icon.youtube className="h-5 w-5" />
            </a>
          )}
          {business.x && (
            <a href={business.x} target="_blank" rel="noreferrer" aria-label="X" className="grid h-10 w-10 place-items-center rounded-full bg-black text-white transition hover:opacity-90">
              <Icon.x className="h-5 w-5" />
            </a>
          )}
          <a href={wa("Bonjour AlKarama.")} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366] text-white transition hover:opacity-90">
            <Icon.whatsapp className="h-5 w-5" />
          </a>
        </div>
      </div>
      <div className="container-x mt-8 border-t border-white/10 pt-6 text-center text-xs">
        © 2026 {business.name}. {tr("footer.rights")} · {tr("footer.built")}
      </div>
    </footer>
  );
}
