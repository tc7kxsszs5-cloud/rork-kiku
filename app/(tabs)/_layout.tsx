import { Tabs } from "expo-router";
import { MessageCircle, Info, User, Settings, BarChart3, Smile } from "lucide-react-native";
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
          tabBarIcon: ({ color }: { color: string }) => <MessageCircle color={color} size={24} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color }: { color: string }) => <BarChart3 color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="custom-emojis"
        options={{
          title: "Эмодзи",
          tabBarIcon: ({ color }: { color: string }) => <Smile color={color} size={24} />,
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
        name="about"
        options={{
          title: "О приложении",
          tabBarIcon: ({ color }: { color: string }) => <Info color={color} size={24} />,
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
