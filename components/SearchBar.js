import React from "react";
import { View, Image, TextInput } from "react-native";

export default function SearchBar() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image style={{ width: 24, height: 24 }} source={require("../assets/image/search-icon.png")} />
      <TextInput style={{ fontSize: 16, paddingVertical: 12, marginLeft: 10 }} placeholder="Tìm kiếm" placeholderTextColor="white" />
    </View>
  );
}
