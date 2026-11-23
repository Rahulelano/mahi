import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Database,
  Edit2,
  Eye,
  FileVideo,
  Filter,
  Image as ImageIcon,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';
import {
  AdminStats,
  checkServerHealth,
  createGalleryItem,
  deleteGalleryItem,
  fetchAdminStats,
  fetchGalleryItems,
  GalleryItem,
  galleryCategories,
  getStoredAdminUser,
  loginAdmin,
  logoutAdmin,
  updateGalleryItem,
  verifyAdminSession,
} from '../utils/api';
import { navigate } from '../utils/navigation';

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<string>('checking');
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'video'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notifications
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('General');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit modal state
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Delete modal state
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Show Toast
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Check auth session on load
  useEffect(() => {
    let mounted = true;
    async function init() {
      const isValid = await verifyAdminSession();
      if (mounted) {
        setIsAuthenticated(isValid);
        setIsCheckingAuth(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch gallery and server status when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, filterType, filterCategory]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Health & DB
      checkServerHealth()
        .then((h) => setDbStatus(h.database))
        .catch(() => setDbStatus('disconnected'));

      // 2. Stats
      fetchAdminStats()
        .then((s) => setStats(s))
        .catch((err) => console.error(err));

      // 3. Items
      const data = await fetchGalleryItems({
        type: filterType === 'all' ? undefined : filterType,
        category: filterCategory,
        search: searchQuery,
      });
      setItems(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load gallery items';
      showToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadDashboardData();
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      await loginAdmin({ username, password });
      setIsAuthenticated(true);
      showToast('success', 'Logged into Mahi Admin Panel successfully');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
            'Invalid credentials'
          : 'Failed to connect to backend server';
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    showToast('success', 'Logged out successfully');
  };

  // Handle File selection in Upload Modal
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const url = URL.createObjectURL(file);
      setUploadPreview(url);
      if (!uploadTitle) {
        // Auto-fill title from clean filename
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setUploadTitle(cleanName);
      }
    }
  };

  // Handle File selection in Edit Modal
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFile(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  // Handle Upload Submit
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      showToast('error', 'Please choose a photo or video file from your device');
      return;
    }
    if (!uploadTitle.trim()) {
      showToast('error', 'Please provide a title for this gallery item');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('title', uploadTitle.trim());
      formData.append('category', uploadCategory);
      formData.append('description', uploadDescription.trim());

      await createGalleryItem(formData);
      showToast('success', 'Media uploaded to gallery successfully!');

      // Reset form
      setIsUploadOpen(false);
      setUploadFile(null);
      setUploadPreview(null);
      setUploadTitle('');
      setUploadCategory('General');
      setUploadDescription('');

      // Reload
      loadDashboardData();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
            'Upload failed'
          : 'Could not upload file to server';
      showToast('error', message);
    } finally {
      setUploading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditDescription(item.description || '');
    setEditFile(null);
    setEditPreview(null);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSavingEdit(true);
    try {
      const formData = new FormData();
      formData.append('title', editTitle.trim());
      formData.append('category', editCategory);
      formData.append('description', editDescription.trim());
      if (editFile) {
        formData.append('file', editFile);
      }

      await updateGalleryItem(editingItem._id, formData);
      showToast('success', 'Gallery item updated successfully!');
      setEditingItem(null);
      loadDashboardData();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
            'Update failed'
          : 'Could not update item';
      showToast('error', message);
    } finally {
      setSavingEdit(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await deleteGalleryItem(deletingItem._id);
      showToast('success', `Deleted "${deletingItem.title}" successfully`);
      setDeletingItem(null);
      loadDashboardData();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
            'Delete failed'
          : 'Could not delete item';
      showToast('error', message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper to format file size
  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // If checking authentication
  if (isCheckingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07192d' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <RefreshCw className="spin" size={36} color="var(--orange-500)" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontSize: 16, color: '#a0aec0' }}>Verifying Mahi Admin credentials...</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 1. LOGIN SCREEN (When unauthenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(circle at 50% 20%, #0c2845 0%, #07192d 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
        }}
      >
        <div
          style={{
            maxWidth: 440,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            borderRadius: 14,
            padding: '40px 32px',
            boxShadow: '0 24px 50px rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              color: '#647588',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 20,
              padding: 0,
            }}
          >
            <ArrowLeft size={16} /> Return to Website
          </button>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--orange-500) 0%, #ff8800 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 20px rgba(242, 154, 41, 0.35)',
              }}
            >
              <Lock size={26} />
            </div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: 'var(--navy-950)',
                margin: '0 0 6px',
                fontFamily: 'Manrope, sans-serif',
              }}
            >
              Mahi Admin Portal
            </h1>
            <p style={{ fontSize: 14, color: '#647588', margin: 0 }}>
              Authorized management console for gallery photos & videos
            </p>
          </div>

          {loginError && (
            <div
              style={{
                background: '#fff2f0',
                border: '1px solid #ffccc7',
                color: '#cf1322',
                padding: '12px 14px',
                borderRadius: 8,
                fontSize: 13,
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--navy-900)',
                  marginBottom: 6,
                }}
              >
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={18}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  type="text"
                  required
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 8,
                    border: '1.5px solid #dce6ed',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--navy-900)',
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  type="password"
                  required
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 8,
                    border: '1.5px solid #dce6ed',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 8,
                background: 'var(--orange-500)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                border: 'none',
                cursor: loginLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(242, 154, 41, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {loginLoading ? (
                <>
                  <RefreshCw size={18} className="spin" /> Verifying...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <div
            style={{
              marginTop: 24,
              paddingTop: 18,
              borderTop: '1px solid #f0f4f8',
              textAlign: 'center',
              fontSize: 12,
              color: '#8c9ba5',
            }}
          >
            Secured by MongoDB Atlas &amp; JWT · Port 5000
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. AUTHENTICATED DASHBOARD
  // -------------------------------------------------------------
  return (
    <div style={{ minHeight: '100vh', background: '#f5f8fa', color: '#10263d', fontFamily: 'Inter, sans-serif' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: toast.type === 'success' ? '#0f766e' : '#b91c1c',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 14,
            fontWeight: 600,
            animation: 'slideUp 0.3s ease',
          }}
        >
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header
        style={{
          background: 'var(--navy-950)',
          color: '#fff',
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid var(--orange-500)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <img
              src="/images/mahi-logo.jpg"
              alt="Mahi Logo"
              style={{ height: 36, borderRadius: 4, background: '#fff', padding: 2 }}
            />
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>
                MAHI ADMIN DASHBOARD
              </div>
              <div style={{ fontSize: 11, color: 'var(--orange-500)', fontWeight: 700 }}>
                GALLERY CRUD &amp; MEDIA MANAGER
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,0.08)',
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 12,
              marginLeft: 12,
            }}
          >
            <Database size={13} color={dbStatus === 'connected' ? '#10b981' : '#f59e0b'} />
            <span style={{ color: dbStatus === 'connected' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
              MongoDB: {dbStatus}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Eye size={15} /> View Site
          </button>

          <button
            onClick={handleLogout}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <LogOut size={15} /> Logout ({getStoredAdminUser()?.username || 'Admin'})
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 20px 60px' }}>
        {/* KPI Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 18,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700, marginBottom: 6 }}>
              TOTAL GALLERY MEDIA
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--navy-950)' }}>
              {stats?.totalItems ?? items.length}
            </div>
            <div style={{ fontSize: 12, color: '#10b981', marginTop: 4, fontWeight: 600 }}>
              Stored in MongoDB Atlas
            </div>
          </div>

          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 13,
                color: '#64748b',
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              <span>PHOTOS</span>
              <ImageIcon size={18} color="#0284c7" />
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#0284c7' }}>
              {stats?.photosCount ?? items.filter((i) => i.mediaType === 'photo').length}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
              Images stored in server uploads
            </div>
          </div>

          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 13,
                color: '#64748b',
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              <span>VIDEOS</span>
              <FileVideo size={18} color="var(--orange-500)" />
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--orange-500)' }}>
              {stats?.videosCount ?? items.filter((i) => i.mediaType === 'video').length}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
              Uploaded video files
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, var(--navy-950) 0%, #123c64 100%)',
              padding: '20px',
              borderRadius: 10,
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: 13, color: 'var(--orange-500)', fontWeight: 700, marginBottom: 8 }}>
              DIRECT FILE MANAGER UPLOAD
            </div>
            <button
              onClick={() => setIsUploadOpen(true)}
              style={{
                background: 'var(--orange-500)',
                color: '#fff',
                border: 'none',
                padding: '12px 18px',
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(242, 154, 41, 0.4)',
              }}
            >
              <Plus size={18} /> Add Photos / Videos
            </button>
          </div>
        </div>

        {/* Filter and Control Bar */}
        <div
          style={{
            background: '#fff',
            padding: '16px 20px',
            borderRadius: 10,
            border: '1px solid #e2e8f0',
            marginBottom: 24,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
          }}
        >
          {/* Type Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginRight: 4 }}>
              <Filter size={14} style={{ display: 'inline', marginRight: 4 }} /> TYPE:
            </span>
            {(['all', 'photo', 'video'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: filterType === t ? '1.5px solid var(--orange-500)' : '1px solid #cbd5e1',
                  background: filterType === t ? 'var(--orange-500)' : '#fff',
                  color: filterType === t ? '#fff' : '#475569',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {t === 'all' ? 'All Media' : `${t}s`}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>CATEGORY:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                fontWeight: 600,
                outline: 'none',
                background: '#fff',
                color: '#1e293b',
              }}
            >
              {galleryCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                placeholder="Search title or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '7px 12px 7px 34px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                  width: 220,
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '7px 14px',
                background: 'var(--navy-900)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={loadDashboardData}
              title="Refresh gallery"
              style={{
                padding: '7px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} color="#475569" />
            </button>
          </form>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <RefreshCw size={32} className="spin" color="var(--orange-500)" style={{ margin: '0 auto 12px' }} />
            <p>Loading media from MongoDB...</p>
          </div>
        ) : items.length === 0 ? (
          <div
            style={{
              background: '#fff',
              border: '2px dashed #cbd5e1',
              borderRadius: 12,
              padding: '60px 20px',
              textAlign: 'center',
              color: '#64748b',
            }}
          >
            <Upload size={44} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy-950)', margin: '0 0 8px' }}>
              No media found
            </h3>
            <p style={{ maxWidth: 420, margin: '0 auto 20px', fontSize: 14 }}>
              Your gallery is currently empty or no items match your active filters. Click below to add
              photos or videos directly from your file manager.
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              style={{
                background: 'var(--orange-500)',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Plus size={18} /> Add Photos / Videos Now
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: 22,
            }}
          >
            {items.map((item) => (
              <div
                key={item._id}
                style={{
                  background: '#fff',
                  borderRadius: 10,
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                {/* Media Container */}
                <div
                  style={{
                    height: 200,
                    background: '#07192d',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {item.mediaType === 'video' ? (
                    <video
                      src={item.mediaUrl}
                      controls
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}

                  {/* Type Badge */}
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: item.mediaType === 'video' ? 'var(--orange-500)' : '#0284c7',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      padding: '3px 8px',
                      borderRadius: 4,
                      textTransform: 'uppercase',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    }}
                  >
                    {item.mediaType}
                  </span>

                  {/* Category Badge */}
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 4,
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Card Content */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--navy-950)',
                      margin: '0 0 6px',
                    }}
                  >
                    {item.title}
                  </h4>
                  {item.description && (
                    <p
                      style={{
                        fontSize: 13,
                        color: '#64748b',
                        margin: '0 0 12px',
                        lineHeight: 1.5,
                        flex: 1,
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                  <div
                    style={{
                      fontSize: 11,
                      color: '#94a3b8',
                      marginBottom: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    <span>{formatSize(item.fileSize)}</span>
                  </div>

                  {/* Actions (CRUD: Edit, Delete, View) */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: 12,
                      marginTop: 'auto',
                    }}
                  >
                    <a
                      href={item.mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#0284c7',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Eye size={14} /> Full View
                    </a>

                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => openEditModal(item)}
                        title="Edit Item"
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          padding: '6px 10px',
                          borderRadius: 6,
                          color: '#334155',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>

                      <button
                        onClick={() => setDeletingItem(item)}
                        title="Delete Item"
                        style={{
                          background: '#fee2e2',
                          border: '1px solid #fca5a5',
                          padding: '6px 10px',
                          borderRadius: 6,
                          color: '#b91c1c',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. UPLOAD MODAL (Direct file manager upload)                   */}
      {/* ------------------------------------------------------------- */}
      {isUploadOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 25, 45, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              maxWidth: 540,
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy-950)', margin: 0 }}>
                Upload Media to Gallery
              </h3>
              <button
                onClick={() => {
                  setIsUploadOpen(false);
                  setUploadFile(null);
                  setUploadPreview(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              {/* Drag & Drop File Picker */}
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--orange-500)',
                  borderRadius: 10,
                  padding: uploadPreview ? '12px' : '36px 16px',
                  textAlign: 'center',
                  background: 'var(--orange-100)',
                  cursor: 'pointer',
                  marginBottom: 18,
                  position: 'relative',
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                {uploadPreview ? (
                  <div>
                    {uploadFile?.type.startsWith('video/') ? (
                      <video
                        src={uploadPreview}
                        controls
                        style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 6 }}
                      />
                    ) : (
                      <img
                        src={uploadPreview}
                        alt="Preview"
                        style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain', borderRadius: 6 }}
                      />
                    )}
                    <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: 'var(--navy-950)' }}>
                      Selected: {uploadFile?.name} ({formatSize(uploadFile?.size)})
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Click to choose a different file</div>
                  </div>
                ) : (
                  <div>
                    <Upload size={36} color="var(--orange-500)" style={{ margin: '0 auto 10px' }} />
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-950)', marginBottom: 4 }}>
                      Choose Photo or Video From File Manager
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      Supports JPG, PNG, WEBP, MP4, WEBM, MOV (Direct disk upload, no URLs required)
                    </div>
                  </div>
                )}
              </div>

              {/* Title input */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5 }}>
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical Panel Installation in Peelamedu"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Category input */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5 }}>
                  Service Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    boxSizing: 'border-box',
                    background: '#fff',
                  }}
                >
                  {galleryCategories
                    .filter((c) => c !== 'All')
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>

              {/* Description input */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5 }}>
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Details about the work performed, materials used, or client location..."
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    color: '#475569',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    padding: '10px 22px',
                    borderRadius: 6,
                    background: 'var(--orange-500)',
                    color: '#fff',
                    border: 'none',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {uploading ? (
                    <>
                      <RefreshCw size={16} className="spin" /> Uploading to Server...
                    </>
                  ) : (
                    'Upload & Save'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. EDIT MODAL (Update metadata or replace file)                */}
      {/* ------------------------------------------------------------- */}
      {editingItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 25, 45, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              maxWidth: 520,
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--navy-950)', margin: 0 }}>
                Edit Gallery Item
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              {/* Current preview or replacement preview */}
              <div
                style={{
                  height: 160,
                  background: '#07192d',
                  borderRadius: 8,
                  overflow: 'hidden',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {editPreview ? (
                  editFile?.type.startsWith('video/') ? (
                    <video src={editPreview} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <img src={editPreview} alt="New" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  )
                ) : editingItem.mediaType === 'video' ? (
                  <video src={editingItem.mediaUrl} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <img src={editingItem.mediaUrl} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                )}
              </div>

              <div style={{ marginBottom: 14 }}>
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleEditFileChange}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => editFileInputRef.current?.click()}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#334155',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Upload size={14} /> Replace File From Device (Optional)
                </button>
                {editFile && (
                  <div style={{ fontSize: 11, color: '#10b981', marginTop: 4, fontWeight: 600 }}>
                    Selected replacement: {editFile.name}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5 }}>
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5 }}>
                  Category
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    boxSizing: 'border-box',
                    background: '#fff',
                  }}
                >
                  {galleryCategories
                    .filter((c) => c !== 'All')
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 5 }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    color: '#475569',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  style={{
                    padding: '10px 22px',
                    borderRadius: 6,
                    background: 'var(--orange-500)',
                    color: '#fff',
                    border: 'none',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: savingEdit ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {savingEdit ? <RefreshCw size={16} className="spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. DELETE CONFIRMATION MODAL                                  */}
      {/* ------------------------------------------------------------- */}
      {deletingItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 25, 45, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              maxWidth: 440,
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#fee2e2',
                color: '#b91c1c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Trash2 size={24} />
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--navy-950)', margin: '0 0 8px' }}>
              Confirm Delete
            </h3>
            <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>&quot;{deletingItem.title}&quot;</strong>? This will permanently
              delete this media file from both the server storage and MongoDB database.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  background: '#fff',
                  color: '#475569',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                style={{
                  padding: '9px 20px',
                  borderRadius: 6,
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {isDeleting ? <RefreshCw size={16} className="spin" /> : 'Delete Media'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
