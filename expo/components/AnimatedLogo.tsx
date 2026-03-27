import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';
import Svg, { Path, G, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

interface AnimatedLogoProps {
  size?: number;
  /** Длительность одного полного оборота в мс */
  duration?: number;
  style?: ViewStyle;
}

// ─── Геометрия ────────────────────────────────────────────────────────────────
const CX = 50, CY = 50;
const MID_R  = 27;   // радиус центра кольца
const ARM_W  = 14;   // толщина руки
const OUTER  = MID_R + ARM_W / 2;  // = 34
const INNER  = MID_R - ARM_W / 2;  // = 20

function toRad(d: number) { return (d * Math.PI) / 180; }
function pt(r: number, deg: number) {
  return { x: CX + r * Math.cos(toRad(deg)), y: CY + r * Math.sin(toRad(deg)) };
}
function f(n: number) { return n.toFixed(3); }

/** Контур сектора кольца от startDeg до endDeg */
function sectorPath(startDeg: number, endDeg: number): string {
  const os = pt(OUTER, startDeg);
  const oe = pt(OUTER, endDeg);
  const ie = pt(INNER, endDeg);
  const is_ = pt(INNER, startDeg);

  // Скруглённый конец запястья — маленький полукруг между outer и inner
  const wristMid = pt((OUTER + INNER) / 2, endDeg + 4);

  return [
    `M ${f(os.x)} ${f(os.y)}`,
    `A ${OUTER} ${OUTER} 0 0 1 ${f(oe.x)} ${f(oe.y)}`,
    `Q ${f(wristMid.x)} ${f(wristMid.y)} ${f(ie.x)} ${f(ie.y)}`,
    `A ${INNER} ${INNER} 0 0 0 ${f(is_.x)} ${f(is_.y)}`,
    'Z',
  ].join(' ');
}

/** 4 пальца — короткие дуги, торчащие за внешним краем у «ладони» */
function fingersPath(palmDeg: number): string {
  const fingerLen = 5.5;
  const offsets = [-7.5, -2.5, 2.5, 7.5]; // углы 4-х пальцев

  return offsets.map(off => {
    const deg = palmDeg + off;
    const base = pt(OUTER, deg);
    const tip  = pt(OUTER + fingerLen, deg);
    // Лёгкий изгиб пальца: контрольная точка чуть «внутрь»
    const ctrl = pt(OUTER + fingerLen * 0.6, deg - 3);
    return [
      `M ${f(base.x)} ${f(base.y)}`,
      `Q ${f(ctrl.x)} ${f(ctrl.y)} ${f(tip.x)} ${f(tip.y)}`,
    ].join(' ');
  }).join(' ');
}

// ─── Данные 4-х рук (каждая ~80°, разрыв 10°) ─────────────────────────────
// «Ладонь» — начало (startDeg), «Запястье» — конец (endDeg)
const ARMS = [
  { start: 5,   end: 83  },   // правая рука →↓
  { start: 95,  end: 173 },   // нижняя рука ↓←
  { start: 185, end: 263 },   // левая рука ←↑
  { start: 275, end: 353 },   // верхняя рука ↑→
];

// ─── Компонент ────────────────────────────────────────────────────────────────
export function AnimatedLogo({ size = 120, duration = 9000, style }: AnimatedLogoProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration,
        useNativeDriver: false,
        easing: (t) => t,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [duration, rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const radius = size * 0.22;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: '#0F1E38',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={{ width: size, height: size, transform: [{ rotate }] }}
      >
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Defs>
            {/* Основной золотой градиент (металлик) */}
            <LinearGradient id="goldMain" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0"    stopColor="#F5E07A" />
              <Stop offset="0.35" stopColor="#C9A84C" />
              <Stop offset="0.7"  stopColor="#A07830" />
              <Stop offset="1"    stopColor="#C9A84C" />
            </LinearGradient>
            {/* Блик на пальцах — чуть светлее */}
            <LinearGradient id="goldFinger" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#F8EAA0" />
              <Stop offset="1" stopColor="#C9A84C" />
            </LinearGradient>
            {/* Мягкая тень под руками */}
            <RadialGradient id="shadow" cx="50%" cy="50%" r="50%">
              <Stop offset="0.55" stopColor="#000000" stopOpacity="0" />
              <Stop offset="1"    stopColor="#000000" stopOpacity="0.35" />
            </RadialGradient>
          </Defs>

          {/* Тень кольца */}
          <Path
            d={ARMS.map(a => sectorPath(a.start + 2, a.end + 2)).join(' ')}
            fill="#000000"
            fillOpacity={0.25}
            transform="translate(1.5, 1.5)"
          />

          {/* 4 руки */}
          {ARMS.map((arm, i) => (
            <G key={i}>
              {/* Основное тело руки */}
              <Path
                d={sectorPath(arm.start, arm.end)}
                fill="url(#goldMain)"
              />
              {/* Блик — светлая полоса по центру дуги */}
              <Path
                d={sectorPath(arm.start + 8, arm.end - 8)}
                fill="#F5E07A"
                fillOpacity={0.28}
              />
              {/* Пальцы */}
              <Path
                d={fingersPath(arm.start)}
                stroke="url(#goldFinger)"
                strokeWidth={OUTER * 2.8 / 100 * (100 / size) * size / 10}
                strokeLinecap="round"
                fill="none"
              />
            </G>
          ))}

          {/* Радиальная тень для объёма */}
          <Path
            d={ARMS.map(a => sectorPath(a.start, a.end)).join(' ')}
            fill="url(#shadow)"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
