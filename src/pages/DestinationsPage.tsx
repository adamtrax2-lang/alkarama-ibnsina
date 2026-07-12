import { useLang } from "../i18n";
import { PageBanner } from "../components/PageBanner";
import { DestinationCard } from "../components/Sections";
import { useContent } from "../store";

export default function DestinationsPage() {
  const { tr } = useLang();
  const { content } = useContent();
  const destinations = content.destinations;

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
