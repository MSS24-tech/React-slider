import React, { useState, useEffect, useRef, useCallback } from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import "./Carousel.css";

import slideImages from "../assets/images/index";

export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideRef = useRef(null);
  const slideCount = slideImages.length;
  const handleKeyDown = useCallback(
    (e) => {
      if (!slideRef.current) return;

      switch (e.key) {
        case "ArrowLeft":
          slideRef.current.goBack();
          break;
        case "ArrowRight":
          slideRef.current.goNext();
          break;
        case "Enter":
        case "Tab":
          slideRef.current.goTo((activeIndex + 1) % slideCount);
          break;
        default:
          break;
      }
    },
    [activeIndex, slideCount]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="slide-container" aria-label="Image carousel">
      <Slide
        ref={slideRef}
        autoplay={false} //Optional
        duration={3000}
        transitionDuration={500}
        arrows={true}
        pauseOnHover={true}
        canSwipe={true}
        infinite={true}
        onChange={(_, newIndex) => setActiveIndex(newIndex)}
        prevArrow={
          <button className="custom-arrow" aria-label="Previous slide">
            ❮
          </button>
        }
        nextArrow={
          <button className="custom-arrow" aria-label="Next slide">
            ❯
          </button>
        }
      >
        {slideImages.map((slide, index) => (
          <div
            key={index}
            className={`each-slide ${
              index === activeIndex ? "active-slide" : ""
            }`}
            tabIndex="0"
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${slideCount}`}
          >
            <img src={slide.url} alt={slide.caption} loading="lazy" />
            <p>{slide.caption}</p>
          </div>
        ))}
      </Slide>
    </div>
  );
}
