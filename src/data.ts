import type { Lang } from "./i18n";

type L = Record<Lang, string>;

export const business = {
  name: "AlKarama Ibn Sina Tourisme",
  shortName: "AlKarama",
  phone: "93 996 300",
  phone2: "90 007 555",
  phoneIntl: "21693996300",
  address: "Carrefour Market Avicenne, Centre Commercial Lawand Ibn Sina, Tunis 2066",
  rating: "5.0",
  reviews: 15,
  facebook: "https://www.facebook.com/p/ALKarama-Tourisme-Ibn-Sina-Agency-61581158354727/",
  instagram: "https://www.instagram.com/alkarama.ibnsina.agency/",
  tiktok: "https://www.tiktok.com/@alkaramaibnsina",
  // Empty until the client sends the real handles. The UI hides any social whose URL is blank,
  // so filling these strings later is all it takes to switch them on.
  x: "",
  youtube: "",
};

export const wa = (msg: string) =>
  `https://wa.me/${business.phoneIntl}?text=${encodeURIComponent(msg)}`;

// The booking form opens the visitor's email app with this pre-filled as the recipient
// (no backend yet, so there is no way to silently deliver the email without it).
export const bookingEmail = "alkrama.ibnsina@gmail.com";

/* ---------- HERO (4 service slides, EliteMasar style) ---------- */
export type HeroSlide = {
  id: string;
  img: string;
  cardImg?: string; // optional: photo used in the small offer card, if different from the background
  service: L;
  headline: L;
  tagline: L;
  card: {
    badge: L;
    urgent?: boolean; // true = red urgency badge (limited seats), false/undefined = gold promo badge
    title: L;
    sub: L;
    price?: string;
    waMsg: string;
    formLink?: string; // if set, the book button navigates here instead of opening WhatsApp
  };
};

export const heroSlides: HeroSlide[] = [
  {
    id: "omra",
    img: "/hero/hajj.png",
    cardImg: "/hero/mecca.jpg",
    service: { fr: "Packs Omra", en: "Umrah Packages" },
    headline: { fr: "Vivez votre Omra en toute serenite", en: "Live your Umrah in serenity" },
    tagline: {
      fr: "Encadrement complet, hotels face au Haram, en partenariat avec Al Morchidoun.",
      en: "Full guidance, hotels facing the Haram, in partnership with Al Morchidoun.",
    },
    card: {
      badge: { fr: "Plus que 4 places", en: "Only 4 seats left" },
      urgent: true,
      title: { fr: "Omra Mawlid 2026", en: "Umrah Mawlid 2026" },
      sub: { fr: "7 nuits Medine + 7 nuits Makkah", en: "7 nights Medina + 7 nights Makkah" },
      price: "des 4 250 DT",
      waMsg: "Bonjour, je suis interesse par l'Omra Mawlid 2026.",
    },
  },
  {
    id: "hotels",
    img: "/hero/resort.jpg",
    service: { fr: "Hotels et Sejours", en: "Hotels and Stays" },
    headline: { fr: "Des sejours qui vous ressemblent", en: "Stays made for you" },
    tagline: {
      fr: "Turquie, Egypte et plus encore. Vols, hotels et excursions inclus.",
      en: "Turkey, Egypt and beyond. Flights, hotels and excursions included.",
    },
    card: {
      badge: { fr: "Offre du moment", en: "Featured offer" },
      title: { fr: "Le Caire - Charm el-Cheikh", en: "Cairo - Sharm el-Sheikh" },
      sub: { fr: "8j / 7n - 4* Nil + All Inclusive", en: "8d / 7n - 4* Nile + All Inclusive" },
      price: "3 990 DT",
      waMsg: "Bonjour, je suis interesse par le sejour Le Caire - Charm el-Cheikh.",
    },
  },
  {
    id: "visas",
    img: "/hero/vienna-austria.jpg",
    cardImg: "/hero/visas-france.jpg",
    service: { fr: "Visas", en: "Visas" },
    headline: { fr: "Votre visa, sans stress", en: "Your visa, stress free" },
    tagline: {
      fr: "Constitution du dossier et accompagnement pour le Golfe, l'Europe et l'Asie.",
      en: "File preparation and support for the Gulf, Europe and Asia.",
    },
    card: {
      badge: { fr: "Offre Visa", en: "Visa offer" },
      title: { fr: "Visa Schengen", en: "Schengen Visa" },
      sub: { fr: "Dossier complet + prise de rendez-vous", en: "Full file + appointment booking" },
      waMsg: "Bonjour, je souhaite des informations sur le visa Schengen.",
    },
  },
  {
    id: "billets",
    img: "/hero/plane.jpg",
    service: { fr: "Billets Avion et Bateau", en: "Flight and Ferry Tickets" },
    headline: { fr: "Partez au meilleur prix", en: "Travel at the best price" },
    tagline: {
      fr: "Billets d'avion et de bateau, toutes compagnies, emis le jour meme.",
      en: "Flight and ferry tickets, all carriers, issued same day.",
    },
    card: {
      badge: { fr: "Meilleurs prix", en: "Best prices" },
      title: { fr: "Vols et traversees", en: "Flights and crossings" },
      sub: { fr: "Comparez et reservez en une minute", en: "Compare and book in a minute" },
      waMsg: "Bonjour, je cherche un billet d'avion / de bateau.",
      formLink: "/reserver-billet",
    },
  },
];

/* ---------- Partners ---------- */
export const morchidoun = { name: "Al Morchidoun", img: "/partners/morchidoun.jpeg" };

// White monochrome logos overlaid on the hero photo (EliteMasar style)
// order deliberately mixed so it does not read as a copy of the reference site
export const heroPartners: { name: string; img?: string; text?: string }[] = [
  { name: "Saudi Tourism Authority", img: "/partners/saudi.png" },
  { name: "Amadeus", text: "amadeus" },
  { name: "Al Morchidoun", img: "/partners/morchidoun-white.png" },
  { name: "Inspiring Tunisia", img: "/partners/tunisia.png" },
  { name: "IATA", img: "/partners/iata.png" },
  { name: "Go Turkiye", img: "/partners/turkiye.png" },
];

// Full-color partner logos for the dedicated "Nos Partenaires" section (client asked for color, not the white hero overlay).
export const colorPartners: { name: string; img: string }[] = [
  { name: "Al Morchidoun", img: "/partners/morchidoun-color.jpeg" },
  { name: "Saudi Tourism Authority", img: "/partners/saudi-color.png" },
  { name: "IATA", img: "/partners/iata-color.png" },
  { name: "Inspiring Tunisia", img: "/partners/tunisia-color.png" },
  { name: "Go Turkiye", img: "/partners/turkiye-color.png" },
];

/* ---------- Travel packs & extra services (image cards, EliteMasar "Destinations Packs" style) ---------- */
// New service lines requested by the client. Photos are PLACEHOLDERS from existing assets
// until he sends real images and prices for each.
export const travelPacks: { id: string; img: string; title: L; desc: L; waMsg: string }[] = [
  {
    id: "voyage",
    img: "/hero/cappadocia.jpg",
    title: { fr: "Voyage Organise", en: "Organized Trips" },
    desc: { fr: "Circuits cles en main : vols, hotels et excursions.", en: "Turnkey trips: flights, hotels and excursions." },
    waMsg: "Bonjour, je suis interesse par un voyage organise.",
  },
  {
    id: "transfert",
    img: "/hero/dubai.jpg",
    title: { fr: "Transfert", en: "Transfers" },
    desc: { fr: "Transferts aeroport et deplacements sur place.", en: "Airport transfers and local transport." },
    waMsg: "Bonjour, je souhaite un service de transfert.",
  },
  {
    id: "bungalows",
    img: "/hero/resort.jpg",
    title: { fr: "Location de Bungalows", en: "Bungalow Rental" },
    desc: { fr: "Sejours en bungalows, ideal familles et groupes.", en: "Bungalow stays, ideal for families and groups." },
    waMsg: "Bonjour, je souhaite louer un bungalow.",
  },
];

/* ---------- Umrah packages (real data from the 2026 flyers) ---------- */
// Flyer "Juillet-Aout 2026": 2 tiers (Essentiel/VIP), same price on all 6 dates: 20, 23, 27 juillet + 3, 6, 10 aout.
// Flyer "Mawlid Ennabaoui" (25 aout 2026): 7 hotel tiers for that single date.
// Homepage shows 3 featured packs (2 normal + 1 VIP); the rest live in umrahMoreDepartures for the future "Decouvrir tout" page.
export type UmrahPack = {
  name: L;
  img?: string;
  dateLabel: L;
  otherDates?: L;
  duration: L;
  stars: number;
  highlight?: boolean;
  services: L[];
  notIncluded?: L; // optional "Non inclus" line
  prices: { people: number; val: string }[];
  priceNote?: L; // shown instead of the price grid when prices are not yet available
};

// Season 2026-2027 tiers requested by the client: Classique / Confort / Prestige / VIP+ / A la Carte.
// These reuse the client's own REAL flyer data (hotels + prices + dates), remapped onto his new
// tier names as an ascending comfort ladder. NOTE for continuity: Classique uses the summer flyer
// (Essentiel 4*); Confort/Prestige/VIP+ use the real Mawlid Ennabaoui (25 aout) hotel ladder, so
// their departure date differs from Classique. Every number/hotel here is REAL and published by the
// client. A la Carte is the only "sur demande" card. The client should confirm the final mapping.
const NIGHTS: L = { fr: "7 nuits Medine + 7 nuits Makkah", en: "7 nights Medina + 7 nights Makkah" };
const NOT_INCLUDED: L = { fr: "Non inclus : timbre de voyage", en: "Not included: travel stamp" };
const FLIGHT: L = { fr: "Vol Tunis - Jeddah - Tunis (Tunisair / Saudia)", en: "Flight Tunis - Jeddah - Tunis (Tunisair / Saudia)" };
const INCLUDED: L = { fr: "Inclus : transfert, assurance, visa Omra, mazarat", en: "Included: transfer, insurance, Umrah visa, ziyarat" };
const MAWLID_DATE: L = { fr: "Depart 25 aout 2026 (Mawlid Ennabaoui)", en: "Departure August 25, 2026 (Mawlid)" };

export const umrahPacks: UmrahPack[] = [
  {
    name: { fr: "Classique", en: "Classique" },
    img: "/hero/omra-essentiel.png",
    dateLabel: { fr: "Departs 20, 23, 27 juillet 2026", en: "Departs July 20, 23, 27, 2026" },
    otherDates: { fr: "Aussi les 3, 6, 10 aout 2026", en: "Also August 3, 6, 10, 2026" },
    duration: NIGHTS,
    stars: 4,
    services: [
      FLIGHT,
      { fr: "Makkah : Ramada Dar Faiezine 4*", en: "Makkah: Ramada Dar Faiezine 4*" },
      { fr: "Medine : Arkan Al Manar 4* ou Abraj Tabah 4*", en: "Medina: Arkan Al Manar 4* or Abraj Tabah 4*" },
      INCLUDED,
    ],
    notIncluded: NOT_INCLUDED,
    prices: [
      { people: 4, val: "4 250" },
      { people: 3, val: "4 650" },
      { people: 2, val: "5 250" },
    ],
  },
  {
    name: { fr: "Confort", en: "Confort" },
    img: "/hero/omra-mawlid.png",
    dateLabel: MAWLID_DATE,
    duration: NIGHTS,
    stars: 4,
    services: [
      FLIGHT,
      { fr: "Makkah : Manarat Ghazah 4*", en: "Makkah: Manarat Ghazah 4*" },
      { fr: "Medine : Arkan Al Manar (100m Haram, zone nord)", en: "Medina: Arkan Al Manar (100m from Haram, north zone)" },
      INCLUDED,
    ],
    notIncluded: NOT_INCLUDED,
    prices: [
      { people: 4, val: "4 550" },
      { people: 3, val: "4 850" },
      { people: 2, val: "5 300" },
    ],
  },
  {
    name: { fr: "Prestige", en: "Prestige" },
    img: "/hero/omra-vip.png",
    dateLabel: MAWLID_DATE,
    duration: NIGHTS,
    stars: 5,
    services: [
      FLIGHT,
      { fr: "Makkah : Ash-Shuhada 5*, petit-dejeuner, rue Ajyad", en: "Makkah: Ash-Shuhada 5*, breakfast, Ajyad street" },
      { fr: "Medine : Arkan Al Manar (100m Haram, zone nord)", en: "Medina: Arkan Al Manar (100m from Haram, north zone)" },
      INCLUDED,
    ],
    notIncluded: NOT_INCLUDED,
    prices: [
      { people: 4, val: "5 400" },
      { people: 3, val: "5 850" },
      { people: 2, val: "6 400" },
    ],
  },
  {
    name: { fr: "VIP+", en: "VIP+" },
    img: "/hero/omra-vip.png",
    dateLabel: MAWLID_DATE,
    duration: NIGHTS,
    stars: 5,
    highlight: true,
    services: [
      FLIGHT,
      { fr: "Makkah : Abraj Al Safwa 5*, vue Haram, petit-dejeuner", en: "Makkah: Abraj Al Safwa 5*, Haram view, breakfast" },
      { fr: "Medine : Arkan Al Manar (100m Haram, zone nord)", en: "Medina: Arkan Al Manar (100m from Haram, north zone)" },
      INCLUDED,
    ],
    notIncluded: NOT_INCLUDED,
    prices: [
      { people: 4, val: "5 850" },
      { people: 3, val: "6 300" },
      { people: 2, val: "6 950" },
    ],
  },
  {
    name: { fr: "A la Carte", en: "A la Carte" },
    img: "/hero/omra-essentiel.png",
    dateLabel: { fr: "Formule sur mesure", en: "Tailor-made package" },
    duration: NIGHTS,
    stars: 5,
    services: [
      { fr: "Voyage personnalise selon vos souhaits : hotels, dates, duree et categorie", en: "Fully customized trip: hotels, dates, duration and category" },
      { fr: "Ideal pour familles et groupes", en: "Ideal for families and groups" },
    ],
    prices: [],
    priceNote: { fr: "Devis personnalise sur demande", en: "Custom quote on request" },
  },
];

// Other Mawlid Ennabaoui (25 aout 2026) hotel tiers, real data from the flyer, not yet shown
// on the site: waiting on the "Decouvrir tout" full listing page.
export const umrahMoreDepartures: UmrahPack[] = [
  {
    name: { fr: "Mawlid - Al Ayyam", en: "Mawlid - Al Ayyam" },
    dateLabel: { fr: "25 aout 2026", en: "August 25, 2026" },
    duration: { fr: "7 nuits Medine + 7 nuits Makkah", en: "7 nights Medina + 7 nights Makkah" },
    stars: 4,
    services: [
      { fr: "Makkah : Al Ayyam - Badr Massa 4*, rue Ajyad", en: "Makkah: Al Ayyam - Badr Massa 4*, Ajyad street" },
      { fr: "Medine : Abraj Taba (face au Haram, zone nord)", en: "Medina: Abraj Taba (facing the Haram, north zone)" },
      { fr: "Vol Tunisair / Saudia aller-retour", en: "Tunisair / Saudia round-trip flight" },
      { fr: "Visa Omra + transferts + excursions (ziyarat)", en: "Umrah visa + transfers + excursions (ziyarat)" },
    ],
    prices: [
      { people: 4, val: "4 750" },
      { people: 3, val: "5 200" },
      { people: 2, val: "5 600" },
    ],
  },
  {
    name: { fr: "Mawlid - Anfanti", en: "Mawlid - Anfanti" },
    dateLabel: { fr: "25 aout 2026", en: "August 25, 2026" },
    duration: { fr: "7 nuits Medine + 7 nuits Makkah", en: "7 nights Medina + 7 nights Makkah" },
    stars: 5,
    services: [
      { fr: "Makkah : Anfanti 5*, rue Ajyad", en: "Makkah: Anfanti 5*, Ajyad street" },
      { fr: "Medine : Arkan Al Manar (100m Haram, zone nord)", en: "Medina: Arkan Al Manar (100m from Haram, north zone)" },
      { fr: "Vol Tunisair / Saudia aller-retour", en: "Tunisair / Saudia round-trip flight" },
      { fr: "Visa Omra + transferts + excursions (ziyarat)", en: "Umrah visa + transfers + excursions (ziyarat)" },
    ],
    prices: [
      { people: 4, val: "4 850" },
      { people: 3, val: "5 350" },
      { people: 2, val: "5 800" },
    ],
  },
  {
    name: { fr: "Mawlid - Ramada", en: "Mawlid - Ramada" },
    dateLabel: { fr: "25 aout 2026", en: "August 25, 2026" },
    duration: { fr: "7 nuits Medine + 7 nuits Makkah", en: "7 nights Medina + 7 nights Makkah" },
    stars: 4,
    services: [
      { fr: "Makkah : Ramada 4* Massa Al Faizeen", en: "Makkah: Ramada 4* Massa Al Faizeen" },
      { fr: "Medine : Abraj Taba (face au Haram, zone nord)", en: "Medina: Abraj Taba (facing the Haram, north zone)" },
      { fr: "Vol Tunisair / Saudia aller-retour", en: "Tunisair / Saudia round-trip flight" },
      { fr: "Visa Omra + transferts + excursions (ziyarat)", en: "Umrah visa + transfers + excursions (ziyarat)" },
    ],
    prices: [
      { people: 4, val: "4 950" },
      { people: 3, val: "5 450" },
      { people: 2, val: "5 900" },
    ],
  },
  {
    name: { fr: "Mawlid - Hilton Marriott", en: "Mawlid - Hilton Marriott" },
    dateLabel: { fr: "25 aout 2026", en: "August 25, 2026" },
    duration: { fr: "7 nuits Medine + 7 nuits Makkah", en: "7 nights Medina + 7 nights Makkah" },
    stars: 5,
    services: [
      { fr: "Makkah : Hilton Marriott 5*, vue Haram, avec petit-dejeuner", en: "Makkah: Hilton Marriott 5*, Haram view, breakfast included" },
      { fr: "Medine : Abraj Taba (face au Haram, zone nord)", en: "Medina: Abraj Taba (facing the Haram, north zone)" },
      { fr: "Vol Tunisair / Saudia aller-retour", en: "Tunisair / Saudia round-trip flight" },
      { fr: "Visa Omra + transferts + excursions (ziyarat)", en: "Umrah visa + transfers + excursions (ziyarat)" },
    ],
    prices: [
      { people: 4, val: "5 650" },
      { people: 3, val: "6 100" },
      { people: 2, val: "6 800" },
    ],
  },
];

/* ---------- Hotels (3 cards) ---------- */
export type Hotel = {
  name: string;
  country: L;
  city: L;
  stars: number;
  img: string;
  price: string; // placeholder until real rates are provided
};

export const hotels: Hotel[] = [
  {
    name: "Four Seasons Hotel Tunis",
    country: { fr: "Tunisie", en: "Tunisia" },
    city: { fr: "Gammarth, Tunis", en: "Gammarth, Tunis" },
    stars: 5,
    img: "/hotels/tunisia.jpg",
    price: "1 550 DT",
  },
  {
    name: "Makkah Clock Royal Tower, A Fairmont Hotel",
    country: { fr: "Arabie Saoudite", en: "Saudi Arabia" },
    city: { fr: "La Mecque", en: "Makkah" },
    stars: 5,
    img: "/hotels/mecca.jpg",
    price: "630 DT",
  },
  {
    name: "Swissotel The Bosphorus",
    country: { fr: "Turquie", en: "Turkey" },
    city: { fr: "Istanbul", en: "Istanbul" },
    stars: 5,
    img: "/hotels/istanbul.jpg",
    price: "915 DT",
  },
];

/* ---------- Visas (3 categories) ---------- */
export type VisaCat = {
  name: L;
  img: string;
  countries: string[];
};

export const visaCats: VisaCat[] = [
  {
    name: { fr: "Pays Arabes", en: "Arab countries" },
    img: "/visas/dubai.png",
    countries: ["Emirats (UAE)", "Qatar", "Koweit", "Egypte"],
  },
  {
    name: { fr: "Europe (Schengen)", en: "Europe (Schengen)" },
    img: "/visas/europe.jpg",
    countries: ["France", "Espagne", "Italie", "Allemagne", "Belgique", "Portugal"],
  },
  {
    name: { fr: "Arabie Saoudite", en: "Saudi Arabia" },
    img: "/visas/ksa.jpg",
    countries: ["Visa Omra", "Visa touristique", "Visa Hajj"],
  },
];

// what the client gets with any visa file (shown on every visa card)
export const visaIncludes: L[] = [
  { fr: "Constitution complete du dossier", en: "Full file preparation" },
  { fr: "Prise de rendez-vous au consulat", en: "Consulate appointment booking" },
  { fr: "Assurance voyage incluse", en: "Travel insurance included" },
  { fr: "Suivi jusqu'a l'obtention", en: "Follow-up until approval" },
];

/* ---------- Tickets (plane + ferry) ---------- */
export const billetsCards: { id: string; img: string; title: L; desc: L }[] = [
  {
    id: "avion",
    img: "/billets/plane.jpg",
    title: { fr: "Billets d'avion", en: "Flight tickets" },
    desc: {
      fr: "Tunisair, Saudia, Turkish et plus. Toutes destinations, tarifs negocies, emis le jour meme.",
      en: "Tunisair, Saudia, Turkish and more. All destinations, negotiated fares, issued same day.",
    },
  },
  {
    id: "bateau",
    img: "/billets/boat.jpg",
    title: { fr: "Billets de bateau", en: "Ferry tickets" },
    desc: {
      fr: "Traversees vers l'Europe (France, Italie). Reservation rapide et confirmee.",
      en: "Crossings to Europe (France, Italy). Fast confirmed booking.",
    },
  },
];

/* ---------- Why us ---------- */
export type WhyItem = { icon: string; title: L };
export const whyUs: WhyItem[] = [
  { icon: "shield", title: { fr: "Agence agreee en Tunisie", en: "Licensed agency in Tunisia" } },
  { icon: "star", title: { fr: "5.0 sur Google", en: "5.0 on Google" } },
  { icon: "handshake", title: { fr: "Partenaire Al Morchidoun", en: "Al Morchidoun partner" } },
  { icon: "clock", title: { fr: "Billets emis le jour meme", en: "Same-day ticketing" } },
  { icon: "globe", title: { fr: "Visas tous continents", en: "Visas, all continents" } },
  { icon: "heart", title: { fr: "Accompagnement humain", en: "Real human support" } },
];

/* ---------- Reviews (real, from Google, translated by Adam/Google Translate) ---------- */
export type Review = { name: string; city: L; stars: number; text: L };
export const reviews: Review[] = [
  {
    name: "Essaim Ben Chorod",
    city: { fr: "Tunis", en: "Tunis" },
    stars: 5,
    text: {
      fr: "Une parole de verite devant Dieu Tout-Puissant : les personnes qui craignent Dieu dans leur traitement des pelerins ne font que ce qui Lui plait. Leur bonne humeur, leur gentillesse et leur service de tout premier ordre sont vraiment a saluer.",
      en: "A word of truth before God Almighty: people who fear God in their treatment of pilgrims only do what pleases Him. Their cheerfulness, kindness and top-notch service are truly commendable.",
    },
  },
  {
    name: "Chaib Amna",
    city: { fr: "Tunis", en: "Tunis" },
    stars: 5,
    text: {
      fr: "Nous adressons nos sinceres remerciements a l'agence de voyage pour son efficacite, sa gentillesse et la qualite de ses services.",
      en: "We extend our sincere gratitude to the travel agency for its efficiency, kindness and the quality of its services.",
    },
  },
  {
    name: "Rafia Temimi",
    city: { fr: "Tunis", en: "Tunis" },
    stars: 5,
    text: {
      fr: "Honnetement, et sans exagerer, l'agence Al Karama Travel est le meilleur choix que vous puissiez faire. Ils offrent un excellent service et les meilleurs accompagnateurs qui soient, des gens aux manieres formidables.",
      en: "Honestly, and without exaggeration, Al Karama Travel Agency is the best choice you can make. They offer excellent service and the best companions, people with wonderful manners.",
    },
  },
];
