import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { serviceImages, whatsappLink } from '../data/services';
import { navigate } from '../utils/navigation';

interface StoryChapter {
  id: string;
  step: string;
  title: string;
  highlight: string;
  image: string;
  icon: typeof Zap;
  accent: string;
}

const chapters: StoryChapter[] = [
  {
    id: 'foundation',
    step: '01 • THE FOUNDATION',
    title: 'Master Trade Roots',
    highlight: 'Started with electrical & plumbing mastery',
    image: serviceImages.electrical,
    icon: Zap,
    accent: 'var(--orange-500)',
  },
  {
    id: 'expansion',
    step: '02 • GROWTH & SCALE',
    title: 'Complete Space Care',
    highlight: 'Added epoxy coatings & deep cleaning works',
    image: serviceImages.epoxy,
    icon: Sparkles,
    accent: 'var(--blue-500)',
  },
  {
    id: 'turnkey',
    step: '03 • FULL SPECTRUM',
    title: 'Your Single Trusted Partner',
    highlight: 'Turnkey home, office & relocation support',
    image: serviceImages.moving,
    icon: Compass,
    accent: 'var(--orange-500)',
  },
];

export function OurStoryAnimated() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const frameRef = useRef<HTMLDivElement>(null);

  // Auto-cycle through the 3 story chapters every 5.2 seconds if not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveChapter((prev) => (prev + 1) % chapters.length);
    }, 5200);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Interactive 3D Perspective Tilt on Mouse Movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
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

  const current = chapters[activeChapter];
  const CurrentIcon = current.icon;

  return (
    <section className="section story-animated-section">
      <div className="container">
        <div className="story-animated-grid">
          {/* Left Column: Interactive 3D Perspective Visual Showcase */}
          <div
            className="story-visual-wrap"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Ambient Background Aura */}
            <div
              className="story-ambient-glow"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${current.accent}28, rgba(53,166,207,0.15) 60%, transparent 75%)`,
              }}
            />

            <div
              ref={frameRef}
              className="story-3d-card"
              onMouseMove={handleMouseMove}
              style={{
                transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              {/* Image Crossfade Stage */}
              <div className="story-image-stage">
                {chapters.map((chap, idx) => (
                  <img
                    key={chap.id}
                    src={chap.image}
                    alt={chap.title}
                    className={`story-stage-img ${idx === activeChapter ? 'active' : ''}`}
                    loading="lazy"
                  />
                ))}
                <div className="story-image-gradient" />
              </div>

              {/* Floating Badge (Top Right): Established Badge */}
              <div className="story-floating-badge-top">
                <div className="story-badge-icon">
                  <Award size={18} />
                </div>
                <div>
                  <strong>10+ Years Trust</strong>
                  <small>Serving Coimbatore Since 2014</small>
                </div>
              </div>

              {/* Floating Bottom Card: Dynamic Chapter Info */}
              <div className="story-floating-bottom-dock">
                <div className="story-bottom-icon" style={{ color: current.accent }}>
                  <CurrentIcon size={20} />
                </div>
                <div className="story-bottom-text">
                  <span className="story-bottom-year">{current.step}</span>
                  <strong>{current.highlight}</strong>
                </div>
              </div>

              {/* Interactive Chapter Indicator Switchers */}
              <div className="story-chapter-switchers">
                {chapters.map((chap, idx) => (
                  <button
                    key={chap.id}
                    type="button"
                    className={`story-chapter-dot ${idx === activeChapter ? 'active' : ''}`}
                    onClick={() => setActiveChapter(idx)}
                    aria-label={`View ${chap.title}`}
                  >
                    <span>0{idx + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Anchored Geometric Accent Frame */}
            <div className="story-accent-frame" />
          </div>

          {/* Right Column: Story Narrative, Interactive Milestone Tabs & Actions */}
          <div className="story-content-wrap">
            <SectionLabel>OUR STORY</SectionLabel>
            <h2 className="story-heading">
              Built around
              <br />
              <em className="story-em">doing it right.</em>
            </h2>

            <p className="story-lead">
              Mahi Electrical & Plumbing Works was created to give homes and businesses in Coimbatore
              one dependable place to turn for essential services. What started with technical
              craftsmanship has grown into a complete service partner for every space.
            </p>

            {/* Interactive Milestone Cards (Clean: No paragraph, no year badge) */}
            <div className="story-timeline-cards">
              {chapters.map((chap, idx) => {
                const isActive = idx === activeChapter;
                const ChapterIcon = chap.icon;

                return (
                  <div
                    key={chap.id}
                    className={`story-timeline-card ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveChapter(idx)}
                    onMouseEnter={() => {
                      setActiveChapter(idx);
                      setIsHovered(true);
                    }}
                    onMouseLeave={() => setIsHovered(false)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${chap.title}`}
                  >
                    <div className="story-timeline-head">
                      <div className="story-timeline-icon">
                        <ChapterIcon size={16} />
                      </div>
                      <h3>{chap.title}</h3>
                      {isActive && <span className="story-active-pill">Active</span>}
                    </div>

                    {/* Active Timer Line */}
                    {isActive && (
                      <div className="story-card-progress-bar">
                        <span
                          className={`story-card-progress-fill ${
                            !isHovered ? 'running' : 'paused'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Key Values Checklist */}
            <div className="story-guarantee-row">
              <span className="story-guarantee-pill">
                <CheckCircle2 size={13} /> Licensed & Certified Tradesmen
              </span>
              <span className="story-guarantee-pill">
                <ShieldCheck size={13} /> Zero Shortcuts or Mess
              </span>
              <span className="story-guarantee-pill">
                <HeartHandshake size={13} /> Honest Upfront Estimates
              </span>
            </div>

            {/* Action Buttons */}
            <div className="story-actions-row">
              <a
                className="button button-dark"
                href={whatsappLink(
                  'Hello Mahi team, I read your story and would like to discuss my project requirements.'
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
                Explore all 5 services <ChevronRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
