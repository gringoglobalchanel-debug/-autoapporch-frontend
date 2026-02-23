'use client';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function LegalPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Aviso Legal y Términos de Uso</h1>
        <p className="text-gray-500 mb-10">Última actualización: enero 2025</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Titular del servicio</h2>
            <p>AutoAppOrchestrator es una plataforma de generación automática de aplicaciones web mediante inteligencia artificial. El uso de esta plataforma implica la aceptación de los presentes términos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Descripción del servicio</h2>
            <p>AutoAppOrchestrator permite a los usuarios crear, desplegar y gestionar aplicaciones web mediante lenguaje natural. Las aplicaciones son generadas por modelos de inteligencia artificial y desplegadas automáticamente en infraestructura de terceros (Vercel).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Uso aceptable</h2>
            <p className="mb-3">El usuario se compromete a no utilizar la plataforma para:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Crear aplicaciones con contenido ilegal, fraudulento o que viole derechos de terceros</li>
              <li>Generar spam, malware o cualquier tipo de software malicioso</li>
              <li>Suplantar identidades o empresas</li>
              <li>Violar las condiciones de uso de los servicios integrados (Stripe, Vercel, GoDaddy)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Propiedad de las apps generadas</h2>
            <p>Las aplicaciones generadas son propiedad del usuario que las creó. AutoAppOrchestrator no reclama derechos sobre el contenido generado, aunque sí se reserva el derecho de suspender apps que violen estos términos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Dominios personalizados</h2>
            <p>Los dominios registrados a través de la plataforma quedan a nombre de AutoAppOrchestrator como registrante técnico. En caso de cancelación de la suscripción, el dominio puede ser liberado tras un período de gracia de 60 días.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Limitación de responsabilidad</h2>
            <p>AutoAppOrchestrator no garantiza que las aplicaciones generadas estén libres de errores ni que cumplan con requisitos específicos de negocio. El usuario es responsable de revisar y validar el funcionamiento de su app antes de usarla en producción.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Pagos y reembolsos</h2>
            <p>Los pagos son procesados por Stripe. Las suscripciones se renuevan automáticamente. Puedes cancelar en cualquier momento desde tu panel de facturación. No se realizan reembolsos por períodos ya facturados salvo casos excepcionales a criterio del equipo.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Modificaciones</h2>
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados por email con al menos 15 días de antelación.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contacto</h2>
            <p>Para cualquier consulta legal escríbenos a <a href="mailto:legal@autoapporch.com" className="text-blue-600 hover:underline">legal@autoapporch.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
