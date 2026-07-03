import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

type Dict = Record<string, { fr: string; en: string }>;

export const t: Dict = {
  "nav.home": { fr: "Accueil", en: "Home" },
  "nav.omra": { fr: "Packs Omra", en: "Umrah Packages" },
  "nav.packs": { fr: "Nos Packs", en: "Our Packs" },
  "nav.hotels": { fr: "Hotels", en: "Hotels" },
  "nav.visas": { fr: "Visas", en: "Visas" },
  "nav.billets": { fr: "Billets", en: "Tickets" },
  "nav.services": { fr: "Nos Services", en: "Our Services" },
  "nav.reviews": { fr: "Avis", en: "Reviews" },
  "nav.contact": { fr: "Contact", en: "Contact" },
  "nav.cta": { fr: "Contactez-nous", en: "Contact us" },

  "hero.book": { fr: "Reserver", en: "Book" },
  "hero.call": { fr: "Nous appeler", en: "Call us" },

  "common.discoverAll": { fr: "Decouvrir tout", en: "View all" },
  "common.bookNow": { fr: "Reserver", en: "Book now" },
  "visas.included": { fr: "Inclus dans votre dossier", en: "Included in your file" },
  "visas.apply": { fr: "Demander le visa", en: "Apply for visa" },

  "omra.kicker": { fr: "Packs Omra", en: "Umrah Packages" },
  "omra.title": { fr: "Nos Formules Omra saison 2026-2027", en: "Our Umrah packages, 2026-2027 season" },
  "omra.sub": {
    fr: "7 nuits a Medine et 7 nuits a Makkah, en partenariat avec Al Morchidoun. Prix par personne selon l'occupation de la chambre.",
    en: "7 nights in Medina and 7 in Makkah, in partnership with Al Morchidoun. Price per person by room occupancy.",
  },
  "omra.partner": { fr: "Partenaire officiel", en: "Official partner" },
  "omra.quad": { fr: "Quadruple", en: "Quad" },
  "omra.triple": { fr: "Triple", en: "Triple" },
  "omra.double": { fr: "Double", en: "Double" },
  "omra.perPerson": { fr: "/ personne", en: "/ person" },
  "omra.popular": { fr: "Le + choisi", en: "Most chosen" },
  "omra.people": { fr: "pers.", en: "pers." },
  "omra.priceLabel": { fr: "Prix / personne selon la chambre", en: "Price / person by room" },

  "hotels.kicker": { fr: "Hotels et Sejours", en: "Hotels and Stays" },
  "hotels.title": { fr: "Nos hotels selectionnes", en: "Our selected hotels" },
  "hotels.sub": {
    fr: "Une adresse d'exception en Tunisie, en Arabie Saoudite et en Europe.",
    en: "A standout address in Tunisia, Saudi Arabia and Europe.",
  },
  "hotels.book": { fr: "Reserver", en: "Book" },
  "hotels.night": { fr: "/ nuit", en: "/ night" },

  "visas.kicker": { fr: "Visas", en: "Visas" },
  "visas.title": { fr: "Nos formules visa", en: "Our visa packages" },
  "visas.sub": {
    fr: "Dossier complet et accompagnement, du depot au rendez-vous.",
    en: "Full file and support, from submission to appointment.",
  },
  "visas.cta": { fr: "Demander ce visa", en: "Request this visa" },

  "billets.kicker": { fr: "Billetterie", en: "Ticketing" },
  "billets.title": { fr: "Billets avion et bateau", en: "Flight and ferry tickets" },
  "billets.sub": {
    fr: "Toutes compagnies, toutes destinations, emis le jour meme.",
    en: "All carriers, all destinations, issued same day.",
  },
  "billets.air": { fr: "Billets d'avion", en: "Flight tickets" },
  "billets.airdesc": {
    fr: "Tunisair, Saudia, Turkish et plus. Tarifs negocies.",
    en: "Tunisair, Saudia, Turkish and more. Negotiated fares.",
  },
  "billets.ferry": { fr: "Billets de bateau", en: "Ferry tickets" },
  "billets.ferrydesc": {
    fr: "Traversees vers l'Europe, reservation confirmee.",
    en: "Crossings to Europe, confirmed booking.",
  },

  "why.kicker": { fr: "Pourquoi nous", en: "Why us" },
  "why.title": { fr: "Une agence, pas un intermediaire", en: "An agency, not a middleman" },

  "partners.title": { fr: "Nos partenaires et affiliations", en: "Our partners and affiliations" },
  "partners.kicker": { fr: "Ils nous accompagnent", en: "They work with us" },
  "partners.sub": {
    fr: "Des partenaires officiels reconnus pour un voyage en toute confiance.",
    en: "Recognized official partners for a trip you can trust.",
  },

  "packs.kicker": { fr: "Nos Packs", en: "Our Packs" },
  "packs.title": { fr: "Packs Voyage et Services", en: "Travel Packs and Services" },
  "packs.sub": {
    fr: "Voyages organises, transferts et location de bungalows. Contactez-nous pour un devis.",
    en: "Organized trips, transfers and bungalow rentals. Contact us for a quote.",
  },

  "connect.kicker": { fr: "Reseaux sociaux", en: "Social media" },
  "connect.title": { fr: "Connectez-vous avec nous", en: "Connect with us" },
  "connect.sub": {
    fr: "Suivez nos offres, nos inspirations voyage et nos nouveautes sur nos reseaux.",
    en: "Follow our offers, travel inspiration and news on our channels.",
  },
  "connect.follow": { fr: "Suivre", en: "Follow" },

  "reviews.kicker": { fr: "Avis clients", en: "Reviews" },
  "reviews.title": { fr: "Ils nous font confiance", en: "They trust us" },
  "reviews.sub": { fr: "5.0 sur 15 avis Google", en: "5.0 from 15 Google reviews" },

  "contact.kicker": { fr: "Contact", en: "Contact" },
  "contact.title": { fr: "Parlons de votre voyage", en: "Let's plan your trip" },
  "contact.address": { fr: "Adresse", en: "Address" },
  "contact.phone": { fr: "Telephone", en: "Phone" },
  "contact.hours": { fr: "Horaires", en: "Hours" },
  "contact.hoursval": { fr: "Lun - Sam : 9h - 18h", en: "Mon - Sat: 9am - 6pm" },
  "contact.cta": { fr: "Reserver sur WhatsApp", en: "Book on WhatsApp" },

  "footer.rights": { fr: "Tous droits reserves.", en: "All rights reserved." },
  "footer.built": { fr: "Site realise par Krateon", en: "Site by Krateon" },

  "common.googleReviews": { fr: "avis Google", en: "Google reviews" },
  "common.from": { fr: "A partir de", en: "From" },
  "common.backHome": { fr: "Retour a l'accueil", en: "Back to home" },

  "omraPage.title": { fr: "Toutes nos formules Omra saison 2026-2027", en: "All our Umrah packages, 2026-2027 season" },
  "omraPage.sub": {
    fr: "Tous les departs et toutes les formules d'hotels disponibles. Contactez-nous pour reserver.",
    en: "All departures and every hotel option available. Contact us to book.",
  },

  "hotelsPage.title": { fr: "Tous nos hotels", en: "All our hotels" },
  "hotelsPage.sub": {
    fr: "Une selection d'adresses d'exception en Tunisie, en Arabie Saoudite et en Europe.",
    en: "A selection of standout addresses in Tunisia, Saudi Arabia and Europe.",
  },
  "hotelsPage.more": {
    fr: "D'autres hotels et destinations sont disponibles sur demande. Contactez-nous pour un devis personnalise.",
    en: "More hotels and destinations are available on request. Contact us for a custom quote.",
  },
  "hotelsPage.searchDestination": { fr: "Destination", en: "Destination" },
  "hotelsPage.searchDestinationPh": { fr: "Tunisie, Istanbul, Mecque...", en: "Tunisia, Istanbul, Mecca..." },
  "hotelsPage.checkin": { fr: "Arrivee", en: "Check-in" },
  "hotelsPage.checkout": { fr: "Depart", en: "Check-out" },
  "hotelsPage.people": { fr: "Personnes", en: "People" },
  "hotelsPage.search": { fr: "Rechercher", en: "Search" },
  "hotelsPage.searchNote": {
    fr: "Disponibilite en temps reel bientot en ligne. Pour l'instant, indiquez vos dates et on vous confirme la disponibilite.",
    en: "Real-time availability is coming soon. For now, tell us your dates and we'll confirm availability for you.",
  },
  "hotelsPage.noResults": {
    fr: "Aucun hotel ne correspond a cette destination pour le moment. Contactez-nous, on trouve une solution.",
    en: "No hotel matches this destination right now. Contact us, we'll find a solution.",
  },

  "visasPage.title": { fr: "Tous nos dossiers visa", en: "All our visa packages" },
  "visasPage.sub": {
    fr: "Le detail complet de chaque formule visa : pays eligibles et prestations incluses.",
    en: "The full detail of each visa package: eligible countries and included services.",
  },
  "visasPage.countries": { fr: "Pays eligibles", en: "Eligible countries" },

  "booking.kicker": { fr: "Billetterie", en: "Ticketing" },
  "booking.title": { fr: "Demande de reservation", en: "Booking request" },
  "booking.sub": {
    fr: "Remplissez ce formulaire, nous vous rappelons pour finaliser votre reservation.",
    en: "Fill in this form, we'll call you back to finalize your booking.",
  },
  "booking.type": { fr: "Type de billet", en: "Ticket type" },
  "booking.typeAvion": { fr: "Avion", en: "Flight" },
  "booking.typeBateau": { fr: "Bateau", en: "Ferry" },
  "booking.name": { fr: "Nom complet", en: "Full name" },
  "booking.phone": { fr: "Telephone", en: "Phone" },
  "booking.destination": { fr: "Destination", en: "Destination" },
  "booking.destinationPh": { fr: "ex: Tunis - Istanbul", en: "e.g. Tunis - Istanbul" },
  "booking.departDate": { fr: "Date de depart", en: "Departure date" },
  "booking.returnDate": { fr: "Date de retour (optionnel)", en: "Return date (optional)" },
  "booking.people": { fr: "Nombre de personnes", en: "Number of people" },
  "booking.message": { fr: "Remarques (optionnel)", en: "Notes (optional)" },
  "booking.submit": { fr: "Envoyer la demande", en: "Send request" },
  "booking.sentTitle": { fr: "Presque termine", en: "Almost done" },
  "booking.sentBody": {
    fr: "Votre application email a du s'ouvrir avec la demande pre-remplie. Cliquez sur Envoyer dans votre application pour nous la faire parvenir.",
    en: "Your email app should have opened with the request pre-filled. Click Send there to deliver it to us.",
  },
  "booking.orWhatsapp": { fr: "Ou contactez-nous directement sur WhatsApp", en: "Or contact us directly on WhatsApp" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; tr: (k: string) => string };
const LangContext = createContext<Ctx>({ lang: "fr", setLang: () => {}, tr: (k) => k });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");
  const tr = (k: string) => t[k]?.[lang] ?? k;
  return <LangContext.Provider value={{ lang, setLang, tr }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
