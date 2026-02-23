/**
 * Gestor de dominios personalizados
 */

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';
import { Globe, CheckCircle, XCircle, AlertCircle, Loader2, Plus, Trash2, ExternalLink } from 'lucide-react';

export default function DomainManager({ appId }) {
  const [domains, setDomains] = useState([]);
  const [limits, setLimits] = useState({ allowed: 0, used: 0, remaining: 0 });
  const [newDomain, setNewDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState({});

  useEffect(() => {
    loadDomains();
  }, [appId]);

  const loadDomains = async () => {
    try {
      const response = await apiClient.get(`/api/domains/${appId}`);
      setDomains(response.data.domains);
      setLimits(response.data.limits);
    } catch (error) {
      console.error('Error loading domains:', error);
    }
  };

  const handleAddDomain = async (e) => {
    e.preventDefault();
    if (!newDomain) return;

    setLoading(true);
    try {
      const response = await apiClient.post(`/api/domains/${appId}`, {
        domain: newDomain
      });

      toast.success('✅ Dominio agregado correctamente');
      setNewDomain('');
      loadDomains();
      
      // Mostrar instrucciones DNS
      if (response.data.verification) {
        showDNSInstructions(response.data.domain, response.data.verification);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al agregar dominio');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (domain) => {
    setVerifying({ ...verifying, [domain]: true });
    try {
      const response = await apiClient.get(`/api/domains/${appId}/${domain}/verify`);
      
      if (response.data.verified) {
        toast.success(`✅ Dominio ${domain} verificado correctamente`);
        loadDomains();
      } else {
        toast.info(`⏳ Dominio ${domain} aún no está verificado`, {
          duration: 5000,
          icon: '⏳'
        });
      }
    } catch (error) {
      toast.error('Error al verificar dominio');
    } finally {
      setVerifying({ ...verifying, [domain]: false });
    }
  };

  const handleRemove = async (domain) => {
    if (!confirm(`¿Eliminar el dominio ${domain}?`)) return;

    try {
      await apiClient.delete(`/api/domains/${appId}/${domain}`);
      toast.success('Dominio eliminado');
      loadDomains();
    } catch (error) {
      toast.error('Error al eliminar dominio');
    }
  };

  const showDNSInstructions = (domain, verification) => {
    let instructions;
    
    if (verification.nameservers) {
      instructions = (
        <div className="bg-gray-50 p-4 rounded-lg mt-2">
          <p className="font-medium mb-2">📋 Configura estos nameservers en tu proveedor de dominio:</p>
          {verification.nameservers.map((ns, i) => (
            <code key={i} className="block bg-gray-100 p-2 mb-1 text-sm font-mono">
              {ns}
            </code>
          ))}
        </div>
      );
    } else if (verification.txtRecord) {
      instructions = (
        <div className="bg-gray-50 p-4 rounded-lg mt-2">
          <p className="font-medium mb-2">📋 Agrega este registro TXT:</p>
          <code className="block bg-gray-100 p-2 text-sm font-mono break-all">
            {verification.txtRecord}
          </code>
        </div>
      );
    }

    toast.custom((t) => (
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto">
        <div className="p-4">
          <div className="flex items-start">
            <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Configura tu dominio: {domain}
              </p>
              {instructions}
              <div className="mt-4 flex gap-2">
                <a
                  href="https://vercel.com/docs/projects/domains/add-domain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Ver guía completa
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ), { duration: 15000 });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
      case 'verified':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" /> Verificado
        </span>;
      case 'configuring':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" /> Pendiente
        </span>;
      case 'failed':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" /> Error
        </span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Dominios personalizados</h3>
        </div>
        
        {/* Límites */}
        <div className="text-sm">
          <span className="text-gray-600">Usados: </span>
          <span className="font-bold">{limits.used} / {limits.allowed}</span>
        </div>
      </div>

      {/* Barra de progreso de límites */}
      {limits.allowed > 0 && (
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(limits.used / limits.allowed) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {limits.remaining > 0 
              ? `Te quedan ${limits.remaining} dominios incluidos`
              : 'Has usado todos tus dominios incluidos'
            }
          </p>
        </div>
      )}

      {/* Lista de dominios */}
      {domains.length > 0 && (
        <div className="space-y-3 mb-6">
          {domains.map((d) => (
            <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{d.domain}</span>
                  {getStatusBadge(d.status)}
                  {d.domain === domains.find(dd => dd.primary_domain)?.domain && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Principal
                    </span>
                  )}
                </div>
                
                {d.status === 'active' && (
                  <a 
                    href={`https://${d.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Visitar sitio <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                {d.status !== 'active' && (
                  <button
                    onClick={() => handleVerify(d.domain)}
                    disabled={verifying[d.domain]}
                    className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50"
                  >
                    {verifying[d.domain] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Verificar'
                    )}
                  </button>
                )}
                <button
                  onClick={() => handleRemove(d.domain)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario para agregar dominio */}
      {limits.remaining > 0 ? (
        <form onSubmit={handleAddDomain} className="flex gap-2">
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="ej: micafeteria.com"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            pattern="^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$"
            title="Ingresa un dominio válido (ejemplo.com)"
            required
          />
          <button
            type="submit"
            disabled={loading || !newDomain}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Agregar
          </button>
        </form>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 font-medium mb-2">
            ⚡ Has alcanzado el límite de dominios incluidos
          </p>
          <p className="text-xs text-yellow-600 mb-3">
            Puedes agregar dominios extras por +$5/mes cada uno
          </p>
          <button
            onClick={() => window.location.href = '/billing/domains'}
            className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium"
          >
            Comprar dominio extra (+$5/mes)
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4">
        * El dominio .com lo compras aparte (~$12/año). Nosotros lo configuramos automáticamente.
        La propagación DNS puede tomar hasta 48 horas, pero usualmente es en 5-10 minutos.
      </p>
    </div>
  );
}