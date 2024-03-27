import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles_chanh } from "../styles/styles_chanh";
import { Ionicons } from "@expo/vector-icons";

export default function CustomBackButton({ routeName }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="chevron-back" size={25} color="white" />
        <Text style={styles_chanh.text_header}>{routeName}</Text>
      </View>
    </TouchableOpacity>
  );
}
