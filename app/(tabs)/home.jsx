import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-react";
import Colors from "../../constants/Colors";
import PieChart from "../../components/PieChart";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionCard from "../../components/TransactionCard";
import {
  storeTransaction,
  getTransactions,
} from "../../configs/TransactionServices";
import DateTimePicker from "@react-native-community/datetimepicker";
import uuid from "react-native-uuid";

const initialCategories = [
  { id: "1", name: "Food", icon: "fast-food-outline", type: "expense" },
  { id: "2", name: "Transport", icon: "bus-outline", type: "expense" },
  { id: "3", name: "Shopping", icon: "cart-outline", type: "expense" },
  {
    id: "4",
    name: "Entertainment",
    icon: "game-controller-outline",
    type: "expense",
  },
  { id: "5", name: "Healthcare", icon: "heart-outline", type: "expense" },
  { id: "6", name: "Bills", icon: "receipt-outline", type: "expense" },
  { id: "7", name: "Salary", icon: "wallet-outline", type: "income" },
  { id: "8", name: "Freelance", icon: "briefcase-outline", type: "income" },
  { id: "9", name: "Investment", icon: "bar-chart-outline", type: "income" },
  { id: "10", name: "Gift", icon: "gift-outline", type: "income" },
  { id: "11", name: "Utilities", icon: "cloud-outline", type: "expense" },
  { id: "12", name: "Travel", icon: "airplane-outline", type: "expense" },
];

const HomeTab = () => {
  const { user } = useUser();
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isIncome, setIsIncome] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [inputAmount, setInputAmount] = useState("");
  const [inputDate, setInputDate] = useState(new Date());
  const [inputTime, setInputTime] = useState(new Date());
  const [inputNote, setInputNote] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(initialCategories);
  const [pieChartData, setPieChartData] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const prevTransactionsRef = useRef([]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentDateTime(
        `${now.toLocaleDateString(undefined, options)}, ${time}`
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      try {
        const fetchedTransactions = await getTransactions(user.id);

        // Check if transactions actually changed before updating state
        if (
          JSON.stringify(fetchedTransactions) !==
          JSON.stringify(prevTransactionsRef.current)
        ) {
          updateTransactionsAndChart(fetchedTransactions);
          prevTransactionsRef.current = fetchedTransactions;
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    const updateTransactionsAndChart = (fetchedTransactions) => {
      if (!fetchedTransactions || fetchedTransactions.length === 0) return;

      // Calculate balance
      const calculatedBalance = fetchedTransactions.reduce(
        (acc, transaction) =>
          acc +
          (transaction.type === "Income"
            ? transaction.amount
            : -transaction.amount),
        0
      );
      setCurrentBalance(calculatedBalance);

      // Sort transactions and keep the latest 5
      const sortedTransactions = [...fetchedTransactions].sort(
        (a, b) =>
          new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`)
      );
      setTransactions(sortedTransactions.slice(0, 5));

      // Update pie chart data
      const chartData = fetchedTransactions.reduce((acc, transaction) => {
        acc[transaction.category] =
          (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {});

      setPieChartData(
        Object.entries(chartData).map(([label, value]) => ({
          label,
          value: Math.abs(value),
        }))
      );
    };

    fetchTransactions();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const toggleTab = () => setIsIncome((prev) => !prev);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const addCustomCategory = () => {
    if (!customCategory.trim()) {
      Alert.alert("Invalid Category", "Please enter a valid category name.");
      return;
    }
    const newCategory = {
      id: Date.now().toString(),
      name: customCategory,
      icon: "create-outline",
      type: isIncome ? "income" : "expense",
    };
    setCategories((prev) => [...prev, newCategory]);
    setCustomCategory("");
  };

  const addTransaction = async () => {
    // Validate inputAmount to ensure it's a valid number
    if (!inputAmount || isNaN(inputAmount) || Number(inputAmount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    setIsAddingTransaction(true);

    try {
      // Ensure inputAmount is parsed to a number safely
      const amount = Math.abs(Number(inputAmount)); // This will ensure that it's a valid number

      const transaction = {
        id: uuid.v4(), // Use `react-native-uuid` or `crypto.randomUUID()` for the unique ID
        category: selectedCategory.name,
        amount: amount,
        date: formatDateToYYMMDD(inputDate),
        time: formatTimeToHHMM(inputTime),
        note: inputNote,
        type: isIncome ? "Income" : "Expense",
      };

      await storeTransaction(transaction, user);

      // Update local state without waiting for refresh
      const newBalance = currentBalance + (isIncome ? amount : -amount);
      setCurrentBalance(newBalance);

      // Update transactions list
      setTransactions((prev) => [transaction, ...prev].slice(0, 5));

      // Directly update pie chart
      setPieChartData((prev) => {
        const existing = prev.find(
          (item) => item.label === transaction.category
        );
        return existing
          ? prev.map((item) =>
              item.label === transaction.category
                ? { ...item, value: item.value + transaction.amount }
                : item
            )
          : [
              ...prev,
              { label: transaction.category, value: transaction.amount },
            ];
      });

      // Reset form
      setModalVisible(false);
      setInputAmount("");
      setInputDate(new Date());
      setInputTime(new Date());
      setInputNote("");
    } catch (error) {
      Alert.alert("Error", "Failed to store transaction");
    } finally {
      setIsAddingTransaction(false);
    }
  };

  // Helper function to format date in YY-MM-DD
  const formatDateToYYMMDD = (date) => {
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to format time in HH:MM
  const formatTimeToHHMM = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const renderCategory = ({ item }) =>
    item.type === (isIncome ? "income" : "expense") && (
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => handleCategoryPress(item)}
      >
        <Ionicons name={item.icon} size={24} color={Colors.primary} />
        <Text style={styles.categoryText}>{item.name}</Text>
      </TouchableOpacity>
    );

  return (
    <SafeAreaView>
      <View style={styles.headercontainer}>
        {/* Greeting */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {getGreeting()}, {user?.firstName || "User"}!
          </Text>
          <View style={styles.notificationContainer}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={Colors.light}
            />
          </View>
        </View>

        {/* Day and Date */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>

        {/* Current Balance */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "INR",
            }).format(currentBalance)}
          </Text>
        </View>
      </View>
      <ScrollView style={styles.container}>
        {/* Income and Expenses Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={toggleTab}
            style={[styles.toggleButton, isIncome && styles.activeToggle]}
          >
            <Text style={isIncome ? styles.activeText : styles.inactiveText}>
              Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleTab}
            style={[styles.toggleButton, !isIncome && styles.activeToggle]}
          >
            <Text style={!isIncome ? styles.activeText : styles.inactiveText}>
              Expenses
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryList}
        />

        {/* Add Custom Category */}
        <View style={styles.customCategoryContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add Custom Category"
            value={customCategory}
            onChangeText={setCustomCategory}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addCustomCategory}
          >
            <Ionicons name="add-outline" size={24} color={Colors.light} />
          </TouchableOpacity>
        </View>

        {/* Pie Chart */}
        <PieChart data={pieChartData} />
        {/* Recent Transactions */}
        <View style={{ minHeight: 400, marginBottom: 30 }}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.length === 0 ? (
            <Text style={styles.noTransactionText}>
              No transactions available!
            </Text>
          ) : (
            <ScrollView style={styles.transactionList}>
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  date={transaction.date}
                  time={transaction.time}
                  category={transaction.category}
                  type={transaction.type}
                  amount={transaction.amount}
                  note={transaction.note}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Modal for Adding Transaction */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add {isIncome ? "Income" : "Expense"} for {selectedCategory?.name}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={inputAmount}
              onChangeText={setInputAmount}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Select Date"
                value={inputDate.toLocaleDateString("en-US", {
                  year: "2-digit",
                  month: "2-digit",
                  day: "2-digit",
                })} // Format date as YY-MM-DD
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={inputDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || inputDate;
                  setShowDatePicker(false);
                  setInputDate(new Date(currentDate));
                }}
              />
            )}
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Select Time"
                value={inputTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} // Format time as HH:MM
                editable={false}
              />
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={inputTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedTime) => {
                  const currentTime = selectedTime || inputTime;
                  setShowTimePicker(false);
                  setInputTime(currentTime);
                }}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Enter Note"
              value={inputNote}
              onChangeText={setInputNote}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addTransaction}
              disabled={isAddingTransaction}
            >
              {isAddingTransaction ? (
                <ActivityIndicator color={Colors.light} />
              ) : (
                <Text style={styles.addButtonText}>Add</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headercontainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 18,
    fontFamily: "outfit-regular",
    color: Colors.light,
  },
  notificationContainer: {
    padding: 8,
    color: Colors.light,
  },
  dateContainer: {
    paddingTop: 1,
  },
  dateText: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: Colors.gray,
  },
  balanceContainer: {
    marginTop: 6,
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 16,
    color: Colors.light,
    fontFamily: "outfit-medium",
  },
  balanceAmount: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: Colors.light,
  },
  toggleContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  activeToggle: {
    backgroundColor: Colors.primary,
  },
  activeText: {
    color: Colors.light,
    fontFamily: "outfit-medium",
  },
  inactiveText: {
    color: Colors.primary,
    fontFamily: "outfit-medium",
  },
  categoryList: {
    marginBottom: 16,
  },
  categoryButton: {
    alignItems: "center",
    marginHorizontal: 8,
    padding: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
  },
  categoryText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "outfit-regular",
    color: Colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: Colors.primary,
    color: Colors.light,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: Colors.light,
    fontFamily: "outfit-bold",
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.secondary,
    fontFamily: "outfit-medium",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: Colors.light,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.primary,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.primary,
    marginBottom: 10,
  },
  noTransactionText: {
    fontSize: 16,
    color: "#777",
    fontFamily: "outfit-medium",
    textAlign: "center",
    marginTop: 20,
  },
  transactionList: {
    marginBottom: 200,
  },
};

export default HomeTab;
