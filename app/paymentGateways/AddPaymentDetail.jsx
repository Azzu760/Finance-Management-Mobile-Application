import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useUser } from "@clerk/clerk-react";
import Colors from "../../constants/Colors";

const AddPaymentDetail = ({ onHandleButton }) => {
  const { user } = useUser();
  const [phoneNo, setPhoneNo] = useState("");
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");

  const payeeName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "Merchant";

  const handlePress = () => {
    onHandleButton(phoneNo, amount, remark, payeeName);

    setPhoneNo("");
    setAmount("");
    setRemark("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.inputContainer}>
          <Icon
            name="call-outline"
            size={20}
            color={Colors.primary}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phoneNo}
            onChangeText={setPhoneNo}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon
            name="cash-outline"
            size={20}
            color={Colors.primary}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon
            name="chatbubble-outline"
            size={20}
            color={Colors.primary}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Remarks (Optional)"
            value={remark}
            onChangeText={setRemark}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  card: {
    paddingTop: 80,
    minWidth: "100%",
    backgroundColor: "#fff",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "outfit-regular",
    paddingVertical: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "outfit-medium",
  },
});

export default AddPaymentDetail;
