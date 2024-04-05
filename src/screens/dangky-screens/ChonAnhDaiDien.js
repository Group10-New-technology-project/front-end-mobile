import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { S3 } from "aws-sdk";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, S3_BUCKET_NAME, API_URL } from "@env";

const s3 = new S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION,
});

console.log(ACCESS_KEY_ID);
console.log(SECRET_ACCESS_KEY);
console.log(REGION);
console.log(S3_BUCKET_NAME);
console.log(API_URL);

export default function ChonAnhDaiDien({ navigation, route }) {
  const { password, SoDienThoai, name, birthday, Gender } = route.params;
  console.log("Da nhan", password, SoDienThoai, name, birthday, Gender);

  const [image, setImage] = useState("https://chanh9999.s3.ap-southeast-1.amazonaws.com/demo3.png");

  const [imimageUrl, setimageAvatar] = useState("");

  const handle_signup = async () => {
    console.log("Fest", password, SoDienThoai, name, birthday, Gender, imimageUrl);
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
          imageAvatar: imimageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }
      // Nếu tạo người dùng thành công, chuyển hướng tới màn hình nhập thông tin cá nhân
      navigation.navigate("Tabs");
    } catch (error) {
      console.error("Error signing up:", error);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi)
    }
  };

  const uploadImageToS3 = async (imageUri) => {
    try {
      // const response = await fetch(imageUri);
      // const blob = await response.blob();
      // const originalFileName = imageUri.split("/").pop(); // Lấy tên file từ đường dẫn
      // const timestamp = Date.now(); // Lấy timestamp hiện tại
      // const fileName = `image_${timestamp}_${originalFileName}`; // Thêm timestamp vào tên tệp gốc
      // const response = await fetch(imageUri);
      // const blob = await response.blob();
      // // Lấy ngày hiện tại và định dạng theo yêu cầu
      // const currentDate = new Date();
      // const formattedDate = currentDate.toISOString().slice(0, 10); // Lấy ngày tháng theo định dạng YYYY-MM-DD
      // // Tạo tên file mới với định dạng 'IMG_Ngày hiện tại'
      // const fileName = `IMG_${formattedDate}`;
      const response = await fetch(imageUri);
      const blob = await response.blob();
      // Lấy ngày hiện tại và định dạng theo yêu cầu
      const currentDate = new Date().toISOString().slice(0, 10); // Lấy ngày tháng theo định dạng YYYY-MM-DD
      const currentHour = new Date().toISOString().slice(11, 19).replace(/:/g, "-"); // Lấy giờ theo định dạng HH-mm-ss
      // Tạo tên file mới với định dạng 'IMG_Ngày hiện tại_Giờ'
      const fileName = `IMG_${currentDate}_${currentHour}`;

      const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: blob,
        ACL: "public-read", // Đảm bảo ảnh được tải lên có thể được truy cập công khai
      };

      const uploadResponse = await s3.upload(params).promise();
      console.log("Tải lên thành công", uploadResponse.Location);

      // Gán giá trị mới cho imageAvatar và thực hiện công việc cần thiết
      const imageUrl = uploadResponse.Location.toString();
      setimageAvatar(imageUrl);
      console.log("URL Ảnh của bạn là:", imageUrl);
      return imageUrl;
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
    Alert.alert("Chọn ảnh thành công");
    //Đẩy lên S3
    uploadImageToS3(result.assets[0].uri);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    // console.log(result);
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.text_2}>Chọn Ảnh Đại Diện</Text>
        <Text style={styles.text_3}>Đặt ảnh đại diện để mọi người nhận ra bạn</Text>
      </View>
      <View style={styles.container_image}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
      <View style={styles.container_button}>
        <TouchableOpacity style={styles.btn_chonanh} onPress={pickImage}>
          <Text style={styles.text_4}>Chọn ảnh</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn_chonanh, { backgroundColor: "gray" }]}
          onPress={handle_signup}>
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
