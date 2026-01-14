/**
 * Модульные тесты для моделирования KPIs
 * Только детерминированные тесты
 */

import {
  calculateGrowthProjection,
  calculateUnitEconomics,
  checkKPITargets,
  generateInvestorProjection,
} from '@/utils/kpiModeling';

describe('calculateGrowthProjection', () => {
  it('должен создавать прогноз на 6 месяцев', () => {
    const projections = calculateGrowthProjection(1000);

    expect(projections).toHaveLength(6);
    expect(projections[0].month).toBe(1);
    expect(projections[5].month).toBe(6);
  });

  it('должен правильно рассчитывать активации', () => {
    const projections = calculateGrowthProjection(1000, [1.5], 0.6);

    expect(projections[0].activations).toBe(600); // 1000 * 0.6
    expect(projections[0].installs).toBe(1000);
  });

  it('должен правильно рассчитывать DAU', () => {
    const projections = calculateGrowthProjection(1000, [1.5], 0.6, 0.3);

    expect(projections[0].dau).toBe(300); // 1000 * 0.3
  });

  it('должен правильно рассчитывать premium пользователей и MRR', () => {
    const projections = calculateGrowthProjection(
      1000,
      [1.5],
      0.6,
      0.3,
      [0.35],
      [0.20],
      9.99,
      [0.05] // 5% conversion в первый месяц
    );

    // MAU = installs = 1000
    // Premium users = 1000 * 0.05 = 50
    // MRR = 50 * 9.99 = 499.5
    expect(projections[0].premiumUsers).toBe(50);
    expect(projections[0].mrr).toBeCloseTo(499.5, 1);
    expect(projections[0].arr).toBeCloseTo(5994, 1); // 499.5 * 12
  });

  it('должен применять рост к установкам', () => {
    const projections = calculateGrowthProjection(1000, [1.5]); // Множитель 1.5 = +50% рост

    expect(projections[0].installs).toBe(1000);
    expect(projections[1].installs).toBe(1500); // 1000 * 1.5 = 1500
  });
});

describe('calculateUnitEconomics', () => {
  it('должен правильно рассчитывать LTV для premium', () => {
    const economics = calculateUnitEconomics(4, 9.99, 12, 0.05);

    // LTV premium = 9.99 * 12 = 119.88
    // LTV free = 15
    // LTV = 119.88 * 0.05 + 15 * 0.95 = 5.994 + 14.25 = 20.244
    expect(economics.ltv).toBeGreaterThan(15);
    expect(economics.ltv).toBeLessThan(25);
  });

  it('должен правильно рассчитывать LTV/CAC ratio', () => {
    const economics = calculateUnitEconomics(4, 9.99, 12, 0.05);

    expect(economics.ltvCacRatio).toBeGreaterThan(1);
    expect(economics.ltvCacRatio).toBe(economics.ltv / economics.cac);
  });

  it('должен правильно рассчитывать средний доход на пользователя', () => {
    const economics = calculateUnitEconomics(4, 9.99, 12, 0.05);

    // ARPU = 9.99 * 0.05 = 0.4995
    expect(economics.averageRevenuePerUser).toBeCloseTo(0.5, 1);
  });
});

describe('checkKPITargets', () => {
  it('должен проверять достижение целевых KPIs', () => {
    const projections = calculateGrowthProjection();
    const unitEconomics = calculateUnitEconomics();
    const result = checkKPITargets(projections, unitEconomics);

    expect(result.targets).toBeDefined();
    expect(result.achieved).toBeDefined();
    expect(result.targets.dau).toBe(10000);
    expect(result.targets.mau).toBe(50000);
  });

  it('должен правильно определять достижение DAU цели', () => {
    const projections = calculateGrowthProjection();
    const month6 = projections[5];

    // Если DAU >= 10000, то цель достигнута
    const unitEconomics = calculateUnitEconomics();
    const result = checkKPITargets(projections, unitEconomics);

    if (month6.dau >= 10000) {
      expect(result.achieved.dau).toBe(true);
    } else {
      expect(result.achieved.dau).toBe(false);
    }
  });

  it('должен правильно определять достижение CAC цели', () => {
    const projections = calculateGrowthProjection();
    const unitEconomics = calculateUnitEconomics(4); // CAC = 4

    const result = checkKPITargets(projections, unitEconomics);

    // Цель: CAC <= 10
    expect(result.achieved.cac).toBe(true); // 4 <= 10
  });
});

describe('generateInvestorProjection', () => {
  it('должен генерировать полный прогноз для инвесторов', () => {
    const result = generateInvestorProjection();

    expect(result.projections).toBeDefined();
    expect(result.projections).toHaveLength(6);
    expect(result.unitEconomics).toBeDefined();
    expect(result.kpiStatus).toBeDefined();
    expect(result.summary).toBeDefined();
  });

  it('должен включать итоговую статистику', () => {
    const result = generateInvestorProjection();

    expect(result.summary.totalUsers).toBeGreaterThan(0);
    expect(result.summary.totalRevenue).toBeGreaterThanOrEqual(0);
    expect(result.summary.arr).toBeGreaterThanOrEqual(0);
    expect(typeof result.summary.allTargetsMet).toBe('boolean');
  });

  it('должен быть детерминированным (одинаковые результаты)', () => {
    const result1 = generateInvestorProjection();
    const result2 = generateInvestorProjection();

    expect(result1.summary.totalUsers).toBe(result2.summary.totalUsers);
    expect(result1.summary.arr).toBe(result2.summary.arr);
  });
});
