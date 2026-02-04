-- ============================================================
-- LEAD CAPTURE SYSTEM - SQL FINAL PARA SUPABASE
-- Versão: 1.0
-- Data: 04/02/2026
-- ============================================================

-- 1. CRIAR TABELA DE LEADS
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Dados principais
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'landing_pdf',
  status TEXT DEFAULT 'active',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Campos opcionais para futuro
  utm_source TEXT,
  utm_campaign TEXT,
  country TEXT,
  
  CONSTRAINT status_valid CHECK (status IN ('active', 'unsubscribed', 'customer'))
);

-- ============================================================
-- 2. CRIAR ÍNDICES PARA PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- ============================================================
-- 3. ATIVAR ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. CRIAR POLICIES DE SEGURANÇA
-- ============================================================
-- Deletar policies antigas (se existirem)
DROP POLICY IF EXISTS "Service Role Full Access" ON leads;
DROP POLICY IF EXISTS "Allow service role" ON leads;

-- Policy para SERVICE_ROLE (Netlify Function)
CREATE POLICY "service_role_access" ON leads
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================
-- 5. CRIAR FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- ============================================================
DROP FUNCTION IF EXISTS update_leads_updated_at CASCADE;

CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 6. CRIAR TRIGGER PARA updated_at
-- ============================================================
DROP TRIGGER IF EXISTS leads_update_updated_at ON leads;

CREATE TRIGGER leads_update_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();

-- ============================================================
-- 7. CRIAR VIEW PARA ESTATÍSTICAS (OPCIONAL)
-- ============================================================
DROP VIEW IF EXISTS leads_stats CASCADE;

CREATE OR REPLACE VIEW leads_stats AS
SELECT
  COUNT(*) as total_leads,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_leads,
  COUNT(CASE WHEN status = 'customer' THEN 1 END) as customers,
  COUNT(DISTINCT source) as sources,
  MIN(created_at) as first_lead_date,
  MAX(created_at) as last_lead_date,
  COUNT(DISTINCT DATE(created_at)) as days_with_leads
FROM leads;

-- ============================================================
-- 8. VERIFICAÇÃO FINAL
-- ============================================================
-- Descomente a linha abaixo para verificar a tabela:
-- SELECT * FROM leads LIMIT 5;
-- SELECT * FROM leads_stats;

-- ============================================================
-- PRÓXIMOS PASSOS:
-- 1. Copie TODO este conteúdo
-- 2. Vá em Supabase → SQL Editor
-- 3. Cole aqui
-- 4. Execute (Ctrl + Enter)
-- 5. Pronto! Tabela configurada
-- ============================================================
