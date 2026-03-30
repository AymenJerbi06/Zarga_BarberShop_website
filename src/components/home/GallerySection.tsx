import Image from "next/image";

const galleryItems = [
  { type: "photo" as const, src: "/gallery/photo1.jpg", alt: "Ambiance Zarga" },
  { type: "photo" as const, src: "/gallery/photo2.jpg", alt: "Ambiance 2" },
  { type: "photo" as const, src: "/gallery/photo3.jpg", alt: "Ambiance 3" },
  { type: "photo" as const, src: "/gallery/zarga.jpg",  alt: "Zarga" },
  { type: "video" as const, src: "/videos/video3.mp4",  alt: "Atmosphère vidéo" },
  { type: "photo" as const, src: "/gallery/photo4.jpg", alt: "Ambiance 4" },
  { type: "photo" as const, src: "/gallery/photo5.jpg", alt: "Ambiance 5" },
  { type: "video" as const, src: "/gallery/video5.mp4", alt: "Atmosphère vidéo 2" },
];

export default function GallerySection() {
  return (
    <section className="bg-[#f7f4ef] py-20 lg:py-24">
      <div className="page-shell px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="section-label mb-4">L&apos;expérience Zarga</p>
          <h2 className="display-heading text-[clamp(2.2rem,5vw,3.8rem)] text-[#111111]">
            Une atmosphère
            <br />
            soignée.
          </h2>
          <p className="mt-5 body-copy text-lg">
            Vos nouvelles photos et les autres vidéos sont maintenant réunies dans une
            galerie plus propre et mieux organisée.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.src}
              className="relative aspect-[4/5] overflow-hidden rounded-[20px]"
            >
              {item.type === "photo" ? (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                />
              ) : (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                  src={item.src}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
