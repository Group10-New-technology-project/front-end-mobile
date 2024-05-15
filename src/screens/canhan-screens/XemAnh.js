import React from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";

export default function XemAnh({ route, navigation }) {
  const { image } = route.params;
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Text style={{ fontSize: 17, fontWeight: "500", color: "#FFF" }}>Đóng</Text>
      </TouchableOpacity>
      <View style={styles.image_container}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    left: 10,
    top: 70,
  },
  image_container: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.25,
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.5,
  },
});
