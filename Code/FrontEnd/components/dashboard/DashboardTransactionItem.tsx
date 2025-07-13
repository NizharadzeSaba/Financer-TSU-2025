import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DashboardTransactionItemProps {
  description: string;
  time: string;
  amount: string;
  isLast?: boolean;
}

export const DashboardTransactionItem = ({
  description,
  time,
  amount,
  isLast = false,
}: DashboardTransactionItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push("/transactions");
      }}
      style={{
        gap: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: "#f3f4f6",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#1e293b",
            marginBottom: 4,
          }}
        >
          {description}
        </Text>
        <Text style={{ fontSize: 14, color: "#6b7280" }}>{time}</Text>
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: amount.startsWith("+") ? "#10b981" : "#ef4444",
        }}
      >
        {amount}
      </Text>
    </TouchableOpacity>
  );
};
