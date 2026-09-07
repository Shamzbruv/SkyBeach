"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type PhotoShape = "wide" | "portrait" | "standard";

type Photo = {
  src: string;
  alt: string;
  shape: PhotoShape;
};

type Chapter = {
  title: string;
  text: string;
  photos: Photo[];
};

export function GalleryExplorer({ chapters }: { chapters: Chapter[] }) {
  const allPhotos = useMemo(() => chapters.flatMap((chapter) => chapter.photos), [chapters]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isOpen = lightboxIndex !== null;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        setLightboxIndex((current) => (current === null ? current : (current + 1) % allPhotos.length));
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === null ? current : (current - 1 + allPhotos.length) % allPhotos.length
        );
      }
      if (event.key === "Tab") {
        const dialog = document.querySelector('.lightbox[role="dialog"]');
        const focusable = dialog?.querySelectorAll<HTMLElement>("button");
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, allPhotos.length]);

  useEffect(() => {
    if (isOpen) return;
    triggerRef.current?.focus();
  }, [isOpen]);

  const current = lightboxIndex === null ? null : allPhotos[lightboxIndex];
  const chapterStartIndices = useMemo(() => {
    const indices: number[] = [];
    let total = 0;
    for (const chapter of chapters) {
      indices.push(total);
      total += chapter.photos.length;
    }
    return indices;
  }, [chapters]);

  return (
    <>
      <div className="gallery-collection" id="gallery-collection">
        {chapters.map((chapter, chapterIndex) => {
          const startIndex = chapterStartIndices[chapterIndex];

          return (
            <details
              className={`gallery-chapter gallery-chapter-${chapterIndex + 1}`}
              key={chapter.title}
              open={chapterIndex === 0}
            >
              <summary className="container gallery-chapter-heading">
                <span className="gallery-chapter-number">0{chapterIndex + 1}</span>
                <div className="gallery-chapter-copy">
                  <h2>{chapter.title}</h2>
                  <p>{chapter.text}</p>
                </div>
                <span className="gallery-photo-count">{chapter.photos.length} photos</span>
                <span className="gallery-toggle" aria-hidden="true" />
              </summary>
              <div className="container gallery-chapter-content">
                <div className="gallery-grid">
                  {chapter.photos.map((item, photoIndex) => (
                    <figure className={`gallery-item gallery-item--${item.shape}`} key={item.src}>
                      <button
                        type="button"
                        className="gallery-item-btn"
                        onClick={(event) => {
                          triggerRef.current = event.currentTarget;
                          setLightboxIndex(startIndex + photoIndex);
                        }}
                        aria-label={`View larger photo: ${item.alt}`}
                      >
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="(max-width: 680px) calc(100vw - 32px), (max-width: 900px) 50vw, 25vw"
                          loading={chapterIndex === 0 && photoIndex < 4 ? "eager" : "lazy"}
                          unoptimized
                        />
                      </button>
                      <figcaption>{item.alt}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </details>
          );
        })}
      </div>

      {current && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            ref={closeButtonRef}
            className="lightbox-close"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close photo"
          >
            ✕
          </button>

          {allPhotos.length > 1 && (
            <button
              type="button"
              className="lightbox-nav lightbox-prev"
              onClick={(event) => {
                event.stopPropagation();
                setLightboxIndex((i) => (i === null ? i : (i - 1 + allPhotos.length) % allPhotos.length));
              }}
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}

          <div className="lightbox-stage" onClick={(event) => event.stopPropagation()}>
            <div className="lightbox-frame">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="92vw"
                unoptimized
                priority
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className="lightbox-caption">{current.alt}</p>
            <span className="lightbox-count">
              {lightboxIndex! + 1} / {allPhotos.length}
            </span>
          </div>

          {allPhotos.length > 1 && (
            <button
              type="button"
              className="lightbox-nav lightbox-next"
              onClick={(event) => {
                event.stopPropagation();
                setLightboxIndex((i) => (i === null ? i : (i + 1) % allPhotos.length));
              }}
              aria-label="Next photo"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
