import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useContent, type Content, type Business } from "../store";
import { isSupabaseConfigured, supabase } from "../supabase";
import { uploadImage } from "../upload";
import type { UmrahPack, Hotel, HeroSlide, Destination, VisaCat } from "../data";

/*
  Admin panel.

  Login is adaptive:
    - CLOUD mode (Supabase keys set): real email + password login via Supabase Auth,
      one admin account = the client. Secure, works across devices.
    - LOCAL mode (no keys, offline demo): a simple front-end password gate. NOT real
      security, edits live only in this browser. Used only before the DB is set up.

  UI language: French only (the client's language). The CONTENT it edits stays
  bilingual FR + EN, both fields are editable for every text the visitor sees.
*/

const ADMIN_PASSWORD = "alkarama2026"; // local/offline demo only; ignored once Supabase is configured
const AUTH_KEY = "alkarama_admin_authed";
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

type Lg = { fr: string; en: string };
type Tab = "omra" | "omraMore" | "hotels" | "hero" | "visas" | "destinations" | "contact";

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

/* ----------------------------- Image field (upload or path) ----------------------------- */
// Replaces the old "image path" text input. In cloud mode the client uploads a photo
// (compressed in the browser, stored in Supabase Storage). The manual path field stays
// available as a fallback and for local mode.
function ImageField({
  label,
  value,
  onChange,
  folder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  folder: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file later
    if (!file) return;
    setErr("");
    setBusy(true);
    const res = await uploadImage(file, folder);
    setBusy(false);
    if (res.ok && res.url) onChange(res.url);
    else setErr(res.error || "Echec de l'upload.");
  };

  return (
    <div>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-charcoal/50">{label}</span>
      <div className="flex items-start gap-3">
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-charcoal/15 bg-cream">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-[10px] text-charcoal/40">Aucune image</div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          {isSupabaseConfigured ? (
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gold/60 px-3 py-2 text-xs font-semibold text-gold transition hover:bg-gold/5">
              <input type="file" accept="image/*" onChange={onFile} className="hidden" disabled={busy} />
              {busy ? "Envoi..." : "Choisir une photo"}
            </label>
          ) : (
            <p className="text-[11px] text-charcoal/45">
              L'upload de photos sera actif une fois la base de donnees configuree. Pour l'instant, indiquez un
              chemin d'image ci-dessous.
            </p>
          )}
          {err && <p className="text-xs text-red-600">{err}</p>}
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/hero/exemple.jpg ou une URL"
            className="w-full rounded-lg border border-charcoal/15 px-3 py-1.5 text-xs outline-none focus:border-gold"
          />
        </div>
      </div>
    </div>
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
        <ImageField label="Photo de la formule" value={pack.img ?? ""} onChange={(v) => set({ img: v })} folder="packs" />
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
function HotelEditor({ hotel, onChange, onDelete }: { hotel: Hotel; onChange: (h: Hotel) => void; onDelete?: () => void }) {
  const set = (patch: Partial<Hotel>) => onChange({ ...hotel, ...patch });
  return (
    <Card onDelete={onDelete}>
      <div className="space-y-4 pr-20">
        <TextInput label="Nom de l'hotel" value={hotel.name} onChange={(v) => set({ name: v })} />
        <BiField label="Pays" value={hotel.country} onChange={(v) => set({ country: v })} />
        <BiField label="Ville" value={hotel.city} onChange={(v) => set({ city: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
        <ImageField label="Photo de l'hotel" value={hotel.img} onChange={(v) => set({ img: v })} folder="hotels" />
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
        <TextInput label="Lien TikTok" value={business.tiktok} onChange={(v) => set({ tiktok: v })} />
        <TextInput label="Chaine YouTube (lien profil)" value={business.youtube} onChange={(v) => set({ youtube: v })} />
        <div className="sm:col-span-2">
          <TextInput label="Lien X (Twitter)" value={business.x} onChange={(v) => set({ x: v })} />
        </div>
        <p className="text-xs text-charcoal/45 sm:col-span-2">
          Astuce : laissez un champ vide pour masquer ce reseau sur le site (l'icone disparait automatiquement).
        </p>
        <div className="sm:col-span-2">
          <TextInput
            label="Lien video YouTube a afficher sur le site (section Video)"
            value={business.featuredVideoUrl}
            onChange={(v) => set({ featuredVideoUrl: v })}
          />
        </div>
      </div>
    </Card>
  );
}

/* ----------------------------- shared list helpers ----------------------------- */
// Editable list of plain strings (e.g. a visa category's country list).
function StringListEditor({ label, items, onChange, locked = false }: { label: string; items: string[]; onChange: (v: string[]) => void; locked?: boolean }) {
  return (
    <div>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-charcoal/50">{label}</span>
      <div className="flex flex-wrap gap-2">
        {items.map((c, i) => (
          <div key={i} className="flex items-center gap-1 rounded-lg bg-cream px-2 py-1">
            <input
              value={c}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
              className="w-36 rounded border border-charcoal/15 px-2 py-1 text-sm outline-none focus:border-gold"
            />
            {!locked && (
              <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="px-1 text-xs font-bold text-red-500">
                X
              </button>
            )}
          </div>
        ))}
      </div>
      {!locked && (
        <button onClick={() => onChange([...items, ""])} className="mt-2 text-xs font-semibold text-gold hover:underline">
          + Ajouter
        </button>
      )}
    </div>
  );
}

// Editable list of bilingual lines (e.g. the "included in your file" visa bullets).
function BiListEditor({ label, addLabel, items, onChange, locked = false }: { label: string; addLabel: string; items: Lg[]; onChange: (v: Lg[]) => void; locked?: boolean }) {
  return (
    <div>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-charcoal/50">{label}</span>
      <div className="space-y-2">
        {items.map((s, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1">
              <BiField label={`Ligne ${i + 1}`} value={s} onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} />
            </div>
            {!locked && (
              <button
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="mt-6 rounded-lg bg-red-50 px-2 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
              >
                X
              </button>
            )}
          </div>
        ))}
      </div>
      {!locked && (
        <button onClick={() => onChange([...items, { fr: "", en: "" }])} className="mt-2 text-xs font-semibold text-gold hover:underline">
          + {addLabel}
        </button>
      )}
    </div>
  );
}

/* ----------------------------- Hero editor ----------------------------- */
function HeroSlideEditor({ slide, onChange }: { slide: HeroSlide; onChange: (s: HeroSlide) => void }) {
  const set = (patch: Partial<HeroSlide>) => onChange({ ...slide, ...patch });
  const setCard = (patch: Partial<HeroSlide["card"]>) => onChange({ ...slide, card: { ...slide.card, ...patch } });
  return (
    <Card>
      <div className="space-y-4">
        <BiField label="Service (petit badge)" value={slide.service} onChange={(v) => set({ service: v })} />
        <BiField label="Titre principal" value={slide.headline} onChange={(v) => set({ headline: v })} />
        <BiField label="Sous-titre" value={slide.tagline} onChange={(v) => set({ tagline: v })} textarea />
        <ImageField label="Photo de fond" value={slide.img} onChange={(v) => set({ img: v })} folder="hero" />
        <ImageField
          label="Photo de la carte offre (optionnel)"
          value={slide.cardImg ?? ""}
          onChange={(v) => set({ cardImg: v })}
          folder="hero"
        />
        <div className="space-y-4 rounded-xl bg-cream p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-charcoal/50">Carte offre (encadre a droite)</p>
          <BiField label="Badge" value={slide.card.badge} onChange={(v) => setCard({ badge: v })} />
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
            <input
              type="checkbox"
              checked={!!slide.card.urgent}
              onChange={(e) => setCard({ urgent: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
            Badge d'urgence (rouge) au lieu du badge dore
          </label>
          <BiField label="Titre de l'offre" value={slide.card.title} onChange={(v) => setCard({ title: v })} />
          <BiField label="Sous-titre de l'offre" value={slide.card.sub} onChange={(v) => setCard({ sub: v })} />
          <TextInput label="Prix (optionnel, ex: des 4 250 DT)" value={slide.card.price ?? ""} onChange={(v) => setCard({ price: v })} />
          <TextInput label="Message WhatsApp du bouton" value={slide.card.waMsg} onChange={(v) => setCard({ waMsg: v })} />
        </div>
      </div>
    </Card>
  );
}

/* ----------------------------- Visas editor ----------------------------- */
function VisaCatEditor({ cat, onChange, onDelete }: { cat: VisaCat; onChange: (c: VisaCat) => void; onDelete?: () => void }) {
  const set = (patch: Partial<VisaCat>) => onChange({ ...cat, ...patch });
  return (
    <Card onDelete={onDelete}>
      <div className="space-y-4 pr-20">
        <BiField label="Nom de la categorie" value={cat.name} onChange={(v) => set({ name: v })} />
        <ImageField label="Photo" value={cat.img} onChange={(v) => set({ img: v })} folder="visas" />
        <StringListEditor label="Pays / types de visa" items={cat.countries} onChange={(v) => set({ countries: v })} locked />
      </div>
    </Card>
  );
}

/* ----------------------------- Destinations editor ----------------------------- */
function emptyDestination(): Destination {
  return {
    id: "dest-" + Math.floor(performance.now() % 1000000),
    img: "/hero/cairo.jpg",
    title: { fr: "Nouvelle destination", en: "New destination" },
    desc: { fr: "", en: "" },
    waMsg: "Bonjour, je suis interesse par ce voyage.",
    featured: true,
  };
}

function DestinationEditor({ dest, onChange, onDelete }: { dest: Destination; onChange: (d: Destination) => void; onDelete: () => void }) {
  const set = (patch: Partial<Destination>) => onChange({ ...dest, ...patch });
  return (
    <Card onDelete={onDelete}>
      <div className="space-y-4 pr-20">
        <BiField label="Titre" value={dest.title} onChange={(v) => set({ title: v })} />
        <BiField label="Description" value={dest.desc} onChange={(v) => set({ desc: v })} textarea />
        <ImageField label="Photo" value={dest.img} onChange={(v) => set({ img: v })} folder="destinations" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Prix a partir de (optionnel)" value={dest.priceFrom ?? ""} onChange={(v) => set({ priceFrom: v })} />
          <TextInput label="Message WhatsApp" value={dest.waMsg} onChange={(v) => set({ waMsg: v })} />
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
            <input
              type="checkbox"
              checked={!!dest.featured}
              onChange={(e) => set({ featured: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
            Afficher sur l'accueil (mise en avant)
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
            <input
              type="checkbox"
              checked={!!dest.promo}
              onChange={(e) => set({ promo: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
            Ruban PROMO
          </label>
        </div>
      </div>
    </Card>
  );
}

/* ----------------------------- Login gate ----------------------------- */
function Login({ onOk }: { onOk: () => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (isSupabaseConfigured && supabase) {
      setBusy(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      setBusy(false);
      if (error) {
        setErr("Email ou mot de passe incorrect.");
        return;
      }
      onOk();
    } else {
      if (pw === ADMIN_PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, "1");
        onOk();
      } else {
        setErr("Mot de passe incorrect.");
      }
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-charcoal px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <p className="font-display text-2xl font-bold text-charcoal">Espace administration</p>
        <p className="mt-1 text-sm text-charcoal/60">AlKarama Ibn Sina Tourisme</p>
        {isSupabaseConfigured && (
          <div className="mt-6">
            <TextInput label="Email" type="email" value={email} onChange={(v) => { setEmail(v); setErr(""); }} />
          </div>
        )}
        <div className="mt-4">
          <TextInput label="Mot de passe" type="password" value={pw} onChange={(v) => { setPw(v); setErr(""); }} />
        </div>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
        <button type="submit" disabled={busy} className="btn-gold mt-6 w-full disabled:opacity-50">
          {busy ? "Connexion..." : "Se connecter"}
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
  const { content, save, reset, loading, source } = useContent();
  const [authed, setAuthed] = useState(() =>
    isSupabaseConfigured ? false : sessionStorage.getItem(AUTH_KEY) === "1",
  );
  const [checkingSession, setCheckingSession] = useState(isSupabaseConfigured);
  const [draft, setDraft] = useState<Content | null>(null);
  const [tab, setTab] = useState<Tab>("omra");
  const [savedFlash, setSavedFlash] = useState(false);
  const [saveErr, setSaveErr] = useState("");

  // Cloud mode: restore an existing login session on mount.
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
      setCheckingSession(false);
    });
  }, []);

  // Seed the editable draft once content is ready (immediately in local mode,
  // after the cloud fetch completes in cloud mode).
  useEffect(() => {
    if (!loading && draft === null) setDraft(clone(content));
  }, [loading, content, draft]);

  const dirty = useMemo(
    () => draft !== null && JSON.stringify(draft) !== JSON.stringify(content),
    [draft, content],
  );

  if (checkingSession) return <FullScreenMsg text="Chargement..." />;
  if (!authed) return <Login onOk={() => setAuthed(true)} />;
  if (draft === null) return <FullScreenMsg text="Chargement du contenu..." />;

  const doSave = async () => {
    setSaveErr("");
    const res = await save(draft);
    if (res.ok) {
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2500);
    } else {
      setSaveErr(res.error || "Erreur lors de l'enregistrement.");
    }
  };

  const doReset = async () => {
    if (!confirm("Reinitialiser tout le contenu aux valeurs d'origine ? Vos modifications seront perdues.")) return;
    await reset();
    // reload so the panel re-seeds its draft from the freshly restored defaults
    setTimeout(() => window.location.reload(), 50);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "hero", label: "Accueil (hero)" },
    { id: "omra", label: "Formules Omra (accueil)" },
    { id: "omraMore", label: "Autres departs" },
    { id: "hotels", label: "Hotels" },
    { id: "destinations", label: "Destinations" },
    { id: "visas", label: "Visas" },
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
          <span
            className={`hidden rounded-full px-2.5 py-1 text-[10px] font-bold uppercase sm:inline ${
              source === "cloud" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}
            title={source === "cloud" ? "Connecte a la base de donnees" : "Mode local (navigateur uniquement)"}
          >
            {source === "cloud" ? "Cloud" : "Local"}
          </span>
          <div className="ml-auto flex items-center gap-2">
            {saveErr && <span className="text-xs font-semibold text-red-600">{saveErr}</span>}
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
          <Section title="Hotels" note="Cartes affichees sur l'accueil et la page Hotels. Modifiez le texte, la photo et le prix des hotels existants.">
            <div className="space-y-5">
              {draft.hotels.map((h, i) => (
                <HotelEditor
                  key={i}
                  hotel={h}
                  onChange={(nh) => setDraft({ ...draft, hotels: draft.hotels.map((x, j) => (j === i ? nh : x)) })}
                />
              ))}
            </div>
          </Section>
        )}

        {tab === "hero" && (
          <Section
            title="Section d'accueil (hero)"
            note="Les grandes diapositives en haut de la page d'accueil et leur carte offre, plus les logos partenaires."
          >
            <div className="space-y-5">
              {draft.heroSlides.map((s, i) => (
                <HeroSlideEditor
                  key={i}
                  slide={s}
                  onChange={(ns) => setDraft({ ...draft, heroSlides: draft.heroSlides.map((x, j) => (j === i ? ns : x)) })}
                />
              ))}
            </div>

            <h2 className="mt-10 font-display text-xl font-bold text-charcoal">Logos partenaires</h2>
            <p className="mb-4 mt-1 text-sm text-charcoal/55">Bandeau defilant sur la photo d'accueil.</p>
            <div className="space-y-4">
              {draft.heroPartners.map((p, i) => {
                const setP = (patch: Partial<typeof p>) =>
                  setDraft({ ...draft, heroPartners: draft.heroPartners.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
                return (
                  <Card key={i}>
                    <div className="space-y-4">
                      <TextInput label="Nom du partenaire" value={p.name} onChange={(v) => setP({ name: v })} />
                      {p.img === undefined && p.text !== undefined ? (
                        <TextInput label="Texte (si pas de logo)" value={p.text ?? ""} onChange={(v) => setP({ text: v })} />
                      ) : (
                        <ImageField label="Logo" value={p.img ?? ""} onChange={(v) => setP({ img: v })} folder="partners" />
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </Section>
        )}

        {tab === "destinations" && (
          <Section
            title="Destinations"
            note="Cartes affichees dans la section Nos Packs (accueil) et sur la page Destinations. Cochez 'accueil' pour les afficher en page d'accueil."
          >
            <div className="space-y-5">
              {draft.destinations.map((d, i) => (
                <DestinationEditor
                  key={i}
                  dest={d}
                  onChange={(nd) => setDraft({ ...draft, destinations: draft.destinations.map((x, j) => (j === i ? nd : x)) })}
                  onDelete={() => setDraft({ ...draft, destinations: draft.destinations.filter((_, j) => j !== i) })}
                />
              ))}
            </div>
            <div className="mt-5">
              <AddButton
                label="Ajouter une destination"
                onClick={() => setDraft({ ...draft, destinations: [...draft.destinations, emptyDestination()] })}
              />
            </div>
          </Section>
        )}

        {tab === "visas" && (
          <Section title="Visas" note="Categories affichees sur l'accueil et la page Visas, et la liste des prestations incluses.">
            <div className="mb-8 rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
              <BiListEditor
                label="Inclus dans chaque dossier (affiche sur toutes les cartes visa)"
                addLabel="Ajouter une prestation"
                items={draft.visaIncludes}
                onChange={(v) => setDraft({ ...draft, visaIncludes: v })}
                locked
              />
            </div>
            <div className="space-y-5">
              {draft.visaCats.map((c, i) => (
                <VisaCatEditor
                  key={i}
                  cat={c}
                  onChange={(nc) => setDraft({ ...draft, visaCats: draft.visaCats.map((x, j) => (j === i ? nc : x)) })}
                />
              ))}
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
            onClick={async () => {
              if (isSupabaseConfigured && supabase) await supabase.auth.signOut();
              else sessionStorage.removeItem(AUTH_KEY);
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

function FullScreenMsg({ text }: { text: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-cream">
      <p className="text-sm font-medium text-charcoal/60">{text}</p>
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
