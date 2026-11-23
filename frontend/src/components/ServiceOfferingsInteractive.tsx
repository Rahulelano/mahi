import { useEffect, useState } from 'react';
import { Check, CheckCircle2, ChevronRight, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { whatsappLink } from '../data/services';
import { Service } from '../types';

interface ServiceOfferingsInteractiveProps {
  service: Service;
}

export function ServiceOfferingsInteractive({ service }: ServiceOfferingsInteractiveProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const isBlue = service.color === 'blue';
  const accentColor = isBlue ? 'var(--blue-500)' : 'var(--orange-500)';

  // Auto-cycle through the 4 offering points every 3.8s when not hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % service.points.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPaused, service.points.length]);

  return (
    <section className="section detail-offerings-animated-section">
      <div className="container">
        <div className="detail-offerings-grid">
          {/* Left Column: Heading & Description */}
          <div className="detail-offerings-copy">
            <SectionLabel>WHAT WE OFFER</SectionLabel>
            <h2 className="detail-offerings-title">
              Good service is
              <br />
              <em className="detail-offerings-em" style={{ color: accentColor }}>
                in the details.
              </em>
            </h2>
            <p className="detail-offerings-desc">
              From the first conversation to the final check, we focus on work that is safe, clean,
              and made to last.
            </p>

            {/* Quick Assurance Badges */}
            <div className="detail-assurance-stack">
              <div className="detail-assurance-item">
                <div className="assurance-icon-box" style={{ color: accentColor }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong>Safety & precision verified</strong>
                  <small>Standard protocols for all installations</small>
                </div>
              </div>

              <div className="detail-assurance-item">
                <div className="assurance-icon-box" style={{ color: accentColor }}>
                  <Wrench size={18} />
                </div>
                <div>
                  <strong>Genuine materials & tools</strong>
                  <small>Durable components that stand up to daily use</small>
                </div>
              </div>

              <div className="detail-assurance-item">
                <div className="assurance-icon-box" style={{ color: accentColor }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <strong>Spotless work area</strong>
                  <small>Zero mess left behind when the job is done</small>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Animated Offering Cards */}
          <div
            className="detail-points-interactive-wrap"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="detail-points-interactive-grid">
              {service.points.map((point, idx) => {
                const isActive = activeIndex === idx;
                const formattedNumber = `0${idx + 1}`;

                return (
                  <div
                    key={point}
                    className={`offering-interactive-card ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setActiveIndex(idx);
                      }
                    }}
                  >
                    {/* Active Accent Border Line */}
                    <div
                      className="offering-card-accent-line"
                      style={{
                        background: isBlue
                          ? 'linear-gradient(90deg, var(--blue-500), #2ba0cf)'
                          : 'linear-gradient(90deg, var(--orange-500), #e07f0b)',
                      }}
                    />

                    {/* Card Header: Number & Check Badge */}
                    <div className="offering-card-header">
                      <span className="offering-card-number">{formattedNumber}</span>
                      <div
                        className={`offering-card-check ${isActive ? 'active-check' : ''}`}
                        style={{
                          background: isActive
                            ? accentColor
                            : isBlue
                            ? 'rgba(53, 166, 207, 0.12)'
                            : 'rgba(242, 154, 41, 0.12)',
                          color: isActive ? '#ffffff' : accentColor,
                        }}
                      >
                        <Check size={14} />
                      </div>
                    </div>

                    {/* Point Title */}
                    <h3 className="offering-point-title">{point}</h3>

                    {/* Quick WhatsApp Link Action */}
                    <div className="offering-card-action">
                      <a
                        className="offering-whatsapp-trigger"
                        href={whatsappLink(
                          `Hello Mahi Works, I would like to enquire specifically about ${service.title} - ${point}.`
                        )}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Enquire for this</span>
                        <ChevronRight size={14} className="action-chevron" />
                      </a>
                    </div>

                    {/* Animated Progress Timer Line (only on active card) */}
                    {isActive && (
                      <div className="offering-timer-track">
                        <div
                          className={`offering-timer-fill ${isPaused ? 'paused' : 'running'}`}
                          style={{ background: accentColor }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Hint Note */}
            <div className="detail-points-hint">
              <CheckCircle2 size={14} style={{ color: accentColor }} />
              <span>Click any card to enquire directly for that specific requirement.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
