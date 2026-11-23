import { useEffect, useState } from 'react';
import { FloatingActions } from './components/FloatingActions';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { MobileMenu } from './components/MobileMenu';
import { services } from './data/services';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { ContactPage } from './pages/ContactPage';
import { GalleryPage } from './pages/GalleryPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ServicesPage } from './pages/ServicesPage';

export function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handlePop = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  // Hidden admin panel route: /admin
  if (path === '/admin') {
    return <AdminPage />;
  }

  // Match service detail page by slug: e.g. /electrical-works, /plumbing-works
  const currentService = services.find((item) => `/${item.slug}` === path);

  const renderCurrentPage = () => {
    if (path === '/' || path === '') {
      return <HomePage />;
    }
    if (path === '/about') {
      return <AboutPage />;
    }
    if (path === '/services') {
      return <ServicesPage />;
    }
    if (path === '/gallery') {
      return <GalleryPage />;
    }
    if (path === '/contact') {
      return <ContactPage />;
    }
    if (currentService) {
      return <ServiceDetailPage service={currentService} />;
    }
    return <NotFoundPage />;
  };

  return (
    <>
      <Header currentPath={path} onMenu={() => setMenuOpen(true)} />
      {menuOpen && <MobileMenu close={() => setMenuOpen(false)} />}
      {renderCurrentPage()}
      <Footer />
      <FloatingActions />
    </>
  );
}

export default App;
