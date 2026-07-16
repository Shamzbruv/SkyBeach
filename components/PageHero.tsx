export function PageHero({
  eyebrow,
  title,
  text,
  image,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
}) {
  return (
    <section className="page-hero">
      <div
        className="page-hero-image"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />
      <div className="page-hero-scrim" aria-hidden="true" />
      <div className="container page-hero-content">
        <p className="eyebrow light">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      <div className="page-wave" aria-hidden="true" />
    </section>
  );
}

