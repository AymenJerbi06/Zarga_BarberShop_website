import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES, SERVICE_CATEGORIES } from "@/lib/data";
import { formatDuration, formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nos Services",
  description:
    "Découvrez tous nos services de barbier : coupes, barbe, rasage classique, forfaits et extras. Tarifs et durées.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] pt-28">
      <section className="bg-white py-16 lg:py-20">
        <div className="page-shell px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-label mb-5">Services & tarifs</p>
            <h1 className="display-heading text-[clamp(3.2rem,8vw,6rem)] text-[#111111]">
              Nos services.
            </h1>
            <p className="mt-6 body-copy text-lg">
              Une lecture claire des prestations, des durées et des prix, dans un esprit
              proche du site qui vous inspire.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="page-shell px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {SERVICE_CATEGORIES.map((category) => {
              const categoryServices = SERVICES.filter((service) => service.category === category);

              return (
                <section key={category} className="rounded-[32px] border border-[#ddd7ce] bg-white p-6 sm:p-8 lg:p-10">
                  <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="section-label mb-3">Catégorie</p>
                      <h2 className="font-display text-4xl text-[#111111] sm:text-5xl">
                        {category}
                      </h2>
                    </div>
                  </div>

                  <div>
                    {categoryServices.map((service) => (
                      <div key={service.id} className="service-item">
                        <div>
                          <h3 className="text-2xl font-semibold text-[#111111]">{service.name}</h3>
                          <p className="mt-3 body-copy">{service.description}</p>
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <span className="text-[11px] uppercase tracking-[0.2em] text-[#7b7b7b]">
                              {formatDuration(service.duration)}
                            </span>
                            {service.requiresConsultation && (
                              <span className="rounded-full border border-[#ddd7ce] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#7b7b7b]">
                                Consultation
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex min-w-[150px] flex-col items-start gap-4 sm:items-end">
                          <span className="text-xl font-semibold text-[#111111]">
                            {formatPrice(service.price, service.priceFrom)}
                          </span>
                          <Link href="/book" className="btn-primary">
                            Réserver
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link href="/book" className="btn-primary">
              Réserver par téléphone
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
