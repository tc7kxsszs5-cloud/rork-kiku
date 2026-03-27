-- ============================================
-- ДОБАВИТЬ ТАБЛИЦУ SETTINGS В SUPABASE
-- ============================================
-- 
-- ИНСТРУКЦИЯ:
-- 1. Откройте https://supabase.com/dashboard
-- 2. Выберите ваш проект
-- 3. Перейдите в SQL Editor (слева в меню)
-- 4. Скопируйте весь текст ниже (Ctrl+A / Cmd+A)
-- 5. Вставьте в SQL Editor
-- 6. Нажмите "Run" (или Ctrl+Enter / Cmd+Enter)
-- 
-- ============================================

-- 6. Таблица настроек родительского контроля
CREATE TABLE IF NOT EXISTS settings (
  device_id TEXT PRIMARY KEY,
  settings_data JSONB NOT NULL,
  updated_at BIGINT NOT NULL,
  created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_settings_device_id ON settings(device_id);
CREATE INDEX IF NOT EXISTS idx_settings_updated_at ON settings(updated_at);

-- ============================================
-- ГОТОВО! Таблица создана.
-- ============================================
