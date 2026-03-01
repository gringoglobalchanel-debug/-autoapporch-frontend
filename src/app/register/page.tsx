'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock, User, Loader2, CreditCard } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (error) throw error;

      setUser({
        id: data.user!.id,
        email: data.user!.email!,
        fullName: formData.fullName,
      });

      toast.success('¡Cuenta creada! Elige tu plan para comenzar.');
      
      // ✅ FIX: redirigir a /billing para elegir plan y poner tarjeta
      setTimeout(() => {
        router.push('/billing?new_user=true');
      }, 1000);

    } catch (error: any) {
      toast.error(error.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Sparkles className="w-10 h-10 text-primary-600" />
            <span className="text-2xl font-bold gradient-text">
              AutoAppOrchestrator
            </span>
          </Link>
        </div>

        {/* Pasos */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</div>
            <span className="text-sm font-medium text-blue-600">Crear cuenta</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300" />
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center font-bold">2</div>
            <span className="text-sm text-gray-400">Elegir plan</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300" />
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center font-bold">3</div>
            <span className="text-sm text-gray-400">Empezar</span>
          </div>
        </div>

        {/* Banner trial */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-4 mb-6 flex items-center gap-3">
          <CreditCard className="w-8 h-8 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">7 días gratis, sin cobros inmediatos</p>
            <p className="text-xs text-blue-200">Elige tu plan hoy y empieza a usar la plataforma. Se cobra al día 8.</p>
          </div>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            Crear tu cuenta
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nombre completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  className="input pl-10"
                  placeholder="Juan Pérez"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  className="input pl-10"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="label">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  className="input pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 6 caracteres
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creando cuenta...
                </>
              ) : (
                'Crear cuenta y elegir plan →'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            Al crear tu cuenta aceptas nuestros términos de servicio. 
            No se realiza ningún cobro hasta el día 8 del trial.
          </p>

          <p className="text-center text-sm text-gray-600 mt-4">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}