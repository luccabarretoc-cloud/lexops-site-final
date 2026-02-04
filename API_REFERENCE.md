# 📡 API REFERENCE - LEAD CAPTURE

## Base URL

```
/.netlify/functions/capture-lead
```

---

## POST /capture-lead

Captura email e envia PDF.

### Request

```http
POST /.netlify/functions/capture-lead HTTP/1.1
Content-Type: application/json

{
  "email": "usuario@exemplo.com"
}
```

### Parameters

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-----------|-----------|
| email | string | Sim | Email válido do usuário |

### Validações

- Email é obrigatório
- Deve ser email válido (conter @, domínio, extensão)
- Máximo 255 caracteres
- Sem espaços

### Response - Sucesso (Novo Lead)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Lead capturado com sucesso! E-mail enviado.",
  "success": true,
  "email": "usuario@exemplo.com"
}
```

### Response - Sucesso (Email Existente)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "E-mail já cadastrado",
  "exists": true
}
```

### Response - Erro: Email Inválido

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Email inválido."
}
```

### Response - Erro: Email Ausente

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Email inválido."
}
```

### Response - Erro: Método Não Permitido

```http
HTTP/1.1 405 Method Not Allowed
Content-Type: application/json

{
  "error": "Método não permitido. Use POST."
}
```

### Response - Erro: Servidor

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "Erro ao processar sua solicitação. Tente novamente.",
  "details": "Descrição técnica do erro"
}
```

---

## Exemplos de Uso

### JavaScript (Fetch)

```javascript
const email = 'usuario@exemplo.com';

const response = await fetch('/.netlify/functions/capture-lead', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email }),
});

const data = await response.json();

if (response.ok) {
  if (data.exists) {
    console.log('Email já cadastrado');
  } else {
    console.log('Email cadastrado com sucesso!');
  }
} else {
  console.error('Erro:', data.error);
}
```

### React (Componente)

```jsx
import { useState } from 'react';

export function MyComponent() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/.netlify/functions/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.exists ? 'Já cadastrado' : 'Sucesso!');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

### cURL

```bash
curl -X POST \
  'https://seu-dominio.com/.netlify/functions/capture-lead' \
  -H 'Content-Type: application/json' \
  -d '{"email":"usuario@exemplo.com"}'
```

### Python

```python
import requests
import json

url = 'https://seu-dominio.com/.netlify/functions/capture-lead'
data = {'email': 'usuario@exemplo.com'}

response = requests.post(url, json=data)
result = response.json()

print(f"Status: {response.status_code}")
print(f"Response: {result}")
```

### Node.js

```javascript
const https = require('https');

function captureEmail(email) {
  const data = JSON.stringify({ email });

  const options = {
    hostname: 'seu-dominio.com',
    port: 443,
    path: '/.netlify/functions/capture-lead',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  const req = https.request(options, (res) => {
    let response = '';

    res.on('data', (chunk) => {
      response += chunk;
    });

    res.on('end', () => {
      console.log(JSON.parse(response));
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
}

captureEmail('usuario@exemplo.com');
```

---

## Status Codes

| Code | Significado | Ação |
|------|-----------|------|
| 200 | OK | Email processado (novo ou existente) |
| 400 | Bad Request | Email inválido ou ausente |
| 405 | Method Not Allowed | Use POST em vez de GET/etc |
| 500 | Server Error | Problema no servidor (Supabase/Resend) |

---

## Fluxo de Dados

```
Usuário
   ↓
   POST /capture-lead
   ├─ { email: 'user@example.com' }
   ↓
Netlify Function
   ├─ Valida email
   ├─ Verifica Supabase
   │  ├─ Se existe: retorna 200 {exists: true}
   │  └─ Se novo:
   │     ├─ Insere no Supabase
   │     ├─ Envia via Resend
   │     └─ Retorna 200 {success: true}
   ↓
Supabase (Armazena)
   └─ Tabela: leads
      ├─ email
      ├─ source: 'landing_pdf'
      ├─ created_at
      └─ updated_at

Resend (Envia Email)
   └─ Para: user@example.com
      ├─ Assunto: Seu PDF Chegou!
      └─ Link: seu-site.com/7-erros.pdf
```

---

## Rate Limiting

Atualmente **NÃO há** rate limiting implementado.

Para ativar (opcional):

```javascript
// Adicione em capture-lead.js
const rateLimit = {};

function checkRateLimit(clientIP) {
  const now = Date.now();
  const limit = 5; // máximo 5 emails/min
  const window = 60000; // por minuto

  if (!rateLimit[clientIP]) {
    rateLimit[clientIP] = [];
  }

  // Limpar entradas antigas
  rateLimit[clientIP] = rateLimit[clientIP].filter(
    (time) => now - time < window
  );

  if (rateLimit[clientIP].length >= limit) {
    return false; // Excedeu limite
  }

  rateLimit[clientIP].push(now);
  return true; // OK
}
```

---

## Segurança & Boas Práticas

### ✅ Fazer

- Usar HTTPS sempre
- Validar email no frontend E backend
- Usar variáveis de ambiente para credenciais
- Implementar rate limiting
- Logar tentativas suspeitas
- Usar CORS adequado

### ❌ Não Fazer

- Expor API Keys no código
- Confiar apenas em validação frontend
- Aceitar emails não validados
- Ignorar erros de conexão
- Armazenar emails em plain text
- Usar HTTP em produção

---

## Monitoramento

### Logs

```bash
# Ver todos os erros
netlify logs:functions --tail

# Filtrar por tipo
netlify logs:functions --tail | grep "error"

# Último 50 linhas
netlify logs:functions --tail | tail -50
```

### Métricas

Não há métricas built-in, mas você pode adicionar:

```javascript
// Adicione ao capture-lead.js para monitorar
console.log({
  timestamp: new Date().toISOString(),
  email_received: !!email,
  email_valid: email_is_valid,
  email_exists: !!existingLead,
  email_sent: !!emailData,
  status: response.statusCode,
  error: error?.message || null,
});
```

---

## Integração com Terceiros

### Pipedrive CRM

```javascript
// Adicione em capture-lead.js
await axios.post('https://api.pipedrive.com/v1/persons', {
  name: email,
  email: [{ value: email, primary: true }],
  org_id: 123,
  add_time: new Date(),
}, {
  params: { api_token: process.env.PIPEDRIVE_API_KEY }
});
```

### RD Station

```javascript
// Adicione em capture-lead.js
await axios.post('https://api.rd.services/platform/contacts', {
  email: email,
  lifecycle_stage: 'lead',
  conversion_identifier: { value: 'landing_pdf', type: 'name' },
}, {
  headers: {
    'Authorization': `Bearer ${process.env.RD_STATION_TOKEN}`
  }
});
```

---

## Webhook (Notificar Sistema Externo)

```javascript
// Adicione em capture-lead.js
if (newLead) {
  await fetch(process.env.WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'lead_captured',
      email: email,
      source: 'landing_pdf',
      timestamp: new Date().toISOString(),
    }),
  });
}
```

---

## FAQ API

**P: Posso chamar a função do lado do cliente?**  
R: Sim, via fetch/axios. As credenciais estão seguras no backend.

**P: Qual é o limite de requisições?**  
R: Netlify oferece 125k/mês no free tier.

**P: Posso usar GraphQL?**  
R: Não, é uma REST API simples.

**P: Como escalar para milhões de emails?**  
R: Use Resend Enterprise e aumente limites no Supabase.

**P: Preciso fazer auth/token?**  
R: Não, a segurança vem do backend com Service Role Key.

---

**Documentação Oficial:**
- Netlify Functions: https://docs.netlify.com/functions/overview
- Supabase JS: https://supabase.com/docs/reference/javascript
- Resend: https://resend.com/docs

