import { router } from "expo-router";
import React from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLogout, useProfile } from "../../hooks/useAuth";

export default function Profile() {
  const { data: user, isLoading, error, refetch } = useProfile();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logoutMutation.mutateAsync();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={() => refetch()} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          alignItems: "center",
          padding: 40,
          backgroundColor: "#ffffff",
          borderBottomWidth: 1,
          borderBottomColor: "#e5e7eb",
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#3b82f6",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 32, fontWeight: "bold", color: "#ffffff" }}>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#1e293b",
            marginBottom: 4,
          }}
        >
          {user?.name || "User"}
        </Text>
        <Text style={{ fontSize: 16, color: "#64748b" }}>{user?.email}</Text>
        <View style={{ marginTop: 16, flexDirection: "row", gap: 8 }}>
          {isLoading && (
            <Text style={{ fontSize: 12, color: "#3b82f6" }}>Loading...</Text>
          )}
          {error && (
            <Text style={{ fontSize: 12, color: "#ef4444" }}>
              Error loading profile
            </Text>
          )}
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#1e293b",
            marginBottom: 12,
            paddingHorizontal: 20,
          }}
        >
          Account Settings
        </Text>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#ffffff",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#f3f4f6",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#1e293b",
            }}
          >
            Edit Profile
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#9ca3af",
            }}
          >
            ›
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#ffffff",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#f3f4f6",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#1e293b",
            }}
          >
            Change Password
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#9ca3af",
            }}
          >
            ›
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#ffffff",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#f3f4f6",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#1e293b",
            }}
          >
            Notification Settings
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#9ca3af",
            }}
          >
            ›
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#ffffff",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#f3f4f6",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#1e293b",
            }}
          >
            Privacy Settings
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#9ca3af",
            }}
          >
            ›
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#1e293b",
            marginBottom: 12,
            paddingHorizontal: 20,
          }}
        >
          App Settings
        </Text>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#ffffff",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#f3f4f6",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#1e293b",
            }}
          >
            Currency
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#6b7280",
            }}
          >
            GEL (₾)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#ffffff",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#f3f4f6",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#1e293b",
            }}
          >
            Language
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#6b7280",
            }}
          >
            English
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#ffffff",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#f3f4f6",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#1e293b",
            }}
          >
            Theme
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#6b7280",
            }}
          >
            Light
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#1e293b",
            marginBottom: 12,
            paddingHorizontal: 20,
          }}
        >
          Support
        </Text>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#ffffff",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#f3f4f6",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#1e293b",
            }}
          >
            Help Center
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#9ca3af",
            }}
          >
            ›
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#ffffff",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#f3f4f6",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#1e293b",
            }}
          >
            Contact Support
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#9ca3af",
            }}
          >
            ›
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#ffffff",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#f3f4f6",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#1e293b",
            }}
          >
            About Financer
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#9ca3af",
            }}
          >
            ›
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20, marginBottom: 60 }}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#ffffff",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#f3f4f6",
          }}
          onPress={handleLogout}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#ef4444",
            }}
          >
            Logout
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#9ca3af",
            }}
          >
            ›
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
