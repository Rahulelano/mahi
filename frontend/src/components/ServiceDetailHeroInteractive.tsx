import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Phone, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { phonePrimary, services, whatsappLink } from '../data/services';
import { Service } from '../types';
import { navigate } from '../utils/navigation';

interface ServiceDetailHeroInteractiveProps {
  service: Service;
}

const rotatingWords = ['properly.', 'safely.', 'reliably.', 'expertly.'];

export function ServiceDetailHeroInteractive({ service }: ServiceDetailHeroInteractiveProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const ServiceIcon = service.icon;
  const isBlue = service.color === 'blue';
  const accentColor = isBlue ? 'var(--blue-500)' : 'var(--orange-500)';

  // Rotate headline kinetic words
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // 3D Perspective Tilt on Mouse Movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -(y / (rect.height / 2)) * 8,
      y: (x / (rect.width / 2)) * 8,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <section className="service-detail-hero-animated">
      <div className="container">
        {/* Top Navigation & Service Quick Switcher */}
        <div className="detail-top-nav-bar">
          <button
            type="button"
            className="detail-back-button"
            onClick={() => navigate('/services')}
          >
            <ArrowLeft size={15} className="detail-back-arrow" />
            <span>Back to all services</span>
          </button>

          {/* Quick Service Switcher Tabs */}
          <div className="detail-service-switcher" role="tablist" aria-label="Switch Service">
            {services.map((item) => {
              const isActive = item.slug === service.slug;
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.slug}
                  type="button"
                  className={`detail-switcher-tab ${isActive ? 'is-active' : ''}`}
                  onClick={() => navigate(`/${item.slug}`)}
                  role="tab"
                  aria-selected={isActive}
                >
                  <ItemIcon size={13} className="switcher-tab-icon" />
                  <span>{item.title.replace(' Works', '').replace(' Work', '')}</span>
                  {isActive && <span className="switcher-tab-dot" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hero Grid */}
        <div className="detail-hero-interactive-grid">
          {/* Left: Content Column */}
          <div className="detail-hero-interactive-copy">
            {/* Animated Icon Badge */}
            <div className="detail-hero-icon-wrap">
              <div
                className={`detail-hero-icon-box ${isBlue ? 'blue-bg' : 'orange-bg'}`}
                style={{
                  boxShadow: isBlue
                    ? '0 10px 25px rgba(53, 166, 207, 0.35)'
                    : '0 10px 25px rgba(242, 154, 41, 0.35)',
                }}
              >
                <ServiceIcon size={24} />
              </div>
              <div className="detail-hero-live-badge">
                <span className="live-status-dot" />
                <span>Available across Coimbatore</span>
              </div>
            </div>

            {/* Eyebrow */}
            <div className="detail-hero-eyebrow-row">
              <SectionLabel>{service.eyebrow.toUpperCase()}</SectionLabel>
            </div>

            {/* Kinetic Typography Headline */}
            <h1 className="detail-hero-headline">
              {service.title}
              <br />
              <span className="detail-hero-accent-row">
                done{' '}
                <span key={wordIndex} className="detail-word-rotator" style={{ color: accentColor }}>
                  <em>{rotatingWords[wordIndex]}</em>
                </span>
              </span>
            </h1>

            {/* Service Description */}
            <p className="detail-hero-description">{service.description}</p>

            {/* Action Buttons */}
            <div className="hero-actions detail-hero-actions">
              <a
                className="button button-primary detail-enquire-btn"
                href={whatsappLink(
                  `Hello Mahi team, I would like to book or enquire about ${service.title}.`
                )}
                target="_blank"
                rel="noreferrer"
              >
                <span>Enquire now</span>
                <ArrowRight size={17} className="btn-arrow-slide" />
              </a>

              <a
                className="button button-quiet detail-call-btn"
                href={`tel:${phonePrimary}`}
              >
                <Phone size={16} />
                <span>Call us</span>
              </a>
            </div>

            {/* Mini Trust Badges */}
            <div className="detail-trust-pills">
              <div className="trust-pill-item">
                <ShieldCheck size={14} className="trust-pill-icon" />
                <span>Verified Specialists</span>
              </div>
              <div className="trust-pill-item">
                <Sparkles size={14} className="trust-pill-icon" />
                <span>100% Quality Check</span>
              </div>
            </div>
          </div>

          {/* Right: 3D Interactive Tilt Visual Stage */}
          <div className="detail-hero-interactive-stage">
            {/* Ambient Background Glow */}
            <div
              className="detail-stage-ambient-glow"
              style={{
                background: isBlue
                  ? 'radial-gradient(circle, rgba(53, 166, 207, 0.22) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(242, 154, 41, 0.22) 0%, transparent 70%)',
              }}
            />

            {/* 3D Tilted Card Container */}
            <div
              ref={cardRef}
              className={`detail-3d-card-frame ${isHovered ? 'is-hovered' : ''}`}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
              }}
            >
              {/* Decorative Corner Accent Frame */}
              <div
                className="detail-stage-accent-corner"
                style={{
                  borderColor: accentColor,
                  transform: `translate(${rotate.y * -0.6}px, ${rotate.x * 0.6}px)`,
                }}
              />

              {/* Main Service Photograph */}
              <div className="detail-photo-container">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="eager"
                  className="detail-photo-img"
                />
                <div className="detail-photo-overlay" />
              </div>

              {/* Floating Badge 1: Bottom Left (Trusted local service) */}
              <div
                className="detail-floating-badge detail-badge-bottom"
                style={{
                  transform: `translate3d(${rotate.y * 0.8}px, ${rotate.x * -0.8}px, 25px)`,
                }}
              >
                <div className="badge-check-icon">
                  <Check size={15} />
                </div>
                <div>
                  <strong>Trusted local service</strong>
                  <small>Coimbatore & surrounding areas</small>
                </div>
              </div>

              {/* Floating Badge 2: Top Right (Quick Response) */}
              <div
                className="detail-floating-badge detail-badge-top"
                style={{
                  transform: `translate3d(${rotate.y * -0.8}px, ${rotate.x * 0.8}px, 20px)`,
                }}
              >
                <div className="badge-spark-icon" style={{ color: accentColor }}>
                  <Zap size={15} />
                </div>
                <div>
                  <strong>Fast Doorstep Service</strong>
                  <small>Equipped & ready</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
