-- Таблица для SOS-алертов
-- Выполнить в Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS sos_alerts (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL,
  parent_id TEXT NOT NULL,
  chat_id TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  message TEXT,
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_by TEXT,
  resolved_at BIGINT,
  created_at BIGINT NOT NULL DEFAULT extract(epoch from now()) * 1000
);

CREATE INDEX IF NOT EXISTS idx_sos_alerts_parent_id ON sos_alerts (parent_id);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_child_id ON sos_alerts (child_id);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_created_at ON sos_alerts (created_at);

ALTER TABLE sos_alerts DISABLE ROW LEVEL SECURITY;
