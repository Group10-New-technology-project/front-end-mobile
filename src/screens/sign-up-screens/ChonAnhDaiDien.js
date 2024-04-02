import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ChonAnhDaiDien() {
  const [imageUri, setImageUri] = useState(
    "https://image.lexica.art/full_webp/7e2d7ae0-c3ae-49fd-9dec-ce2663635054"
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.text_2}>Chọn Ảnh Đại Diện</Text>
        <Text style={styles.text_3}>Đặt ảnh đại diện để mọi người nhận ra bạn</Text>
      </View>
      <View style={styles.container_image}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>
      <View style={styles.container_button}>
        <TouchableOpacity style={styles.btn_chonanh} onPress={pickImage}>
          <Text style={styles.text_4}>Chọn ảnh</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn_chonanh}>
          <Text style={styles.text_4}>Bỏ qua</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container_image: { alignItems: "center", paddingTop: 20 },
  container_button: { paddingTop: Dimensions.get("window").height * 0.5 },
  title: {
    paddingTop: Dimensions.get("window").height * 0.1,
    alignItems: "center",
  },
  text_2: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text_3: {
    fontSize: 16,
    fontWeight: "500",
  },
  text_4: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 120,
  },
  btn_chonanh: {
    backgroundColor: "#0091FF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    marginHorizontal: 20,
    marginBottom: 10,
  },
});
