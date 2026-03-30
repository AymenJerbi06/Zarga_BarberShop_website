export default function AboutSection() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="page-shell px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="section-label mb-5">Un barbier premium avec une touche moderne</p>
            <h2 className="display-heading text-[clamp(2.5rem,6vw,4.5rem)] text-[#111111]">
              Une adresse
              <br />
              pensée pour
              <br />
              les hommes.
            </h2>
          </div>
          <div className="space-y-8">
            <p className="body-copy text-lg">
              Fondé à Sfax, Zarga Gentlemen&apos;s Barber Shop réunit l&apos;héritage du
              barbier traditionnel, la précision moderne et une attention particulière à
              chaque détail.
            </p>
            <p className="body-copy text-lg">
              Notre objectif est simple : vous offrir la bonne expérience, au bon niveau
              de service, avec un résultat net, élégant et durable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
