'use client';
import Link from 'next/link';
import { Sparkles, MessageSquare, Cpu, Rocket, Globe, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      icon: MessageSquare,
      title: 'Describes tu app',
      desc: 'Cuéntanos qué necesitas en un chat sencillo. Puede ser una tienda, un sistema de reservas, una landing page o cualquier otra idea. No necesitas saber de tecnología.',
      color: 'bg-blue-600',
    },
    {
      number: '02',
      icon: Cpu,
      title: 'Claude la genera',
      desc: 'Nuestra IA analiza tu descripción, decide el diseño, la estructura y las funcionalidades necesarias, y genera el código completo de tu aplicación en minutos.',
      color: 'bg-purple-600',
    },
    {
      number: '03',
      icon: Rocket,
      title: 'Se despliega automáticamente',
      desc: 'Sin que hagas nada, tu app se sube a la nube, se configura el servidor, el SSL y el dominio. Todo en automático.',
      color: 'bg-green-600',
    },
    {
      number: '04',
      icon: Globe,
      title: 'Recibes tu enlace listo',
      desc: 'En minutos tienes una URL pública que puedes compartir con tus clientes. Si tienes plan Premium o Pro, también tu propio dominio personalizado.',
      color: 'bg-orange-600',
    },
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
          ¿Cómo funciona?
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16">
          De la idea a la app en línea en 4 pasos simples. Sin código, sin servidores, sin complicaciones.
        </p>

        <div className="max-w-3xl mx-auto space-y-8 text-left">
          {steps.map(({ number, icon: Icon, title, desc, color }, i) => (
            <div key={number} className="flex gap-6 items-start">
              <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-gray-400 tracking-widest">{number}</span>
                  <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">¿Cuánto tiempo tarda?</h2>
          <p className="text-blue-100 text-lg mb-6">La mayoría de apps quedan listas y desplegadas en menos de 5 minutos.</p>
          <Link href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
            Crear mi app ahora <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}