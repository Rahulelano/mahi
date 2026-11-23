import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Sparkles,
} from 'lucide-react';
import { SectionLabel } from '../components/SectionLabel';
import {
  address,
  email,
  mapDirectionsUrl,
  mapEmbedUrl,
  phonePrimary,
  phoneSecondary,
  whatsappLink,
} from '../data/services';

const rotatingWords = [
  'your next job.',
  'your next project.',
  'urgent repairs.',
  'your home or office.',
];

const servicePresets = [
  { id: 'electrical', label: 'Electrical', query: 'Electrical Works' },
  { id: 'plumbing', label: 'Plumbing', query: 'Plumbing Works' },
  { id: 'epoxy', label: 'Epoxy', query: 'Epoxy Flooring Works' },
  { id: 'cleaning', label: 'Cleaning', query: 'Deep Cleaning Works' },
  { id: 'movers', label: 'Movers', query: 'Packers & Movers' },
  { id: 'survey', label: 'Survey', query: 'Survey Work' },
];

export function ContactPage() {
  const [wordIndex, setWordIndex] = useState(0);
  const [selectedService, setSelectedService] = useState('electrical');
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Rotate headline words
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // 3D Perspective Tilt on Quick Enquiry Card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -(y / (rect.height / 2)) * 6,
      y: (x / (rect.width / 2)) * 6,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const currentPreset =
    servicePresets.find((s) => s.id === selectedService) || servicePresets[0];

  const whatsappMessage = `Hello Mahi team, I would like to enquire about ${currentPreset.query} in Coimbatore.`;

  return (
    <main>
      {/* Interactive Animated Hero Section */}
      <section className="contact-hero-animated">
        <div className="contact-hero-ambient" />
        <div className="container contact-hero-inner">
          <div className="contact-hero-badge-row">
            <SectionLabel>GET IN TOUCH</SectionLabel>
            <div className="contact-live-pill">
              <span className="live-dot" />
              <span>Available 8:00 AM – 9:00 PM across Coimbatore</span>
            </div>
          </div>

          <h1 className="contact-hero-title">
            Let's talk about
            <br />
            <span className="contact-rotator-wrap">
              <span key={wordIndex} className="contact-word-rotator">
                <em>{rotatingWords[wordIndex]}</em>
              </span>
            </span>
          </h1>

          <p className="contact-hero-subtitle">
            Whether it’s urgent or you’re planning ahead, our team is ready to help.
          </p>

          {/* Quick Contact Action Pills */}
          <div className="contact-quick-pills">
            <a href={`tel:${phonePrimary}`} className="quick-pill-link">
              <Phone size={13} />
              <span>Call: {phonePrimary}</span>
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="quick-pill-link highlight-wa"
            >
              <MessageCircle size={13} />
              <span>WhatsApp Chat</span>
            </a>
            <a href={`mailto:${email}`} className="quick-pill-link">
              <Mail size={13} />
              <span>{email}</span>
            </a>
            <a
              href={mapDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="quick-pill-link"
            >
              <MapPin size={13} />
              <span>Sivanandha Colony, Coimbatore</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Contact Grid Section */}
      <section className="section contact-main-section">
        <div className="container contact-main-grid">
          {/* Left Column: Interactive Contact Channel Cards */}
          <div className="contact-channels-column">
            <SectionLabel>CONTACT DETAILS</SectionLabel>
            <h2 className="contact-channels-title">
              We’re just a
              <br />
              <em>call away.</em>
            </h2>
            <p className="contact-channels-desc">
              Share a few details about what you need, and we’ll connect you with the right person.
            </p>

            <div className="contact-methods-stack">
              {/* Phone Card */}
              <a
                className="contact-method-card"
                href={`tel:${phonePrimary}`}
                aria-label="Call primary phone"
              >
                <div className="method-icon-box orange-box">
                  <Phone size={20} />
                </div>
                <div className="method-text-group">
                  <small>Call us directly</small>
                  <strong>
                    {phonePrimary} / {phoneSecondary}
                  </strong>
                  <span className="method-sub">Direct phone line · Prompt answer</span>
                </div>
                <div className="method-arrow-wrap">
                  <ArrowRight size={18} className="method-arrow" />
                </div>
              </a>

              {/* WhatsApp Card */}
              <a
                className="contact-method-card is-wa-card"
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp chat"
              >
                <div className="method-icon-box wa-box">
                  <MessageCircle size={20} />
                </div>
                <div className="method-text-group">
                  <small>WhatsApp us</small>
                  <strong>Start a quick chat</strong>
                  <span className="method-sub">Fastest quotes & photo sharing</span>
                </div>
                <div className="method-arrow-wrap">
                  <ArrowRight size={18} className="method-arrow" />
                </div>
              </a>

              {/* Email Card */}
              <a
                className="contact-method-card"
                href={`mailto:${email}`}
                aria-label="Send email"
              >
                <div className="method-icon-box navy-box">
                  <Mail size={20} />
                </div>
                <div className="method-text-group">
                  <small>Email us</small>
                  <strong>{email}</strong>
                  <span className="method-sub">For detailed proposals & drawings</span>
                </div>
                <div className="method-arrow-wrap">
                  <ArrowRight size={18} className="method-arrow" />
                </div>
              </a>

              {/* Address Card */}
              <a
                className="contact-method-card is-location-card"
                href={mapDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="View address on map"
              >
                <div className="method-icon-box location-box">
                  <MapPin size={20} />
                </div>
                <div className="method-text-group">
                  <small>Office & Service Hub</small>
                  <strong>{address}</strong>
                  <span className="method-sub">
                    <Navigation size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Open Mon – Sun · 8:00 AM – 9:00 PM
                  </span>
                </div>
                <div className="method-arrow-wrap">
                  <ExternalLink size={17} className="method-arrow" />
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: 3D Interactive Quick Enquiry Card */}
          <div className="contact-card-3d-stage">
            <div className="contact-card-ambient-glow" />

            <div
              ref={cardRef}
              className={`contact-interactive-card ${isHovered ? 'is-hovered' : ''}`}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
              }}
            >
              {/* Top Accent Strip */}
              <div className="contact-card-accent-bar" />

              <div className="contact-card-top">
                <div className="contact-card-header-badge">
                  <span className="card-eyebrow">QUICK ENQUIRY</span>
                  <div className="card-spark-badge">
                    <Sparkles size={12} />
                    <span>Instant Reply</span>
                  </div>
                </div>

                <h3>
                  Tell us what
                  <br />
                  you need.
                </h3>
                <p>
                  For the fastest response, send us a WhatsApp message with your service
                  requirement.
                </p>

                {/* Service Selector Chips */}
                <div className="contact-service-chips-wrap">
                  <span className="chips-label">Select your service:</span>
                  <div className="contact-service-chips">
                    {servicePresets.map((preset) => {
                      const isSelected = selectedService === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          className={`service-chip-btn ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => setSelectedService(preset.id)}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="contact-card-bottom">
                <div className="contact-card-note">
                  <div className="note-pin-circle">
                    <MapPin size={16} />
                  </div>
                  <span>
                    <strong>Serving all Coimbatore zones</strong>
                    <small>Home · Office · Business · Retail</small>
                  </span>
                </div>

                <a
                  className="button button-primary full-button contact-whatsapp-submit"
                  href={whatsappLink(whatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={18} />
                  <span>Enquire on WhatsApp</span>
                  <ArrowRight size={18} className="submit-arrow" />
                </a>

                <div className="contact-card-footer-note">
                  <Clock size={12} />
                  <span>Immediate callback & technician coordination</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section with Exact Coimbatore Address */}
      <section className="section contact-map-section">
        <div className="container">
          <div className="contact-map-header">
            <div>
              <SectionLabel>LOCATION & MAP</SectionLabel>
              <h2 className="contact-map-title">
                Find us in
                <br />
                <em>Coimbatore.</em>
              </h2>
            </div>

            <div className="contact-map-header-right">
              <div className="contact-address-badge">
                <MapPin size={18} className="map-badge-pin" />
                <div>
                  <strong>Mahi Electrical & Plumbing Works</strong>
                  <span>{address}</span>
                </div>
              </div>

              <a
                className="button button-primary map-directions-button"
                href={mapDirectionsUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span>Get Directions</span>
                <Navigation size={16} />
              </a>
            </div>
          </div>

          {/* Interactive Map Wrapper */}
          <div className="contact-map-card-wrapper">
            {/* Embedded Google Map Iframe for Sivanandha Colony Tata Bate */}
            <div className="contact-map-iframe-box">
              <iframe
                title="Mahi Electrical & Plumbing Works Location Map"
                src={mapEmbedUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="contact-map-frame"
              />
            </div>

            {/* Floating Glassmorphism Map Info Overlay */}
            <div className="contact-map-floating-overlay">
              <div className="map-overlay-header">
                <div className="map-overlay-icon">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4>Mahi Service Hub</h4>
                  <p>{address}</p>
                </div>
              </div>

              <div className="map-overlay-details">
                <div className="overlay-detail-row">
                  <Clock size={14} />
                  <span>Monday – Sunday: 8:00 AM – 9:00 PM</span>
                </div>
                <div className="overlay-detail-row">
                  <Phone size={14} />
                  <span>{phonePrimary} / {phoneSecondary}</span>
                </div>
              </div>

              <a
                href={mapDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                className="map-overlay-action-link"
              >
                <span>Open in Google Maps</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
