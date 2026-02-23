'use client';
import Link from 'next/link';
import { Sparkles, Rocket, Globe, CreditCard, Map, Shield, Zap, RefreshCw, BarChart3, ArrowRight } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    { icon: Sparkles, title: 'Generación con IA', desc: 'Claude AI analiza tu idea y genera una aplicación completa — diseño, lógica y funcionalidades incluidas. Sin código.', color: 'bg-blue-100 text-blue-600' },
    { icon: Rocket, title: 'Deploy automático', desc: 'Tu app se despliega automáticamente en la nube al instante. Recibes una URL pública funcional sin tocar un servidor.', color: 'bg-purple-100 text-purple-600' },
    { icon: Globe, title: 'Dominio personalizado', desc: 'Los planes Premium y Pro incluyen dominios reales registrados y configurados automáticamente. Sin DNS ni configuraciones.', color: 'bg-green-100 text-green-600' },
    { icon: CreditCard, title: 'Pagos integrados', desc: 'Si tu app necesita cobrar, conectamos Stripe automáticamente. El dinero va directo a tu cuenta.', color: 'bg-yellow-100 text-yellow-600' },
    { icon: Map, title: 'Google Maps incluido', desc: 'Apps con mapas, rutas o ubicaciones funcionan desde el primer momento. La integración es automática.', color: 'bg-red-100 text-red-600' },
    { icon: Shield, title: 'SSL gratis', desc: 'Todas las apps desplegadas incluyen HTTPS automático. Tu app es segura desde el primer minuto.', color: 'bg-indigo-100 text-indigo-600' },
    { icon: Zap, title: 'Mejoras en un clic', desc: 'Describe lo que quieres cambiar y tu app se actualiza. Sin contratar programadores ni esperar semanas.', color: 'bg-orange-100 text-orange-600' },
    { icon: RefreshCw, title: 'Historial de versiones', desc: 'Cada mejora crea una nueva versión. Puedes ver el historial completo de cambios de tu app en todo momento.', color: 'bg-teal-100 text-teal-600' },
    { icon: BarChart3, title: 'Analytics incluido', desc: 'Ve las métricas de tu app — visitas, versiones y estado del deploy — desde tu dashboard.', color: 'bg-pink-100 text-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AutoAppOrchestrator</span>
          </Link>
          <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Empezar gratis
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Todo lo que necesitas, <span className="text-blue-600">ya incluido</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16">
          No pagas por integraciones extra. No configuras nada. Todo funciona desde el primer momento.
        </p>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-600 py-16 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">¿Listo para probarlo?</h2>
        <p className="text-blue-100 mb-8 text-lg">Crea tu primera app gratis hoy mismo.</p>
        <Link href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
          Comenzar ahora <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}