'use client';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AutoAppOrchestrator</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Política de Cookies</h1>
        <p className="text-gray-500 mb-10">Última actualización: enero 2025</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">¿Qué son las cookies?</h2>
            <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Nos ayudan a recordar tus preferencias y mejorar tu experiencia de uso.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies que utilizamos</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-1">Cookies esenciales</h3>
                <p className="text-sm">Necesarias para el funcionamiento básico de la plataforma, como mantener tu sesión iniciada. No pueden desactivarse.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-1">Cookies de autenticación</h3>
                <p className="text-sm">Gestionadas por Supabase para mantener tu sesión activa de forma segura.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-1">Cookies de análisis</h3>
                <p className="text-sm">Usamos PostHog para entender cómo se usa la plataforma y mejorarla. Los datos son anónimos y no se comparten con terceros.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-1">Cookies de pago</h3>
                <p className="text-sm">Stripe utiliza cookies para procesar pagos de forma segura. No almacenamos datos de tarjetas.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">¿Cómo controlar las cookies?</h2>
            <p>Puedes configurar tu navegador para rechazar cookies o eliminar las existentes. Ten en cuenta que algunas funciones de la plataforma pueden dejar de funcionar correctamente si desactivas las cookies esenciales.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contacto</h2>
            <p>Si tienes preguntas sobre nuestra política de cookies, escríbenos a <a href="mailto:privacidad@autoapporch.com" className="text-blue-600 hover:underline">privacidad@autoapporch.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}