import React from 'react';
import { CheckCircle2, ArrowRight, Download } from 'lucide-react';

const ThankYouPage = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center">
            <CheckCircle2 size={60} className="text-emerald-400" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
          Perfeito! ✅
        </h1>

        {/* Subheading */}
        <p className="text-2xl text-slate-300 mb-6">
          Seu PDF já está a caminho do seu email
        </p>

        {/* Message */}
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 mb-10">
          <p className="text-lg text-slate-300 leading-relaxed mb-6">
            Verifique sua caixa de entrada (e a pasta de spam, por segurança) para encontrar 
            <strong> "7 Erros do Excel na Advocacia"</strong>.
          </p>

          <div className="space-y-4 text-left max-w-md mx-auto mb-6">
            <div className="flex gap-3 items-start p-3 bg-white/5 rounded-lg">
              <Download size={20} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">PDF Exclusivo</p>
                <p className="text-sm text-slate-400">Análise completa com estratégias práticas</p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-white/5 rounded-lg">
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Sem Spam</p>
                <p className="text-sm text-slate-400">Enviamos apenas conteúdo relevante</p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-white/5 rounded-lg">
              <ArrowRight size={20} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Próximo Passo</p>
                <p className="text-sm text-slate-400">Explore o LexOps e transforme seus dados</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a 
            href="https://www.lexopsinsight.com.br" 
            className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-lg transition-all flex items-center justify-center gap-2"
          >
            Voltar para Home <ArrowRight size={20} />
          </a>
          <a 
            href="/demo.html" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold rounded-xl text-lg transition-all flex items-center justify-center gap-2"
          >
            Ver Demo Ao Vivo
          </a>
        </div>

        {/* Additional Info */}
        <div className="text-sm text-slate-500 space-y-2">
          <p>Não recebeu o email? Verifique a pasta de spam ou entre em contato com:</p>
          <p>
            <a href="mailto:suporte@lexopsinsight.com.br" className="text-violet-400 hover:underline">
              suporte@lexopsinsight.com.br
            </a>
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 pt-16 border-t border-white/10 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-black text-violet-400">500+</p>
            <p className="text-sm text-slate-500">Profissionais Utilizando</p>
          </div>
          <div>
            <p className="text-3xl font-black text-emerald-400">98%</p>
            <p className="text-sm text-slate-500">Taxa de Satisfação</p>
          </div>
          <div>
            <p className="text-3xl font-black text-blue-400">24h</p>
            <p className="text-sm text-slate-500">Support Ativo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
