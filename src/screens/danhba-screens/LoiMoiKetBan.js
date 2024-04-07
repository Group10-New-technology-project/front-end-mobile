import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function LoiMoiKetBan() {
  return (
    <View style={styles.container}>
      <Text>Lời mời kết bạn</Text>
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
