import React from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Colors from "../../constants/Colors";

const PaymentPage = () => {
  const router = useRouter();

  const handleNavigation = (route) => {
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Payments</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.iconRow}>
          {/* PhonePe */}
          <TouchableOpacity
            onPress={() => handleNavigation("/paymentGateways/UPIPayment")}
            style={styles.iconContainer}
          >
            <Image
              source={require("../../assets/images/upi-logo.png")}
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* Khalti */}
          <TouchableOpacity
            onPress={() => handleNavigation("/paymentGateways/Khalti")}
            style={styles.iconContainer}
          >
            <Image
              source={require("../../assets/images/Khalti-logo.png")}
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* eSewa */}
          <TouchableOpacity
            onPress={() => handleNavigation("/paymentGateways/Esewa")}
            style={styles.iconContainer}
          >
            <Image
              source={require("../../assets/images/Esewa-logo.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.subText}>Tap any icon to proceed with payment</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
  },
  headerText: {
    fontSize: 18,
    paddingBottom: 4,
    fontFamily: "outfit-bold",
    color: "#fff",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    marginVertical: 20,
    width: "100%",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    paddingVertical: 10,
  },
  iconContainer: {
    backgroundColor: "#fff",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  subText: {
    marginTop: 20,
    fontSize: 14,
    fontFamily: "outfit-regular",
    color: "#888",
    textAlign: "center",
  },
});

export default PaymentPage;
