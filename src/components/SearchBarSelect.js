import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, StyleSheet, Dimensions, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function SearchBarSelect() {
  const navigation = useNavigation();
  const inputRef = useRef(null);
  const [phone, setphone] = useState("");

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleCaiDat = () => {
    navigation.navigate("CaiDat");
  };

  const handleInputChange = (text) => {
    setphone(text);
  };

  const handleSubmitEditing = () => {
    console.log("Giá trị nhập vào:", phone);
    navigation.navigate("TimKiem", { searchPhone: phone });
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input_search}
        placeholder="Tìm kiếm"
        placeholderTextColor="gray"
        onChangeText={handleInputChange}
        onSubmitEditing={handleSubmitEditing}
      />
      <TouchableOpacity onPress={handleCaiDat}>
        <Ionicons name="settings-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: Dimensions.get("window").width * 0.8,
  },
  search_icon: {
    flexDirection: "row",
    alignItems: "center",
  },
  input_search: {
    fontSize: 18,
    fontWeight: "400",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: Dimensions.get("window").width * 0.7,
    backgroundColor: "white",
  },
});
