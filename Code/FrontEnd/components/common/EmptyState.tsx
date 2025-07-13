import React from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export const EmptyState = ({
  title = "No data found",
  message = "There's nothing to display here yet",
}: EmptyStateProps) => {
  return (
    <View
      style={{
        alignItems: "center",
        padding: 40,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        margin: 20,
      }}
    >
      <Text style={{ color: "#64748b", marginBottom: 8 }}>{title}</Text>
      <Text style={{ color: "#9ca3af", fontSize: 12, textAlign: "center" }}>
        {message}
      </Text>
    </View>
  );
};
