import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import Color from "../constants/Colors";

const screenWidth = Dimensions.get("window").width;

const PieChartComponent = ({ data }) => {
  const hasData = data && data.length > 0;

  const chartData = hasData
    ? data.map((item) => ({
        name: item.label,
        population: item.value,
        color: item.color || getRandomColor(),
        legendFontColor: "#000",
        legendFontSize: 12,
      }))
    : [
        {
          name: "Placeholder 1",
          population: 50,
          color: "#E0E0E0",
          legendFontColor: "#757575",
          legendFontSize: 0,
        },
        {
          name: "Placeholder 2",
          population: 50,
          color: "#BDBDBD",
          legendFontColor: "#757575",
          legendFontSize: 0,
        },
      ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Income vs Expenses</Text>
      <PieChart
        data={chartData}
        width={screenWidth * 0.9}
        height={220}
        chartConfig={{
          backgroundColor: "#F5F5F5",
          backgroundGradientFrom: "#FFF",
          backgroundGradientTo: "#FFF",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[0, 0]}
        hasLegend={hasData}
      />
    </View>
  );
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 20,
    alignItems: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Color.primary,
  },
});

export default PieChartComponent;
