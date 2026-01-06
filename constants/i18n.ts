import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru';
import en from './locales/en';

// Импорт дополнительных языков (будут добавлены по мере необходимости)
// import es from './locales/es';
// import fr from './locales/fr';
// import de from './locales/de';
// import it from './locales/it';
// import ja from './locales/ja';
// import ko from './locales/ko';
// import zh from './locales/zh';
// import pt from './locales/pt';
// import ar from './locales/ar';
// import hi from './locales/hi';
// import tr from './locales/tr';
// import pl from './locales/pl';

const resources = {
  ru: { translation: ru },
  en: { translation: en },
  // es: { translation: es },
  // fr: { translation: fr },
  // de: { translation: de },
  // it: { translation: it },
  // ja: { translation: ja },
  // ko: { translation: ko },
  // zh: { translation: zh },
  // pt: { translation: pt },
  // ar: { translation: ar },
  // hi: { translation: hi },
  // tr: { translation: tr },
  // pl: { translation: pl },
};

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  // Поддержка множественного числа
  pluralSeparator: '_',
  contextSeparator: '_',
});

export default i18n;

/**
 * Список доступных языков для глобального распространения
 * Приоритет: Северная Америка/Европа -> Азия -> Латинская Америка -> Остальные
 */
export const availableLanguages = [
  // Текущие языки
  { code: 'ru', name: 'Русский', nameNative: 'Русский', flag: '🇷🇺', region: 'CIS' },
  { code: 'en', name: 'English', nameNative: 'English', flag: '🇬🇧', region: 'Global' },
  
  // Фаза 1: Северная Америка и Западная Европа (0-6 месяцев)
  { code: 'es', name: 'Spanish', nameNative: 'Español', flag: '🇪🇸', region: 'Europe/Latin America', comingSoon: true },
  { code: 'fr', name: 'French', nameNative: 'Français', flag: '🇫🇷', region: 'Europe', comingSoon: true },
  { code: 'de', name: 'German', nameNative: 'Deutsch', flag: '🇩🇪', region: 'Europe', comingSoon: true },
  { code: 'it', name: 'Italian', nameNative: 'Italiano', flag: '🇮🇹', region: 'Europe', comingSoon: true },
  
  // Фаза 2: Азиатско-Тихоокеанский регион (6-12 месяцев)
  { code: 'ja', name: 'Japanese', nameNative: '日本語', flag: '🇯🇵', region: 'Asia', comingSoon: true },
  { code: 'ko', name: 'Korean', nameNative: '한국어', flag: '🇰🇷', region: 'Asia', comingSoon: true },
  { code: 'zh', name: 'Chinese (Simplified)', nameNative: '简体中文', flag: '🇨🇳', region: 'Asia', comingSoon: true },
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
 */
export const detectDeviceLanguage = (): string => {
  if (typeof navigator !== 'undefined') {
    const deviceLang = navigator.language.split('-')[0];
    const supported = availableLanguages.find((lang) => lang.code === deviceLang || lang.code.startsWith(deviceLang));
    return supported ? supported.code : 'en';
  }
  return 'en';
};
