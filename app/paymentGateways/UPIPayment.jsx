import React, { useState } from "react";
import { View, Text, Alert, StyleSheet, Linking, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddPaymentDetail from "./AddPaymentDetail";
import Colors from "../../constants/Colors";

const UPIPayment = () => {
  const handleUPIPayment = async (phoneNo, amount, remark = "Payment") => {
    if (!phoneNo || !amount) {
      Alert.alert("Error", "Phone Number and Amount are required!");
      return;
    }

    const upiSuffixes = [
      "@ybl",
      "@axl",
      "@ibl",
      "@okhdfcbank",
      "@oksbi",
      "@okicici",
      "@paytm",
      "@okaxis",
      "@okkotak",
      "@upi",
    ];

    let upiId;
    for (let suffix of upiSuffixes) {
      upiId = `${phoneNo}${suffix}`;
      if (await Linking.canOpenURL(`upi://pay?pa=${upiId}`)) break;
    }

    const encodedRemark = encodeURIComponent(remark);
    const upiUrl = `upi://pay?pa=${upiId}&tn=${encodedRemark}&am=${amount}&cu=INR`;

    try {
      const supported = await Linking.canOpenURL(upiUrl);
      if (supported) {
        await Linking.openURL(upiUrl);
      } else {
        Alert.alert(
          "Error",
          "No UPI apps found. Please install one and try again."
        );
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred: " + error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          <Text>Click</Text>
          <Text>
            <View style={styles.karoContainer}>
              <Text style={styles.karoText}> Karo</Text>
              <Image
                source={require("../../assets/images/underline.png")}
                style={styles.underlineImage}
                resizeMode="contain"
              />
            </View>
          </Text>
        </Text>
      </View>
      <View>
        <Image
          source={require("../../assets/images/upi-icon.png")}
          style={styles.icon}
        />
      </View>
      <View style={styles.container}>
        <AddPaymentDetail onHandleButton={handleUPIPayment} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: Colors.primary,
  },
  headerText: {
    flex: 1,
    flexDirection: "row",
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: "#fff",
    textAlign: "center",
  },
  karoContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  karoText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "outfit-bold",
    marginLeft: 4,
    top: 22,
  },
  underlineImage: {
    width: "110%",
    top: 14,
    height: 12,
  },
  container: {
    marginVertical: 150,
    marginHorizontal: 10,
  },
  icon: {
    position: "absolute",
    top: 100,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    backgroundColor: "orange",
    zIndex: 99,
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "contain",
  },
});

export default UPIPayment;
