import { useMemo, useState } from "react";
import { useLang } from "../i18n";
import { useContent } from "../store";
import { PageBanner } from "../components/PageBanner";
import { OmraPackCard } from "../components/Sections";
import { Icon } from "../components/Icons";
import type { UmrahPack } from "../data";

// Small month calendar. Days with a departure are marked; clicking one selects it.
// Single navigable month calendar. Prev/next arrows move between months; days with a
// departure are marked and clickable.
function MonthCalendar({
  year,
  month, // 0-indexed
  availableDates,
  selected,
  onSelect,
  onPrev,
  onNext,
  canPrev,
  canNext,
  lang,
}: {
  year: number;
  month: number;
  availableDates: Set<string>;
  selected: string | null;
  onSelect: (iso: string) => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  lang: "fr" | "en";
}) {
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-first weekday index (0 = Monday ... 6 = Sunday)
  const startOffset = (first.getDay() + 6) % 7;
  const monthLabel = first.toLocaleDateString(locale, { month: "long", year: "numeric" });
  const weekdayLabels = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(2024, 0, 1 + i); // a known Monday
    return d.toLocaleDateString(locale, { weekday: "short" }).slice(0, 2);
  });

  const cells: (string | null)[] = [
    ...Array.from({ length: startOffset }).map(() => null),
    ...Array.from({ length: daysInMonth }).map((_, i) => {
      const d = new Date(year, month, i + 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }),
  ];

  const arrow =
    "flex h-8 w-8 items-center justify-center rounded-full text-charcoal/60 transition hover:bg-gold/15 hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent";

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-charcoal/5 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={onPrev} disabled={!canPrev} className={arrow} aria-label="Mois precedent">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <p className="text-center text-sm font-semibold capitalize text-charcoal">{monthLabel}</p>
        <button type="button" onClick={onNext} disabled={!canNext} className={arrow} aria-label="Mois suivant">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-charcoal/40">
        {weekdayLabels.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-7 gap-1">
        {cells.map((iso, i) => {
          if (!iso) return <span key={i} />;
          const has = availableDates.has(iso);
          const isSelected = selected === iso;
          const day = Number(iso.slice(-2));
          return (
            <button
              key={iso}
              type="button"
              disabled={!has}
              onClick={() => onSelect(iso)}
              className={`aspect-square rounded-lg text-xs font-medium transition ${
                isSelected
                  ? "bg-gold text-white shadow-md"
                  : has
                  ? "bg-gold/15 text-charcoal hover:bg-gold/30"
                  : "text-charcoal/25"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function OmraPage() {
  const { tr, lang } = useLang();
  const { content } = useContent();
  const allPacks = [...content.umrahPacks, ...content.umrahMoreDepartures];

  const datedPacks = allPacks.filter((p) => p.departureDates && p.departureDates.length > 0);
  const customPacks = allPacks.filter((p) => !p.departureDates || p.departureDates.length === 0);

  const availableDates = useMemo(() => {
    const s = new Set<string>();
    datedPacks.forEach((p) => p.departureDates!.forEach((d) => s.add(d)));
    return s;
  }, [datedPacks]);

  const sortedDates = useMemo(() => [...availableDates].sort(), [availableDates]);
  const [selected, setSelected] = useState<string | null>(sortedDates[0] ?? null);

  const packsForSelected: UmrahPack[] = selected
    ? datedPacks.filter((p) => p.departureDates!.includes(selected))
    : [];

  const formattedSelected = selected
    ? new Date(selected + "T00:00:00").toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // Months to show: derived from the actual data so this stays correct if dates change later.
  // A single calendar is displayed; the user pages between these months with the arrows.
  const months = useMemo(() => {
    const keys = new Set(sortedDates.map((d) => d.slice(0, 7)));
    return [...keys].sort().map((k) => {
      const [y, m] = k.split("-").map(Number);
      return { year: y, month: m - 1 };
    });
  }, [sortedDates]);

  // Which month is currently on screen. Start on the month of the first available date.
  const [monthIdx, setMonthIdx] = useState(0);
  const current = months[monthIdx] ?? months[0];

  return (
    <>
      <PageBanner img="/hero/hajj.png" kicker={tr("omra.kicker")} title={tr("omraPage.title")} sub={tr("omraPage.sub")} />

      <section className="bg-sand py-16">
        <div className="container-x">
          <h2 className="mb-6 text-center font-display text-2xl font-semibold text-charcoal">
            {tr("omraPage.calendarTitle")}
          </h2>
          <div className="mx-auto max-w-sm">
            {current && (
              <MonthCalendar
                year={current.year}
                month={current.month}
                availableDates={availableDates}
                selected={selected}
                onSelect={setSelected}
                onPrev={() => setMonthIdx((i) => Math.max(0, i - 1))}
                onNext={() => setMonthIdx((i) => Math.min(months.length - 1, i + 1))}
                canPrev={monthIdx > 0}
                canNext={monthIdx < months.length - 1}
                lang={lang}
              />
            )}
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-charcoal/50">
            <span className="inline-block h-3 w-3 rounded bg-gold/15 ring-1 ring-gold/30" /> {tr("omraPage.legendAvailable")}
          </p>
        </div>
      </section>

      <section className="bg-charcoal py-16 text-white">
        <div className="container-x">
          {selected ? (
            <p className="mb-8 text-center text-white/70">
              {tr("omraPage.packsForDate")} <span className="font-semibold capitalize text-gold-light">{formattedSelected}</span>
            </p>
          ) : (
            <p className="mb-8 text-center text-white/50">{tr("omraPage.noDate")}</p>
          )}
          {packsForSelected.length > 0 && (
            <div className="grid items-stretch gap-6 md:grid-cols-3">
              {packsForSelected.map((p, i) => (
                <OmraPackCard key={i} p={p} />
              ))}
            </div>
          )}

          {customPacks.length > 0 && (
            <div className="mt-16 border-t border-white/10 pt-12">
              <h3 className="mb-6 flex items-center justify-center gap-2 text-center font-display text-xl font-semibold text-gold-light">
                <Icon.calendar className="h-5 w-5" /> {tr("omraPage.customTitle")}
              </h3>
              <div className="mx-auto grid max-w-xl items-stretch gap-6 sm:grid-cols-1">
                {customPacks.map((p, i) => (
                  <OmraPackCard key={i} p={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
