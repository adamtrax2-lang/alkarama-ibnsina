import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n";
import { wa } from "../data";
import { useContent } from "../store";
import { Icon } from "./Icons";

const links = [
  { key: "nav.home", href: "/" },
  { key: "nav.omra", href: "/#omra" },
  { key: "nav.packs", href: "/#packs" },
  { key: "nav.hotels", href: "/#hotels" },
  { key: "nav.visas", href: "/#visas" },
  { key: "nav.billets", href: "/#billets" },
];

export default function Navbar() {
  const { tr, lang, setLang } = useLang();
  const { content } = useContent();
  const business = content.business;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-charcoal/40 shadow-lg backdrop-blur-md" : "bg-gradient-to-b from-charcoal/40 to-transparent"
      }`}
    >
      <nav className="container-x flex h-20 items-center justify-between">
        {/* Brand logo (transparent PNG, white-text variant reads on the dark hero) */}
        <Link to="/" className="flex items-center" aria-label={business.name}>
          <img src="/brand/logo-white.png" alt={business.name} className="h-14 w-auto sm:h-16" />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.key}
              to={l.href}
              className="text-sm font-medium text-white drop-shadow transition hover:text-gold"
            >
              {tr(l.key)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-full border border-white/40 text-xs font-semibold">
            {(["fr", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 uppercase transition ${
                  lang === l ? "bg-gold text-white" : "text-white"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <a
            href={wa("Bonjour AlKarama, je souhaite des informations.")}
            target="_blank"
            rel="noreferrer"
            className="btn-green hidden sm:inline-flex"
          >
            <Icon.phone className="h-4 w-4" /> {business.phone}
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-white lg:hidden"
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-charcoal/10 bg-cream lg:hidden">
          <div className="container-x flex flex-col py-3">
            {links.map((l) => (
              <Link
                key={l.key}
                to={l.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium text-charcoal"
              >
                {tr(l.key)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
