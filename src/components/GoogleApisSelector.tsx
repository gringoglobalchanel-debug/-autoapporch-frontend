/**
 * Selector de Google APIs para integrar en la app
 */

'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface GoogleApi {
  id: string;
  name: string;
  icon: string;
  description: string;
  authorized: boolean;
}

export default function GoogleApisSelector({ onSelect }: { onSelect?: (apis: string[]) => void }) {
  const [apis, setApis] = useState<GoogleApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApis, setSelectedApis] = useState<string[]>([]);
  const [authorizing, setAuthorizing] = useState<string | null>(null);

  useEffect(() => {
    loadApis();
  }, []);

  const loadApis = async () => {
    try {
      const response = await apiClient.google.getApis();
      if (response.data.success) {
        setApis(response.data.apis);
        const authorized = response.data.apis
          .filter((api: GoogleApi) => api.authorized)
          .map((api: GoogleApi) => api.id);
        setSelectedApis(authorized);
      }
    } catch (error) {
      console.error('Error loading Google APIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async (apiId: string) => {
    setAuthorizing(apiId);
    try {
      const response = await apiClient.google.getAuthUrl(apiId);
      if (response.data.success) {
        // Abrir ventana de autenticación de Google
        window.open(response.data.authUrl, '_blank', 'width=600,height=700');
        
        // Esperar a que vuelva
        toast.success('Ventana de autorización abierta');
        
        // Recargar después de un tiempo
        setTimeout(() => {
          loadApis();
          setAuthorizing(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Error authorizing:', error);
      toast.error('Error al autorizar');
      setAuthorizing(null);
    }
  };

  const toggleApi = (apiId: string) => {
    if (selectedApis.includes(apiId)) {
      setSelectedApis(selectedApis.filter(id => id !== apiId));
    } else {
      setSelectedApis([...selectedApis, apiId]);
    }
  };

  useEffect(() => {
    if (onSelect) {
      onSelect(selectedApis);
    }
  }, [selectedApis, onSelect]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Integraciones de Google
        </h3>
        <button
          onClick={loadApis}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Recargar"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {apis.map((api) => (
          <div
            key={api.id}
            className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
              selectedApis.includes(api.id)
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => toggleApi(api.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">{api.icon}</span>
              {api.authorized ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <h4 className="font-medium text-gray-900">{api.name}</h4>
            <p className="text-xs text-gray-500 mt-1">{api.description}</p>
            
            {!api.authorized && selectedApis.includes(api.id) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAuthorize(api.id);
                }}
                disabled={authorizing === api.id}
                className="mt-3 w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {authorizing === api.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Autorizar
                  </>
                )}
              </button>
            )}

            {api.authorized && (
              <div className="mt-3 text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Conectada
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Selecciona las APIs que necesitas para tu app. Algunas requieren autorización adicional.
      </p>
    </div>
  );
}