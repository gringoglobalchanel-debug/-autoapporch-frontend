'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Plus, Sparkles, Clock, CheckCircle, XCircle, LogOut, Settings,
  CreditCard, Loader2, ChevronDown, Rocket, Globe, Layout, Zap,
  BarChart3, ChevronRight, ExternalLink, Layers, AlertTriangle
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuthStore();
  const [apps, setApps] = useState<any[]>([]);
  const [deployedApps, setDeployedApps] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showAppSelector, setShowAppSelector] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'loading' | 'active' | 'no_card' | null>('loading');
  const [trialDaysRemaining, setTrialDaysRemaining] = useState<number>(0);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadDashboard();
  }, [user, router]);

  const loadDashboard = async () => {
    try {
      const [appsResponse, statsResponse] = await Promise.all([
        apiClient.apps.getAll({ limit: 100 }),
        apiClient.users.getStats(),
      ]);

      if (appsResponse.data.success) {
        const allApps = appsResponse.data.apps || [];
        setApps(allApps);
        const deployed = allApps.filter((app: any) => app.deployed === true && app.deploy_url);
        setDeployedApps(deployed);
        if (deployed.length > 0) setSelectedApp(deployed[0]);
      }

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      // Actualizar plan en store
      try {
        const limitsResponse = await apiClient.users.getLimits();
        if (limitsResponse.data.success) {
          const newPlan = limitsResponse.data.plan;
          if (newPlan !== user?.plan) updateUser({ plan: newPlan });
        }
      } catch (error) {
        console.error('Error loading user limits:', error);
      }

      // ✅ Verificar si tiene tarjeta registrada (stripe_subscription_id)
      try {
        const subResponse = await apiClient.stripe.getSubscription();
        const sub = subResponse.data.subscription;

        if (!sub || !sub.stripe_subscription_id) {
          setSubscriptionStatus('no_card');
        } else {
          setSubscriptionStatus('active');

          // Calcular días de trial restantes
          if (sub.status === 'trial' && sub.trial_ends_at) {
            const now = new Date();
            const trialEnds = new Date(sub.trial_ends_at);
            const days = Math.max(0, Math.ceil((trialEnds.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
            setTrialDaysRemaining(days);
          }
        }
      } catch {
        setSubscriptionStatus('no_card');
      }

    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      if (error.response?.status === 401) {
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        logout();
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Sesión cerrada correctamente');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'generating':
      case 'updating': return <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPlanGradient = () => {
    switch (user?.plan) {
      case 'pro': return 'from-purple-600 to-indigo-600';
      case 'premium': return 'from-blue-600 to-cyan-600';
      case 'basico': return 'from-teal-600 to-green-600';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  const getPlanName = () => {
    switch (user?.plan) {
      case 'pro': return 'Pro';
      case 'premium': return 'Premium';
      case 'basico': return 'Básico';
      case 'free_trial': return 'Prueba Gratuita';
      default: return 'Free';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <Sparkles className="w-8 h-8 text-blue-600 absolute top-6 left-1/2 transform -translate-x-1/2 animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* ✅ Banner de plan requerido — aparece si no tiene tarjeta registrada */}
      {subscriptionStatus === 'no_card' && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">Elige un plan para comenzar a crear apps</p>
                <p className="text-sm text-orange-100">7 días gratis en cualquier plan. No se cobra nada hasta el día 8.</p>
              </div>
            </div>
            <Link
              href="/billing?required=true"
              className="bg-white text-orange-600 px-5 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Elegir plan →
            </Link>
          </div>
        </div>
      )}

      {/* Banner de días de trial restantes */}
      {subscriptionStatus === 'active' && trialDaysRemaining > 0 && (
        <div className="bg-blue-600 text-white">
          <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">
                Te quedan <strong>{trialDaysRemaining} día{trialDaysRemaining !== 1 ? 's' : ''}</strong> de prueba gratuita. Después se cobrará automáticamente.
              </p>
            </div>
            <Link href="/billing" className="text-sm bg-white/20 hover:bg-white/30 px-4 py-1 rounded-full transition-colors whitespace-nowrap">
              Ver mi plan
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`bg-gradient-to-r ${getPlanGradient()} text-white shadow-lg`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-lg blur opacity-40 group-hover:opacity-60 transition"></div>
                <Sparkles className="w-10 h-10 text-white relative z-10" />
              </div>
              <span className="text-2xl font-bold tracking-tight">AutoAppOrchestrator</span>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-sm font-medium uppercase tracking-wider">{getPlanName()} Plan</span>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold shadow-lg">
                    {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                </button>

                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-4 border-b">
                    <p className="font-semibold text-gray-900">{user?.fullName || 'Usuario'}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    <div className="mt-2 inline-flex px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {getPlanName()} Plan
                    </div>
                  </div>
                  <div className="p-2">
                    <Link href="/settings" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700">
                      <Settings className="w-4 h-4 mr-3" />
                      Configuración
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2 flex-wrap">
                <span>¡Bienvenido de nuevo,</span>
                <span className="bg-white/20 px-4 py-1 rounded-full">
                  {user?.fullName?.split(' ')[0] || 'Usuario'}
                </span>
                <span>! 👋</span>
              </h1>
              <p className="text-blue-100 text-lg">
                Gestiona tus aplicaciones generadas con IA y monitorea su rendimiento
              </p>
            </div>
            <div className="hidden md:block">
              <Zap className="w-16 h-16 text-white/30" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Total Apps</p>
                <Layout className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalApps || 0}</p>
              <p className="text-xs text-gray-500 mt-2">+{stats.appsPerMonth?.[0]?.count || 0} este mes</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Listas</p>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.appsByStatus?.ready || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Apps listas para desplegar</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-600 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">En Proceso</p>
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.appsByStatus?.generating || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Generándose ahora</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600 transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Versiones</p>
                <Layers className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats.totalVersions || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Iteraciones totales</p>
            </div>
          </div>
        )}

        {/* Selector de Apps Desplegadas */}
        {deployedApps.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Tus Apps Desplegadas</h2>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium ml-2">
                  {deployedApps.length} activas
                </span>
              </div>
            </div>

            <div className="relative mb-4">
              <button
                onClick={() => setShowAppSelector(!showAppSelector)}
                className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl flex items-center justify-between hover:border-blue-400 transition-all group"
              >
                {selectedApp ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{selectedApp.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-md">{selectedApp.deploy_url}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Selecciona una app desplegada</p>
                )}
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showAppSelector ? 'rotate-180' : ''}`} />
              </button>

              {showAppSelector && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                  {deployedApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => { setSelectedApp(app); setShowAppSelector(false); }}
                      className={`w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b last:border-b-0 ${selectedApp?.id === app.id ? 'bg-blue-50' : ''}`}
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Globe className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-gray-900">{app.name}</p>
                        <p className="text-xs text-gray-500 truncate">{app.deploy_url}</p>
                      </div>
                      {selectedApp?.id === app.id && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedApp && (
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-green-400" />
                    <div>
                      <h3 className="font-bold text-lg">{selectedApp.name}</h3>
                      <p className="text-sm text-gray-400">App en producción</p>
                    </div>
                  </div>
                  <a
                    href={selectedApp.deploy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Abrir App
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Tecnologías</p>
                    <p className="font-medium text-sm">
                      {selectedApp.tech_stack?.frontend || 'React'} • {selectedApp.tech_stack?.backend || 'Node.js'}
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Última versión</p>
                    <p className="font-medium text-sm">v{selectedApp.current_version || 1}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Rocket className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes apps desplegadas</h3>
            <p className="text-gray-600 mb-4">Las apps que despliegues aparecerán aquí para acceso rápido</p>
            <Link href="/create" className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
              <Plus className="w-4 h-4" />
              Crear una app
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Link
            href={subscriptionStatus === 'no_card' ? '/billing?required=true' : '/create'}
            className="group bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-xl mb-2">Crear Nueva App</h3>
            <p className="text-blue-100 text-sm">
              {subscriptionStatus === 'no_card'
                ? 'Elige un plan primero para empezar a crear apps.'
                : 'Genera apps con IA en segundos. Solo describe lo que necesitas.'}
            </p>
            <div className="mt-4 inline-flex items-center text-sm bg-white/20 px-3 py-1 rounded-full">
              {subscriptionStatus === 'no_card'
                ? <><AlertTriangle className="w-3 h-3 mr-1" /> Requiere plan</>
                : <><Zap className="w-3 h-3 mr-1" /> Tiempo estimado: 30-60s</>}
            </div>
          </Link>

          <Link
            href="/apps"
            className="group bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <Layout className="w-8 h-8 group-hover:rotate-12 transition-transform" />
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-xl mb-2">Ver Todas las Apps</h3>
            <p className="text-purple-100 text-sm">Gestiona y monitorea todas tus aplicaciones generadas.</p>
            <div className="mt-4 inline-flex items-center text-sm bg-white/20 px-3 py-1 rounded-full">
              <BarChart3 className="w-3 h-3 mr-1" />
              {apps.length} apps creadas
            </div>
          </Link>

          <Link
            href="/billing"
            className="group bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-8 h-8 group-hover:rotate-12 transition-transform" />
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-xl mb-2">
              {subscriptionStatus === 'no_card' ? 'Elegir Plan' : 'Mejorar Plan'}
            </h3>
            <p className="text-green-100 text-sm">
              {subscriptionStatus === 'no_card'
                ? '7 días gratis. Elige tu plan y empieza a crear.'
                : 'Desbloquea más apps, deploys y características premium.'}
            </p>
            <div className="mt-4 inline-flex items-center text-sm bg-white/20 px-3 py-1 rounded-full">
              <Rocket className="w-3 h-3 mr-1" />
              Plan actual: {getPlanName()}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}