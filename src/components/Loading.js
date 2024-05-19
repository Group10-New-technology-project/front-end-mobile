import React from "react";
import { View, Text, Image } from "react-native";

export default function loading() {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: "#FFF", flex: 1 }}>
      <Image source={require("../../assets/icon-loading.gif")} style={{ width: 70, height: 70 }} />
      <Text style={{ fontSize: 14, fontWeight: "400" }}>Đang tải dữ liệu cuộc trò chuyện</Text>
    </View>
  );
}
