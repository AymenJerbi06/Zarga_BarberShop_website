"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const videos = [
  "/videos/video1.mp4",
  "/videos/video2.mp4",
  "/videos/video8.mp4",
  "/videos/video4.mp4",
];

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => setCurrent((value) => (value + 1) % videos.length);
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = videos[current];
    video.load();
    video.play().catch(() => {});
  }, [current]);

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#111111] pt-24">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/35" />

      <div className="page-shell relative z-10 flex min-h-[92vh] items-end px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="max-w-3xl text-white">
          <h1 className="display-heading text-[clamp(3.7rem,10vw,6.8rem)] uppercase text-white">
            L&apos;Art du
            <br />
            Barbier
          </h1>
          <h2 className="mt-5 font-display text-[clamp(1.1rem,2vw,1.6rem)] uppercase tracking-[0.2em] text-white/92">
            Chez Zarga
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/82">
            Barbershop premium à Sfax, Tunisie. Coupes nettes, barbe maîtrisée et
            expérience soignée dans un cadre élégant.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/book" className="btn-inverse">
              Réserver un rendez-vous
            </Link>
          </div>

          <div className="mt-8 flex gap-2">
            {videos.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Afficher la vidéo ${index + 1}`}
                onClick={() => setCurrent(index)}
                className={`h-px transition-all ${
                  index === current ? "w-10 bg-white" : "w-4 bg-white/45"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
