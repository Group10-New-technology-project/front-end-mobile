import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TinNhanScreen() {
  return (
    <View style={styles.container}>
      <Text>Tin Nhắn</Text>
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
