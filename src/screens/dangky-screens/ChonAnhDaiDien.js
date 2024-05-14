import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { S3 } from "aws-sdk";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, S3_BUCKET_NAME, API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const s3 = new S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION,
});

export default function ChonAnhDaiDien({ navigation, route }) {
  const { password, SoDienThoai, name, birthday, Gender } = route.params;
  console.log("Da nhan", password, SoDienThoai, name, birthday, Gender);
  const [idUser, setIdUser] = useState(null);
  const [image, setImage] = useState("https://i.pinimg.com/564x/68/3d/8f/683d8f58c98a715130b1251a9d59d1b9.jpg");
  const [imageURL, setimageAvatar] = useState("https://i.pinimg.com/564x/68/3d/8f/683d8f58c98a715130b1251a9d59d1b9.jpg");
  const [isLoading, setIsLoading] = useState(false);

  const handleDangKy = async () => {
    console.log("Fest", password, SoDienThoai, name, birthday, Gender, imageURL);
    try {
      const response = await fetch(`${API_URL}/api/v1/users/sinup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: SoDienThoai,
          password: password,
          name: name,
          birthday: birthday,
          gender: Gender,
          imageAvatar: imageURL,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }
      await fetchUserByUserName();
      handleLogin();
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const userData = {
        username: SoDienThoai,
        password: password,
      };
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      const response = await fetch(`${API_URL}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        Alert.alert("Sai tên người dùng hoặc mật khẩu");
      }
      const data = await response.json();
      if (data.user) {
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));
        navigation.navigate("Tabs");
      } else {
        Alert.alert("Lỗi Server");
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const fetchUserByUserName = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/username/${SoDienThoai}`);
      if (!response.ok) {
        console.log("Không tìm thấy người dùng");
        return;
      }
      const data = await response.json();
      setIdUser(data._id);
      console.log("ID người dùng:", data._id);
      createMember(data._id);
      console.log("Tạo thành công thành viên");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const createMember = async (userId) => {
    console.log("Đa nhận", userId);
    try {
      const response = await fetch(`${API_URL}/api/v1/member/addMember/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to create member");
      }
      console.log("Tạo thành công thành viên");
    } catch (error) {
      console.error("Error creating member:", error);
    }
  };

  const uploadImageToS3 = async (imageUri) => {
    setIsLoading(true);
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var seconds = now.getSeconds();
      const currentDate = new Date().toISOString().slice(0, 10); // Lấy ngày tháng theo định dạng YYYY-MM-DD
      const fileName = `IMG_${currentDate}_${hours}-${minutes}-${seconds}.png`;
      const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: blob,
        ACL: "public-read",
      };
      const uploadResponse = await s3.upload(params).promise();
      const imageURL = uploadResponse.Location.toString();
      setimageAvatar(imageURL);
      console.log("Upload thành công:", imageURL);
      setIsLoading(false);
      return imageURL;
    } catch (error) {
      console.error("Error uploading image", error);
      throw error;
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await uploadImageToS3(result.assets[0].uri);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF" }}>
        <ActivityIndicator size="large" color="#0091FF" />
        <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "400", color: "#0091FF" }}>Đang tải..</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.text_2}>Chọn Ảnh Đại Diện</Text>
        <Text style={styles.text_3}>Đặt ảnh đại diện để mọi người nhận ra bạn</Text>
      </View>
      <View style={styles.container_image}>{image && <Image source={{ uri: image }} style={styles.image} />}</View>
      <View style={styles.container_button}>
        <TouchableOpacity style={styles.btn_chonanh} onPress={pickImage}>
          <Text style={styles.text_4}>Chọn ảnh</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn_chonanh]} onPress={handleDangKy}>
          <Text style={styles.text_4}>Tiếp tục</Text>
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
