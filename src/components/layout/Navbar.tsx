"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/services", label: "Services" },
  { href: "/team", label: "Equipe" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHomeHero = pathname === "/" && !scrolled && !open;
  const headerClasses = isHomeHero
    ? "bg-transparent text-white"
    : "border-b border-[#ddd7ce] bg-[rgba(247,244,239,0.95)] text-[#111111] backdrop-blur-md";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${headerClasses}`}>
      <div className="page-shell px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-display text-2xl font-semibold uppercase tracking-[0.18em]">
              Zarga
            </span>
            <span
              className={`mt-1 text-[9px] uppercase tracking-[0.34em] ${
                isHomeHero ? "text-white/70" : "text-[#7b7b7b]"
              }`}
            >
              Gentlemen&apos;s Barber Shop
            </span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] uppercase tracking-[0.24em] transition-colors ${
                  pathname === link.href
                    ? isHomeHero
                      ? "text-white"
                      : "text-[#111111]"
                    : isHomeHero
                      ? "text-white/78 hover:text-white"
                      : "text-[#5f5f5f] hover:text-[#111111]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <p className={`text-xs transition-colors ${isHomeHero ? "text-white/70" : "text-[#7b7b7b]"}`}>
              Created and designed by{" "}
              <a
                href="https://www.instagram.com/aymen_jerbi6/"
                target="_blank"
                rel="noopener noreferrer"
                className={`underline transition-colors ${isHomeHero ? "hover:text-white" : "hover:text-[#111111]"}`}
              >
                Aymen
              </a>
            </p>
            <Link
              href="/book"
              className={`inline-flex min-h-[46px] items-center justify-center rounded-full border px-5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                isHomeHero
                  ? "border-white/70 text-white hover:bg-white hover:text-[#111111]"
                  : "border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white"
              }`}
            >
              Réserver
            </Link>
          </div>

          {/* Credit — always visible on mobile */}
          <p className={`md:hidden text-[10px] transition-colors ${isHomeHero ? "text-white/70" : "text-[#7b7b7b]"}`}>
            Created and designed by{" "}
            <a
              href="https://www.instagram.com/aymen_jerbi6/"
              target="_blank"
              rel="noopener noreferrer"
              className={`underline transition-colors ${isHomeHero ? "hover:text-white" : "hover:text-[#111111]"}`}
            >
              Aymen
            </a>
          </p>

          <button
            type="button"
            aria-label="Menu"
            className="flex flex-col gap-1.5 p-2 md:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            <span
              className={`block h-px w-5 transition-all ${
                isHomeHero ? "bg-white" : "bg-[#111111]"
              } ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-5 transition-all ${
                isHomeHero ? "bg-white" : "bg-[#111111]"
              } ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px w-5 transition-all ${
                isHomeHero ? "bg-white" : "bg-[#111111]"
              } ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-[#ddd7ce] bg-[rgba(247,244,239,0.98)] transition-all duration-300 md:hidden ${
          open ? "max-h-72" : "max-h-0 border-t-transparent"
        }`}
      >
        <div className="page-shell flex flex-col gap-5 px-4 py-6 sm:px-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-[11px] uppercase tracking-[0.24em] text-[#111111]"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/book" className="btn-primary w-fit" onClick={() => setOpen(false)}>
            Réserver
          </Link>
        </div>
      </div>
    </header>
  );
}
