"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";

type ScreenshotSlide = {
  alt: string;
  command: string;
  description: string;
  image: StaticImageData;
  title: string;
};

type ScreenshotCarouselProps = {
  slides: ScreenshotSlide[];
};

function getWrappedIndex(index: number, total: number) {
  if (index < 0) {
    return total - 1;
  }

  if (index >= total) {
    return 0;
  }

  return index;
}

export function ScreenshotCarousel({ slides }: ScreenshotCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  return (
    <div className="showcase-carousel">
      <div className="showcase-carousel__stage">
        <div className="showcase-carousel__media">
          <Image
            key={activeSlide.title}
            src={activeSlide.image}
            alt={activeSlide.alt}
            className="showcase-carousel__image"
            sizes="(max-width: 1080px) 100vw, 58vw"
          />
        </div>

        <div className="showcase-carousel__panel">
          <div className="showcase-carousel__meta">
            <span className="showcase-carousel__command">{activeSlide.command}</span>
            <span className="showcase-carousel__count">
              {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          <div className="showcase-carousel__copy">
            <p className="showcase-carousel__eyebrow">Actual Revcast screen</p>
            <h3>{activeSlide.title}</h3>
            <p>{activeSlide.description}</p>
          </div>

          <div className="showcase-carousel__actions">
            <button
              className="button button-secondary"
              type="button"
              onClick={() => setActiveIndex((index) => getWrappedIndex(index - 1, slides.length))}
            >
              Previous
            </button>
            <button
              className="button button-primary"
              type="button"
              onClick={() => setActiveIndex((index) => getWrappedIndex(index + 1, slides.length))}
            >
              Next screen
            </button>
          </div>
        </div>
      </div>

      <div className="showcase-carousel__thumbs" aria-label="Revcast screens">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={slide.title}
              type="button"
              className={`showcase-carousel__thumb ${isActive ? "showcase-carousel__thumb-active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-pressed={isActive}
            >
              <span className="showcase-carousel__thumb-command">{slide.command}</span>
              <span className="showcase-carousel__thumb-title">{slide.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
