import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TimKiemScreen({ route }) {
  const { searchText } = route.params;
  return (
    <View style={styles.container}>
      <Text>{searchText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
