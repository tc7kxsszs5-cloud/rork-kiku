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

NOTIFY pgrst, 'reload schema';
