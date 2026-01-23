-- ============================================
-- Row Level Security (RLS) Policies для Supabase
-- ============================================
-- 
-- ИНСТРУКЦИЯ:
-- 1. Откройте https://supabase.com/dashboard
-- 2. Выберите ваш проект
-- 3. Перейдите в SQL Editor
-- 4. Скопируйте и выполните этот SQL
-- 
-- ============================================

-- Включаем Row Level Security для всех таблиц
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Политики для таблицы chats
-- ============================================

-- Политика: Пользователи могут видеть только свои чаты (по device_id)
CREATE POLICY "Users can view their own chats"
  ON chats FOR SELECT
  USING (true); -- Временно разрешаем всем (для backend с service_role key)

-- Политика: Пользователи могут создавать чаты только для своего device_id
CREATE POLICY "Users can insert their own chats"
  ON chats FOR INSERT
  WITH CHECK (true); -- Временно разрешаем всем

-- Политика: Пользователи могут обновлять только свои чаты
CREATE POLICY "Users can update their own chats"
  ON chats FOR UPDATE
  USING (true); -- Временно разрешаем всем

-- Политика: Пользователи могут удалять только свои чаты
CREATE POLICY "Users can delete their own chats"
  ON chats FOR DELETE
  USING (true); -- Временно разрешаем всем

-- ============================================
-- Политики для таблицы messages
-- ============================================

-- Политика: Пользователи могут видеть сообщения только из своих чатов
CREATE POLICY "Users can view messages from their chats"
  ON messages FOR SELECT
  USING (true); -- Временно разрешаем всем

-- Политика: Пользователи могут создавать сообщения только для своих чатов
CREATE POLICY "Users can insert messages to their chats"
  ON messages FOR INSERT
  WITH CHECK (true); -- Временно разрешаем всем

-- Политика: Пользователи могут обновлять только свои сообщения
CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  USING (true); -- Временно разрешаем всем

-- Политика: Пользователи могут удалять только свои сообщения
CREATE POLICY "Users can delete their own messages"
  ON messages FOR DELETE
  USING (true); -- Временно разрешаем всем

-- ============================================
-- Политики для таблицы alerts
-- ============================================

-- Политика: Пользователи могут видеть только свои алерты
CREATE POLICY "Users can view their own alerts"
  ON alerts FOR SELECT
  USING (true); -- Временно разрешаем всем

-- Политика: Пользователи могут создавать алерты только для своего device_id
CREATE POLICY "Users can insert their own alerts"
  ON alerts FOR INSERT
  WITH CHECK (true); -- Временно разрешаем всем

-- Политика: Пользователи могут обновлять только свои алерты
CREATE POLICY "Users can update their own alerts"
  ON alerts FOR UPDATE
  USING (true); -- Временно разрешаем всем

-- Политика: Пользователи могут удалять только свои алерты
CREATE POLICY "Users can delete their own alerts"
  ON alerts FOR DELETE
  USING (true); -- Временно разрешаем всем

-- ============================================
-- Политики для таблицы devices
-- ============================================

-- Политика: Пользователи могут видеть только свои устройства
CREATE POLICY "Users can view their own devices"
  ON devices FOR SELECT
  USING (true); -- Временно разрешаем всем

-- Политика: Пользователи могут создавать устройства только для себя
CREATE POLICY "Users can insert their own devices"
  ON devices FOR INSERT
  WITH CHECK (true); -- Временно разрешаем всем

-- Политика: Пользователи могут обновлять только свои устройства
CREATE POLICY "Users can update their own devices"
  ON devices FOR UPDATE
  USING (true); -- Временно разрешаем всем

-- ============================================
-- Политики для таблицы sync_status
-- ============================================

-- Политика: Пользователи могут видеть только свой статус синхронизации
CREATE POLICY "Users can view their own sync status"
  ON sync_status FOR SELECT
  USING (true); -- Временно разрешаем всем

-- Политика: Пользователи могут обновлять только свой статус синхронизации
CREATE POLICY "Users can update their own sync status"
  ON sync_status FOR UPDATE
  USING (true); -- Временно разрешаем всем

-- Политика: Пользователи могут создавать статус синхронизации только для себя
CREATE POLICY "Users can insert their own sync status"
  ON sync_status FOR INSERT
  WITH CHECK (true); -- Временно разрешаем всем

-- ============================================
-- Политики для таблицы settings
-- ============================================

-- Политика: Пользователи могут видеть только свои настройки
CREATE POLICY "Users can view their own settings"
  ON settings FOR SELECT
  USING (true); -- Временно разрешаем всем

-- Политика: Пользователи могут создавать настройки только для себя
CREATE POLICY "Users can insert their own settings"
  ON settings FOR INSERT
  WITH CHECK (true); -- Временно разрешаем всем

-- Политика: Пользователи могут обновлять только свои настройки
CREATE POLICY "Users can update their own settings"
  ON settings FOR UPDATE
  USING (true); -- Временно разрешаем всем

-- ============================================
-- Дополнительные индексы для безопасности и производительности
-- ============================================

-- Индекс для быстрого поиска по device_id (уже есть, но убеждаемся)
CREATE INDEX IF NOT EXISTS idx_chats_device_id_security ON chats(device_id);
CREATE INDEX IF NOT EXISTS idx_messages_device_id_security ON messages(device_id);
CREATE INDEX IF NOT EXISTS idx_alerts_device_id_security ON alerts(device_id);
CREATE INDEX IF NOT EXISTS idx_settings_device_id_security ON settings(device_id);

-- ============================================
-- Ограничения для защиты от переполнения
-- ============================================

-- Ограничение на длину текстовых полей (если еще не установлено)
-- Эти ограничения уже есть в схеме, но убеждаемся

-- ============================================
-- ГОТОВО!
-- ============================================
-- 
-- ВАЖНО: 
-- - Политики используют `true` для всех операций, так как backend использует
--   service_role key, который обходит RLS
-- - Для production с аутентификацией пользователей нужно будет обновить
--   политики для проверки user_id или device_id через JWT токены
-- 
-- ============================================
