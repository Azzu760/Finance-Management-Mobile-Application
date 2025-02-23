import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { getTransactions } from "../../configs/TransactionServices";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import dayjs from "dayjs";
import DateTimePicker from "@react-native-community/datetimepicker";

const TransactionsTab = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState("week");
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  useEffect(() => {
    let intervalId;

    const fetchTransactions = async () => {
      if (!user) {
        console.error("User not logged in");
        return;
      }

      try {
        const transactionsData = await getTransactions(user.id);
        setTransactions(transactionsData);
        setFilteredTransactions(transactionsData);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Only set the interval if no filter is applied
    if (!isFilterApplied) {
      intervalId = setInterval(fetchTransactions, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, isFilterApplied]);

  const formatDateToYYMMDD = (date) => {
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTimeToHHMM = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const applyFilter = () => {
    const { startDate, endDate } = filter;

    if (startDate && endDate) {
      const formattedStartDate = formatDateToYYMMDD(startDate);
      const formattedEndDate = formatDateToYYMMDD(endDate);

      const filtered = transactions.filter((transaction) => {
        const transactionDateString = `${transaction.date} ${transaction.time}`;
        const transactionDate = new Date(transactionDateString);
        const formattedTransactionDate = formatDateToYYMMDD(transactionDate);

        return (
          formattedTransactionDate >= formattedStartDate &&
          formattedTransactionDate <= formattedEndDate
        );
      });
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }

    // Set isFilterApplied to true when a filter is applied
    setIsFilterApplied(true);
  };

  const applyQuickFilter = (range) => {
    const now = dayjs();
    const ranges = {
      week: now.subtract(1, "week").toDate(),
      month: now.subtract(1, "month").toDate(),
      threeMonths: now.subtract(3, "month").toDate(),
      sixMonths: now.subtract(6, "month").toDate(),
      year: now.subtract(1, "year").toDate(),
    };

    // Filter transactions with valid date and time
    const filteredTransactions = transactions.filter(
      (transaction) => transaction.date && transaction.time
    );

    const filtered = filteredTransactions.filter((transaction) => {
      const transactionDateString = `${transaction.date} ${transaction.time}`;
      const transactionDate = new Date(transactionDateString);
      const formattedTransactionDate =
        formatDateToYYMMDD(transactionDate) +
        " " +
        formatTimeToHHMM(transactionDate);

      const rangeStartDate = ranges[range];
      const formattedRangeStartDate =
        formatDateToYYMMDD(rangeStartDate) + " 00:00";

      return formattedTransactionDate >= formattedRangeStartDate;
    });
    setFilteredTransactions(filtered);

    // Set isFilterApplied to true when a quick filter is applied
    setIsFilterApplied(true);
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
    setFilter((prev) => ({ ...prev, startDate: currentDate }));
    setStartDatePickerVisible(false);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
    setFilter((prev) => ({ ...prev, endDate: currentDate }));
    setEndDatePickerVisible(false);
  };

  // Calculate total income and expenses
  const calculateTotalIncomeAndExpenses = () => {
    let income = 0;
    let expenses = 0;
    filteredTransactions.forEach((transaction) => {
      if (transaction.type === "Income") {
        income += transaction.amount;
      } else if (transaction.type === "Expense") {
        expenses += transaction.amount;
      }
    });
    return { income, expenses };
  };

  const { income, expenses } = calculateTotalIncomeAndExpenses();

  const resetFilters = () => {
    setActiveFilter(null);
    setFilteredTransactions(transactions);
    setFilter({ startDate: null, endDate: null });
    setIsFilterApplied(false); // Reset isFilterApplied when filters are reset
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Sort filteredTransactions by date and time descending
  const sortedTransactions = filteredTransactions.sort((a, b) => {
    const dateA = new Date(a.date + " " + a.time);
    const dateB = new Date(b.date + " " + b.time);
    return dateB - dateA;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        filter={filter}
        onFilterChange={setFilter}
        onApplyFilter={applyFilter}
        onApplyQuickFilter={applyQuickFilter}
        onStartDatePress={() => setStartDatePickerVisible(true)}
        onEndDatePress={() => setEndDatePickerVisible(true)}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        income={income}
        expenses={expenses}
        resetFilters={resetFilters}
      />

      <FlatList
        data={sortedTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        ListEmptyComponent={<NoTransactions />}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />

      {isStartDatePickerVisible && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {isEndDatePickerVisible && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
    </SafeAreaView>
  );
};

const Header = ({
  filter,
  onApplyFilter,
  onApplyQuickFilter,
  onStartDatePress,
  onEndDatePress,
  activeFilter,
  setActiveFilter,
  income,
  expenses,
  resetFilters,
}) => (
  <View style={styles.header}>
    <View style={styles.headerTitleContainer}>
      <Text style={styles.title}>Transactions</Text>

      <TouchableOpacity onPress={resetFilters} style={styles.refreshButton}>
        <AntDesign name="reload1" size={20} color="#fff" />
      </TouchableOpacity>
    </View>

    {/* Quick Filters (Week, Month, 3 Month, 6 Month, 1 Year) */}
    <View style={styles.quickFilterContainer}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {["week", "month", "threeMonths", "sixMonths", "year"].map((range) => (
          <TouchableOpacity
            key={range}
            onPress={() => {
              setActiveFilter(range);
              onApplyQuickFilter(range);
            }}
            style={[
              styles.quickFilterButton,
              activeFilter === range && styles.activeFilterButton,
            ]}
          >
            <Text
              style={[
                styles.quickFilterText,
                activeFilter === range && styles.activeFilterText,
              ]}
            >
              {range === "week"
                ? "1 Week"
                : range === "month"
                ? "1 Month"
                : range === "threeMonths"
                ? "3 Months"
                : range === "sixMonths"
                ? "6 Months"
                : "1 Year"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>

    {/* Date Filters and Apply Button */}
    <View style={styles.dateFiltersContainer}>
      <TouchableOpacity
        onPress={onStartDatePress}
        style={styles.dateFilterButton}
      >
        <Text style={styles.dateFilterText}>
          {filter.startDate
            ? dayjs(filter.startDate).format("MM/DD/YYYY")
            : "Start Date"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onEndDatePress}
        style={styles.dateFilterButton}
      >
        <Text style={styles.dateFilterText}>
          {filter.endDate
            ? dayjs(filter.endDate).format("MM/DD/YYYY")
            : "End Date"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onApplyFilter}
        style={[
          styles.applyButton,
          filter.startDate && filter.endDate && styles.applyButtonActive,
        ]}
      >
        <Text style={styles.applyButtonText}>Search</Text>
      </TouchableOpacity>
    </View>

    {/* Total Income and Expenses */}
    <View style={styles.totalContainer}>
      <View style={styles.totalIncomeContainer}>
        <AntDesign
          name="arrowup"
          size={20}
          color="green"
          style={styles.arrowIcon}
        />
        <Text style={styles.totalText}>
          {" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR",
          }).format(income)}
        </Text>
      </View>

      <View style={styles.totalExpensesContainer}>
        <AntDesign
          name="arrowdown"
          size={20}
          color="red"
          style={styles.arrowIcon}
        />
        <Text style={styles.totalText}>
          {" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR",
          }).format(expenses)}
        </Text>
      </View>
    </View>
  </View>
);

const NoTransactions = () => (
  <View style={styles.centered}>
    <Text style={styles.noTransactionsText}>No transactions found</Text>
  </View>
);

const TransactionItem = ({ transaction }) => (
  <ScrollView style={styles.transactionItem}>
    <View style={styles.headerRow}>
      <View style={styles.leftSide}>
        <Text style={styles.category}>{transaction.category}</Text>
      </View>

      <Text
        style={[
          styles.amount,
          {
            color:
              transaction.type === "Income" ? Colors.income : Colors.expense,
          },
        ]}
      >
        {transaction.type === "Income" ? "+" : "-"}
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        }).format(transaction.amount)}
      </Text>
    </View>

    <View style={styles.footerRow}>
      <Text style={styles.note}>{transaction.note}</Text>
      <Text style={styles.dateTime}>
        {transaction.date}|{transaction.time}
      </Text>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  headerTitleContainer: {
    paddingVertical: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: "#fff",
    marginBottom: 8,
  },
  refreshButton: {
    paddingBottom: 8,
  },
  quickFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  quickFilterButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderStyle: "solid",
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: Colors.highlight,
  },
  quickFilterText: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: "#fff",
  },
  activeFilterText: {
    fontWeight: "bold",
  },
  dateFiltersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dateFilterButton: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderStyle: "solid",
    alignItems: "center",
    marginRight: 5,
  },
  dateFilterText: {
    fontSize: 12,
    fontFamily: "outfit-medium",
    color: "#fff",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderStyle: "solid",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 12,
    fontFamily: "outfit-bold",
    color: "#fff",
  },
  applyButtonActive: {
    backgroundColor: "Colors.highlight",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  totalIncomeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalExpensesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "outfit-bold",
  },
  arrowIcon: {
    marginRight: 5,
  },
  transactionItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginVertical: 2,
    borderRadius: 12,
    shadowColor: "#ccc",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  leftSide: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  category: {
    fontSize: 14,
    fontFamily: "outfit-bold",
  },
  type: {
    fontSize: 12,
    fontFamily: "outfit-medium",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    color: "#fff",
    textTransform: "uppercase",
  },
  amount: {
    fontSize: 14,
    fontFamily: "outfit-bold",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  note: {
    fontSize: 10,
    fontFamily: "outfit-medium",
    color: "#666",
    marginBottom: 8,
  },
  dateTime: {
    fontSize: 10,
    fontFamily: "outfit-medium",
    color: "#aaa",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTransactionsText: {
    fontSize: 18,
    fontFamily: "outfit-medium",
    color: Colors.primary,
  },
});

export default TransactionsTab;
