/**
 * Página de facturación y suscripción
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  CreditCard, 
  Check, 
  Loader2, 
  Zap,
  Rocket,
  Crown,
  Globe
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
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentPlan();
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
      console.error('Error creating checkout:', error);
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
      console.error('Error creating portal:', error);
      toast.error('Error al abrir el portal de facturación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al Dashboard
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Planes y precios
          </h1>
          <p className="text-xl text-gray-600">
            Elige el plan perfecto para tus necesidades
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
                  plan.popular 
                    ? 'border-blue-600 shadow-xl relative' 
                    : 'border-gray-200'
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

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/mes</span>
                </div>

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
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      isUpgrade ? 'Actualizar plan' : 'Seleccionar plan'
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
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Dominios personalizados extras
                  </h3>
                  <p className="text-gray-600">
                    Agrega más dominios a tu plan por solo +$5/mes cada uno
                  </p>
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
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Métodos de pago aceptados
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
              Visa
            </div>
            <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
              Mastercard
            </div>
            <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
              American Express
            </div>
            <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
              PayPal (pronto)
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Todos los pagos son procesados de forma segura por Stripe.
            No almacenamos información de tarjetas de crédito.
          </p>
        </div>
      </div>
    </div>
  );
}