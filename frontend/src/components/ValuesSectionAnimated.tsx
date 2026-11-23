import { useEffect, useState } from 'react';
import { Clock3, ShieldCheck, Star } from 'lucide-react';
import { SectionLabel } from './SectionLabel';

interface ValueItem {
  id: string;
  number: string;
  icon: typeof Clock3;
  title: string;
  description: string;
  color: string;
}

const valuesData: ValueItem[] = [
  {
    id: 'on-time',
    number: '01',
    icon: Clock3,
    title: 'On time, every time',
    description: 'We respect your schedule and keep you informed at every step.',
    color: 'var(--orange-500)',
  },
  {
    id: 'trust',
    number: '02',
    icon: ShieldCheck,
    title: 'Work you can trust',
    description: 'Careful work, quality materials, and a finish that holds up.',
    color: 'var(--blue-500)',
  },
  {
    id: 'people-first',
    number: '03',
    icon: Star,
    title: 'People first',
    description: 'Friendly advice and an experience that feels easy from start to finish.',
    color: 'var(--orange-500)',
  },
];

export function ValuesSectionAnimated() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle through the 3 values every 3.8s if not hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % valuesData.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <section className="values-section section">
      <div className="container">
        <div className="section-heading centered">
          <div>
            <SectionLabel>WHAT MATTERS TO US</SectionLabel>
            <h2 className="values-title">
              Service with
              <br />
              <em className="values-em">substance.</em>
            </h2>
          </div>
        </div>

        <div
          className="values-animated-grid"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {valuesData.map((val, idx) => {
            const isActive = idx === activeIdx;
            const Icon = val.icon;

            return (
              <div
                key={val.id}
                className={`value-animated-card ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => setActiveIdx(idx)}
                role="button"
                tabIndex={0}
                aria-label={val.title}
                style={
                  {
                    '--val-accent': val.color,
                  } as React.CSSProperties
                }
              >
                {/* Top Accent Line */}
                <div className="value-card-top-bar" />

                {/* Animated Floating Icon Container with Pulse Ring */}
                <div className="value-icon-wrapper">
                  <span className="value-icon-pulse" />
                  <div className="value-icon-box">
                    <Icon size={24} />
                  </div>
                </div>

                <span className="value-number">{val.number}</span>
                <h3>{val.title}</h3>
                <p>{val.description}</p>

                {/* Active Progress Countdown Line */}
                {isActive && (
                  <div className="value-card-progress">
                    <span
                      className={`value-card-progress-bar ${
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
