-- GANIT ADDA: Complete Normalized PostgreSQL E-Commerce Schema
-- Compatible with Neon Serverless Postgres and standard PostgreSQL 14+

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. USERS & PROFILES
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  mobile VARCHAR(30),
  role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN')),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role, is_active);

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  class_level VARCHAR(12) DEFAULT 'X',
  school_name VARCHAR(180) DEFAULT '',
  target_exam VARCHAR(80) DEFAULT 'CBSE Board',
  address TEXT DEFAULT '',
  city VARCHAR(100) DEFAULT '',
  state VARCHAR(100) DEFAULT '',
  pincode VARCHAR(20) DEFAULT '',
  avatar_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(128) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS password_resets_token_idx ON password_resets(token);

CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(128) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS email_verifications_token_idx ON email_verifications(token);

-- 2. TAXONOMY: CATEGORIES, CLASSES, CHAPTERS
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS academic_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(12) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  description TEXT DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_level VARCHAR(12) NOT NULL,
  subject VARCHAR(80) NOT NULL DEFAULT 'Mathematics',
  chapter_number INT NOT NULL DEFAULT 1,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(class_level, chapter_number, slug)
);

-- 3. WORKSHEETS & PRODUCTS
CREATE TABLE IF NOT EXISTS worksheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(220) UNIQUE,
  class_level VARCHAR(12) NOT NULL CHECK (class_level IN ('VI','VII','VIII','IX','X','XI','XII')),
  subject VARCHAR(80) NOT NULL DEFAULT 'Mathematics',
  chapter VARCHAR(180) NOT NULL,
  topic VARCHAR(180) DEFAULT '',
  difficulty VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  material_type VARCHAR(40) NOT NULL DEFAULT 'worksheet' CHECK (material_type IN ('worksheet', 'ncert_solution', 'study_material', 'mock_test', 'formula_sheet', 'question_bank')),
  description TEXT NOT NULL DEFAULT '',
  learning_objectives TEXT NOT NULL DEFAULT '',
  number_of_questions INT NOT NULL DEFAULT 0,
  number_of_pages INT NOT NULL DEFAULT 1,
  file_format VARCHAR(20) NOT NULL DEFAULT 'PDF',
  price_paise INTEGER NOT NULL DEFAULT 0 CHECK (price_paise >= 0),
  original_price_paise INTEGER CHECK (original_price_paise IS NULL OR original_price_paise >= 0),
  is_free BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
  preview_pdf_url TEXT,
  preview_images JSONB DEFAULT '[]'::jsonb,
  blob_url TEXT NOT NULL DEFAULT '',
  blob_pathname TEXT NOT NULL DEFAULT '',
  secure_storage_key TEXT,
  storage_provider VARCHAR(40) NOT NULL DEFAULT 'vercel_blob',
  file_size_bytes BIGINT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  download_count INT NOT NULL DEFAULT 0,
  view_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS worksheets_public_idx ON worksheets(is_published, class_level, created_at DESC);
CREATE INDEX IF NOT EXISTS worksheets_slug_idx ON worksheets(slug);
CREATE INDEX IF NOT EXISTS worksheets_featured_idx ON worksheets(is_featured, is_published);
CREATE INDEX IF NOT EXISTS worksheets_filter_idx ON worksheets(material_type, difficulty, is_published);

-- Safe migrations for existing worksheets table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='slug') THEN
    ALTER TABLE worksheets ADD COLUMN slug VARCHAR(220) UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='material_type') THEN
    ALTER TABLE worksheets ADD COLUMN material_type VARCHAR(40) NOT NULL DEFAULT 'worksheet';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='topic') THEN
    ALTER TABLE worksheets ADD COLUMN topic VARCHAR(180) DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='difficulty') THEN
    ALTER TABLE worksheets ADD COLUMN difficulty VARCHAR(20) NOT NULL DEFAULT 'Medium';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='learning_objectives') THEN
    ALTER TABLE worksheets ADD COLUMN learning_objectives TEXT NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='number_of_questions') THEN
    ALTER TABLE worksheets ADD COLUMN number_of_questions INT NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='number_of_pages') THEN
    ALTER TABLE worksheets ADD COLUMN number_of_pages INT NOT NULL DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='file_format') THEN
    ALTER TABLE worksheets ADD COLUMN file_format VARCHAR(20) NOT NULL DEFAULT 'PDF';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='is_free') THEN
    ALTER TABLE worksheets ADD COLUMN is_free BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='is_featured') THEN
    ALTER TABLE worksheets ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='is_bestseller') THEN
    ALTER TABLE worksheets ADD COLUMN is_bestseller BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='preview_pdf_url') THEN
    ALTER TABLE worksheets ADD COLUMN preview_pdf_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='preview_images') THEN
    ALTER TABLE worksheets ADD COLUMN preview_images JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='secure_storage_key') THEN
    ALTER TABLE worksheets ADD COLUMN secure_storage_key TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='storage_provider') THEN
    ALTER TABLE worksheets ADD COLUMN storage_provider VARCHAR(40) NOT NULL DEFAULT 'vercel_blob';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='download_count') THEN
    ALTER TABLE worksheets ADD COLUMN download_count INT NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='worksheets' AND column_name='view_count') THEN
    ALTER TABLE worksheets ADD COLUMN view_count INT NOT NULL DEFAULT 0;
  END IF;
END $$;

-- 4. CART & CART ITEMS
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(100),
  coupon_code VARCHAR(40),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS carts_user_idx ON carts(user_id);
CREATE INDEX IF NOT EXISTS carts_session_idx ON carts(session_id);

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  worksheet_id UUID NOT NULL REFERENCES worksheets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(cart_id, worksheet_id)
);

-- 5. COUPONS & DISCOUNTS
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(40) NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  min_order_paise INT NOT NULL DEFAULT 0,
  max_discount_paise INT,
  class_level VARCHAR(12),
  usage_limit INT NOT NULL DEFAULT 1000,
  usage_count INT NOT NULL DEFAULT 0,
  per_user_limit INT NOT NULL DEFAULT 1,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 year',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS coupons_code_idx ON coupons(code);

-- 6. ORDERS & ORDER ITEMS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(40) NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(190) NOT NULL,
  customer_phone VARCHAR(30),
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED')),
  subtotal_paise INT NOT NULL DEFAULT 0,
  discount_paise INT NOT NULL DEFAULT 0,
  total_paise INT NOT NULL DEFAULT 0,
  coupon_code VARCHAR(40),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS orders_user_idx ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  worksheet_id UUID NOT NULL REFERENCES worksheets(id) ON DELETE RESTRICT,
  worksheet_title VARCHAR(180) NOT NULL,
  worksheet_class VARCHAR(12) NOT NULL,
  chapter VARCHAR(180) NOT NULL,
  price_paise INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items(order_id);

-- 7. PAYMENTS & WEBHOOKS
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_provider VARCHAR(30) NOT NULL DEFAULT 'RAZORPAY' CHECK (payment_provider IN ('RAZORPAY', 'PAYU', 'CASHFREE', 'MANUAL_TEST')),
  gateway_order_id VARCHAR(100),
  gateway_payment_id VARCHAR(100),
  gateway_signature VARCHAR(255),
  amount_paise INT NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED')),
  payment_method VARCHAR(50),
  error_code VARCHAR(100),
  error_description TEXT,
  raw_response JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS payments_order_idx ON payments(order_id);
CREATE INDEX IF NOT EXISTS payments_gateway_order_idx ON payments(gateway_order_id);

CREATE TABLE IF NOT EXISTS payment_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(30) NOT NULL,
  event_id VARCHAR(100),
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  signature VARCHAR(255),
  is_processed BOOLEAN NOT NULL DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS webhook_event_idx ON payment_webhook_events(provider, event_id);

-- 8. DOWNLOAD ENTITLEMENTS & ACCESS LOGS
CREATE TABLE IF NOT EXISTS download_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  worksheet_id UUID NOT NULL REFERENCES worksheets(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  download_count INT NOT NULL DEFAULT 0,
  max_downloads INT NOT NULL DEFAULT 100,
  last_downloaded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, worksheet_id)
);
CREATE INDEX IF NOT EXISTS entitlements_user_ws_idx ON download_entitlements(user_id, worksheet_id, is_active);

CREATE TABLE IF NOT EXISTS download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entitlement_id UUID NOT NULL REFERENCES download_entitlements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  worksheet_id UUID NOT NULL REFERENCES worksheets(id) ON DELETE CASCADE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. COUPON REDEMPTIONS & WISHLISTS
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  discount_paise INT NOT NULL,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  worksheet_id UUID NOT NULL REFERENCES worksheets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(wishlist_id, worksheet_id)
);

-- 10. REVIEWS & AUDIT LOGS & REFUNDS
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worksheet_id UUID NOT NULL REFERENCES worksheets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(140) DEFAULT '',
  comment TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS reviews_ws_idx ON reviews(worksheet_id, is_approved);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  actor_email VARCHAR(190),
  actor_role VARCHAR(20) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(60) NOT NULL,
  target_id VARCHAR(100),
  details JSONB DEFAULT '{}'::jsonb,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON audit_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id),
  gateway_refund_id VARCHAR(100),
  amount_paise INT NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
  revoke_entitlements BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. ENQUIRIES (Already exists in base schema, ensuring all columns)
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(190) DEFAULT '',
  class_level VARCHAR(12) NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS enquiries_created_idx ON enquiries(created_at DESC);

-- 12. SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Essential Brand & Settings
INSERT INTO site_settings(setting_key, setting_value) VALUES
('brand', '{"name":"GANIT ADDA","tagline":"Maths Made Simple, One Step at a Time.","phone":"9874169625","email":"madeeasyganit@gmail.com","whatsapp":"919874169625"}'::jsonb),
('payment_config', '{"provider":"RAZORPAY","test_mode":true,"currency":"INR","auto_fulfill":true}'::jsonb),
('hero_banners', '{"badge":"CBSE & NCERT Mathematics • Classes VI–XII","headline":"Maths Made Simple, One Step at a Time.","subheading":"Explore expertly designed mathematics worksheets, chapter-wise practice materials and step-by-step solutions aligned with NCERT and CBSE learning requirements."}'::jsonb)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = NOW();

-- Seed Default Academic Classes
INSERT INTO academic_classes(code, name, sort_order) VALUES
('VI', 'Class 6th Mathematics', 6),
('VII', 'Class 7th Mathematics', 7),
('VIII', 'Class 8th Mathematics', 8),
('IX', 'Class 9th Mathematics', 9),
('X', 'Class 10th Mathematics', 10),
('XI', 'Class 11th Mathematics', 11),
('XII', 'Class 12th Mathematics', 12)
ON CONFLICT (code) DO NOTHING;

-- Seed Default Categories
INSERT INTO categories(name, slug, description, sort_order) VALUES
('Practice Worksheets', 'worksheets', 'Chapter-wise practice worksheets with graded difficulty', 1),
('NCERT Solutions', 'ncert-solutions', 'Step-by-step exercise solutions with conceptual breakdowns', 2),
('Study Materials', 'study-materials', 'Revision notes, formula sheets, and chapter summaries', 3),
('Mock Tests', 'mock-tests', 'Full-length timed question papers with marking schemes', 4)
ON CONFLICT (slug) DO NOTHING;

-- Seed Default Sample Coupon
INSERT INTO coupons(code, description, discount_type, discount_value, min_order_paise, usage_limit, per_user_limit)
VALUES ('WELCOME20', 'Get 20% OFF on your first mathematics bundle', 'percentage', 20, 10000, 500, 1)
ON CONFLICT (code) DO NOTHING;
