import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { S3 } from "aws-sdk";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, S3_BUCKET_NAME, API_URL } from "@env";

const s3 = new S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION,
});

export default function ChinhSuaThongTinCaNhan({ navigation, route }) {
  const { user_id } = route.params;
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleThongTin = () => {
    navigation.navigate("TaiKhoanVaBaoMat");
  };

  const handleCapNhatAvatar = () => {
    pickImage1();
  };

  const handleCapNhatCoverImage = () => {
    pickImage2();
  };

  const handleCaiDatChung = () => {
    navigation.navigate("CaiDatNhanh");
  };

  const pickImage1 = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await uploadImageToS31(result.assets[0].uri);
    }
  };
  const pickImage2 = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await uploadImageToS32(result.assets[0].uri);
    }
  };

  const uploadImageToS31 = async (image) => {
    setIsLoading(true);
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var seconds = now.getSeconds();
      const currentDate = new Date().toISOString().slice(0, 10);
      const fileName = `IMG_${currentDate}_${hours}-${minutes}-${seconds}.png`;
      const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: blob,
        ACL: "public-read",
      };
      const uploadResponse = await s3.upload(params).promise();
      const imageURL = uploadResponse.Location.toString();
      try {
        const response = await axios.post(`${API_URL}/api/v1/users/updateAvatar`, {
          id: user_id,
          avatar: imageURL,
        });
        setIsLoading(false);
        Alert.alert("Cập nhật ảnh đại diện thành công");
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };
  const uploadImageToS32 = async (image) => {
    setIsLoading(true);
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var seconds = now.getSeconds();
      const currentDate = new Date().toISOString().slice(0, 10);
      const fileName = `IMG_${currentDate}_${hours}-${minutes}-${seconds}.png`;
      const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: blob,
        ACL: "public-read",
      };
      const uploadResponse = await s3.upload(params).promise();
      const imageURL = uploadResponse.Location.toString();
      try {
        const response = await axios.post(`${API_URL}/api/v1/users/updateCoverAvatar`, {
          id: user_id,
          coveravatar: imageURL,
        });
        setIsLoading(false);
        Alert.alert("Cập nhật ảnh bìa thành công");
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF" }}>
        <ActivityIndicator size="large" color="#0091FF" />
        <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "400", color: "#0091FF" }}>Đang cập nhật ảnh...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.edit_container}>
        <TouchableOpacity onPress={handleThongTin}>
          <Text style={styles.edit_text}>Thông tin</Text>
        </TouchableOpacity>
        <View style={{ borderWidth: 0.5, borderColor: "#D2D2D2" }} />
        <TouchableOpacity onPress={handleCapNhatAvatar}>
          <Text style={styles.edit_text}>Đổi ảnh đại diện</Text>
        </TouchableOpacity>
        <View style={{ borderWidth: 0.5, borderColor: "#D2D2D2" }} />
        <TouchableOpacity onPress={handleCapNhatCoverImage}>
          <Text style={styles.edit_text}>Đổi ảnh bìa</Text>
        </TouchableOpacity>
        <View style={{ borderWidth: 0.5, borderColor: "#D2D2D2" }} />

        <TouchableOpacity onPress={handleThongTin}>
          <Text style={styles.edit_text}>Cập nhật giới thiệu bản thân</Text>
        </TouchableOpacity>
        <View style={{ borderWidth: 0.5, borderColor: "#D2D2D2" }} />
        <TouchableOpacity onPress={handleThongTin}>
          <Text style={styles.edit_text}>Ví của tôi</Text>
        </TouchableOpacity>
        <View style={{ borderWidth: 0.5, borderColor: "#D2D2D2" }} />
        <TouchableOpacity onPress={handleCaiDatChung}>
          <Text style={styles.edit_text}>Cài đặt chung</Text>
        </TouchableOpacity>
        <View style={{ borderWidth: 0.5, borderColor: "#D2D2D2" }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  edit_container: {
    paddingLeft: 18,
  },
  edit_text: {
    fontSize: 18,
    fontWeight: "400",
    paddingVertical: 10,
  },
});
