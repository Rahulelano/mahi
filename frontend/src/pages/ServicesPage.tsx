import { ArrowRight, Phone } from 'lucide-react';
import { MahiAdvantageClipped } from '../components/MahiAdvantageClipped';
import { SectionLabel } from '../components/SectionLabel';
import { ServicesGridAnimated } from '../components/ServicesGridAnimated';
import { ServicesHeroInteractive } from '../components/ServicesHeroInteractive';
import { ServicesProcessAnimated } from '../components/ServicesProcessAnimated';
import { phonePrimary, whatsappLink } from '../data/services';

export function ServicesPage() {
  return (
    <main>
      {/* Interactive & Animated Services Hero (No added paras) */}
      <ServicesHeroInteractive />

      {/* Animated Services Category Grid Showcase (Exact Same Content) */}
      <ServicesGridAnimated />

      {/* Why Choose Mahi Services (Clipped Animations, Same Content) */}
      <MahiAdvantageClipped />

      {/* Simple Process (Animated Stepper Flow, Same Content) */}
      <ServicesProcessAnimated />

      {/* Contact Strip CTA */}
      <section className="contact-strip">
        <div className="container contact-strip-inner">
          <div>
            <SectionLabel>CUSTOM REQUIREMENTS?</SectionLabel>
            <h2>
              Need something specific
              <br />
              <em>or custom work?</em>
            </h2>
          </div>
          <div className="contact-strip-actions">
            <p>Talk to our service coordinator in Coimbatore today.</p>
            <a className="button button-light" href={`tel:${phonePrimary}`}>
              <Phone size={16} /> Call {phonePrimary}
            </a>
            <a
              className="button button-outline-light"
              href={whatsappLink('Hello Mahi Works, I have a custom service enquiry.')}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Us <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
