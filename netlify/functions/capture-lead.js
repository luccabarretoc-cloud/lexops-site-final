const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

// Template de email simples e eficiente
const EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Seu Guia dos 7 Erros em Excel na Advocacia</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fc; margin: 0; padding: 20px;">
  <div style="max-width: 620px; margin: 0 auto; background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h1 style="color: #7c3aed; margin-bottom: 20px; font-size: 24px;">Seu Guia dos 7 Erros em Excel na Advocacia</h1>
    <p style="font-size: 16px; margin-bottom: 16px;">Olá,</p>
    <p style="font-size: 16px; margin-bottom: 16px;">
      Obrigado por se inscrever! Aqui está seu relatório exclusivo com os 7 erros mais perigosos (e caros) que estão freando sua prática.
    </p>
    <h2 style="font-size: 18px; color: #333; margin-bottom: 12px;">Você vai descobrir:</h2>
    <ul style="font-size: 16px; margin-bottom: 16px; padding-left: 20px; line-height: 1.8;">
      <li>Qual erro está te custando mais dinheiro</li>
      <li>Como identificar cada um na sua operação</li>
      <li>O roadmap para automatizar (sem Excel)</li>
    </ul>
    <p style="font-size: 16px; margin-bottom: 16px; padding: 16px; background: #f3e8ff; border-left: 4px solid #7c3aed; border-radius: 4px;">
      <strong>Este é um relatório 100% gratuito.</strong> Aproveite a oportunidade de se atualizar com estratégias comprovadas.
    </p>
    <p style="font-size: 14px; color: #666; margin-bottom: 8px;">
      <strong>Próximos passos:</strong>
    </p>
    <ol style="font-size: 14px; color: #666; line-height: 1.8;">
      <li>Leia com atenção cada seção</li>
      <li>Compartilhe com sua equipe jurídica</li>
      <li>Implemente os aprendizados</li>
      <li>Nos conte os resultados! 🎉</li>
    </ol>
    <p style="font-size: 14px; color: #999; margin-top: 24px; font-style: italic;">
      "A verdade que ninguém quer ouvir: você não precisa parar de usar Excel. Você precisa fazer ele de verdade funcionar."
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
    <p style="font-size: 12px; color: #999; margin: 0;">© 2026 LexOps Insight. Todos os direitos reservados.<br />Feito para a Elite Jurídica.</p>
  </div>
</body>
</html>`;

exports.handler = async (event) => {
  console.log('📧 [capture-lead] Iniciando...');
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Apenas POST permitido
  if (event.httpMethod !== 'POST') {
    console.log('❌ [capture-lead] Method não permitido:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('🔐 [capture-lead] Validando ENV...');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendKey = process.env.RESEND_API_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase não configurado');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Erro de configuração', success: false }),
      };
    }

    if (!resendKey) {
      console.error('❌ Resend não configurado');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Erro de configuração', success: false }),
      };
    }
    console.log('🔌 [capture-lead] Inicializando clientes...');
    let supabase, resend;
    try {
      supabase = createClient(supabaseUrl, supabaseKey);
      resend = new Resend(resendKey);
      console.log('✅ Clientes inicializados');
    } catch (initError) {
      console.error('❌ Erro ao inicializar clientes:', initError.message);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Erro de configuração', success: false }),
      };
    }

    console.log('📝 [capture-lead] Parseando request...');
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse JSON:', parseError.message);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Requisição inválida', success: false }),
      };
    }
    
    const { email, source = 'landing-page' } = body;

    if (!email) {
      console.warn('⚠️ [capture-lead] Email vazio');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email obrigatório', success: false }),
      };
    }

    console.log(`📧 [capture-lead] Email: ${email.substring(0, 5)}...`);

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.warn(`⚠️ [capture-lead] Email inválido`);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email inválido', success: false }),
      };
    }

    console.log('🔍 [capture-lead] Verificando existência...');
    const { data: existingLead, error: checkError } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (checkError) {
      console.error('❌ [capture-lead] Erro ao verificar:', checkError.message);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Erro ao processar requisição', success: false }),
      };
    }

    if (existingLead) {
      console.log('✅ [capture-lead] Email já existe');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Email já cadastrado',
          exists: true,
        }),
      };
    }

    console.log('💾 [capture-lead] Inserindo lead...');
    const { error: insertError } = await supabase
      .from('leads')
      .insert({
        email: email.toLowerCase(),
        source,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('❌ [capture-lead] Erro ao inserir:', insertError.message);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Erro ao processar requisição', success: false }),
      };
    }

    console.log('📨 [capture-lead] Enviando email...');
    const { error: emailError } = await resend.emails.send({
      from: 'LexOps Insight <noreply@lexopsinsight.com.br>',
      to: email,
      subject: 'Seu Guia dos 7 Erros em Excel na Advocacia - PDF Grátis',
      html: EMAIL_TEMPLATE,
    });

    if (emailError) {
      console.warn('⚠️ [capture-lead] Erro ao enviar email (lead foi salvo):', emailError.message);
    } else {
      console.log('✅ [capture-lead] Email enviado');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Lead cadastrado com sucesso!',
        exists: false,
      }),
    };
  } catch (error) {
    console.error('❌ [capture-lead] Erro geral:', error.message);
    console.error('Stack:', error.stack);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Erro ao processar requisição',
        success: false,
      }),
    };
  }
};
