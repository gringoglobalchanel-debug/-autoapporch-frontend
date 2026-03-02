'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Check, Palette, MessageCircle } from 'lucide-react';
import AppCreationChat from '@/components/AppCreationChat';
import { supabase } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const STYLES = [
  {
    id: 'modern', name: 'Moderno', description: 'Profesional y corporativo',
    primary: '#3B82F6', secondary: '#1E40AF', accent: '#F59E0B',
    background: '#FFFFFF', surface: '#F9FAFB', text: '#111827', icon: '🎯'
  },
  {
    id: 'elegant', name: 'Elegante', description: 'Lujo y sofisticación',
    primary: '#000000', secondary: '#1F2937', accent: '#FFD700',
    background: '#FFFFFF', surface: '#F3F4F6', text: '#111827', icon: '✨'
  },
  {
    id: 'minimal', name: 'Minimalista', description: 'Limpio y moderno',
    primary: '#4B5563', secondary: '#1F2937', accent: '#10B981',
    background: '#F9FAFB', surface: '#FFFFFF', text: '#1F2937', icon: '○'
  },
  {
    id: 'ocean', name: 'Oceano', description: 'Fresco y confiable',
    primary: '#0EA5E9', secondary: '#0284C7', accent: '#F59E0B',
    background: '#FFFFFF', surface: '#F0F9FF', text: '#0C4A6E', icon: '🌊'
  },
  {
    id: 'emerald', name: 'Esmeralda', description: 'Frescura y crecimiento',
    primary: '#10B981', secondary: '#059669', accent: '#F59E0B',
    background: '#FFFFFF', surface: '#ECFDF5', text: '#064E3B', icon: '💎'
  },
  {
    id: 'radiant', name: 'Radiante', description: 'Energía y acción',
    primary: '#EF4444', secondary: '#DC2626', accent: '#F59E0B',
    background: '#FFFFFF', surface: '#FEF2F2', text: '#991B1B', icon: '🔥'
  },
  {
    id: 'royal', name: 'Real', description: 'Lujo y sofisticación',
    primary: '#8B5CF6', secondary: '#7C3AED', accent: '#FCD34D',
    background: '#FFFFFF', surface: '#F5F3FF', text: '#5B21B6', icon: '👑'
  },
  {
    id: 'midnight', name: 'Medianoche', description: 'Elegancia y poder',
    primary: '#1E293B', secondary: '#0F172A', accent: '#F59E0B',
    background: '#F8FAFC', surface: '#F1F5F9', text: '#0F172A', icon: '🌙'
  },
  {
    id: 'sunset', name: 'Atardecer', description: 'Cálido y acogedor',
    primary: '#F97316', secondary: '#EA580C', accent: '#3B82F6',
    background: '#FFFFFF', surface: '#FFF7ED', text: '#9A3412', icon: '🌅'
  }
];

export default function CreatePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [showChat, setShowChat] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleStartChat = async () => {
    if (!name.trim()) {
      toast.error('Por favor ingresa un nombre para tu app');
      return;
    }

    // ✅ Verificar que tiene tarjeta registrada antes de abrir el chat
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/api/stripe/subscription`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const sub = data.subscription;

      if (!sub || !sub.stripe_subscription_id) {
        toast.error('¡Necesitas elegir un plan primero! Tienes 7 días gratis.', { duration: 4000 });
        router.push('/billing?required=true&return=/create');
        return;
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }

    setShowChat(true);
  };

  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const buildDescription = (analysis, appName) => {
    if (analysis.fullConversation) {
      return `App: ${appName}\n\nConversación con el usuario:\n${analysis.fullConversation}`;
    }
    if (analysis.description && analysis.description.length > 30) {
      return analysis.description;
    }
    if (analysis.modules && analysis.modules.length > 0) {
      return analysis.modules.map(m => m.description || m.name).join('. ');
    }
    return `Crear una aplicación llamada "${appName}" con funcionalidades completas y diseño profesional.`;
  };

  const handleChatConfirm = async (analysis) => {
    setGenerating(true);

    try {
      const token = await getAuthToken();

      if (!token) {
        toast.error('No autenticado. Por favor inicia sesión.');
        setGenerating(false);
        return;
      }

      const description = buildDescription(analysis, name);

      console.log('📋 Descripción enviada a Claude:', description.substring(0, 300));

      const createResponse = await fetch(`${API_URL}/api/apps/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          style: selectedStyle.id,
          colors: {
            primary: selectedStyle.primary,
            secondary: selectedStyle.secondary,
            accent: selectedStyle.accent,
            background: selectedStyle.background,
            surface: selectedStyle.surface,
            text: selectedStyle.text
          },
          googleApis: analysis.googleApis || []
        })
      });

      const createData = await createResponse.json();

      // ✅ FIX: manejar error de límite de plan con mensaje claro
      if (!createResponse.ok) {
        if (createResponse.status === 403 && createData.upgradeRequired) {
          // Guardar conversación para retomar después del pago
          sessionStorage.setItem('pendingApp', JSON.stringify({
            name,
            description,
            styleId: selectedStyle.id,
            colors: {
              primary: selectedStyle.primary,
              secondary: selectedStyle.secondary,
              accent: selectedStyle.accent,
              background: selectedStyle.background,
              surface: selectedStyle.surface,
              text: selectedStyle.text
            },
            googleApis: analysis.googleApis || []
          }));

          // Mostrar el mensaje exacto del backend
          toast.error(createData.message, { duration: 6000 });

          setTimeout(() => {
            router.push(`/billing?upgrade=true&return=/create`);
          }, 2000);

          setGenerating(false);
          return;
        }

        throw new Error(createData.message || 'Error al crear app');
      }

      const appId = createData.app.id;
      await pollAppStatus(appId, token);
      router.push(`/apps/${appId}`);

    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al generar la app. Por favor intenta de nuevo.');
      setGenerating(false);
    }
  };

  const pollAppStatus = async (appId, token) => {
    const maxAttempts = 90;
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`${API_URL}/api/apps/${appId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          const data = await response.json();

          if (data.app.status === 'ready') {
            clearInterval(interval);
            resolve();
          } else if (data.app.status === 'error') {
            clearInterval(interval);
            reject(new Error('La generación falló'));
          }

          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(interval);
            reject(new Error('Timeout esperando generación'));
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 1000);
    });
  };

  if (generating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mx-auto flex items-center justify-center mb-4 animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generando tu App</h2>
            <p className="text-gray-600">Claude está creando tu aplicación con estilo {selectedStyle.name}...</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Analizando requerimientos</span>
              <span className="text-green-600 font-medium">✓</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Aplicando estilo {selectedStyle.name}</span>
              <span className="text-green-600 font-medium">✓</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Generando código</span>
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Esto puede tomar entre 30 segundos y 1 minuto</p>
        </div>
      </div>
    );
  }

  if (showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setShowChat(false)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Creando: {name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Estilo seleccionado:</span>
              <span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                style={{ backgroundColor: selectedStyle.primary + '20', color: selectedStyle.primary }}
              >
                <span>{selectedStyle.icon}</span>
                {selectedStyle.name}
              </span>
            </div>
          </div>

          <AppCreationChat onConfirm={handleChatConfirm} onCancel={() => setShowChat(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al Dashboard
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Crea tu app con asistente IA</h1>
          <p className="text-xl text-gray-600">1. Elige un estilo • 2. Conversa con Claude • 3. Recibe tu app</p>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block">
              <span className="text-lg font-semibold text-gray-900 mb-2 block">📱 Nombre de tu app</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Mi Tienda Online"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                required
              />
            </label>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="w-5 h-5 text-gray-700" />
              <span className="text-lg font-semibold text-gray-900">Elige el estilo de tu app</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`relative p-5 rounded-xl border-2 transition-all ${
                    selectedStyle.id === style.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {selectedStyle.id === style.id && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg shadow-sm" style={{ backgroundColor: style.primary }} />
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: style.accent }} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900 flex items-center gap-1 text-lg">
                        <span>{style.icon}</span>
                        {style.name}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{style.description}</p>
                    </div>
                    <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: style.surface }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: style.primary }} />
                        <div className="h-2 w-20 rounded-full" style={{ backgroundColor: style.primary + '80' }} />
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200" />
                      <div className="mt-2 flex gap-1">
                        <div className="h-6 w-16 rounded" style={{ backgroundColor: style.primary }} />
                        <div className="h-6 w-16 rounded" style={{ backgroundColor: style.accent }} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Conversa con Claude
                </h3>
                <p className="text-white/90">
                  Durante la conversación, Claude te preguntará si necesitas integraciones como Google Maps, Drive o Calendar.
                </p>
              </div>
              <button
                onClick={handleStartChat}
                disabled={!name.trim()}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                Comenzar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}