/**
 * Layout raíz de la aplicación Next.js
 */

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link'; // 👈 IMPORTAR LINK

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AutoAppOrchestrator - Generate Apps with AI',
  description: 'Create custom applications automatically using Claude AI',
  keywords: ['AI', 'app generator', 'Claude', 'SaaS', 'automation'],
  authors: [{ name: 'AutoAppOrchestrator Team' }],
  openGraph: {
    title: 'AutoAppOrchestrator',
    description: 'Generate apps automatically with AI',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen"> {/* 👈 CONTENEDOR FLEX */}
            <main className="flex-grow"> {/* 👈 MAIN QUE CRECE */}
              {children}
            </main>
            
            {/* 👇 FOOTER CON ENLACES LEGALES */}
            <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                  {/* Logo y descripción */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">AO</span>
                      </div>
                      <span className="font-bold text-gray-900">AutoAppOrchestrator</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Genera aplicaciones personalizadas con IA en segundos. 
                      Desde landing pages hasta sistemas complejos, todo con Claude.
                    </p>
                    <p className="text-xs text-gray-500">
                      © {new Date().getFullYear()} AutoAppOrchestrator. Todos los derechos reservados.
                    </p>
                  </div>

                  {/* Enlaces rápidos */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Producto</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link href="/features" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          Características
                        </Link>
                      </li>
                      <li>
                        <Link href="/pricing" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          Precios
                        </Link>
                      </li>
                      <li>
                        <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          Cómo funciona
                        </Link>
                      </li>
                      <li>
                        <Link href="/examples" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          Ejemplos
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Enlaces legales */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          Términos y Condiciones
                        </Link>
                      </li>
                      <li>
                        <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          Política de Privacidad
                        </Link>
                      </li>
                      <li>
                        <Link href="/cookies" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          Política de Cookies
                        </Link>
                      </li>
                      <li>
                        <Link href="/legal" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          Aviso Legal
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Línea divisoria con información adicional */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                      <span>🛡️ Datos protegidos</span>
                      <span>🔒 Pagos seguros</span>
                      <span>⚡ Generación instantánea</span>
                      <span>🤖 IA de última generación</span>
                    </div>
                    
                    <div className="flex gap-4">
                      <Link href="/contact" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
                        Contacto
                      </Link>
                      <Link href="/help" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
                        Ayuda
                      </Link>
                      <Link href="/status" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
                        Estado del sistema
                      </Link>
                    </div>
                  </div>

                  {/* Texto legal adicional */}
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400 max-w-3xl mx-auto">
                      Las aplicaciones generadas son propiedad de AutoAppOrchestrator y se licencian durante la membresía activa. 
                      Al finalizar la membresía o después de 6 meses de inactividad, las apps pueden ser reclamadas o eliminadas. 
                      El código fuente no es accesible ni descargable.
                    </p>
                  </div>
                </div>
              </div>
            </footer>
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}