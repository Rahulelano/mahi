import axios from 'axios';

// When running with Vite proxy or production, relative '/api' works.
// Also fall back to http://localhost:5000 if accessed directly on another port.
const baseURL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL,
});

// Attach Authorization Bearer token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mahi_admin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  mediaType: 'photo' | 'video';
  mediaUrl: string;
  originalName?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalItems: number;
  photosCount: number;
  videosCount: number;
  categories: { _id: string; count: number }[];
}

export const galleryCategories = [
  'All',
  'Electrical Works',
  'Plumbing Works',
  'Epoxy Works',
  'Cleaning Works',
  'Packers & Movers',
  'Survey Work',
  'General',
] as const;

// Auth APIs
export async function loginAdmin(credentials: { username: string; password: string }) {
  const response = await api.post('/api/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('mahi_admin_token', response.data.token);
    localStorage.setItem('mahi_admin_user', JSON.stringify(response.data.user));
  }
  return response.data;
}

export async function verifyAdminSession() {
  const token = localStorage.getItem('mahi_admin_token');
  if (!token) return false;
  try {
    const res = await api.get('/api/auth/verify');
    return res.data.valid === true;
  } catch {
    logoutAdmin();
    return false;
  }
}

export function logoutAdmin() {
  localStorage.removeItem('mahi_admin_token');
  localStorage.removeItem('mahi_admin_user');
}

export function getStoredAdminUser() {
  const data = localStorage.getItem('mahi_admin_user');
  return data ? JSON.parse(data) : null;
}

// Gallery APIs
export async function fetchGalleryItems(params?: {
  type?: 'photo' | 'video' | '';
  category?: string;
  search?: string;
}) {
  const response = await api.get<GalleryItem[]>('/api/gallery', { params });
  return response.data;
}

export async function fetchAdminStats() {
  const response = await api.get<AdminStats>('/api/admin/stats');
  return response.data;
}

export async function checkServerHealth() {
  const response = await api.get<{ status: string; database: string }>('/api/health');
  return response.data;
}

export async function createGalleryItem(formData: FormData) {
  const response = await api.post<GalleryItem>('/api/gallery', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function updateGalleryItem(id: string, formData: FormData) {
  const response = await api.put<GalleryItem>(`/api/gallery/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function deleteGalleryItem(id: string) {
  const response = await api.delete<{ message: string; id: string }>(`/api/gallery/${id}`);
  return response.data;
}
