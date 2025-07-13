import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Transaction } from "../../types";
import { formatAmount, formatDate } from "../../utils/transactionUtils";

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setExpanded((prev) => !prev)}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffffff",
        padding: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginHorizontal: 16,
        borderRadius: 12,
        marginVertical: 8,
        gap: 24,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#1e293b",
            marginBottom: 4,
          }}
          numberOfLines={expanded ? undefined : 2}
          ellipsizeMode={expanded ? undefined : "tail"}
        >
          {transaction.description}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#6b7280",
            marginBottom: 4,
          }}
        >
          {transaction.category?.name ||
            transaction.detectedCategory ||
            "Uncategorized"}
        </Text>
        <Text style={{ fontSize: 12, color: "#9ca3af" }}>
          {formatDate(transaction.date)}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: transaction.type === "income" ? "#10b981" : "#ef4444",
        }}
      >
        {formatAmount(
          transaction.paidOut,
          transaction.paidIn,
          transaction.type
        )}
      </Text>
    </TouchableOpacity>
  );
};
