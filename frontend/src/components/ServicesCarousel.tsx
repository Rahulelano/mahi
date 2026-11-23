import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { Service } from '../types';
import { ServiceCard } from './ServiceCard';

interface ServicesCarouselProps {
  services: Service[];
}

export function ServicesCarousel({ services }: ServicesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  // Responsive visible cards count
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      if (width < 680) {
        setVisibleCards(1);
      } else if (width < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  const maxIndex = Math.max(0, services.length - visibleCards);

  // Auto-clamp if screen size changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setProgressKey((k) => k + 1);
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setProgressKey((k) => k + 1);
  }, [maxIndex]);

  const goToSlide = (idx: number) => {
    const target = Math.min(Math.max(0, idx), maxIndex);
    setCurrentIndex(target);
    setProgressKey((k) => k + 1);
  };

  // Autoplay timer (4.5s)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || mouseStartX.current === null) return;
    const diff = mouseStartX.current - e.clientX;
    if (diff > 60) {
      handleNext();
    } else if (diff < -60) {
      handlePrev();
    }
    isDragging.current = false;
    mouseStartX.current = null;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    mouseStartX.current = null;
    setIsPaused(false);
  };

  // Percentage slide step calculation
  // Each card width percentage: 100% / visibleCards
  const stepPercentage = 100 / visibleCards;
  const translateX = currentIndex * stepPercentage;

  return (
    <div
      className="carousel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top Carousel Navigation & Controls */}
      <div className="carousel-top-controls">
        <div className="carousel-counter">
          <span className="counter-current">
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span className="counter-slash">/</span>
          <span className="counter-total">
            {String(services.length).padStart(2, '0')}
          </span>
        </div>

        <div className="carousel-nav-buttons">
          <button
            type="button"
            className="carousel-nav-btn prev"
            onClick={handlePrev}
            aria-label="Previous service"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            type="button"
            className="carousel-pause-btn"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
            title={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
          </button>

          <button
            type="button"
            className="carousel-nav-btn next"
            onClick={handleNext}
            aria-label="Next service"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Autoplay Progress Bar */}
      <div className="carousel-progress-track">
        <div
          key={progressKey}
          className={`carousel-progress-bar ${isPaused ? 'paused' : 'running'}`}
        />
      </div>

      {/* Sliding Viewport */}
      <div
        className="carousel-viewport"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${translateX}%)`,
          }}
        >
          {services.map((service, index) => {
            const isActive =
              index >= currentIndex && index < currentIndex + visibleCards;
            const isFeatured = index === currentIndex;

            return (
              <div
                key={service.slug}
                className={`carousel-slide ${isActive ? 'is-active' : 'is-inactive'} ${
                  isFeatured ? 'is-featured' : ''
                }`}
                style={{
                  flex: `0 0 ${100 / visibleCards}%`,
                  maxWidth: `${100 / visibleCards}%`,
                }}
              >
                <div className="carousel-card-inner">
                  <ServiceCard service={service} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animated Bottom Dots / Pagination */}
      <div className="carousel-pagination">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => {
          const isSelected = idx === currentIndex;
          return (
            <button
              key={idx}
              type="button"
              className={`carousel-dot ${isSelected ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            >
              <span className="dot-fill" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
