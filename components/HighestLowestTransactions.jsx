import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

const HighestLowestTransactions = ({ transactions }) => {
  if (!transactions?.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Transactions</Text>
        <Text style={styles.noData}>No transactions available</Text>
      </View>
    );
  }

  const highest = transactions.reduce((max, t) =>
    t.amount > max.amount ? t : max
  );
  const lowest = transactions.reduce((min, t) =>
    t.amount < min.amount ? t : min
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Highest & Lowest Transaction</Text>
      <View style={styles.row}>
        <TransactionCard
          label="Highest"
          amount={highest.amount}
          category={highest.category}
        />
        <TransactionCard
          label="Lowest"
          amount={lowest.amount}
          category={lowest.category}
        />
      </View>
    </View>
  );
};

const TransactionCard = ({ label, amount, category }) => (
  <View style={styles.card}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.amount}>
      {" "}
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount)}
    </Text>
    <Text style={styles.category}>{category}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    marginBottom: 8,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F5F7FA",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: "#555",
  },
  amount: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: Colors.warning,
  },
  category: {
    fontSize: 12,
    fontFamily: "outfit-regular",
    color: "#888",
  },
  noData: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "outfit-regular",
    color: "#888",
  },
});

export default HighestLowestTransactions;
