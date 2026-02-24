/**
 * Página de configuración del usuario
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { apiClient } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  ArrowLeft, User, Mail, CreditCard, Bell, Shield, Palette, Globe,
  Save, Loader2, AlertCircle, Sparkles, Rocket, Zap, Clock,
  Download, Trash2, LogOut, Camera, ChevronRight, Crown, Gem, Award, Star
} from 'lucide-react';

interface Subscription {
  plan: string;
  status: string;
  trial_ends_at?: string;
  current_period_end?: string;
}

interface Limits {
  appsPerMonth: number;
  maxVersionsPerApp: number;
  apiCallsPerHour: number;
  features: string[];
}

interface Usage {
  appsThisMonth: number;
  tokensUsed?: number;
}

interface Notifications {
  email: boolean;
  push: boolean;
  marketing: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [limits, setLimits] = useState<Limits | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'notifications' | 'security'>('profile');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [notifications, setNotifications] = useState<Notifications>({ email: true, push: false, marketing: false });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    loadUserData();
  }, [user, router]);

  const loadUserData = async () => {
    try {
      setFullName(user?.fullName || '');
      setEmail(user?.email || '');

      const [subResponse, limitsResponse] = await Promise.all([
        apiClient.stripe?.getSubscription?.().catch(() => null),
        apiClient.users?.getLimits?.().catch(() => null)
      ]);

      if (subResponse?.data?.success) setSubscription(subResponse.data.subscription);

      if (limitsResponse?.data?.success) {
        setLimits(limitsResponse.data.limits);
        setUsage(limitsResponse.data.usage);
        if (limitsResponse.data.plan !== user?.plan) updateUser({ plan: limitsResponse.data.plan });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await apiClient.users.updateMe({ fullName, avatarUrl });
      if (response.data.success) {
        // CORRECCIÓN: Cambiar avatarUrl a avatar_url para que coincida con el tipo esperado
        updateUser({ 
          fullName, 
          avatar_url: avatarUrl  // Cambiado de avatarUrl a avatar_url
        });
        toast.success('Perfil actualizado correctamente');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('avatars').upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setAvatarUrl(publicUrl);
      toast.success('Imagen subida correctamente');
    } catch (error) {
      toast.error('Error al subir la imagen');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Sesión cerrada correctamente');
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro': return <Crown className="w-5 h-5 text-purple-600" />;
      case 'basic': return <Gem className="w-5 h-5 text-blue-600" />;
      case 'enterprise': return <Award className="w-5 h-5 text-amber-600" />;
      default: return <Star className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPlanGradient = (plan: string) => {
    switch (plan) {
      case 'pro': return 'from-purple-600 to-indigo-600';
      case 'basic': return 'from-blue-600 to-cyan-600';
      case 'enterprise': return 'from-amber-600 to-orange-600';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'pro': return 'Pro';
      case 'basic': return 'Basic';
      case 'enterprise': return 'Enterprise';
      default: return 'Free';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <Sparkles className="w-8 h-8 text-blue-600 absolute top-6 left-1/2 transform -translate-x-1/2 animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  const currentPlan = user?.plan || 'free';
  const planGradient = getPlanGradient(currentPlan);
  const planName = getPlanName(currentPlan);
  const PlanIcon = getPlanIcon(currentPlan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
                <p className="text-sm text-gray-500">Gestiona tu cuenta y preferencias</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Plan Banner */}
        <div className={`bg-gradient-to-r ${planGradient} rounded-2xl shadow-lg p-6 mb-8 text-white`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl">{PlanIcon}</div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Plan {planName}</h2>
                <p className="text-white/80 max-w-2xl">
                  {currentPlan === 'free' && 'Disfruta de las funcionalidades básicas. Actualiza para obtener más.'}
                  {currentPlan === 'basic' && 'Accede a más apps, mejoras y soporte prioritario.'}
                  {currentPlan === 'pro' && 'Desbloquea todo el potencial con apps ilimitadas y características avanzadas.'}
                  {currentPlan === 'enterprise' && 'Solución personalizada para tu empresa con soporte dedicado.'}
                </p>
              </div>
            </div>
            {currentPlan === 'free' && (
              <Link href="/billing" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Actualizar Plan
              </Link>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
          {(['profile', 'billing', 'notifications', 'security'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {tab === 'profile' && <><User className="w-4 h-4 inline mr-2" />Perfil</>}
              {tab === 'billing' && <><CreditCard className="w-4 h-4 inline mr-2" />Facturación</>}
              {tab === 'notifications' && <><Bell className="w-4 h-4 inline mr-2" />Notificaciones</>}
              {tab === 'security' && <><Shield className="w-4 h-4 inline mr-2" />Seguridad</>}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Foto de perfil</h3>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                        {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : (user?.fullName?.charAt(0) || 'U')}
                      </div>
                      <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                        <Camera className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                      </label>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Sube una foto para personalizar tu perfil</p>
                      <p className="text-xs text-gray-500">Formatos: JPG, PNG. Máx 2MB</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Información personal</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Tu nombre" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                      <input type="email" value={email} disabled className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed" />
                      <p className="text-xs text-gray-500 mt-1">No puedes cambiar el correo electrónico</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button onClick={handleSaveProfile} disabled={saving} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50">
                      {saving ? <><Loader2 className="w-5 h-5 animate-spin" />Guardando...</> : <><Save className="w-5 h-5" />Guardar cambios</>}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Preferencias</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Palette className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Tema oscuro</p>
                          <p className="text-xs text-gray-500">Cambia la apariencia de la interfaz</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={theme === 'dark'} onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Idioma</p>
                          <p className="text-xs text-gray-500">Selecciona tu idioma preferido</p>
                        </div>
                      </div>
                      <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Plan actual</h3>
                  <div className={`bg-gradient-to-r ${planGradient} rounded-xl p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm opacity-90">Plan {planName}</p>
                        <p className="text-2xl font-bold mt-1">
                          {currentPlan === 'free' && 'Gratuito'}
                          {currentPlan === 'basic' && '$29.99/mes'}
                          {currentPlan === 'pro' && '$99.99/mes'}
                          {currentPlan === 'enterprise' && 'Personalizado'}
                        </p>
                      </div>
                      <div className="p-3 bg-white/10 rounded-xl">{PlanIcon}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="text-xs opacity-90">Apps creadas</p>
                        <p className="text-xl font-bold">{usage?.appsThisMonth || 0} / {limits?.appsPerMonth === -1 ? '∞' : limits?.appsPerMonth || 3}</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="text-xs opacity-90">Tokens usados</p>
                        <p className="text-xl font-bold">{(usage?.tokensUsed || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  {subscription?.trial_ends_at && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="font-medium text-yellow-800">Período de prueba</p>
                          <p className="text-sm text-yellow-700">Termina el {formatDate(subscription.trial_ends_at)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de facturación</h3>
                  <div className="space-y-3">
                    {['Febrero 2026', 'Enero 2026'].map((month) => (
                      <div key={month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Plan {planName} - {month}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-gray-900">$49.99</span>
                          <button className="text-blue-600 hover:text-blue-700"><Download className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Preferencias de notificaciones</h3>
                <div className="space-y-4">
                  {[
                    { key: 'email' as const, label: 'Notificaciones por email', desc: 'Recibe actualizaciones sobre tus apps' },
                    { key: 'push' as const, label: 'Notificaciones push', desc: 'Alertas en tiempo real en el navegador' },
                    { key: 'marketing' as const, label: 'Marketing y promociones', desc: 'Recibe ofertas y novedades' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className="text-sm text-gray-500">{desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={notifications[key]} onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all">
                    Guardar preferencias
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Cambiar contraseña</h3>
                  <div className="space-y-4">
                    {['Contraseña actual', 'Nueva contraseña', 'Confirmar nueva contraseña'].map((label) => (
                      <div key={label}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                        <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all">
                      Actualizar contraseña
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200">
                  <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Zona de peligro
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-900">Eliminar cuenta</p>
                      <p className="text-sm text-red-700">Esta acción es permanente y no se puede deshacer</p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Resumen de cuenta</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user?.fullName || 'Usuario'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Plan</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentPlan === 'pro' ? 'bg-purple-100 text-purple-600' : currentPlan === 'basic' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                      {planName}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white">
                  <p className="text-sm opacity-90 mb-1">Apps este mes</p>
                  <p className="text-2xl font-bold">{usage?.appsThisMonth || 0} / {limits?.appsPerMonth === -1 ? '∞' : limits?.appsPerMonth || 3}</p>
                  <div className="w-full h-2 bg-white/20 rounded-full mt-2">
                    <div className="h-full bg-white rounded-full" style={{ width: `${Math.min((usage?.appsThisMonth || 0) / (limits?.appsPerMonth || 3) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Enlaces rápidos</h3>
              <div className="space-y-2">
                {[
                  { href: '/billing', icon: CreditCard, label: 'Facturación' },
                  { href: '/apps', icon: Rocket, label: 'Mis apps' },
                  { href: '/support', icon: Shield, label: 'Soporte' },
                ].map(({ href, icon: Icon, label }) => (
                  <Link key={href} href={href} className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <span className="flex items-center gap-2"><Icon className="w-4 h-4" />{label}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}