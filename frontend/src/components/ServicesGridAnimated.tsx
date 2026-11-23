import { useState } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { services, whatsappLink } from '../data/services';
import { navigate } from '../utils/navigation';

export function ServicesGridAnimated() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const filterTabs = [
    { id: 'all', label: `All Services (${services.length})` },
    { id: 'electrical-works', label: 'Electrical' },
    { id: 'plumbing-works', label: 'Plumbing' },
    { id: 'epoxy-works', label: 'Epoxy' },
    { id: 'cleaning-works', label: 'Cleaning' },
    { id: 'packers-and-movers', label: 'Movers' },
    { id: 'survey-work', label: 'Survey' },
  ];

  const filteredServices =
    selectedFilter === 'all'
      ? services
      : services.filter((s) => s.slug === selectedFilter);

  return (
    <section className="section services-animated-section">
      <div className="container">
        {/* Animated Section Heading */}
        <div className="section-heading services-grid-heading">
          <div>
            <SectionLabel>EXPLORE BY CATEGORY</SectionLabel>
            <h2 className="services-grid-title">
              All specialized
              <br />
              <em className="services-grid-em">services in one place.</em>
            </h2>
          </div>
          <p className="services-grid-subtitle">
            Click any service below to see specific points, inclusions, and direct enquiry options.
          </p>
        </div>

        {/* Interactive Filter Pills */}
        <div className="services-filter-bar" role="tablist" aria-label="Filter Services">
          {filterTabs.map((tab) => {
            const isActive = tab.id === selectedFilter;
            return (
              <button
                key={tab.id}
                type="button"
                className={`services-filter-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => setSelectedFilter(tab.id)}
                role="tab"
                aria-selected={isActive}
              >
                {isActive && <Sparkles size={12} className="filter-star-icon" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Animated Services Grid */}
        <div className="services-cards-animated-grid">
          {filteredServices.map((service, idx) => {
            const isHovered = hoveredCard === service.slug;
            const ServiceIcon = service.icon;

            return (
              <div
                key={service.slug}
                className={`service-animated-card ${isHovered ? 'is-hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(service.slug)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  animationDelay: `${idx * 0.08}s`,
                }}
              >
                {/* Top Animated Accent Line */}
                <div
                  className="card-top-accent-line"
                  style={{
                    background:
                      service.color === 'blue'
                        ? 'linear-gradient(90deg, var(--blue-500), #2ba0cf)'
                        : 'linear-gradient(90deg, var(--orange-500), #e07f0b)',
                  }}
                />

                {/* Animated Image Container */}
                <div className="service-card-image-box">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="service-card-photo"
                  />
                  <div className="service-card-img-overlay" />

                  {/* Floating Floating Icon Badge */}
                  <div
                    className="service-card-floating-badge"
                    style={{
                      background:
                        service.color === 'blue' ? 'var(--blue-500)' : 'var(--orange-500)',
                    }}
                  >
                    <ServiceIcon size={16} />
                  </div>
                </div>

                {/* Card Body */}
                <div className="service-card-content-body">
                  <span className="card-eyebrow-tag">{service.eyebrow}</span>
                  <h3 className="service-card-title">{service.title}</h3>

                  {/* Action Buttons Row */}
                  <div className="service-card-actions-bar">
                    <button
                      type="button"
                      className="service-details-link"
                      onClick={() => navigate(`/${service.slug}`)}
                    >
                      <span>Full details</span>
                      <ChevronRight size={15} className="details-chevron" />
                    </button>

                    <a
                      className="button button-primary service-book-btn"
                      href={whatsappLink(
                        `Hello Mahi team, I would like to book or enquire about ${service.title}.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Book now
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
