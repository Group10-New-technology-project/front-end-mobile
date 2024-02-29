import React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import KhamPhaScreen from "../screens/KhamPhaSceen";
import DanhBaScreen from "../screens/DanhBaScreen";
import CaNhanScreen from "../screens/CaNhanScreen";

const Tab = createBottomTabNavigator();

export function TabsComponent() {
  return (
    <Tab.Navigator
      initialRouteName="TinNhan"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: true,
        tabBarStyle: {
          display: "flex",
        },
      }}>
      <Tab.Screen
        name="TinNhan"
        component={KhamPhaScreen}
        options={{
          tabBarLabel: "Tin Nhắn",
          tabBarIcon: ({ color, size }) => <Image source={require("../assets/image/home-icon.png")} style={{ tintColor: color, width: 23, height: 23 }} />,
        }}
      />
      <Tab.Screen
        name="DanhBa"
        component={DanhBaScreen}
        options={{
          tabBarLabel: "Danh bạ",
          tabBarIcon: ({ color, size }) => <Image source={require("../assets/image/contact-icon.png")} style={{ tintColor: color, width: 23, height: 23 }} />,
        }}
      />
      <Tab.Screen
        name="KhamPha"
        component={KhamPhaScreen}
        options={{
          tabBarLabel: "Khám phá",
          tabBarIcon: ({ color, size }) => <Image source={require("../assets/image/khampha-icon.png")} style={{ tintColor: color, width: size, height: size }} />,
        }}
      />
      <Tab.Screen
        name="NhatKy"
        component={KhamPhaScreen}
        options={{
          tabBarLabel: "Nhật ký",
          tabBarIcon: ({ color, size }) => <Image source={require("../assets/image/nhatky-icon.png")} style={{ tintColor: color, width: size, height: size }} />,
        }}
      />
      <Tab.Screen
        name="CaNhan"
        component={CaNhanScreen}
        options={{
          tabBarLabel: "Cá nhân",
          tabBarIcon: ({ color, size }) => <Image source={require("../assets/image/user-icon.png")} style={{ tintColor: color, width: 21, height: size }} />,
        }}
      />
    </Tab.Navigator>
  );
}
