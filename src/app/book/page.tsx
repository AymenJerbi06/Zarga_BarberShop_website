import type { Metadata } from "next";
import { BARBERS, BUSINESS_HOURS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Réserver",
  description: "Prenez rendez-vous chez Zarga Barbershop par téléphone.",
};

export default function BookPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] pt-28">
      <section className="bg-white py-16 lg:py-20">
        <div className="page-shell px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-label mb-5">Prise de Rendez-Vous</p>
            <h1 className="display-heading text-[clamp(3.2rem,8vw,6rem)] text-[#111111]">
              Réserver.
            </h1>
            <p className="mt-6 body-copy text-lg">
              Pour prendre rendez-vous, appelez directement votre barbier. Nous vous répondons pendant les heures d&apos;ouverture.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="page-shell px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {BARBERS.map((barber) => (
              <div
                key={barber.id}
                className="rounded-[28px] border border-[#ddd7ce] bg-white p-8 flex flex-col gap-6"
              >
                <div>
                  <p className="section-label mb-3">{barber.title}</p>
                  <h3 className="font-display text-3xl text-[#111111]">{barber.name}</h3>
                  <p className="mt-3 body-copy text-sm">
                    {barber.specialties.slice(0, 2).join(" · ")}
                  </p>
                </div>
                <a
                  href={`tel:${barber.phone.replace(/\s/g, "")}`}
                  className="btn-primary mt-auto text-center"
                >
                  {barber.phone}
                </a>
              </div>
            ))}
          </div>

          <div className="rounded-[28px] border border-[#ddd7ce] bg-white p-8 max-w-sm">
            <p className="section-label mb-4">Horaires d&apos;Ouverture</p>
            <p className="body-copy text-base mb-2">{BUSINESS_HOURS.weekdays.label}</p>
            <p className="body-copy text-base">{BUSINESS_HOURS.sunday.label}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
