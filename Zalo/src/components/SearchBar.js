import React from "react";
import { View, TextInput, SafeAreaView, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function SearchBar() {
  return (
    <SafeAreaView>
      <View style={{ marginLeft: 5, flexDirection: "row", alignItems: "center" }}>
        <Feather name="search" size={22} color="white" />
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
    marginLeft: 10,
    fontWeight: "500",
    color: "white",
  },
});
