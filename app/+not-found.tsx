import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack, useRouter } from "expo-router";
import { Compass } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  const router = useRouter();
  console.log("[NotFoundScreen] rendering not-found fallback");

  const handleRefresh = () => {
    console.log("[NotFoundScreen] retry navigation pressed");
    router.replace("/");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Lost in Space" }} />
      <LinearGradient
        colors={["#05070D", "#0C1424", "#11243F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.overlay} testID="notFound-screen">
          <View style={styles.card}>
            <View style={styles.iconBadge}>
              <Compass color="#F9FAFB" size={32} />
            </View>
            <Text style={styles.title}>We couldn&apos;t find that page</Text>
            <Text style={styles.subtitle}>
              It may have moved or never existed. Check the address or hop back to
              safety.
            </Text>
            <Pressable
              testID="notFound-primary-action"
              onPress={handleRefresh}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Return to Home</Text>
            </Pressable>
            <Link
              href="/"
              style={styles.secondaryLink}
              testID="notFound-secondary-link"
            >
              <Text style={styles.secondaryLinkText}>Explore dashboard</Text>
            </Link>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  card: {
    borderRadius: 28,
    padding: 28,
    backgroundColor: "rgba(15,24,41,0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 16,
  },
  iconBadge: {
    height: 64,
    width: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(249,250,251,0.8)",
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: "#628EFF",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryButtonPressed: {
    backgroundColor: "#4B6ED6",
  },
  primaryButtonText: {
    color: "#0B1120",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryLink: {
    alignItems: "center",
  },
  secondaryLinkText: {
    color: "#B9C6FF",
    fontSize: 15,
    fontWeight: "500",
  },
});
