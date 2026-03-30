import type { Metadata } from "next";
import Link from "next/link";
import { BARBERS, BUSINESS_HOURS, SHOP_INFO } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Zarga Barbershop à Sfax. Adresse, horaires, téléphones et carte.",
};

const weekDays = [
  { day: "Lundi", hours: `${BUSINESS_HOURS.weekdays.open} - ${BUSINESS_HOURS.weekdays.close}` },
  { day: "Mardi", hours: `${BUSINESS_HOURS.weekdays.open} - ${BUSINESS_HOURS.weekdays.close}` },
  { day: "Mercredi", hours: `${BUSINESS_HOURS.weekdays.open} - ${BUSINESS_HOURS.weekdays.close}` },
  { day: "Jeudi", hours: `${BUSINESS_HOURS.weekdays.open} - ${BUSINESS_HOURS.weekdays.close}` },
  { day: "Vendredi", hours: `${BUSINESS_HOURS.weekdays.open} - ${BUSINESS_HOURS.weekdays.close}` },
  { day: "Samedi", hours: `${BUSINESS_HOURS.weekdays.open} - ${BUSINESS_HOURS.weekdays.close}` },
  { day: "Dimanche", hours: `${BUSINESS_HOURS.sunday.open} - ${BUSINESS_HOURS.sunday.close}` },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] pt-28">
      <section className="bg-white py-16 lg:py-20">
        <div className="page-shell px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-label mb-5">Visit us</p>
            <h1 className="display-heading text-[clamp(3.2rem,8vw,6rem)] text-[#111111]">
              Contact.
            </h1>
            <p className="mt-6 body-copy text-lg">
              Toutes les informations essentielles, dans un bloc simple et direct comme sur
              le site de référence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="page-shell px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[32px] border border-[#ddd7ce] bg-white p-8">
              <h2 className="font-display text-4xl text-[#111111]">Venez nous voir</h2>
              <p className="mt-6 body-copy">{SHOP_INFO.address}</p>

              <div className="mt-8">
                <p className="font-semibold text-[#111111]">Horaires</p>
                <div className="mt-4 divide-y divide-[#ddd7ce]">
                  {weekDays.map((day) => (
                    <div key={day.day} className="flex items-center justify-between py-3 text-sm">
                      <span className="text-[#4f4f4f]">{day.day}</span>
                      <span className="text-[#111111]">{day.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <p className="font-semibold text-[#111111]">Téléphones</p>
                <div className="mt-4 space-y-3">
                  {BARBERS.map((barber) => (
                    <div key={barber.id} className="text-sm text-[#4f4f4f]">
                      <span className="font-medium text-[#111111]">{barber.name}:</span> {barber.phone}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={`https://maps.google.com/?q=${SHOP_INFO.coordinates.lat},${SHOP_INFO.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Obtenir l&apos;itinéraire
                </a>
                <Link href="/book" className="btn-outline">
                  Réserver
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-[#ddd7ce] bg-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d10.724713!3d34.765542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ1JzU2LjAiTiAxMMKwNDMnMjkuMCJF!5e0!3m2!1sfr!2stn!4v1000000000000"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "640px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Zarga Barbershop - Sfax"
                className="grayscale-[0.1]"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
