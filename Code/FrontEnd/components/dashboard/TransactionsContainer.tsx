import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { DashboardTransactionItem } from "./DashboardTransactionItem";

interface Transaction {
  description: string;
  time: string;
  amount: string;
}

interface TransactionsContainerProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export const TransactionsContainer = ({
  transactions,
  isLoading = false,
}: TransactionsContainerProps) => {
  if (isLoading) {
    return (
      <View
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          marginHorizontal: 20,
          padding: 40,
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="small" color="#3b82f6" />
        <Text style={{ marginTop: 12, color: "#64748b", fontSize: 14 }}>
          Loading transactions...
        </Text>
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          marginHorizontal: 20,
          padding: 40,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#64748b", marginBottom: 8 }}>
          No recent transactions
        </Text>
        <Text style={{ color: "#9ca3af", fontSize: 12, textAlign: "center" }}>
          Your recent transactions will appear here
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginHorizontal: 20,
      }}
    >
      {transactions.map((transaction, index) => (
        <DashboardTransactionItem
          key={index}
          description={transaction.description}
          time={transaction.time}
          amount={transaction.amount}
          isLast={index === transactions.length - 1}
        />
      ))}
    </View>
  );
};
