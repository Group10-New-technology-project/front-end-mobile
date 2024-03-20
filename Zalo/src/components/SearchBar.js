import React from "react";
import { View, TextInput, SafeAreaView, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function SearchBar() {
  return (
    <SafeAreaView>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ marginRight: 10 }}>
          <Feather name="search" size={22} color="white" />
        </View>
        <TextInput
          style={styles.input_search}
          placeholder="Tìm kiếm"
          placeholderTextColor="white"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input_search: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
});
