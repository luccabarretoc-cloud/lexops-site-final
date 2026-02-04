-- Criar tabela de leads para captura via landing page
-- Execute este script no Supabase SQL Editor (ou em qualquer cliente PostgreSQL)

-- 1. Criar tabela principal
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  source VARCHAR(50) DEFAULT 'landing_pdf',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- 3. Enable RLS (Row Level Security) - segurança
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 4. Política para leitura (apenas SERVICE ROLE pode ler)
CREATE POLICY "Service role can read leads" ON leads
  FOR SELECT
  USING (auth.role() = 'service_role');

-- 5. Política para inserção (apenas SERVICE ROLE pode inserir)
CREATE POLICY "Service role can insert leads" ON leads
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- 6. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS leads_update_updated_at ON leads;
CREATE TRIGGER leads_update_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();

-- Confirmação
SELECT 'Tabela de leads criada com sucesso!' as message;
