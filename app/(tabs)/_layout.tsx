import { Tabs } from "expo-router";
import { MessageCircle, Bell, BarChart3, Lightbulb, Info, User } from "lucide-react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { useThemeMode } from "@/constants/ThemeContext";
import { ThemeModeToggle } from "@/components/ThemeModeToggle";

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
          tabBarIcon: ({ color }) => <MessageCircle color={color} size={24} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Уведомления",
          tabBarIcon: ({ color }) => <Bell color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Статистика",
          tabBarIcon: ({ color }) => <BarChart3 color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="recommendations"
        options={{
          title: "Рекомендации",
          tabBarIcon: ({ color }) => <Lightbulb color={color} size={24} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "О приложении",
          tabBarIcon: ({ color }) => <Info color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
          headerShown: false,
        }}
      />
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
