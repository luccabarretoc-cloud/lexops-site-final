# 🔧 Configuração Resend - Guia de Domínio

## Visão Geral

O Resend é o serviço que envia os emails com o PDF. Você tem 2 opções:

### Opção 1: Usar Domínio Padrão (Mais Rápido)
- Emails saem como: `noreply@lexopsinsight.resend.dev`
- Sem configuração adicional
- Funciona imediatamente
- Bom para MVP

### Opção 2: Usar Seu Domínio (Mais Profissional)
- Emails saem como: `noreply@lexopsinsight.com.br`
- Requer configuração de DNS
- Mais confiável para entregabilidade
- Recomendado para produção

---

## ✅ Opção 1: Domínio Padrão (Rápido)

### Passo 1: Criar Conta Resend
1. Acesse https://resend.com
2. Clique em "Get Started"
3. Faça login com Google/GitHub ou email
4. Confirme seu email

### Passo 2: Pegar API Key
1. Vá em **API Keys** (menu esquerdo)
2. Clique em **Create API Key**
3. Dê um nome: "LexOps Insight"
4. Copie a chave (começa com `re_`)
5. Cole em `.env.local`:
   ```
   RESEND_API_KEY=re_SEU_CODIGO_AQUI
   ```

### Passo 3: Testar
```javascript
// Seu email sairá como:
from: 'LexOps Insight <onboarding@resend.dev>'
```

**Pronto!** Segue para a próxima seção.

---

## ✅ Opção 2: Usar Seu Domínio (Recomendado para Produção)

### Passo 1: Adicionar Domínio no Resend
1. Acesse https://resend.com/domains
2. Clique em "Add Domain"
3. Digite seu domínio: `lexopsinsight.com.br`
4. Clique em "Add"

### Passo 2: Configurar Registros DNS

Resend fornecerá 3 registros DNS. Você precisa adicioná-los ao seu provedor de DNS.

**Exemplo de registros que você receberá:**

```
Tipo: CNAME
Nome: default._domainkey.lexopsinsight.com.br
Valor: default.dkim.resend.com

Tipo: MX
Nome: lexopsinsight.com.br
Valor: mx.resend.com
Prioridade: 10

Tipo: TXT
Nome: lexopsinsight.com.br
Valor: v=spf1 include:resend.com ~all
```

### Passo 3: Adicionar Registros no seu Provedor

Se você usa Cloudflare, Namecheap, GoDaddy, etc:

#### Cloudflare:
1. Acesse seu dashboard
2. Vá em **DNS**
3. Clique em **+ Add record**
4. Escolha tipo (CNAME, MX, TXT)
5. Preencha com dados do Resend
6. Salve

#### Namecheap:
1. Acesse seu dashboard
2. Vá em **Advanced DNS**
3. Adicione cada registro (CNAME, MX, TXT)
4. Salve

#### GoDaddy:
1. Acesse seu dashboard
2. Vá em **DNS**
3. Adicione registros
4. Salve

### Passo 4: Verificar Domínio

De volta no Resend:

1. Clique em **Verify DNS Records**
2. Resend validará automaticamente
3. Após validação (pode levar até 1 hora):
   - Status muda para "Verified" (verde)
   - Domínio está pronto para enviar

### Passo 5: Usar no Código

Agora você pode usar seu domínio no `capture-lead.js`:

```javascript
await resend.emails.send({
  from: 'LexOps Insight <noreply@lexopsinsight.com.br>',
  to: email,
  subject: 'Seu PDF Chegou! 🎉',
  html: `...seu HTML...`
});
```

---

## 🔍 Verificar Status do Domínio

No Resend Dashboard:
1. Vá em **Domains**
2. Clique no seu domínio
3. Veja status dos registros:
   - ✅ Green = Verificado
   - 🟡 Yellow = Pendente
   - ❌ Red = Erro

Se algum estiver vermelho, revise a configuração DNS.

---

## 📊 Monitorar Emails

### No Resend Dashboard:

**Emails Enviados:**
1. Vá em **Emails**
2. Veja lista de todos os emails
3. Clique em um para ver detalhes:
   - ✅ Delivered (Entregue)
   - ❌ Bounced (Retornou)
   - 👁️ Opened (Aberto)
   - 🔗 Clicked (Clicou no link)

**Estatísticas:**
- Taxa de entrega
- Taxa de abertura
- Cliques em links
- Bounces (emails inválidos)

---

## 🚨 Troubleshooting

### Problema: "Email não foi entregue"

1. **Verifique o domínio:**
   - Domínio está "Verified" (verde)?
   - Se não, aguarde validação

2. **Verifique registros DNS:**
   - Registros CNAME, MX, SPF estão corretos?
   - Digitou exatamente como Resend forneceu?

3. **Verifique email no Resend:**
   - Dashboard → Emails
   - Procure o email específico
   - Veja o motivo do erro

### Problema: "Erro ao enviar email"

1. Verifique se `RESEND_API_KEY` está correto
2. Verifique se domínio está verificado
3. Veja logs: `netlify logs:functions --tail`

### Problema: "Email vai para spam"

1. Configure SPF, DKIM, DMARC corretamente
2. Use domínio próprio (não `resend.dev`)
3. Mande email de teste e verifique configuração

### Problema: "Emails testam limite"

Resend oferece:
- **Free:** 100 emails/dia
- **Paid:** Ilimitado ($20/mês)

Para upgrade:
1. Resend → Billing
2. Escolha plano
3. Configure payment

---

## 📋 Checklist Resend

- [ ] Conta criada em https://resend.com
- [ ] API Key copiada para `.env.local`
- [ ] Domínio adicionado no Resend (opcional)
- [ ] Registros DNS configurados (se escolheu domínio próprio)
- [ ] Domínio verificado (status verde)
- [ ] Email de teste enviado com sucesso
- [ ] Email recebido na caixa de entrada
- [ ] Resend Dashboard mostra email entregue

---

## 💡 Dicas

1. **Teste sempre** com seu email pessoal antes de usar em produção
2. **Use domínio próprio** para melhor entregabilidade
3. **Monitore entregabilidade** regularmente
4. **Configure DMARC** para máxima segurança
5. **Mantenha lista limpa** (remover bounces)

---

## 📞 Suporte Resend

- **Documentação:** https://resend.com/docs
- **Status:** https://status.resend.com
- **Discord Community:** https://discord.gg/B9855CSgYU

---

**Pronto!** Você está preparado para enviar emails via Resend! 🚀

