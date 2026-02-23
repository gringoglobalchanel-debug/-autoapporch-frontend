/**
 * Página de Términos y Condiciones
 * Establece los derechos de propiedad, uso y pagos
 */

'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, AlertCircle, FileText, Scale, Clock, CreditCard, Code, Copy, Ban, RefreshCw, Zap, Lock, Globe, Users, DollarSign, Calendar, Trash2, HelpCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-20">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Términos y Condiciones</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Última actualización: 15 de febrero de 2026
          </p>
        </div>

        {/* Introducción */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">1. Aceptación de los Términos</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            Al acceder o utilizar los servicios de AutoAppOrchestrator ("la Plataforma"), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Estos términos constituyen un acuerdo legal vinculante entre usted ("el Cliente") y AutoAppOrchestrator ("la Empresa", "nosotros", "nos").
          </p>
        </div>

        {/* Propiedad del Código */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-purple-600">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">2. Propiedad del Código Generado</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                2.1 Titularidad del Código Fuente
              </h3>
              <p className="text-gray-700">
                Todo el código fuente, scripts, archivos de configuración, y cualquier otro material generado por la Plataforma ("el Código") es y seguirá siendo propiedad exclusiva de AutoAppOrchestrator. El Código se licencia, no se vende.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Copy className="w-4 h-4" />
                2.2 Licencia de Uso durante la Membresía
              </h3>
              <p className="text-gray-700 mb-2">
                Mientras el Cliente mantenga una membresía activa y al día en sus pagos, se le otorga una licencia no exclusiva, no transferible, y limitada para:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Utilizar las aplicaciones generadas para fines comerciales o personales</li>
                <li>Monetizar, vender productos/servicios a través de las aplicaciones generadas</li>
                <li>Mostrar las aplicaciones al público</li>
                <li>Realizar modificaciones a través de nuestra plataforma de mejoras</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                2.3 Derechos de Monetización
              </h3>
              <p className="text-gray-700">
                El Cliente tiene todos los derechos para monetizar las aplicaciones generadas (ventas, publicidad, suscripciones, etc.) EXCLUSIVAMENTE mientras su membresía esté activa y al corriente de pagos. Estos derechos caducan automáticamente al terminar la membresía.
              </p>
            </div>
          </div>
        </div>

        {/* Membresías y Pagos */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-green-600">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">3. Membresías y Pagos</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3.1 Suscripciones</h3>
              <p className="text-gray-700">
                Las membresías se facturan de forma mensual o anual según el plan seleccionado. El pago se procesa por adelantado y no es reembolsable excepto donde la ley lo requiera.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3.2 Cancelación</h3>
              <p className="text-gray-700">
                El Cliente puede cancelar su suscripción en cualquier momento. La cancelación será efectiva al final del período de facturación actual. No se emitirán reembolsos parciales.
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                3.3 Período de Gracia por Impago
              </h3>
              <p className="text-gray-700 mb-2">
                Si un pago falla, el Cliente tiene un período de gracia de <span className="font-bold">7 días</span> para actualizar su método de pago. Durante este período:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>La aplicación seguirá funcionando pero con acceso limitado</li>
                <li>No se podrán solicitar nuevas mejoras</li>
                <li>El dominio personalizado podría desactivarse temporalmente</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Inactividad y Reclamación de Apps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-orange-600">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">4. Período de Inactividad y Reclamación</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                4.1 Período de Inactividad
              </h3>
              <p className="text-gray-700 mb-2">
                Se considerará "inactividad" cuando el Cliente acumule <span className="font-bold text-orange-700">6 (seis) meses consecutivos</span> sin:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Realizar el pago de la membresía</li>
                <li>Acceder a la plataforma</li>
                <li>Interactuar con las aplicaciones generadas</li>
                <li>Responder a comunicaciones de la Empresa</li>
              </ul>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                4.2 Reclamación de la Aplicación
              </h3>
              <p className="text-gray-700 mb-3">
                Transcurrido el período de inactividad de 6 meses, <span className="font-bold">AutoAppOrchestrator tendrá el derecho absoluto de:</span>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Reclamar la propiedad total de la aplicación y su código</li>
                <li>Reutilizar, modificar, o vender la aplicación a terceros</li>
                <li>Eliminar permanentemente la aplicación y todos sus datos</li>
                <li>Transferir el dominio a otro cliente</li>
                <li>Monetizar la aplicación de cualquier forma que considere oportuna</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600 bg-white p-3 rounded-lg">
                ⚠️ El Cliente perderá todos los derechos sobre la aplicación, incluyendo cualquier monetización previa, tráfico acumulado, y datos de usuarios.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4.3 Notificación Previa</h3>
              <p className="text-gray-700">
                Antes de reclamar una aplicación por inactividad, la Empresa hará intentos razonables de contactar al Cliente mediante:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Correo electrónico registrado (hasta 3 intentos)</li>
                <li>Notificaciones en la plataforma</li>
                <li>Mensajes SMS (si el número está registrado)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Responsabilidades */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">5. Responsabilidades del Cliente</h2>
          </div>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Mantener la confidencialidad de sus credenciales de acceso</li>
            <li>No utilizar las aplicaciones generadas para actividades ilegales</li>
            <li>No intentar descompilar, ingeniaria inversa, o extraer el código fuente</li>
            <li>No revender, alquilar, o sublicenciar el acceso a la plataforma</li>
            <li>Cumplir con todas las leyes aplicables en su jurisdicción</li>
            <li>No utilizar las apps para almacenar información ilegal o sensible sin autorización</li>
          </ul>
        </div>

        {/* Limitación de Responsabilidad */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-gray-900">6. Limitación de Responsabilidad</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            En la máxima medida permitida por la ley, AutoAppOrchestrator no será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo pérdida de beneficios, datos, uso, fondo de comercio, u otras pérdidas intangibles, resultantes de:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-1 text-gray-700">
            <li>El uso o la imposibilidad de usar el servicio</li>
            <li>El costo de adquisición de bienes y servicios sustitutos</li>
            <li>Acceso no autorizado o alteración de sus transmisiones o datos</li>
            <li>Declaraciones o conductas de cualquier tercero en el servicio</li>
          </ul>
        </div>

        {/* Modificaciones */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">7. Modificaciones del Servicio</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            AutoAppOrchestrator se reserva el derecho de modificar, suspender, o descontinuar cualquier parte del servicio en cualquier momento, con o sin aviso. La Empresa no será responsable ante el Cliente o terceros por cualquier modificación, suspensión, o discontinuación del servicio.
          </p>
        </div>

        {/* Ley Aplicable */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">8. Ley Aplicable</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Estos términos se regirán e interpretarán de acuerdo con las leyes del país de operación de AutoAppOrchestrator, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
          </p>
        </div>

        {/* Contacto */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-6 h-6" />
            <h2 className="text-xl font-bold">¿Preguntas sobre los términos?</h2>
          </div>
          <p className="text-gray-300 mb-4">
            Si tienes dudas sobre estos términos, contáctanos:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="mailto:legal@autoapporchestrator.com" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors text-center">
              legal@autoapporchestrator.com
            </a>
            <Link href="/contact" className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors text-center font-medium">
              Formulario de contacto
            </Link>
          </div>
        </div>

        {/* Aceptación */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200 text-center">
          <p className="text-blue-800">
            Al utilizar nuestros servicios, usted reconoce haber leído y aceptado estos Términos y Condiciones.
          </p>
        </div>
      </div>
    </div>
  );
}