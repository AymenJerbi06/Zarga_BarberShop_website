import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { BARBERS } from "@/lib/data";
import cherifPortrait from "../../../cherif_barber.jpg";
import guidaraPortrait from "../../../guidara.jpg";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/zarga.le.coiffeur?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    icon: <Instagram className="h-5 w-5" />,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@zarga.le.coiffeur?is_from_webapp=1&sender_device=pc",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.24 8.24 0 0 0 4.82 1.55V6.83a4.85 4.85 0 0 1-1.05-.14z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100076997192921",
    icon: <Facebook className="h-5 w-5" />,
  },
];

const portraits: Record<string, StaticImageData | string> = {
  zarga: "/images/profile.jpg",
  cherif: cherifPortrait,
  guidara: guidaraPortrait,
};

export default function TeamPreview() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="page-shell px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="section-label mb-4">Notre équipe</p>
          <h2 className="display-heading text-[clamp(2.5rem,6vw,4.5rem)] text-[#111111]">
            Rencontrez
            <br />
            vos barbiers.
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {BARBERS.map((barber) => (
            <article key={barber.id} className="text-center">
              <div className="overflow-hidden rounded-[28px]">
                <Image
                  src={portraits[barber.id]}
                  alt={barber.name}
                  width={600}
                  height={680}
                  className="h-[340px] w-full object-cover"
                />
              </div>
              <h3 className="mt-6 font-display text-3xl text-[#111111]">{barber.name}</h3>
              <p className="mt-2 text-sm uppercase tracking-[0.22em] text-[#7b7b7b]">
                {barber.title}
              </p>
              <p className="mt-4 body-copy text-base">{barber.specialties.join(" · ")}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/team" className="btn-link text-[#111111]">
            Voir l&apos;équipe complète
          </Link>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7b7b7b]">
            Suivez-nous
          </p>
          <div className="flex gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d1d1d1] text-[#111111] transition-colors hover:border-[#111111] hover:bg-[#111111] hover:text-white"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
