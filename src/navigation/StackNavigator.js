import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//-------------------------------------
import { TabsComponent } from "../components/BottomTabs";
import SearchBar from "../components/SearchBar";
import CustomBackButton from "../components/CustomBackButton";
//-------------------------------------
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SinupScreen from "../screens/SinupScreen";
import SeeScreen from "../screens/SeeScreen";

import TaiKhoanScreen from "../screens/TaiKhoanScreen";
import QuyenRiengTuScreen from "../screens/QuyenRiengTuScreen";
import ReelScreen from "../screens/ReelScreen";
import DemoScreen from "../screens/DemoScreen";
//Utils
import Button from "../utils/Button";
//-------------------------------------
const Stack = createNativeStackNavigator();

export function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen"
      screenOptions={{
        headerStyle: { backgroundColor: "#0091FF" },
        initialRouteName: "Button",
      }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SinupScreen"
        component={SinupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SeeScreen"
        component={SeeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tabs"
        component={TabsComponent}
        options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => <SearchBar />,
        }}
      />
      <Stack.Screen
        name="TaiKhoanScreen"
        component={TaiKhoanScreen}
        options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => <CustomBackButton />,
        }}
      />
      <Stack.Screen
        name="QuyenRiengTuScreen"
        component={QuyenRiengTuScreen}
        options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => <CustomBackButton />,
        }}
      />
      <Stack.Screen name="ReelScreen" component={ReelScreen} />
      <Stack.Screen name="DemoScreen" component={DemoScreen} />
      <Stack.Screen name="Button" component={Button} />
    </Stack.Navigator>
  );
}
