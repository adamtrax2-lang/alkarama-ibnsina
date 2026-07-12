import { wa } from "../data";
import { useContent } from "../store";
import { Icon } from "./Icons";

export default function SocialRail() {
  const { content } = useContent();
  const business = content.business;
  const items = [
    { href: business.facebook, label: "Facebook", icon: Icon.facebook, cls: "bg-[#1877F2] text-white" },
    { href: business.instagram, label: "Instagram", icon: Icon.instagram, cls: "instagram-grad text-white" },
    { href: business.tiktok, label: "TikTok", icon: Icon.tiktok, cls: "bg-black text-white" },
    { href: business.youtube, label: "YouTube", icon: Icon.youtube, cls: "bg-[#FF0000] text-white" },
    { href: business.x, label: "X", icon: Icon.x, cls: "bg-black text-white" },
    { href: wa("Bonjour AlKarama, j'ai une question."), label: "WhatsApp", icon: Icon.whatsapp, cls: "bg-[#25D366] text-white" },
  ].filter((it) => it.href); // hide any social whose URL is not set yet (X, YouTube)

  return (
    <div className="fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2.5">
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href}
          target="_blank"
          rel="noreferrer"
          aria-label={it.label}
          className={`grid h-11 w-11 place-items-center rounded-xl shadow-lg transition hover:scale-110 ${it.cls}`}
        >
          <it.icon className="h-7 w-7" />
        </a>
      ))}
    </div>
  );
}
