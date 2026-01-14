/**
 * Чистые детерминированные функции для проверки временных ограничений
 * Вынесено из ParentalControlsContext для модульного тестирования
 */

export interface TimeRestriction {
  enabled: boolean;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

/**
 * Проверяет, находится ли текущее время в пределах временного ограничения
 * Чистая детерминированная функция
 * 
 * Логика: доступ ограничен если есть хотя бы одно активное ограничение для текущего дня,
 * и текущее время находится вне разрешенного периода этого ограничения.
 * Если есть несколько ограничений для одного дня, доступ разрешен если время попадает
 * в любой из разрешенных периодов.
 * 
 * @param restrictions - Массив временных ограничений
 * @param currentTime - Текущее время (объект Date или timestamp)
 * @returns true если доступ ограничен (вне разрешенного времени)
 */
export function isTimeRestricted(
  restrictions: TimeRestriction[],
  currentTime: Date | number
): boolean {
  const now = currentTime instanceof Date ? currentTime : new Date(currentTime);
  const dayOfWeek = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeMinutes = currentHour * 60 + currentMinute;

  // Фильтруем активные ограничения для текущего дня
  const activeRestrictions = restrictions.filter(
    (r) => r.enabled && r.dayOfWeek === dayOfWeek
  );

  if (activeRestrictions.length === 0) {
    return false; // Нет ограничений для этого дня
  }

  // Проверяем, попадает ли время в любой из разрешенных периодов
  const isInAnyAllowedPeriod = activeRestrictions.some((restriction) => {
    const startTime = restriction.startHour * 60 + restriction.startMinute;
    const endTime = restriction.endHour * 60 + restriction.endMinute;

    // Время в разрешенном периоде если: startTime <= currentTime < endTime
    return currentTimeMinutes >= startTime && currentTimeMinutes < endTime;
  });

  // Доступ ограничен если время НЕ попадает ни в один разрешенный период
  return !isInAnyAllowedPeriod;
}
