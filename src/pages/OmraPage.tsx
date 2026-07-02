import { useLang } from "../i18n";
import { useContent } from "../store";
import { PageBanner } from "../components/PageBanner";
import { OmraPackCard } from "../components/Sections";

export default function OmraPage() {
  const { tr } = useLang();
  const { content } = useContent();
  const allPacks = [...content.umrahPacks, ...content.umrahMoreDepartures];

  return (
    <>
      <PageBanner
        img="/hero/hajj.png"
        kicker={tr("omra.kicker")}
        title={tr("omraPage.title")}
        sub={tr("omraPage.sub")}
      />
      <section className="bg-charcoal py-16 text-white">
        <div className="container-x">
          <div className="grid items-stretch gap-6 md:grid-cols-3">
            {allPacks.map((p, i) => (
              <OmraPackCard key={i} p={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
