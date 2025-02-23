import React, { useState } from "react";
import { Tabs } from "expo-router";
import { View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "../../constants/Colors";

const ICON_SIZE = 20;
const ICON_WRAPPER_SIZE = 50;
const ACTIVE_PADDING = 15;

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.active,
        tabBarInactiveTintColor: Colors.inactive,
        tabBarStyle: {
          width: "90%",
          marginVertical: 10,
          height: 70,
          alignSelf: "center",
          borderRadius: 50,
          elevation: 5,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarItemStyle: {
          paddingTop: 15,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarShowLabel: false,
        tabBarScrollEnabled: true,
      }}
    >
      {/* Home Screen */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? Colors.primary : "transparent",
                width: ICON_WRAPPER_SIZE,
                height: ICON_WRAPPER_SIZE,
                borderRadius: ICON_WRAPPER_SIZE / 2,
                justifyContent: "center",
                alignItems: "center",
                padding: focused ? ACTIVE_PADDING : 5,
              }}
            >
              <Ionicons
                name="home"
                size={ICON_SIZE}
                color={focused ? "#fff" : Colors.inactive}
              />
            </View>
          ),
        }}
      />

      {/* Transactions Screen */}
      <Tabs.Screen
        name="transactions"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? Colors.primary : "transparent",
                width: ICON_WRAPPER_SIZE,
                height: ICON_WRAPPER_SIZE,
                borderRadius: ICON_WRAPPER_SIZE / 2,
                justifyContent: "center",
                alignItems: "center",
                padding: focused ? ACTIVE_PADDING : 5,
              }}
            >
              <Entypo
                name="swap"
                size={ICON_SIZE}
                color={focused ? "#fff" : Colors.inactive}
              />
            </View>
          ),
        }}
      />

      {/* Analytics Screen */}
      <Tabs.Screen
        name="analytics"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? Colors.primary : "transparent",
                width: ICON_WRAPPER_SIZE,
                height: ICON_WRAPPER_SIZE,
                borderRadius: ICON_WRAPPER_SIZE / 2,
                justifyContent: "center",
                alignItems: "center",
                padding: focused ? ACTIVE_PADDING : 5,
              }}
            >
              <Ionicons
                name="analytics-sharp"
                size={ICON_SIZE}
                color={focused ? "#fff" : Colors.inactive}
              />
            </View>
          ),
        }}
      />

      {/* Payments Screen */}
      <Tabs.Screen
        name="payments"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? Colors.primary : "transparent",
                width: ICON_WRAPPER_SIZE,
                height: ICON_WRAPPER_SIZE,
                borderRadius: ICON_WRAPPER_SIZE / 2,
                justifyContent: "center",
                alignItems: "center",
                padding: focused ? ACTIVE_PADDING : 5,
              }}
            >
              <MaterialIcons
                name="payment"
                size={ICON_SIZE}
                color={focused ? "#fff" : Colors.inactive}
              />
            </View>
          ),
        }}
      />

      {/* Settings Screen */}
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? Colors.primary : "transparent",
                width: ICON_WRAPPER_SIZE,
                height: ICON_WRAPPER_SIZE,
                borderRadius: ICON_WRAPPER_SIZE / 2,
                justifyContent: "center",
                alignItems: "center",
                padding: focused ? ACTIVE_PADDING : 5,
              }}
            >
              <Ionicons
                name="settings"
                size={ICON_SIZE}
                color={focused ? "#fff" : Colors.inactive}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
