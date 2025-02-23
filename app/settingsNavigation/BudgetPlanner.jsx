import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import {
  storeBudgetPlan,
  getTransactions,
} from "../../configs/TransactionServices";
import AddPlanCard from "../../components/AddPlanCard";

const BudgetPlanner = () => {
  const { user } = useUser();
  const userId = user?.id;

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [categoryName, setCategoryName] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [transactionData, budgetData] = await Promise.all([
          getTransactions(userId),
        ]);
        setTransactions(transactionData || []);
        setCategories(budgetData || []);
        updateBalance(transactionData, budgetData);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, updateTrigger]);

  const updateBalance = (transactionData) => {
    const totalIncome = transactionData
      .filter((t) => t.type === "Income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactionData
      .filter((t) => t.type === "Expense")
      .reduce((sum, t) => sum + t.amount, 0);

    setCurrentBalance(totalIncome - totalExpenses);
  };

  const addCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert("Error", "Please enter a category name.");
      return;
    }

    try {
      const newCategory = {
        name: categoryName.trim(),
        items: [],
        totalAmount: 0,
      };

      await storeBudgetPlan(userId, newCategory);

      setCategoryName("");
      Keyboard.dismiss();
      setUpdateTrigger((prev) => prev + 1);
    } catch {
      Alert.alert("Error", "Failed to add category.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Budget Planner</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={styles.loading}
        />
      ) : (
        <View style={styles.mainContent}>
          <AddPlanCard currentBalance={currentBalance} userId={userId} />

          <View style={styles.categoryInput}>
            <TextInput
              style={styles.input}
              placeholder="New Category"
              value={categoryName}
              onChangeText={setCategoryName}
            />
            <TouchableOpacity style={styles.addButton} onPress={addCategory}>
              <Ionicons name="add-circle" size={30} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
  },
  title: {
    paddingBottom: 8,
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: "#fff",
  },
  loading: {
    marginTop: 250,
  },
  mainContent: {
    flex: 1,
    padding: 12,
  },
  categoryInput: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
    fontFamily: "outfit-regular",
  },
  addButton: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BudgetPlanner;
