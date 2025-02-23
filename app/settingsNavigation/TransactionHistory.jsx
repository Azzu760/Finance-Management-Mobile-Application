import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SectionList,
  TouchableOpacity,
} from "react-native";
import { getTransactions } from "../../configs/TransactionServices";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import { generateTransactionHistoryPdf } from "../../components/generatePDF";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const TransactionHistory = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    if (isSignedIn && user?.id) {
      fetchTransactions(user.id);
    }
  }, [isSignedIn, user?.id]);

  const handlePdfDownload = async () => {
    try {
      const sections = groupTransactionsByMonth();
      await generateTransactionHistoryPdf(sections);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const fetchTransactions = async (userId) => {
    try {
      const data = await getTransactions(userId);
      // Sort transactions in descending order by date
      const sortedTransactions = data.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setTransactions(sortedTransactions);

      // Calculate total income and expense
      let income = 0;
      let expense = 0;
      sortedTransactions.forEach((transaction) => {
        if (transaction.amount > 0) {
          income += transaction.amount;
        } else {
          expense += Math.abs(transaction.amount);
        }
      });

      setTotalIncome(income);
      setTotalExpense(expense);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupTransactionsByMonth = () => {
    const groupedTransactions = {};
    transactions.forEach((transaction) => {
      const transactionYear = dayjs(transaction.date).format("YY");
      const fullYear = `20${transactionYear}`;

      const transactionMonth =
        dayjs(transaction.date).format("MMMM") + ` ${fullYear}`;

      if (!groupedTransactions[transactionMonth]) {
        groupedTransactions[transactionMonth] = {
          income: 0,
          expense: 0,
          data: [],
        };
      }
      groupedTransactions[transactionMonth].data.push(transaction);
      if (transaction.amount > 0) {
        groupedTransactions[transactionMonth].income += transaction.amount;
      } else {
        groupedTransactions[transactionMonth].expense += Math.abs(
          transaction.amount
        );
      }
    });
    return Object.entries(groupedTransactions).map(
      ([month, { income, expense, data }]) => ({
        title: month,
        income,
        expense,
        data,
      })
    );
  };

  const renderTransactionItem = ({ item }) => {
    const formattedDate = dayjs(item.date).format("YYYY-MM-DD HH:mm");
    const year = formattedDate.slice(0, 4);

    const modifiedYear = year.replace(/^00/, "20");

    const finalFormattedDate = formattedDate.replace(year, modifiedYear);

    return (
      <View
        style={{
          padding: 12,
          borderRadius: 12,
          marginBottom: 8,
          backgroundColor: colors.card,
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <View style={styles.transactionDetails}>
          <View>
            {item.category && (
              <Text
                style={{
                  fontSize: 14,
                  color: colors.text,
                  fontFamily: "outfit-bold",
                }}
              >
                {item.category}
              </Text>
            )}
          </View>
          <Text
            style={{
              fontSize: 14,
              color: item.type === "Income" ? Colors.income : Colors.expense,
              fontFamily: "outfit-bold",
            }}
          >
            {" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "INR",
            }).format(item.amount)}
          </Text>
        </View>
        <View style={styles.transactionMeta}>
          {item.note && (
            <Text
              style={{
                fontSize: 12,
                marginTop: 8,
                opacity: 0.8,
                color: colors.text,
                fontFamily: "outfit-regular",
              }}
            >
              {item.note}
            </Text>
          )}
          <Text
            style={{
              fontSize: 10,
              opacity: 0.7,
              color: colors.text,
              fontFamily: "outfit-regular",
            }}
          >
            {finalFormattedDate}
          </Text>
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({ section: { title, income, expense } }) => {
    const total = income - expense;

    return (
      <View style={styles.monthHeader}>
        <Text style={[styles.monthTitle]}>{title}</Text>
        <Text
          style={[
            styles.totalText,
            {
              color: income > expense ? "gray" : Colors.expense,
            },
          ]}
        >
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR",
          }).format(total)}{" "}
        </Text>
      </View>
    );
  };

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isSignedIn) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.text }}>
          Please sign in to view transactions.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const sections = groupTransactionsByMonth();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
        <TouchableOpacity onPress={handlePdfDownload} style={styles.pdfIcon}>
          <Ionicons name="document" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <SectionList
        sections={groupTransactionsByMonth()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransactionItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontFamily: "outfit-medium",
  },
  totalText: {
    fontSize: 16,
    fontFamily: "outfit-medium",
  },
  transactionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 15,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 18,
    color: Colors.light,
    flex: 1,
    fontFamily: "outfit-bold",
  },
  pdfIcon: {
    paddingBottom: 8,
  },
});

export default TransactionHistory;
