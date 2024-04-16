import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ChanhSender({ navigation }) {
  const status = "Đang hoạt động";
  const me = [
    {
      name: "Tùng",
      age: 20,
      username: "Tùng đẹp zai",
    },
  ];

  const goChanh = () => {
    console.log("goChanh");
    navigation.navigate("ChanhRecived", { status, me });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goChanh}>
        <Text>Sender</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
