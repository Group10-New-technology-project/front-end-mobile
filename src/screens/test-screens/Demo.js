import React, { useState } from "react";
import { S3 } from "aws-sdk";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, S3_BUCKET_NAME } from "@env";
import * as FileSystem from "expo-file-system";
import { StyleSheet, View, Button } from "react-native";
import { Audio } from "expo-av";

const s3 = new S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION,
});

export default function App({ navigation }) {
  const [recording, setRecording] = React.useState();
  const [url, setUrl] = useState("");
  async function startRecording() {
    console.log("Đang ghi âm");
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        setRecording(recording);
      }
    } catch (err) {
      console.log("Error starting recording:", err);
    }
  }

  async function stopRecording() {
    console.log("Dừng ghi âm");
    setRecording(undefined);

    await recording.stopAndUnloadAsync();
    const info = await FileSystem.getInfoAsync(recording.getURI());
    const uri = info.uri;
    const response = await fetch(uri);
    const blob = await response.blob();
    const key = `RECORD_${Date.now()}.mp3`;
    try {
      const uploadResponse = await s3
        .upload({
          Bucket: S3_BUCKET_NAME,
          Key: key,
          Body: blob,
          ContentType: "audio/mpeg",
        })
        .promise();
      console.log("Upload to S3 successful!");
      // Log URL
      const uploadedUrl = `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
      setUrl(uploadedUrl);
      console.log("URL:", uploadedUrl);
    } catch (error) {
      console.log("Upload to S3 failed:", error);
    }
  }
  const goXemGhiAm = () => {
    navigation.navigate("DemoReadFile", { url });
  };

  return (
    <View style={styles.container}>
      <Button title={recording ? "Dừng" : "Bắt đầu ghi âm"} onPress={recording ? stopRecording : startRecording} />
      <Button title="Xem ghi am" onPress={goXemGhiAm}></Button>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 40,
  },
  fill: {
    flex: 1,
    margin: 15,
  },
});
