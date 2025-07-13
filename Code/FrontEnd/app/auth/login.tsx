import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignIn } from "../../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signInMutation = useSignIn();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      await signInMutation.mutateAsync({ email, password });
      router.replace("/(app)");
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
      console.log(error);
    }
  };

  const handleRegister = () => {
    router.push("/auth/register");
  };

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 40,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 48 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: 8,
            }}
          >
            Welcome Back
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#64748b",
              textAlign: "center",
            }}
          >
            Sign in to your Financer account
          </Text>
        </View>

        <View style={{ width: "100%" }}>
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Email
            </Text>
            <TextInput
              style={{
                backgroundColor: "#ffffff",
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
                color: "#1f2937",
              }}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#9ca3af"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Password
            </Text>
            <TextInput
              style={{
                backgroundColor: "#ffffff",
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
                color: "#1f2937",
              }}
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginBottom: 24 }}
            onPress={handleForgotPassword}
          >
            <Text
              style={{
                color: "#3b82f6",
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: signInMutation.isPending ? "#9ca3af" : "#3b82f6",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              marginBottom: 24,
            }}
            onPress={handleLogin}
            disabled={signInMutation.isPending}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {signInMutation.isPending ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "#d1d5db",
              }}
            />
            <Text
              style={{
                marginHorizontal: 16,
                color: "#6b7280",
                fontSize: 14,
              }}
            >
              or
            </Text>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "#d1d5db",
              }}
            />
          </View>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#3b82f6",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
            }}
            onPress={handleRegister}
          >
            <Text
              style={{
                color: "#3b82f6",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Create New Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
