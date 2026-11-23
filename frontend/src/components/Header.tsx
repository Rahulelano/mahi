import { useEffect, useState } from 'react';
import { ArrowRight, Mail, Menu, Phone } from 'lucide-react';
import { email, phonePrimary, services, whatsappLink } from '../data/services';
import { navigate } from '../utils/navigation';

interface HeaderProps {
  currentPath: string;
  onMenu: () => void;
}

export function Header({ currentPath, onMenu }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isServicesActive =
    currentPath === '/services' ||
    services.some((s) => `/${s.slug}` === currentPath);

  return (
    <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="topbar">
        <div className="container topbar-inner">
          <span className="topbar-tagline">Serving Coimbatore with care</span>
          <div className="topbar-contact">
            <a href={`tel:${phonePrimary}`} className="topbar-contact-item topbar-phone">
              <Phone size={12} /> <span>{phonePrimary}</span>
            </a>
            <span className="topbar-divider" />
            <a href={`mailto:${email}`} className="topbar-contact-item topbar-email">
              <Mail size={12} /> <span>{email}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="container nav-wrap">
        <a
          className="brand"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          aria-label="Mahi Electrical and Plumbing Works home"
        >
          <img src="/images/mahi-logo.jpg" alt="Mahi Electrical & Plumbing Works Coimbatore logo" />
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a
            className={currentPath === '/' ? 'active' : ''}
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
          >
            Home
          </a>
          <a
            className={currentPath === '/about' ? 'active' : ''}
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              navigate('/about');
            }}
          >
            About us
          </a>
          <a
            className={isServicesActive ? 'active' : ''}
            href="/services"
            onClick={(e) => {
              e.preventDefault();
              navigate('/services');
            }}
          >
            Services
          </a>
          <a
            className={currentPath === '/gallery' ? 'active' : ''}
            href="/gallery"
            onClick={(e) => {
              e.preventDefault();
              navigate('/gallery');
            }}
          >
            Gallery
          </a>
          <a
            className={currentPath === '/contact' ? 'active' : ''}
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              navigate('/contact');
            }}
          >
            Contact
          </a>
        </nav>

        <a
          className="nav-cta"
          href={whatsappLink('Hello, I would like to get a quote from Mahi Electrical & Plumbing Works.')}
          target="_blank"
          rel="noreferrer"
        >
          <span>Get a free quote</span>
          <ArrowRight size={16} />
        </a>

        <button className="menu-button" onClick={onMenu} aria-label="Open menu">
          <Menu />
        </button>
      </div>
    </header>
  );
}
