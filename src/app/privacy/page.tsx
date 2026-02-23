/**
 * Página de Política de Privacidad
 */

'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Database, Lock, Mail, Cookie, Smartphone, FileText, Bell, AlertCircle, Globe, Users, Camera, Map, CreditCard, Clock, Trash2, Download, RefreshCw } from 'lucide-react';

export default function PrivacyPage() {
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
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Política de Privacidad</h1>
          </div>
          <p className="text-purple-100 text-lg">
            Última actualización: 15 de febrero de 2026
          </p>
        </div>

        {/* Introducción */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-gray-700 leading-relaxed">
            En AutoAppOrchestrator, nos tomamos muy en serio tu privacidad. Esta política describe cómo recopilamos, usamos, compartimos y protegemos tu información personal cuando utilizas nuestros servicios.
          </p>
        </div>

        {/* Información que Recopilamos */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">1. Información que Recopilamos</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1.1 Información de Registro</h3>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Nombre completo</li>
                <li>Dirección de correo electrónico</li>
                <li>Contraseña (encriptada)</li>
                <li>Información de facturación (procesada por terceros)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1.2 Información de Uso</h3>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Dirección IP</li>
                <li>Tipo de navegador y dispositivo</li>
                <li>Páginas visitadas y acciones realizadas</li>
                <li>Apps generadas y modificaciones solicitadas</li>
                <li>Tokens de IA utilizados</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1.3 Información de las Apps Generadas</h3>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Descripciones y prompts proporcionados</li>
                <li>Preferencias de estilo y colores</li>
                <li>Historial de versiones</li>
                <li>Solicitudes de mejora</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Uso de la Información */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">2. Cómo Usamos tu Información</h2>
          </div>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Proveer, operar y mantener nuestros servicios</li>
            <li>Generar aplicaciones personalizadas según tus solicitudes</li>
            <li>Mejorar, personalizar y expandir nuestros servicios</li>
            <li>Procesar transacciones y enviar notificaciones relacionadas</li>
            <li>Comunicarnos contigo sobre actualizaciones, promociones y novedades</li>
            <li>Prevenir actividades fraudulentas y mejorar la seguridad</li>
            <li>Analizar tendencias de uso para optimizar la plataforma</li>
          </ul>
        </div>

        {/* Propiedad de Datos y Apps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-orange-600">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">3. Propiedad de Datos y Aplicaciones</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">3.1 Datos del Cliente</h3>
              <p className="text-gray-700">
                Los datos personales del Cliente son de su propiedad. No vendemos ni alquilamos información personal a terceros.
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">3.2 Código Generado</h3>
              <p className="text-gray-700">
                El código fuente generado es propiedad de AutoAppOrchestrator. Durante una membresía activa, el Cliente tiene una licencia de uso. Al terminar la membresía por cualquier causa, el Cliente pierde todos los derechos sobre el código y las apps generadas.
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">3.3 Reclamación por Inactividad</h3>
              <p className="text-gray-700">
                Después de 6 meses de inactividad (sin pagos ni acceso), AutoAppOrchestrator puede reclamar, reutilizar o eliminar cualquier app generada, incluyendo todo su código, datos, y dominios asociados.
              </p>
            </div>
          </div>
        </div>

        {/* Compartición de Datos */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">4. Compartición de Datos</h2>
          </div>

          <p className="text-gray-700 mb-4">
            Podemos compartir tu información en las siguientes circunstancias:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><span className="font-medium">Proveedores de servicios:</span> Procesadores de pago, hosting, análisis de datos</li>
            <li><span className="font-medium">Cumplimiento legal:</span> Cuando la ley lo requiera o para proteger nuestros derechos</li>
            <li><span className="font-medium">Transferencia de negocio:</span> En caso de fusión, adquisición o venta de activos</li>
            <li><span className="font-medium">Consentimiento:</span> Con tu autorización explícita</li>
          </ul>
        </div>

        {/* Seguridad */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">5. Seguridad de la Información</h2>
          </div>

          <p className="text-gray-700 mb-4">
            Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Encriptación SSL/TLS para todas las comunicaciones</li>
            <li>Almacenamiento encriptado de datos sensibles</li>
            <li>Autenticación de usuarios y control de acceso</li>
            <li>Monitoreo continuo de actividad sospechosa</li>
            <li>Copias de seguridad periódicas</li>
            <li>Auditorías de seguridad regulares</li>
          </ul>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-gray-900">6. Cookies y Tecnologías Similares</h2>
          </div>

          <p className="text-gray-700 mb-4">
            Utilizamos cookies y tecnologías similares para:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Mantener tu sesión iniciada</li>
            <li>Recordar tus preferencias</li>
            <li>Analizar el tráfico y comportamiento en la plataforma</li>
            <li>Personalizar tu experiencia</li>
            <li>Mostrar anuncios relevantes (en el futuro)</li>
          </ul>
          <p className="mt-4 text-sm text-gray-500">
            Puedes gestionar las cookies desde la configuración de tu navegador.
          </p>
        </div>

        {/* Retención de Datos */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">7. Retención de Datos</h2>
          </div>

          <p className="text-gray-700 mb-4">
            Conservamos tu información mientras tu cuenta esté activa o según sea necesario para proporcionarte los servicios.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><span className="font-medium">Cuentas activas:</span> Datos retenidos durante la vigencia de la membresía</li>
            <li><span className="font-medium">Cuentas canceladas:</span> Datos retenidos por 30 días antes de eliminación permanente</li>
            <li><span className="font-medium">Inactividad (6 meses):</span> Apps reclamadas y reutilizadas por la plataforma</li>
            <li><span className="font-medium">Requisitos legales:</span> Datos retenidos según obligaciones fiscales y legales</li>
          </ul>
        </div>

        {/* Derechos del Usuario */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">8. Tus Derechos</h2>
          </div>

          <p className="text-gray-700 mb-4">
            Como usuario, tienes derecho a:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><span className="font-medium">Acceder:</span> Solicitar copia de tus datos personales</li>
            <li><span className="font-medium">Rectificar:</span> Corregir información inexacta</li>
            <li><span className="font-medium">Eliminar:</span> Solicitar la eliminación de tus datos (sujeto a restricciones legales)</li>
            <li><span className="font-medium">Oponerte:</span> Oponerte al procesamiento de tus datos</li>
            <li><span className="font-medium">Exportar:</span> Recibir tus datos en formato portátil</li>
          </ul>
          <p className="mt-4">
            Para ejercer estos derechos, contáctanos en <a href="mailto:privacidad@autoapporchestrator.com" className="text-blue-600 hover:underline">privacidad@autoapporchestrator.com</a>
          </p>
        </div>

        {/* Cambios a esta Política */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">9. Cambios a esta Política</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Podemos actualizar esta política periódicamente. Te notificaremos sobre cambios significativos a través de la plataforma o por correo electrónico. El uso continuado del servicio después de los cambios constituye tu aceptación de la política actualizada.
          </p>
        </div>

        {/* Contacto */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6" />
            <h2 className="text-xl font-bold">Contacto</h2>
          </div>
          <p className="text-gray-300 mb-4">
            Si tienes preguntas sobre esta política de privacidad:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="mailto:privacidad@autoapporchestrator.com" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors text-center">
              privacidad@autoapporchestrator.com
            </a>
            <Link href="/contact" className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors text-center font-medium">
              Formulario de contacto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}