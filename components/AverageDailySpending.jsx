import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

const AverageDailySpending = ({ transactions }) => {
  // Calculate total spending
  const totalSpending = transactions.reduce(
    (acc, transaction) => acc + Math.abs(transaction.amount),
    0
  );

  // Calculate number of unique days
  const uniqueDays = new Set(
    transactions.map((transaction) => transaction.date)
  ).size;

  // Calculate average daily spending
  const averageDailySpending = totalSpending / uniqueDays;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Average Daily Spending</Text>
      <Text style={styles.amount}>
        {" "}
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        }).format(averageDailySpending)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    marginBottom: 8,
  },
  amount: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: Colors.error,
  },
});

export default AverageDailySpending;
