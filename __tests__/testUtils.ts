/**
 * Утилиты для тестирования
 */

import { ComponentType } from 'react';
import { Text, View, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';

/**
 * Map строковых имен компонентов к их типам
 * Используется для исправления UNSAFE_getByType('ComponentName')
 */
export const componentTypes: Record<string, ComponentType<any>> = {
  'Text': Text,
  'View': View,
  'TouchableOpacity': TouchableOpacity,
  'ScrollView': ScrollView,
  'FlatList': FlatList,
  'ActivityIndicator': ActivityIndicator,
};

/**
 * Получить тип компонента по имени
 */
export function getComponentType(name: string): ComponentType<any> {
  const type = componentTypes[name];
  if (!type) {
    throw new Error(`Component type '${name}' not found in componentTypes map`);
  }
  return type;
}
