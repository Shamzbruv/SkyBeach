import Image from "next/image";

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
      <div className="page-hero-image" aria-hidden="true">
        <Image
          src={image}
          alt=""
          fill
          priority
          quality={95}
          sizes="100vw"
          unoptimized
        />
      </div>
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
