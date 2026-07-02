import { useState, type FormEvent } from "react";
import { useLang } from "../i18n";
import { useContent } from "../store";
import { wa } from "../data";
import { PageBanner } from "../components/PageBanner";
import { HotelCard } from "../components/Sections";
import { Icon } from "../components/Icons";

export default function HotelsPage() {
  const { tr } = useLang();
  const { content } = useContent();
  const hotels = content.hotels;
  const [query, setQuery] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [people, setPeople] = useState(2);
  const [searched, setSearched] = useState(false);

  const q = query.trim().toLowerCase();
  const results = q
    ? hotels.filter((h) =>
        [h.name, h.country.fr, h.country.en, h.city.fr, h.city.en].some((v) => v.toLowerCase().includes(q))
      )
    : hotels;

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setSearched(true);
  }

  const waSearchMsg = () => {
    const parts = [`Bonjour, je cherche un hotel${query ? ` (${query})` : ""}.`];
    if (checkin) parts.push(`Arrivee: ${checkin}.`);
    if (checkout) parts.push(`Depart: ${checkout}.`);
    parts.push(`Personnes: ${people}.`);
    return parts.join(" ");
  };

  return (
    <>
      <PageBanner
        img="/hotels/tunisia.jpg"
        kicker={tr("hotels.kicker")}
        title={tr("hotelsPage.title")}
        sub={tr("hotelsPage.sub")}
      />
      <section className="bg-cream py-16">
        <div className="container-x">
          {/* Search bar (filters our current real hotels by destination; dates/people are collected
              to relay via WhatsApp since there is no live availability system yet) */}
          <form
            onSubmit={handleSearch}
            className="mb-10 mt-8 grid gap-3 rounded-3xl bg-white p-5 shadow-xl sm:p-6 md:grid-cols-4 md:items-end"
          >
            <div className="md:col-span-1">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal/50">
                {tr("hotelsPage.searchDestination")}
              </label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tr("hotelsPage.searchDestinationPh")}
                className="w-full rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal/50">
                {tr("hotelsPage.checkin")}
              </label>
              <input
                type="date"
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                className="w-full rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal/50">
                {tr("hotelsPage.checkout")}
              </label>
              <input
                type="date"
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
                className="w-full rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm outline-none focus:border-gold"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal/50">
                  {tr("hotelsPage.people")}
                </label>
                <input
                  type="number"
                  min={1}
                  value={people}
                  onChange={(e) => setPeople(Number(e.target.value) || 1)}
                  className="w-full rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm outline-none focus:border-gold"
                />
              </div>
              <button type="submit" className="btn-gold self-end !px-5">
                <Icon.pin className="h-4 w-4" /> {tr("hotelsPage.search")}
              </button>
            </div>
          </form>
          <p className="-mt-4 mb-8 text-center text-xs text-charcoal/45">{tr("hotelsPage.searchNote")}</p>

          {results.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {results.map((h, i) => (
                <HotelCard key={i} h={h} />
              ))}
            </div>
          ) : (
            searched && (
              <div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-center shadow-sm">
                <p className="text-charcoal/70">{tr("hotelsPage.noResults")}</p>
              </div>
            )
          )}

          <div className="mx-auto mt-12 max-w-xl rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-charcoal/70">{tr("hotelsPage.more")}</p>
            <a href={wa(waSearchMsg())} target="_blank" rel="noreferrer" className="btn-gold mt-4">
              <Icon.whatsapp className="h-4 w-4" /> {tr("hero.book")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
