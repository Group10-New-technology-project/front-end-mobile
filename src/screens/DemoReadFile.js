import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";

export default function DemoReadFile({ route }) {
  const { url } = route.params;
  console.log(url);
  const [sound, setSound] = useState(null);
  const soundUri = url;

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync({ uri: soundUri });
    setSound(sound);
    console.log("Playing Sound");
    await sound.playAsync();
  }

  async function stopSound() {
    if (sound) {
      console.log("Stopping Sound");
      await sound.stopAsync();
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Play Sound" onPress={playSound} />
      <Button title="Stop Sound" onPress={stopSound} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
