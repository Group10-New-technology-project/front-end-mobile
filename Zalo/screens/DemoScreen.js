import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Video } from "expo-av";
const { width, height } = Dimensions.get("window");

const DemoScreen = () => {
  return (
    <View style={styles.container}>
      <Video
        source={require("../assets/demo.mp4")}
        style={styles.video}
        resizeMode="cover"
        repeat={true}
        shouldPlay={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: width,
    height: height,
  },
});

export default DemoScreen;
