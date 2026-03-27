-- ============================================
-- SQL схема для системы родитель-ребенок
-- БЕЗОПАСНАЯ ВЕРСИЯ (можно применять многократно)
-- ============================================
-- Этот файл использует IF NOT EXISTS и не создает политики
-- Политики уже должны быть применены из security-policies.sql
-- ============================================

CREATE TABLE IF NOT EXISTS parents (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  email_verification_token TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  pin_hash TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  country TEXT DEFAULT 'US',
  state TEXT,
  coppa_consent BOOLEAN DEFAULT false,
  coppa_consent_date BIGINT,
  privacy_policy_accepted BOOLEAN DEFAULT false,
  privacy_policy_date BIGINT
);

CREATE INDEX IF NOT EXISTS idx_parents_email ON parents(email);
CREATE INDEX IF NOT EXISTS idx_parents_email_verified ON parents(email_verified);

CREATE TABLE IF NOT EXISTS parent_codes (
  code TEXT PRIMARY KEY,
  parent_id TEXT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  created_at BIGINT NOT NULL,
  expires_at BIGINT,
  used_count INTEGER DEFAULT 0,
  max_uses INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  last_used_at BIGINT
);

CREATE INDEX IF NOT EXISTS idx_parent_codes_parent ON parent_codes(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_codes_active ON parent_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_parent_codes_expires ON parent_codes(expires_at);

CREATE TABLE IF NOT EXISTS code_usage_log (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL REFERENCES parent_codes(code),
  child_id TEXT REFERENCES children(id),
  used_at BIGINT NOT NULL,
  device_id TEXT,
  ip_address TEXT
);

CREATE INDEX IF NOT EXISTS idx_code_usage_code ON code_usage_log(code);
CREATE INDEX IF NOT EXISTS idx_code_usage_child ON code_usage_log(child_id);

CREATE TABLE IF NOT EXISTS children (
  id TEXT PRIMARY KEY,
  parent_id TEXT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 4 AND age <= 15),
  email TEXT,
  email_verified BOOLEAN DEFAULT false,
  device_id TEXT UNIQUE NOT NULL,
  ui_version TEXT DEFAULT 'standard' CHECK (ui_version IN ('young', 'middle', 'standard')),
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_children_parent_id ON children(parent_id);
CREATE INDEX IF NOT EXISTS idx_children_device_id ON children(device_id);
CREATE INDEX IF NOT EXISTS idx_children_age ON children(age);

CREATE TABLE IF NOT EXISTS guardians (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  email_verification_token TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  pin_hash TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_documents JSONB,
  verification_notes TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  country TEXT DEFAULT 'US',
  state TEXT
);

CREATE INDEX IF NOT EXISTS idx_guardians_email ON guardians(email);
CREATE INDEX IF NOT EXISTS idx_guardians_verification_status ON guardians(verification_status);

CREATE TABLE IF NOT EXISTS guardian_children (
  guardian_id TEXT NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL CHECK (relationship IN ('legal_guardian', 'temporary', 'foster', 'other')),
  verified BOOLEAN DEFAULT false,
  verified_at BIGINT,
  verified_by TEXT REFERENCES parents(id),
  created_at BIGINT NOT NULL,
  PRIMARY KEY (guardian_id, child_id)
);

CREATE INDEX IF NOT EXISTS idx_guardian_children_guardian ON guardian_children(guardian_id);
CREATE INDEX IF NOT EXISTS idx_guardian_children_child ON guardian_children(child_id);

CREATE TABLE IF NOT EXISTS parent_activity (
  parent_id TEXT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  is_online BOOLEAN DEFAULT false,
  last_seen BIGINT NOT NULL,
  device_info JSONB,
  app_version TEXT,
  updated_at BIGINT NOT NULL,
  PRIMARY KEY (parent_id, child_id)
);

CREATE INDEX IF NOT EXISTS idx_parent_activity_parent ON parent_activity(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_activity_child ON parent_activity(child_id);
CREATE INDEX IF NOT EXISTS idx_parent_activity_online ON parent_activity(is_online);

CREATE TABLE IF NOT EXISTS educational_programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  institution_id TEXT,
  institution_name TEXT,
  description TEXT,
  age_range_min INTEGER NOT NULL CHECK (age_range_min >= 4),
  age_range_max INTEGER NOT NULL CHECK (age_range_max <= 15),
  program_type TEXT CHECK (program_type IN ('school', 'after_school', 'summer', 'online', 'other')),
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_educational_programs_institution ON educational_programs(institution_id);
CREATE INDEX IF NOT EXISTS idx_educational_programs_age_range ON educational_programs(age_range_min, age_range_max);

CREATE TABLE IF NOT EXISTS child_programs (
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  program_id TEXT NOT NULL REFERENCES educational_programs(id) ON DELETE CASCADE,
  enrolled_at BIGINT NOT NULL,
  parent_approved BOOLEAN DEFAULT false,
  parent_approved_at BIGINT,
  progress JSONB,
  attendance JSONB,
  completed BOOLEAN DEFAULT false,
  completed_at BIGINT,
  PRIMARY KEY (child_id, program_id)
);

CREATE INDEX IF NOT EXISTS idx_child_programs_child ON child_programs(child_id);
CREATE INDEX IF NOT EXISTS idx_child_programs_program ON child_programs(program_id);

CREATE TABLE IF NOT EXISTS content_monitoring (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  chat_id TEXT,
  message_id TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('url', 'image', 'text', 'file', 'video', 'audio')),
  content_url TEXT,
  content_text TEXT,
  ai_analysis JSONB NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('safe', 'low', 'medium', 'high', 'critical')),
  blocked BOOLEAN DEFAULT false,
  block_reason TEXT,
  parent_notified BOOLEAN DEFAULT false,
  parent_notified_at BIGINT,
  ai_service_used TEXT,
  created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_content_monitoring_child ON content_monitoring(child_id);
CREATE INDEX IF NOT EXISTS idx_content_monitoring_risk ON content_monitoring(risk_level);
CREATE INDEX IF NOT EXISTS idx_content_monitoring_blocked ON content_monitoring(blocked);
CREATE INDEX IF NOT EXISTS idx_content_monitoring_created ON content_monitoring(created_at);

CREATE TABLE IF NOT EXISTS child_activity_log (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('message_sent', 'message_received', 'chat_created', 'content_blocked', 'sos_triggered', 'program_enrolled')),
  details JSONB,
  created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_child_activity_log_child ON child_activity_log(child_id);
CREATE INDEX IF NOT EXISTS idx_child_activity_log_type ON child_activity_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_child_activity_log_created ON child_activity_log(created_at);

-- Добавляем колонки к существующим таблицам (если еще не добавлены)
ALTER TABLE chats ADD COLUMN IF NOT EXISTS child_id TEXT REFERENCES children(id);
ALTER TABLE chats ADD COLUMN IF NOT EXISTS parent_visible BOOLEAN DEFAULT true;
ALTER TABLE chats ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_chats_child_id ON chats(child_id);

ALTER TABLE messages ADD COLUMN IF NOT EXISTS child_id TEXT REFERENCES children(id);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS parent_visible BOOLEAN DEFAULT true;
CREATE INDEX IF NOT EXISTS idx_messages_child_id ON messages(child_id);

ALTER TABLE alerts ADD COLUMN IF NOT EXISTS child_id TEXT REFERENCES children(id);
ALTER TABLE alerts ADD COLUMN IF NOT EXISTS parent_notified BOOLEAN DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_alerts_child_id ON alerts(child_id);

-- ============================================
-- ВАЖНО: После применения этого SQL нужно обновить schema cache в Supabase
-- ============================================
-- PostgREST (который используется Supabase) кэширует схему базы данных.
-- После создания новых таблиц нужно обновить кэш:
-- 
-- Способ 1 (автоматически): Подождать 1-2 минуты - кэш обновится сам
-- 
-- Способ 2 (вручную): 
-- 1. Supabase Dashboard → Settings → API
-- 2. Нажмите "Reload schema cache" или перезапустите проект
-- 
-- Способ 3 (через SQL):
-- NOTIFY pgrst, 'reload schema';
-- ============================================
