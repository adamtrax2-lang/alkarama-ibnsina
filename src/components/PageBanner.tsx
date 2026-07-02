import { Link } from "react-router-dom";
import { useLang } from "../i18n";
import { Icon } from "./Icons";

export function PageBanner({
  img,
  altImg,
  showAlt = false,
  kicker,
  title,
  sub,
}: {
  img: string;
  /** optional second background, crossfaded in when showAlt is true (e.g. plane <-> ferry) */
  altImg?: string;
  showAlt?: boolean;
  kicker: string;
  title: string;
  sub?: string;
}) {
  const { tr } = useLang();
  return (
    <section className="relative flex h-[42vh] min-h-[300px] w-full items-end overflow-hidden pt-24">
      <img
        src={img}
        alt=""
        className={`absolute inset-0 h-full w-full animate-kenburns object-cover transition-opacity duration-700 ${
          altImg && showAlt ? "opacity-0" : "opacity-100"
        }`}
      />
      {altImg && (
        <img
          src={altImg}
          alt=""
          className={`absolute inset-0 h-full w-full animate-kenburns object-cover transition-opacity duration-700 ${
            showAlt ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/55 to-charcoal/30" />
      <div className="container-x relative pb-10 text-white">
        <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/70 transition hover:text-white">
          <Icon.arrow className="h-4 w-4 rotate-180" /> {tr("common.backHome")}
        </Link>
        <p className="eyebrow text-gold-light">{kicker}</p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{title}</h1>
        {sub && <p className="mt-3 max-w-xl text-white/80">{sub}</p>}
      </div>
    </section>
  );
}
