import React, { useState } from 'react';
import { ShieldCheck, KeyRound, LogIn, ArrowLeft } from 'lucide-react';

const LoginScreen = ({ onBack, logoLoadError, setLogoLoadError }) => {
  const [accessCode, setAccessCode] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (accessCode.length > 3) {
        alert(`Validando Transação: ${accessCode}\nRedirecionando para o Dashboard...`);
    } else {
        alert("Por favor, digite um código válido.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 blur-[120px] rounded-full opacity-40 pointer-events-none" />
      <div className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-600/10 blur-[60px] rounded-full opacity-25 pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 animate-fade-in">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="text-center mb-10 mt-12 flex flex-col items-center">
          <div className="mb-4">
            {!logoLoadError ? (
              <picture>
                <source srcSet="/logo-lexops.webp" type="image/webp" />
                <img 
                  src="/logo-lexops.jpg" 
                  alt="LexOps Insight" 
                  onError={() => setLogoLoadError(true)}
                  loading="lazy"
                  decoding="async"
                  className="h-16 w-auto rounded-xl shadow-lg shadow-violet-500/20 object-cover"
                />
              </picture>
            ) : (
              <div className="p-3 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-500/20">
                <ShieldCheck size={32} className="text-white" />
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Acesso ao Painel</h2>
          <p className="text-slate-400 text-sm">Insira o código recebido no e-mail de confirmação.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2 ml-1">Código da Transação</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="text" 
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Ex: 56902318 (Eduzz/Hotmart)"
                className="w-full bg-[#0B1121] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-mono uppercase"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-violet-900/20 transition-all flex items-center justify-center gap-2 group"
          >
            VALIDAR ACESSO
            <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            Não encontrou o código? <a href="#" className="text-violet-400 hover:text-violet-300">Verifique sua caixa de spam no e-mail.</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
