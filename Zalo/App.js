import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { TabsComponent } from "./components/BottomTabs";
import SearchBar from "./components/SearchBar";
import { Image, TouchableOpacity, Text, View, StyleSheet } from "react-native";

import QuyenRiengTuScreen from "./screens/QuyenRiengTuScreen";
import TaiKhoanScreen from "./screens/TaiKhoanScreen";
import DemoScreen from "./screens/DemoScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          // headerShown: false,
          // headerLeft: () => <SearchBar />,
          headerStyle: { backgroundColor: "#0091FF" },
        }}
        // initialRouteName="DemoScreen"
      >
        <Stack.Screen
          name="Tabs"
          component={TabsComponent}
          options={{
            headerShown: true,
            headerTitle: "",
            headerLeft: () => <SearchBar />,
            // headerStyle: { backgroundColor: "#0091FF" },
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
        <Stack.Screen name="DemoScreen" component={DemoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function CustomBackButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("./assets/image/chevron-left.png")}
          style={{ width: 30, height: 30 }}
        />
        <Text style={styles.text_header}>Tài khoản và bảo mật</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text_header: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 18,
  },
});
