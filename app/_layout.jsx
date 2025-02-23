import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ClerkProvider, SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { useColorScheme, View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import GetStarted from "../components/GetStarted";
import * as SecureStore from "expo-secure-store";
import { doc, collection, getDoc, setDoc } from "firebase/firestore";
import { db } from "../configs/FirebaseConfig";
import Colors from "../constants/Colors";

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      console.error("Error retrieving token:", err);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("Error saving token:", err);
    }
  },
};

const saveUserToFirestore = async (user) => {
  if (user) {
    try {
      const userRef = doc(collection(db, "users"), user.id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return;
      }

      const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.primaryEmailAddress.emailAddress,
        createdAt: user.createdAt,
      };

      await setDoc(userRef, userData);
    } catch (error) {
      console.error("Error saving user info to Firestore:", error);
    }
  }
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors.primary;
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.error("Missing Clerk publishable key in environment variables.");
    return null;
  }

  const [fontsLoaded] = useFonts({
    "outfit-regular": require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("./../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor,
        }}
      >
        <ActivityIndicator
          size="large"
          color={colorScheme === "dark" ? "#FFF" : "#000"}
        />
      </View>
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor={backgroundColor}
      />
      <SignedIn>
        <SignedInWrapper />
      </SignedIn>
      <SignedOut>
        <GetStarted />
      </SignedOut>
    </ClerkProvider>
  );
}

const SignedInWrapper = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      saveUserToFirestore(user);
    }
  }, [user]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};
