import { business, wa } from "../data";
import { Icon } from "./Icons";

export default function SocialRail() {
  const items = [
    { href: business.facebook, label: "Facebook", icon: Icon.facebook, cls: "bg-[#1877F2] text-white" },
    { href: business.instagram, label: "Instagram", icon: Icon.instagram, cls: "instagram-grad text-white" },
    { href: wa("Bonjour AlKarama, j'ai une question."), label: "WhatsApp", icon: Icon.whatsapp, cls: "bg-[#25D366] text-white" },
  ];

  return (
    <div className="fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2.5">
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href}
          target="_blank"
          rel="noreferrer"
          aria-label={it.label}
          className={`grid h-11 w-11 place-items-center rounded-full shadow-lg transition hover:scale-110 ${it.cls}`}
        >
          <it.icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
