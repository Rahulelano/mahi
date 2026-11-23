import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { serviceImages, whatsappLink } from '../data/services';

interface PromiseItem {
  id: string;
  title: string;
  desc: string;
  badge: string;
  icon: typeof ShieldCheck;
  highlightColor: string;
  image: string;
}

const promiseItems: PromiseItem[] = [
  {
    id: 'skilled',
    title: 'Skilled & Certified Professionals',
    desc: 'Every technician is background-checked, experienced, and trained to handle complex jobs safely and efficiently.',
    badge: '100% Verified Experts',
    icon: ShieldCheck,
    highlightColor: 'var(--orange-500)',
    image: serviceImages.plumbing,
  },
  {
    id: 'neat',
    title: 'Neat Work With Lasting Results',
    desc: 'We treat your property like our own. Work areas are protected with coverings and thoroughly cleaned before we leave.',
    badge: 'Zero-Mess Guarantee',
    icon: Sparkles,
    highlightColor: 'var(--blue-500)',
    image: serviceImages.epoxy,
  },
];

export function MahiPromiseInteractive() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const visualRef = useRef<HTMLDivElement>(null);

  // Auto-cycle every 4.8s if not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % promiseItems.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!visualRef.current) return;
    const rect = visualRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -6;
    const tiltY = ((x - centerX) / centerX) * 6;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const currentPromise = promiseItems[activeIndex];
  const CurrentIcon = currentPromise.icon;

  return (
    <section className="promise-section section">
      <div className="container">
        <div className="promise-interactive-grid">
          {/* Left Column: Interactive Visual Showcase */}
          <div
            className="promise-visual-stage"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Ambient Pulse Glow */}
            <div className="promise-ambient-glow" />

            {/* 3D Interactive Card Frame */}
            <div
              ref={visualRef}
              className="promise-3d-frame"
              onMouseMove={handleMouseMove}
              style={{
                transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              {/* Image Crossfade Stack */}
              <div className="promise-images-holder">
                {promiseItems.map((item, idx) => (
                  <img
                    key={item.id}
                    src={item.image}
                    alt={item.title}
                    className={`promise-img-layer ${idx === activeIndex ? 'is-active' : ''}`}
                    loading="lazy"
                  />
                ))}
                <div className="promise-img-overlay" />
              </div>

              {/* Floating Shield Stamp (Top Right) */}
              <div className="promise-stamp-card">
                <div className="stamp-icon-ring">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <span>Done right,</span>
                  <strong>every time.</strong>
                </div>
              </div>

              {/* Floating Active Guarantee Pill (Bottom Left) */}
              <div className="promise-floating-badge">
                <div className="promise-badge-icon" style={{ color: currentPromise.highlightColor }}>
                  <CurrentIcon size={16} />
                </div>
                <div className="promise-badge-content">
                  <small>Mahi Guarantee</small>
                  <strong>{currentPromise.badge}</strong>
                </div>
              </div>

              {/* Interactive Thumbnail Dots (Bottom Right) */}
              <div className="promise-mini-dots">
                {promiseItems.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`promise-dot-btn ${idx === activeIndex ? 'active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Select ${item.title}`}
                  />
                ))}
              </div>
            </div>

            {/* Underlay Accent Box */}
            <div className="promise-accent-backdrop" />
          </div>

          {/* Right Column: Interactive Promise Cards */}
          <div className="promise-copy">
            <SectionLabel>THE MAHI PROMISE</SectionLabel>
            <h2>
              Work you can
              <br />
              <em>feel good about.</em>
            </h2>
            <p className="promise-lead-text">
              We believe great service should feel simple. You tell us what you need, we bring the
              right expertise, tools, and attention to detail.
            </p>

            {/* Interactive Promise Items */}
            <div className="promise-cards-list">
              {promiseItems.map((item, idx) => {
                const isActive = idx === activeIndex;

                return (
                  <div
                    key={item.id}
                    className={`promise-item-card ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                    onMouseEnter={() => {
                      setActiveIndex(idx);
                      setIsHovered(true);
                    }}
                    onMouseLeave={() => setIsHovered(false)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Promise: ${item.title}`}
                  >
                    <div className="promise-item-left">
                      <span className={`promise-check-icon ${isActive ? 'active' : ''}`}>
                        <Check size={14} />
                      </span>
                    </div>

                    <div className="promise-item-body">
                      <div className="promise-item-title-row">
                        <h4>{item.title}</h4>
                        <span className="promise-item-tag">{item.badge}</span>
                      </div>
                      <p>{item.desc}</p>

                      {isActive && (
                        <div className="promise-progress-line-track">
                          <span className="promise-progress-line-fill" />
                        </div>
                      )}
                    </div>

                    <div className="promise-item-arrow">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="promise-actions">
              <a
                className="button button-dark"
                href={whatsappLink('Hello Mahi team, I would like to enquire about your services and promise guarantee.')}
                target="_blank"
                rel="noreferrer"
              >
                Start a conversation <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
