import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { BARBERS } from "@/lib/data";
import cherifPortrait from "../../../cherif_barber.jpg";
import guidaraPortrait from "../../../guidara.jpg";

const portraits: Record<string, StaticImageData | string> = {
  zarga: "/images/profile.jpg",
  cherif: cherifPortrait,
  guidara: guidaraPortrait,
};

export const metadata: Metadata = {
  title: "Notre Équipe",
  description:
    "Rencontrez les maîtres barbiers de Zarga : Zarga, Cherif et Guidara. Experts en coupes, barbe et hair art.",
};

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] pt-28">
      <section className="bg-white py-16 lg:py-20">
        <div className="page-shell px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-label mb-5">Notre équipe</p>
            <h1 className="display-heading text-[clamp(3.2rem,8vw,6rem)] text-[#111111]">
              Rencontrez
              <br />
              vos barbiers.
            </h1>
            <p className="mt-6 body-copy text-lg">
              Trois profils, trois signatures, une même exigence de précision.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="page-shell px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {BARBERS.map((barber) => (
              <article key={barber.id} className="overflow-hidden rounded-[32px] border border-[#ddd7ce] bg-white">
                <Image
                  src={portraits[barber.id]}
                  alt={barber.name}
                  width={800}
                  height={960}
                  className="h-[420px] w-full object-cover"
                />
                <div className="p-8">
                  <p className="section-label mb-3">{barber.title}</p>
                  <h2 className="font-display text-4xl text-[#111111]">{barber.name}</h2>
                  <p className="mt-4 body-copy">{barber.bio}</p>
                  <p className="mt-5 text-sm text-[#7b7b7b]">{barber.specialties.join(" · ")}</p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link href={`/book?barber=${barber.id}`} className="btn-primary">
                      Réserver
                    </Link>
                    <a
                      href={`tel:${barber.phone.replace(/\s/g, "")}`}
                      className="btn-link text-[#111111]"
                    >
                      {barber.phone}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
