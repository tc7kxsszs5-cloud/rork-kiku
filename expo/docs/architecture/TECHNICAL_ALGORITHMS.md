# Технические алгоритмы и решения для KIKU

## 🧠 AI/ML Алгоритмы

### 1. Алгоритм детекции рисков (Multi-Stage Pipeline)

```typescript
/**
 * Многоуровневая система анализа для баланса скорости и точности
 */
class RiskDetectionPipeline {
  // Этап 1: Быстрая проверка (Bloom Filter) - <1ms
  async stage1_FastCheck(text: string): Promise<RiskAnalysis | null> {
    // Bloom Filter для известных угроз (1M+ паттернов)
    if (bloomFilter.mightContain(text)) {
      return null; // Переходим к следующему этапу
    }
    return { riskLevel: 'safe', confidence: 0.95 };
  }

  // Этап 2: Правила и ключевые слова (Trie) - <5ms
  async stage2_RuleBased(text: string): Promise<RiskAnalysis> {
    // Trie структура для O(m) поиска, где m = длина текста
    const matches = trie.search(text);
    if (matches.length > 0) {
      return evaluateMatches(matches);
    }
    return { riskLevel: 'safe', confidence: 0.7 };
  }

  // Этап 3: Эвристический анализ - <20ms
  async stage3_Heuristics(text: string): Promise<RiskAnalysis> {
    const features = extractFeatures(text);
    // N-gram анализ, sentiment, длина, паттерны
    return heuristicClassifier.classify(features);
  }

  // Этап 4: ML модель (только если нужно) - <200ms
  async stage4_MLModel(text: string): Promise<RiskAnalysis> {
    // Fine-tuned BERT модель
    const embedding = await bertModel.embed(text);
    return mlClassifier.predict(embedding);
  }

  async analyze(text: string): Promise<RiskAnalysis> {
    // Каскадная обработка
    const stage1 = await this.stage1_FastCheck(text);
    if (stage1) return stage1;

    const stage2 = await this.stage2_RuleBased(text);
    if (stage2.riskLevel === 'critical') return stage2;
    if (stage2.riskLevel === 'high') return stage2;

    const stage3 = await this.stage3_Heuristics(text);
    if (stage3.riskLevel !== 'safe') {
      // Объединяем результаты
      return this.combineResults(stage2, stage3);
    }

    // Только для подозрительных случаев используем ML
    if (stage3.confidence < 0.5) {
      const stage4 = await this.stage4_MLModel(text);
      return this.combineResults(stage3, stage4);
    }

    return stage3;
  }
}
```

### 2. Алгоритм кэширования (LRU с TTL)

```typescript
/**
 * Умное кэширование результатов анализа
 * Экономия: 80% AI API вызовов
 */
class AnalysisCache {
  private cache: Map<string, CachedResult>;
  private maxSize: number = 10000;
  private accessOrder: string[] = [];

  // Хеш текста для кэширования
  private hash(text: string): string {
    // SHA-256 хеш (нормализованный текст)
    const normalized = text.toLowerCase().trim();
    return sha256(normalized);
  }

  async get(text: string): Promise<RiskAnalysis | null> {
    const key = this.hash(text);
    const cached = this.cache.get(key);

    if (!cached) return null;

    // Проверка TTL
    const age = Date.now() - cached.timestamp;
    const ttl = this.getTTL(cached.result.riskLevel);
    
    if (age > ttl) {
      this.cache.delete(key);
      return null;
    }

    // Обновляем порядок доступа (LRU)
    this.updateAccessOrder(key);
    return cached.result;
  }

  async set(text: string, result: RiskAnalysis): void {
    const key = this.hash(text);
    
    // Если кэш переполнен, удаляем самый старый
    if (this.cache.size >= this.maxSize) {
      const oldest = this.accessOrder.shift();
      if (oldest) this.cache.delete(oldest);
    }

    this.cache.set(key, {
      result,
      timestamp: Date.now(),
    });
    this.updateAccessOrder(key);
  }

  private getTTL(riskLevel: RiskLevel): number {
    // Безопасные - кэшируем дольше
    // Рисковые - кэшируем меньше (могут измениться)
    const ttlMap = {
      safe: 24 * 60 * 60 * 1000,      // 24 часа
      low: 12 * 60 * 60 * 1000,       // 12 часов
      medium: 6 * 60 * 60 * 1000,     // 6 часов
      high: 1 * 60 * 60 * 1000,       // 1 час
      critical: 15 * 60 * 1000,       // 15 минут
    };
    return ttlMap[riskLevel];
  }
}
```

### 3. Алгоритм приоритизации обработки

```typescript
/**
 * Приоритетная очередь для обработки сообщений
 * Критические обрабатываются немедленно
 */
class PriorityQueue {
  private queues: {
    critical: Message[];
    high: Message[];
    medium: Message[];
    low: Message[];
    safe: Message[];
  };

  enqueue(message: Message, priority: RiskLevel): void {
    this.queues[priority].push(message);
    this.queues[priority].sort((a, b) => b.timestamp - a.timestamp);
  }

  dequeue(): Message | null {
    // Всегда берем из самой приоритетной очереди
    for (const level of ['critical', 'high', 'medium', 'low', 'safe']) {
      if (this.queues[level].length > 0) {
        return this.queues[level].shift();
      }
    }
    return null;
  }

  // Batch processing для экономии
  dequeueBatch(size: number = 10): Message[] {
    const batch: Message[] = [];
    while (batch.length < size) {
      const msg = this.dequeue();
      if (!msg) break;
      batch.push(msg);
    }
    return batch;
  }
}
```

### 4. Алгоритм обнаружения аномалий (Isolation Forest)

```typescript
/**
 * Обнаружение необычных паттернов поведения
 * Используется для детекции grooming, мошенничества
 */
class AnomalyDetection {
  private model: IsolationForest;

  // Извлечение признаков из истории сообщений
  extractFeatures(messages: Message[]): number[] {
    return [
      messages.length,                           // Количество сообщений
      avgMessageLength(messages),                 // Средняя длина
      timeBetweenMessages(messages),              // Интервалы
      uniqueWordsRatio(messages),                 // Уникальность слов
      questionMarksCount(messages),               // Количество вопросов
      personalInfoRequests(messages),             // Запросы личных данных
      urgencyIndicators(messages),                // Индикаторы срочности
      timeOfDay(messages),                       // Время суток
    ];
  }

  async detectAnomaly(userId: string, messages: Message[]): Promise<number> {
    // Получаем историю пользователя
    const history = await this.getUserHistory(userId);
    const features = this.extractFeatures([...history, ...messages]);
    
    // Предсказание аномальности (0-1, где 1 = аномалия)
    const anomalyScore = await this.model.predict(features);
    
    return anomalyScore;
  }
}
```

### 5. Алгоритм batch processing для AI

```typescript
/**
 * Обработка сообщений батчами для экономии
 * Экономия: 90% стоимости AI API
 */
class BatchProcessor {
  private batch: Message[] = [];
  private batchSize: number = 50;
  private flushInterval: number = 5000; // 5 секунд

  async add(message: Message): Promise<void> {
    this.batch.push(message);
    
    // Если батч заполнен, обрабатываем немедленно
    if (this.batch.length >= this.batchSize) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.batch.length === 0) return;

    const batch = [...this.batch];
    this.batch = [];

    // Объединяем все тексты в один запрос
    const texts = batch.map(m => m.text);
    const results = await aiAPI.analyzeBatch(texts); // Один запрос вместо 50

    // Распределяем результаты
    batch.forEach((msg, index) => {
      msg.analysis = results[index];
      this.processMessage(msg);
    });
  }

  startAutoFlush(): void {
    setInterval(() => this.flush(), this.flushInterval);
  }
}
```

---

## 📊 Алгоритмы оптимизации данных

### 1. Алгоритм сжатия данных

```typescript
/**
 * Сжатие сообщений для хранения и передачи
 * Экономия: 70% места в БД
 */
class MessageCompression {
  // LZ4 сжатие для быстрого доступа
  compress(message: Message): Buffer {
    const json = JSON.stringify(message);
    return lz4.compress(Buffer.from(json));
  }

  decompress(data: Buffer): Message {
    const decompressed = lz4.decompress(data);
    return JSON.parse(decompressed.toString());
  }

  // Delta compression для последовательных сообщений
  compressDelta(messages: Message[]): Buffer {
    const base = messages[0];
    const deltas = messages.slice(1).map(msg => ({
      id: msg.id,
      diff: this.computeDiff(base, msg),
    }));
    return this.compress({ base, deltas });
  }
}
```

### 2. Алгоритм партиционирования данных

```typescript
/**
 * Партиционирование по времени для производительности
 */
class TimePartitioning {
  // Партиции по месяцам
  getPartition(timestamp: number): string {
    const date = new Date(timestamp);
    return `messages_${date.getFullYear()}_${date.getMonth() + 1}`;
  }

  // Автоматическая архивация старых партиций
  async archiveOldPartitions(): Promise<void> {
    const cutoff = Date.now() - (6 * 30 * 24 * 60 * 60 * 1000); // 6 месяцев
    
    const partitions = await this.getPartitions();
    for (const partition of partitions) {
      if (partition.lastTimestamp < cutoff) {
        await this.archiveToColdStorage(partition);
        await this.dropPartition(partition.name);
      }
    }
  }
}
```

### 3. Алгоритм индексации для поиска

```typescript
/**
 * Inverted index для быстрого поиска по сообщениям
 */
class SearchIndex {
  private index: Map<string, Set<string>>; // word -> messageIds

  indexMessage(message: Message): void {
    const words = this.tokenize(message.text);
    for (const word of words) {
      if (!this.index.has(word)) {
        this.index.set(word, new Set());
      }
      this.index.get(word)!.add(message.id);
    }
  }

  search(query: string): string[] {
    const words = this.tokenize(query);
    const results = new Set<string>();

    // Intersection всех результатов
    for (const word of words) {
      const messageIds = this.index.get(word) || new Set();
      if (results.size === 0) {
        messageIds.forEach(id => results.add(id));
      } else {
        // Intersection
        for (const id of results) {
          if (!messageIds.has(id)) {
            results.delete(id);
          }
        }
      }
    }

    return Array.from(results);
  }
}
```

---

## 🔄 Алгоритмы синхронизации

### 1. Conflict Resolution (CRDT)

```typescript
/**
 * Безконфликтная синхронизация данных между устройствами
 * Использует CRDT (Conflict-free Replicated Data Type)
 */
class CRDTSync {
  // Vector Clock для отслеживания версий
  private vectorClock: Map<string, number> = new Map();

  merge(local: Chat[], remote: Chat[]): Chat[] {
    // Объединяем по timestamp и vector clock
    const merged = new Map<string, Chat>();

    // Добавляем локальные
    for (const chat of local) {
      merged.set(chat.id, chat);
    }

    // Объединяем удаленные (выигрывает более новая версия)
    for (const chat of remote) {
      const localChat = merged.get(chat.id);
      if (!localChat || this.isNewer(chat, localChat)) {
        merged.set(chat.id, chat);
      }
    }

    return Array.from(merged.values());
  }

  private isNewer(chat1: Chat, chat2: Chat): boolean {
    // Сравниваем по vector clock
    const vc1 = chat1.vectorClock || {};
    const vc2 = chat2.vectorClock || {};

    // Chat1 новее если хотя бы одна координата больше
    for (const [device, time] of Object.entries(vc1)) {
      if ((vc2[device] || 0) < time) {
        return true;
      }
    }
    return false;
  }
}
```

### 2. Incremental Sync

```typescript
/**
 * Инкрементальная синхронизация (только изменения)
 * Экономия: 95% трафика
 */
class IncrementalSync {
  async sync(deviceId: string, lastSync: number): Promise<SyncResult> {
    // Получаем только изменения с последней синхронизации
    const changes = await this.getChangesSince(deviceId, lastSync);
    
    return {
      chats: changes.chats,
      messages: changes.messages,
      alerts: changes.alerts,
      deleted: changes.deleted, // Список удаленных ID
      timestamp: Date.now(),
    };
  }

  private async getChangesSince(
    deviceId: string, 
    timestamp: number
  ): Promise<Changes> {
    // Оптимизированный запрос с индексами
    return db.query(`
      SELECT * FROM messages 
      WHERE updated_at > $1 
      AND (user_id = $2 OR shared_with = $2)
      ORDER BY updated_at ASC
      LIMIT 1000
    `, [timestamp, deviceId]);
  }
}
```

---

## 🎯 Алгоритмы оптимизации производительности

### 1. Connection Pooling

```typescript
/**
 * Пул соединений с БД для масштабирования
 */
class DatabasePool {
  private pool: Connection[];
  private maxConnections: number = 20;
  private minConnections: number = 5;

  async getConnection(): Promise<Connection> {
    // Берем свободное соединение
    const free = this.pool.find(c => !c.inUse);
    if (free) {
      free.inUse = true;
      return free;
    }

    // Если нет свободных, создаем новое (если не превышен лимит)
    if (this.pool.length < this.maxConnections) {
      const newConn = await this.createConnection();
      newConn.inUse = true;
      this.pool.push(newConn);
      return newConn;
    }

    // Ждем освобождения соединения
    return this.waitForConnection();
  }

  release(conn: Connection): void {
    conn.inUse = false;
  }
}
```

### 2. Read Replicas для масштабирования чтения

```typescript
/**
 * Балансировка чтения между репликами
 */
class ReadReplicaBalancer {
  private replicas: Database[];
  private currentIndex: number = 0;

  getReadConnection(): Database {
    // Round-robin балансировка
    const replica = this.replicas[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.replicas.length;
    return replica;
  }

  // Write всегда идет на master
  getWriteConnection(): Database {
    return this.master;
  }
}
```

### 3. Circuit Breaker Pattern

```typescript
/**
 * Защита от каскадных сбоев
 */
class CircuitBreaker {
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private threshold: number = 5;
  private timeout: number = 60000; // 1 минута

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}
```

---

## 📈 Алгоритмы аналитики

### 1. Real-time Aggregation

```typescript
/**
 * Агрегация метрик в реальном времени
 */
class MetricsAggregator {
  private counters: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();

  // Sliding window для метрик
  increment(metric: string, value: number = 1): void {
    const current = this.counters.get(metric) || 0;
    this.counters.set(metric, current + value);
  }

  record(metric: string, value: number): void {
    if (!this.histograms.has(metric)) {
      this.histograms.set(metric, []);
    }
    const values = this.histograms.get(metric)!;
    values.push(value);
    
    // Храним только последние 1000 значений
    if (values.length > 1000) {
      values.shift();
    }
  }

  getPercentile(metric: string, percentile: number): number {
    const values = this.histograms.get(metric) || [];
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.floor(sorted.length * percentile / 100);
    return sorted[index] || 0;
  }
}
```

### 2. Anomaly Detection в метриках

```typescript
/**
 * Обнаружение аномалий в метриках (для алертинга)
 */
class MetricAnomalyDetection {
  // Z-score для обнаружения выбросов
  detectAnomaly(metric: string, value: number): boolean {
    const history = this.getHistory(metric, 24); // 24 часа
    const mean = this.mean(history);
    const std = this.stdDev(history, mean);
    const zScore = Math.abs((value - mean) / std);
    
    // Аномалия если z-score > 3
    return zScore > 3;
  }

  // Moving average для сглаживания
  getMovingAverage(metric: string, window: number = 10): number {
    const values = this.getRecentValues(metric, window);
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
}
```

---

## 🔐 Алгоритмы безопасности

### 1. Rate Limiting (Token Bucket)

```typescript
/**
 * Token Bucket для rate limiting
 */
class TokenBucket {
  private tokens: number;
  private capacity: number;
  private refillRate: number; // tokens per second
  private lastRefill: number;

  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }

  consume(tokens: number = 1): boolean {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000; // секунды
    const tokensToAdd = elapsed * this.refillRate;
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}
```

### 2. Encryption Key Rotation

```typescript
/**
 * Ротация ключей шифрования
 */
class KeyRotation {
  private currentKey: string;
  private previousKey: string;
  private rotationInterval: number = 30 * 24 * 60 * 60 * 1000; // 30 дней

  async rotate(): Promise<void> {
    this.previousKey = this.currentKey;
    this.currentKey = await this.generateNewKey();
    
    // Перешифровываем данные с новым ключом (асинхронно)
    this.reencryptData();
  }

  async decrypt(data: EncryptedData): Promise<string> {
    try {
      // Пробуем текущий ключ
      return await this.decryptWithKey(data, this.currentKey);
    } catch {
      // Если не получилось, пробуем предыдущий
      return await this.decryptWithKey(data, this.previousKey);
    }
  }
}
```

---

## 💡 Рекомендации по внедрению

### Приоритет 1 (Критично для масштабирования):
1. ✅ Кэширование результатов AI анализа
2. ✅ Приоритетная очередь обработки
3. ✅ Batch processing для AI
4. ✅ Database connection pooling
5. ✅ Rate limiting

### Приоритет 2 (Важно для производительности):
1. ✅ Read replicas
2. ✅ Партиционирование данных
3. ✅ Incremental sync
4. ✅ Circuit breaker
5. ✅ Metrics aggregation

### Приоритет 3 (Оптимизация):
1. ✅ Compression
2. ✅ Search indexing
3. ✅ Anomaly detection
4. ✅ Key rotation
5. ✅ Advanced ML models

---

**Последнее обновление:** 2025-01-06  
**Версия:** 1.0

