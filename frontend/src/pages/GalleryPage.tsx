import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronRight,
  Eye,
  FileVideo,
  Filter,
  Image as ImageIcon,
  MessageCircle,
  Phone,
  Play,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { SectionLabel } from '../components/SectionLabel';
import { phonePrimary, whatsappLink } from '../data/services';
import { fetchGalleryItems, GalleryItem, galleryCategories } from '../utils/api';
import { navigate } from '../utils/navigation';

export function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [activeType, setActiveType] = useState<'all' | 'photo' | 'video'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Lightbox Modal
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);

  useEffect(() => {
    loadGallery();
  }, [activeType, activeCategory]);

  const loadGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGalleryItems({
        type: activeType === 'all' ? undefined : activeType,
        category: activeCategory,
        search: searchQuery,
      });
      setItems(data);
    } catch (err: unknown) {
      console.error('Failed to load gallery items:', err);
      setError('Unable to load gallery media right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadGallery();
  };

  const photoCount = items.filter((i) => i.mediaType === 'photo').length;
  const videoCount = items.filter((i) => i.mediaType === 'video').length;

  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh', color: 'var(--navy-950)' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #07192d 0%, #0c2845 50%, #123c64 100%)',
          color: '#fff',
          padding: '80px 0 60px',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '3px solid var(--orange-500)',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Breadcrumb */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: '#94a3b8',
              marginBottom: 20,
              fontWeight: 600,
            }}
          >
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              style={{ color: '#cbd5e1', textDecoration: 'none' }}
            >
              Home
            </a>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--orange-500)' }}>Project Gallery</span>
          </div>

          <SectionLabel>OUR WORK IN COIMBATORE</SectionLabel>

          <h1
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '16px 0 20px',
              letterSpacing: '-0.03em',
            }}
          >
            Real Projects, <em style={{ color: 'var(--orange-500)', fontStyle: 'normal' }}>Proven Results</em>
          </h1>

          <p
            style={{
              maxWidth: 620,
              fontSize: 'clamp(15px, 2vw, 18px)',
              lineHeight: 1.7,
              color: '#cbd5e1',
              margin: '0 0 28px',
            }}
          >
            Take a look at our on-site craftsmanship across Coimbatore. Browse real photos and videos of
            our electrical wiring, plumbing installations, epoxy coatings, deep cleaning, moving, and
            digital total station surveys.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a
              className="button button-primary"
              href={whatsappLink('Hello Mahi, I saw your project gallery and would like to request a quote.')}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--orange-500)',
                color: '#fff',
                padding: '12px 22px',
                borderRadius: 6,
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(242, 154, 41, 0.4)',
              }}
            >
              <MessageCircle size={18} /> Request Free Quote
            </a>
            <a
              className="button button-quiet"
              href={`tel:${phonePrimary}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '12px 22px',
                borderRadius: 6,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <Phone size={18} /> Call {phonePrimary}
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Controls & Grid Section */}
      <section style={{ padding: '48px 0 80px' }}>
        <div className="container">
          {/* Controls Bar */}
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '20px 24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              marginBottom: 36,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {/* Top row: Type Tabs and Search */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              {/* Media Type Tabs */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveType('all')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 24,
                    border: activeType === 'all' ? '2px solid var(--orange-500)' : '1px solid #cbd5e1',
                    background: activeType === 'all' ? 'var(--orange-500)' : '#fff',
                    color: activeType === 'all' ? '#fff' : '#475569',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s',
                  }}
                >
                  <Sparkles size={15} /> All Media
                </button>

                <button
                  onClick={() => setActiveType('photo')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 24,
                    border: activeType === 'photo' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: activeType === 'photo' ? '#0284c7' : '#fff',
                    color: activeType === 'photo' ? '#fff' : '#475569',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s',
                  }}
                >
                  <ImageIcon size={15} /> Photos
                </button>

                <button
                  onClick={() => setActiveType('video')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 24,
                    border: activeType === 'video' ? '2px solid var(--orange-500)' : '1px solid #cbd5e1',
                    background: activeType === 'video' ? 'var(--orange-500)' : '#fff',
                    color: activeType === 'video' ? '#fff' : '#475569',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s',
                  }}
                >
                  <FileVideo size={15} /> Videos
                </button>
              </div>

              {/* Search bar */}
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
                <div style={{ position: 'relative' }}>
                  <Search
                    size={16}
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      padding: '8px 14px 8px 36px',
                      borderRadius: 20,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none',
                      width: 220,
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    borderRadius: 20,
                    background: 'var(--navy-950)',
                    color: '#fff',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Search
                </button>
              </form>
            </div>

            {/* Bottom row: Category Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#64748b', letterSpacing: '0.04em' }}>
                <Filter size={13} style={{ display: 'inline', marginRight: 4 }} /> CATEGORY:
              </span>
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 16,
                    border: '1px solid',
                    borderColor: activeCategory === cat ? 'var(--orange-500)' : '#e2e8f0',
                    background: activeCategory === cat ? 'var(--orange-100)' : '#f8fafc',
                    color: activeCategory === cat ? 'var(--navy-950)' : '#64748b',
                    fontSize: 12,
                    fontWeight: activeCategory === cat ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Content */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
              <RefreshCw size={36} className="spin" color="var(--orange-500)" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: 16, fontWeight: 600 }}>Loading latest project media from Coimbatore...</p>
            </div>
          ) : error ? (
            <div
              style={{
                background: '#fff2f0',
                border: '1px solid #ffccc7',
                borderRadius: 12,
                padding: '40px 20px',
                textAlign: 'center',
                color: '#cf1322',
              }}
            >
              <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px' }}>{error}</p>
              <button
                onClick={loadGallery}
                style={{
                  background: 'var(--navy-950)',
                  color: '#fff',
                  padding: '8px 18px',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Retry
              </button>
            </div>
          ) : items.length === 0 ? (
            <div
              style={{
                background: '#fff',
                border: '2px dashed #cbd5e1',
                borderRadius: 16,
                padding: '70px 20px',
                textAlign: 'center',
                color: '#64748b',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'var(--orange-100)',
                  color: 'var(--orange-500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <ImageIcon size={30} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy-950)', margin: '0 0 8px' }}>
                No Gallery Media Available Yet
              </h3>
              <p style={{ maxWidth: 460, margin: '0 auto 24px', fontSize: 15, lineHeight: 1.6 }}>
                Our team is currently uploading photos and video walkthroughs of recent electrical, plumbing,
                and epoxy works across Coimbatore. Check back shortly!
              </p>
              <a
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/services');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--navy-950)',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                }}
              >
                Explore Our Services <ArrowRight size={16} />
              </a>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 26,
              }}
            >
              {items.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelectedMedia(item)}
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.25s, box-shadow 0.25s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 16px 32px rgba(12,40,69,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.04)';
                  }}
                >
                  {/* Media Viewport */}
                  <div
                    style={{
                      height: 220,
                      background: '#07192d',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {item.mediaType === 'video' ? (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <video
                          src={item.mediaUrl}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          muted
                        />
                        {/* Play overlay button */}
                        <div
                          style={{
                            position: 'absolute',
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: 'rgba(242, 154, 41, 0.9)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                          }}
                        >
                          <Play size={22} style={{ marginLeft: 3 }} />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      />
                    )}

                    {/* Media Type Badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        background: item.mediaType === 'video' ? 'var(--orange-500)' : '#0284c7',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '3px 9px',
                        borderRadius: 4,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item.mediaType}
                    </span>

                    {/* Category Badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: 'rgba(7, 25, 45, 0.85)',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 9px',
                        borderRadius: 4,
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {item.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: 'var(--navy-950)',
                        margin: '0 0 8px',
                        lineHeight: 1.35,
                      }}
                    >
                      {item.title}
                    </h3>
                    {item.description && (
                      <p
                        style={{
                          fontSize: 13,
                          color: '#64748b',
                          lineHeight: 1.6,
                          margin: '0 0 16px',
                          flex: 1,
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                    <div
                      style={{
                        marginTop: 'auto',
                        paddingTop: 12,
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 12,
                        color: '#94a3b8',
                      }}
                    >
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span
                        style={{
                          color: 'var(--orange-500)',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Eye size={14} /> Click to view
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div
          onClick={() => setSelectedMedia(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 25, 45, 0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 900,
              width: '100%',
              background: '#fff',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 22px',
                background: 'var(--navy-950)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    background: selectedMedia.mediaType === 'video' ? 'var(--orange-500)' : '#0284c7',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 4,
                    textTransform: 'uppercase',
                    marginRight: 8,
                  }}
                >
                  {selectedMedia.mediaType}
                </span>
                <span style={{ fontSize: 13, color: '#cbd5e1' }}>{selectedMedia.category}</span>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Media Player / Image */}
            <div
              style={{
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxHeight: '60vh',
                overflow: 'hidden',
              }}
            >
              {selectedMedia.mediaType === 'video' ? (
                <video
                  src={selectedMedia.mediaUrl}
                  controls
                  autoPlay
                  style={{ maxWidth: '100%', maxHeight: '60vh' }}
                />
              ) : (
                <img
                  src={selectedMedia.mediaUrl}
                  alt={selectedMedia.title}
                  style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }}
                />
              )}
            </div>

            {/* Modal Details */}
            <div style={{ padding: '20px 24px' }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: 'var(--navy-950)',
                  margin: '0 0 8px',
                  fontFamily: 'Manrope, sans-serif',
                }}
              >
                {selectedMedia.title}
              </h2>
              {selectedMedia.description && (
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: '0 0 14px' }}>
                  {selectedMedia.description}
                </p>
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: 12,
                }}
              >
                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                  Uploaded on {new Date(selectedMedia.createdAt).toLocaleDateString()}
                </span>
                <a
                  href={whatsappLink(`Hello Mahi, I was looking at your gallery project: "${selectedMedia.title}" and would like to ask about similar service.`)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    color: 'var(--orange-500)',
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <MessageCircle size={16} /> Enquire About This Service
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
