# 🔧 MAINTENANCE & OPERAÇÕES

## Desativar Temporariamente

Se precisar desativar a captura de leads temporariamente:

### Opção 1: Comentar Componente (Rápido)

Em `src/App.jsx`, procure por:

```jsx
{/* LEAD CAPTURE SECTION */}
<section className="py-20 px-6 bg-gradient-to-b from-violet-900/20 to-transparent border-t border-white/5">
```

Comente o bloco:

```jsx
{/* LEAD CAPTURE SECTION */}
{/*
<section className="py-20 px-6 bg-gradient-to-b from-violet-900/20 to-transparent border-t border-white/5">
  ... conteúdo ...
</section>
*/}
```

### Opção 2: Feature Flag (Recomendado)

```jsx
const ENABLE_LEAD_CAPTURE = process.env.REACT_APP_ENABLE_LEAD_CAPTURE === 'true';

return (
  <div>
    {ENABLE_LEAD_CAPTURE && (
      <section className="py-20 px-6 ...">
        {/* LEAD CAPTURE SECTION */}
      </section>
    )}
  </div>
);
```

Depois adicione no `.env.local`:
```
REACT_APP_ENABLE_LEAD_CAPTURE=false
```

### Opção 3: Desativar Função no Netlify

Se quiser que a função retorne erro:

```javascript
// No início de capture-lead.js
if (process.env.MAINTENANCE_MODE === 'true') {
  return {
    statusCode: 503,
    body: JSON.stringify({ error: 'Sistema em manutenção. Tente novamente em breve.' }),
  };
}
```

Depois adicione no Netlify UI:
```
MAINTENANCE_MODE=true
```

---

## Pausar Envio de Emails

Se quiser parar de enviar emails:

### Opção 1: Usar Flag

```javascript
// Em capture-lead.js
if (process.env.SEND_EMAILS === 'false') {
  console.log('Emails desativados (flag)');
  // Não envia email, mas registra no BD
} else {
  // Envia email normalmente
  await resend.emails.send({ ... });
}
```

### Opção 2: Pausar no Resend

No dashboard do Resend:
1. API Keys
2. Desabilite ou delete sua API Key
3. Função retornará erro, mas lead será registrado

---

## Pausar Captura

Se não quiser mais registrar leads:

```javascript
// Em capture-lead.js, no início da função
if (process.env.STOP_CAPTURE === 'true') {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Captura de leads encerrada.',
      stopped: true
    }),
  };
}
```

---

## Limpar Dados

### Deletar Todos os Leads

⚠️ **CUIDADO - Isto é IRREVERSÍVEL**

No Supabase SQL Editor:

```sql
DELETE FROM leads;
-- Isso deleta TODOS os leads

-- Depois resete o contador de IDs:
ALTER SEQUENCE leads_id_seq RESTART WITH 1;
```

### Deletar Email Específico

```sql
DELETE FROM leads WHERE email = 'usuario@exemplo.com';
```

### Backup Antes de Deletar

```sql
-- Criar cópia de segurança
CREATE TABLE leads_backup AS SELECT * FROM leads;

-- Depois pode deletar com segurança
DELETE FROM leads;
```

---

## Monitoramento Regular

### Verificar Saúde da Função

```bash
# Diário
netlify logs:functions --tail

# Ver últimas 100 linhas
netlify logs:functions --since 1h
```

### Métricas para Acompanhar

```sql
-- Total de leads
SELECT COUNT(*) FROM leads;

-- Leads por dia
SELECT DATE(created_at), COUNT(*) 
FROM leads 
GROUP BY DATE(created_at);

-- Email mais comum (para verificar spam)
SELECT email, COUNT(*) 
FROM leads 
GROUP BY email 
HAVING COUNT(*) > 1;
```

### Taxa de Entrega

No Resend Dashboard:
- Verifique "Delivered" vs "Bounced"
- Ideal: >95% delivery

---

## Atualizar Código

### Atualizar Email Template

1. Editar `netlify/functions/capture-lead.js`
2. Procurar por: `html: \``
3. Modificar HTML
4. Testar localmente
5. Deploy

### Atualizar Componente

1. Editar `src/components/LeadCapture.jsx`
2. Testar localmente
3. Deploy

### Atualizar App.jsx

1. Editar `src/App.jsx`
2. Testar localmente
3. Deploy

---

## Escalar para Mais Usuários

### Se Atingir Limite Resend (100/dia)

1. Ir em Resend → Billing
2. Upgrade para plano pago ($20/mês)
3. Agora tem limite ilimitado

### Se Performance Cair

1. Adicionar índices no Supabase:
   ```sql
   CREATE INDEX idx_leads_email_quick ON leads(email);
   ```

2. Adicionar paginação na query:
   ```sql
   SELECT * FROM leads ORDER BY created_at DESC LIMIT 100;
   ```

### Se Supabase Ficar Lento

1. Aumentar storage: Supabase → Settings → Billing
2. Usar cache: Redis (Upstash)
3. Fazer archiving de leads antigos

---

## Rotina de Manutenção

### Semanal

```bash
# Verificar logs
netlify logs:functions --since 7d | grep error

# Verificar métrica no Supabase
SELECT COUNT(*) as total_leads FROM leads;

# Verificar entregabilidade no Resend
# (acessar dashboard manualmente)
```

### Mensal

```bash
# Fazer backup
CREATE TABLE leads_backup_2026_02 AS SELECT * FROM leads;

# Limpar emails inválidos (bounced)
-- Sincronizar com Resend para ver bounces
-- Remover emails que sempre retornam erro

# Verificar custos
# Supabase: Settings → Usage
# Resend: Dashboard → Usage
# Netlify: Team → Usage
```

### Trimestral

```bash
# Revisar e otimizar
# 1. Analisar performance
# 2. Atualizar design se necessário
# 3. Ajustar cópia
# 4. Testar em mobile novamente

# Fazer análise de conversão
# Leads capturados vs leads que abrem email
# vs leads que clicam no PDF
```

---

## Troubleshooting Operacional

### Emails não são mais entregues

```bash
# 1. Verifique se API Key do Resend expirou
# 2. Verifique logs: netlify logs:functions --tail
# 3. Verifique Resend status: https://status.resend.com
# 4. Verifique limite diário (100/dia no free tier)
```

### Função muito lenta

```bash
# 1. Verificar logs para ver gargalo
# 2. Se Supabase: adicionar índices
# 3. Se Resend: deve estar OK (serviço externo)
# 4. Considerar caching
```

### Muitos bounces

```bash
# 1. Analisar emails que estão falhando
# 2. Considerar validação de email mais restrita
# 3. Implementar double opt-in
# 4. Limpar lista regularmente
```

---

## Rollback (Voltar Versão Anterior)

Se algo der errado:

```bash
# Ver histórico
git log --oneline

# Voltar para commit anterior
git revert HEAD

# Ou resetar completamente
git reset --hard HEAD~1

# Deploy automático vai atualizar
```

---

## Documentação de Mudanças

Mantenha um log de mudanças:

```markdown
# CHANGELOG

## 2026-02-04
- [DEPLOY] Sistema de captura de leads inicializado
- [CONFIG] Supabase tabela criada
- [CONFIG] Resend domínio verificado
- [FEATURE] Componente LeadCapture adicionado

## 2026-02-11
- [UPDATE] Email template redesenhado
- [BUGFIX] Validação de email melhorada

## 2026-02-18
- [FEATURE] Analytics adicionado
- [OPTIMIZE] Índices no Supabase
```

---

## Contato de Emergência

Se algo crítico falhar:

1. **Verificar logs:**
   ```bash
   netlify logs:functions --tail
   ```

2. **Verificar status:**
   - Supabase: https://status.supabase.com
   - Resend: https://status.resend.com
   - Netlify: https://www.netlify.com/status

3. **Procurar em:**
   - TROUBLESHOOTING.md (90% dos problemas)
   - Discord communities (link em docs)

4. **Último recurso:**
   - Revert deploy: `git revert HEAD`
   - Desativar temporariamente: adicione feature flag

---

## Checklist de Saúde Mensal

```
CHECKLIST - Saúde do Sistema de Leads

Data: ___/___/_____

[ ] Logs verificados (sem errors)
[ ] Total de leads confirmado
[ ] Taxa de entrega >95%
[ ] API Keys válidas
[ ] Domínio no Resend verificado
[ ] Backup realizado
[ ] Custos dentro do orçamento
[ ] Todos os serviços online
[ ] Monitoramento ativo

Notas:
_____________________________________
_____________________________________
```

---

**Mantenha seu sistema saudável! 🏥**
