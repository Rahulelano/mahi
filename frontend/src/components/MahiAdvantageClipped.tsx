import { useEffect, useState } from 'react';
import { ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { SectionLabel } from './SectionLabel';

interface AdvantageItem {
  id: string;
  step: string;
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  accent: string;
}

const advantageData: AdvantageItem[] = [
  {
    id: 'technicians',
    step: '01',
    icon: ShieldCheck,
    title: 'Verified Technicians',
    description:
      'Experienced and vetted professionals who handle your property with utmost respect.',
    accent: 'var(--orange-500)',
  },
  {
    id: 'equipment',
    step: '02',
    icon: Wrench,
    title: 'Standard Equipment',
    description:
      'Top-tier tools and genuine replacement parts to ensure durable, safe results.',
    accent: 'var(--blue-500)',
  },
  {
    id: 'clean',
    step: '03',
    icon: Sparkles,
    title: 'Clean & Neat Finish',
    description:
      'We believe in leaving your home spotless after completing the installation or repair.',
    accent: 'var(--orange-500)',
  },
];

export function MahiAdvantageClipped() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle through the 3 cards every 3.8s if not hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % advantageData.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <section className="section mahi-advantage-clipped-section">
      <div className="container">
        {/* Centered Heading */}
        <div className="section-heading centered">
          <div>
            <SectionLabel>THE MAHI ADVANTAGE</SectionLabel>
            <h2 className="advantage-heading-title">
              Why Coimbatore trusts
              <br />
              <em className="advantage-heading-em">our services.</em>
            </h2>
          </div>
        </div>

        {/* Clipped Animated Cards Grid */}
        <div
          className="advantage-clipped-grid"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {advantageData.map((item, idx) => {
            const isActive = idx === activeIdx;
            const IconComponent = item.icon;

            return (
              <div
                key={item.id}
                className={`advantage-clipped-card ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveIdx(idx)}
                onMouseEnter={() => setActiveIdx(idx)}
                role="button"
                tabIndex={0}
                aria-label={item.title}
                style={
                  {
                    '--card-accent': item.accent,
                    animationDelay: `${idx * 0.1}s`,
                  } as React.CSSProperties
                }
              >
                {/* Clipped Top Corner Notch */}
                <div className="card-clip-corner-notch">
                  <span>{item.step}</span>
                </div>

                {/* Animated Clip-Path Reveal Gradient Overlay */}
                <div className="card-clip-reveal-backdrop" />

                {/* Clipped Animated Icon Badge (Hexagonal Clip-Path) */}
                <div className="card-clip-icon-wrapper">
                  <div className="card-clip-hexagon-pulse" />
                  <div className="card-clip-hexagon-box">
                    <IconComponent size={24} className="card-clip-icon" />
                  </div>
                </div>

                {/* Content */}
                <div className="card-clip-content">
                  <h3 className="card-clip-title">{item.title}</h3>
                  <p className="card-clip-desc">{item.description}</p>
                </div>

                {/* Bottom Clipped Animated Progress Bar */}
                {isActive && (
                  <div className="card-clip-timer-line">
                    <span
                      className={`card-clip-timer-fill ${
                        !isHovered ? 'running' : 'paused'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
