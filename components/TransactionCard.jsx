import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TransactionCard = ({ date, time, category, type, amount, note }) => {
  return (
    <View
      style={[
        styles.transactionItem,
        type === "Expense" ? styles.expenseCard : styles.incomeCard,
      ]}
    >
      <View style={styles.leftSection}>
        <Text style={styles.categoryText}>{category}</Text>
        <Text style={styles.dateText}>{`${date} | ${time}`}</Text>
        {note && <Text style={styles.noteText}>{note}</Text>}
      </View>
      <Text
        style={[
          styles.amountText,
          type === "Expense" ? styles.expenseText : styles.incomeText,
        ]}
      >
        {type === "Expense" ? "-" : "+"}
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        }).format(amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#F9F9F9",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  leftSection: {
    flex: 1,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "outfit-bold",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 10,
    fontFamily: "outfit-medium",
    color: "#777",
    marginBottom: 5,
  },
  noteText: {
    fontSize: 8,
    color: "#999",
    fontFamily: "outfit-medium",
  },
  amountText: {
    fontSize: 14,
    fontFamily: "outfit-bold",
  },
  expenseText: {
    color: "#D32F2F",
  },
  incomeText: {
    color: "#388E3C",
  },
  expenseCard: {
    borderLeftWidth: 6,
    borderLeftColor: "#FFCDD2",
  },
  incomeCard: {
    borderLeftWidth: 6,
    borderLeftColor: "#C8E6C9",
  },
});

export default TransactionCard;
