import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DemoScreen() {
  return (
    <View style={styles.container}>
      <Text>Demo</Text>
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