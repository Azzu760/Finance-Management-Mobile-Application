import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import { Card } from "react-native-paper";
import { Svg, Circle, Text as SvgText, Path } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTenure, setLoanTenure] = useState(5);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  // Calculate EMI
  const calculateEMI = () => {
    const principal = loanAmount;
    const rate = interestRate / 12 / 100;
    const months = loanTenure * 12;

    if (rate === 0) {
      const totalPayment = principal;
      setEmi(totalPayment / months);
      setTotalInterest(0);
      setTotalPayment(totalPayment);
      return;
    }

    const emiValue =
      (principal * rate * Math.pow(1 + rate, months)) /
      (Math.pow(1 + rate, months) - 1);
    const totalPaymentValue = emiValue * months;
    const totalInterestValue = totalPaymentValue - principal;

    setEmi(emiValue.toFixed(2));
    setTotalPayment(totalPaymentValue.toFixed(2));
    setTotalInterest(totalInterestValue.toFixed(2));
  };

  // Update EMI whenever values change
  React.useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTenure]);

  const principalPercentage =
    (loanAmount / (parseFloat(loanAmount) + parseFloat(totalInterest))) * 100;
  const interestPercentage = 100 - principalPercentage;

  const principalAngle = (principalPercentage / 100) * 360;
  const interestAngle = (interestPercentage / 100) * 360;

  const calculateArcPoints = (angle, radius, centerX = 125, centerY = 125) => {
    const radians = (angle - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(radians);
    const y = centerY + radius * Math.sin(radians);
    return `${x} ${y}`;
  };

  const principalStart = calculateArcPoints(0, 100);
  const principalEnd = calculateArcPoints(principalAngle, 100);
  const interestStart = calculateArcPoints(principalAngle, 100);
  const interestEnd = calculateArcPoints(360, 100);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>EMI Calculator</Text>
      </View>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          {/* Loan Amount */}
          <View style={styles.row}>
            <Text style={styles.label}>Loan Amount</Text>
            <Text style={styles.value}>₹ {loanAmount.toLocaleString()}</Text>
          </View>
          <Slider
            value={loanAmount}
            onValueChange={(value) => setLoanAmount(value[0])}
            minimumValue={50000}
            maximumValue={5000000}
            step={10000}
            thumbTintColor="#4CAF50"
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#ddd"
          />

          {/* Interest Rate */}
          <View style={styles.row}>
            <Text style={styles.label}>Rate of Interest (p.a)</Text>
            <Text style={styles.value}>{interestRate.toFixed(1)}%</Text>
          </View>
          <Slider
            value={interestRate}
            onValueChange={(value) => setInterestRate(value[0])}
            minimumValue={1}
            maximumValue={20}
            step={0.1}
            thumbTintColor="#2196F3"
            minimumTrackTintColor="#2196F3"
            maximumTrackTintColor="#ddd"
          />

          {/* Loan Tenure */}
          <View style={styles.row}>
            <Text style={styles.label}>Loan Tenure</Text>
            <Text style={styles.value}>{loanTenure} Yr</Text>
          </View>
          <Slider
            value={loanTenure}
            onValueChange={(value) => setLoanTenure(value[0])}
            minimumValue={1}
            maximumValue={30}
            step={1}
            thumbTintColor="#FF9800"
            minimumTrackTintColor="#FF9800"
            maximumTrackTintColor="#ddd"
          />
        </Card>

        {/* Results */}
        <Card style={styles.resultsCard}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Monthly EMI:</Text>
            <Text style={styles.resultValue}>₹ {emi}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Principal Amount:</Text>
            <Text style={styles.resultValue}>
              ₹ {loanAmount.toLocaleString()}
            </Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Interest:</Text>
            <Text style={styles.resultValue}>
              ₹ {totalInterest.toLocaleString()}
            </Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Payment:</Text>
            <Text style={styles.resultValue}>
              ₹ {totalPayment.toLocaleString()}
            </Text>
          </View>
        </Card>

        {/* Pie Chart */}
        <View style={styles.pieContainer}>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#4CAF50" }]}
              />
              <Text style={styles.legendText}>Principal</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#2196F3" }]}
              />
              <Text style={styles.legendText}>Interest</Text>
            </View>
          </View>

          <Svg height={250} width={250} style={styles.pieSvg}>
            <Path
              d={`M ${principalStart} A 100 100 0 ${
                principalAngle > 180 ? 1 : 0
              } 1 ${principalEnd}`}
              stroke="#4CAF50"
              strokeWidth="30"
              fill="none"
            />
            <Path
              d={`M ${interestStart} A 100 100 0 ${
                interestAngle > 180 ? 1 : 0
              } 1 ${interestEnd}`}
              stroke="#2196F3"
              strokeWidth="30"
              fill="none"
            />

            <SvgText
              x="125"
              y="125"
              textAnchor="middle"
              fontSize="18"
              fontWeight="500"
              fill="#333"
            >
              EMI Breakdown
            </SvgText>
          </Svg>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontFamily: "outfit-regular",
    color: "#555",
  },
  value: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: "#333",
  },
  resultsCard: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 4,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  resultLabel: {
    fontSize: 16,
    color: "#555",
    fontFamily: "outfit-regular",
  },
  resultValue: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: "#333",
  },

  pieContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginTop: 20,
    marginBottom: 40,
  },

  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 50,
    marginVertical: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 20,
    height: 10,
    borderRadius: 10,
    marginRight: 5,
  },
  legendText: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: "#333",
  },
});

export default EMICalculator;
