/**
 * Página de detalles de una app específica
 * RUTA: frontend/app/apps/[id]/page.jsx
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  ArrowLeft, Sparkles, Loader2, CheckCircle, Clock, XCircle,
  RefreshCw, Rocket, Palette, Globe, Zap, Calendar, Hash, Cpu,
  BarChart3, ExternalLink, Github, Server, Database, ChevronRight,
  Copy, Share2
} from 'lucide-react';

export default function AppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [copied, setCopied] = useState(false);

  const [showDomainModal, setShowDomainModal] = useState(false);
  const [domainSuggestions, setDomainSuggestions] = useState([]);
  const [domainSearch, setDomainSearch] = useState('');
  const [searchingDomains, setSearchingDomains] = useState(false);
  const [registeringDomain, setRegisteringDomain] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  // ✅ FIX: asegurar que la URL siempre tenga https://
  const getSafeUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const getStyleColors = () => {
    if (!app?.tech_stack) return null;
    try {
      const techStack = typeof app.tech_stack === 'string'
        ? JSON.parse(app.tech_stack)
        : app.tech_stack;
      return techStack.colors;
    } catch {
      return null;
    }
  };

  const loadApp = async () => {
    try {
      const token = await getToken();

      const response = await fetch(`${API_URL}/api/apps/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        setApp(data.app);
        setVersions(data.versions || []);
      }

      const subResponse = await fetch(`${API_URL}/api/stripe/subscription`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const subData = await subResponse.json();
      if (subData.success) {
        setSubscription(subData.subscription);
      }

    } catch (error) {
      console.error('Error loading app:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) loadApp();
  }, [params.id]);

  useEffect(() => {
    if (app?.status === 'generating' && !polling) {
      setPolling(true);
      const interval = setInterval(async () => {
        try {
          const token = await getToken();
          const response = await fetch(`${API_URL}/api/apps/${params.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();

          if (data.app.status !== 'generating') {
            setApp(data.app);
            setVersions(data.versions || []);
            clearInterval(interval);
            setPolling(false);
            if (data.app.status === 'ready') toast.success('¡App lista!');
            else if (data.app.status === 'error') toast.error('Error en la generación');
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [app?.status, params.id, polling]);

  const handleDeploy = async () => {
    setDeploying(true);
    setDeploymentStatus('deploying');
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/deploy/${app?.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        setDeploymentStatus('deployed');
        toast.success('¡App desplegada exitosamente!');
        setTimeout(() => loadApp(), 2000);
      }
    } catch (error) {
      setDeploymentStatus('failed');
      if (error.status === 403) {
        toast.error('Necesitas un plan de pago para desplegar');
        router.push('/billing');
      } else {
        toast.error(error.message || 'Error al desplegar');
      }
    } finally {
      setDeploying(false);
    }
  };

  const searchDomains = async () => {
    if (!domainSearch.trim()) return;
    setSearchingDomains(true);
    setDomainSuggestions([]);
    try {
      const token = await getToken();
      const response = await fetch(
        `${API_URL}/api/domain-registrar/suggest?name=${encodeURIComponent(domainSearch)}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) setDomainSuggestions(data.suggestions || []);
    } catch (error) {
      toast.error('Error buscando dominios');
    } finally {
      setSearchingDomains(false);
    }
  };

  const registerDomain = async (domain) => {
    setRegisteringDomain(true);
    setSelectedDomain(domain);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/domain-registrar/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ appId: app?.id, domain })
      });
      const data = await response.json();

      if (data.success) {
        toast.success(`¡Dominio ${domain} registrado y activo!`);
        setShowDomainModal(false);
        setDomainSuggestions([]);
        setDomainSearch('');
        loadApp();
      } else if (data.upgradeRequired) {
        toast.error(data.message);
        router.push('/billing');
      } else {
        toast.error(data.message || 'Error registrando dominio');
      }
    } catch (error) {
      toast.error('Error registrando dominio');
    } finally {
      setRegisteringDomain(false);
      setSelectedDomain('');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('URL copiada al portapapeles');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const canAddDomain = subscription &&
    subscription.plan !== 'basico' &&
    (subscription.domainsAllowed - subscription.domainsUsed) > 0 &&
    !app?.custom_domain;

  const domainsRemaining = subscription
    ? (subscription.domainsAllowed || 0) - (subscription.domainsUsed || 0)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <Sparkles className="w-8 h-8 text-blue-600 absolute top-6 left-1/2 transform -translate-x-1/2 animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium">Cargando tu app...</p>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">App no encontrada</h2>
          <p className="text-gray-600 mb-6">La app que buscas no existe o no tienes acceso</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    generating: { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', text: 'Generando...' },
    ready: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', text: 'Lista' },
    deployed: { icon: Rocket, color: 'text-blue-600', bgColor: 'bg-blue-100', text: 'Desplegada' },
    error: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', text: 'Error' },
    updating: { icon: RefreshCw, color: 'text-purple-600', bgColor: 'bg-purple-100', text: 'Actualizando...' },
  };

  const config = statusConfig[app.status] || statusConfig.ready;
  const StatusIcon = config.icon;
  const colors = getStyleColors();
  const safeDeployUrl = getSafeUrl(app.deploy_url);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* MODAL DE DOMINIO */}
      {showDomainModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Obtener dominio gratis</h3>
                <p className="text-sm text-gray-500 mt-1">Te quedan {domainsRemaining} dominio(s) en tu plan</p>
              </div>
              <button
                onClick={() => { setShowDomainModal(false); setDomainSuggestions([]); setDomainSearch(''); }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={domainSearch}
                onChange={(e) => setDomainSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchDomains()}
                placeholder="Nombre de tu negocio..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={searchDomains}
                disabled={searchingDomains || !domainSearch.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {searchingDomains ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buscar'}
              </button>
            </div>

            {domainSuggestions.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {domainSuggestions.map((suggestion) => (
                  <div key={suggestion.domain} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <div>
                      <p className="font-medium text-gray-900">{suggestion.domain}</p>
                      {suggestion.price && (
                        <p className="text-xs text-gray-500">~${suggestion.price?.toFixed(2)}/año — incluido en tu plan</p>
                      )}
                    </div>
                    <button
                      onClick={() => registerDomain(suggestion.domain)}
                      disabled={registeringDomain}
                      className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-1"
                    >
                      {registeringDomain && selectedDomain === suggestion.domain ? (
                        <><Loader2 className="w-3 h-3 animate-spin" /> Registrando...</>
                      ) : (
                        <><CheckCircle className="w-3 h-3" /> Obtener</>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-400 mt-4 text-center">
              El dominio se registra y conecta automáticamente. Sin configuraciones.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{app.name}</h1>
                <p className="text-sm text-gray-500">Detalles y gestión de la aplicación</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}>
                <StatusIcon className="w-4 h-4" />
                {config.text}
              </span>
              {/* ✅ FIX: usar safeDeployUrl en el botón "Abrir App" */}
              {app.deployed && safeDeployUrl && (
                <a
                  href={safeDeployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir App
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">

            {/* Descripción */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Descripción
              </h2>
              <p className="text-gray-700 leading-relaxed">{app.description}</p>

              {colors && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-gray-500" />
                    Estilo visual
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {[['Primario', colors.primary], ['Secundario', colors.secondary], ['Acento', colors.accent]].map(([label, color]) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg shadow-md" style={{ backgroundColor: color }} />
                        <span className="text-xs text-gray-600">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Lista para desplegar */}
            {app.status === 'ready' && !app.deployed && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <Rocket className="w-6 h-6" />
                      ¡Lista para desplegar!
                    </h3>
                    <p className="text-blue-100 mb-4">Tu app está lista. Despliégala en un solo clic.</p>
                    <button
                      onClick={handleDeploy}
                      disabled={deploying}
                      className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {deploying ? <><Loader2 className="w-5 h-5 animate-spin" />Desplegando...</> : <><Rocket className="w-5 h-5" />Desplegar App</>}
                    </button>
                  </div>
                  <Zap className="w-16 h-16 text-white/20" />
                </div>
              </div>
            )}

            {/* ✅ FIX: App Desplegada — usar safeDeployUrl en todos los enlaces */}
            {app.deployed && safeDeployUrl && (
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6" />
                      App Desplegada
                    </h3>
                    <p className="text-green-100 mb-4">Tu aplicación está en línea y accesible públicamente</p>

                    <div className="bg-white/10 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm font-medium">URL de producción:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={safeDeployUrl}
                          readOnly
                          className="flex-1 bg-white/20 text-white px-3 py-2 rounded-lg font-mono text-sm border border-white/30 focus:outline-none"
                        />
                        <button
                          onClick={() => copyToClipboard(safeDeployUrl)}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                          {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                        <a
                          href={safeDeployUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    </div>

                    {/* Dominio personalizado activo */}
                    {app.custom_domain && app.domain_status === 'active' && (
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Globe className="w-4 h-4" />
                          <span className="text-sm font-medium">Dominio personalizado activo:</span>
                        </div>
                        <a
                          href={`https://${app.custom_domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm underline hover:text-green-200"
                        >
                          {app.custom_domain}
                        </a>
                      </div>
                    )}

                    {/* Dominio configurando */}
                    {app.custom_domain && app.domain_status === 'configuring' && (
                      <div className="bg-yellow-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 animate-pulse" />
                          <span className="text-sm font-medium">Dominio configurándose: {app.custom_domain}</span>
                        </div>
                        <p className="text-xs mt-1 text-yellow-100">Puede tardar hasta 10 minutos en activarse</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tecnologías */}
            {app.tech_stack && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-600" />
                  Tecnologías utilizadas
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Frontend', value: app.tech_stack.frontend || 'React', icon: Server, bg: 'bg-blue-100', color: 'text-blue-600', grad: 'from-blue-50 to-indigo-50' },
                    { label: 'Backend', value: app.tech_stack.backend || 'Node.js', icon: Database, bg: 'bg-green-100', color: 'text-green-600', grad: 'from-green-50 to-emerald-50' },
                    { label: 'Base de datos', value: app.tech_stack.database || 'PostgreSQL', icon: Database, bg: 'bg-purple-100', color: 'text-purple-600', grad: 'from-purple-50 to-pink-50' },
                    { label: 'Estilo', value: app.tech_stack.style || 'Moderno', icon: Palette, bg: 'bg-orange-100', color: 'text-orange-600', grad: 'from-orange-50 to-amber-50' },
                  ].map(({ label, value, icon: Icon, bg, color, grad }) => (
                    <div key={label} className={`bg-gradient-to-br ${grad} rounded-xl p-4 text-center`}>
                      <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className="font-semibold text-gray-900 capitalize">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Métricas */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Métricas
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Versión actual</span>
                  </div>
                  <span className="font-semibold text-gray-900">v{app.current_version || 1}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Creada el</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{formatDate(app.created_at)}</span>
                </div>
                {app.analytics?.visits !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Visitas</span>
                    </div>
                    <span className="font-semibold text-gray-900">{app.analytics.visits}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Versiones */}
            {versions.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                  Historial de versiones
                </h3>
                <div className="space-y-3">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className={`p-3 rounded-lg transition-all ${
                        version.version === app.current_version
                          ? 'bg-blue-50 border-2 border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900">Versión {version.version}</span>
                        {version.version === app.current_version && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Actual</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{new Date(version.created_at).toLocaleDateString()}</p>
                      {version.change_description && (
                        <p className="text-xs text-gray-600 line-clamp-2">{version.change_description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acciones Rápidas */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Acciones rápidas</h3>
              <div className="space-y-3">
                <Link
                  href={`/apps/${app.id}/improvements`}
                  className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Solicitar mejora
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`/apps/${app.id}/analytics`}
                  className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Ver analytics
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                {/* ✅ FIX: compartir con safeDeployUrl */}
                {app.deployed && safeDeployUrl && (
                  <button
                    onClick={() => copyToClipboard(safeDeployUrl)}
                    className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Compartir app
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {/* Botón de dominio */}
                {app.deployed && !app.custom_domain && (
                  canAddDomain ? (
                    <button
                      onClick={() => setShowDomainModal(true)}
                      className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 hover:from-indigo-500/50 hover:to-purple-500/50 border border-indigo-400/30 rounded-lg transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-indigo-300" />
                        <span>
                          Obtener dominio gratis
                          <span className="ml-2 text-xs bg-indigo-500 text-white px-1.5 py-0.5 rounded-full">
                            {domainsRemaining} disponible{domainsRemaining !== 1 ? 's' : ''}
                          </span>
                        </span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : subscription?.plan === 'basico' ? (
                    <Link
                      href="/billing"
                      className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg transition-colors opacity-70 hover:opacity-100"
                    >
                      <span className="flex items-center gap-2 text-gray-400">
                        <Globe className="w-4 h-4" />
                        Dominio personalizado
                        <span className="text-xs bg-gray-600 text-white px-1.5 py-0.5 rounded-full">Premium</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </Link>
                  ) : null
                )}

                {/* Dominio ya asignado */}
                {app.custom_domain && (
                  <div className="p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-300 font-medium">Dominio activo</span>
                    </div>
                    <p className="text-xs font-mono text-white mt-1">{app.custom_domain}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}