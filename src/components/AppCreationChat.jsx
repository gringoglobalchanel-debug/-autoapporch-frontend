'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, Bot, User, Loader2, AlertCircle, CheckCircle, CreditCard, ExternalLink } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const AppCreationChat = ({ onConfirm, onCancel }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy Claude, tu asistente para crear apps. Cuéntame qué tipo de aplicación necesitas.\n\nPor ejemplo:\n- "Quiero una app de gestión de inventario para mi tienda"\n- "Necesito un chat en tiempo real como WhatsApp"\n- "Una landing page para mi negocio de fotografía"\n\n💡 **Importante:** Si tu app necesita integraciones como Google Maps, Drive o Calendar, dímelo durante la conversación y las incluiremos.\n\nCuando estés de acuerdo con lo conversado, solo di "OK", "listo" o "genera" y comenzaré a crear tu app.',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [fileSpecs, setFileSpecs] = useState([]);
  const [stripeStatus, setStripeStatus] = useState(null); // null | 'checking' | 'connected' | 'not_connected'
  const [pendingAnalysis, setPendingAnalysis] = useState(null); // análisis esperando stripe
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  // Verificar si el usuario ya tiene Stripe Connect activo
  const checkStripeStatus = async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/api/stripe-connect/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      return data.chargesEnabled ? 'connected' : 'not_connected';
    } catch {
      return 'not_connected';
    }
  };

  // Obtener link de onboarding de Stripe
  const getStripeOnboardingUrl = async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/api/stripe-connect/onboarding`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      return data.url || null;
    } catch {
      return null;
    }
  };

  // Continuar con la generación después de conectar Stripe
  const handleContinueWithoutStripe = () => {
    if (pendingAnalysis) {
      onConfirm(pendingAnalysis);
    }
  };

  const handleConnectStripe = async () => {
    const url = await getStripeOnboardingUrl();
    if (url) {
      window.open(url, '_blank');
      // Después de que el usuario vuelva, mostrar botón para continuar
      setStripeStatus('pending_return');
    }
  };

  const handleStripeConnected = () => {
    if (pendingAnalysis) {
      onConfirm(pendingAnalysis);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('No authenticated');

      const response = await fetch(`${API_URL}/api/chat/refine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: currentInput,
          conversationId: conversationId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la respuesta');
      }

      const data = await response.json();

      if (data.conversationId) setConversationId(data.conversationId);
      if (data.fileSpecs?.length > 0) setFileSpecs(prev => [...prev, ...data.fileSpecs]);

      if (data.confirmed && data.analysis) {
        console.log('✅ Confirmación recibida, analysis:', data.analysis);

        const analysisWithFiles = {
          ...data.analysis,
          fileSpecs: fileSpecs,
          googleApis: data.analysis.googleApis || []
        };

        // Si la app necesita pagos, verificar Stripe Connect primero
        if (data.analysis.requiresPayments) {
          setStripeStatus('checking');
          const status = await checkStripeStatus();
          setStripeStatus(status);
          setPendingAnalysis(analysisWithFiles);

          if (status === 'connected') {
            // Ya tiene Stripe — generar directo
            const confirmMsg = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: '✅ Perfecto, tu cuenta Stripe ya está conectada. Generando tu app con pagos integrados...',
              isConfirmed: true,
            };
            setMessages(prev => [...prev, confirmMsg]);
            setTimeout(() => onConfirm(analysisWithFiles), 800);
          } else {
            // No tiene Stripe — mostrar mensaje especial con botón
            const stripeMsg = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: '💳 Tu app necesita recibir pagos. Para que el dinero llegue directo a tu cuenta necesitas conectar Stripe.\n\nEs rápido (2 minutos) y gratuito. También puedes saltarlo y conectarlo después.',
              isStripePrompt: true,
            };
            setMessages(prev => [...prev, stripeMsg]);
          }
          return;
        }

        // Sin pagos — generar normal
        const confirmMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message || '✅ Perfecto, voy a generar tu app ahora...',
          isConfirmed: true,
        };
        setMessages(prev => [...prev, confirmMsg]);
        setTimeout(() => onConfirm(analysisWithFiles), 800);
        return;
      }

      // Respuesta normal del chat
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error.message === 'No authenticated'
          ? 'No has iniciado sesión. Por favor inicia sesión para continuar.'
          : `Lo siento, hubo un error: ${error.message}. Por favor intenta de nuevo.`,
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col h-[600px]">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' ? 'bg-blue-600'
                  : message.isError ? 'bg-red-100'
                  : message.isConfirmed ? 'bg-green-100'
                  : message.isStripePrompt ? 'bg-indigo-100'
                  : 'bg-gray-100'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : message.isError ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : message.isConfirmed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : message.isStripePrompt ? (
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <Bot className="w-5 h-5 text-gray-700" />
                  )}
                </div>

                <div className={`rounded-lg p-3 ${
                  message.role === 'user' ? 'bg-blue-600 text-white'
                  : message.isError ? 'bg-red-50 text-red-700 border border-red-200'
                  : message.isConfirmed ? 'bg-green-50 text-green-800 border border-green-200'
                  : message.isStripePrompt ? 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                  : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                  {/* Botones de Stripe */}
                  {message.isStripePrompt && (
                    <div className="mt-4 space-y-2">
                      {stripeStatus === 'pending_return' ? (
                        <>
                          <p className="text-xs text-indigo-600 mb-2">
                            ¿Ya completaste el registro en Stripe?
                          </p>
                          <button
                            onClick={handleStripeConnected}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Sí, ya conecté mi cuenta — Generar app
                          </button>
                          <button
                            onClick={handleContinueWithoutStripe}
                            className="w-full px-4 py-2 bg-white text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors text-sm"
                          >
                            Conectar Stripe después
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleConnectStripe}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                          >
                            <CreditCard className="w-4 h-4" />
                            Conectar mi cuenta Stripe
                            <ExternalLink className="w-3 h-3" />
                          </button>
                          <button
                            onClick={handleContinueWithoutStripe}
                            className="w-full px-4 py-2 bg-white text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                          >
                            Saltar por ahora y conectar después
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-gray-700" />
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
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
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Di "ok", "listo" o "genera" cuando estés listo para crear tu app
        </p>
      </div>
    </div>
  );
};

export default AppCreationChat;