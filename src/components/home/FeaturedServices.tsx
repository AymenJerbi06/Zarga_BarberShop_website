import Link from "next/link";
import { SERVICES } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

const featuredServiceIds = [
  "coupe-simple",
  "coupe-barbe",
  "rasage-classique",
  "look-complet",
];

export default function FeaturedServices() {
  const featured = SERVICES.filter((service) => featuredServiceIds.includes(service.id));

  return (
    <section className="bg-[#f7f4ef] py-20 lg:py-24">
      <div className="page-shell px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="section-label mb-5">Trouver la bonne expérience</p>
          <h2 className="display-heading text-[clamp(2.5rem,6vw,4.5rem)] text-[#111111]">
            Des services
            <br />
            pensés pour
            <br />
            le détail.
          </h2>
          <p className="mt-6 body-copy text-lg">
            Comme le site de référence, cette section met en avant quelques prestations
            phares avec leur prix, leur promesse et un accès direct à la réservation.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {featured.map((service) => (
            <article key={service.id} className="rounded-[28px] border border-[#ddd7ce] bg-white p-8">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-3xl text-[#111111]">{service.name}</h3>
                <span className="text-lg font-semibold text-[#111111]">
                  {formatPrice(service.price, service.priceFrom)}
                </span>
              </div>
              <p className="mt-4 body-copy text-base">{service.description}</p>
              <Link href="/book" className="btn-primary mt-8">
                Réserver par téléphone
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/services" className="btn-link text-[#111111]">
            Voir tous les services et tarifs
          </Link>
        </div>
      </div>
    </section>
  );
}
