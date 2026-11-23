import { Phone } from 'lucide-react';
import { phonePrimary, whatsappLink } from '../data/services';

export function FloatingActions() {
  return (
    <div className="floating-actions">
      <a className="float-call" href={`tel:${phonePrimary}`} aria-label="Call Mahi">
        <Phone size={20} />
        <span>Call now</span>
      </a>
      <a
        className="float-whatsapp"
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp Mahi"
      >
        <span className="whatsapp-mark">W</span>
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
