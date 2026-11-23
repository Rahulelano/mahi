import { ArrowRight, X } from 'lucide-react';
import { services, whatsappLink } from '../data/services';
import { navigate } from '../utils/navigation';

interface MobileMenuProps {
  close: () => void;
}

export function MobileMenu({ close }: MobileMenuProps) {
  const handleNav = (path: string) => {
    close();
    navigate(path);
  };

  return (
    <div className="mobile-menu">
      <button className="mobile-close" onClick={close} aria-label="Close menu">
        <X />
      </button>

      <img src="/images/mahi-logo.jpg" alt="Mahi logo" />

      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          handleNav('/');
        }}
      >
        Home
      </a>

      <a
        href="/about"
        onClick={(e) => {
          e.preventDefault();
          handleNav('/about');
        }}
      >
        About us
      </a>

      <div className="mobile-services">
        <a
          href="/services"
          style={{ fontWeight: 700 }}
          onClick={(e) => {
            e.preventDefault();
            handleNav('/services');
          }}
        >
          Services (All)
        </a>
        {services.map((service) => (
          <a
            key={service.slug}
            href={`/${service.slug}`}
            onClick={(e) => {
              e.preventDefault();
              handleNav(`/${service.slug}`);
            }}
          >
            {service.title}
          </a>
        ))}
      </div>

      <a
        href="/gallery"
        onClick={(e) => {
          e.preventDefault();
          handleNav('/gallery');
        }}
      >
        Gallery
      </a>

      <a
        href="/contact"
        onClick={(e) => {
          e.preventDefault();
          handleNav('/contact');
        }}
      >
        Contact
      </a>

      <a className="mobile-menu-cta" href={whatsappLink()} target="_blank" rel="noreferrer">
        Enquire on WhatsApp <ArrowRight size={17} />
      </a>
    </div>
  );
}
