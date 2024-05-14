import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// --------------
import KhamPhaScreen from "../screens/main-screens/KhamPhaSceen";
import DanhBaScreen from "../screens/main-screens/DanhBaScreen";
import CaNhanScreen from "../screens/main-screens/CaNhanScreen";
import TinNhanScreen from "../screens/main-screens/TinNhanScreen";
import NhatKyScreen from "../screens/main-screens/NhatKyScreen";
// --------------
import SearchBarTinNhan from "../components/SearchBarTinNhan";
import SearchBar from "../components/SearchBar";
// --------------
import { AntDesign, Feather } from "@expo/vector-icons";
// --------------
const Tab = createBottomTabNavigator();

export function TabsComponent() {
  return (
    <Tab.Navigator
      initialRouteName="TinNhan"
      screenOptions={{
        headerShown: true, // Hiển thị header
        headerTitle: "", // Tiêu đề của header
        headerStyle: { backgroundColor: "#0091FF" }, // Màu sắc của header
        tabBarActiveTintColor: "#0091FF", // Màu sắc của tab khi được chọn
        tabBarInactiveTintColor: "#B7B7B7", // Màu sắc của tab khi không được chọn
        tabBarShowLabel: true, // Hiển thị tabBarLabel
        tabBarStyle: {
          display: "flex",
          borderTopWidth: 1,
          borderTopColor: "rgba(0, 0, 0, 0.1)",
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
        },
        tabBarIconStyle: {
          marginBottom: -5,
        },
      }}>
      <Tab.Screen
        name="TinNhan"
        component={TinNhanScreen}
        options={{
          tabBarLabel: "Tin Nhắn",
          tabBarIcon: ({ color, size }) => <AntDesign name="message1" size={size} color={color} />,
          headerLeft: () => <SearchBarTinNhan />,
        }}
      />
      <Tab.Screen
        name="DanhBa"
        component={DanhBaScreen}
        options={{
          tabBarLabel: "Danh bạ",
          tabBarIcon: ({ color, size }) => <AntDesign name="contacts" size={size} color={color} />,
          headerLeft: () => <SearchBar />,
        }}
      />
      <Tab.Screen
        name="KhamPha"
        component={KhamPhaScreen}
        options={{
          tabBarLabel: "Khám phá",
          tabBarIcon: ({ color, size }) => <Feather name="grid" size={size} color={color} />,
          headerLeft: () => <SearchBar />,
        }}
      />
      <Tab.Screen
        name="NhatKy"
        component={NhatKyScreen}
        options={{
          tabBarLabel: "Nhật ký",
          tabBarIcon: ({ color, size }) => <Feather name="clock" size={size} color={color} />,
          headerLeft: () => <SearchBar />,
        }}
      />
      <Tab.Screen
        name="CaNhan"
        component={CaNhanScreen}
        options={{
          tabBarLabel: "Cá nhân",
          tabBarIcon: ({ color, size }) => <AntDesign name="user" size={size} color={color} />,
          headerLeft: () => <SearchBar />,
        }}
      />
    </Tab.Navigator>
  );
}
