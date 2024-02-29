import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabsComponent } from "./components/BottomTabs";
import SearchBar from "./components/SearchBar";
import TaiKhoanScreen from "./screens/TaiKhoanScreen";
import { Image, TouchableOpacity } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={TabsComponent}
          options={{
            headerShown: true,
            headerTitle: () => <SearchBar />,
            headerStyle: { backgroundColor: "#0091FF" },
            headerTintColor: "#FFFFFF",
          }}
        />
        <Stack.Screen
          name="TaiKhoanScreen"
          component={TaiKhoanScreen}
          options={{
            headerShown: true,
            headerTintColor: "white",
            headerTitle: "Tài khoản và bảo mật",
            headerStyle: { backgroundColor: "#0091FF" },
            headerTitleStyle: { fontSize: 18 },
            headerLeft: () => <CustomBackButton />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function CustomBackButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image source={require("./assets/image/chevron-left.png")} style={{ width: 32, height: 32 }} />
    </TouchableOpacity>
  );
}
