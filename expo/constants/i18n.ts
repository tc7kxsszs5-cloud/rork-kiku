import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru';
import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';
import de from './locales/de';
import zh from './locales/zh';
import it from './locales/it';
import pt from './locales/pt';
import ja from './locales/ja';
import ko from './locales/ko';

// Импорт языков Фазы 2 (будут добавлены позже)
// import it from './locales/it';
// import ja from './locales/ja';
// import ko from './locales/ko';
// import pt from './locales/pt';

// Импорт языков Фазы 3-4 (будут добавлены позже)
// import ar from './locales/ar';
// import hi from './locales/hi';
// import tr from './locales/tr';
// import pl from './locales/pl';

const resources = {
  ru: { translation: ru },
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  zh: { translation: zh },
  it: { translation: it },
  pt: { translation: pt },
  ja: { translation: ja },
  ko: { translation: ko },
  // it: { translation: it },
  // ja: { translation: ja },
  // ko: { translation: ko },
  // pt: { translation: pt },
  // ar: { translation: ar },
  // hi: { translation: hi },
  // tr: { translation: tr },
  // pl: { translation: pl },
};

const i18n = createInstance();

const DEFAULT_LANG = 'ru';

const getInitialLanguage = (): string => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_LANG;
    const stored = window.localStorage.getItem('i18nextLng');
    if (!stored) return DEFAULT_LANG;
    const lang = stored.split('-')[0];
    if (lang && (resources as Record<string, unknown>)[lang]) return lang;
    if ((resources as Record<string, unknown>)[stored]) return stored;
  } catch {
    // localStorage может быть недоступен (приватный режим и т.д.)
  }
  return DEFAULT_LANG;
};

const initialLng = getInitialLanguage();

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: 'en',
  react: { useSuspense: false },
  interpolation: {
    escapeValue: false,
  },
  pluralSeparator: '_',
  contextSeparator: '_',
});

// После очистки localStorage при следующей загрузке язык снова сохраняется — не остаётся «пустого» состояния
try {
  if (typeof window !== 'undefined' && window.localStorage && !window.localStorage.getItem('i18nextLng')) {
    window.localStorage.setItem('i18nextLng', initialLng);
  }
} catch {
  // игнорируем
}

export default i18n;

/**
 * Список доступных языков для глобального распространения
 * Приоритет: Северная Америка/Европа -> Азия -> Латинская Америка -> Остальные
 */
export const availableLanguages = [
  // Текущие языки (активные) - Фаза 1 + Фаза 2 ЗАВЕРШЕНЫ!
  { code: 'ru', name: 'Русский', nameNative: 'Русский', flag: '🇷🇺', region: 'CIS' },
  { code: 'en', name: 'English', nameNative: 'English', flag: '🇬🇧', region: 'Global' },
  { code: 'es', name: 'Spanish', nameNative: 'Español', flag: '🇪🇸', region: 'Europe/Latin America' },
  { code: 'fr', name: 'French', nameNative: 'Français', flag: '🇫🇷', region: 'Europe' },
  { code: 'de', name: 'German', nameNative: 'Deutsch', flag: '🇩🇪', region: 'Europe' },
  { code: 'zh', name: 'Chinese (Simplified)', nameNative: '简体中文', flag: '🇨🇳', region: 'Asia' },
  { code: 'it', name: 'Italian', nameNative: 'Italiano', flag: '🇮🇹', region: 'Europe' },
  { code: 'pt', name: 'Portuguese', nameNative: 'Português', flag: '🇧🇷', region: 'Latin America' },
  { code: 'ja', name: 'Japanese', nameNative: '日本語', flag: '🇯🇵', region: 'Asia' },
  { code: 'ko', name: 'Korean', nameNative: '한국어', flag: '🇰🇷', region: 'Asia' },
  
  // Фаза 3: Остальные языки (в процессе)
  { code: 'zh-TW', name: 'Chinese (Traditional)', nameNative: '繁體中文', flag: '🇹🇼', region: 'Asia', comingSoon: true },
  
  // Фаза 3: Латинская Америка и Восточная Европа (12-18 месяцев)
  { code: 'pt', name: 'Portuguese', nameNative: 'Português', flag: '🇧🇷', region: 'Latin America', comingSoon: true },
  { code: 'pl', name: 'Polish', nameNative: 'Polski', flag: '🇵🇱', region: 'Europe', comingSoon: true },
  { code: 'tr', name: 'Turkish', nameNative: 'Türkçe', flag: '🇹🇷', region: 'Europe/Asia', comingSoon: true },
  
  // Фаза 4: Глобальное покрытие (18+ месяцев)
  { code: 'ar', name: 'Arabic', nameNative: 'العربية', flag: '🇸🇦', region: 'Middle East', comingSoon: true },
  { code: 'hi', name: 'Hindi', nameNative: 'हिन्दी', flag: '🇮🇳', region: 'Asia', comingSoon: true },
];

/**
 * Получить язык по коду
 */
export const getLanguageByCode = (code: string) => {
  return availableLanguages.find((lang) => lang.code === code) || availableLanguages[1]; // Fallback to English
};

/**
 * Получить язык по региону
 */
export const getLanguagesByRegion = (region: string) => {
  return availableLanguages.filter((lang) => lang.region === region || lang.region === 'Global');
};

/**
 * Автоматическое определение языка устройства
 * Работает для web и React Native
 */
export const detectDeviceLanguage = async (): Promise<string> => {
  try {
    let deviceLang: string | null = null;

    // Для React Native используем expo-localization
    if (typeof navigator === 'undefined') {
      try {
        const { getLocales } = await import('expo-localization');
        const locales = getLocales();
        if (locales && locales.length > 0) {
          deviceLang = locales[0].languageCode || locales[0].languageTag?.split('-')[0] || null;
        }
      } catch (error) {
        console.warn('[i18n] expo-localization not available, using fallback');
      }
    } else {
      // Для web используем navigator.language
      deviceLang = navigator.language.split('-')[0];
    }

    if (deviceLang) {
      // Ищем точное совпадение
      let supported = availableLanguages.find((lang) => lang.code === deviceLang);
      
      // Если не найдено, ищем по началу кода (например, zh-CN -> zh)
      if (!supported) {
        supported = availableLanguages.find((lang) => 
          lang.code.startsWith(deviceLang) || deviceLang.startsWith(lang.code.split('-')[0])
        );
      }

      if (supported && !supported.comingSoon) {
        return supported.code;
      }
    }
  } catch (error) {
    console.error('[i18n] Error detecting device language:', error);
  }

  // Fallback на английский
  return 'en';
};
