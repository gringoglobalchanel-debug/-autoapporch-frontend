'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, CreditCard, Check, Loader2,
  Zap, Rocket, Crown, Globe, Sparkles, Clock
} from 'lucide-react';

const PLANS = [
  {
    id: 'basico',
    name: 'Básico',
    price: 29.99,
    interval: 'month',
    icon: Zap,
    description: 'Ideal para proyectos personales',
    features: [
      '3 apps desplegadas',
      '50,000 tokens/mes',
      'Deploy automático',
      'Dominio .vercel.app',
      'SSL gratis',
      'Soporte por email'
    ],
    color: 'blue',
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 49.99,
    interval: 'month',
    icon: Rocket,
    description: 'Para profesionales y negocios',
    features: [
      '8 apps desplegadas',
      '150,000 tokens/mes',
      'Deploy automático',
      '1 dominio personalizado incluido',
      'SSL gratis',
      'Backups automáticos',
      'Google Maps incluido',
      'Soporte prioritario'
    ],
    color: 'purple',
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99.99,
    interval: 'month',
    icon: Crown,
    description: 'Máxima capacidad y rendimiento',
    features: [
      '25 apps desplegadas',
      '500,000 tokens/mes',
      'Deploy automático',
      '5 dominios personalizados incluidos',
      'SSL gratis',
      'Backups automáticos',
      'Google Maps incluido',
      'API prioritario',
      'Soporte 24/7',
      'Dominios extras +$5/mes'
    ],
    color: 'amber',
    popular: false
  }
];

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewUser = searchParams.get('new_user') === 'true';
  const upgradeSuccess = searchParams.get('upgrade_success') === 'true';

  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentPlan();
    if (upgradeSuccess) {
      toast.success('¡Plan actualizado exitosamente!');
      // ✅ Si hay una app pendiente, redirigir a /create para retomar
      const pendingApp = sessionStorage.getItem('pendingApp');
      if (pendingApp) {
        toast('Retomando tu app pendiente...', { icon: '🚀', duration: 2000 });
        setTimeout(() => { router.push('/create?resume=true'); }, 2500);
      }
    }
  }, []);

  const loadCurrentPlan = async () => {
    try {
      const response = await apiClient.stripe.getSubscription();
      if (response.data.success && response.data.subscription) {
        setCurrentPlan(response.data.subscription.plan);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const handleCheckout = async (planId: string) => {
    setSelectedPlan(planId);
    setLoading(true);
    try {
      const response = await apiClient.stripe.createCheckout(planId);
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al procesar la solicitud');
      setSelectedPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await apiClient.stripe.createPortal();
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error('Error al abrir el portal de facturación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          {isNewUser ? (
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-800">AutoAppOrchestrator</span>
            </div>
          ) : (
            <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al Dashboard
            </Link>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-7xl">

        {/* Banner nuevo usuario */}
        {isNewUser && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Clock className="w-8 h-8" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold mb-1">¡7 días gratis en cualquier plan!</h2>
              <p className="text-blue-100">Elige tu plan hoy, agrega tu tarjeta y empieza a crear apps. No se cobra nada hasta el día 8. Cancela cuando quieras.</p>
            </div>
          </div>
        )}

        {/* Pasos para nuevo usuario */}
        {isNewUser && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">✓</div>
              <span className="text-sm text-green-600 font-medium">Cuenta creada</span>
            </div>
            <div className="w-8 h-0.5 bg-blue-400" />
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</div>
              <span className="text-sm font-medium text-blue-600">Elegir plan</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300" />
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center font-bold">3</div>
              <span className="text-sm text-gray-400">Empezar</span>
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {isNewUser ? 'Elige tu plan' : 'Planes y precios'}
          </h1>
          <p className="text-xl text-gray-600">
            {isNewUser
              ? 'Selecciona el plan que mejor se adapte a tus necesidades'
              : 'Elige el plan perfecto para tus necesidades'}
          </p>

          {currentPlan && currentPlan !== 'free_trial' && (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <Check className="w-4 h-4" />
              <span className="font-medium">Plan actual: {PLANS.find(p => p.id === currentPlan)?.name || currentPlan}</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentPlan === plan.id;
            const isUpgrade = currentPlan &&
              ['basico', 'premium', 'pro'].indexOf(plan.id) >
              ['basico', 'premium', 'pro'].indexOf(currentPlan as string);

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl shadow-sm border ${
                  plan.popular ? 'border-blue-600 shadow-xl relative' : 'border-gray-200'
                } p-8 flex flex-col`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Más popular
                  </div>
                )}

                <div className="mb-6">
                  <div className={`w-12 h-12 bg-${plan.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 text-${plan.color}-600`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/mes</span>
                </div>

                {/* ✅ Indicador de trial para nuevos usuarios */}
                {isNewUser && (
                  <div className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                    <Clock className="w-3 h-3" />
                    7 días gratis, luego ${plan.price}/mes
                  </div>
                )}

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <button
                    onClick={handleManageSubscription}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Gestionar suscripción
                  </button>
                ) : (
                  <button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={loading && selectedPlan === plan.id}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } disabled:opacity-50 flex items-center justify-center gap-2`}
                  >
                    {loading && selectedPlan === plan.id ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />Procesando...</>
                    ) : isNewUser ? (
                      `Empezar gratis con ${plan.name} →`
                    ) : isUpgrade ? (
                      'Actualizar plan'
                    ) : (
                      'Seleccionar plan'
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {currentPlan && ['premium', 'pro'].includes(currentPlan) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Dominios personalizados extras</h3>
                  <p className="text-gray-600">Agrega más dominios a tu plan por solo +$5/mes cada uno</p>
                </div>
              </div>
              <Link
                href="/billing/domains"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Comprar dominios extras
              </Link>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Métodos de pago aceptados</h3>
          <div className="flex flex-wrap items-center gap-4">
            {['Visa', 'Mastercard', 'American Express'].map(m => (
              <div key={m} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">{m}</div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Todos los pagos son procesados de forma segura por Stripe. No almacenamos información de tarjetas.
            {isNewUser && ' Durante los 7 días de prueba no se realiza ningún cobro.'}
          </p>
        </div>
      </div>
    </div>
  );
}