# 📋 DEPLOYMENT CHECKLIST - LEAD CAPTURE SYSTEM

## ✅ PRÉ-DEPLOYMENT (Fazer Localmente)

- [ ] Ler `QUICK_START.md` e `IMPLEMENTATION_GUIDE.md`
- [ ] Supabase: Executar script SQL em `netlify/functions/migrations/001_create_leads_table.sql`
- [ ] Supabase: Copiar `Project URL` → `.env.local`
- [ ] Supabase: Copiar `Service Role Key` → `.env.local`
- [ ] Resend: Criar/verificar conta em https://resend.com
- [ ] Resend: Copiar API Key → `.env.local`
- [ ] Criar arquivo `.env.local` com as 3 variáveis
- [ ] Testar localmente: `npm run dev`
- [ ] Preencher formulário LeadCapture na página
- [ ] Verificar se email foi recebido
- [ ] Verificar se email aparece no Supabase (Table Editor → leads)
- [ ] Customizar email HTML em `netlify/functions/capture-lead.js` (opcional)

## ✅ PRÉ-DEPLOYMENT (Netlify)

- [ ] Logar em https://app.netlify.com
- [ ] Abrir seu site
- [ ] Ir em **Site settings → Environment variables**
- [ ] Adicionar `SUPABASE_URL`
- [ ] Adicionar `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Adicionar `RESEND_API_KEY`
- [ ] Confirmar que `.netlify.toml` existe (ou criar com configuração mínima)

## ✅ DEPLOYMENT

- [ ] Fazer commit de todas as mudanças
  ```bash
  git add -A
  git commit -m "Add lead capture system with PDF delivery"
  git push origin main
  ```
- [ ] Aguardar deploy automático no Netlify
- [ ] Verificar se deploy foi bem-sucedido (Deploys → último deploy)
- [ ] Acessar site em produção

## ✅ PÓS-DEPLOYMENT (Validação em Produção)

- [ ] Acessar https://seu-dominio.com (sua landing page)
- [ ] Localizar seção "Acelere sua prática jurídica agora"
- [ ] Preencher formulário com email de teste
- [ ] Verificar resposta de sucesso
- [ ] Verificar se email chegou (caixa de entrada + spam)
- [ ] Verificar se email aparece no Supabase
- [ ] Testar com email duplicado (deve retornar "já cadastrado")
- [ ] Testar com email inválido (deve rejeitar)
- [ ] Verificar logs: `netlify logs:functions --tail`

## ✅ PÓS-DEPLOYMENT (Monitoramento)

- [ ] Configurar alertas no Supabase (opcional)
- [ ] Configurar alertas no Resend para bounces
- [ ] Criar dashboard de conversões (opcional)
- [ ] Verificar diariamente quantidade de leads

## 🚨 TROUBLESHOOTING DURANTE DEPLOYMENT

**"Erro ao fazer git push"**
```bash
git status
# Verifique se .env.local NÃO aparece
git diff --cached
# Confirme que apenas arquivos certos estão sendo enviados
```

**"Variáveis de ambiente não funcionam"**
- Aguarde 30 segundos após adicionar no Netlify
- Redeploy manualmente no Netlify UI
- Verificar em Settings → Environment (salvas?)

**"Função retorna 500"**
```bash
netlify logs:functions --tail
# Ver erro específico
```

## 📊 MONITORAMENTO CONTÍNUO

### Dashboard Recomendado

Crie uma página no Supabase para monitorar:

```sql
-- Leads totais
SELECT COUNT(*) as total_leads FROM leads;

-- Leads por dia
SELECT DATE(created_at) as data, COUNT(*) as quantidade 
FROM leads 
GROUP BY DATE(created_at) 
ORDER BY data DESC;

-- Emails com mais tráfego (dominios)
SELECT 
  SUBSTRING(email FROM '@' + 1) as dominio, 
  COUNT(*) as quantidade 
FROM leads 
GROUP BY dominio 
ORDER BY quantidade DESC;
```

### Resend Dashboard

Monitore em https://resend.com/emails:
- Taxa de entrega
- Bounces
- Cliques no link de PDF
- Aberturas

## 🔄 UPDATES FUTUROS

Se precisar atualizar a função:

```bash
# 1. Atualizar arquivo localmente
# 2. Testar em dev
npm run dev

# 3. Deploy
git add netlify/functions/capture-lead.js
git commit -m "Update: [descricao da mudança]"
git push

# 4. Validar em produção
# Acessar site e testar função
```

## ✨ SUCESSO!

Se chegou aqui e tudo funcionou:

```
🎉 PARABÉNS! 🎉

Seu sistema de captura de leads está:
✅ Capturando emails
✅ Enviando PDFs
✅ Armazenando no Supabase
✅ Funcionando em produção
```

Próximas ações sugeridas:
1. Divulgar o link para landing page
2. Monitorar leads diariamente
3. Melhorar copy do formulário baseado em taxas de conversão
4. Integrar com seu CRM favorito

---

**Dúvidas?** Consulte:
- `QUICK_START.md` - Início rápido
- `IMPLEMENTATION_GUIDE.md` - Guia completo
- `LEAD_CAPTURE_SETUP.md` - Setup detalhado
