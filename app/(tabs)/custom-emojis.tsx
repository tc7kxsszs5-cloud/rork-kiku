/**
 * Экран для просмотра и управления кастомными эмодзи
 * 
 * Показывает все созданные кастомные эмодзи
 * Позволяет создавать новые и удалять существующие
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Plus, Trash2, Search, X } from 'lucide-react-native';
import { useThemeMode } from '@/constants/ThemeContext';
import { CustomEmoji } from '@/components/CustomEmoji';
import { CustomEmojiCreator } from '@/components/CustomEmojiCreator';
import {
  loadCustomEmojis,
  removeCustomEmoji,
  CustomEmojiData,
} from '@/utils/customEmojis';
import { initializeTestCustomEmojis } from '@/utils/initCustomEmojis';
import { HapticFeedback } from '@/constants/haptics';
import { logger } from '@/utils/logger';

export default function CustomEmojisScreen() {
  const { theme } = useThemeMode();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [customEmojis, setCustomEmojis] = useState<CustomEmojiData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreator, setShowCreator] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Загрузить кастомные эмодзи
  const loadEmojis = async () => {
    try {
      // Инициализируем тестовые эмодзи если их нет
      await initializeTestCustomEmojis();
      
      const emojis = await loadCustomEmojis();
      setCustomEmojis(emojis);
    } catch (error) {
      logger.error('Failed to load emojis', error instanceof Error ? error : new Error(String(error)), { component: 'CustomEmojisScreen', action: 'loadEmojis' });
    }
  };

  useEffect(() => {
    loadEmojis();
  }, []);

  // Фильтрация по поисковому запросу
  const filteredEmojis = useMemo(() => {
    if (!searchQuery.trim()) {
      return customEmojis;
    }
    return customEmojis.filter(emoji =>
      emoji.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emoji.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      emoji.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customEmojis, searchQuery]);

  // Удаление эмодзи
  const handleDelete = (emoji: CustomEmojiData) => {
    Alert.alert(
      'Удалить эмодзи?',
      `Вы уверены, что хотите удалить "${emoji.name}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeCustomEmoji(emoji.id);
              HapticFeedback.medium();
              await loadEmojis();
            } catch (error) {
              logger.error('Failed to delete emoji', error instanceof Error ? error : new Error(String(error)), { component: 'CustomEmojisScreen', action: 'deleteEmoji', emojiId: emoji.id });
              Alert.alert('Ошибка', 'Не удалось удалить эмодзи');
            }
          },
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEmojis();
    setRefreshing(false);
  };

  const renderEmoji = ({ item }: { item: CustomEmojiData }) => (
    <View style={styles.emojiCard}>
      <View style={styles.emojiPreview}>
        <CustomEmoji emoji={item} size={48} />
      </View>
      <View style={styles.emojiInfo}>
        <Text style={styles.emojiName}>{item.name}</Text>
        {item.category && (
          <Text style={styles.emojiCategory}>{item.category}</Text>
        )}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item)}
      >
        <Trash2 size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Кастомные эмодзи</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setShowCreator(true);
            HapticFeedback.light();
          }}
        >
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={18} color={theme.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск эмодзи..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.textSecondary}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Всего: {customEmojis.length} | Показано: {filteredEmojis.length}
        </Text>
      </View>

      {/* Emoji List */}
      {filteredEmojis.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? 'Ничего не найдено' : 'Нет кастомных эмодзи'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery
              ? 'Попробуйте другой поисковый запрос'
              : 'Нажмите + чтобы создать первый эмодзи'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredEmojis}
          renderItem={renderEmoji}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      {/* Creator Modal */}
      <CustomEmojiCreator
        visible={showCreator}
        onClose={() => setShowCreator(false)}
        onEmojiCreated={async () => {
          await loadEmojis();
        }}
      />
    </View>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSoft,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.accentPrimary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundSecondary,
      margin: 16,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.textPrimary,
    },
    statsContainer: {
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    statsText: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    listContent: {
      padding: 16,
    },
    emojiCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
    },
    emojiPreview: {
      width: 64,
      height: 64,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundPrimary,
      borderRadius: 8,
      marginRight: 12,
    },
    emojiInfo: {
      flex: 1,
    },
    emojiName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 4,
    },
    emojiCategory: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    tag: {
      backgroundColor: theme.accentPrimary + '20',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    tagText: {
      fontSize: 10,
      color: theme.accentPrimary,
    },
    deleteButton: {
      padding: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });
}
