import React from "react";
import { Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: "#1e293b",
          marginBottom: subtitle ? 4 : 16,
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};
