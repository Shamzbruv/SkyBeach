"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { hutStories } from "@/lib/site-data";

export function HutExplorer() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const detailRef = useRef<HTMLElement>(null);
  const activeHut = activeIndex === null ? null : hutStories[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return;

    detailRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }, [activeIndex]);

  function selectHut(index: number) {
    setPhotoIndex(0);
    setActiveIndex((currentIndex) => currentIndex === index ? null : index);
  }

  return (
    <div className="hut-explorer">
      <div className="hut-selector" aria-label="Explore the named huts">
        {hutStories.map((hut, index) => (
          <button
            className={`hut-selector-card ${index === activeIndex ? "is-active" : ""}`}
            type="button"
            key={hut.name}
            onClick={() => selectHut(index)}
            aria-expanded={index === activeIndex}
            aria-controls="hut-explorer-detail"
          >
            <Image
              src={hut.images[0]}
              alt=""
              fill
              sizes="(max-width: 430px) calc(100vw - 24px), (max-width: 900px) 48vw, (max-width: 1120px) 31vw, 230px"
              unoptimized
            />
            <span className="hut-card-action">
              View photos &amp; story <span aria-hidden="true">&rarr;</span>
            </span>
            <strong className="hut-card-name">{hut.name}</strong>
          </button>
        ))}
      </div>

      {activeHut && (
        <article className="hut-feature" id="hut-explorer-detail" ref={detailRef}>
          <div className="hut-feature-gallery">
            <Image
              className="hut-feature-main"
              src={activeHut.images[photoIndex]}
              alt={`${activeHut.name} at Sky Beach Jamaica`}
              fill
              sizes="(max-width: 900px) calc(100vw - 32px), 60vw"
              unoptimized
            />
            {activeHut.images.length > 1 && (
              <div className="hut-thumbnails" aria-label={`${activeHut.name} photographs`}>
                {activeHut.images.map((image, index) => (
                  <button
                    type="button"
                    className={index === photoIndex ? "is-active" : ""}
                    onClick={() => setPhotoIndex(index)}
                    key={image}
                    aria-label={`View ${activeHut.name} photo ${index + 1}`}
                  >
                    <Image src={image} alt="" fill sizes="74px" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hut-feature-copy">
            <p className="eyebrow">{activeHut.placeNote}</p>
            <h3>{activeHut.name}</h3>
            <p className="hut-story-text">{activeHut.story}</p>
            <dl className="hut-details">
              <div>
                <dt>Atmosphere</dt>
                <dd>{activeHut.atmosphere}</dd>
              </div>
              <div>
                <dt>Best for</dt>
                <dd>{activeHut.bestFor}</dd>
              </div>
            </dl>
            <Link
              className="button button-coral"
              href={`/reservations?request=Venue%20booking&venue=${encodeURIComponent(activeHut.name)}#booking-form`}
            >
              Plan something here
            </Link>
          </div>
        </article>
      )}
    </div>
  );
}
