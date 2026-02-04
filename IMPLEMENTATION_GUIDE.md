# 🎯 Sistema de Captura de Leads - Guia Completo de Implementação

## 📦 O que foi criado?

Você agora tem um sistema completo de captura de leads com:

```
netlify/
├── functions/
│   ├── capture-lead.js          ← Netlify Function (backend)
│   └── migrations/
│       └── 001_create_leads_table.sql  ← Script SQL
│
src/
├── components/
│   └── LeadCapture.jsx          ← Componente React
│
App.jsx                           ← Integração + seção nova
LEAD_CAPTURE_SETUP.md            ← Setup detalhado
.env.example                      ← Template de variáveis
```

## 🚀 Passo a Passo para Colocar em Produção

### PASSO 1: Configurar Supabase

1. Acesse seu projeto no Supabase: https://app.supabase.com
2. Vá para **SQL Editor** e crie uma nova query
3. Cole o conteúdo de `netlify/functions/migrations/001_create_leads_table.sql`
4. Execute e confirme que a tabela foi criada

### PASSO 2: Obter Credenciais Supabase

1. Vá para **Settings → API**
2. Copie:
   - **Project URL** → `SUPABASE_URL`
   - **Service Role (Secret)** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ NUNCA compartilhe)

### PASSO 3: Configurar Resend

1. Acesse https://resend.com
2. Se não tiver conta, crie uma (gratuita)
3. Verifique seu domínio (`lexopsinsight.com.br`) ou use domínio padrão
4. Vá para **API Keys** e copie sua API Key → `RESEND_API_KEY`

### PASSO 4: Configurar Variáveis Localmente

Crie arquivo `.env.local`:

```bash
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=seu_service_role_key
RESEND_API_KEY=sua_resend_api_key
```

### PASSO 5: Configurar no Netlify

1. Acesse seu site no Netlify
2. **Site settings → Environment → New variable**
3. Adicione as 3 variáveis acima
4. Faça deploy:

```bash
git add -A
git commit -m "Add lead capture system"
git push
```

## 🎨 Como Usar o Componente (Exemplos)

### Exemplo 1: Na Landing Page (Já Integrado)
Já adicionamos uma seção completa antes do footer com:
- Título e descrição
- Lista de benefícios
- Componente LeadCapture em tamanho grande

**Localização:** `src/App.jsx` - Seção "LEAD CAPTURE SECTION"

### Exemplo 2: Adicionar em Outro Lugar (Inline)

```jsx
import LeadCapture from './components/LeadCapture';

export function MyComponent() {
  return (
    <div>
      <h2>Quer receber nossos insights?</h2>
      <LeadCapture variant="inline" />
    </div>
  );
}
```

### Exemplo 3: Modal/Dialog

```jsx
import LeadCapture from './components/LeadCapture';
import { useState } from 'react';

export function MyPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Baixar Guia Gratuito
      </button>
      
      {showModal && (
        <dialog>
          <LeadCapture variant="default" />
          <button onClick={() => setShowModal(false)}>Fechar</button>
        </dialog>
      )}
    </>
  );
}
```

## 📊 Como Ver os Leads Capturados?

No Supabase:

1. Acesse seu projeto
2. **Table Editor**
3. Clique em **leads**
4. Veja todos os emails capturados com data e source

## 🔧 Customizações Comuns

### Mudar o Texto do Botão

Em `src/components/LeadCapture.jsx`, procure por:

```jsx
Receber PDF Agora
```

E mude para o que quiser.

### Mudar o Email Enviado

Em `netlify/functions/capture-lead.js`, procure por:

```javascript
html: `
  <!DOCTYPE html>
  ...seu HTML aqui...
`
```

Customize o design, cores, texto e links.

### Adicionar Validação Customizada

No componente LeadCapture.jsx:

```jsx
// Adicione após validar email
if (email.includes('tempmail.com')) {
  setStatus('error');
  setMessage('Por favor, use um email corporativo.');
  return;
}
```

### Redirecionar Para Página Específica

```jsx
if (response.ok && !data.exists) {
  // Redirecionar após sucesso
  setTimeout(() => {
    window.location.href = '/obrigado';
  }, 1500);
}
```

## 🔒 Segurança - Checklist

- ✅ Variáveis de ambiente nunca expostas no código
- ✅ Service Role Key usada apenas no backend (Netlify Function)
- ✅ Validação de email no frontend E backend
- ✅ RLS (Row Level Security) ativado no Supabase
- ✅ Política: Apenas SERVICE_ROLE pode inserir

**⚠️ IMPORTANTE:** Nunca faça git commit com `.env.local`. Está no `.gitignore`? Confira!

```bash
git status
# Não deve mostrar .env.local
```

## 📈 Próximas Etapas (Opcional)

### Analytics
Adicione campos ao Supabase:

```sql
ALTER TABLE leads ADD COLUMN country VARCHAR(2);
ALTER TABLE leads ADD COLUMN utm_source VARCHAR(100);
ALTER TABLE leads ADD COLUMN utm_campaign VARCHAR(100);
```

Depois capture no componente e envie via função.

### Double Opt-in
Envie email de confirmação antes de contar como lead:

```sql
ALTER TABLE leads ADD COLUMN verified BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN verification_token UUID;
```

### Integrações CRM
Adicione ao `capture-lead.js`:

```javascript
// Enviar para Pipedrive, RD Station, etc
await axios.post('https://api.suacrm.com/contacts', {
  email,
  source: 'landing_pdf'
});
```

## 🐛 Troubleshooting

| Erro | Solução |
|------|---------|
| "401 Unauthorized" | Verifique `SUPABASE_SERVICE_ROLE_KEY` |
| "Email inválido" | Componente valida regex. Tente outro email |
| "Erro 500 backend" | Verifique logs: `netlify logs:functions` |
| "Email não recebe" | Verifique spam e configure domínio no Resend |
| "Email já cadastrado" OK | Isso é esperado! Mensagem amigável aparece |

## 📞 Suporte Rápido

**Supabase:** https://discord.supabase.com
**Resend:** https://resend.com/support
**Netlify:** https://www.netlify.com/support

---

## ✅ Checklist Final

- [ ] Tabela criada no Supabase
- [ ] Variáveis de ambiente configuradas localmente
- [ ] Variáveis enviadas para Netlify
- [ ] Função testada em desenvolvimento
- [ ] Componente aparece na landing page
- [ ] Email de teste enviado com sucesso
- [ ] Design customizado
- [ ] Deploy em produção realizado

**Parabéns! 🎉 Seu sistema de leads está pronto!**
