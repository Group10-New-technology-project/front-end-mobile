import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//Components
import { TabsComponent } from "../components/BottomTabs";
import SearchBar from "../components/SearchBar";
import CustomBackButton from "../components/CustomBackButton";
//Screens
import TaiKhoanVaBaoMat from "../screens/canhan-screens/TaiKhoanVaBaoMat";
import QuyenRiengTu from "../screens/canhan-screens/QuyenRiengTu";
import ReelScreen from "../screens/khampha-screens/ReelScreen";
import DemoScreen from "../screens/other-screens/DemoScreen";
import CaiDat from "../screens/canhan-screens/CaiDat";
import QRCodeScreen from "../screens/canhan-screens/QRCodeScreen";
//Utils
import Button from "../utils/Button";
//-------------------------------------
const Stack = createNativeStackNavigator();

export function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#0091FF" },
        headerTitle: "",
        headerShown: true,
        initialRouteName: "DemoScreen",
      }}>
      <Stack.Screen
        name="Tabs"
        component={TabsComponent}
        options={{
          headerLeft: () => <SearchBar />,
        }}
      />
      <Stack.Screen
        name="TaiKhoanVaBaoMat"
        component={TaiKhoanVaBaoMat}
        options={{
          headerLeft: () => <CustomBackButton routeName="Tài khoản và bảo mật" />,
        }}
      />
      <Stack.Screen
        name="QuyenRiengTu"
        component={QuyenRiengTu}
        options={{
          headerLeft: () => <CustomBackButton routeName="Quyền riêng tư" />,
        }}
      />
      <Stack.Screen
        name="CaiDat"
        component={CaiDat}
        options={{
          headerLeft: () => <CustomBackButton routeName="Cài đặt" />,
        }}
      />
      <Stack.Screen name="QRCodeScreen" component={QRCodeScreen} />
      <Stack.Screen name="ReelScreen" component={ReelScreen} />
      <Stack.Screen name="DemoScreen" component={DemoScreen} />
      <Stack.Screen name="Button" component={Button} />
    </Stack.Navigator>
  );
}
