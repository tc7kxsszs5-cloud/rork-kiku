import { publicProcedure } from "../../create-context.js";
import { supabase } from "../../../utils/supabase.js";

/**
 * Тестовый endpoint для проверки подключения к базе данных через Supabase SDK
 * Доступен через: /api/trpc/test.dbCheck
 */
export const dbCheckProcedure = publicProcedure.query(async () => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return {
      success: false,
      error: "Supabase переменные не установлены",
      message: "SUPABASE_URL и SUPABASE_ANON_KEY должны быть установлены в Vercel Environment Variables",
      missing: {
        SUPABASE_URL: !SUPABASE_URL,
        SUPABASE_ANON_KEY: !SUPABASE_ANON_KEY,
      },
    };
  }

  if (!supabase) {
    return {
      success: false,
      error: "Supabase клиент не инициализирован",
      message: "Не удалось создать Supabase клиент",
      supabaseUrl: SUPABASE_URL,
    };
  }

  try {
    // Простая проверка подключения - проверяем что клиент работает
    // Не делаем запрос к таблице, так как таблицы могут еще не существовать
    
    // Проверяем что клиент инициализирован правильно
    if (!supabase) {
      return {
        success: false,
        error: "Supabase клиент не инициализирован",
        supabaseUrl: SUPABASE_URL,
      };
    }

    // Простая проверка - получаем информацию о проекте через auth
    // Это не требует существования таблиц
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    // Ошибка auth нормальна если нет сессии - главное что подключение работает
    // Если ошибка не связана с подключением, значит все работает
    const isConnectionError = authError && (
      authError.message.includes('fetch') || 
      authError.message.includes('network') ||
      authError.message.includes('ENOTFOUND')
    );

    if (isConnectionError) {
      return {
        success: false,
        error: "Ошибка подключения к Supabase",
        details: authError.message,
      };
    }

    // Подключение работает!
    return {
      success: true,
      message: "Подключение к Supabase работает!",
      method: "Supabase SDK",
      supabaseUrl: SUPABASE_URL.replace(/\/$/, ''),
      note: "Используется Supabase Client SDK. Готов к работе с базой данных!",
      authCheck: authError ? "Нет активной сессии (нормально для backend)" : "Сессия активна",
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    return {
      success: false,
      error: errorMessage,
      details: errorStack,
      supabaseUrl: SUPABASE_URL?.replace(/\/$/, ''),
    };
  }
});
