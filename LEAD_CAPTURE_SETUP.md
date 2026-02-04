# Configuração: Sistema de Captura de Leads com PDF

## 📋 O que foi criado?

1. **Netlify Function** (`netlify/functions/capture-lead.js`)
   - Recebe emails via POST
   - Verifica duplicidade no Supabase
   - Insere novo lead na tabela 'leads'
   - Envia email com link para PDF via Resend

2. **Componente React** (`src/components/LeadCapture.jsx`)
   - Duas variantes: `default` (modal) e `inline` (compacto)
   - Tratamento de erros e loading states
   - Feedback visual ao usuário

## 🔧 Setup Necessário

### 1. Supabase - Criar Tabela de Leads

Execute esta query no SQL Editor do Supabase:

```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  source VARCHAR(50) DEFAULT 'landing_pdf',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índice para buscas rápidas
CREATE INDEX idx_leads_email ON leads(email);
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Preencha com suas credenciais:

**Do Supabase:**
- `SUPABASE_URL` - URL do projeto (Settings → API)
- `SUPABASE_SERVICE_ROLE_KEY` - Service Role Key (Settings → API, role: Service Role)

**Do Resend:**
- `RESEND_API_KEY` - API Key do Resend (https://resend.com/api-keys)

### 3. Deploy no Netlify

1. Configure as variáveis de ambiente no Netlify:
   - Site settings → Environment → New variable
   - Adicione: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`

2. Deploy:
   ```bash
   npm run build
   # ou
   netlify deploy --prod
   ```

## 🎨 Como Usar o Componente

### Variante Inline (Compacta)
```jsx
import LeadCapture from './components/LeadCapture';

// Em uma seção da sua landing page
<LeadCapture variant="inline" />
```

### Variante Default (Modal/Destaque)
```jsx
import LeadCapture from './components/LeadCapture';

// Para destacar a captura de leads
<LeadCapture variant="default" />
```

## 📧 Customizar Email

O email é enviado em HTML no arquivo `netlify/functions/capture-lead.js`.

Para alterar:
1. O **remetente**: Mude `from: 'LexOps Insight <no-reply@lexopsinsight.com.br>'`
2. O **assunto**: Mude `subject: 'Seu PDF Chegou! 🎉'`
3. O **conteúdo HTML**: Edite a string `html: \`...\``
4. O **link do PDF**: Altere a URL em `href="https://www.lexopsinsight.com.br/..."`

## 🔒 Segurança

- ✅ Service Role Key (Supabase) - dados sensíveis apenas no backend
- ✅ API Key (Resend) - protegida nas variáveis de ambiente do Netlify
- ✅ Validação de email no frontend e backend
- ✅ Rate limiting recomendado no Netlify

## 🚀 Melhorias Futuras (Opcional)

- [ ] Rate limiting por IP
- [ ] Double opt-in (confirmação de email)
- [ ] Webhook para integrar com CRM
- [ ] Analytics de conversão
- [ ] A/B testing de subject lines

## 🐛 Troubleshooting

**"Erro 500 ao enviar email"**
- Verifique se `RESEND_API_KEY` está correto
- Confira se o domínio no `from:` está verificado no Resend

**"Email já cadastrado" mas usuário não recebe email**
- Verifique logs do Netlify: `netlify logs:functions`
- Confira spam/promotions no email

**"Erro de conexão com Supabase"**
- Confirme `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
- Verifique se a tabela 'leads' existe

## 📞 Endpoints da Função

```
POST /.netlify/functions/capture-lead

Body:
{
  "email": "usuario@exemplo.com"
}

Response Success:
{
  "message": "Lead capturado com sucesso! E-mail enviado.",
  "success": true,
  "email": "usuario@exemplo.com"
}

Response Existe:
{
  "message": "E-mail já cadastrado",
  "exists": true
}
```

---

**Tudo pronto! 🎉** Agora você pode capturar leads e enviar PDFs automaticamente.
