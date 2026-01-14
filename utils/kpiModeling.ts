/**
 * Моделирование и расчет KPIs для KIDS by KIKU
 * Используется для прогнозов и презентаций инвесторам
 */

export interface GrowthProjection {
  month: number;
  installs: number;
  activations: number;
  dau: number;
  mau: number;
  retentionD7: number;
  retentionD30: number;
  premiumUsers: number;
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
}

export interface UnitEconomics {
  cac: number; // Customer Acquisition Cost
  ltv: number; // Lifetime Value
  ltvCacRatio: number;
  premiumConversionRate: number;
  averageRevenuePerUser: number;
}

export interface KPITargets {
  dau: number;
  mau: number;
  userGrowthRate: number; // MoM %
  retentionD7: number;
  retentionD30: number;
  activationRate: number;
  premiumConversionRate: number;
  cac: number;
  ltv: number;
  ltvCacRatio: number;
}

/**
 * Прогноз роста на 6 месяцев
 */
export function calculateGrowthProjection(
  initialInstalls: number = 1000,
  growthRate: number[] = [1.5, 1.0, 0.6, 0.5, 0.25], // Месячный рост (множитель)
  activationRate: number = 0.6,
  dauRate: number = 0.3, // % от установок
  retentionD7: number[] = [0.35, 0.40, 0.42, 0.45, 0.45, 0.45],
  retentionD30: number[] = [0.20, 0.25, 0.28, 0.30, 0.30, 0.30],
  premiumPrice: number = 9.99,
  premiumConversionRates: number[] = [0, 0, 0, 0.03, 0.05, 0.06] // Месяц 1-3: free модель
): GrowthProjection[] {
  const projections: GrowthProjection[] = [];
  let currentInstalls = initialInstalls;

  for (let month = 1; month <= 6; month++) {
    const activations = Math.round(currentInstalls * activationRate);
    const dau = Math.round(currentInstalls * dauRate);
    const mau = currentInstalls; // Упрощение: MAU = установки за месяц

    const premiumConversionRate = premiumConversionRates[month - 1] || 0;
    const premiumUsers = Math.round(mau * premiumConversionRate);
    const mrr = premiumUsers * premiumPrice;
    const arr = mrr * 12;

    projections.push({
      month,
      installs: currentInstalls,
      activations,
      dau,
      mau,
      retentionD7: retentionD7[month - 1] || 0.45,
      retentionD30: retentionD30[month - 1] || 0.30,
      premiumUsers,
      mrr,
      arr,
    });

    // Рост для следующего месяца
    if (month < 6) {
      const growth = growthRate[month - 1] || 1.25; // Множитель роста (1.25 = +25%)
      currentInstalls = Math.round(currentInstalls * growth);
    }
  }

  return projections;
}

/**
 * Расчет Unit Economics
 */
export function calculateUnitEconomics(
  cac: number = 4, // Средний CAC
  premiumPrice: number = 9.99,
  averageLifetimeMonths: number = 12,
  premiumConversionRate: number = 0.05,
  freeUserValue: number = 15 // Косвенная ценность free пользователя
): UnitEconomics {
  const ltvPremium = premiumPrice * averageLifetimeMonths;
  const ltvFree = freeUserValue;
  const ltv = ltvPremium * premiumConversionRate + ltvFree * (1 - premiumConversionRate);
  const ltvCacRatio = ltv / cac;
  const averageRevenuePerUser = premiumPrice * premiumConversionRate;

  return {
    cac,
    ltv,
    ltvCacRatio,
    premiumConversionRate,
    averageRevenuePerUser,
  };
}

/**
 * Проверка достижения целевых KPIs
 */
export function checkKPITargets(
  projections: GrowthProjection[],
  unitEconomics: UnitEconomics
): { targets: KPITargets; achieved: Partial<Record<keyof KPITargets, boolean>> } {
  const month6 = projections[5]; // 6-й месяц

  const targets: KPITargets = {
    dau: 10000,
    mau: 50000,
    userGrowthRate: 25, // %
    retentionD7: 40, // %
    retentionD30: 25, // %
    activationRate: 50, // %
    premiumConversionRate: 5, // %
    cac: 10,
    ltv: 50,
    ltvCacRatio: 3,
  };

  const achieved: Partial<Record<keyof KPITargets, boolean>> = {
    dau: month6.dau >= targets.dau,
    mau: month6.mau >= targets.mau,
    retentionD7: month6.retentionD7 * 100 >= targets.retentionD7,
    retentionD30: month6.retentionD30 * 100 >= targets.retentionD30,
    premiumConversionRate: unitEconomics.premiumConversionRate * 100 >= targets.premiumConversionRate,
    cac: unitEconomics.cac <= targets.cac,
    ltv: unitEconomics.ltv >= targets.ltv,
    ltvCacRatio: unitEconomics.ltvCacRatio >= targets.ltvCacRatio,
  };

  // Расчет user growth rate (MoM)
  if (projections.length >= 2) {
    const month5 = projections[4];
    const month6 = projections[5];
    const growthRate = ((month6.mau - month5.mau) / month5.mau) * 100;
    achieved.userGrowthRate = growthRate >= targets.userGrowthRate;
  }

  // Расчет activation rate
  const activationRate = (month6.activations / month6.installs) * 100;
  achieved.activationRate = activationRate >= targets.activationRate;

  return { targets, achieved };
}

/**
 * Генерация прогноза для презентации
 */
export function generateInvestorProjection(): {
  projections: GrowthProjection[];
  unitEconomics: UnitEconomics;
  kpiStatus: { targets: KPITargets; achieved: Partial<Record<keyof KPITargets, boolean>> };
  summary: {
    totalUsers: number;
    totalRevenue: number;
    arr: number;
    allTargetsMet: boolean;
  };
} {
  const projections = calculateGrowthProjection();
  const unitEconomics = calculateUnitEconomics();
  const kpiStatus = checkKPITargets(projections, unitEconomics);

  const month6 = projections[5];
  const totalUsers = month6.mau;
  const totalRevenue = projections.reduce((sum, p) => sum + p.mrr, 0);
  const arr = month6.arr;
  const allTargetsMet = Object.values(kpiStatus.achieved).every((v) => v === true);

  return {
    projections,
    unitEconomics,
    kpiStatus,
    summary: {
      totalUsers,
      totalRevenue,
      arr,
      allTargetsMet,
    },
  };
}
