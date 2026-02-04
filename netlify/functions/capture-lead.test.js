// Test file para testar a função capture-lead
// Execute com: node netlify/functions/capture-lead.test.js

const handler = require('./capture-lead.js').handler;

// Mock de ambiente (substitua com valores reais para testar)
process.env.SUPABASE_URL = 'https://seu-projeto.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'sua-chave-aqui';
process.env.RESEND_API_KEY = 'sua-api-key-aqui';

// Teste 1: POST com email válido (novo)
async function testNewEmail() {
  console.log('\n🧪 Teste 1: Email novo válido\n');
  
  const event = {
    httpMethod: 'POST',
    body: JSON.stringify({ email: 'teste' + Date.now() + '@exemplo.com' }),
  };

  try {
    const response = await handler(event);
    console.log('Status:', response.statusCode);
    console.log('Body:', JSON.parse(response.body));
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

// Teste 2: POST com email existente
async function testDuplicateEmail() {
  console.log('\n🧪 Teste 2: Email duplicado\n');
  
  const email = 'existente@exemplo.com';
  
  // Primeiro envio
  console.log('Enviando primeira vez...');
  const event1 = {
    httpMethod: 'POST',
    body: JSON.stringify({ email }),
  };
  
  try {
    const response1 = await handler(event1);
    console.log('Primeira tentativa:', JSON.parse(response1.body));
    
    // Segundo envio (deve falhar ou retornar existe)
    console.log('\nEnviando segunda vez (duplicado)...');
    const response2 = await handler(event1);
    console.log('Segunda tentativa:', JSON.parse(response2.body));
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

// Teste 3: GET (deve rejeitar)
async function testWrongMethod() {
  console.log('\n🧪 Teste 3: Método GET (deve rejeitar)\n');
  
  const event = {
    httpMethod: 'GET',
    body: JSON.stringify({ email: 'teste@exemplo.com' }),
  };

  try {
    const response = await handler(event);
    console.log('Status:', response.statusCode);
    console.log('Body:', JSON.parse(response.body));
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

// Teste 4: Email inválido
async function testInvalidEmail() {
  console.log('\n🧪 Teste 4: Email inválido\n');
  
  const event = {
    httpMethod: 'POST',
    body: JSON.stringify({ email: 'nao-e-email' }),
  };

  try {
    const response = await handler(event);
    console.log('Status:', response.statusCode);
    console.log('Body:', JSON.parse(response.body));
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

// Teste 5: Sem email no body
async function testMissingEmail() {
  console.log('\n🧪 Teste 5: Email ausente no body\n');
  
  const event = {
    httpMethod: 'POST',
    body: JSON.stringify({}),
  };

  try {
    const response = await handler(event);
    console.log('Status:', response.statusCode);
    console.log('Body:', JSON.parse(response.body));
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

// Executar testes
async function runTests() {
  console.log('═══════════════════════════════════════');
  console.log('  TESTES - FUNÇÃO CAPTURE-LEAD');
  console.log('═══════════════════════════════════════');

  console.log('\n⚠️ NOTA: Configure as variáveis de ambiente antes!');
  console.log('SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY\n');

  try {
    await testWrongMethod();
    await testMissingEmail();
    await testInvalidEmail();
    await testNewEmail();
    // await testDuplicateEmail(); // Descomente para testar duplicatas
  } catch (error) {
    console.error('Erro geral:', error);
  }

  console.log('\n═══════════════════════════════════════');
  console.log('  TESTES CONCLUÍDOS');
  console.log('═══════════════════════════════════════\n');
}

// Executar
runTests();
