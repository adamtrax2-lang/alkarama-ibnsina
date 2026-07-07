import { useLang } from "../i18n";
import { visaCats, visaIncludes, wa } from "../data";
import { PageBanner } from "../components/PageBanner";
import { Icon } from "../components/Icons";

export default function VisasPage() {
  const { tr, lang } = useLang();

  return (
    <>
      <PageBanner
        img="/visas/europe.jpg"
        kicker={tr("visas.kicker")}
        title={tr("visasPage.title")}
        sub={tr("visasPage.sub")}
      />
      <section className="bg-sand py-16">
        <div className="container-x space-y-8">
          {visaCats.map((v) => (
            <div key={v.name.fr} className="grid overflow-hidden rounded-3xl bg-white shadow-sm md:grid-cols-2">
              <div className="relative h-56 md:h-full">
                <img src={v.img} alt={v.name[lang]} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent md:bg-gradient-to-r" />
                <h2 className="absolute bottom-4 left-5 font-display text-2xl font-semibold text-white md:bottom-auto md:top-5">
                  {v.name[lang]}
                </h2>
              </div>
              <div className="flex flex-col p-6 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gold">
                  {tr("visasPage.countries")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {v.countries.map((c) => (
                    <span key={c} className="rounded-full bg-sand px-3 py-1.5 text-sm font-medium text-charcoal">
                      {c}
                    </span>
                  ))}
                </div>

                <p className="mt-6 text-[11px] font-semibold uppercase tracking-wide text-gold">
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
                  href={wa(`Bonjour, je souhaite plus d'informations sur le visa (${v.name.fr}).`)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-green mt-6 w-full sm:w-fit"
                >
                  <Icon.whatsapp className="h-4 w-4" /> {tr("visas.apply")}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
