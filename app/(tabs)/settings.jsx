import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import {
  MaterialIcons,
  FontAwesome5,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

const settingsNavigation = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Please log in to view settingsNavigation.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.email}>
            {user?.primaryEmailAddress?.emailAddress || "No email available"}
          </Text>
        </View>
      </View>

      {/* settingsNavigation Links */}
      <ScrollView contentContainerStyle={styles.linksContainer}>
        <Link href="/settingsNavigation/BudgetPlanner" style={styles.link}>
          <View style={styles.linkContent}>
            <FontAwesome5 name="wallet" size={24} color="#555" />
            <Text style={styles.linkText}>Budget Planner</Text>
          </View>
        </Link>

        <Link href="/settingsNavigation/TransactionHistory" style={styles.link}>
          <View style={styles.linkContent}>
            <MaterialIcons name="history" size={24} color="#555" />
            <Text style={styles.linkText}>Transaction History</Text>
          </View>
        </Link>

        <Link href="/settingsNavigation/EMICalculator" style={styles.link}>
          <View style={styles.linkContent}>
            <FontAwesome name="calculator" size={24} color="#555" />
            <Text style={styles.linkText}>EMI Calculator</Text>
          </View>
        </Link>

        <Link href="/settingsNavigation/Notifications" style={styles.link}>
          <View style={styles.linkContent}>
            <Ionicons name="notifications-outline" size={24} color="#555" />
            <Text style={styles.linkText}>Notifications</Text>
          </View>
        </Link>

        <Link href="/settingsNavigation/HelpCenter" style={styles.link}>
          <View style={styles.linkContent}>
            <Ionicons name="help-circle-outline" size={24} color="#555" />
            <Text style={styles.linkText}>Help Center</Text>
          </View>
        </Link>

        <TouchableOpacity style={styles.link} onPress={signOut}>
          <View style={styles.linkContent}>
            <Feather name="log-out" size={24} color="#d9534f" />
            <Text style={[styles.linkText, { color: "#d9534f" }]}>Logout</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />

          <Text style={styles.text}>
            Made with ❤️ by{" "}
            <Text style={styles.developer}>Ajay Kumar Kasaudhan</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: "#fff",
  },
  email: {
    fontSize: 10,
    fontFamily: "outfit-medium",
    color: "#fff",
  },
  linksContainer: {
    paddingVertical: 10,
  },
  link: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  linkContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    marginLeft: 15,
    color: "#333",
  },
  footer: {
    marginTop: 120,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 30,
    marginBottom: 1,
  },

  text: {
    textAlign: "center",
    fontFamily: "outfit-medium",
    fontSize: 8,
    color: "#333",
  },
  developer: {
    fontFamily: "outfit-bold",
    color: Colors.primary,
  },
});

export default settingsNavigation;
