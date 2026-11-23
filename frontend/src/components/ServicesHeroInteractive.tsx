import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Droplets,
  Pause,
  Phone,
  Play,
  Sparkles,
  Star,
  Truck,
  Zap,
} from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { phonePrimary, serviceImages, whatsappLink } from '../data/services';
import { navigate } from '../utils/navigation';

interface HeroServiceSlide {
  id: string;
  number: string;
  title: string;
  tagline: string;
  image: string;
  icon: typeof Zap;
  color: string;
  slug: string;
}

const serviceSlides: HeroServiceSlide[] = [
  {
    id: 'electrical',
    number: '01',
    title: 'Electrical Works',
    tagline: 'Power & Safety Guaranteed',
    image: serviceImages.electrical,
    icon: Zap,
    color: 'var(--orange-500)',
    slug: 'electrical-works',
  },
  {
    id: 'plumbing',
    number: '02',
    title: 'Plumbing Works',
    tagline: 'Zero Leaks & Neat Piping',
    image: serviceImages.plumbing,
    icon: Droplets,
    color: 'var(--blue-500)',
    slug: 'plumbing-works',
  },
  {
    id: 'epoxy',
    number: '03',
    title: 'Epoxy Works',
    tagline: 'High-Gloss Mirror Finish',
    image: serviceImages.epoxy,
    icon: Sparkles,
    color: 'var(--orange-500)',
    slug: 'epoxy-works',
  },
  {
    id: 'cleaning',
    number: '04',
    title: 'Cleaning Works',
    tagline: 'Deep Sanitization Standard',
    image: serviceImages.cleaning,
    icon: Sparkles,
    color: 'var(--blue-500)',
    slug: 'cleaning-works',
  },
  {
    id: 'moving',
    number: '05',
    title: 'Packers & Movers',
    tagline: 'Safe Doorstep Relocation',
    image: serviceImages.moving,
    icon: Truck,
    color: 'var(--orange-500)',
    slug: 'packers-and-movers',
  },
  {
    id: 'survey',
    number: '06',
    title: 'Survey Work',
    tagline: 'Precision Digital Total Station',
    image: serviceImages.survey,
    icon: Compass,
    color: 'var(--blue-500)',
    slug: 'survey-work',
  },
];

const rotatingWords = ['delivered.', 'guaranteed.', 'executed.', 'crafted.'];

export function ServicesHeroInteractive() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const frameRef = useRef<HTMLDivElement>(null);

  // Rotating animated word flip
  useEffect(() => {
    const wordTimer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2800);
    return () => clearInterval(wordTimer);
  }, []);

  // Auto-cycle through slides every 5.2 seconds if not hovered
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % serviceSlides.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered]);

  // 3D Perspective Tilt on Mouse Movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -6.5;
    const tiltY = ((x - centerX) / centerX) * 6.5;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % serviceSlides.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + serviceSlides.length) % serviceSlides.length);
  };

  const current = serviceSlides[activeIndex];
  const CurrentIcon = current.icon;

  return (
    <section className="services-hero-section">
      <div className="container">
        <div className="services-hero-grid">
          {/* Left Column: Heading, Dynamic Flip, Quick Filter Pills & Actions (No Added Paras) */}
          <div className="services-hero-content">
            <SectionLabel>OUR SERVICES</SectionLabel>
            <h1 className="services-hero-title">
              Comprehensive solutions,
              <br />
              <span className="services-title-accent">
                expertly{' '}
                <span key={wordIndex} className="hero-word-flip">
                  <em>{rotatingWords[wordIndex]}</em>
                </span>
              </span>
            </h1>

            {/* Original paragraph only - no extra paras */}
            <p className="services-hero-lead">
              From electrical installations and pipe repairs to durable epoxy flooring, deep cleaning,
              and reliable shifting across Coimbatore.
            </p>

            {/* Interactive Service Category Pills (Clean buttons, no paragraphs) */}
            <div className="services-interactive-pills">
              {serviceSlides.map((item, idx) => {
                const isActive = idx === activeIndex;
                const ItemIcon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`service-nav-pill ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                    onMouseEnter={() => {
                      setActiveIndex(idx);
                      setIsHovered(true);
                    }}
                    onMouseLeave={() => setIsHovered(false)}
                    aria-label={`View ${item.title}`}
                    style={
                      isActive
                        ? ({
                            '--pill-accent': item.color,
                          } as React.CSSProperties)
                        : undefined
                    }
                  >
                    <span className="service-nav-pill-icon">
                      <ItemIcon size={14} />
                    </span>
                    <span className="service-nav-pill-title">{item.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="services-hero-actions">
              <a
                className="button button-primary"
                href={whatsappLink(
                  `Hello Mahi team, I would like to book or enquire about ${current.title}.`
                )}
                target="_blank"
                rel="noreferrer"
              >
                Book {current.title} <ArrowRight size={17} />
              </a>
              <button
                type="button"
                className="button button-quiet"
                onClick={() => navigate(`/${current.slug}`)}
              >
                View full details
              </button>
              <a className="services-quick-phone" href={`tel:${phonePrimary}`}>
                <Phone size={14} /> {phonePrimary}
              </a>
            </div>
          </div>

          {/* Right Column: Layered 3D Perspective Card Showcase */}
          <div
            className="services-hero-visual-wrap"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Dynamic Ambient Aura adapting to the active service color */}
            <div
              className="services-ambient-glow"
              style={{
                background: `radial-gradient(circle at 60% 40%, ${current.color}30, rgba(53,166,207,0.18) 60%, transparent 75%)`,
              }}
            />

            <div
              ref={frameRef}
              className="services-3d-card"
              onMouseMove={handleMouseMove}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              {/* Photo Stage with Crossfade Transitions */}
              <div className="services-card-stage">
                {serviceSlides.map((slide, idx) => (
                  <img
                    key={slide.id}
                    src={slide.image}
                    alt={slide.title}
                    className={`services-stage-img ${idx === activeIndex ? 'active' : ''}`}
                    loading="lazy"
                  />
                ))}
                <div className="services-image-gradient" />
              </div>

              {/* Floating Top Badge: 5 Core Services & Star Rating */}
              <div className="services-floating-badge-top">
                <div className="services-badge-icon">
                  <Award size={18} />
                </div>
                <div>
                  <div className="services-rating-row">
                    <div className="services-stars">
                      <Star size={11} fill="currentColor" />
                      <Star size={11} fill="currentColor" />
                      <Star size={11} fill="currentColor" />
                      <Star size={11} fill="currentColor" />
                      <Star size={11} fill="currentColor" />
                    </div>
                    <strong>100% Quality Guaranteed</strong>
                  </div>
                  <small>5 Specialized Services in Coimbatore</small>
                </div>
              </div>

              {/* Floating Bottom Dock (No Paras: Just Icon, Title & Controls) */}
              <div className="services-card-bottom-dock">
                <div className="services-dock-info">
                  <div
                    className="services-bottom-icon"
                    style={{ color: current.color }}
                  >
                    <CurrentIcon size={20} />
                  </div>
                  <div className="services-dock-text">
                    <span className="services-dock-badge">
                      <CheckCircle2 size={12} style={{ color: current.color }} />
                      <span>{current.tagline}</span>
                    </span>
                    <strong>{current.title}</strong>
                  </div>
                </div>

                {/* Dock Controls: Nav Buttons & Numbered Pills */}
                <div className="services-dock-controls">
                  <div className="services-nav-group">
                    <button
                      type="button"
                      className="services-nav-btn"
                      onClick={handlePrev}
                      aria-label="Previous service"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      type="button"
                      className="services-nav-btn"
                      onClick={() => setIsPlaying(!isPlaying)}
                      aria-label={isPlaying ? 'Pause auto-cycle' : 'Play auto-cycle'}
                    >
                      {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                    <button
                      type="button"
                      className="services-nav-btn"
                      onClick={handleNext}
                      aria-label="Next service"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>

                  <div className="services-pill-group">
                    {serviceSlides.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        className={`services-num-pill ${idx === activeIndex ? 'active' : ''}`}
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`View ${slide.title}`}
                      >
                        {slide.number}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Asymmetrical Geometric Accent Frame */}
            <div className="services-hero-accent-frame" />
          </div>
        </div>
      </div>
    </section>
  );
}
