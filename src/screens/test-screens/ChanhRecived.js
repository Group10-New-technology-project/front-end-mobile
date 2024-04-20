import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ChanhRecived({ route }) {
  const { status, me } = route.params;
  console.log("Da nhan", status, me);

  return (
    <View style={styles.container}>
      <Text>New Screen</Text>
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
