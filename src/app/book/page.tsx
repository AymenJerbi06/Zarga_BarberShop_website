import type { Metadata } from "next";
import { BARBERS, BUSINESS_HOURS, SHOP_INFO } from "@/lib/data";

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

          {/* Barber cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-16">
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

          {/* Info + Map */}
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[28px] border border-[#ddd7ce] bg-white p-8 flex flex-col gap-8">
              <div>
                <p className="section-label mb-3">Adresse</p>
                <p className="font-semibold text-[#111111]">{SHOP_INFO.address}</p>
                <a
                  href={`https://maps.google.com/?q=${SHOP_INFO.coordinates.lat},${SHOP_INFO.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-link text-[#111111] mt-3 inline-block"
                >
                  Obtenir l&apos;itinéraire &gt;
                </a>
              </div>
              <div>
                <p className="section-label mb-3">Horaires d&apos;Ouverture</p>
                <p className="body-copy mb-1">{BUSINESS_HOURS.weekdays.label}</p>
                <p className="body-copy">{BUSINESS_HOURS.sunday.label}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-[#ddd7ce]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d10.724713!3d34.765542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ1JzU2LjAiTiAxMMKwNDMnMjkuMCJF!5e0!3m2!1sfr!2stn!4v1000000000000"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "360px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Zarga Barbershop Location"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
