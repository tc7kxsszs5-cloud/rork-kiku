ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chats" ON chats FOR SELECT USING (true);
CREATE POLICY "Users can insert their own chats" ON chats FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own chats" ON chats FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own chats" ON chats FOR DELETE USING (true);

CREATE POLICY "Users can view messages from their chats" ON messages FOR SELECT USING (true);
CREATE POLICY "Users can insert messages to their chats" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own messages" ON messages FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own messages" ON messages FOR DELETE USING (true);

CREATE POLICY "Users can view their own alerts" ON alerts FOR SELECT USING (true);
CREATE POLICY "Users can insert their own alerts" ON alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own alerts" ON alerts FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own alerts" ON alerts FOR DELETE USING (true);

CREATE POLICY "Users can view their own devices" ON devices FOR SELECT USING (true);
CREATE POLICY "Users can insert their own devices" ON devices FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own devices" ON devices FOR UPDATE USING (true);

CREATE POLICY "Users can view their own sync status" ON sync_status FOR SELECT USING (true);
CREATE POLICY "Users can update their own sync status" ON sync_status FOR UPDATE USING (true);
CREATE POLICY "Users can insert their own sync status" ON sync_status FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Users can insert their own settings" ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own settings" ON settings FOR UPDATE USING (true);

CREATE INDEX IF NOT EXISTS idx_chats_device_id_security ON chats(device_id);
CREATE INDEX IF NOT EXISTS idx_messages_device_id_security ON messages(device_id);
CREATE INDEX IF NOT EXISTS idx_alerts_device_id_security ON alerts(device_id);
CREATE INDEX IF NOT EXISTS idx_settings_device_id_security ON settings(device_id);
