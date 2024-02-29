import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { TabsComponent } from "./components/BottomTabs";
import SearchBar from "./components/SearchBar";
import { Image, TouchableOpacity } from "react-native";

import TaiKhoanScreen from "./screens/TaiKhoanScreen";
import DemoScreen from "./screens/DemoScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerTitle: () => <SearchBar />,
          headerStyle: { backgroundColor: "#0091FF" },
          headerTintColor: "#FFFFFF",
        }}
        initialRouteName="DemoScreen">
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
        <Stack.Screen name="DemoScreen" component={DemoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function CustomBackButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image
        source={require("./assets/image/chevron-left.png")}
        style={{ width: 32, height: 32 }}
      />
    </TouchableOpacity>
  );
}
