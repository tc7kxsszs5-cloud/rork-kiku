import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Video, PhoneOff, Mic, MicOff, Volume2, VolumeX, VideoOff } from 'lucide-react-native';
import { useThemeMode } from '@/constants/ThemeContext';
import { HapticFeedback } from '@/constants/haptics';
import { Audio } from 'expo-av';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CallScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    contactName?: string;
    phoneNumber?: string;
    type?: 'audio' | 'video';
  }>();
  const { theme } = useThemeMode();
  
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(params.type === 'video');
  const [callDuration, setCallDuration] = useState(0);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  
  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const contactName = params.contactName || 'Неизвестный';
  const phoneNumber = params.phoneNumber || '';
  const callType = params.type || 'audio';

  const styles = createStyles(theme);

  useEffect(() => {
    startCall();
    return () => {
      endCall();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- mount/cleanup only

  useEffect(() => {
    if (isCallActive) {
      intervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isCallActive]);

  const startCall = async () => {
    try {
      HapticFeedback.medium();
      
      // Запрос разрешений
      if (callType === 'video' && !cameraPermission?.granted) {
        const permission = await requestCameraPermission();
        if (!permission.granted) {
          Alert.alert('Разрешение', 'Необходимо разрешение на использование камеры');
          router.back();
          return;
        }
      }

      // В реальном приложении здесь будет подключение к WebRTC или SIP
      // Пока просто имитируем звонок
      setIsCallActive(true);
      
      // Воспроизведение звука звонка (опционально)
      // В реальном приложении здесь будет подключение к WebRTC
      // Звук звонка можно добавить позже
    } catch (error) {
      console.error('[CallScreen] Start call error:', error);
      Alert.alert('Ошибка', 'Не удалось начать звонок');
      router.back();
    }
  };

  const endCall = async () => {
    try {
      HapticFeedback.error();
      setIsCallActive(false);
      
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // В реальном приложении здесь будет отключение от WebRTC
      router.back();
    } catch (error) {
      console.error('[CallScreen] End call error:', error);
      router.back();
    }
  };

  const toggleMute = () => {
    HapticFeedback.light();
    setIsMuted(!isMuted);
    // В реальном приложении здесь будет управление микрофоном через WebRTC
  };

  const toggleSpeaker = () => {
    HapticFeedback.light();
    setIsSpeakerOn(!isSpeakerOn);
    // В реальном приложении здесь будет управление динамиком
  };

  const toggleVideo = async () => {
    if (callType !== 'video') return;
    
    HapticFeedback.light();
    
    if (!isVideoOn && !cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert('Разрешение', 'Необходимо разрешение на использование камеры');
        return;
      }
    }
    
    setIsVideoOn(!isVideoOn);
    // В реальном приложении здесь будет управление камерой через WebRTC
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {callType === 'video' && isVideoOn && cameraPermission?.granted ? (
        <CameraView
          style={styles.camera}
          facing="front"
        >
          <View style={styles.videoOverlay}>
            <View style={styles.videoHeader}>
              <Text style={styles.videoContactName}>{contactName}</Text>
              <Text style={styles.videoDuration}>{formatDuration(callDuration)}</Text>
            </View>
          </View>
        </CameraView>
      ) : (
        <View style={styles.audioContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{contactName.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.contactName}>{contactName}</Text>
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          <Text style={styles.callStatus}>
            {isCallActive ? formatDuration(callDuration) : 'Звонок...'}
          </Text>
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={toggleMute}
        >
          {isMuted ? (
            <MicOff size={24} color="#fff" />
          ) : (
            <Mic size={24} color="#fff" />
          )}
        </TouchableOpacity>

        {callType === 'video' && (
          <TouchableOpacity
            style={[styles.controlButton, !isVideoOn && styles.controlButtonActive]}
            onPress={toggleVideo}
          >
            {isVideoOn ? (
              <Video size={24} color="#fff" />
            ) : (
              <VideoOff size={24} color="#fff" />
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlButton, !isSpeakerOn && styles.controlButtonActive]}
          onPress={toggleSpeaker}
        >
          {isSpeakerOn ? (
            <Volume2 size={24} color="#fff" />
          ) : (
            <VolumeX size={24} color="#fff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={endCall}
        >
          <PhoneOff size={24} color="#fff" />
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
  camera: {
    flex: 1,
  },
  videoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
  },
  videoHeader: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    alignItems: 'center',
  },
  videoContactName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  videoDuration: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  audioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  avatarContainer: {
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
  },
  contactName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.7,
    marginBottom: 16,
  },
  callStatus: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.6,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    paddingBottom: Platform.OS === 'ios' ? 50 : 32,
    gap: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  endCallButton: {
    backgroundColor: '#ef4444',
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});
