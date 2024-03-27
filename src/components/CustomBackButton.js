import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles_chanh } from "../styles/styles_chanh";

export default function CustomBackButton({ routeName }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../../assets/image/chevron-left.png")}
          style={{ width: 30, height: 30 }}
        />
        <Text style={styles_chanh.text_header}>{routeName}</Text>
      </View>
    </TouchableOpacity>
  );
}
