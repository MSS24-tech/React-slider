/** Author: M S Sharath */
/** Software Engineer */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
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

  const goToNextSlide = useCallback(() => {
    const nextIndex = (activeIndex + 1) % slideCount;
    slideRef.current?.goTo(nextIndex);
  }, [activeIndex, slideCount]);

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
          goToNextSlide();
          break;
        default:
          break;
      }
    },
    [goToNextSlide]
  );

  const throttledKeyDown = useMemo(
    () => throttle(handleKeyDown, 200),
    [handleKeyDown]
  );

  useEffect(() => {
    window.addEventListener("keydown", throttledKeyDown);
    return () => window.removeEventListener("keydown", throttledKeyDown);
  }, [throttledKeyDown]);

  const handleSlideChange = useCallback(
    (_, newIndex) => {
      if (newIndex !== activeIndex) {
        const { caption } = slideImages[newIndex];
        setActiveIndex(newIndex);
        setLiveMessage(`Slide ${newIndex + 1} of ${slideCount}: ${caption}`);
      }
    },
    [activeIndex, slideCount]
  );

  const prevArrow = useMemo(
    () => (
      <button className="custom-arrow" aria-label="Previous slide">
        ❮
      </button>
    ),
    []
  );

  const nextArrow = useMemo(
    () => (
      <button className="custom-arrow" aria-label="Next slide">
        ❯
      </button>
    ),
    []
  );

  const slides = useMemo(
    () =>
      slideImages.map(({ url, caption }, index) => (
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
          <img
            src={url}
            alt={caption || `Slide ${index + 1}`}
            loading="lazy"
            decoding="async"
            fetchpriority={index === 0 ? "high" : "low"}
          />
          {caption && <p>{caption}</p>}
        </div>
      )),
    [activeIndex, slideCount]
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
        prevArrow={prevArrow}
        nextArrow={nextArrow}
      >
        {slides}
      </Slide>
    </div>
  );
}
