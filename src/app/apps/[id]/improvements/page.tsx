/**
 * Página de chat de mejoras de una app
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft, Bot, User, Send, Loader2, Sparkles,
  Zap, AlertCircle, CheckCircle, TrendingUp
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ImprovementsPage() {
  const params = useParams();
  const router = useRouter();
  const [appData, setAppData] = useState<any>(null);
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de mejoras. Cuéntame qué quieres cambiar o mejorar en tu app.\n\nPuedo ayudarte con:\n- Cambios de colores, textos o estilos\n- Agregar nuevas secciones o elementos\n- Nuevas funcionalidades o módulos\n\nCada mejora tiene un costo en tokens según su complejidad. Te explicaré el costo antes de proceder.',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingApp, setLoadingApp] = useState(true);
  const [tokens, setTokens] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  useEffect(() => {
    const loadApp = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/apps/${params.id}/improvements`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setAppData(data.app);
          setTokens(data.tokens);
        }
      } catch (error) {
        console.error('Error loading app:', error);
      } finally {
        setLoadingApp(false);
      }
    };

    if (params.id) loadApp();
  }, [params.id]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const token = await getToken();

      // Historial sin el mensaje inicial del sistema
      const history = messages.slice(1).map(m => ({ role: m.role, content: m.content }));

      const response = await fetch(`${API_URL}/api/apps/${params.id}/improvements/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: currentInput, history })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al procesar');
      }

      // Actualizar tokens restantes
      if (data.tokensRemaining !== undefined) {
        setTokens((prev: any) => ({ ...prev, available: data.tokensRemaining }));
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        isConfirmed: data.confirmed,
        improvement: data.improvement
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error: any) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error.message || 'Hubo un error. Por favor intenta de nuevo.',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const getComplexityLabel = (type: string) => {
    switch (type) {
      case 'simple': return { label: 'Simple', color: 'text-green-600 bg-green-50' };
      case 'medium': return { label: 'Media', color: 'text-yellow-600 bg-yellow-50' };
      case 'complex': return { label: 'Compleja', color: 'text-red-600 bg-red-50' };
      default: return { label: type, color: 'text-gray-600 bg-gray-50' };
    }
  };

  if (loadingApp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Solicitar mejora — {appData?.name}
                </h1>
              </div>
            </div>

            {/* Tokens disponibles */}
            {tokens && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {tokens.available?.toLocaleString()} tokens disponibles
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-3xl">

        {/* Info de costos */}
        {tokens?.costs && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              COSTO EN TOKENS POR TIPO DE MEJORA
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'simple', label: 'Simple', desc: 'Colores, textos, estilos', cost: tokens.costs.simple },
                { type: 'medium', label: 'Media', desc: 'Nueva sección, layout', cost: tokens.costs.medium },
                { type: 'complex', label: 'Compleja', desc: 'Nuevo módulo, funcionalidad', cost: tokens.costs.complex },
              ].map(({ type, label, desc, cost }) => {
                const { color } = getComplexityLabel(type);
                const canAfford = tokens.available >= cost;
                return (
                  <div key={type} className={`p-3 rounded-lg border ${canAfford ? 'border-gray-100' : 'border-red-100 bg-red-50/30'}`}>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>{label}</span>
                    <p className="text-xs text-gray-500 mt-1">{desc}</p>
                    <p className={`text-sm font-bold mt-1 ${canAfford ? 'text-gray-900' : 'text-red-500'}`}>
                      {cost.toLocaleString()} tokens
                    </p>
                    {!canAfford && (
                      <p className="text-xs text-red-500 mt-0.5">Sin saldo</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chat */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message: any) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'bg-blue-600'
                    : message.isError ? 'bg-red-100'
                    : message.isConfirmed ? 'bg-green-100'
                    : 'bg-gray-100'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : message.isError ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : message.isConfirmed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Bot className="w-5 h-5 text-gray-700" />
                    )}
                  </div>
                  <div className={`rounded-xl p-3 ${
                    message.role === 'user' ? 'bg-blue-600 text-white'
                    : message.isError ? 'bg-red-50 text-red-700 border border-red-200'
                    : message.isConfirmed ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                    {/* Badge de mejora confirmada */}
                    {message.isConfirmed && message.improvement && (
                      <div className="mt-3 p-2 bg-white rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getComplexityLabel(message.improvement.type).color}`}>
                            Mejora {getComplexityLabel(message.improvement.type).label}
                          </span>
                          <span className="text-xs font-bold text-gray-700">
                            -{message.improvement.tokensRequired?.toLocaleString()} tokens
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{message.improvement.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe qué quieres mejorar..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Confirma la mejora cuando Claude te muestre el costo y los detalles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}