import { ArrowLeft, ArrowRight, MessageSquare, Phone } from 'lucide-react';
import { ServiceDetailHeroInteractive } from '../components/ServiceDetailHeroInteractive';
import { ServiceOfferingsInteractive } from '../components/ServiceOfferingsInteractive';
import { phonePrimary, services, whatsappLink } from '../data/services';
import { Service } from '../types';
import { navigate } from '../utils/navigation';

interface ServiceDetailPageProps {
  service: Service;
}

export function ServiceDetailPage({ service }: ServiceDetailPageProps) {
  const currentIndex = services.findIndex((s) => s.slug === service.slug);
  const prevService = services[(currentIndex - 1 + services.length) % services.length];
  const nextService = services[(currentIndex + 1) % services.length];

  const isBlue = service.color === 'blue';
  const accentColor = isBlue ? 'var(--blue-500)' : 'var(--orange-500)';

  return (
    <main>
      {/* Interactive 3D Animated Hero Section */}
      <ServiceDetailHeroInteractive service={service} />

      {/* Interactive Animated What We Offer Section */}
      <ServiceOfferingsInteractive service={service} />

      {/* Interactive Next / Prev Service Quick Navigation Strip */}
      <section className="detail-inter-service-nav">
        <div className="container detail-nav-container">
          <button
            type="button"
            className="inter-nav-btn prev"
            onClick={() => navigate(`/${prevService.slug}`)}
          >
            <ArrowLeft size={16} />
            <div>
              <small>Previous Service</small>
              <strong>{prevService.title}</strong>
            </div>
          </button>

          <button
            type="button"
            className="inter-nav-all-btn"
            onClick={() => navigate('/services')}
          >
            View All {services.length} Services
          </button>

          <button
            type="button"
            className="inter-nav-btn next"
            onClick={() => navigate(`/${nextService.slug}`)}
          >
            <div>
              <small>Next Service</small>
              <strong>{nextService.title}</strong>
            </div>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Interactive Bottom CTA Section */}
      <section className="detail-bottom-cta-interactive">
        <div className="cta-ambient-glow" style={{ background: accentColor }} />
        <div className="container detail-bottom-cta-inner">
          <h2 className="detail-bottom-cta-title">
            Need {service.title.toLowerCase()}?
          </h2>
          <p className="detail-bottom-cta-sub">
            Let’s find the right solution for your space in Coimbatore.
          </p>

          <div className="detail-bottom-cta-actions">
            <a
              className="button button-primary cta-pulse-btn"
              href={whatsappLink(`Hello Mahi, I need an enquiry for ${service.title}.`)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageSquare size={17} />
              <span>Talk to Mahi</span>
              <ArrowRight size={17} className="cta-arrow" />
            </a>

            <a
              className="button button-outline-light cta-call-btn"
              href={`tel:${phonePrimary}`}
            >
              <Phone size={17} />
              <span>Call {phonePrimary}</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
