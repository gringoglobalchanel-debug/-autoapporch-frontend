/**
 * Página para ver todas las apps del usuario
 * RUTA: frontend/app/apps/page.jsx
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  Rocket,
  Layout,
  Layers,
  Search
} from 'lucide-react';

export default function AppsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadApps();
  }, [user, router]);

  const loadApps = async () => {
    try {
      const response = await apiClient.apps.getAll({ limit: 100 });
      if (response.data.success) {
        setApps(response.data.apps || []);
      }
    } catch (error) {
      console.error('Error loading apps:', error);
      if (error.response?.status === 401) {
        toast.error('Sesión expirada');
        logout();
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: asegurar que la URL siempre tenga https://
  const getSafeUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'generating':
      case 'updating':
        return <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ready': return 'Lista';
      case 'generating': return 'Generando...';
      case 'updating': return 'Actualizando...';
      case 'error': return 'Error';
      default: return status;
    }
  };

  const filteredApps = apps.filter(app => {
    if (filter !== 'all' && app.status !== filter) return false;
    if (search && !app.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Todas las Apps</h1>
                <p className="text-sm text-gray-500">
                  {filteredApps.length} {filteredApps.length === 1 ? 'app encontrada' : 'apps encontradas'}
                </p>
              </div>
            </div>
            <Link
              href="/create"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva App
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Todas
              </button>
              <button onClick={() => setFilter('ready')} className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filter === 'ready' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <CheckCircle className="w-4 h-4" /> Listas
              </button>
              <button onClick={() => setFilter('generating')} className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${filter === 'generating' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <Clock className="w-4 h-4" /> En Proceso
              </button>
            </div>
          </div>
        </div>

        {/* Grid de Apps */}
        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-16 text-center">
            <Layout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay apps para mostrar</h3>
            <p className="text-gray-600 mb-6">
              {search || filter !== 'all' ? 'Intenta con otros filtros de búsqueda' : 'Comienza creando tu primera app'}
            </p>
            {!search && filter === 'all' && (
              <Link href="/create" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all inline-flex items-center gap-2">
                <Plus className="w-5 h-5" /> Crear Primera App
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <div key={app.id} className="group bg-white rounded-xl shadow-lg border-2 border-gray-100 hover:border-blue-400 hover:shadow-xl transition-all">
                {/* Área clicable para ir al detalle */}
                <Link href={`/apps/${app.id}`} className="block p-6 pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                      {app.name}
                    </h3>
                    <div className="relative">
                      {getStatusIcon(app.status)}
                      {app.deployed && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{app.description}</p>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Layers className="w-4 h-4" />
                      v{app.current_version || 1}
                    </span>
                    <span className={`font-medium flex items-center gap-1 ${
                      app.status === 'ready' ? 'text-green-600' :
                      app.status === 'generating' ? 'text-yellow-600' :
                      app.status === 'error' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {getStatusIcon(app.status)}
                      {getStatusText(app.status)}
                    </span>
                  </div>

                  {app.tech_stack && (
                    <div className="flex flex-wrap gap-2">
                      {app.tech_stack.frontend && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">{app.tech_stack.frontend}</span>
                      )}
                      {app.tech_stack.backend && (
                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">{app.tech_stack.backend}</span>
                      )}
                      {app.tech_stack.database && (
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">{app.tech_stack.database}</span>
                      )}
                    </div>
                  )}
                </Link>

                {/* ✅ FIX: botón "Abrir app" separado del Link padre */}
                {app.deploy_url && (
                  <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                    <a
                      href={getSafeUrl(app.deploy_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-white bg-green-600 hover:bg-green-700 transition-colors px-3 py-2 rounded-lg font-medium w-full justify-center"
                    >
                      <Rocket className="w-4 h-4" />
                      Abrir App ↗
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}