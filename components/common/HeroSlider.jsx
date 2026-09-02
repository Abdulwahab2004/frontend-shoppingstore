import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import hero from "../../src/assets/images/hero.webp"

const SLIDES = [
  {
    image: hero,
    title: "Shop Smarter, Live Better",
    subtitle: "Discover quality products at prices you'll love.",
    ctaText: "Browse All Products",
    ctaLink: "/products",
    objectFit: "cover",
  },
  {
    image: "/src/assets/images/hero2.webp",
    title: "New Season Arrivals",
    subtitle: "Fresh styles, just landed.",
    ctaText: "Shop New Arrivals",
    ctaLink: "/products",
    objectFit: "cover",
  },
//   {
//     image: "/src/assets/images/hero3.webp",
//     title: "New Season Arrivals",
//     subtitle: "Fresh styles, just landed.",
//     ctaText: "Shop New Arrivals",
//     ctaLink: "/products",
//     objectFit: "cover",
//   },
//   {
//     image: "/src/assets/images/hero4.webp",
//     title: "New Season Arrivals",
//     subtitle: "Fresh styles, just landed.",
//     ctaText: "Shop New Arrivals",
//     ctaLink: "/products",
//     objectFit: "cover",
//   },
];

const SLIDE_DURATION = 2000; // ms — change auto-advance speed here
const SLIDE_HEIGHT = "min-h-[420px] md:min-h-[500px]"; // change hero height here

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const prev = () => {
    setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length);
  };

  const next = () => {
    setCurrent((p) => (p + 1) % SLIDES.length);
  };

  const goTo = (index) => {
    setCurrent(index);
  };

  // A single interval that lives for the component's whole lifetime —
  // it always uses the functional setCurrent update, so it never
  // depends on a stale "current" value and never needs to restart.
  useEffect(() => {
    if (SLIDES.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []); // empty deps — created once, never recreated

  return (
    <div className={`relative ${SLIDE_HEIGHT} rounded-2xl overflow-hidden`}>
      {SLIDES.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full"
            style={{ objectFit: slide.objectFit || "cover" }}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-24 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {slide.title}
            </h1>
            <p className="text-base md:text-lg text-white/90 mb-8 max-w-md">
              {slide.subtitle}
            </p>
            <Link
              to={slide.ctaLink}
              className="group inline-flex items-center gap-2 bg-fern text-white px-6 py-3 rounded-full font-medium hover:bg-forest transition-all duration-200 hover:gap-3"
            >
              {slide.ctaText}
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      ))}

      {SLIDES.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.image}
                onClick={() => goTo(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === current ? "w-6 bg-white" : "w-1.5 bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}