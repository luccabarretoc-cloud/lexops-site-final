const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

// Inicializar Supabase e Resend
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Template de email profissional (HTML)
const EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Seu Guia dos 7 Erros em Excel na Advocacia</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body, table, td, p, a, span, div {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    body {
      margin: 0;
      padding: 0;
      min-width: 100% !important;
      width: 100% !important;
      background-color: #f8f9fc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #242c52;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }
    img {
      display: block;
      outline: none;
      border: none;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f8f9fc;
      padding: 20px 0;
    }
    .container {
      width: 100%;
      max-width: 620px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .header-logo {
      max-width: 140px;
      height: auto;
      margin: 0 auto 16px;
      display: block;
    }
    .header-title {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .header-subtitle {
      margin: 6px 0 0;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 400;
    }
    .content {
      padding: 32px 28px 24px;
      color: #242c52;
      font-size: 15px;
      line-height: 1.7;
    }
    .content h2 {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 16px;
      color: #242c52;
    }
    .content h3 {
      font-size: 15px;
      font-weight: 600;
      margin: 16px 0 8px;
      color: #7c3aed;
    }
    .content p {
      margin: 0 0 14px;
    }
    .content ul {
      margin: 12px 0 16px;
      padding-left: 20px;
    }
    .content li {
      margin-bottom: 8px;
      color: #33334f;
    }
    .highlight-box {
      margin: 20px 0;
      padding: 16px;
      background: linear-gradient(135deg, #f3e8ff 0%, #f0f9ff 100%);
      border-left: 4px solid #7c3aed;
      border-radius: 6px;
      font-size: 14px;
      color: #3e2c5f;
      font-style: italic;
    }
    .cta-section {
      text-align: center;
      margin: 28px 0;
      padding: 24px;
      background-color: #f8f9fc;
      border-radius: 8px;
    }
    .cta-text {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 16px;
      color: #242c52;
    }
    .btn-primary {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      border: 2px solid transparent;
      transition: all 0.2s ease;
      margin-bottom: 12px;
    }
    .fallback-link {
      font-size: 12px;
      color: #666888;
      word-break: break-all;
      margin-top: 8px;
    }
    .fallback-link a {
      color: #7c3aed;
      text-decoration: underline;
    }
    .divider {
      border: 0;
      border-top: 1px solid #e2e2f2;
      margin: 28px 0;
    }
    .social-section {
      text-align: center;
      margin: 16px 0;
      font-size: 13px;
      color: #666888;
    }
    .social-section a {
      color: #7c3aed;
      text-decoration: none;
      font-weight: 500;
      margin: 0 8px;
      display: inline-block;
    }
    .footer {
      text-align: center;
      padding: 20px 28px;
      border-top: 1px solid #e2e2f2;
      font-size: 12px;
      color: #8a8fa8;
      background-color: #f8f9fc;
    }
    .footer p {
      margin: 4px 0;
    }
    @media (max-width: 600px) {
      .wrapper {
        padding: 10px 0;
      }
      .container {
        border-radius: 0;
      }
      .content {
        padding: 24px 18px;
      }
      .header {
        padding: 24px 18px;
      }
      .header-title {
        font-size: 20px;
      }
      .btn-primary {
        width: 100%;
        padding: 12px 16px;
        font-size: 14px;
        box-sizing: border-box;
      }
    }
  </style>
</head>
<body>
  <table class="wrapper" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" valign="top">
        <table class="container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td class="header" align="center" valign="middle">
              <img src="https://www.lexopsinsight.com.br/logo-lexops.webp" alt="LexOps Insight" class="header-logo" style="width: 120px; height: auto;" />
              <h1 class="header-title">LexOps Insight</h1>
              <p class="header-subtitle">Guia Prático para Sair do Excel</p>
            </td>
          </tr>
          <tr>
            <td class="content" valign="top">
              <h2>Seu guia está pronto! 🎉</h2>
              <p>Olá,</p>
              <p>Muito obrigado por confiar no <strong>LexOps Insight</strong>. Preparamos um relatório direto e prático sobre os <strong>7 Erros Fatais que Advogados Cometem com Excel</strong> — com benchmarks reais, estudos de caso e checklists que você pode usar hoje.</p>
              <div class="highlight-box">
                "Se você ainda controla processos, prazos e clientes em planilhas, este é o mapa para sair do caos e operar com visão executiva, dados confiáveis e menos risco de compliance."
              </div>
              <table class="cta-section" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <p class="cta-text">Baixar seu PDF agora:</p>
                    <a href="https://www.lexopsinsight.com.br/assets/pdf/7-erros-excel-juridico.pdf" class="btn-primary" target="_blank">
                      ⬇️ Baixar PDF Grátis
                    </a>
                    <div class="fallback-link">
                      <strong>Link direto:</strong><br />
                      <a href="https://www.lexopsinsight.com.br/assets/pdf/7-erros-excel-juridico.pdf" target="_blank" style="color: #7c3aed;">
                        https://www.lexopsinsight.com.br/assets/pdf/7-erros-excel-juridico.pdf
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
              <h3>O que você vai encontrar:</h3>
              <ul>
                <li><strong>Erro #1-7:</strong> Os erros mais comuns em gestão de casos jurídicos</li>
                <li><strong>Números reais:</strong> Impacto em tempo, risco e conformidade</li>
                <li><strong>Checklist prático:</strong> Diagnostique seu cenário em 5 minutos</li>
                <li><strong>Próximos passos:</strong> Roadmap claro para operações mais robustas</li>
              </ul>
              <p>Leia com calma, compartilhe com sua equipe jurídica e marque os pontos em que vocês se reconhecem. Isso já é o início de um plano de ação concreto.</p>
              <div class="divider"></div>
              <p style="text-align: center; margin: 0 0 12px; font-size: 13px; color: #666888;">
                Quer acompanhar mais conteúdos sobre <strong>Legal Operations</strong>, gestão de casos e automação jurídica?
              </p>
              <div class="social-section">
                <a href="https://www.instagram.com/lexopsinsight?igsh=NHBzYXFmNmt3eDdz&utm_source=email" target="_blank">📸 Instagram</a>
                <a href="https://www.facebook.com/people/LexOps-Insight/61587114226502" target="_blank">👥 Facebook</a>
              </div>
            </td>
          </tr>
        </table>
        <table class="footer" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td align="center" style="padding: 20px 28px; font-size: 12px; color: #8a8fa8; background-color: #f8f9fc;">
              <p style="margin: 0 0 4px;">
                <strong>LexOps Insight</strong> · Legal Operations para times que querem sair do Excel
              </p>
              <p style="margin: 0;">
                Não solicitou este material? Confira sua caixa de entrada.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// Handler da função
exports.handler = async (event) => {
  // Apenas POST permitido
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { email, source = 'landing-page' } = body;

    // Validação básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email inválido', success: false }),
      };
    }

    // Verificar se email já existe
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingLead) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Email já cadastrado',
          duplicate: true,
        }),
      };
    }

    // Inserir novo lead no Supabase
    const { error: insertError } = await supabase.from('leads').insert({
      email: email.toLowerCase(),
      source,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error('Erro ao inserir lead:', insertError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao salvar email', success: false }),
      };
    }

    // Enviar email via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'LexOps Insight <noreply@lexopsinsight.com.br>',
      to: email,
      subject: 'Seu Guia dos 7 Erros em Excel na Advocacia - PDF Grátis',
      html: EMAIL_TEMPLATE,
    });

    if (emailError) {
      console.error('Erro ao enviar email:', emailError);
      // Mesmo com erro no email, o lead foi salvo
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Lead cadastrado, mas houve erro ao enviar email',
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Email recebido com sucesso!',
        duplicate: false,
      }),
    };
  } catch (error) {
    console.error('Erro geral:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro ao processar requisição',
        success: false,
      }),
    };
  }
};
