'use client';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShoppingBag, Calendar, UtensilsCrossed, Camera, Truck, Users } from 'lucide-react';

export default function ExamplesPage() {
  const examples = [
    {
      icon: ShoppingBag,
      category: 'E-commerce',
      title: 'Tienda de ropa online',
      desc: 'Catálogo de productos, carrito de compras, pagos con Stripe y panel de administración.',
      tags: ['Pagos', 'Catálogo', 'Admin'],
      color: 'bg-pink-50 border-pink-100',
      iconColor: 'bg-pink-100 text-pink-600',
    },
    {
      icon: Calendar,
      category: 'Servicios',
      title: 'Sistema de reservas',
      desc: 'Reservas online para salones, consultorios o cualquier servicio con calendario y recordatorios.',
      tags: ['Calendario', 'Notificaciones', 'Pagos'],
      color: 'bg-blue-50 border-blue-100',
      iconColor: 'bg-blue-100 text-blue-600',
    },
    {
      icon: UtensilsCrossed,
      category: 'Restaurantes',
      title: 'Menú digital con pedidos',
      desc: 'Carta digital con QR, pedidos en línea, pagos y panel para gestionar órdenes en tiempo real.',
      tags: ['QR', 'Pedidos', 'Pagos'],
      color: 'bg-orange-50 border-orange-100',
      iconColor: 'bg-orange-100 text-orange-600',
    },
    {
      icon: Camera,
      category: 'Portfolio',
      title: 'Portfolio de fotógrafo',
      desc: 'Galería de fotos, formulario de contacto, paquetes de servicios y sistema de cotizaciones.',
      tags: ['Galería', 'Contacto', 'Cotizaciones'],
      color: 'bg-purple-50 border-purple-100',
      iconColor: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Truck,
      category: 'Logística',
      title: 'Gestión de inventario',
      desc: 'Control de stock, entradas y salidas, reportes y alertas de stock bajo para tu negocio.',
      tags: ['Inventario', 'Reportes', 'Alertas'],
      color: 'bg-green-50 border-green-100',
      iconColor: 'bg-green-100 text-green-600',
    },
    {
      icon: Users,
      category: 'Comunidad',
      title: 'Directorio de profesionales',
      desc: 'Listado de profesionales con perfiles, filtros de búsqueda y sistema de contacto directo.',
      tags: ['Directorio', 'Búsqueda', 'Perfiles'],
      color: 'bg-teal-50 border-teal-100',
      iconColor: 'bg-teal-100 text-teal-600',
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
          Ejemplos de apps creadas
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16">
          Estos son solo algunos ejemplos de lo que puedes crear. Si puedes describirlo, podemos construirlo.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {examples.map(({ icon: Icon, category, title, desc, tags, color, iconColor }) => (
            <div key={title} className={`bg-white rounded-2xl border ${color} p-6 hover:shadow-md transition-shadow`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${iconColor} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{category}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 text-lg mb-6">¿Tienes una idea diferente? No importa — cuéntanosla.</p>
          <Link href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
            Crear mi app <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}