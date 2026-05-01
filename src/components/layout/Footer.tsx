import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { SHOP_INFO } from "@/lib/data";

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

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="flex flex-col items-center px-6 py-20 text-center">

        {/* Shop name */}
        <h2 className="mt-10 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          Zarga Gentlemen&apos;s
          <br />
          Barber Shop
        </h2>

        {/* Address */}
        <p className="mt-8 text-sm leading-7 text-white/70">{SHOP_INFO.address}</p>

        {/* Directions */}
        <a
          href={`https://maps.google.com/?q=${SHOP_INFO.coordinates.lat},${SHOP_INFO.coordinates.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-sm italic underline text-white/70 hover:text-white transition-colors"
        >
          Obtenir l&apos;itinéraire &gt;
        </a>

        {/* Nav links */}
        <div className="mt-4 flex gap-6">
          <Link href="/services" className="text-sm underline text-white/70 hover:text-white transition-colors">
            Services
          </Link>
          <Link href="/team" className="text-sm underline text-white/70 hover:text-white transition-colors">
            Équipe
          </Link>
          <Link href="/contact" className="text-sm underline text-white/70 hover:text-white transition-colors">
            Contact
          </Link>
        </div>

        {/* Social icons */}
        <div className="mt-10 flex gap-4">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white text-white transition-colors hover:bg-white hover:text-[#111111]"
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="mt-12 text-xs uppercase tracking-[0.18em] text-white/30">
          © {new Date().getFullYear()} Zarga Gentlemen&apos;s Barber Shop
        </p>

        {/* Credit */}
        <p className="mt-3 text-sm text-white/40">
          Created and designed by{" "}
          <a
            href="https://www.aymen.info/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-white"
          >
            Aymen
          </a>
        </p>

      </div>
    </footer>
  );
}
