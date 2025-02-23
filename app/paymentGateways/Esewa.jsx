import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import AddPaymentDetail from "./AddPaymentDetail";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";

const Esewa = () => {
  const onHandleButton = (phoneNo, amount, remark) => {
    console.log("Phone Number:", phoneNo);
    console.log("Amount:", amount);
    console.log("Remark:", remark);
    alert(`Payment initiated for ${amount} to ${phoneNo}`);
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
          source={require("../../assets/images/Esewa.png")}
          style={styles.icon}
        />
      </View>
      <View style={styles.container}>
        <AddPaymentDetail onHandleButton={onHandleButton} />
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
    zIndex: 99,
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "contain",
  },
});

export default Esewa;
