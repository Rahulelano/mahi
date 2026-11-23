import { useEffect, useState } from 'react';
import { ArrowRight, Award, ChevronRight } from 'lucide-react';
import { SectionLabel } from '../components/SectionLabel';
import { ServicesCarousel } from '../components/ServicesCarousel';
import { WhyMahiInteractive } from '../components/WhyMahiInteractive';
import { MahiPromiseInteractive } from '../components/MahiPromiseInteractive';
import { phonePrimary, serviceImages, services, whatsappLink } from '../data/services';
import { navigate } from '../utils/navigation';

const heroRotatingWords = ['Trust', 'Professional', 'Good', 'Reliable', 'Quality'];

export function HomePage() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % heroRotatingWords.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-pattern" />
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-kicker">
              <span className="kicker-line" /> COIMBATORE'S SMART SERVICE PARTNER
            </div>
            <h1 className="home-hero-headline">
              <span key={wordIndex} className="hero-rotating-word">
                {heroRotatingWords[wordIndex]}
              </span>{' '}
              service for
              <br />
              <em>Mahi Electrical &amp; Plumbing Works</em>
              <br />
              in Coimbatore.
            </h1>
            <p className="hero-copy">
              From the wire in your wall to the water in your tap, we bring skilled hands and
              dependable solutions to every corner of your space.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
              >
                Enquire now <ArrowRight size={18} />
              </a>
              <a
                className="button button-quiet"
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/services');
                }}
              >
                Explore services <ChevronRight size={18} />
              </a>
            </div>
            <div className="hero-trust">
              <div className="avatar-stack">
                <span>ME</span>
                <span>EP</span>
                <span>MW</span>
              </div>
              <div>
                <strong>One team. Every solution.</strong>
                <small>Electrical · Plumbing · Home care</small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-ambient-glow" />

            <div className="hero-image-frame">
              <img
                src={serviceImages.electrical}
                alt="Professional technician providing skilled electrical service in Coimbatore"
                loading="eager"
              />
              <div className="image-tag">
                <span className="pulse-dot" /> Available for service today
              </div>
            </div>

            <div className="hero-badge">
              <Award size={22} />
              <span>
                <strong>Quality first</strong>
                <small>Since day one</small>
              </span>
            </div>

            <div className="hero-rating-badge">
              <div className="rating-stars">★★★★★</div>
              <div>
                <strong>4.9/5 Rating</strong>
                <small>500+ Homes in Coimbatore</small>
              </div>
            </div>

            <div className="hero-orange-shape" />
          </div>
        </div>

        <div className="container hero-metrics">
          <div>
            <strong>05</strong>
            <span>Expert services</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>Care in every job</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>Quick response</span>
          </div>
          <div className="metric-note">
            <span className="metric-dot" /> Proudly serving Coimbatore
          </div>
        </div>
      </section>

      {/* Interactive Why Mahi Section */}
      <WhyMahiInteractive />

      {/* Services Overview Section */}
      <section className="services-section section" id="services">
        <div className="container">
          <div className="section-heading">
            <div>
              <SectionLabel>WHAT WE DO</SectionLabel>
              <h2>
                Solutions for your
                <br />
                <em>everyday needs.</em>
              </h2>
            </div>
            <p>One trusted team for the work that keeps your home, office, or business moving.</p>
          </div>

          <ServicesCarousel services={services} />

          <div className="services-foot">
            <span>Looking for full details?</span>
            <a
              className="text-link"
              href="/services"
              onClick={(e) => {
                e.preventDefault();
                navigate('/services');
              }}
            >
              View all services <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Promise Section */}
      <MahiPromiseInteractive />

      {/* Contact Strip */}
      <section className="contact-strip">
        <div className="container contact-strip-inner">
          <div>
            <SectionLabel>READY WHEN YOU ARE</SectionLabel>
            <h2>
              Let's make your space
              <br />
              <em>work better.</em>
            </h2>
          </div>
          <div className="contact-strip-actions">
            <p>Tell us what you need. We’ll take it from there.</p>
            <a className="button button-light" href={`tel:${phonePrimary}`}>
              Call {phonePrimary}
            </a>
            <a
              className="button button-outline-light"
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp us <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
