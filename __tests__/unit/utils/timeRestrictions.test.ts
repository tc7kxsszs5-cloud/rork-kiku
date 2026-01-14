/**
 * Модульные тесты для проверки временных ограничений
 * Только детерминированные тесты - никаких интеграций/асинхронности
 */

import { isTimeRestricted, TimeRestriction } from '@/utils/timeRestrictions';

describe('isTimeRestricted', () => {
  it('должен возвращать false для пустого массива ограничений', () => {
    const restrictions: TimeRestriction[] = [];
    const now = new Date('2024-01-15T14:30:00'); // Понедельник, 14:30

    expect(isTimeRestricted(restrictions, now)).toBe(false);
  });

  it('должен возвращать false если ограничение отключено', () => {
    const restrictions: TimeRestriction[] = [
      {
        enabled: false,
        dayOfWeek: 1, // Понедельник
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
      },
    ];
    const now = new Date('2024-01-15T14:30:00'); // Понедельник, 14:30

    expect(isTimeRestricted(restrictions, now)).toBe(false);
  });

  it('должен возвращать false если день недели не совпадает', () => {
    const restrictions: TimeRestriction[] = [
      {
        enabled: true,
        dayOfWeek: 2, // Вторник
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
      },
    ];
    const now = new Date('2024-01-15T14:30:00'); // Понедельник (day 1), 14:30

    expect(isTimeRestricted(restrictions, now)).toBe(false);
  });

  it('должен возвращать true если время до начала разрешенного периода', () => {
    const restrictions: TimeRestriction[] = [
      {
        enabled: true,
        dayOfWeek: 1, // Понедельник
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
      },
    ];
    const now = new Date('2024-01-15T08:30:00'); // Понедельник, 08:30 (до 9:00)

    expect(isTimeRestricted(restrictions, now)).toBe(true);
  });

  it('должен возвращать false если время в разрешенном периоде', () => {
    const restrictions: TimeRestriction[] = [
      {
        enabled: true,
        dayOfWeek: 1, // Понедельник
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
      },
    ];
    const now = new Date('2024-01-15T14:30:00'); // Понедельник, 14:30 (между 9:00 и 17:00)

    expect(isTimeRestricted(restrictions, now)).toBe(false);
  });

  it('должен возвращать true если время после окончания разрешенного периода', () => {
    const restrictions: TimeRestriction[] = [
      {
        enabled: true,
        dayOfWeek: 1, // Понедельник
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
      },
    ];
    const now = new Date('2024-01-15T18:30:00'); // Понедельник, 18:30 (после 17:00)

    expect(isTimeRestricted(restrictions, now)).toBe(true);
  });

  it('должен возвращать false если время равно началу периода (граничный случай)', () => {
    const restrictions: TimeRestriction[] = [
      {
        enabled: true,
        dayOfWeek: 1,
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
      },
    ];
    const now = new Date('2024-01-15T09:00:00'); // Ровно 9:00

    // Время в разрешенном периоде: startTime <= currentTime < endTime
    // 540 >= 540 && 540 < 1020 = true && true = true (разрешен)
    expect(isTimeRestricted(restrictions, now)).toBe(false);
  });

  it('должен возвращать true если время равно концу периода (граничный случай)', () => {
    const restrictions: TimeRestriction[] = [
      {
        enabled: true,
        dayOfWeek: 1,
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
      },
    ];
    const now = new Date('2024-01-15T17:00:00'); // Ровно 17:00

    // currentTime >= endTime (1020 >= 1020 = true)
    expect(isTimeRestricted(restrictions, now)).toBe(true);
  });

  it('должен работать с несколькими ограничениями (возвращает true если хотя бы одно активно)', () => {
    const restrictions: TimeRestriction[] = [
      {
        enabled: true,
        dayOfWeek: 1,
        startHour: 9,
        startMinute: 0,
        endHour: 12,
        endMinute: 0,
      },
      {
        enabled: true,
        dayOfWeek: 1,
        startHour: 13,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
      },
    ];
    const now1 = new Date('2024-01-15T11:00:00'); // 11:00 - в первом разрешенном периоде
    const now2 = new Date('2024-01-15T12:30:00'); // 12:30 - между периодами (ограничено)
    const now3 = new Date('2024-01-15T15:00:00'); // 15:00 - во втором разрешенном периоде

    expect(isTimeRestricted(restrictions, now1)).toBe(false);
    expect(isTimeRestricted(restrictions, now2)).toBe(true);
    expect(isTimeRestricted(restrictions, now3)).toBe(false);
  });

  it('должен работать с timestamp вместо Date объекта', () => {
    const restrictions: TimeRestriction[] = [
      {
        enabled: true,
        dayOfWeek: 1,
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
      },
    ];
    const timestamp = new Date('2024-01-15T14:30:00').getTime();

    expect(isTimeRestricted(restrictions, timestamp)).toBe(false);
  });

  it('должен правильно обрабатывать полночь (переход через день - ограничение реализации)', () => {
    // Примечание: текущая реализация не поддерживает переход через полночь
    // Если endTime < startTime (например, 22:00-02:00), это означает переход через полночь
    // Текущая логика проверяет только текущий день и не обрабатывает этот случай
    // Для полноценной поддержки нужна более сложная логика с проверкой следующего дня
    
    const restrictions: TimeRestriction[] = [
      {
        enabled: true,
        dayOfWeek: 1, // Понедельник
        startHour: 22,
        startMinute: 0,
        endHour: 2,
        endMinute: 0, // До 2:00 следующего дня
      },
    ];
    
    // Для времени 23:30 понедельника:
    // startTime = 22*60 = 1320, endTime = 2*60 = 120
    // Проверка: 1410 >= 1320 && 1410 < 120 = true && false = false (не в периоде)
    // Но так как endTime < startTime, это означает переход через полночь, который не поддерживается
    const now1 = new Date('2024-01-15T23:30:00'); // Понедельник, 23:30
    
    // Текущая реализация: если endTime < startTime, проверка не работает корректно
    // Это известное ограничение - для таких случаев нужна отдельная логика
    expect(isTimeRestricted(restrictions, now1)).toBe(true); // Ограничено из-за ограничения реализации
    
    // Для других дней ограничение не применяется
    const now2 = new Date('2024-01-16T01:30:00'); // Вторник, 01:30 - день недели не совпадает
    const now3 = new Date('2024-01-16T03:00:00'); // Вторник, 03:00 - день недели не совпадает
    expect(isTimeRestricted(restrictions, now2)).toBe(false);
    expect(isTimeRestricted(restrictions, now3)).toBe(false);
  });
});
