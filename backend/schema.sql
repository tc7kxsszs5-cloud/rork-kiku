-- Схема базы данных для проекта KIKU
-- Выполните этот SQL в Supabase Dashboard → SQL Editor

-- 1. Таблица чатов
CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  last_message TEXT,
  last_message_timestamp BIGINT,
  risk_level TEXT DEFAULT 'safe',
  unread_count INTEGER DEFAULT 0,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chats_device_id ON chats(device_id);
CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at);

-- 2. Таблица сообщений
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  sender TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  message_type TEXT DEFAULT 'text',
  risk_level TEXT DEFAULT 'safe',
  ai_analysis JSONB,
  created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_device_id ON messages(device_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);

-- 3. Таблица алертов безопасности
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  chat_id TEXT,
  message_id TEXT,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  risk_level TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at BIGINT NOT NULL,
  resolved_at BIGINT,
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_alerts_device_id ON alerts(device_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);

-- 4. Таблица устройств
CREATE TABLE IF NOT EXISTS devices (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  device_name TEXT,
  platform TEXT,
  last_sync_timestamp BIGINT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);

-- 5. Таблица статуса синхронизации
CREATE TABLE IF NOT EXISTS sync_status (
  device_id TEXT PRIMARY KEY,
  last_sync_timestamp BIGINT NOT NULL,
  last_chats_sync BIGINT,
  last_alerts_sync BIGINT,
  last_settings_sync BIGINT,
  updated_at BIGINT NOT NULL
);

-- 6. Таблица настроек родительского контроля
CREATE TABLE IF NOT EXISTS settings (
  device_id TEXT PRIMARY KEY,
  settings_data JSONB NOT NULL,
  updated_at BIGINT NOT NULL,
  created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_settings_device_id ON settings(device_id);
CREATE INDEX IF NOT EXISTS idx_settings_updated_at ON settings(updated_at);
