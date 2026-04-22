import Link from "next/link";
import { BARBERS, BUSINESS_HOURS, SHOP_INFO } from "@/lib/data";

export default function ContactSection() {
  return (
    <section className="bg-[#111111] py-20 text-white lg:py-24">
      <div className="page-shell px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="section-label mb-5 text-white/60">Nous trouver</p>
            <h2 className="display-heading text-[clamp(2.5rem,6vw,4.5rem)] text-white">
              Venez nous
              <br />
              rendre visite.
            </h2>
            <div className="mt-8 space-y-6 text-white/78">
              <p>{SHOP_INFO.address}</p>
              <div>
                <p className="font-semibold text-white">Horaires</p>
                <p className="mt-2">{BUSINESS_HOURS.weekdays.label}</p>
                <p>{BUSINESS_HOURS.sunday.label}</p>
              </div>
              <div>
                <p className="font-semibold text-white">Téléphones</p>
                <div className="mt-2 space-y-1">
                  {BARBERS.map((barber) => (
                    <p key={barber.id}>
                      {barber.name}: {barber.phone}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`https://maps.google.com/?q=${SHOP_INFO.coordinates.lat},${SHOP_INFO.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-inverse"
              >
                Obtenir l&apos;itinéraire
              </a>
              <Link
                href="/book"
                className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-white/60 px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-[#111111]"
              >
                Réserver par téléphone
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-white/10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d10.724713!3d34.765542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ1JzU2LjAiTiAxMMKwNDMnMjkuMCJF!5e0!3m2!1sfr!2stn!4v1000000000000"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "480px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Zarga Barbershop Location"
              className="grayscale"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
