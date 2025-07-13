import React from "react";
import { Text, View } from "react-native";

export const TransactionsHeader = () => {
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
        Transactions
      </Text>
      <Text style={{ fontSize: 16, color: "#64748b" }}>
        View and manage your transactions
      </Text>
    </View>
  );
};
