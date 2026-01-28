import { z } from "zod";
import { publicProcedure } from "../../create-context.js";
import { supabase } from "../../../utils/supabase.js";
import { sanitizeDeviceId } from "../../../utils/security.js";
import { rateLimiters } from "../../middleware/rateLimit.js";

/**
 * Валидация кода родителя (используется в register-child и validate-code)
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

/**
 * Определение версии UI по возрасту
 */
function getUIVersion(age: number): 'young' | 'middle' | 'standard' {
  if (age >= 4 && age <= 7) return 'young';
  if (age >= 8 && age <= 11) return 'middle';
  return 'standard';
}

export const registerChildProcedure = publicProcedure
  .use(rateLimiters.general)
  .input(
    z.object({
      parentCode: z.string().regex(/^KIKU-[A-Z0-9]{6}$/, 'Неверный формат кода'),
      name: z.string().min(1).max(100),
      age: z.number().int().min(4).max(15),
      email: z.string().email().optional(),
    })
  )
  .mutation(async ({ input }) => {
    if (!supabase) {
      throw new Error("Supabase клиент не инициализирован");
    }

    const timestamp = Date.now();
    const childId = `child_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    const deviceId = `device_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Валидируем код родителя
      const codeValidation = await validateParentCode(input.parentCode);
      
      if (!codeValidation.valid || !codeValidation.parentId) {
        return {
          success: false,
          error: codeValidation.error || 'Код недействителен',
        };
      }

      const parentId = codeValidation.parentId;
      const uiVersion = getUIVersion(input.age);

      // Создаем ребенка
      const { error: childError } = await supabase
        .from('children')
        .insert({
          id: childId,
          parent_id: parentId,
          name: input.name,
          age: input.age,
          email: input.email || null,
          email_verified: false,
          device_id: deviceId,
          ui_version: uiVersion,
          created_at: timestamp,
          updated_at: timestamp,
          is_active: true,
        });

      if (childError) {
        console.error('[registerChildProcedure] Error:', childError);
        throw new Error('Ошибка при создании профиля ребенка');
      }

      // Получаем текущее значение used_count и обновляем
      const { data: codeData } = await supabase
        .from('parent_codes')
        .select('used_count')
        .eq('code', input.parentCode)
        .single();

      const newUsedCount = (codeData?.used_count || 0) + 1;

      // Обновляем счетчик использований кода
      const { error: codeUpdateError } = await supabase
        .from('parent_codes')
        .update({
          used_count: newUsedCount,
          last_used_at: timestamp,
        })
        .eq('code', input.parentCode);

      if (codeUpdateError) {
        console.error('[registerChildProcedure] Code update error:', codeUpdateError);
        // Не критично, продолжаем
      }

      // Логируем использование кода
      await supabase
        .from('code_usage_log')
        .insert({
          id: `log_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
          code: input.parentCode,
          child_id: childId,
          used_at: timestamp,
          device_id: deviceId,
        });

      // Создаем запись активности родителя
      await supabase
        .from('parent_activity')
        .upsert({
          parent_id: parentId,
          child_id: childId,
          is_online: false,
          last_seen: timestamp,
          updated_at: timestamp,
        }, { onConflict: 'parent_id,child_id' });

      return {
        success: true,
        childId,
        deviceId,
        parentId,
        parentName: codeValidation.parentName,
        uiVersion,
        message: 'Регистрация успешна! Устройства связаны.',
      };
    } catch (error) {
      console.error('[registerChildProcedure] Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      };
    }
  });
