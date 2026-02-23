'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { AlertCircle, Zap, Loader2 } from 'lucide-react';

interface UsageProps {
  userId: string;
}

export default function UsageLimits({ userId }: UsageProps) {
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage = async () => {
    try {
      const response = await apiClient.users.getLimits();
      if (response.data.success) {
        setUsage(response.data);
      }
    } catch (error) {
      console.error('Error loading usage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!usage) return null;

  const exceededApis = usage?.exceeded || [];

  if (exceededApis.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <AlertCircle className="w-6 h-6 text-yellow-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">
            Límite de uso excedido
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {exceededApis.length === 1 
              ? `Tu app ha excedido el límite de ${exceededApis[0]}.` 
              : `Tus apps han excedido los límites de ${exceededApis.join(', ')}.`}
          </p>
          <Link
            href="/billing?tab=tokens"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all text-sm font-medium"
          >
            <Zap className="w-4 h-4" />
            Comprar tokens extra
          </Link>
        </div>
      </div>
    </div>
  );
}