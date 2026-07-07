import { useLang } from "../i18n";
import { PageBanner } from "../components/PageBanner";
import { DestinationCard } from "../components/Sections";
import { destinations } from "../data";

export default function DestinationsPage() {
  const { tr } = useLang();

  return (
    <>
      <PageBanner
        img="/hero/cappadocia.jpg"
        kicker={tr("packs.kicker")}
        title={tr("destinationsPage.title")}
        sub={tr("destinationsPage.sub")}
      />
      <section className="bg-sand py-16">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-3">
            {destinations.map((d) => (
              <DestinationCard key={d.id} d={d} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
