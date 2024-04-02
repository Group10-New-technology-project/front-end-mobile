import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//-------------------------------------
import { TabsComponent } from "../components/BottomTabs";
import SearchBar from "../components/SearchBar";
import CustomBackButton from "../components/CustomBackButton";
//-------------------------------------
import TaiKhoanVaBaoMat from "../screens/canhan-screens/TaiKhoanVaBaoMat";
import QuyenRiengTu from "../screens/canhan-screens/QuyenRiengTu";
import ReelScreen from "../screens/khampha-screens/ReelScreen";
import DemoScreen from "../screens/other-screens/DemoScreen";
import Home from "../screens/trangchu-screens/Home";
import DangNhap from "../screens/dangnhap-screens/DangNhap";
import DangKy from "../screens/dangky-screens/DangKy";
import See from "../screens/nhatky-screens/See";
import ThongTinCaNhan from "../screens/dangky-screens/ThongTinCaNhan";
import NhapSoDienThoai from "../screens/dangky-screens/NhapSoDienThoai";
import MaXacThuc from "../screens/dangky-screens/MaXacThuc";
//Utils
import Button from "../utils/Button";
//ChatScreen
import ChatScreen from "../screens/tinnhan-screens/ChatScreen";
//-------------------------------------
const Stack = createNativeStackNavigator();

export function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#0091FF" },
        headerTitle: "",
        headerShown: true,
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DangNhap"
        component={DangNhap}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DangKy"
        component={DangKy}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MaXacThuc"
        component={MaXacThuc}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ThongTinCaNhan"
        component={ThongTinCaNhan}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NhapSoDienThoai"
        component={NhapSoDienThoai}
        options={{ headerShown: false }}
      />
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
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerLeft: () => <CustomBackButton routeName="Chat" />,
        }}
      />
      <Stack.Screen
        name="See"
        component={See}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="ReelScreen" component={ReelScreen} />
      <Stack.Screen name="DemoScreen" component={DemoScreen} />
      <Stack.Screen name="Button" component={Button} />
    </Stack.Navigator>
  );
}
