import React, { useState, useMemo, Suspense, lazy, useCallback, memo, useEffect } from 'react';
import { 
  ShieldCheck, Zap, CheckCircle2, Gem,
  Download, ChevronDown, ChevronUp, Lock, 
  Instagram, Facebook, UserCircle,
  ArrowRight, LayoutDashboard, MonitorPlay,
  AlertTriangle, ExternalLink
} from 'lucide-react';
import LeadCapture from './components/LeadCapture';

// Lazy load do LoginScreen para não bloquear o carregamento principal
const LoginScreen = lazy(() => import('./LoginScreen').catch(() => ({
  default: ({ onBack, logoLoadError, setLogoLoadError }) => (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <p className="text-white">Carregando...</p>
    </div>
  )
})));

// Componente memoizado para FAQ item - evita re-renders desnecessários
const FAQItem = memo(({ faq, index, isOpen, onToggle }) => (
  <div className="border border-white/5 rounded-3xl bg-gradient-to-br from-slate-900/30 to-slate-950/60 overflow-hidden hover:border-white/10 hover:bg-slate-900/40 transition-all duration-500">
    <button 
      onClick={() => onToggle(index)}
      className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors duration-300"
    >
      <span className="font-bold text-slate-200 text-lg">{faq.question}</span>
      {isOpen ? <ChevronUp className="text-violet-500" /> : <ChevronDown className="text-slate-500" />}
    </button>
    {isOpen && (
      <div className="p-6 pt-0 text-slate-400 border-t border-white/5 leading-relaxed">
        {faq.answer}
      </div>
    )}
  </div>
));

FAQItem.displayName = 'FAQItem';

// Hook customizado para lazy-load com Intersection Observer
const useLazyLoad = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.01, rootMargin: '50px' }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};
const LexOpsInsightFinal = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [currentView, setCurrentView] = useState('landing');
  const [logoLoadError, setLogoLoadError] = useState(false);
  
  // Remover skeleton assim que React renderizar
  useEffect(() => {
    const skeleton = document.getElementById('skeleton');
    if (skeleton) {
      skeleton.style.display = 'none';
    }
    document.documentElement.classList.add('hide-skeleton');
  }, []);
  
  // Lazy load de seções pesadas
  const [videoRef, videoVisible] = useLazyLoad();
  const [gatilhoRef, gatilhoVisible] = useLazyLoad();
  const [bentoRef, bentoVisible] = useLazyLoad();
  const [demoRef, demoVisible] = useLazyLoad();
  const [depoRef, depoVisible] = useLazyLoad();
  const [pricingRef, pricingVisible] = useLazyLoad();
  const [faqRef, faqVisible] = useLazyLoad();
  
  // Toggle FAQ com useCallback para melhor performance
  const toggleFAQ = useCallback((index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  }, [openFAQ]);
  
  // Detectar mobile
  const isMobile = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  }, []);

  // Memoized FAQData - evita recálculos desnecessários
  const faqData = useMemo(() => [
    { 
      question: 'Sou do RH / Financeiro / Logística. Posso usar?', 
      answer: "O LexOps não lê 'Leis', ele lê Lógica. Se a sua planilha tem colunas como 'Responsável', 'Valor', 'Status' ou 'Data', o sistema funciona. A inteligência é agnóstica: onde se lê 'Processo', leia-se 'Chamado' ou 'Pedido'. Você define a legenda." 
    },
    { 
      question: 'Meu Excel é uma bagunça exportada do sistema. Vai quebrar?', 
      answer: "O LexOps foi treinado no caos. Ele ignora células mescladas vazias, cabeçalhos duplos e formatações quebradas. Se houver dados, ele vai ler. Não precisamos que sua planilha seja bonita, apenas que ela exista." 
    },
    { 
      question: 'Preciso instalar algo no servidor da empresa?', 
      answer: "Absolutamente não. Se precisasse, custaria 50 mil reais. É um arquivo HTML inteligente. Você baixa, abre no seu navegador (Chrome/Edge) e arrasta a planilha. Tudo roda na memória do seu computador. Segurança total, nada sobe para nuvem." 
    },
    { 
      question: 'Tenho limite de clientes ou processos?', 
      answer: "Não. Enquanto sua assinatura estiver ativa, o processamento é ilimitado. Pode fazer dashboards para 1 cliente ou para 500. Pode processar 10 linhas ou 1 milhão. O limite é o seu hardware." 
    }
  ], []);

  if (currentView === 'login') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><p className="text-white">Carregando...</p></div>}>
        <LoginScreen onBack={() => setCurrentView('landing')} logoLoadError={logoLoadError} setLogoLoadError={setLogoLoadError} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-violet-500/30">
      
      {/* NAVBAR PREMIUM */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/95 border-b border-white/5 h-28 flex items-center md:backdrop-blur-sm transition-all duration-500">
        <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
          
          {/* LOGO AREA */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
            
            {!logoLoadError ? (
              <picture>
                <source srcSet="/logo-lexops.webp" type="image/webp" />
                <img 
                  src="/logo-lexops.jpg" 
                  alt="LexOps Insight" 
                  onError={() => setLogoLoadError(true)}
                  loading="eager"
                  fetchpriority="high"
                  decoding="sync"
                  className="h-28 w-auto object-contain transition-transform group-hover:scale-110"
                />
              </picture>
            ) : (
              <div className="transition-transform group-hover:scale-110">
                <ShieldCheck size={56} className="text-violet-500" />
              </div>
            )}
          </div>

          {/* BOTÃO LOGIN */}
          <button 
            onClick={() => window.location.href = 'https://app.lexopsinsight.com.br'}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 hover:border-violet-500/50 transition-all duration-300 text-sm font-medium text-slate-400 hover:text-white group"
          >
            <UserCircle size={18} className="group-hover:text-violet-400 transition-colors" />
            <span className="hidden sm:inline">Área do Cliente</span>
            <span className="sm:hidden">Entrar</span>
          </button>
        </div>
      </nav>

      {/* HEADER / HERO SECTION */}
      <header className="relative pt-40 pb-40 px-6 overflow-hidden bg-gradient-to-b from-violet-900/30 via-slate-900/20 to-slate-950">
        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-900/20 border border-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider md:backdrop-blur-sm transition-all duration-300 hover:border-violet-500/40 hover:bg-violet-900/30">
            <Zap size={14} className="fill-current" /> Nova Era da Advocacia
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight drop-shadow-2xl max-w-4xl mx-auto">
            Excel é o seu Banco de Dados. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              Não o seu Palco.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-loose">
            Sua planilha esconde as respostas que o seu cliente exige.
            Enquanto você perde horas limpando linhas, seu concorrente já decidiu.
            Transforme dados brutos em <span className="text-white font-bold">Autoridade Visual</span> agora.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 w-full max-w-2xl">
            <a href="https://chk.eduzz.com/39ZQXX2B9E" target="_blank" rel="noopener noreferrer" className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white font-bold rounded-xl text-lg shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] hover:shadow-[0_0_50px_-5px_rgba(124,58,237,0.6)] transition-all duration-500 hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto">
              COMEÇAR POR R$ 6,50/DIA
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <a href="https://chk.eduzz.com/KW8KPPER01" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-transparent border border-slate-700 hover:border-violet-500/70 text-slate-300 hover:text-white font-bold rounded-xl text-lg transition-all duration-500 flex items-center justify-center w-full sm:w-auto hover:bg-violet-950/30">
              QUERO ECONOMIA ANUAL
            </a>
          </div>

          <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            Processamento Seguro via Eduzz • Risco Zero por 7 Dias
          </p>
        </div>
      </header>

      {/* GATILHO TRABALHISTA - MOVIDO ANTES DO VIDEO */}
      <section ref={gatilhoRef} className="py-32 px-6 bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-slate-950 border-y border-white/5">
        {gatilhoVisible && (
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-10 max-w-3xl mx-auto leading-tight">
            Sua planilha diz quanto vale.<br />
            O LexOps diz o que fazer.
          </h2>
          
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950 p-10 rounded-3xl border border-rose-500/15 shadow-2xl text-left max-w-3xl mx-auto mb-8 relative overflow-hidden group hover:border-rose-500/30 hover:shadow-xl transition-all duration-500">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-500 to-rose-600 group-hover:shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-shadow duration-500"></div>
            <p className="text-xl text-slate-300 leading-relaxed">
              <span className="text-white font-bold block mb-4 text-2xl">Faça o teste agora:</span>
              Seu cliente sabe exatamente <span className="text-rose-400 font-semibold">quanto cada filial gera de passivo trabalhista?</span> 
              Quais são os maiores pedidos por unidade? 
              <br /><br />
              Já imaginou criar um gráfico com esses dados cruzados em segundos, sem tocar numa tabela dinâmica?
              <br /><br />
              No Excel, isso leva horas e gera dúvida. Com LexOps, isso é padrão. Você entrega a resposta, não a tabela.
            </p>
          </div>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Nós não validamos se o estagiário digitou certo. Nós garantimos que, se o dado existe, ele será visto e entendido.
          </p>
        </div>
        )}
      </section>

      {/* LEAD CAPTURE SECTION - MOVIDO AQUI ANTES DO VIDEO */}
      <section data-lead-capture className="py-32 px-6 bg-gradient-to-b from-violet-900/25 via-slate-900/10 to-slate-950 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
                <CheckCircle2 size={14} /> 100% Gratuito • Sem Cadastro
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 max-w-2xl leading-tight">
                7 Erros Fatais do Excel em Gestão de Casos Jurídicos
              </h2>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                Você está perdendo dinheiro <span className="text-emerald-400 font-bold">todos os dias</span> gerenciando casos em planilhas. 
              </p>
              <p className="text-base text-slate-400 mb-8">
                Este relatório revela os 7 erros mais comuns que custam horas de trabalho, aumentam riscos de compliance e afastam clientes premium.
              </p>
              <ul className="space-y-3 text-slate-300 mb-8">
                <li className="flex gap-3 items-start">
                  <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Diagnóstico real:</strong> Quanto você REALMENTE está perdendo por mês</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Checklists práticos:</strong> Que você pode começar a usar hoje</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Roadmap claro:</strong> Passo a passo para automatizar (sem Excel)</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Bônus:</strong> Consulta com especialista em Legal Ops (cortesia)</span>
                </li>
              </ul>
              <p className="text-sm text-emerald-300 italic border-l-2 border-emerald-500 pl-4">
                "Se você ainda usa Excel para gerenciar prazos, responsáveis ou valores, não pode perder este material."
              </p>
            </div>

            <div className="flex justify-center md:justify-end">
              <LeadCapture variant="default" />
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO SHOWCASE - MOVIDO PARA DEPOIS DO LEAD */}
      <section ref={videoRef} className="px-6 relative z-20 mb-32 pt-16 video-section" style={{ minHeight: videoVisible ? 'auto' : '600px' }}>
        {videoVisible && (
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-b from-slate-900/60 to-slate-950 md:backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:shadow-2xl relative group overflow-hidden ring-1 ring-white/5 hover:ring-white/10 hover:border-white/10 transition-all duration-500">
            <div className="absolute top-6 left-0 right-0 text-center z-10 pointer-events-none">
              <span className="bg-black/60 text-white px-4 py-1 rounded-full text-sm font-medium md:backdrop-blur-md border border-white/10 shadow-xl">
                De "entregador de planilha" a Consultor Premium em segundos
              </span>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden relative shadow-inner group-hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] transition-all duration-500 border border-white/5 bg-slate-900">
              <video 
                 className="w-full h-full object-cover"
                 controls 
                 muted 
                 loop 
                 playsInline
                 preload="auto"
                 poster="/logo-lexops.webp"
                 controlsList="nodownload"
               >
                 <source src="/demo.mp4" type="video/mp4" />
                 Seu navegador não suporta a tag de vídeo.
               </video>
               <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>
          <p className="text-center text-slate-500 mt-6 text-sm max-w-2xl mx-auto flex items-center justify-center gap-2">
            <MonitorPlay size={16} />
            Não é mágica, é lógica. O tempo que você gastaria montando isso no PowerBI pagaria 10 anos de assinatura.
          </p>
        </div>
        )}
      </section>

      {/* BENTO GRID */}
      <section ref={bentoRef} className="py-32 px-6 bg-gradient-to-b from-slate-950 via-slate-900/20 to-slate-950">
        {bentoVisible && (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl mx-auto leading-tight">Refino Lógico. Sem IA. Sem Alucinação.</h2>
            <p className="text-slate-400 text-lg">Algoritmos determinísticos que limpam a sujeira e entregam a verdade.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900/40 to-slate-950/60 p-10 rounded-3xl border border-white/5 hover:border-violet-500/30 transition-all duration-500 group hover:bg-slate-900/50">
              <LayoutDashboard className="text-violet-400 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-2xl font-bold text-white mb-2">Motor de Refino Jurídico</h3>
              <p className="text-slate-400">
                O sistema varre suas colunas, identifica a estrutura lógica (Autor, Réu, Valor, Vara), limpa a poluição visual e entrega a verdade matemática do processo. Não inventamos dados. Revelamos eles.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-900/40 to-slate-950/60 p-10 rounded-3xl border border-white/5 hover:border-violet-500/30 transition-all duration-500 group hover:bg-slate-900/50">
              <Lock className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">White-Label Total</h3>
              <p className="text-slate-400">
                O painel carrega a SUA logo, as SUAS cores. O cliente vai achar que você investiu R$ 50k em tecnologia própria.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-900/40 to-slate-950/60 p-10 rounded-3xl border border-white/5 hover:border-violet-500/30 transition-all duration-500 group hover:bg-slate-900/50">
              <Download className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Agnóstico a Sistemas</h3>
              <p className="text-slate-400">
                Astrea? CPJ? Protheus? Se tem linhas e colunas, nós lemos. O Excel é o suporte universal; nós somos o refino final.
              </p>
            </div>

            <div className="md:col-span-2 bg-gradient-to-br from-slate-900/40 to-slate-950/60 p-10 rounded-3xl border border-white/5 hover:border-violet-500/30 transition-all duration-500 group hover:bg-slate-900/50">
              <Zap className="text-amber-400 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Fábrica Ilimitada</h3>
              <p className="text-slate-400">
                Enquanto sua assinatura está ativa, processe dashboards para 1, 10 ou 500 clientes. Se cancelar, a fábrica para, mas os arquivos que você já baixou são seus para sempre.
              </p>
            </div>
          </div>
        </div>
        )}
      </section>

      {/* DEMO INTERATIVA */}
      <section ref={demoRef} className="py-32 px-6 bg-gradient-to-b from-violet-900/20 via-slate-900/10 to-slate-950 border-y border-violet-500/20">
        {demoVisible && (
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-sm font-bold mb-8 md:backdrop-blur-sm transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-500/20">
            <MonitorPlay size={16} /> TEST DRIVE
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 max-w-3xl mx-auto leading-tight">
            Veja uma decisão acontecendo
          </h2>
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-loose">
            Explore o dashboard interativo real. Clique nos gráficos, filtre por datas e veja a velocidade.
            Sem cadastro necessário.
          </p>
          
          <div className="relative group inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-60 transition duration-700 group-hover:duration-300"></div>
            <a href="/demo.html" target="_blank" rel="noopener noreferrer" className="relative px-10 py-5 bg-gradient-to-r from-slate-900 to-slate-950 ring-1 ring-white/10 rounded-xl leading-none flex items-center divide-x divide-slate-700 cursor-pointer hover:ring-white/20 transition-all duration-500 group-hover:from-slate-800 group-hover:to-slate-900 md:shadow-lg">
              <span className="flex items-center space-x-5">
                <span className="pr-6 text-slate-100 font-bold group-hover:text-white transition-colors duration-300">Abrir Simulador em Tela Cheia</span>
              </span>
              <span className="pl-6 text-violet-400 group-hover:text-violet-300 transition duration-500 group-hover:translate-x-1">
                Acessar &rarr;
              </span>
            </a>
          </div>
        </div>
        )}
      </section>

      {/* DEPOIMENTOS */}
      <section ref={depoRef} className="py-32 px-6 bg-gradient-to-b from-slate-950 via-slate-900/20 to-slate-950">
        {depoVisible && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-20 max-w-3xl mx-auto leading-tight">Quem parou de operar e começou a decidir</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            <div className="bg-gradient-to-br from-slate-900/40 to-slate-950/60 p-10 rounded-3xl border border-white/5 relative hover:border-violet-500/30 hover:bg-slate-900/50 transition-all duration-500">
              <div className="absolute -top-4 -left-4 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full p-3 shadow-lg shadow-violet-900/50">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <p className="text-slate-300 italic mb-8 leading-relaxed text-lg">
                "O Diretor de RH não sabia qual filial dava mais prejuízo. Joguei a planilha no LexOps e o gráfico de 'Passivo por Filial' apareceu na hora. Ele descobriu que 40% do prejuízo vinha de uma única unidade. Virei consultor fixo nessa reunião."
              </p>
              <div>
                <p className="text-white font-bold">Dr. Ricardo M.</p>
                <p className="text-slate-500 text-sm">Especialista em Direito do Trabalho</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900/40 to-slate-950/60 p-10 rounded-3xl border border-white/5 relative hover:border-violet-500/30 hover:bg-slate-900/50 transition-all duration-500">
              <p className="text-slate-300 italic mb-8 leading-relaxed text-lg">
                "O Jurídico sempre me mandava dados que não batiam com o contábil. Joguei a planilha deles no LexOps e o 'Deduplicador' achou 400 mil reais de erro em duplicidade. O sistema se pagou em 30 segundos."
              </p>
              <div>
                <p className="text-white font-bold">Roberto S.</p>
                <p className="text-slate-500 text-sm">Controller Industrial</p>
              </div>
            </div>

             <div className="bg-gradient-to-br from-slate-900/40 to-slate-950/60 p-10 rounded-3xl border border-white/5 relative hover:border-violet-500/30 hover:bg-slate-900/50 transition-all duration-500">
              <p className="text-slate-300 italic mb-8 leading-relaxed text-lg">
                "Meus clientes são acostumados com o 'padrão Faria Lima'. Eu mandava relatórios em PDF que ninguém lia. Na primeira reunião com o LexOps, projetei o painel na TV e a renovação do contrato nem foi discutida."
              </p>
              <div>
                <p className="text-white font-bold">Dra. Manuela C.</p>
                <p className="text-slate-500 text-sm">Sócia de Boutique Empresarial</p>
              </div>
            </div>

             <div className="bg-gradient-to-br from-slate-900/40 to-slate-950/60 p-10 rounded-3xl border border-white/5 relative hover:border-violet-500/30 hover:bg-slate-900/50 transition-all duration-500">
              <p className="text-slate-300 italic mb-8 leading-relaxed text-lg">
                "Eu perdia 2 dias montando o relatório mensal. Com o LexOps, fiz em 10 minutos. Fui elogiado pela 'visão estratégica' pela primeira vez."
              </p>
              <div>
                <p className="text-white font-bold">Felipe A.</p>
                <p className="text-slate-500 text-sm">Advogado Sênior</p>
              </div>
            </div>
          </div>
        </div>
        )}
      </section>

      {/* PRICING */}
      <section ref={pricingRef} id="pricing" className="py-32 px-6 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900/20 to-slate-950">
        {pricingVisible && (
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 max-w-3xl mx-auto leading-tight">Quanto custa a sua hora técnica?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-loose">
              Se você gasta mais de 15 minutos por mês "arrumando" planilha, você já está pagando pelo LexOps (e pagando caro), mas continua usando Excel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            
            <div className="p-10 rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/30 to-slate-950/60 hover:border-white/10 hover:bg-slate-900/40 transition-all duration-500 text-center group">
              <h3 className="text-xl font-bold text-slate-300 mb-2">Mensal</h3>
              <div className="text-4xl font-black text-white mb-2">R$ 197<span className="text-lg font-normal text-slate-500">/mês</span></div>
              <p className="text-slate-500 text-sm mb-6">Menos que 15 min da sua hora</p>
              
              <ul className="text-left space-y-4 mb-8 text-slate-300">
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-violet-500 shrink-0" /> Acesso Imediato</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-violet-500 shrink-0" /> Exportações Ilimitadas</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-violet-500 shrink-0" /> Cancele quando quiser</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-violet-500 shrink-0" /> Atualizações e melhorias inclusas</li>
              </ul>

              <a href="https://chk.eduzz.com/39ZQXX2B9E" target="_blank" rel="noopener noreferrer" className="block w-full py-4 rounded-xl border border-violet-500 text-violet-400 font-bold hover:bg-violet-500/20 hover:text-white transition-all duration-500 hover:scale-[1.02]">
                ASSINAR MENSAL
              </a>
            </div>

            <div className="relative p-10 rounded-3xl border border-violet-500/50 bg-gradient-to-br from-violet-950/60 to-slate-950 shadow-[0_0_60px_-15px_rgba(124,58,237,0.4)] hover:shadow-[0_0_80px_-10px_rgba(124,58,237,0.5)] transform md:scale-105 hover:border-violet-500 transition-all duration-500">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                Economia Inteligente
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Anual</h3>
                <div className="text-5xl font-black text-white mb-2">R$ 2.127<span className="text-lg font-normal text-slate-500">,60</span></div>
                <p className="text-emerald-400 font-bold text-sm mb-1">Equivale a R$ 5,80 por dia</p>
                <p className="text-slate-500 text-xs mb-6">Mais barato que estacionamento</p>
              </div>

              <ul className="text-left space-y-4 mb-8 text-slate-200">
                <li className="flex gap-3"><Gem size={18} className="text-emerald-400 shrink-0" /> <strong>Tudo do plano mensal</strong></li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> Pagamento Único (Desconto Real)</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> 4 Planilhas Otimizadas de Brinde</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> Atualizações e melhorias inclusas</li>
              </ul>

              <a href="https://chk.eduzz.com/KW8KPPER01" target="_blank" rel="noopener noreferrer" className="block w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-500 text-center shadow-lg shadow-violet-900/50 hover:shadow-violet-900/70">
                GARANTIR PLANO ANUAL
              </a>
              <p className="text-center text-slate-500 text-xs mt-4">Parcelamento disponível no cartão</p>
            </div>

          </div>
        </div>
        )}
      </section>

      {/* FAQ */}
      <section ref={faqRef} className="py-32 px-6 bg-gradient-to-b from-slate-950 via-slate-900/20 to-slate-950">
        {faqVisible && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center max-w-2xl mx-auto leading-tight">Manual Rápido (FAQ)</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} isOpen={openFAQ === index} onToggle={toggleFAQ} />
            ))}
          </div>
        </div>
        )}
      </section>

      {/* BRIDGE SECTION - PDF INTRODUCTION */}
      <section className="py-32 px-6 bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-slate-950 border-y border-emerald-500/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 max-w-3xl mx-auto leading-tight">
              Você está jogando dinheiro no lixo <span className="text-emerald-400">e nem sabe</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-loose">
              Não é dramatização. É matemática pura. Cada dia que passa com seus dados espalhados por planilhas é um dia de ineficiência que seu bolso está pagando.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/80 p-10 rounded-3xl border border-rose-600/30 shadow-xl shadow-rose-900/20 hover:border-rose-500/50 hover:shadow-rose-900/40 hover:bg-slate-900/60 transition-all duration-500 group cursor-pointer">
              <div className="flex items-start gap-6 mb-6">
                <div className="text-rose-400 font-black text-6xl leading-none shrink-0">①</div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-2xl mb-4 group-hover:text-rose-300 transition-colors">Seus dados estão soltos na rua</h3>
                  <p className="text-slate-300 text-base leading-relaxed">
                    Pasta aqui, planilha ali, arquivo naquele lugar. Ninguém sabe onde tá a verdade. E quando alguém precisa de um número? Copia-cola manual, planilha inteira se mexe e aí é que explode.
                  </p>
                </div>
              </div>
              <p className="text-emerald-400 text-sm font-bold tracking-wide">📌 Gestão sem Sistema Centralizado</p>
            </div>

            <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/80 p-10 rounded-3xl border border-rose-600/30 shadow-xl shadow-rose-900/20 hover:border-rose-500/50 hover:shadow-rose-900/40 hover:bg-slate-900/60 transition-all duration-500 group cursor-pointer">
              <div className="flex items-start gap-6 mb-6">
                <div className="text-rose-400 font-black text-6xl leading-none shrink-0">②</div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-2xl mb-4 group-hover:text-rose-300 transition-colors">Jurídico não fala com Financeiro</h3>
                  <p className="text-slate-300 text-base leading-relaxed">
                    Você tem um número, eles têm outro. Resultado? Reunião inteira é disputa de "qual número tá certo". Enquanto isso, o cliente assiste a novela da sua incompetência.
                  </p>
                </div>
              </div>
              <p className="text-emerald-400 text-sm font-bold tracking-wide">📌 Silos de Informação</p>
            </div>

            <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/80 p-10 rounded-3xl border border-rose-600/30 shadow-xl shadow-rose-900/20 hover:border-rose-500/50 hover:shadow-rose-900/40 hover:bg-slate-900/60 transition-all duration-500 group cursor-pointer">
              <div className="flex items-start gap-6 mb-6">
                <div className="text-rose-400 font-black text-6xl leading-none shrink-0">③</div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-2xl mb-4 group-hover:text-rose-300 transition-colors">Você está operando no escuro</h3>
                  <p className="text-slate-300 text-base leading-relaxed">
                    Precisa de um insight urgente? Boa sorte. Vai levar 2 dias pra montar um gráfico que qualquer dashboard faz em 5 segundos. Enquanto isso, a oportunidade passou.
                  </p>
                </div>
              </div>
              <p className="text-emerald-400 text-sm font-bold tracking-wide">📌 Cegueira Operacional</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 px-6 border-t border-white/10 text-center bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 max-w-3xl mx-auto leading-tight">A primeira decisão inteligente começa agora.</h2>
          <p className="text-xl text-slate-400 mb-10 leading-loose">Pare de justificar números no quadro branco. Comece a conduzir o show.</p>
          <a href="#pricing" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-slate-900 hover:bg-slate-200 font-bold rounded-xl text-xl transition-all duration-500 md:shadow-xl shadow-white/10 hover:shadow-white/20 hover:scale-105">
            QUERO MEU ACESSO AGORA <ArrowRight size={20} />
          </a>
        </div>

        <div className="flex justify-center gap-8 mb-14">
          <a 
            href="https://www.instagram.com/lexopsinsight?igsh=NHBzYXFmNmt3eDdz&utm_source=qr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-4 bg-slate-800 rounded-full hover:bg-pink-600 hover:text-white transition-all text-slate-400"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
          <a 
            href="https://www.facebook.com/people/LexOps-Insight/61587114226502/?mibextid=wwXIfr&rdid=otH2ioRmhScr20N8&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F17SBy4ptti%2F%3Fmibextid%3DwwXIfr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-4 bg-slate-800 rounded-full hover:bg-blue-600 hover:text-white transition-all text-slate-400"
            aria-label="Facebook"
          >
            <Facebook size={24} />
          </a>
        </div>
        
        <p className="text-slate-600 text-sm">
          © 2026 LexOpsInsight. Todos os direitos reservados. <br />
          Feito para a Elite Jurídica.
        </p>
      </footer>
    </div>
  );
};

export default LexOpsInsightFinal;