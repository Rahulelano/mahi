import { ArrowRight, Home, Wrench } from 'lucide-react';
import { SectionLabel } from '../components/SectionLabel';
import { navigate } from '../utils/navigation';

export function NotFoundPage() {
  return (
    <main>
      <section className="inner-hero" style={{ textAlign: 'center', padding: '100px 0 120px' }}>
        <div className="container inner-hero-content" style={{ margin: '0 auto', maxWidth: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <SectionLabel>PAGE NOT FOUND</SectionLabel>
          </div>
          <h1 style={{ fontSize: '56px', marginBottom: '16px' }}>
            404 — <em>Lost your way?</em>
          </h1>
          <p style={{ margin: '0 auto 32px' }}>
            The page you're looking for doesn't exist or has moved. Explore our core services or head
            back to the home page.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              className="button button-primary"
              onClick={() => navigate('/')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Home size={16} /> Back to Home
            </button>
            <button
              className="button button-dark"
              onClick={() => navigate('/services')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Wrench size={16} /> View Services <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
