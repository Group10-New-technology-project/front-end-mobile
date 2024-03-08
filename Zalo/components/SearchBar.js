import React from "react";
import { View, Image, TextInput, SafeAreaView } from "react-native";

export default function SearchBar() {
  return (
    <SafeAreaView style={{ justifyContent: "space-around" }}>
      <View style={{ flexDirection: "row", flex: 2 }}>
        <Image
          style={{ width: 22, height: 22 }}
          source={require("../assets/image/search-icon.png")}
        />
        <TextInput
          style={{ fontSize: 18, marginLeft: 10, fontWeight: "500" }}
          placeholder="Tìm kiếm"
          placeholderTextColor="white"
        />
      </View>
    </SafeAreaView>
  );
}
