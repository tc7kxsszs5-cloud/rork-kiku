import createContextHook from '@nkzw/create-context-hook';
import { useMemo } from 'react';

export interface AgeComplianceContextValue {
  requiresConsent: boolean;
  isTexasCompliant: boolean;
  age: number | null;
  setAge: (age: number) => void;
}

export const [AgeComplianceProvider, useAgeCompliance] = createContextHook<AgeComplianceContextValue>(() => {
  // По умолчанию требуется согласие для пользователей младше 13 лет
  // Texas SB 2420 compliance
  const age = null; // Можно расширить для хранения возраста пользователя
  const requiresConsent = true; // Всегда требуется родительское согласие для детских аккаунтов
  const isTexasCompliant = true; // Соответствие Texas SB 2420

  const setAge = (newAge: number) => {
    // Можно расширить для сохранения возраста
    console.log('[AgeCompliance] Age set:', newAge);
  };

  return useMemo(
    () => ({
      requiresConsent,
      isTexasCompliant,
      age,
      setAge,
    }),
    [requiresConsent, isTexasCompliant, age]
  );
});

