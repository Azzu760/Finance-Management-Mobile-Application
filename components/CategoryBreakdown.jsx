import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Colors from "../constants/Colors";

const CategoryBreakdown = ({ type = "Expense", transactions, loading }) => {
  const filteredTransactions = transactions.filter(
    (transaction) => transaction.type === type
  );

  const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
    acc[transaction.category] =
      (acc[transaction.category] || 0) + Math.abs(transaction.amount);
    return acc;
  }, {});

  const categoryData = Object.keys(categoryTotals).map((category) => ({
    category,
    total: categoryTotals[category],
  }));

  categoryData.sort((a, b) => b.total - a.total);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {type === "Expense"
          ? "Top Expense Categories"
          : "Top Income Categories"}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : categoryData.length === 0 ? (
        <Text style={styles.noDataText}>
          No {type.toLowerCase()} transactions available.
        </Text>
      ) : (
        <FlatList
          data={categoryData}
          keyExtractor={(item) => item.category}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.amount}>
                {" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "INR",
                }).format(item.total)}
              </Text>
            </View>
          )}
        />
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
    marginBottom: 12,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  category: {
    fontSize: 16,
    fontFamily: "outfit-regular",
  },
  amount: {
    fontSize: 16,
    fontFamily: "outfit-regular",
    color: "gray",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
    color: "#888",
  },
});

export default CategoryBreakdown;
