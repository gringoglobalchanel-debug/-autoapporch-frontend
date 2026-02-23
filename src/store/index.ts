/**
 * Store de Zustand para gestión de estado global
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ===== AUTH STORE =====
interface User {
  id: string;
  email: string;
  fullName?: string;
  plan?: string;
  role?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  updateUser: (userData: Partial<User>) => void;  // 👈 NUEVO
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      
      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      }),
      
      // 👇 NUEVA FUNCIÓN PARA ACTUALIZAR EL USUARIO
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      logout: () => set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// ===== UI STORE =====
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'light',
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage',
    }
  )
);

// ===== APPS STORE =====
interface App {
  id: string;
  name: string;
  description: string;
  status: string;
  current_version?: number;
  currentVersion?: number;
  created_at?: string;
  createdAt?: string;
  deployed?: boolean;
  deploy_url?: string;
  tech_stack?: any;
}

interface AppsState {
  apps: App[];
  selectedApp: App | null;
  setApps: (apps: App[]) => void;
  addApp: (app: App) => void;
  updateApp: (id: string, updates: Partial<App>) => void;
  removeApp: (id: string) => void;
  setSelectedApp: (app: App | null) => void;
}

export const useAppsStore = create<AppsState>((set) => ({
  apps: [],
  selectedApp: null,
  
  setApps: (apps) => set({ apps }),
  
  addApp: (app) => set((state) => ({
    apps: [app, ...state.apps],
  })),
  
  updateApp: (id, updates) => set((state) => ({
    apps: state.apps.map((app) =>
      app.id === id ? { ...app, ...updates } : app
    ),
  })),
  
  removeApp: (id) => set((state) => ({
    apps: state.apps.filter((app) => app.id !== id),
  })),
  
  setSelectedApp: (app) => set({ selectedApp: app }),
}));