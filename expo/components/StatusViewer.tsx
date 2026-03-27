import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { X, Play } from 'lucide-react-native';
import { useThemeMode } from '@/constants/ThemeContext';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';

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

interface StatusViewerProps {
  statuses: Status[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function StatusViewer({ statuses, currentIndex, onClose, onNext, onPrevious }: StatusViewerProps) {
  const { theme } = useThemeMode();
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoRef, setVideoRef] = useState<ExpoVideo | null>(null);
  const currentStatus = statuses[currentIndex];

  const styles = createStyles(theme);

  if (!currentStatus) {
    return null;
  }

  const handlePlayPause = () => {
    if (currentStatus.type === 'video' && videoRef) {
      if (isPlaying) {
        videoRef.pauseAsync();
      } else {
        videoRef.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {currentStatus.userAvatar && (
            <Image source={{ uri: currentStatus.userAvatar }} style={styles.avatar} />
          )}
          <View>
            <Text style={styles.userName}>{currentStatus.userName}</Text>
            <Text style={styles.timeAgo}>
              {new Date(currentStatus.createdAt).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Медиа контент */}
      <View style={styles.mediaContainer}>
        {currentStatus.type === 'photo' ? (
          <Image source={{ uri: currentStatus.mediaUrl }} style={styles.media} resizeMode={"contain" as const} />
        ) : (
          <View style={styles.videoContainer}>
            <ExpoVideo
              ref={(ref) => setVideoRef(ref)}
              source={{ uri: currentStatus.mediaUrl }}
              style={styles.video}
              shouldPlay={isPlaying}
              isLooping
              resizeMode={ResizeMode.CONTAIN}
            />
            <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
              {!isPlaying && <Play size={48} color="#fff" />}
            </TouchableOpacity>
          </View>
        )}

        {/* Подпись */}
        {currentStatus.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.caption}>{currentStatus.caption}</Text>
          </View>
        )}
      </View>

      {/* Навигация */}
      <View style={styles.navigation}>
        <TouchableOpacity onPress={onPrevious} style={styles.navButton}>
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.dots}>
          {statuses.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex && styles.dotActive]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={onNext} style={styles.navButton}>
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timeAgo: {
    color: '#999',
    fontSize: 12,
  },
  closeButton: {
    padding: 8,
  },
  mediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    padding: 16,
  },
  caption: {
    color: '#fff',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 16,
  },
  navButton: {
    padding: 12,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
});
