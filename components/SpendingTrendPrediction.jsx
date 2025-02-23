import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useUser } from "@clerk/clerk-react";
import { getTransactions } from "../configs/TransactionServices";
import Colors from "../constants/Colors";

const SpendingTrendPrediction = ({ transactions }) => {
  const [loading, setLoading] = useState(true);
  const [predictedTrend, setPredictedTrend] = useState(null);

  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    // Filter the transactions for "Expense" type only if transactions exist
    const expenseTransactions = transactions.filter(
      (transaction) => transaction.type === "Expense"
    );

    if (expenseTransactions.length === 0) {
      setPredictedTrend(0); // Set to 0 if no expense transactions are found
      setLoading(false);
      return;
    }

    // Extract the amounts for the moving average
    const amounts = expenseTransactions.map((transaction) =>
      Math.abs(transaction.amount)
    );

    // Use a simple moving average over the last 7 transactions
    const movingAverage =
      amounts.slice(-7).reduce((acc, amount) => acc + amount, 0) / 7;

    setPredictedTrend(movingAverage);
    setLoading(false);
  }, [transactions]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending Trend Prediction</Text>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : predictedTrend === null ? (
        <Text style={styles.noDataText}>No data available for prediction.</Text>
      ) : (
        <View style={styles.trendContainer}>
          <Text style={styles.trendText}>
            Based on your recent spending trends, your average monthly
            expenditure is approximately:
          </Text>
          <Text style={styles.prediction}>
            ₹{predictedTrend.toFixed(2)} per month.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    marginBottom: 2,
  },
  trendContainer: {
    marginTop: 12,
  },
  trendText: {
    fontSize: 16,
    fontFamily: "outfit-regular",
    color: "#333",
    marginBottom: 8,
  },
  prediction: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: Colors.secondary,
    marginTop: 8,
    textAlign: "center",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
    color: "#888",
  },
});

export default SpendingTrendPrediction;
