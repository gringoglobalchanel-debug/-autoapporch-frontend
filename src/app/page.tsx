/**
 * Página principal / Landing page
 */

'use client';

import Link from 'next/link';
import { Sparkles, Zap, Shield, Globe, ArrowRight, Rocket, CheckCircle, Code } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold gradient-text">
              AutoAppOrchestrator
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="btn-secondary">
              Iniciar sesión
            </Link>
            <Link href="/register" className="btn-primary">
              Empezar gratis
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          Tu app lista en minutos, no en semanas
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
          La nueva generación de millonarios no escribe código{' '}
          <span className="gradient-text">Escribe ideas...Crea tu web App.</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up">
          No necesitas saber programar. No necesitas contratar a nadie.
          Solo descríbenos tu app — una tienda, un sistema, una plataforma, lo que sea —
          y AutoAppOrchestrator la crea, desplega y te entrega el enlace listo para compartir en solo minutos.
        </p>

        {/* Pasos simples */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10 text-sm text-gray-600">
          {[
            { step: '1', text: 'Describes tu app' },
            { step: '2', text: 'Claude la genera' },
            { step: '3', text: 'Se despliega automáticamente' },
            { step: '4', text: 'Recibes tu enlace listo' },
          ].map(({ step, text }, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                {step}
              </div>
              <span className="font-medium text-gray-700">{text}</span>
              {i < 3 && <ArrowRight className="w-4 h-4 text-gray-300 hidden md:block" />}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <Link href="/register" className="btn-primary text-lg px-8 py-3">
            Crear mi app ahora
            <ArrowRight className="w-5 h-5 ml-2 inline" />
          </Link>
          <Link href="/billing" className="btn-outline text-lg px-8 py-3">
            Ver planes
          </Link>
        </div>

        {/* Demo placeholder */}
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl shadow-2xl flex items-center justify-center">
            <Code className="w-24 h-24 text-primary-600 opacity-50" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          Todo incluido. Sin sorpresas.
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
          No eres tú el que configura el servidor, el dominio o el SSL.
          Nosotros lo hacemos por ti, automáticamente.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Generación con IA</h3>
            <p className="text-gray-600">
              Claude AI entiende lo que necesitas y genera tu app completa —
              diseño, lógica y funcionalidades incluidas.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-6 h-6 text-secondary-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Deploy automático</h3>
            <p className="text-gray-600">
              Tu app se despliega sola en la nube. Recibes un enlace funcional
              al instante, sin tocar un servidor.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Dominio incluido</h3>
            <p className="text-gray-600">
              Planes Premium y Pro incluyen tu propio dominio personalizado,
              registrado y configurado automáticamente.
            </p>
          </div>
        </div>
      </section>

      {/* Lo que incluye */}
      <section className="container mx-auto px-4 py-10 mb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            ¿Qué obtienes con cada app?
          </h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              'App generada con IA en minutos',
              'Deploy automático en la nube',
              'URL pública lista para compartir',
              'SSL (HTTPS) incluido gratis',
              'Dominio personalizado (Premium y Pro)',
              'Google Maps integrado si lo necesitas',
              'Pagos con Stripe si tu app los requiere',
              'Actualizaciones y mejoras en un clic',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para tener tu app en línea hoy?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sin conocimientos técnicos. Sin contratar programadores.
            Solo describe lo que necesitas y nosotros lo construimos.
          </p>
          <Link href="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
            Crear mi primera app gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600">
            © 2025 AutoAppOrchestrator. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/features" className="text-gray-600 hover:text-primary-600">Características</Link>
            <Link href="/billing" className="text-gray-600 hover:text-primary-600">Precios</Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-primary-600">Cómo funciona</Link>
            <Link href="/examples" className="text-gray-600 hover:text-primary-600">Ejemplos</Link>
            <Link href="/cookies" className="text-gray-600 hover:text-primary-600">Política de cookies</Link>
            <Link href="/legal" className="text-gray-600 hover:text-primary-600">Legal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}