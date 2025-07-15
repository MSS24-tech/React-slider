/** Author: M S Sharath */
/** Software Engineer */

import React, { useState, useEffect, useRef } from "react";
import { Slide } from "react-slideshow-image";
import throttle from "lodash.throttle";
import "react-slideshow-image/dist/styles.css";
import "./Carousel.css";
import slideImages from "../../assets/images/index";

export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [liveMessage, setLiveMessage] = useState("");
  const slideRef = useRef(null);
  const slideCount = slideImages.length;

  const goToNextSlide = () =>
    slideRef.current?.goTo((activeIndex + 1) % slideCount);

  const handleKeyDown = throttle((e) => {
    if (!slideRef.current) return;
    if (e.key === "ArrowLeft") slideRef.current.goBack();
    else if (e.key === "ArrowRight") slideRef.current.goNext();
    else if (["Enter", "Tab"].includes(e.key)) goToNextSlide();
  }, 200);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSlideChange = (_, newIndex) => {
    if (newIndex !== activeIndex) {
      const { caption } = slideImages[newIndex];
      setActiveIndex(newIndex);
      setLiveMessage(`Slide ${newIndex + 1} of ${slideCount}: ${caption}`);
    }
  };

  const Arrow = ({ label }) => (
    <button className="custom-arrow" aria-label={`${label} slide`}>
      {label === "Previous" ? "❮" : "❯"}
    </button>
  );

  return (
    <div className="slide-container" aria-label="Image carousel" role="region">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveMessage}
      </div>
      <Slide
        ref={slideRef}
        autoplay={true}
        duration={3000}
        transitionDuration={500}
        infinite={true}
        arrows={true}
        canSwipe={true}
        pauseOnHover={false}
        onChange={handleSlideChange}
        prevArrow={<Arrow label="Previous" />}
        nextArrow={<Arrow label="Next" />}
      >
        {slideImages.map(({ url, caption }, index) => (
          <div
            key={index}
            className="each-slide"
            tabIndex="0"
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${slideCount}`}
          >
            <div
              className={`slide-inner ${
                index === activeIndex ? "active-slide" : ""
              }`}
            >
              <img
                src={url}
                alt={caption || `Slide ${index + 1}`}
                loading="lazy"
                decoding="async"
                fetchpriority={index === 0 ? "high" : "low"}
              />
              {caption && <p>{caption}</p>}
            </div>
          </div>
        ))}
      </Slide>
    </div>
  );
}
