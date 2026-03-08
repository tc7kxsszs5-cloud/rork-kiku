import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeMode, ThemePalette } from '@/constants/ThemeContext';
import { HapticFeedback } from '@/constants/haptics';
import { ChevronLeft, Users, Bell, BellOff, BookOpen, Shield, Star, Lightbulb, Globe, Heart } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

// ─── Типы ────────────────────────────────────────────────────────────────────

interface ChannelPost {
  id: string;
  title: string;
  content: string;
  emoji: string;
  timeAgo: string;
  type: 'tip' | 'story' | 'quiz' | 'fact';
}

interface Channel {
  id: string;
  name: string;
  emoji: string;
  description: string;
  subscribers: number;
  color: [string, string];
  posts: ChannelPost[];
}

// ─── Данные каналов ───────────────────────────────────────────────────────────

const CHANNELS: Channel[] = [
  {
    id: 'safety',
    name: 'Безопасность',
    emoji: '🛡️',
    description: 'Советы как оставаться в безопасности онлайн и оффлайн',
    subscribers: 4821,
    color: ['#1B2B47', '#2D4A6E'],
    posts: [
      {
        id: 's1',
        title: 'Не делись личными данными',
        content: 'Никогда не сообщай незнакомым людям в интернете свой адрес, номер телефона или школу. Если кто-то просит — сразу расскажи взрослым!',
        emoji: '🔐',
        timeAgo: '2 ч назад',
        type: 'tip',
      },
      {
        id: 's2',
        title: 'Кнопка SOS — твой друг',
        content: 'В приложении Safe Zone есть кнопка SOS. Если тебе страшно или плохо — нажми её. Родители сразу получат уведомление и придут на помощь.',
        emoji: '🆘',
        timeAgo: '5 ч назад',
        type: 'tip',
      },
      {
        id: 's3',
        title: 'Что делать если незнакомец пишет',
        content: '1. Не отвечай 2. Не нажимай на ссылки 3. Расскажи маме или папе 4. Нажми кнопку "Заблокировать".\n\nТы всегда в безопасности с нами!',
        emoji: '⚠️',
        timeAgo: '1 д назад',
        type: 'tip',
      },
    ],
  },
  {
    id: 'stories',
    name: 'Добрые истории',
    emoji: '📖',
    description: 'Короткие добрые истории для детей каждый день',
    subscribers: 7340,
    color: ['#7C3AED', '#A855F7'],
    posts: [
      {
        id: 'st1',
        title: 'Маленький медвежонок и дружба',
        content: 'Медвежонок Тёма жил в лесу и у него не было друзей. Однажды он увидел зайчика, который плакал. "Что случилось?" — спросил Тёма. "Я потерялся" — ответил зайчик. Тёма помог зайчику найти дорогу домой, и они стали лучшими друзьями навсегда.',
        emoji: '🐻',
        timeAgo: '1 ч назад',
        type: 'story',
      },
      {
        id: 'st2',
        title: 'Звёздочка которая боялась темноты',
        content: 'Маленькая звёздочка боялась светить ночью. Но потом она узнала, что именно она помогает детям не бояться. С тех пор она светит изо всех сил и очень этому рада!',
        emoji: '⭐',
        timeAgo: '6 ч назад',
        type: 'story',
      },
    ],
  },
  {
    id: 'science',
    name: 'Наука и знания',
    emoji: '🔬',
    description: 'Интересные факты и эксперименты для любознательных',
    subscribers: 3120,
    color: ['#0F766E', '#14B8A6'],
    posts: [
      {
        id: 'sc1',
        title: 'Почему небо синее?',
        content: 'Солнечный свет кажется белым, но на самом деле он состоит из всех цветов радуги. Когда свет проходит через атмосферу, синий цвет рассеивается больше всего — поэтому мы видим голубое небо!',
        emoji: '🌤️',
        timeAgo: '3 ч назад',
        type: 'fact',
      },
      {
        id: 'sc2',
        title: 'Домашний опыт: вулкан из соды',
        content: 'Тебе нужно: сода, уксус, краситель.\n1. Насыпь соду в стакан\n2. Добавь несколько капель краски\n3. Влей уксус\n\nСмотри как появляется "лава"! Это химическая реакция!',
        emoji: '🌋',
        timeAgo: '1 д назад',
        type: 'quiz',
      },
    ],
  },
  {
    id: 'art',
    name: 'Творчество',
    emoji: '🎨',
    description: 'Рисование, поделки и творческие идеи',
    subscribers: 5230,
    color: ['#B45309', '#F59E0B'],
    posts: [
      {
        id: 'a1',
        title: 'Нарисуй своего защитника',
        content: 'Возьми лист бумаги и нарисуй своего воображаемого защитника — супергероя или волшебника. Дай ему имя! Он всегда будет рядом когда тебе страшно.',
        emoji: '🦸',
        timeAgo: '2 ч назад',
        type: 'tip',
      },
      {
        id: 'a2',
        title: 'Поделка: открытка маме',
        content: 'Сложи лист бумаги пополам. На обложке нарисуй сердечко. Внутри напиши: "Мама, я тебя люблю!" Вырежи из цветной бумаги цветы и приклей. Готово! Подари маме.',
        emoji: '💌',
        timeAgo: '5 ч назад',
        type: 'tip',
      },
    ],
  },
  {
    id: 'world',
    name: 'Наш мир',
    emoji: '🌍',
    description: 'Удивительные факты о странах, природе и людях',
    subscribers: 2870,
    color: ['#0369A1', '#0EA5E9'],
    posts: [
      {
        id: 'w1',
        title: 'Самое большое животное на земле',
        content: 'Синий кит — самое большое животное которое когда-либо жило на Земле! Он длиннее трёх автобусов и весит столько же, сколько 25 слонов. А его сердце — размером с машину!',
        emoji: '🐋',
        timeAgo: '4 ч назад',
        type: 'fact',
      },
    ],
  },
  {
    id: 'health',
    name: 'Здоровье',
    emoji: '❤️',
    description: 'Полезные привычки и забота о своём здоровье',
    subscribers: 3680,
    color: ['#BE185D', '#EC4899'],
    posts: [
      {
        id: 'h1',
        title: 'Почему важно спать 9 часов',
        content: 'Пока ты спишь, твой мозг "сохраняет" всё что ты узнал за день. Дети должны спать 9-11 часов. Это помогает расти, быть умным и счастливым!',
        emoji: '😴',
        timeAgo: '1 ч назад',
        type: 'tip',
      },
      {
        id: 'h2',
        title: 'Правило 20-20-20',
        content: 'Если ты долго смотришь в экран — каждые 20 минут смотри вдаль 20 секунд на что-то на расстоянии 20 футов (6 метров). Это защищает глаза!',
        emoji: '👁️',
        timeAgo: '3 ч назад',
        type: 'tip',
      },
    ],
  },
];

// ─── Компонент поста ──────────────────────────────────────────────────────────

function PostCard({ post, theme }: { post: ChannelPost; theme: ThemePalette }) {
  const typeColors: Record<ChannelPost['type'], string> = {
    tip: '#C9A84C',
    story: '#A855F7',
    quiz: '#14B8A6',
    fact: '#0EA5E9',
  };
  const typeLabels: Record<ChannelPost['type'], string> = {
    tip: 'Совет',
    story: 'История',
    quiz: 'Опыт',
    fact: 'Факт',
  };

  return (
    <View style={[postStyles.card, { backgroundColor: theme.card, borderColor: theme.borderSoft }]}>
      <View style={postStyles.header}>
        <Text style={postStyles.emoji}>{post.emoji}</Text>
        <View style={postStyles.headerRight}>
          <View style={[postStyles.typeBadge, { backgroundColor: typeColors[post.type] + '22' }]}>
            <Text style={[postStyles.typeText, { color: typeColors[post.type] }]}>{typeLabels[post.type]}</Text>
          </View>
          <Text style={[postStyles.timeAgo, { color: theme.textSecondary }]}>{post.timeAgo}</Text>
        </View>
      </View>
      <Text style={[postStyles.title, { color: theme.textPrimary }]}>{post.title}</Text>
      <Text style={[postStyles.content, { color: theme.textSecondary }]}>{post.content}</Text>
    </View>
  );
}

const postStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 28,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timeAgo: {
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 22,
  },
  content: {
    fontSize: 14,
    lineHeight: 21,
  },
});

// ─── Модальное окно канала ────────────────────────────────────────────────────

function ChannelModal({
  channel,
  visible,
  onClose,
  subscribed,
  onToggleSubscribe,
  theme,
}: {
  channel: Channel | null;
  visible: boolean;
  onClose: () => void;
  subscribed: boolean;
  onToggleSubscribe: () => void;
  theme: ThemePalette;
}) {
  if (!channel) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[modalStyles.container, { backgroundColor: theme.backgroundPrimary }]}>
        {/* Шапка */}
        <LinearGradient colors={channel.color} style={modalStyles.header}>
          <TouchableOpacity style={modalStyles.backBtn} onPress={onClose}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <View style={modalStyles.headerInfo}>
            <Text style={modalStyles.channelEmoji}>{channel.emoji}</Text>
            <Text style={modalStyles.channelName}>{channel.name}</Text>
            <Text style={modalStyles.channelDesc}>{channel.description}</Text>
            <View style={modalStyles.metaRow}>
              <Users size={14} color="rgba(255,255,255,0.8)" />
              <Text style={modalStyles.metaText}>{channel.subscribers.toLocaleString()} подписчиков</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[modalStyles.subscribeBtn, subscribed && modalStyles.subscribedBtn]}
            onPress={() => { HapticFeedback.selection(); onToggleSubscribe(); }}
          >
            {subscribed ? <BellOff size={16} color="#fff" /> : <Bell size={16} color={channel.color[0]} />}
            <Text style={[modalStyles.subscribeBtnText, subscribed && { color: '#fff' }]}>
              {subscribed ? 'Отписаться' : 'Подписаться'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Посты */}
        <ScrollView style={modalStyles.postsScroll} contentContainerStyle={modalStyles.postsContent}>
          <Text style={[modalStyles.postsLabel, { color: theme.textSecondary }]}>Последние публикации</Text>
          {channel.posts.map(post => (
            <PostCard key={post.id} post={post} theme={theme} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: { gap: 4 },
  channelEmoji: { fontSize: 40, marginBottom: 4 },
  channelName: { fontSize: 24, fontWeight: '800', color: '#fff' },
  channelDesc: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  metaText: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  subscribeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  subscribedBtn: { backgroundColor: 'rgba(255,255,255,0.25)' },
  subscribeBtnText: { fontSize: 14, fontWeight: '700', color: '#1B2B47' },
  postsScroll: { flex: 1 },
  postsContent: { padding: 16, paddingBottom: 40 },
  postsLabel: { fontSize: 13, fontWeight: '600', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
});

// ─── Карточка канала ──────────────────────────────────────────────────────────

function ChannelCard({
  channel,
  subscribed,
  onPress,
  theme,
}: {
  channel: Channel;
  subscribed: boolean;
  onPress: () => void;
  theme: ThemePalette;
}) {
  const lastPost = channel.posts[0];
  return (
    <TouchableOpacity
      style={[cardStyles.card, { backgroundColor: theme.card, borderColor: theme.borderSoft }]}
      onPress={() => { HapticFeedback.light(); onPress(); }}
      activeOpacity={0.85}
    >
      <LinearGradient colors={channel.color} style={cardStyles.iconWrap}>
        <Text style={cardStyles.emoji}>{channel.emoji}</Text>
      </LinearGradient>
      <View style={cardStyles.info}>
        <View style={cardStyles.nameRow}>
          <Text style={[cardStyles.name, { color: theme.textPrimary }]}>{channel.name}</Text>
          {subscribed && (
            <View style={cardStyles.subscribedBadge}>
              <Bell size={10} color="#C9A84C" />
            </View>
          )}
        </View>
        <Text style={[cardStyles.subCount, { color: theme.textSecondary }]} numberOfLines={1}>
          {channel.subscribers.toLocaleString()} подписчиков
        </Text>
        {lastPost && (
          <Text style={[cardStyles.lastPost, { color: theme.textSecondary }]} numberOfLines={2}>
            {lastPost.emoji} {lastPost.title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 14,
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: { fontSize: 26 },
  info: { flex: 1, gap: 3 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 15, fontWeight: '700' },
  subscribedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#C9A84C22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subCount: { fontSize: 12 },
  lastPost: { fontSize: 13, lineHeight: 18, marginTop: 2 },
});

// ─── Главный экран каналов ────────────────────────────────────────────────────

export default function ChannelsScreen() {
  const { theme } = useThemeMode();
  const { t } = useTranslation();
  const [subscribedIds, setSubscribedIds] = useState<Set<string>>(new Set(['safety', 'stories']));
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const subscribedChannels = CHANNELS.filter(c => subscribedIds.has(c.id));
  const allChannels = CHANNELS;

  const toggleSubscribe = (channelId: string) => {
    setSubscribedIds(prev => {
      const next = new Set(prev);
      if (next.has(channelId)) next.delete(channelId);
      else next.add(channelId);
      return next;
    });
    HapticFeedback.selection();
  };

  const openChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Шапка */}
        <LinearGradient colors={theme.heroGradient} style={styles.hero}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Каналы</Text>
            <Text style={styles.heroSubtitle}>Полезный контент для детей</Text>
          </View>
        </LinearGradient>

        {/* Мои подписки */}
        {subscribedChannels.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Мои подписки</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredRow}>
              {subscribedChannels.map(channel => (
                <TouchableOpacity
                  key={channel.id}
                  style={styles.featuredCard}
                  onPress={() => openChannel(channel)}
                  activeOpacity={0.85}
                >
                  <LinearGradient colors={channel.color} style={styles.featuredGradient}>
                    <Text style={styles.featuredEmoji}>{channel.emoji}</Text>
                    <Text style={styles.featuredName}>{channel.name}</Text>
                    <Text style={styles.featuredSubs}>{channel.subscribers.toLocaleString()}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Все каналы */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Все каналы</Text>
          <View style={styles.channelsList}>
            {allChannels.map(channel => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                subscribed={subscribedIds.has(channel.id)}
                onPress={() => openChannel(channel)}
                theme={theme}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Модальное окно канала */}
      <ChannelModal
        channel={selectedChannel}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        subscribed={selectedChannel ? subscribedIds.has(selectedChannel.id) : false}
        onToggleSubscribe={() => selectedChannel && toggleSubscribe(selectedChannel.id)}
        theme={theme}
      />
    </View>
  );
}

function createStyles(theme: ThemePalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
    },
    content: {
      paddingBottom: 40,
    },
    hero: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      paddingTop: 24,
      paddingBottom: 24,
      gap: 16,
    },
    heroLogo: {
      width: 52,
      height: 52,
      borderRadius: 14,
    },
    heroText: {
      flex: 1,
    },
    heroTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: '#C9A84C',
      letterSpacing: 0.5,
    },
    heroSubtitle: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.7)',
      marginTop: 2,
    },
    section: {
      paddingHorizontal: 16,
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 14,
    },
    featuredRow: {
      gap: 12,
      paddingRight: 4,
    },
    featuredCard: {
      width: 130,
      borderRadius: 18,
      overflow: 'hidden',
    },
    featuredGradient: {
      padding: 14,
      paddingBottom: 16,
      gap: 6,
    },
    featuredEmoji: {
      fontSize: 30,
    },
    featuredName: {
      fontSize: 13,
      fontWeight: '700',
      color: '#fff',
      lineHeight: 18,
    },
    featuredSubs: {
      fontSize: 11,
      color: 'rgba(255,255,255,0.75)',
    },
    channelsList: {
      gap: 10,
    },
  });
}
