import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  Droplets,
  Pause,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Zap,
} from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { phonePrimary, serviceImages, whatsappLink } from '../data/services';
import { navigate } from '../utils/navigation';

interface AboutPillar {
  id: string;
  number: string;
  shortTitle: string;
  fullTitle: string;
  summary: string;
  badgeLabel: string;
  badgeHighlight: string;
  accentColor: string;
  icon: typeof Zap;
  image: string;
  stats: string;
  slug: string;
}

const aboutPillars: AboutPillar[] = [
  {
    id: 'electrical',
    number: '01',
    shortTitle: 'Electrical Works',
    fullTitle: 'Safe & Certified Electrical Works',
    summary:
      'Safe home wiring, industrial switchboards, lighting installations, fault detection, and prompt emergency repairs across Coimbatore.',
    badgeLabel: 'Power, protected',
    badgeHighlight: '100% Safety Certified • 24/7 Response',
    accentColor: 'var(--orange-500)',
    icon: Zap,
    image: serviceImages.electrical,
    stats: 'Safe & Certified',
    slug: '/electrical-works',
  },
  {
    id: 'plumbing',
    number: '02',
    shortTitle: 'Plumbing Works',
    fullTitle: 'Precision Plumbing & Water Solutions',
    summary:
      'Fast, neat plumbing support that keeps your water systems working beautifully, from leak fixing to bathroom fittings and clean pipe routing.',
    badgeLabel: 'Flow, restored',
    badgeHighlight: 'Neat Workmanship • Zero Leak Guarantee',
    accentColor: 'var(--blue-500)',
    icon: Droplets,
    image: serviceImages.plumbing,
    stats: 'Neat & Reliable',
    slug: '/plumbing-works',
  },
  {
    id: 'epoxy',
    number: '03',
    shortTitle: 'Epoxy Works',
    fullTitle: 'Durable, Seamless Epoxy Flooring',
    summary:
      'High-gloss, chemical-resistant epoxy coatings and durable finishes for residential floors, parking areas, workshops, and commercial spaces.',
    badgeLabel: 'Built to last',
    badgeHighlight: 'Mirror-Finish Surface • Scratch Proof',
    accentColor: 'var(--orange-500)',
    icon: Sparkles,
    image: serviceImages.epoxy,
    stats: 'Durable & Smooth',
    slug: '/epoxy-works',
  },
  {
    id: 'cleaning',
    number: '04',
    shortTitle: 'Cleaning Works',
    fullTitle: 'Deep Sanitization & Surface Care',
    summary:
      'Detailed deep cleaning services that bring a healthier, brighter feel to your space with surface protection and zero mess left behind.',
    badgeLabel: 'Fresh, every time',
    badgeHighlight: 'Zero Mess Guarantee • Spotless Results',
    accentColor: 'var(--blue-500)',
    icon: Sparkles,
    image: serviceImages.cleaning,
    stats: 'Deep & Sanitized',
    slug: '/cleaning-works',
  },
  {
    id: 'moving',
    number: '05',
    shortTitle: 'Packers & Movers',
    fullTitle: 'Careful Packing & Doorstep Shifting',
    summary:
      'Careful packing, safe furniture loading, and dependable door-to-door moving assistance for smooth, stress-free home or office relocation.',
    badgeLabel: 'Move with ease',
    badgeHighlight: '100% Care Standard • Safe Transport',
    accentColor: 'var(--orange-500)',
    icon: Truck,
    image: serviceImages.moving,
    stats: 'Careful & Timely',
    slug: '/packers-and-movers',
  },
  {
    id: 'survey',
    number: '06',
    shortTitle: 'Survey Work',
    fullTitle: 'Digital Land & Boundary Surveying',
    summary:
      'High-precision land boundary marking, topographic contour mapping, and digital total station surveying across Coimbatore.',
    badgeLabel: 'Precision, measured',
    badgeHighlight: 'Millimeter Accuracy • Total Station GPS',
    accentColor: 'var(--blue-500)',
    icon: Compass,
    image: serviceImages.survey,
    stats: 'Digital & Precise',
    slug: '/survey-work',
  },
];

const rotatingWords = ['service.', 'care.', 'trust.', 'craftsmanship.', 'precision.'];

export function AboutHeroInteractive() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const frameRef = useRef<HTMLDivElement>(null);

  // Rotating animated word flip in heading
  useEffect(() => {
    const wordTimer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2800);
    return () => clearInterval(wordTimer);
  }, []);

  // Autoplay progression for pillars
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % aboutPillars.length);
    }, 5500);
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
    setActiveIndex((prev) => (prev + 1) % aboutPillars.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + aboutPillars.length) % aboutPillars.length);
  };

  const currentPillar = aboutPillars[activeIndex];
  const CurrentIcon = currentPillar.icon;

  return (
    <section className="about-hero-section">
      <div className="container">
        {/* Main Grid: Interactive Left Column + 3D Visual Stage */}
        <div className="about-hero-grid">
          {/* Left Column: Heading, Dynamic Flip & Interactive Pillar Switcher */}
          <div className="about-hero-content">
            <SectionLabel>ABOUT MAHI</SectionLabel>
            <h1 className="about-hero-title">
              Practical expertise.
              <br />
              <span className="about-title-highlight">
                Personal{' '}
                <span key={wordIndex} className="hero-word-flip">
                  <em>{rotatingWords[wordIndex]}</em>
                </span>
              </span>
            </h1>

            <p className="about-hero-lead">
              A local Coimbatore team with a simple belief:{' '}
              <span className="lead-strong">quality work</span> and{' '}
              <span className="lead-strong">genuine care</span> should go hand in hand. From wiring to
              plumbing and home renovations, we bring seasoned craftsmanship to every project.
            </p>

            {/* Highlight Badges */}
            <div className="about-hero-pills">
              <span className="about-pill-item">
                <Zap size={14} /> Rapid 30-Min Dispatch
              </span>
              <span className="about-pill-item">
                <ShieldCheck size={14} /> 100% Verified Specialists
              </span>
              <span className="about-pill-item">
                <Star size={14} /> 4.9/5 Rated in Coimbatore
              </span>
            </div>

            {/* Action Buttons */}
            <div className="about-hero-actions">
              <a
                className="button button-primary"
                href={whatsappLink(
                  `Hello Mahi team, I would like to learn more about your services and book a consultation.`
                )}
                target="_blank"
                rel="noreferrer"
              >
                Talk to our team <ArrowRight size={17} />
              </a>
              <a
                className="button button-quiet"
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/services');
                }}
              >
                Explore services <ChevronRight size={17} />
              </a>
              <a className="about-quick-phone" href={`tel:${phonePrimary}`}>
                <Phone size={14} /> {phonePrimary}
              </a>
            </div>
          </div>

          {/* Right Column: Layered 3D Perspective Card Showcase */}
          <div
            className="about-hero-visual-wrap"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Dynamic Ambient Aura that adapts to the active pillar's accent color */}
            <div
              className="about-ambient-glow"
              style={{
                background: `radial-gradient(circle at 60% 40%, ${currentPillar.accentColor}33, rgba(53,166,207,0.18) 60%, transparent 75%)`,
              }}
            />

            <div
              ref={frameRef}
              className="about-3d-card"
              onMouseMove={handleMouseMove}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              {/* Photo Stage with Crossfade Transitions */}
              <div className="about-card-stage">
                {aboutPillars.map((pillar, idx) => (
                  <img
                    key={pillar.id}
                    src={pillar.image}
                    alt={pillar.fullTitle}
                    className={`about-stage-img ${idx === activeIndex ? 'active' : ''}`}
                    loading="eager"
                  />
                ))}
                <div className="about-image-gradient" />
              </div>

              {/* Floating Badge Top Left: Live Status Pulse */}
              <div className="about-floating-card-status">
                <span className="about-status-pulse-dot" />
                <span>Available across Coimbatore</span>
              </div>

              {/* Floating Badge Top Right: 10+ Years Trust & Star Rating */}
              <div className="about-floating-card-top">
                <div className="about-badge-icon-box">
                  <Award size={20} />
                </div>
                <div>
                  <div className="about-rating-row">
                    <div className="about-stars">
                      <Star size={11} fill="currentColor" />
                      <Star size={11} fill="currentColor" />
                      <Star size={11} fill="currentColor" />
                      <Star size={11} fill="currentColor" />
                      <Star size={11} fill="currentColor" />
                    </div>
                    <strong>10+ Years Trust</strong>
                  </div>
                  <small>Coimbatore’s Dependable Team</small>
                </div>
              </div>

              {/* Unified Glassmorphic Bottom Dock (Zero Overlap) */}
              <div className="about-card-bottom-dock">
                <div className="about-dock-info">
                  <div
                    className="about-bottom-icon"
                    style={{ color: currentPillar.accentColor }}
                  >
                    <CurrentIcon size={20} />
                  </div>
                  <div className="about-dock-text">
                    <div className="about-bottom-pill">
                      <CheckCircle2 size={13} style={{ color: currentPillar.accentColor }} />
                      <span>{currentPillar.badgeLabel}</span>
                    </div>
                    <strong>{currentPillar.badgeHighlight}</strong>
                  </div>
                </div>

                {/* Dock Controls: Nav Buttons & Numbered Pills */}
                <div className="about-dock-controls">
                  <div className="about-card-nav-group">
                    <button
                      type="button"
                      className="about-card-nav-btn"
                      onClick={handlePrev}
                      aria-label="Previous service"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      type="button"
                      className="about-card-nav-btn"
                      onClick={() => setIsPlaying(!isPlaying)}
                      aria-label={isPlaying ? 'Pause auto-cycle' : 'Play auto-cycle'}
                    >
                      {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                    <button
                      type="button"
                      className="about-card-nav-btn"
                      onClick={handleNext}
                      aria-label="Next service"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>

                  <div className="about-card-pills">
                    {aboutPillars.map((pillar, idx) => (
                      <button
                        key={pillar.id}
                        type="button"
                        className={`about-card-pill-btn ${idx === activeIndex ? 'active' : ''}`}
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`View ${pillar.shortTitle}`}
                      >
                        {pillar.number}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Asymmetrical Geometric Modern Accent Frame */}
            <div className="about-hero-shape" />
          </div>
        </div>

        {/* Interactive Metric Stats Bar with Hover Effects */}
        <div className="about-hero-stats">
          <div className="about-stat-box">
            <div className="about-stat-icon-wrap">
              <Award size={20} />
            </div>
            <div>
              <strong>10+</strong>
              <span>Years of Master Craftsmanship</span>
            </div>
          </div>
          <div className="about-stat-box">
            <div className="about-stat-icon-wrap">
              <Sparkles size={20} />
            </div>
            <div>
              <strong>2.5k+</strong>
              <span>Homes & Commercial Spaces Done</span>
            </div>
          </div>
          <div className="about-stat-box">
            <div className="about-stat-icon-wrap">
              <ShieldCheck size={20} />
            </div>
            <div>
              <strong>100%</strong>
              <span>Quality & Neatness Guarantee</span>
            </div>
          </div>
          <div className="about-stat-box">
            <div className="about-stat-icon-wrap">
              <Clock3 size={20} />
            </div>
            <div>
              <strong>24/7</strong>
              <span>Rapid Emergency Response</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
