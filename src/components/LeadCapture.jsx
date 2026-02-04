import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const LeadCapture = ({ variant = 'default' }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', 'exists'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Por favor, insira seu email.');
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/.netlify/functions/capture-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(data.exists ? 'exists' : 'success');
        setMessage(
          data.exists 
            ? 'Email já cadastrado! Verifique sua caixa de entrada.' 
            : 'Perfeito! Verifique seu email para baixar o PDF.'
        );
        if (!data.exists) {
          setEmail('');
        }
      } else {
        setStatus('error');
        setMessage(data.error || 'Erro ao processar sua solicitação. Tente novamente.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erro de conexão. Verifique sua internet e tente novamente.');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Variante minimalista (para seções inline)
  if (variant === 'inline') {
    return (
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-colors"
            disabled={loading || status === 'success'}
          />
          <button
            type="submit"
            disabled={loading || status === 'success'}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-600 text-white font-bold rounded-lg transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>

        {status && (
          <div className={`mt-3 p-3 rounded-lg flex items-start gap-2 text-sm ${
            status === 'success' || status === 'exists'
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
          }`}>
            {status === 'error' ? (
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            )}
            <span>{message}</span>
          </div>
        )}
      </div>
    );
  }

  // Variante grande (para modal ou destaque)
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Baixe Grátis: 7 Erros do Excel na Advocacia
        </h3>
        <p className="text-slate-400 mb-6">
          Descubra os erros mais comuns que estão te custando horas de trabalho.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Seu Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              disabled={loading || status === 'success'}
            />
          </div>

          <button
            type="submit"
            disabled={loading || status === 'success'}
            className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Mail size={18} />
                Receber PDF Agora
              </>
            )}
          </button>
        </form>

        {status && (
          <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 text-sm ${
            status === 'success' || status === 'exists'
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
          }`}>
            {status === 'error' ? (
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{status === 'error' ? 'Erro' : 'Sucesso!'}</p>
              <p>{message}</p>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-500 mt-6 text-center">
          Respeitamos sua privacidade. Sem spam, sem compartilhamento.
        </p>
      </div>
    </div>
  );
};

export default LeadCapture;
