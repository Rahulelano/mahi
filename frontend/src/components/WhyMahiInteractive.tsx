import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, ShieldCheck, Sparkles } from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { navigate } from '../utils/navigation';
import { serviceImages } from '../data/services';

interface FeaturePillar {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  statBadge: string;
  tagline: string;
  icon: typeof Clock3;
  image: string;
  accentColor: string;
}

const pillars: FeaturePillar[] = [
  {
    id: 'punctual',
    number: '01',
    title: 'On-Time & Reliable',
    subtitle:
      'We respect your schedule. Confirmed appointment times, quick response, and punctual arrival across Coimbatore.',
    statBadge: '100% Punctual Record',
    tagline: 'Average response under 30 minutes',
    icon: Clock3,
    image: serviceImages.plumbing,
    accentColor: 'var(--orange-500)',
  },
  {
    id: 'clean',
    number: '02',
    title: 'Neat & Spotless Work',
    subtitle:
      'No messy wires, water marks, or cleanup chores left for you. We protect your surfaces and leave your space cleaner than we found it.',
    statBadge: 'Zero Mess Guarantee',
    tagline: 'Clean uniforms & floor protection',
    icon: Sparkles,
    image: serviceImages.epoxy,
    accentColor: 'var(--blue-500)',
  },
  {
    id: 'durable',
    number: '03',
    title: 'Built To Last',
    subtitle:
      'No shortcuts or temporary patches. We use certified materials, high-precision tools, and proven techniques for lasting peace of mind.',
    statBadge: 'Quality Guaranteed',
    tagline: 'Standard warranty on all repairs',
    icon: ShieldCheck,
    image: serviceImages.cleaning,
    accentColor: 'var(--orange-500)',
  },
];

export function WhyMahiInteractive() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const frameRef = useRef<HTMLDivElement>(null);

  // Auto-cycle between pillars every 5 seconds if not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % pillars.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Interactive 3D Perspective Tilt on Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -7;
    const tiltY = ((x - centerX) / centerX) * 7;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const currentPillar = pillars[activeIndex];
  const Icon = currentPillar.icon;

  return (
    <section className="why-mahi-section section">
      <div className="container">
        <div className="why-mahi-grid">
          {/* Left Column: Story & Interactive Pillars */}
          <div className="why-mahi-content">
            <SectionLabel>WHY MAHI</SectionLabel>
            <h2>
              Small details.
              <br />
              <em>Big difference.</em>
            </h2>
            <p className="why-mahi-lead">
              When something at home needs fixing, you need more than a quick patch. You need a
              team that shows up on time, works neatly, and leaves things better than they found
              them.
            </p>

            {/* Interactive Pillar List */}
            <div className="why-mahi-pillars">
              {pillars.map((pillar, idx) => {
                const isActive = idx === activeIndex;
                const PillarIcon = pillar.icon;

                return (
                  <div
                    key={pillar.id}
                    className={`pillar-card ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                    onMouseEnter={() => {
                      setActiveIndex(idx);
                      setIsHovered(true);
                    }}
                    onMouseLeave={() => setIsHovered(false)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${pillar.title}`}
                  >
                    <div className="pillar-header">
                      <span className="pillar-number">{pillar.number}</span>
                      <span className="pillar-icon-wrap">
                        <PillarIcon size={16} />
                      </span>
                      <h3>{pillar.title}</h3>
                    </div>
                    <p>{pillar.subtitle}</p>
                    {isActive && (
                      <div className="pillar-active-bar">
                        <span className="pillar-progress-line" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="why-mahi-actions">
              <a
                className="text-link"
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/about');
                }}
              >
                More about Mahi <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Right Column: Layered Interactive Visual Showcase */}
          <div
            className="why-mahi-visual-wrap"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="why-mahi-ambient-aura" />

            <div
              ref={frameRef}
              className="why-mahi-3d-card"
              onMouseMove={handleMouseMove}
              style={{
                transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              {/* Main Image with Crossfade */}
              <div className="why-mahi-image-stage">
                {pillars.map((pillar, idx) => (
                  <img
                    key={pillar.id}
                    src={pillar.image}
                    alt={pillar.title}
                    className={`why-mahi-img ${idx === activeIndex ? 'active' : ''}`}
                    loading="lazy"
                  />
                ))}
                <div className="why-mahi-image-gradient" />
              </div>

              {/* Floating Quality Badge (Top Left) */}
              <div className="why-floating-badge top-badge">
                <span className="badge-pulse-ring" />
                <span className="badge-dot" />
                <span>The Mahi Standard</span>
              </div>

              {/* Overlapping Floating Detail Card (Bottom Right) */}
              <div className="why-floating-card">
                <div className="floating-card-icon" style={{ color: currentPillar.accentColor }}>
                  <Icon size={20} />
                </div>
                <div className="floating-card-info">
                  <div className="floating-card-badge">
                    <CheckCircle2 size={13} style={{ color: currentPillar.accentColor }} />
                    <strong>{currentPillar.statBadge}</strong>
                  </div>
                  <small>{currentPillar.tagline}</small>
                </div>
              </div>

              {/* Interactive Thumbnail Switcher (Bottom Left) */}
              <div className="why-thumb-switcher">
                {pillars.map((pillar, idx) => (
                  <button
                    key={pillar.id}
                    type="button"
                    className={`why-thumb-btn ${idx === activeIndex ? 'active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`View ${pillar.title}`}
                  >
                    <span>{pillar.number}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Asymmetric Geometric Accent Line */}
            <div className="why-mahi-accent-frame" />
          </div>
        </div>
      </div>
    </section>
  );
}
