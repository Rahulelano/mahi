import { useEffect, useState } from 'react';
import { CheckCircle2, FileText, MessageSquare, Wrench } from 'lucide-react';
import { SectionLabel } from './SectionLabel';

interface ProcessStep {
  step: string;
  title: string;
  desc: string;
  icon: typeof MessageSquare;
}

const processSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'Send Requirement',
    desc: 'Give us a quick call or drop a WhatsApp message describing your service need.',
    icon: MessageSquare,
  },
  {
    step: '02',
    title: 'Instant Quote',
    desc: 'We assess the scope and provide a transparent, upfront price estimate with no hidden costs.',
    icon: FileText,
  },
  {
    step: '03',
    title: 'Doorstep Service',
    desc: 'Our specialist visits your location at the scheduled time fully equipped for the job.',
    icon: Wrench,
  },
  {
    step: '04',
    title: 'Inspection & Signoff',
    desc: 'You inspect the finished work and only pay once completely satisfied.',
    icon: CheckCircle2,
  },
];

export function ServicesProcessAnimated() {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle through the 4 steps every 3.5s if not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % processSteps.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section className="section services-process-animated-section">
      <div className="container">
        {/* Section Heading */}
        <div className="section-heading centered">
          <div>
            <SectionLabel>SIMPLE PROCESS</SectionLabel>
            <h2 className="process-heading-title">
              How we get work
              <br />
              <em className="process-heading-em">done for you.</em>
            </h2>
          </div>
        </div>

        {/* Animated Connecting Track (Desktop) */}
        <div className="process-stepper-track-wrap">
          <div
            className="process-stepper-progress-line"
            style={{
              width: `${(activeStep / (processSteps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Animated Process Cards Grid */}
        <div
          className="process-animated-grid"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {processSteps.map((item, idx) => {
            const isActive = idx === activeStep;
            const isCompleted = idx < activeStep;
            const StepIcon = item.icon;

            return (
              <div
                key={item.step}
                className={`process-animated-card ${isActive ? 'is-active' : ''} ${
                  isCompleted ? 'is-passed' : ''
                }`}
                onClick={() => setActiveStep(idx)}
                onMouseEnter={() => setActiveStep(idx)}
                role="button"
                tabIndex={0}
                aria-label={`Step ${item.step}: ${item.title}`}
                style={{
                  animationDelay: `${idx * 0.08}s`,
                }}
              >
                {/* Top Accent Line */}
                <div className="process-card-top-accent" />

                {/* Header Row: Step Number & Icon */}
                <div className="process-card-head">
                  <span className="process-step-number">{item.step}</span>
                  <div className="process-icon-box">
                    <StepIcon size={18} />
                  </div>
                </div>

                <h3 className="process-step-title">{item.title}</h3>
                <p className="process-step-desc">{item.desc}</p>

                {/* Active Progress Timer Fill Bar */}
                {isActive && (
                  <div className="process-card-timer">
                    <span
                      className={`process-card-timer-fill ${
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
