# 🐛 GUIA DE TROUBLESHOOTING - LEAD CAPTURE SYSTEM

## Sumário Rápido

| Erro | Causa | Solução | Referência |
|------|-------|--------|-----------|
| 405 Method Not Allowed | POST não está sendo aceito | Verifique evento httpMethod | #erro-1 |
| 400 Email inválido | Formato de email ruim | Valide regex do email | #erro-2 |
| 500 Erro Supabase | Credenciais erradas | Verifique URL e Key | #erro-3 |
| 500 Erro Resend | API Key inválida | Copie novamente do Resend | #erro-4 |
| Email não chega | DNS não verificado | Configure CNAME no Resend | #erro-5 |
| Email vai para spam | Sem SPF/DKIM | Use domínio próprio | #erro-6 |
| "Já cadastrado" | Email duplicado | Normal! Significa que funciona | #erro-7 |

---

## 🔴 ERRO 1: 405 Method Not Allowed {#erro-1}

**Sintoma:**
```json
{
  "statusCode": 405,
  "body": "Método não permitido. Use POST."
}
```

**Causas Possíveis:**
1. Enviando GET em vez de POST
2. Formulário com action errada
3. Método não configurado

**Solução:**

✅ Verifique no componente:
```jsx
// Correto: fetch com method POST
const response = await fetch('/.netlify/functions/capture-lead', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email }),
});
```

✅ Verifique na função:
```javascript
if (event.httpMethod !== 'POST') {
  return { statusCode: 405, body: JSON.stringify({ error: '...' }) };
}
```

---

## 🔴 ERRO 2: Email Inválido {#erro-2}

**Sintoma:**
```json
{
  "statusCode": 400,
  "body": "Email inválido."
}
```

**Causas Possíveis:**
1. Email sem @
2. Sem domínio
3. Caracteres especiais
4. Espaços

**Solução:**

✅ Teste emails válidos:
```
✅ usuario@exemplo.com
✅ teste+tag@dominio.co.uk
❌ usuarioexemplo.com (sem @)
❌ usuario@.com (sem domínio)
❌ usuario @exemplo.com (espaço)
```

✅ Regex usado (capture-lead.js):
```javascript
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

**Se um email válido ainda falha:**
1. Copie o email exato que está falhando
2. Verifique espaços em branco no início/fim
3. Teste outro email similar

---

## 🔴 ERRO 3: 500 - Erro Supabase {#erro-3}

**Sintoma:**
```
500 Internal Server Error
Erro ao verificar email: ...
```

**Causas Possíveis:**
1. `SUPABASE_URL` incorreta
2. `SUPABASE_SERVICE_ROLE_KEY` incorreta
3. Tabela 'leads' não existe
4. RLS bloqueando SERVICE_ROLE

**Solução:**

### Passo 1: Verificar Variáveis

```bash
# Cheque .env.local localmente
cat .env.local

# Deve ter:
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs... (longo)
```

### Passo 2: Verificar URL

```bash
# A URL deve ter exatamente este formato:
https://XXXXX.supabase.co

# Não pode ter:
https://XXXXX.supabase.co/ (barra no final)
https://api.XXXXX.supabase.co (com "api." no meio)
http:// (sem s)
```

### Passo 3: Verificar Key

```bash
# Deve ser a SERVICE ROLE KEY, não:
- Anon Key (pública)
- JWT Secret (interno)
- API Key (admin)
```

**Para obter certo:**
1. Supabase → Settings → API
2. Em "Project API keys" → Role: "Service role (secret)"
3. Copie o campo "Secret"
4. Cole em SUPABASE_SERVICE_ROLE_KEY

### Passo 4: Verificar Tabela

```bash
# No Supabase SQL Editor, execute:
SELECT * FROM leads LIMIT 1;

# Se retornar erro "table does not exist", execute:
# Copie todo o conteúdo de:
# netlify/functions/migrations/001_create_leads_table.sql
```

### Passo 5: Ver Logs Detalhados

```bash
# Para deploy local
npm run dev
# Veja console do terminal

# Para deploy em produção
netlify logs:functions --tail

# Procure por mensagens de erro específicas
```

---

## 🔴 ERRO 4: Erro ao Enviar Email (Resend) {#erro-4}

**Sintoma:**
```
500 Internal Server Error
Erro ao enviar email: ...
```

**Causas Possíveis:**
1. `RESEND_API_KEY` inválida
2. Domínio não verificado no Resend
3. Email FROM inválido
4. Limite de emails excedido

**Solução:**

### Passo 1: Verificar API Key

```bash
# Deve começar com "re_"
# Exemplo: re_1234567890abcdef

# Verificar em:
# https://resend.com/api-keys

# Se perdeu:
# 1. Vá em https://resend.com/api-keys
# 2. Delete a key antiga
# 3. Crie nova
# 4. Cole em RESEND_API_KEY
```

### Passo 2: Verificar Domínio

Se usa domínio customizado (recomendado):

```bash
# No Resend → Domains
# Seu domínio está com status "Verified" (verde)?

# Se não:
# 1. Adicionar registros DNS em seu provedor
# 2. Aguardar validação (até 1 hora)
# 3. Clicar "Verify" novamente
```

Se usa domínio padrão:
```javascript
// Use:
from: 'LexOps Insight <onboarding@resend.dev>'
```

### Passo 3: Verificar Limite

```bash
# Resend Free = 100 emails/dia
# Se atingiu limite, upgrade para:
# https://resend.com/pricing
```

### Passo 4: Testar Diretamente

```javascript
// No seu terminal Node.js:
const { Resend } = require('resend');
const resend = new Resend('sua_api_key');

resend.emails.send({
  from: 'teste@seu-dominio.com',
  to: 'seu-email@teste.com',
  subject: 'Teste',
  html: '<p>Teste</p>'
}).then(r => console.log(r))
  .catch(e => console.error(e));
```

---

## 🔴 ERRO 5: Email Não Chega {#erro-5}

**Sintoma:**
- Email não aparece em nenhuma pasta
- Nenhum de-bounce message

**Causas Possíveis:**
1. Domínio não verificado no Resend
2. Registros DNS incorretos
3. Email foi para spam

**Solução:**

### Verificar Entrega no Resend

```bash
# No Resend Dashboard:
# 1. Vá em "Emails"
# 2. Procure o email
# 3. Veja status:
#    ✅ Delivered = Enviado com sucesso
#    ❌ Bounced = Retornou
#    ? Queued = Ainda tentando
```

### Se Status é "Bounced"

```bash
# Causas comuns:
# 1. Email inválido (verifique spelling)
# 2. Domínio não verificado (veja erro-6)
# 3. Email foi para spam (check lá)
```

### Se Status é "Delivered" mas Não Recebeu

```bash
# Checklist:
# ✅ Verificar caixa de entrada
# ✅ Verificar pasta de spam
# ✅ Verificar pasta de promocional (Gmail)
# ✅ Verificar updates (Gmail)
# ✅ Verificar filtros do email
# ✅ Verificar se filtrou como spam localmente
```

### Se Status é "Queued"

```bash
# Aguarde um pouco e recarregue
# Se ficar "queued" por mais de 5 min:
# 1. Verifique logs: netlify logs:functions --tail
# 2. Verifique Resend status: https://status.resend.com
```

---

## 🔴 ERRO 6: Email Vai para Spam {#erro-6}

**Sintoma:**
- Email chega mas na pasta de Spam/Junk

**Causas Possíveis:**
1. Domínio não tem SPF/DKIM
2. Usando domínio padrão Resend
3. Conteúdo parece spam
4. Falta DMARC

**Solução:**

### Usar Domínio Próprio (IMPORTANTE!)

❌ **Ruim:**
```javascript
from: 'LexOps Insight <onboarding@resend.dev>'
// Vai para spam em muitos casos
```

✅ **Bom:**
```javascript
from: 'LexOps Insight <noreply@lexopsinsight.com.br>'
// Muito melhor entregabilidade
```

### Configurar SPF/DKIM/DMARC

Resend fornece registros na seção Domains:

1. **CNAME:** Para DKIM
2. **MX:** Para receber replies
3. **TXT:** Para SPF

Verifique em **RESEND_SETUP.md** para instruções detalhadas.

### Verificar Conteúdo do Email

Evite em templates:
- ❌ "Clique aqui NOW"
- ❌ "OFERTA LIMITADA"
- ❌ Muitos emojis
- ❌ Links suspeitos
- ❌ Uppercase excessivo

Use:
- ✅ Linguagem normal
- ✅ Links legítimos
- ✅ Design profissional
- ✅ Branding claro

---

## 🟡 ERRO 7: "E-mail Já Cadastrado" {#erro-7}

**Sintoma:**
```json
{
  "message": "E-mail já cadastrado",
  "exists": true
}
```

**Isto é ESPERADO!** ✅

Significa que:
1. Sistema está funcionando
2. Email não é duplicado no banco
3. Segurança against spam/abuse está OK

**Para Testar Novamente:**

Use um email diferente:
```
usuario1@test.com ✓
usuario2@test.com ✓
usuario3@test.com ✓
usuario1@test.com ✗ (duplicado)
```

**Se Quer Resetar:**

```sql
-- No Supabase SQL Editor:
-- ⚠️ CUIDADO: Isto deleta dados!
DELETE FROM leads WHERE email = 'seu@email.com';

-- Ou resetar tabela inteira:
DELETE FROM leads;
```

---

## 🟠 ERRO 8: Erro ao Validar Componente {#erro-8}

**Sintoma:**
```
Cannot find module 'lucide-react'
```

**Solução:**
```bash
npm install lucide-react
```

**Se já tem instalado:**
```bash
npm ls lucide-react
# Deve mostrar versão
```

---

## 🟠 ERRO 9: Variáveis Não Carregam {#erro-9}

**Sintoma:**
- `process.env.SUPABASE_URL` é undefined
- Mesmo depois de adicionar em `.env.local`

**Solução:**

### Local (npm run dev)
1. Verificar se `.env.local` existe
2. Reiniciar dev server: Ctrl+C e `npm run dev`
3. Verificar se arquivo tem exatamente:
   ```
   SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   RESEND_API_KEY=...
   ```

### Produção (Netlify)
1. Ir em Site settings → Environment
2. Adicionar as 3 variáveis
3. Fazer redeploy manual
4. Aguardar 30 segundos
5. Testar de novo

---

## 🟠 ERRO 10: Componente Não Aparece {#erro-10}

**Sintoma:**
- Formulário não aparece na página
- Nenhuma mensagem de erro

**Solução:**

### Verificar Import

Em `src/App.jsx`, linha 10:
```javascript
import LeadCapture from './components/LeadCapture';
```

Se faltar, adicione.

### Verificar Componente no JSX

Procure por:
```jsx
<LeadCapture variant="default" />
```

Se não encontrar, adicione em alguma seção.

### Verificar se Arquivo Existe

```bash
ls -la src/components/LeadCapture.jsx
# Deve existir

# Se não existir, crie:
# Copie o conteúdo de LeadCapture.jsx
```

### Verificar Erros no Console

```bash
# F12 → Console
# Procure por erros vermelhos
# Pode indicar problema de import
```

---

## 📞 QUANDO PEDIR AJUDA

Se nenhuma solução acima funcionou, reúna:

1. **Mensagem de erro exata** (copie tudo)
2. **Logs da função:**
   ```bash
   netlify logs:functions --tail
   ```
3. **Seu arquivo .env.local** (sem colar valores!)
4. **Versão do Node:**
   ```bash
   node --version
   ```
5. **Como reproduzir** (passo a passo)

---

## 🔗 Recursos Adicionais

- **Supabase Status:** https://status.supabase.com
- **Resend Status:** https://status.resend.com
- **Netlify Status:** https://www.netlify.com/status/

---

**Lembre-se:** Verifique logs primeiro! 90% dos problemas têm resposta lá. 📋

```bash
netlify logs:functions --tail
```

