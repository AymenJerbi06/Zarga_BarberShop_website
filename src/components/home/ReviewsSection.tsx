import { MOCK_REVIEWS } from "@/lib/data";

export default function ReviewsSection() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="page-shell px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="section-label mb-4">Avis clients</p>
          <h2 className="display-heading text-[clamp(2.2rem,5vw,3.8rem)] text-[#111111]">
            Des retours
            <br />
            qui comptent.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {MOCK_REVIEWS.slice(0, 3).map((review) => (
            <article key={review.id} className="rounded-[28px] border border-[#ddd7ce] bg-[#faf8f4] p-8">
              <p className="text-sm uppercase tracking-[0.24em] text-[#7b7b7b]">★★★★★</p>
              <p className="mt-5 body-copy text-base">&ldquo;{review.text}&rdquo;</p>
              <div className="mt-8 border-t border-[#ddd7ce] pt-4">
                <p className="font-medium text-[#111111]">{review.name}</p>
                <p className="mt-1 text-sm text-[#7b7b7b]">{review.date}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
