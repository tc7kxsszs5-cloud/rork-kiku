import { Tabs } from "expo-router";
import { MessageCircle, User, Settings, Users, Phone } from "lucide-react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { useThemeMode } from "@/constants/ThemeContext";
import { ThemeModeToggle } from "@/components/ThemeModeToggle";

// Нижняя панель: Чаты, Контакты, Звонки, Настройки, Профиль.
// Остальные экраны (Достижения, Уроки, О приложении, Аналитика и т.д.) доступны из Профиля.
export default function TabLayout() {
  const { theme } = useThemeMode();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.headerBackground,
        },
        headerTitleStyle: {
          fontWeight: '700' as const,
          fontSize: 18,
          color: theme.headerText,
        },
        headerTintColor: theme.headerText,
        headerRight: () => <ThemeModeToggle variant="compact" />,
        tabBarStyle: [
          styles.tabBarBase,
          {
            backgroundColor: theme.tabBarBackground,
            borderTopColor: theme.borderSoft,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Чаты",
          tabBarIcon: ({ color }: { color: string }) => <MessageCircle color={color} size={24} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: "Контакты",
          tabBarIcon: ({ color }: { color: string }) => <Users color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          title: "Звонки",
          tabBarIcon: ({ color }: { color: string }) => <Phone color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="messenger-settings"
        options={{
          title: "Настройки",
          tabBarIcon: ({ color }: { color: string }) => <Settings color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ color }: { color: string }) => <User color={color} size={24} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen name="analytics" options={{ href: null }} />
      <Tabs.Screen name="achievements" options={{ href: null }} />
      <Tabs.Screen name="lessons" options={{ href: null }} />
      <Tabs.Screen name="custom-emojis" options={{ href: null }} />
      <Tabs.Screen name="alerts" options={{ href: null }} />
      <Tabs.Screen name="about" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarBase: {
    borderTopWidth: 2,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
});
