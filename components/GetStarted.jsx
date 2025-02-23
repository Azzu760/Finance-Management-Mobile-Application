import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";

import Colors from "../constants/Colors";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "../hooks/useWarmUpBrowser";
import Button from "../components/Button";
import { useOAuth } from "@clerk/clerk-expo";

const { width, height } = Dimensions.get("window");

WebBrowser.maybeCompleteAuthSession();

const GetStarted = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        console.log("Handle MFA or additional steps");
      }
    } catch (err) {
      console.error("OAuth Flow Error:", JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/images/login-image.jpg")}
        style={styles.fullScreenImage}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          Welcome to{" "}
          <Text style={styles.appName}>
            Click K<Text style={styles.appNameAccent}>aro-</Text>
          </Text>
        </Text>
        <Text style={styles.subtitle}>
          Manage your finances with ease and precision.
        </Text>

        {/* Get Started Button */}
        <Button
          title="Let's Get Started"
          onPress={onPress}
          style={styles.getStartedButton}
          textStyle={styles.getStartedButtonText}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.light,
  },
  fullScreenImage: {
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: Colors.light,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -250,
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: Colors.active,
    marginBottom: 10,
    textAlign: "center",
  },
  appName: {
    color: Colors.primary,
    fontSize: 30,
    fontFamily: "outfit-bold",
  },
  appNameAccent: {
    color: Colors.info,
    fontSize: 32,
    fontFamily: "outfit-bold",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: Colors.inactive,
    marginBottom: 20,
    textAlign: "center",
  },

  getStartedButton: {
    width: "100%",
    marginTop: 20,
  },
  getStartedButtonText: {
    fontSize: 18,
  },
});

export default GetStarted;
