/**
 * Página de Analytics de una App
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft, BarChart3, Globe, Rocket, Clock, Zap,
  TrendingUp, Eye, RefreshCw, ExternalLink, Loader2,
  CheckCircle, XCircle, Calendar, Hash, Cpu
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface AnalyticsData {
  app: {
    id: string;
    name: string;
    description: string;
    status: string;
    deploy_url: string;
    custom_domain: string;
    domain_status: string;
    created_at: string;
    current_version: number;
    deployed: boolean;
    vercel_project_name: string;
  };
  versions: {
    id: string;
    version: number;
    created_at: string;
    tokens_used: number;
    generation_time_ms: number;
    change_description: string;
  }[];
  vercel: {
    visits: number;
    pageviews: number;
    deployments: number;
    lastDeployment: string;
    bandwidth: string;
  } | null;
}

export default function AnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const loadAnalytics = async () => {
    try {
      const token = await getToken();

      // Cargar datos de la app
      const appResponse = await fetch(`${API_URL}/api/apps/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const appData = await appResponse.json();

      if (!appData.success) throw new Error('App no encontrada');

      // Intentar cargar datos de Vercel si tiene proyecto
      let vercelData = null;
      if (appData.app.vercel_project_name) {
        try {
          const vercelResponse = await fetch(
            `${API_URL}/api/apps/${params.id}/analytics`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          const vData = await vercelResponse.json();
          if (vData.success) vercelData = vData.analytics;
        } catch {
          // Vercel analytics no disponible, continuar sin ellos
        }
      }

      setData({
        app: appData.app,
        versions: appData.versions || [],
        vercel: vercelData
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (params.id) loadAnalytics();
  }, [params.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatMs = (ms: number) => {
    if (!ms) return '—';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getDaysSince = (dateString: string) => {
    const days = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'hoy';
    if (days === 1) return 'ayer';
    return `hace ${days} días`;
  };

  const totalTokens = data?.versions.reduce((sum, v) => sum + (v.tokens_used || 0), 0) || 0;
  const avgGenTime = data?.versions.length
    ? data.versions.reduce((sum, v) => sum + (v.generation_time_ms || 0), 0) / data.versions.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-600">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">App no encontrada</h2>
          <button onClick={() => router.back()} className="text-blue-600 hover:underline">Volver</button>
        </div>
      </div>
    );
  }

  const { app, versions, vercel } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics — {app.name}</h1>
                <p className="text-sm text-gray-500">Métricas y estado de tu aplicación</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
              {app.deploy_url && (
                <a
                  href={app.deploy_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir App
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">

        {/* Estado general */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Estado',
              value: app.deployed ? 'En línea' : 'Sin desplegar',
              icon: app.deployed ? CheckCircle : Clock,
              color: app.deployed ? 'text-green-600' : 'text-yellow-600',
              bg: app.deployed ? 'bg-green-50' : 'bg-yellow-50',
              iconColor: app.deployed ? 'text-green-500' : 'text-yellow-500'
            },
            {
              label: 'Versión actual',
              value: `v${app.current_version || 1}`,
              icon: Hash,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              iconColor: 'text-blue-500'
            },
            {
              label: 'Versiones creadas',
              value: versions.length.toString(),
              icon: RefreshCw,
              color: 'text-purple-600',
              bg: 'bg-purple-50',
              iconColor: 'text-purple-500'
            },
            {
              label: 'Tokens usados',
              value: totalTokens > 1000 ? `${(totalTokens / 1000).toFixed(1)}k` : totalTokens.toString(),
              icon: Zap,
              color: 'text-orange-600',
              bg: 'bg-orange-50',
              iconColor: 'text-orange-500'
            }
          ].map(({ label, value, icon: Icon, color, bg, iconColor }) => (
            <div key={label} className={`${bg} rounded-2xl p-5 flex items-center gap-4`}>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-6">

            {/* Info de despliegue */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-600" />
                Despliegue
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    URL de producción
                  </span>
                  {app.deploy_url ? (
                    <a
                      href={app.deploy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline font-mono truncate max-w-48"
                    >
                      {app.deploy_url.replace('https://', '')}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">No desplegada</span>
                  )}
                </div>

                {app.custom_domain && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-600" />
                      Dominio personalizado
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://${app.custom_domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 hover:underline font-mono"
                      >
                        {app.custom_domain}
                      </a>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        app.domain_status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {app.domain_status === 'active' ? 'Activo' : 'Configurando'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Creada
                  </span>
                  <span className="text-sm text-gray-700 font-medium">
                    {formatDate(app.created_at)} ({getDaysSince(app.created_at)})
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Tiempo promedio de generación
                  </span>
                  <span className="text-sm text-gray-700 font-medium">{formatMs(avgGenTime)}</span>
                </div>
              </div>
            </div>

            {/* Visitas — Vercel Analytics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" />
                Visitas
              </h2>
              {vercel ? (
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Visitas únicas', value: vercel.visits?.toLocaleString() || '0', icon: TrendingUp, color: 'text-indigo-600' },
                    { label: 'Pageviews', value: vercel.pageviews?.toLocaleString() || '0', icon: Eye, color: 'text-blue-600' },
                    { label: 'Bandwidth', value: vercel.bandwidth || '—', icon: Zap, color: 'text-purple-600' },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-4 text-center">
                      <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
                      <p className={`text-2xl font-bold ${color}`}>{value}</p>
                      <p className="text-xs text-gray-500 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                  <p className="font-medium text-gray-500">Analytics no disponibles</p>
                  <p className="text-sm mt-1">
                    {!app.deployed
                      ? 'Despliega tu app para ver métricas de visitas'
                      : 'Activa Vercel Analytics en tu proyecto para ver visitas en tiempo real'}
                  </p>
                  {app.deploy_url && (
                    <a
                      href={`https://vercel.com/dashboard`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:underline"
                    >
                      Ver en Vercel Dashboard
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Sidebar — historial de versiones */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                Historial de versiones
              </h3>
              {versions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Sin versiones registradas</p>
              ) : (
                <div className="space-y-3">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className={`p-3 rounded-xl border transition-all ${
                        version.version === app.current_version
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 text-sm">v{version.version}</span>
                        {version.version === app.current_version && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Actual</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{formatDate(version.created_at)}</p>
                      <div className="flex gap-3 text-xs text-gray-500">
                        {version.tokens_used > 0 && (
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {version.tokens_used.toLocaleString()} tokens
                          </span>
                        )}
                        {version.generation_time_ms > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatMs(version.generation_time_ms)}
                          </span>
                        )}
                      </div>
                      {version.change_description && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{version.change_description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}