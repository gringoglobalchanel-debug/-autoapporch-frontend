/**
 * Cliente de API con axios
 * Maneja todas las peticiones HTTP al backend
 */

import axios, { AxiosError } from 'axios';
import { supabase } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Interceptor para añadir token de autenticación
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !session) {
          await supabase.auth.signOut();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        if (error.config) {
          error.config.headers.Authorization = `Bearer ${session.access_token}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        await supabase.auth.signOut();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const apiClient = {
  // ===== APPS =====
  apps: {
    getAll: (params?: { page?: number; limit?: number; status?: string }) =>
      api.get('/api/apps', { params }),
    
    getById: (id: string) =>
      api.get(`/api/apps/${id}`),
    
    create: (data: {
      name: string;
      description: string;
      style?: string;
      colors?: any;
    }) =>
      api.post('/api/apps/create', data),
    
    improve: (id: string, description: string) =>
      api.post(`/api/apps/${id}/improve`, { description }),
    
    delete: (id: string) =>
      api.delete(`/api/apps/${id}`),
    
    getVersion: (id: string, version: number) =>
      api.get(`/api/apps/${id}/versions/${version}`),
  },

  // ===== AUTH =====
  auth: {
    register: (data: { email: string; password: string; fullName?: string }) =>
      api.post('/api/auth/register', data),
    
    login: (data: { email: string; password: string }) =>
      api.post('/api/auth/login', data),
    
    logout: () =>
      api.post('/api/auth/logout'),
    
    forgotPassword: (email: string) =>
      api.post('/api/auth/forgot-password', { email }),
    
    resetPassword: (token: string, newPassword: string) =>
      api.post('/api/auth/reset-password', { token, newPassword }),
  },

  // ===== USERS =====
  users: {
    getMe: () =>
      api.get('/api/users/me'),
    
    updateMe: (data: { fullName?: string; avatarUrl?: string }) =>
      api.put('/api/users/me', data),
    
    getStats: () =>
      api.get('/api/users/stats'),
    
    getActivity: (limit?: number) =>
      api.get('/api/users/activity', { params: { limit } }),
    
    getLimits: () =>
      api.get('/api/users/limits'),
    
    deleteAccount: (confirmation: string) =>
      api.delete('/api/users/me', { data: { confirmation } }),
  },

    // ===== STRIPE =====
  stripe: {
    getPlans: () =>
      api.get('/api/stripe/plans'),
    
    // ✅ CORREGIDO - Enviar {} en lugar de null
    createCheckout: (plan: string) =>
      api.post('/api/stripe/create-checkout', {}, {
        params: { plan }
      }),
    
    createPortal: () =>
      api.post('/api/stripe/create-portal'),
    
    getSubscription: () =>
      api.get('/api/stripe/subscription'),
  },

  // ===== DEPLOY =====
  deploy: {
    deploy: (appId: string) =>
      api.post(`/api/deploy/${appId}`),
    
    getStatus: (appId: string) =>
      api.get(`/api/deploy/${appId}/status`),
  },

  // ===== DOMAINS =====
  domains: {
    getDomains: (appId: string) =>
      api.get(`/api/domains/${appId}`),
    
    addDomain: (appId: string, domain: string) =>
      api.post(`/api/domains/${appId}`, { domain }),
    
    verifyDomain: (appId: string, domain: string) =>
      api.get(`/api/domains/${appId}/${domain}/verify`),
    
    removeDomain: (appId: string, domain: string) =>
      api.delete(`/api/domains/${appId}/${domain}`),
    
    checkLimits: () =>
      api.get('/api/domains/limits/check'),
  },
};

export default api;