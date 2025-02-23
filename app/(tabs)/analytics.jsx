import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-react";
import CategoryBreakdown from "../../components/CategoryBreakdown";
import MonthWiseTransactionGraph from "../../components/MonthWiseTransactionGraph";
import AverageDailySpending from "../../components/AverageDailySpending";
import HighestLowestTransactions from "../../components/HighestLowestTransactions";
import SpendingTrendPrediction from "../../components/SpendingTrendPrediction";
import { getTransactions } from "../../configs/TransactionServices";
import Colors from "../../constants/Colors";

const Analytics = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchTransactions = async () => {
      try {
        const data = await getTransactions(userId);
        setTransactions(data || []); // Ensure that transactions is never undefined
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Fetch data every 3 seconds
    const interval = setInterval(fetchTransactions, 3000);

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, [userId]);

  // Handle the loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  // Render each component based on its type
  const renderItem = ({ item }) => {
    switch (item.type) {
      case "AverageDailySpending":
        return <AverageDailySpending transactions={transactions} />;
      case "SpendingTrendPrediction":
        return <SpendingTrendPrediction transactions={transactions} />;
      case "HighestLowestTransactions":
        return <HighestLowestTransactions transactions={transactions} />;
      case "MonthWiseTransactionGraph":
        return <MonthWiseTransactionGraph transactions={transactions} />;
      case "CategoryBreakdown":
        return <CategoryBreakdown type="Expense" transactions={transactions} />;
      case "IncomeCategoryBreakdown":
        return <CategoryBreakdown type="Income" transactions={transactions} />;
      default:
        return null;
    }
  };

  const data = [
    { type: "AverageDailySpending" },
    { type: "SpendingTrendPrediction" },
    { type: "HighestLowestTransactions" },
    { type: "MonthWiseTransactionGraph" },
    { type: "CategoryBreakdown" },
    { type: "IncomeCategoryBreakdown" },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Analytics</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.type}
        style={styles.container}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
    alignItems: "left",
  },
  headerText: {
    fontSize: 18,
    paddingBottom: 4,
    fontFamily: "outfit-bold",
    color: "#ffffff",
  },
});

export default Analytics;
