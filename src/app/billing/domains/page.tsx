/**
 * Página de compra de dominios extras
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Globe, 
  Check, 
  Loader2, 
  CreditCard,
  Shield
} from 'lucide-react';

export default function DomainsBillingPage() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const response = await apiClient.stripe.getSubscription();
      if (response.data.success) {
        setSubscription(response.data.subscription);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await apiClient.stripe.createCheckout(`extra_domain_${quantity}`);

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast.error(error.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const getPlanName = (plan: string) => {
    const plans: Record<string, string> = {
      premium: 'Premium',
      pro: 'Pro'
    };
    return plans[plan] || plan;
  };

  const domainsIncluded = subscription?.plan === 'premium' ? 1 : 5;
  const domainsUsed = subscription?.domains_used || 0;
  const domainsAvailable = domainsIncluded - domainsUsed;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/billing"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Globe className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Dominios personalizados extras
          </h1>
          <p className="text-xl text-gray-600">
            Agrega más dominios a tu plan actual
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Plan actual */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Tu plan actual</h3>
              
              {subscription ? (
                <div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {getPlanName(subscription.plan)}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dominios incluidos:</span>
                      <span className="font-medium">{domainsIncluded}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dominios usados:</span>
                      <span className="font-medium">{domainsUsed}</span>
                    </div>
                    <div className="flex justify-between text-blue-600 font-medium">
                      <span>Disponibles:</span>
                      <span>{domainsAvailable}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <Link 
                      href="/billing"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Cambiar de plan →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Compra de dominios extras */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Dominios extras
                  </h2>
                  <p className="text-gray-600">
                    Agrega más dominios personalizados a tu cuenta
                  </p>
                </div>
              </div>

              {/* Pricing card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Precio por dominio</p>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold">$5</span>
                      <span className="text-gray-300 mb-1">/mes</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/10 rounded-lg">
                    <Shield className="w-8 h-8" />
                  </div>
                </div>
                
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Configuración automática en Vercel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>SSL gratis incluido</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Redirige automáticamente a tu app</span>
                  </li>
                </ul>
              </div>

              {/* Selector de cantidad */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Número de dominios extras
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <div className="flex-1">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Máximo 10 dominios extras por cuenta
                </p>
              </div>

              {/* Total */}
              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">${quantity * 5}.00/mes</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Facturado mensualmente</span>
                  <span>+ impuestos según tu región</span>
                </div>
              </div>

              {/* Botón de pago */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Comprar dominios extras
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                💡 El dominio .com lo compras aparte (~$12/año). 
                Nosotros lo configuramos automáticamente.
              </p>
            </div>

            {/* FAQ */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Preguntas frecuentes
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-sm mb-1">¿Puedo cancelar un dominio extra?</p>
                  <p className="text-sm text-gray-600">
                    Sí, puedes eliminar dominios en cualquier momento. El cargo se prorratea.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">¿Qué incluye la configuración?</p>
                  <p className="text-sm text-gray-600">
                    Nosotros conectamos tu dominio automáticamente con Vercel. 
                    Solo necesitas actualizar los nameservers de tu dominio.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">¿Funciona con cualquier dominio?</p>
                  <p className="text-sm text-gray-600">
                    Sí, funciona con .com, .net, .org, .io, .app, .dev y más de 1000 extensiones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}