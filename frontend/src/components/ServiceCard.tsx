import { ArrowRight } from 'lucide-react';
import { Service } from '../types';
import { navigate } from '../utils/navigation';

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export function ServiceCard({ service, className = '' }: ServiceCardProps) {
  return (
    <a
      className={`service-card ${className}`}
      href={`/${service.slug}`}
      onClick={(e) => {
        e.preventDefault();
        navigate(`/${service.slug}`);
      }}
    >
      <div className="service-image">
        <img src={service.image} alt={service.title} loading="lazy" />
      </div>
      <div className="service-card-body">
        <span className="card-eyebrow">{service.eyebrow}</span>
        <h3>{service.title}</h3>
        <span className="learn-more">
          Explore service <ArrowRight size={16} />
        </span>
      </div>
    </a>
  );
}
