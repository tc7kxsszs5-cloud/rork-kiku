import { z } from "zod";
import { publicProcedure } from "../../create-context.js";
import { supabase } from "../../../utils/supabase.js";
import { rateLimiters } from "../../middleware/rateLimit.js";

/**
 * Валидация кода родителя
 */
async function validateParentCode(code: string): Promise<{ valid: boolean; parentId?: string; parentName?: string; remainingUses?: number; error?: string }> {
  if (!supabase) {
    return { valid: false, error: 'Supabase клиент не инициализирован' };
  }

  // Проверяем формат кода
  if (!/^KIKU-[A-Z0-9]{6}$/.test(code)) {
    return { valid: false, error: 'Неверный формат кода' };
  }

  const { data, error } = await supabase
    .from('parent_codes')
    .select('*, parents(name)')
    .eq('code', code)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return { valid: false, error: 'Код не найден или недействителен' };
  }

  // Проверяем срок действия
  if (data.expires_at && data.expires_at < Date.now()) {
    return { valid: false, error: 'Срок действия кода истек' };
  }

  // Проверяем количество использований
  if (data.used_count >= data.max_uses) {
    return { valid: false, error: 'Код использован максимальное количество раз' };
  }

  return {
    valid: true,
    parentId: data.parent_id,
    parentName: (data.parents as any)?.name || 'Родитель',
    remainingUses: data.max_uses - data.used_count - 1,
  };
}

export const validateParentCodeProcedure = publicProcedure
  .use(rateLimiters.general)
  .input(
    z.object({
      code: z.string().regex(/^KIKU-[A-Z0-9]{6}$/, 'Неверный формат кода'),
    })
  )
  .query(async ({ input }) => {
    try {
      const validation = await validateParentCode(input.code);
      
      return {
        valid: validation.valid,
        parentName: validation.parentName,
        remainingUses: validation.remainingUses,
        error: validation.error,
      };
    } catch (error) {
      console.error('[validateParentCodeProcedure] Error:', error);
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Ошибка при проверке кода',
      };
    }
  });
