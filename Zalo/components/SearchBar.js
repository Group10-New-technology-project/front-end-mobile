import React from "react";
import { View, Image, TextInput } from "react-native";

export default function SearchBar() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image style={{ width: 24, height: 24 }} source={require("../assets/image/search-icon.png")} />
      <TextInput style={{ fontSize: 17, marginLeft: 15, fontWeight: "400" }} placeholder="Tìm kiếm" placeholderTextColor="white" />
    </View>
  );
}
