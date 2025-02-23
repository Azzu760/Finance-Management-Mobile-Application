import React, { useState } from "react";
import { BarChart } from "react-native-chart-kit";
import { Dimensions, View, Text, ScrollView, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const screenWidth = Dimensions.get("window").width;

const MonthWiseTransactionGraph = ({ transactions }) => {
  const currentYear = new Date().getFullYear();
  const years = [
    ...new Set(
      transactions.map((transaction) => {
        return (
          "20" + new Date(transaction.date).getFullYear().toString().slice(-2)
        );
      })
    ),
  ].sort((a, b) => b - a);

  const [selectedYear, setSelectedYear] = useState(
    years.includes("20" + currentYear.toString().slice(-2))
      ? "20" + currentYear.toString().slice(-2)
      : years[0]
  );

  const monthlyTotals = transactions.reduce((acc, transaction) => {
    const fullYear = new Date(transaction.date).getFullYear();
    const month = new Date(transaction.date).getMonth() + 1;

    if ("20" + fullYear.toString().slice(-2) === selectedYear) {
      const key = `${fullYear}-${month.toString().padStart(2, "0")}`;
      acc[key] = (acc[key] || 0) + transaction.amount;
    }

    return acc;
  }, {});

  const labels = Object.keys(monthlyTotals);
  const data = Object.values(monthlyTotals);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Month-wise Transactions</Text>
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Select Year:</Text>
        <Picker
          selectedValue={selectedYear}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          {years.map((year) => (
            <Picker.Item key={year} label={year} value={year} />
          ))}
        </Picker>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.length > 0 ? (
          <BarChart
            data={{
              labels: labels,
              datasets: [{ data: data }],
            }}
            width={Math.max(
              300,
              Math.min(screenWidth - 20, labels.length * 60)
            )}
            height={240}
            yAxisLabel="₹"
            chartConfig={{
              backgroundGradientFrom: "#43cea2",
              backgroundGradientTo: "#185a9d",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              barPercentage: 0.6,
              propsForLabels: {
                fontSize: 10,
                fontFamily: "outfit-regular",
                fill: "#222",
              },
              propsForYAxisLabels: {
                fontSize: 10,
                fontFamily: "outfit-regular",
                fill: "#222",
              },
              propsForBackgroundLines: {
                strokeWidth: 0.4,
                stroke: "#b0bec5",
              },
            }}
            style={styles.chart}
          />
        ) : (
          <Text style={styles.noDataText}>No Data Available</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    textAlign: "left",
    marginBottom: 15,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: "100%",
  },
  pickerLabel: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: "#666",
    marginRight: 10,
  },
  picker: {
    height: 50,
    width: 120,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  noDataText: {
    textAlign: "center",
    fontFamily: "outfit-regular",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
});

export default MonthWiseTransactionGraph;
