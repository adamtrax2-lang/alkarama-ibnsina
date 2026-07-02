import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useLang } from "../i18n";
import { business, wa, bookingEmail } from "../data";
import { PageBanner } from "../components/PageBanner";
import { Icon } from "../components/Icons";

function buildMailto(data: FormData, lang: "fr" | "en") {
  const get = (k: string) => (data.get(k) as string) || "-";
  const subject = lang === "fr" ? "Demande de reservation billet" : "Ticket booking request";
  const body = [
    `${lang === "fr" ? "Type" : "Type"}: ${get("type")}`,
    `${lang === "fr" ? "Nom" : "Name"}: ${get("name")}`,
    `${lang === "fr" ? "Telephone" : "Phone"}: ${get("phone")}`,
    `${lang === "fr" ? "Destination" : "Destination"}: ${get("destination")}`,
    `${lang === "fr" ? "Date de depart" : "Departure date"}: ${get("departDate")}`,
    `${lang === "fr" ? "Date de retour" : "Return date"}: ${get("returnDate")}`,
    `${lang === "fr" ? "Personnes" : "People"}: ${get("people")}`,
    `${lang === "fr" ? "Remarques" : "Notes"}: ${get("message")}`,
  ].join("\n");
  return `mailto:${bookingEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function BookingFormPage() {
  const { tr, lang } = useLang();
  const [params] = useSearchParams();
  const [type, setType] = useState<"avion" | "bateau">(params.get("type") === "bateau" ? "bateau" : "avion");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // use a throwaway link click (not window.location.href) so triggering the mail app
    // doesn't reload/reset this page in browsers that treat the mailto: assignment as navigation
    const link = document.createElement("a");
    link.href = buildMailto(data, lang);
    link.click();
    setSent(true);
  }

  return (
    <>
      <PageBanner
        img="/billets/plane.jpg"
        altImg="/billets/boat.jpg"
        showAlt={type === "bateau"}
        kicker={tr("booking.kicker")}
        title={tr("booking.title")}
        sub={tr("booking.sub")}
      />
      <section className="bg-cream py-16">
        <div className="container-x max-w-xl">
          {sent ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <Icon.check className="h-7 w-7" />
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold text-charcoal">{tr("booking.sentTitle")}</h2>
              <p className="mt-2 text-charcoal/60">{tr("booking.sentBody")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <div>
                <label className="mb-2 block text-sm font-semibold text-charcoal">{tr("booking.type")}</label>
                <div className="flex gap-3">
                  {(["avion", "bateau"] as const).map((v) => (
                    <label
                      key={v}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-charcoal/15 px-4 py-3 text-sm font-medium text-charcoal transition has-[:checked]:border-gold has-[:checked]:bg-gold/10"
                    >
                      <input
                        type="radio"
                        name="type"
                        value={v}
                        checked={type === v}
                        onChange={() => setType(v)}
                        className="accent-gold"
                      />
                      {v === "avion" ? <Icon.plane className="h-4 w-4" /> : <Icon.ferry className="h-4 w-4" />}
                      {v === "avion" ? tr("booking.typeAvion") : tr("booking.typeBateau")}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-charcoal">{tr("booking.name")}</label>
                <input name="name" required className="w-full rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm outline-none focus:border-gold" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-charcoal">{tr("booking.phone")}</label>
                <input name="phone" type="tel" required className="w-full rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm outline-none focus:border-gold" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-charcoal">{tr("booking.destination")}</label>
                <input
                  name="destination"
                  required
                  placeholder={tr("booking.destinationPh")}
                  className="w-full rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-charcoal">{tr("booking.departDate")}</label>
                  <input name="departDate" type="date" required className="w-full rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-charcoal">{tr("booking.returnDate")}</label>
                  <input name="returnDate" type="date" className="w-full rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm outline-none focus:border-gold" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-charcoal">{tr("booking.people")}</label>
                <input name="people" type="number" min={1} defaultValue={1} required className="w-full rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm outline-none focus:border-gold" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-charcoal">{tr("booking.message")}</label>
                <textarea name="message" rows={3} className="w-full rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm outline-none focus:border-gold" />
              </div>

              <button type="submit" className="btn-gold w-full">
                {tr("booking.submit")}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-charcoal/50">{tr("booking.orWhatsapp")}</p>
            <a href={wa("Bonjour, je souhaite reserver un billet.")} target="_blank" rel="noreferrer" className="btn-green mt-3">
              <Icon.whatsapp className="h-4 w-4" /> {business.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
