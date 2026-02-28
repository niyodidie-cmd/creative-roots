import { useState, useEffect } from 'react';

const slideshowTexts = [
  'Everyone Has Hidden Power.',
  'Art Gives It a Voice.',
  'Stories Build Strong Communities.',
  'Creativity Changes Lives.',
];

const slideImages = [
  '/hero-1.png',
  '/hero-2.png',
  '/hero-3.png',
  '/hero-4.png',
];

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slideshowTexts.length);
        setFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleIndicatorClick = (index: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setFade(true);
    }, 300);
  };

  return (
    <section className="relative h-screen mt-nav-height overflow-hidden bg-dark-charcoal">
      {/* Slideshow Container */}
      <div className="absolute inset-0">
        {slideImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={img}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center text-cream px-6">
        <h1
          className={`text-4xl md:text-6xl font-bold mb-4 transition-opacity duration-700 drop-shadow-lg ${
            fade ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {slideshowTexts[currentSlide]}
        </h1>
        <p className="text-xl md:text-2xl mb-8 drop-shadow-md">Discover Your Creative Voice</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button className="bg-warm-brown text-cream px-8 py-3 rounded-lg font-semibold hover:bg-orange-900 transition">
            Join the Movement
          </button>
          <button className="bg-soft-gold text-dark-charcoal px-8 py-3 rounded-lg font-semibold border-2 border-warm-brown hover:bg-gradient-to-r hover:from-soft-gold hover:to-warm-brown transition">
            Donate Now
          </button>
        </div>
      </div>

      {/* Slideshow Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {slideshowTexts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleIndicatorClick(idx)}
            className={`h-3 rounded-full transition ${
              idx === currentSlide ? 'bg-soft-gold w-8' : 'bg-cream/50 w-3 hover:bg-cream/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-cream rounded-full flex items-center justify-center">
          <div className="w-1 h-2 bg-cream rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
