import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { X, Plus, Camera } from 'lucide-react-native';
import { useThemeMode } from '@/constants/ThemeContext';
import { useAuth } from '@/constants/AuthContext';
import { StatusViewer } from '@/components/StatusViewer';
import { StatusCreator } from '@/components/StatusCreator';

interface Status {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'photo' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  createdAt: number;
  views: number;
}

export default function StatusScreen() {
  const router = useRouter();
  const { theme } = useThemeMode();
  const { userId } = useAuth();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [selectedStatusIndex, setSelectedStatusIndex] = useState<number | null>(null);
  const [showCreator, setShowCreator] = useState(false);

  const styles = createStyles(theme);

  const handleCreateStatus = (statusData: { type: 'photo' | 'video'; uri: string; caption?: string }) => {
    if (!userId) return;

    const newStatus: Status = {
      id: `status_${Date.now()}`,
      userId: userId,
      userName: 'Вы',
      type: statusData.type,
      mediaUrl: statusData.uri,
      caption: statusData.caption,
      createdAt: Date.now(),
      views: 0,
    };

    setStatuses([newStatus, ...statuses]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Статусы</Text>
        <TouchableOpacity onPress={() => setShowCreator(true)}>
          <Plus size={24} color={theme.interactive?.primary || theme.accentPrimary} />
        </TouchableOpacity>
      </View>

      {statuses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Camera size={64} color={theme.textSecondary} />
          <Text style={styles.emptyText}>Нет статусов</Text>
          <Text style={styles.emptySubtext}>
            Создайте статус с фото или видео, чтобы поделиться моментом
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreator(true)}
          >
            <Text style={styles.createButtonText}>Создать статус</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={statuses}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.statusItem}
              onPress={() => setSelectedStatusIndex(index)}
            >
              <View style={styles.statusThumbnail}>
                {item.type === 'photo' ? (
                  <Image source={{ uri: item.mediaUrl }} style={styles.thumbnail} />
                ) : (
                  <View style={styles.videoThumbnail}>
                    <Text style={styles.videoIcon}>▶</Text>
                  </View>
                )}
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusUserName}>{item.userName}</Text>
                <Text style={styles.statusTime}>
                  {new Date(item.createdAt).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Модальное окно создания статуса */}
      <Modal
        visible={showCreator}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreator(false)}
      >
        <StatusCreator
          onClose={() => setShowCreator(false)}
          onStatusCreated={handleCreateStatus}
        />
      </Modal>

      {/* Модальное окно просмотра статуса */}
      {selectedStatusIndex !== null && (
        <Modal
          visible={selectedStatusIndex !== null}
          animationType="fade"
          transparent
          onRequestClose={() => setSelectedStatusIndex(null)}
        >
          <StatusViewer
            statuses={statuses}
            currentIndex={selectedStatusIndex}
            onClose={() => setSelectedStatusIndex(null)}
            onNext={() => {
              if (selectedStatusIndex < statuses.length - 1) {
                setSelectedStatusIndex(selectedStatusIndex + 1);
              } else {
                setSelectedStatusIndex(null);
              }
            }}
            onPrevious={() => {
              if (selectedStatusIndex > 0) {
                setSelectedStatusIndex(selectedStatusIndex - 1);
              } else {
                setSelectedStatusIndex(null);
              }
            }}
          />
        </Modal>
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors?.background?.primary || theme.backgroundPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderSoft,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: theme.interactive?.primary || theme.accentPrimary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderSoft,
    gap: 12,
  },
  statusThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: theme.card,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  videoIcon: {
    color: '#fff',
    fontSize: 20,
  },
  statusInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  statusUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  statusTime: {
    fontSize: 12,
    color: theme.textSecondary,
  },
});
