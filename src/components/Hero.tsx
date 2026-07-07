import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n";
import { heroSlides, heroPartners, wa } from "../data";
import { Icon } from "./Icons";

export default function Hero() {
  const { tr, lang } = useLang();
  const [i, setI] = useState(0);
  const slide = heroSlides[i];

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % heroSlides.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden lg:h-screen">
      {/* Background slides with Ken Burns zoom */}
      {heroSlides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={s.img}
            alt={s.service[lang]}
            className={`h-full w-full object-cover ${idx === i ? "animate-kenburns" : ""}`}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-charcoal/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-charcoal/15" />

      {/* Content */}
      <div className="container-x relative flex flex-col justify-center gap-8 py-28 lg:h-full lg:flex-row lg:items-center lg:gap-10 lg:py-0 lg:pb-28 lg:pt-24">
        <div className="grid w-full items-center gap-6 lg:grid-cols-12 lg:gap-10">
          {/* Left: service + headline + one line */}
          <div key={`txt-${i}`} className="animate-fadeup lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              {slide.service[lang]}
            </span>
            <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-[1.1] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.65)] sm:text-5xl lg:text-[3.4rem]">
              {slide.headline[lang]}
            </h1>
            <p className="mt-5 max-w-lg text-base text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)] sm:text-lg">{slide.tagline[lang]}</p>
          </div>

          {/* Right: featured card (visible on all sizes, stacked below on mobile) */}
          <div className="lg:col-span-5">
            <div
              key={`card-${i}`}
              className="mx-auto max-w-sm animate-slidein overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md sm:max-w-md lg:ml-auto lg:mr-0"
            >
              <div className="relative">
                <img src={slide.cardImg ?? slide.img} alt="" className="h-36 w-full object-cover sm:h-48" />
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow ${
                    slide.card.urgent ? "bg-red-500" : "bg-gold"
                  }`}
                >
                  {slide.card.badge[lang]}
                </span>
              </div>
              <div className="p-5 text-white sm:p-6">
                <h3 className="font-display text-lg font-semibold sm:text-xl">{slide.card.title[lang]}</h3>
                <p className="mt-1.5 text-sm text-white/80">{slide.card.sub[lang]}</p>
                <div className={`mt-4 flex items-center border-t border-white/15 pt-4 ${slide.card.price ? "justify-between" : "justify-end"}`}>
                  {slide.card.price && (
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-white/60">{tr("common.from")}</p>
                      <p className="text-lg font-bold text-gold-light">{slide.card.price}</p>
                    </div>
                  )}
                  {slide.card.formLink ? (
                    <Link to={slide.card.formLink} className="btn-gold !px-5 !py-2.5">
                      <Icon.arrow className="h-4 w-4" /> {tr("hero.book")}
                    </Link>
                  ) : (
                    <a href={wa(slide.card.waMsg)} target="_blank" rel="noreferrer" className="btn-gold !px-5 !py-2.5">
                      <Icon.whatsapp className="h-4 w-4" /> {tr("hero.book")}
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-center gap-2 lg:justify-end lg:pr-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-gold" : "w-3 bg-white/40"}`}
                  aria-label={`slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Partner / affiliation logos, white, over the photo. Flows normally on mobile (avoids overlapping taller content), pinned to the bottom on desktop. */}
      <div className="relative bg-gradient-to-t from-charcoal/60 to-transparent pb-8 pt-10 lg:absolute lg:inset-x-0 lg:bottom-0">
        <div className="container-x flex flex-wrap items-center justify-center gap-x-12 gap-y-5 sm:gap-x-20">
          {heroPartners.map((p) =>
            p.img ? (
              <img
                key={p.name}
                src={p.img}
                alt={p.name}
                title={p.name}
                className={`h-7 w-auto object-contain transition sm:h-9 ${
                  p.color ? "opacity-95 hover:opacity-100" : "opacity-75 hover:opacity-100"
                }`}
              />
            ) : (
              <span
                key={p.name}
                className="font-display text-lg font-semibold lowercase tracking-wide text-white/80"
              >
                {p.text}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
