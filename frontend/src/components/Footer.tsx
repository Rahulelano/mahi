import { ArrowUp, ChevronRight, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { address, email, phonePrimary, phoneSecondary, services, whatsappLink } from '../data/services';
import { navigate } from '../utils/navigation';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      {/* Top Animated Glow Border */}
      <div className="footer-glow-bar" />

      <div className="container footer-grid">
        {/* Brand Column */}
        <div className="footer-brand">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="footer-logo-card"
            aria-label="Mahi Electrical & Plumbing Works home"
          >
            <img src="/images/mahi-logo.jpg" alt="Mahi Electrical & Plumbing Works Coimbatore logo" />
          </a>

          <p>
            All for your smart solutions. Trusted electrical, plumbing, and home care services across
            Coimbatore with certified technicians and transparent pricing.
          </p>

          <div className="footer-status-pill">
            <span className="pulse-dot" />
            <span>Serving all areas in Coimbatore · 24/7 Dispatch</span>
          </div>

          <div className="socials">
            <a
              href="#"
              className="social-btn facebook"
              aria-label="Mahi on Facebook"
            >
              <Facebook size={16} />
            </a>
            <a
              href="#"
              className="social-btn instagram"
              aria-label="Mahi on Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href={whatsappLink('Hello Mahi Works, I am reaching out from your website.')}
              target="_blank"
              rel="noreferrer"
              className="social-btn whatsapp"
              aria-label="Chat with Mahi on WhatsApp"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        {/* Explore Links */}
        <div className="footer-col">
          <h4>Explore</h4>
          <a
            className="footer-nav-link"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
          >
            <ChevronRight size={13} className="footer-link-icon" />
            <span>Home</span>
          </a>
          <a
            className="footer-nav-link"
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              navigate('/about');
            }}
          >
            <ChevronRight size={13} className="footer-link-icon" />
            <span>About us</span>
          </a>
          <a
            className="footer-nav-link"
            href="/services"
            onClick={(e) => {
              e.preventDefault();
              navigate('/services');
            }}
          >
            <ChevronRight size={13} className="footer-link-icon" />
            <span>Our services</span>
          </a>
          <a
            className="footer-nav-link"
            href="/gallery"
            onClick={(e) => {
              e.preventDefault();
              navigate('/gallery');
            }}
          >
            <ChevronRight size={13} className="footer-link-icon" />
            <span>Gallery</span>
          </a>
          <a
            className="footer-nav-link"
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              navigate('/contact');
            }}
          >
            <ChevronRight size={13} className="footer-link-icon" />
            <span>Contact</span>
          </a>
        </div>

        {/* Services Links */}
        <div className="footer-col">
          <h4>Our Services</h4>
          {services.map((service) => (
            <a
              key={service.slug}
              className="footer-nav-link"
              href={`/${service.slug}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${service.slug}`);
              }}
            >
              <ChevronRight size={13} className="footer-link-icon" />
              <span>{service.title}</span>
            </a>
          ))}
        </div>

        {/* Contact Info Column */}
        <div className="footer-col footer-contact-col">
          <h4>Get In Touch</h4>
          <a className="footer-contact-item" href={`tel:${phonePrimary}`}>
            <span className="contact-icon-circle">
              <Phone size={14} />
            </span>
            <div>
              <small>Primary Helpline</small>
              <strong>{phonePrimary}</strong>
            </div>
          </a>

          <a className="footer-contact-item" href={`tel:${phoneSecondary}`}>
            <span className="contact-icon-circle">
              <Phone size={14} />
            </span>
            <div>
              <small>Alternative Contact</small>
              <strong>{phoneSecondary}</strong>
            </div>
          </a>

          <a className="footer-contact-item" href={`mailto:${email}`}>
            <span className="contact-icon-circle">
              <Mail size={14} />
            </span>
            <div>
              <small>Email Inquiries</small>
              <strong>{email}</strong>
            </div>
          </a>

          <div className="footer-contact-item location-item">
            <span className="contact-icon-circle">
              <MapPin size={14} />
            </span>
            <div>
              <small>Location</small>
              <strong>{address}</strong>
            </div>
          </div>

          <a
            className="footer-wa-pill"
            href={whatsappLink('Hello Mahi Electrical & Plumbing Works, I would like to book a service.')}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={15} />
            <span>Quick WhatsApp Chat</span>
          </a>
        </div>
      </div>

      {/* Footer Bottom Bar with Scroll-to-Top */}
      <div className="container footer-bottom">
        <div className="footer-bottom-left">
          <span>© {new Date().getFullYear()} Mahi Electrical & Plumbing Works · All rights reserved</span>
          <span className="footer-tagline">Professional service. Personal care.</span>
        </div>

        <button
          type="button"
          className="footer-scroll-top-btn"
          onClick={scrollToTop}
          aria-label="Back to top of page"
        >
          <span>Back to top</span>
          <ArrowUp size={15} />
        </button>
      </div>
    </footer>
  );
}
