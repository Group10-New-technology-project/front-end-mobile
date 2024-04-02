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
import TaoMatKhau from "../screens/sign-up-screens/TaoMatKhau";
import ChonAnhDaiDien from "../screens/sign-up-screens/ChonAnhDaiDien";
import ChonTen from "../screens/sign-up-screens/ChonTen";
//Utils
import Button from "../utils/Button";
//-------------------------------------
const Stack = createNativeStackNavigator();

export function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="TaoMatKhau"
      screenOptions={{
        headerStyle: { backgroundColor: "#0091FF" },
        headerTitle: "",
        headerShown: false,
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
          headerShown: true,
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
      <Stack.Screen name="TaoMatKhau" component={TaoMatKhau} />
      <Stack.Screen name="ChonTen" component={ChonTen} />
      <Stack.Screen name="ChonAnhDaiDien" component={ChonAnhDaiDien} />
    </Stack.Navigator>
  );
}
