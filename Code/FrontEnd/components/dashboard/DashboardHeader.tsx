import React from "react";
import { Text, View } from "react-native";

interface DashboardHeaderProps {
  userName?: string;
}

export const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  return (
    <View
      style={{
        padding: 20,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#1e293b",
          marginBottom: 4,
        }}
      >
        Welcome back, {userName}!
      </Text>
      <Text style={{ fontSize: 16, color: "#64748b" }}>
        Here&apos;s your financial overview
      </Text>
    </View>
  );
};
