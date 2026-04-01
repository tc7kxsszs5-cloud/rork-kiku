import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Car,
  MapPin,
  Navigation,
  Clock,
  Shield,
  Play,
  Square,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Gauge,
} from 'lucide-react-native';
import { useThemeMode, ThemePalette } from '@/constants/ThemeContext';
import { HapticFeedback } from '@/constants/haptics';

type TripStatus = 'active' | 'completed' | 'cancelled';

interface CarTrip {
  id: string;
  childName: string;
  origin: string;
  destination: string;
  startTime: number;
  endTime?: number;
  status: TripStatus;
  distanceKm: number;
  durationMin: number;
  maxSpeedKmh: number;
  safeArrival: boolean;
}

const MOCK_TRIPS: CarTrip[] = [
  {
    id: '1',
    childName: 'Алиса',
    origin: 'Дом',
    destination: 'Школа №47',
    startTime: Date.now() - 15 * 60 * 1000,
    status: 'active',
    distanceKm: 4.2,
    durationMin: 15,
    maxSpeedKmh: 60,
    safeArrival: false,
  },
  {
    id: '2',
    childName: 'Алиса',
    origin: 'Школа №47',
    destination: 'Спортивная секция',
    startTime: Date.now() - 2 * 60 * 60 * 1000,
    endTime: Date.now() - 90 * 60 * 1000,
    status: 'completed',
    distanceKm: 3.1,
    durationMin: 12,
    maxSpeedKmh: 55,
    safeArrival: true,
  },
  {
    id: '3',
    childName: 'Максим',
    origin: 'Дом',
    destination: 'Поликлиника',
    startTime: Date.now() - 24 * 60 * 60 * 1000,
    endTime: Date.now() - 23 * 60 * 60 * 1000,
    status: 'completed',
    distanceKm: 6.8,
    durationMin: 22,
    maxSpeedKmh: 70,
    safeArrival: true,
  },
];

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(timestamp: number): string {
  const today = new Date();
  const date = new Date(timestamp);
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth()
  ) {
    return 'Сегодня';
  }
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth()
  ) {
    return 'Вчера';
  }
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

export default function CarTripScreen() {
  const { theme, themeMode } = useThemeMode();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [trips, setTrips] = useState<CarTrip[]>(MOCK_TRIPS);
  const [showNewTripForm, setShowNewTripForm] = useState(false);

  const activeTrip = useMemo(
    () => trips.find((t) => t.status === 'active'),
    [trips]
  );
  const historyTrips = useMemo(
    () =>
      trips
        .filter((t) => t.status !== 'active')
        .sort((a, b) => b.startTime - a.startTime),
    [trips]
  );

  const elapsedMin = activeTrip
    ? Math.round((Date.now() - activeTrip.startTime) / 60000)
    : 0;

  const handleEndTrip = useCallback(() => {
    HapticFeedback.light();
    Alert.alert(
      'Завершить поездку',
      'Отметить поездку как завершённую с безопасным прибытием?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Завершить',
          onPress: () => {
            setTrips((prev) =>
              prev.map((t) =>
                t.status === 'active'
                  ? { ...t, status: 'completed', endTime: Date.now(), safeArrival: true }
                  : t
              )
            );
            HapticFeedback.success();
          },
        },
      ]
    );
  }, []);

  const handleStartTrip = useCallback(() => {
    HapticFeedback.light();
    setShowNewTripForm(true);
  }, []);

  const handleCreateTrip = useCallback(() => {
    const newTrip: CarTrip = {
      id: Date.now().toString(),
      childName: 'Алиса',
      origin: 'Дом',
      destination: 'Назначение',
      startTime: Date.now(),
      status: 'active',
      distanceKm: 0,
      durationMin: 0,
      maxSpeedKmh: 0,
      safeArrival: false,
    };
    setTrips((prev) => [newTrip, ...prev.filter((t) => t.status !== 'active')]);
    setShowNewTripForm(false);
    HapticFeedback.success();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero header */}
      <LinearGradient
        colors={
          themeMode === 'midnight' ? theme.surfaceGradient : theme.heroGradient
        }
        style={styles.header}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.headerIcon}>
          <Car size={32} color={theme.accentPrimary} />
        </View>
        <Text style={styles.headerTitle}>CarWrap</Text>
        <Text style={styles.headerSubtitle}>Мониторинг поездок</Text>

        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Shield size={14} color={theme.success} />
            <Text style={[styles.statChipText, { color: theme.success }]}>
              {historyTrips.filter((t) => t.safeArrival).length} безопасных
            </Text>
          </View>
          <View style={styles.statChip}>
            <Car size={14} color={theme.accentPrimary} />
            <Text style={[styles.statChipText, { color: theme.accentPrimary }]}>
              {trips.length} поездок
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Active trip card */}
      {activeTrip ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Активная поездка</Text>
          <View style={[styles.activeTripCard, { borderColor: theme.warning }]}>
            <View style={styles.activeTripHeader}>
              <View style={styles.activeDot} />
              <Text style={styles.activeTripLabel}>В пути</Text>
              <Text style={styles.activeTripTime}>
                {elapsedMin} мин
              </Text>
            </View>

            <View style={styles.routeRow}>
              <View style={styles.routePoint}>
                <View style={[styles.routeDot, { backgroundColor: theme.success }]} />
                <Text style={styles.routeText}>{activeTrip.origin}</Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routePoint}>
                <Navigation size={14} color={theme.accentPrimary} />
                <Text style={styles.routeText}>{activeTrip.destination}</Text>
              </View>
            </View>

            <View style={styles.activeTripMeta}>
              <View style={styles.metaItem}>
                <Clock size={14} color={theme.textSecondary} />
                <Text style={styles.metaText}>
                  Старт: {formatTime(activeTrip.startTime)}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Gauge size={14} color={theme.textSecondary} />
                <Text style={styles.metaText}>
                  {activeTrip.childName}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.endTripButton}
              onPress={handleEndTrip}
            >
              <Square size={16} color="#fff" />
              <Text style={styles.endTripButtonText}>Завершить поездку</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.startTripButton}
            onPress={handleStartTrip}
          >
            <Play size={20} color="#fff" />
            <Text style={styles.startTripButtonText}>Начать поездку</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* New trip confirmation */}
      {showNewTripForm && (
        <View style={styles.newTripConfirm}>
          <Text style={styles.newTripConfirmTitle}>Новая поездка</Text>
          <Text style={styles.newTripConfirmSubtitle}>
            Мониторинг поездки будет запущен немедленно
          </Text>
          <View style={styles.newTripActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => { setShowNewTripForm(false); HapticFeedback.light(); }}
            >
              <Text style={styles.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleCreateTrip}
            >
              <Text style={styles.confirmButtonText}>Запустить</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Trip history */}
      {historyTrips.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>История поездок</Text>
          {historyTrips.map((trip) => (
            <TripHistoryCard key={trip.id} trip={trip} styles={styles} theme={theme} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function TripHistoryCard({
  trip,
  styles,
  theme,
}: {
  trip: CarTrip;
  styles: ReturnType<typeof createStyles>;
  theme: ThemePalette;
}) {
  return (
    <View style={styles.historyCard}>
      <View style={styles.historyCardLeft}>
        <View
          style={[
            styles.historyStatusIcon,
            {
              backgroundColor: trip.safeArrival
                ? (theme.success + '22')
                : (theme.danger + '22'),
            },
          ]}
        >
          {trip.safeArrival ? (
            <CheckCircle size={20} color={theme.success} />
          ) : (
            <AlertTriangle size={20} color={theme.danger} />
          )}
        </View>
      </View>

      <View style={styles.historyCardBody}>
        <View style={styles.historyRouteRow}>
          <MapPin size={12} color={theme.textSecondary} />
          <Text style={styles.historyRoute} numberOfLines={1}>
            {trip.origin} → {trip.destination}
          </Text>
        </View>
        <Text style={styles.historyChild}>{trip.childName}</Text>
        <View style={styles.historyMeta}>
          <Text style={styles.historyMetaText}>
            {formatDate(trip.startTime)}, {formatTime(trip.startTime)}
          </Text>
          <Text style={styles.historyMetaDot}>·</Text>
          <Text style={styles.historyMetaText}>{trip.durationMin} мин</Text>
          <Text style={styles.historyMetaDot}>·</Text>
          <Text style={styles.historyMetaText}>{trip.distanceKm} км</Text>
        </View>
      </View>

      <ChevronRight size={18} color={theme.borderSoft} />
    </View>
  );
}

const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
    },
    content: {
      paddingBottom: 32,
    },
    header: {
      paddingTop: 24,
      paddingBottom: 28,
      paddingHorizontal: 24,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      alignItems: 'center',
    },
    headerIcon: {
      width: 64,
      height: 64,
      borderRadius: 20,
      backgroundColor: theme.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      borderWidth: 2,
      borderColor: theme.accentPrimary,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '800' as const,
      color: theme.textPrimary,
      letterSpacing: 0.5,
    },
    headerSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
      marginBottom: 16,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 12,
    },
    statChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: theme.card,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.borderSoft,
    },
    statChipText: {
      fontSize: 13,
      fontWeight: '600' as const,
    },
    section: {
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: theme.textPrimary,
      marginBottom: 12,
    },
    activeTripCard: {
      backgroundColor: theme.card,
      borderRadius: 18,
      padding: 18,
      borderWidth: 2,
      shadowColor: theme.warning,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    activeTripHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 8,
    },
    activeDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#22c55e',
    },
    activeTripLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: '700' as const,
      color: theme.textPrimary,
    },
    activeTripTime: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.warning,
    },
    routeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
      gap: 8,
    },
    routePoint: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    routeDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    routeText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.textPrimary,
    },
    routeLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.borderSoft,
      marginHorizontal: 4,
    },
    activeTripMeta: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 16,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    metaText: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    endTripButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: '#ef4444',
      borderRadius: 12,
      paddingVertical: 12,
    },
    endTripButtonText: {
      fontSize: 15,
      fontWeight: '700' as const,
      color: '#fff',
    },
    startTripButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      backgroundColor: theme.accentPrimary,
      borderRadius: 16,
      paddingVertical: 16,
      shadowColor: theme.accentPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 5,
    },
    startTripButtonText: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: theme.isDark ? theme.backgroundPrimary : '#fff',
    },
    newTripConfirm: {
      marginHorizontal: 16,
      marginTop: 12,
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.borderSoft,
    },
    newTripConfirmTitle: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: theme.textPrimary,
      marginBottom: 4,
    },
    newTripConfirmSubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      marginBottom: 16,
    },
    newTripActions: {
      flexDirection: 'row',
      gap: 10,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 11,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: theme.borderSoft,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.textSecondary,
    },
    confirmButton: {
      flex: 1,
      paddingVertical: 11,
      borderRadius: 10,
      backgroundColor: theme.accentPrimary,
      alignItems: 'center',
    },
    confirmButtonText: {
      fontSize: 14,
      fontWeight: '700' as const,
      color: theme.isDark ? theme.backgroundPrimary : '#fff',
    },
    historyCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.borderSoft,
      gap: 12,
    },
    historyCardLeft: {
      flexShrink: 0,
    },
    historyStatusIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    historyCardBody: {
      flex: 1,
    },
    historyRouteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 2,
    },
    historyRoute: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.textPrimary,
      flex: 1,
    },
    historyChild: {
      fontSize: 12,
      color: theme.accentPrimary,
      fontWeight: '600' as const,
      marginBottom: 4,
    },
    historyMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    historyMetaText: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    historyMetaDot: {
      fontSize: 12,
      color: theme.borderSoft,
    },
  });
