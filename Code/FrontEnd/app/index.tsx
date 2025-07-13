import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuthState, useProfile } from "../hooks/useAuth";

export default function Index() {
  const { isLoading: authLoading, hasToken } = useAuthState();
  const {
    data: user,
    isLoading: profileLoading,
    error: profileError,
  } = useProfile({
    enabled: hasToken,
    retry: false,
  });

  useEffect(() => {
    if (authLoading) return;

    const isNotAuthenticated = !hasToken || profileError;
    if (isNotAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    if (user) {
      router.replace("/(app)");
      return;
    }

    if (hasToken && !user && !profileLoading) {
      router.replace("/auth/login");
      return;
    }
  }, [authLoading, hasToken, user, profileError, profileLoading]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
      }}
    >
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text style={{ marginTop: 16, color: "#64748b" }}>Loading...</Text>
    </View>
  );
}
