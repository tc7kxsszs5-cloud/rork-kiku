import { z } from "zod";
import { publicProcedure } from "../../create-context.js";
import { supabase } from "../../../utils/supabase.js";
import { sanitizeEmail } from "../../../utils/security.js";
import { rateLimiters } from "../../middleware/rateLimit.js";

/**
 * Генерация уникального кода родителя
 * Формат: KIKU-XXXXXX (6 символов)
 */
function generateParentCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Исключаем похожие символы (0, O, I, 1)
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `KIKU-${code}`;
}

/**
 * Проверка уникальности кода
 */
async function isCodeUnique(code: string): Promise<boolean> {
  if (!supabase) return false;
  
  const { data } = await supabase
    .from('parent_codes')
    .select('code')
    .eq('code', code)
    .single();
  
  return !data;
}

/**
 * Создание уникального кода
 */
async function createUniqueCode(): Promise<string> {
  let code = generateParentCode();
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!(await isCodeUnique(code)) && attempts < maxAttempts) {
    code = generateParentCode();
    attempts++;
  }
  
  if (attempts >= maxAttempts) {
    throw new Error('Не удалось создать уникальный код. Попробуйте позже.');
  }
  
  return code;
}

export const registerParentProcedure = publicProcedure
  .use(rateLimiters.general)
  .input(
    z.object({
      name: z.string().min(1).max(100),
      email: z.string().email(),
      phone: z.string().optional(),
      country: z.string().default('US'),
      state: z.string().optional(),
      coppaConsent: z.boolean().refine(val => val === true, {
        message: 'Необходимо согласие с COPPA',
      }),
      privacyPolicyAccepted: z.boolean().refine(val => val === true, {
        message: 'Необходимо принять политику конфиденциальности',
      }),
    })
  )
  .mutation(async ({ input }) => {
    if (!supabase) {
      throw new Error("Supabase клиент не инициализирован");
    }

    const timestamp = Date.now();
    const parentId = `parent_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Sanitize email
      const sanitizedEmail = sanitizeEmail(input.email);

      // Проверяем, не существует ли уже родитель с таким email
      const { data: existing } = await supabase
        .from('parents')
        .select('id')
        .eq('email', sanitizedEmail)
        .single();

      if (existing) {
        return {
          success: false,
          error: 'Родитель с таким email уже зарегистрирован',
        };
      }

      // Создаем родителя
      const { data: parentData, error: parentError } = await supabase
        .from('parents')
        .insert({
          id: parentId,
          email: sanitizedEmail,
          email_verified: false, // Будет верифицирован по email
          name: input.name,
          phone: input.phone || null,
          pin_hash: '', // Будет установлен позже
          created_at: timestamp,
          updated_at: timestamp,
          country: input.country || 'US',
          state: input.state || null,
          coppa_consent: input.coppaConsent,
          coppa_consent_date: input.coppaConsent ? timestamp : null,
          privacy_policy_accepted: input.privacyPolicyAccepted,
          privacy_policy_date: input.privacyPolicyAccepted ? timestamp : null,
        })
        .select()
        .single();

      if (parentError) {
        console.error('[registerParentProcedure] Supabase Error:', JSON.stringify(parentError, null, 2));
        console.error('[registerParentProcedure] Error Code:', parentError.code);
        console.error('[registerParentProcedure] Error Message:', parentError.message);
        console.error('[registerParentProcedure] Error Details:', parentError.details);
        console.error('[registerParentProcedure] Error Hint:', parentError.hint);
        
        // Возвращаем детали ошибки вместо throw
        return {
          success: false,
          error: `Ошибка при создании аккаунта родителя: ${parentError.message || parentError.code || 'Неизвестная ошибка'}`,
          errorCode: parentError.code,
          errorDetails: parentError.details,
          errorHint: parentError.hint,
          fullError: process.env.NODE_ENV === 'development' ? JSON.stringify(parentError, null, 2) : undefined,
        };
      }

      // Генерируем уникальный код
      const code = await createUniqueCode();

      // Создаем код родителя (бессрочный, максимум 10 детей)
      const { error: codeError } = await supabase
        .from('parent_codes')
        .insert({
          code,
          parent_id: parentId,
          created_at: timestamp,
          expires_at: null, // Бессрочно
          used_count: 0,
          max_uses: 10,
          is_active: true,
        });

      if (codeError) {
        console.error('[registerParentProcedure] Code creation error:', codeError);
        return {
          success: false,
          error: `Ошибка при создании кода: ${codeError.message || codeError.code || 'Неизвестная ошибка'}`,
          errorCode: codeError.code,
          errorDetails: codeError.details,
          errorHint: codeError.hint,
        };
      }

      return {
        success: true,
        parentId,
        code,
        message: 'Регистрация успешна! Сохраните код для регистрации ребенка.',
      };
    } catch (error) {
      console.error('[registerParentProcedure] Error:', error);
      
      // Если это ошибка Supabase, передаем детали
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = error.message as string;
        const errorCode = 'code' in error ? (error.code as string) : undefined;
        const errorDetails = 'details' in error ? (error.details as string) : undefined;
        const errorHint = 'hint' in error ? (error.hint as string) : undefined;
        
        return {
          success: false,
          error: errorMessage,
          errorCode,
          errorDetails,
          errorHint,
          fullError: process.env.NODE_ENV === 'development' ? JSON.stringify(error, null, 2) : undefined,
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        fullError: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      };
    }
  });
