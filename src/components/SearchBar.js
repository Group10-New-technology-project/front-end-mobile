import React from "react";
import { View, TextInput, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// --------------
export default function SearchBar() {
  const navigation = useNavigation();
  const handleCaiDat = () => {
    console.log("Cài đặt");
    navigation.navigate("CaiDat");
  };
  const handleQR = () => {
    navigation.navigate("QRCodeScreen");
    console.log("QR");
  };
  return (
    <View style={styles.container}>
      <View style={styles.search_icon}>
        <View style={{ marginRight: 10 }}>
          <Feather name="search" size={22} color="white" />
        </View>
        <TextInput style={styles.input_search} placeholder="Tìm kiếm" placeholderTextColor="white" />
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", paddingRight: 30 }}>
        <TouchableOpacity onPress={handleCaiDat}>
          <Ionicons style={{ marginRight: 15 }} name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleQR}>
          <MaterialCommunityIcons name="qrcode-scan" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: Dimensions.get("window").width,
  },
  search_icon: {
    flexDirection: "row",
    alignItems: "center",
  },
  input_search: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
    width: "70%",
  },
});
