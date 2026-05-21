-- ============================================================
-- BeGamers Store — Migration: tabelas admin faltantes
-- Execute no Supabase SQL Editor
-- ============================================================

-- 1. AVALIAÇÕES DE PRODUTOS
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access reviews" ON product_reviews FOR ALL USING (true);

-- 2. CAMPANHAS
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'discount' CHECK (type IN ('discount', 'launch', 'installment', 'bundle')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'scheduled', 'ended', 'paused')),
  start_date date,
  end_date date,
  discount_pct int DEFAULT 0,
  banner_url text,
  products_count int DEFAULT 0,
  revenue numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access campaigns" ON campaigns FOR ALL USING (true);

-- 3. AUTOMAÇÕES DE E-MAIL/SMS
CREATE TABLE IF NOT EXISTS email_automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  trigger_event text NOT NULL,
  channel text NOT NULL DEFAULT 'email',
  is_active boolean DEFAULT true,
  sent_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE email_automations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access automations" ON email_automations FOR ALL USING (true);

-- Seed: automações padrão
INSERT INTO email_automations (name, trigger_event, channel, is_active, sent_count) VALUES
  ('Confirmação de pedido', 'order_created', 'email', true, 0),
  ('Pedido enviado', 'order_shipped', 'email+sms', true, 0),
  ('Recuperação de carrinho — 1h', 'cart_abandoned_1h', 'email', true, 0),
  ('Recuperação de carrinho — 24h', 'cart_abandoned_24h', 'email', true, 0),
  ('Boas-vindas', 'new_signup', 'email', true, 0),
  ('Avaliação pós-entrega', 'post_delivery_3d', 'email', false, 0),
  ('Cupom de aniversário', 'birthday_7d', 'email+sms', false, 0)
ON CONFLICT DO NOTHING;

-- 4. MEMBROS DA EQUIPE
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'operator' CHECK (role IN ('owner', 'admin', 'operator', 'marketing')),
  is_active boolean DEFAULT true,
  last_access timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access team" ON team_members FOR ALL USING (true);

-- Seed: owner padrão
INSERT INTO team_members (name, email, role, is_active) VALUES
  ('Diego A.', 'diego@begamers.com.br', 'owner', true)
ON CONFLICT (email) DO NOTHING;

-- 5. TRANSPORTADORAS / ENVIOS
CREATE TABLE IF NOT EXISTS shipping_carriers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  type text DEFAULT 'normal',
  is_active boolean DEFAULT true,
  min_days int DEFAULT 1,
  max_days int DEFAULT 7,
  base_price numeric DEFAULT 0,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE shipping_carriers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access carriers" ON shipping_carriers FOR ALL USING (true);
CREATE POLICY "Public read carriers" ON shipping_carriers FOR SELECT USING (is_active = true);

INSERT INTO shipping_carriers (name, code, type, is_active, min_days, max_days, base_price, sort_order) VALUES
  ('Correios PAC', 'pac', 'normal', true, 5, 10, 18.90, 1),
  ('Correios SEDEX', 'sedex', 'express', true, 1, 3, 34.90, 2),
  ('Jadlog .Package', 'jadlog_pkg', 'normal', true, 3, 7, 22.90, 3),
  ('Total Express', 'totalexpress', 'normal', false, 3, 8, 19.90, 4),
  ('Retirada na loja', 'pickup', 'pickup', true, 0, 0, 0, 5)
ON CONFLICT (code) DO NOTHING;

-- 6. RASTREAMENTO DE PEDIDOS
CREATE TABLE IF NOT EXISTS order_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  carrier text,
  tracking_code text,
  status text DEFAULT 'preparing' CHECK (status IN ('preparing', 'posted', 'in_transit', 'out_for_delivery', 'delivered', 'returned')),
  events jsonb DEFAULT '[]',
  estimated_delivery date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access tracking" ON order_tracking FOR ALL USING (true);
CREATE POLICY "Customer read own tracking" ON order_tracking FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE customer_email = auth.jwt()->>'email'));

-- Index para busca por código de rastreio
CREATE INDEX IF NOT EXISTS idx_order_tracking_code ON order_tracking(tracking_code);
CREATE INDEX IF NOT EXISTS idx_order_tracking_order ON order_tracking(order_id);

-- ============================================================
-- FIM DA MIGRATION
-- ============================================================
