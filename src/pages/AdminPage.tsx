import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useContent, type Content, type Business } from "../store";
import type { UmrahPack, Hotel } from "../data";

/*
  Admin panel (demo grade).

  The login here is a simple front-end gate so the client can see the workflow.
  It is NOT real security. Real login (one admin account, password reset, etc.)
  arrives when we connect the database. Until then, anyone who knows the URL and
  the password can edit, and edits live only in this browser.

  UI language: French only (the client's language). The CONTENT it edits stays
  bilingual FR + EN, both fields are editable for every text the visitor sees.
*/

const ADMIN_PASSWORD = "alkarama2026";
const AUTH_KEY = "alkarama_admin_authed";
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

type Lg = { fr: string; en: string };
type Tab = "omra" | "omraMore" | "hotels" | "contact";

/* ----------------------------- shared inputs ----------------------------- */
function TextInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal/50">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm outline-none focus:border-gold"
      />
    </label>
  );
}

// Bilingual field: one label, FR + EN side by side.
function BiField({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: Lg;
  onChange: (v: Lg) => void;
  textarea?: boolean;
}) {
  const Cmp = textarea ? "textarea" : "input";
  return (
    <div>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal/50">
        {label}
      </span>
      <div className="grid gap-2 sm:grid-cols-2">
        {(["fr", "en"] as const).map((lg) => (
          <div key={lg} className="relative">
            <span className="absolute left-2 top-2 text-[10px] font-bold uppercase text-gold">{lg}</span>
            <Cmp
              value={value[lg]}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                onChange({ ...value, [lg]: e.target.value })
              }
              rows={textarea ? 2 : undefined}
              className="w-full rounded-lg border border-charcoal/15 px-3 py-2 pl-9 text-sm outline-none focus:border-gold"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ children, onDelete }: { children: ReactNode; onDelete?: () => void }) {
  return (
    <div className="relative rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute right-3 top-3 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-100"
        >
          Supprimer
        </button>
      )}
      {children}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-dashed border-gold/60 px-5 py-2.5 text-sm font-semibold text-gold transition hover:bg-gold/5"
    >
      + {label}
    </button>
  );
}

/* ----------------------------- Umrah editor ----------------------------- */
function emptyPack(): UmrahPack {
  return {
    name: { fr: "Nouvelle formule", en: "New package" },
    dateLabel: { fr: "", en: "" },
    duration: { fr: "7 nuits Medine + 7 nuits Makkah", en: "7 nights Medina + 7 nights Makkah" },
    stars: 4,
    services: [{ fr: "", en: "" }],
    prices: [{ people: 4, val: "" }],
  };
}

function PackEditor({ pack, onChange, onDelete }: { pack: UmrahPack; onChange: (p: UmrahPack) => void; onDelete: () => void }) {
  const set = (patch: Partial<UmrahPack>) => onChange({ ...pack, ...patch });
  return (
    <Card onDelete={onDelete}>
      <div className="space-y-4 pr-20">
        <BiField label="Nom de la formule" value={pack.name} onChange={(v) => set({ name: v })} />
        <BiField label="Date de depart (badge)" value={pack.dateLabel} onChange={(v) => set({ dateLabel: v })} />
        <BiField
          label="Autres dates (petit texte, optionnel)"
          value={pack.otherDates ?? { fr: "", en: "" }}
          onChange={(v) => set({ otherDates: v })}
        />
        <BiField label="Duree" value={pack.duration} onChange={(v) => set({ duration: v })} />

        <div className="flex flex-wrap items-end gap-6">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal/50">
              Etoiles
            </span>
            <select
              value={pack.stars}
              onChange={(e) => set({ stars: Number(e.target.value) })}
              className="rounded-lg border border-charcoal/15 px-3 py-2 text-sm outline-none focus:border-gold"
            >
              {[3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} etoiles
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 pb-2 text-sm font-medium text-charcoal">
            <input
              type="checkbox"
              checked={!!pack.highlight}
              onChange={(e) => set({ highlight: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
            Mise en avant (carte doree "Le + choisi")
          </label>
        </div>

        {/* services */}
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-charcoal/50">
            Prestations incluses
          </span>
          <div className="space-y-2">
            {pack.services.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1">
                  <BiField
                    label={`Ligne ${i + 1}`}
                    value={s}
                    onChange={(v) => {
                      const services = [...pack.services];
                      services[i] = v;
                      set({ services });
                    }}
                  />
                </div>
                <button
                  onClick={() => set({ services: pack.services.filter((_, j) => j !== i) })}
                  className="mt-6 rounded-lg bg-red-50 px-2 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => set({ services: [...pack.services, { fr: "", en: "" }] })}
            className="mt-2 text-xs font-semibold text-gold hover:underline"
          >
            + Ajouter une prestation
          </button>
        </div>

        {/* prices by occupancy */}
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-charcoal/50">
            Prix par personne (selon l'occupation de la chambre), en DT
          </span>
          <div className="flex flex-wrap gap-3">
            {pack.prices.map((pr, i) => (
              <div key={i} className="flex items-end gap-1 rounded-xl bg-cream p-2">
                <label className="block">
                  <span className="mb-1 block text-[10px] font-semibold text-charcoal/50">Personnes</span>
                  <input
                    type="number"
                    min={1}
                    value={pr.people}
                    onChange={(e) => {
                      const prices = [...pack.prices];
                      prices[i] = { ...pr, people: Number(e.target.value) || 1 };
                      set({ prices });
                    }}
                    className="w-20 rounded-lg border border-charcoal/15 px-2 py-1.5 text-sm outline-none focus:border-gold"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] font-semibold text-charcoal/50">Prix</span>
                  <input
                    value={pr.val}
                    onChange={(e) => {
                      const prices = [...pack.prices];
                      prices[i] = { ...pr, val: e.target.value };
                      set({ prices });
                    }}
                    className="w-24 rounded-lg border border-charcoal/15 px-2 py-1.5 text-sm outline-none focus:border-gold"
                  />
                </label>
                <button
                  onClick={() => set({ prices: pack.prices.filter((_, j) => j !== i) })}
                  className="mb-1 rounded-lg bg-red-50 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => set({ prices: [...pack.prices, { people: 2, val: "" }] })}
            className="mt-2 text-xs font-semibold text-gold hover:underline"
          >
            + Ajouter un tarif
          </button>
        </div>
      </div>
    </Card>
  );
}

/* ----------------------------- Hotels editor ----------------------------- */
function emptyHotel(): Hotel {
  return {
    name: "Nouvel hotel",
    country: { fr: "", en: "" },
    city: { fr: "", en: "" },
    stars: 5,
    img: "/hotels/tunisia.jpg",
    price: "",
  };
}

function HotelEditor({ hotel, onChange, onDelete }: { hotel: Hotel; onChange: (h: Hotel) => void; onDelete: () => void }) {
  const set = (patch: Partial<Hotel>) => onChange({ ...hotel, ...patch });
  return (
    <Card onDelete={onDelete}>
      <div className="space-y-4 pr-20">
        <TextInput label="Nom de l'hotel" value={hotel.name} onChange={(v) => set({ name: v })} />
        <BiField label="Pays" value={hotel.country} onChange={(v) => set({ country: v })} />
        <BiField label="Ville" value={hotel.city} onChange={(v) => set({ city: v })} />
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal/50">
              Etoiles
            </span>
            <select
              value={hotel.stars}
              onChange={(e) => set({ stars: Number(e.target.value) })}
              className="w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm outline-none focus:border-gold"
            >
              {[3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} etoiles
                </option>
              ))}
            </select>
          </label>
          <TextInput label="Prix (ex: 630 DT)" value={hotel.price} onChange={(v) => set({ price: v })} />
          <TextInput label="Image (chemin)" value={hotel.img} onChange={(v) => set({ img: v })} />
        </div>
        <p className="text-xs text-charcoal/45">
          Astuce : l'upload de photos depuis le panneau arrivera avec la base de donnees. Pour l'instant, le
          champ image pointe vers une photo deja presente sur le site.
        </p>
      </div>
    </Card>
  );
}

/* ----------------------------- Contact editor ----------------------------- */
function ContactEditor({ business, onChange }: { business: Business; onChange: (b: Business) => void }) {
  const set = (patch: Partial<Business>) => onChange({ ...business, ...patch });
  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Nom de l'agence" value={business.name} onChange={(v) => set({ name: v })} />
        <TextInput label="Nom court" value={business.shortName} onChange={(v) => set({ shortName: v })} />
        <TextInput label="Telephone 1" value={business.phone} onChange={(v) => set({ phone: v })} />
        <TextInput label="Telephone 2" value={business.phone2} onChange={(v) => set({ phone2: v })} />
        <div className="sm:col-span-2">
          <TextInput label="Adresse" value={business.address} onChange={(v) => set({ address: v })} />
        </div>
        <TextInput label="Note Google (ex: 5.0)" value={business.rating} onChange={(v) => set({ rating: v })} />
        <TextInput
          label="Nombre d'avis"
          type="number"
          value={business.reviews}
          onChange={(v) => set({ reviews: Number(v) || 0 })}
        />
        <div className="sm:col-span-2">
          <TextInput label="Lien Facebook" value={business.facebook} onChange={(v) => set({ facebook: v })} />
        </div>
        <div className="sm:col-span-2">
          <TextInput label="Lien Instagram" value={business.instagram} onChange={(v) => set({ instagram: v })} />
        </div>
        <div className="sm:col-span-2">
          <TextInput
            label="Lien video YouTube (a afficher sur le site)"
            value={business.featuredVideoUrl}
            onChange={(v) => set({ featuredVideoUrl: v })}
          />
        </div>
      </div>
    </Card>
  );
}

/* ----------------------------- Login gate ----------------------------- */
function Login({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  return (
    <div className="grid min-h-screen place-items-center bg-charcoal px-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (pw === ADMIN_PASSWORD) {
            sessionStorage.setItem(AUTH_KEY, "1");
            onOk();
          } else {
            setErr(true);
          }
        }}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
      >
        <p className="font-display text-2xl font-bold text-charcoal">Espace administration</p>
        <p className="mt-1 text-sm text-charcoal/60">AlKarama Ibn Sina Tourisme</p>
        <div className="mt-6">
          <TextInput label="Mot de passe" type="password" value={pw} onChange={(v) => { setPw(v); setErr(false); }} />
        </div>
        {err && <p className="mt-2 text-sm text-red-600">Mot de passe incorrect.</p>}
        <button type="submit" className="btn-gold mt-6 w-full">
          Se connecter
        </button>
        <Link to="/" className="mt-4 block text-center text-xs text-charcoal/50 hover:text-gold">
          Retour au site
        </Link>
      </form>
    </div>
  );
}

/* ----------------------------- Main panel ----------------------------- */
export default function AdminPage() {
  const { content, save, reset } = useContent();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  const [draft, setDraft] = useState<Content>(() => clone(content));
  const [tab, setTab] = useState<Tab>("omra");
  const [savedFlash, setSavedFlash] = useState(false);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(content), [draft, content]);

  if (!authed) return <Login onOk={() => setAuthed(true)} />;

  const doSave = () => {
    save(draft);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  };

  const doReset = () => {
    if (!confirm("Reinitialiser tout le contenu aux valeurs d'origine ? Vos modifications seront perdues.")) return;
    reset();
    // reload so the panel re-seeds its draft from the freshly restored defaults
    setTimeout(() => window.location.reload(), 50);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "omra", label: "Formules Omra (accueil)" },
    { id: "omraMore", label: "Autres departs" },
    { id: "hotels", label: "Hotels" },
    { id: "contact", label: "Coordonnees" },
  ];

  const setPacks = (key: "umrahPacks" | "umrahMoreDepartures", packs: UmrahPack[]) =>
    setDraft({ ...draft, [key]: packs });

  return (
    <div className="min-h-screen bg-cream">
      {/* top bar */}
      <header className="sticky top-0 z-30 border-b border-charcoal/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
          <div>
            <p className="font-display text-lg font-bold leading-tight text-charcoal">Administration</p>
            <p className="text-xs text-charcoal/50">AlKarama Ibn Sina Tourisme</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {dirty && <span className="text-xs font-semibold text-amber-600">Modifications non enregistrees</span>}
            {savedFlash && <span className="text-xs font-semibold text-emerald-600">Enregistre</span>}
            <a href="/" target="_blank" rel="noreferrer" className="btn-outline !px-4 !py-2 !text-xs">
              Voir le site
            </a>
            <button onClick={doSave} disabled={!dirty} className="btn-gold !px-5 !py-2 !text-xs disabled:opacity-40">
              Enregistrer
            </button>
          </div>
        </div>
        {/* tabs */}
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 pb-2">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                tab === tb.id ? "bg-charcoal text-white" : "text-charcoal/60 hover:bg-charcoal/5"
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        {tab === "omra" && (
          <Section
            title="Formules Omra affichees sur l'accueil"
            note="Ces 3 formules apparaissent sur la page d'accueil et en haut de la page Omra."
          >
            <div className="space-y-5">
              {draft.umrahPacks.map((p, i) => (
                <PackEditor
                  key={i}
                  pack={p}
                  onChange={(np) => setPacks("umrahPacks", draft.umrahPacks.map((x, j) => (j === i ? np : x)))}
                  onDelete={() => setPacks("umrahPacks", draft.umrahPacks.filter((_, j) => j !== i))}
                />
              ))}
            </div>
            <div className="mt-5">
              <AddButton label="Ajouter une formule" onClick={() => setPacks("umrahPacks", [...draft.umrahPacks, emptyPack()])} />
            </div>
          </Section>
        )}

        {tab === "omraMore" && (
          <Section
            title="Autres departs et formules d'hotels"
            note="Formules supplementaires (page Omra complete). Memes champs que ci-dessus."
          >
            <div className="space-y-5">
              {draft.umrahMoreDepartures.map((p, i) => (
                <PackEditor
                  key={i}
                  pack={p}
                  onChange={(np) =>
                    setPacks("umrahMoreDepartures", draft.umrahMoreDepartures.map((x, j) => (j === i ? np : x)))
                  }
                  onDelete={() => setPacks("umrahMoreDepartures", draft.umrahMoreDepartures.filter((_, j) => j !== i))}
                />
              ))}
            </div>
            <div className="mt-5">
              <AddButton
                label="Ajouter un depart"
                onClick={() => setPacks("umrahMoreDepartures", [...draft.umrahMoreDepartures, emptyPack()])}
              />
            </div>
          </Section>
        )}

        {tab === "hotels" && (
          <Section title="Hotels" note="Cartes affichees sur l'accueil et la page Hotels.">
            <div className="space-y-5">
              {draft.hotels.map((h, i) => (
                <HotelEditor
                  key={i}
                  hotel={h}
                  onChange={(nh) => setDraft({ ...draft, hotels: draft.hotels.map((x, j) => (j === i ? nh : x)) })}
                  onDelete={() => setDraft({ ...draft, hotels: draft.hotels.filter((_, j) => j !== i) })}
                />
              ))}
            </div>
            <div className="mt-5">
              <AddButton label="Ajouter un hotel" onClick={() => setDraft({ ...draft, hotels: [...draft.hotels, emptyHotel()] })} />
            </div>
          </Section>
        )}

        {tab === "contact" && (
          <Section title="Coordonnees de l'agence" note="Utilisees dans la section Contact et le pied de page.">
            <ContactEditor business={draft.business} onChange={(b) => setDraft({ ...draft, business: b })} />
          </Section>
        )}

        {/* footer actions */}
        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-charcoal/10 pt-6">
          <button onClick={doSave} disabled={!dirty} className="btn-gold disabled:opacity-40">
            Enregistrer les modifications
          </button>
          <button onClick={doReset} className="text-sm font-semibold text-red-600 hover:underline">
            Reinitialiser tout
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem(AUTH_KEY);
              setAuthed(false);
            }}
            className="ml-auto text-sm font-semibold text-charcoal/50 hover:text-charcoal"
          >
            Se deconnecter
          </button>
        </div>
      </main>
    </div>
  );
}

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section>
      <h1 className="font-display text-2xl font-bold text-charcoal">{title}</h1>
      {note && <p className="mb-6 mt-1 text-sm text-charcoal/55">{note}</p>}
      {children}
    </section>
  );
}
