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

export default function ChonAnhDaiDien({ navigation, route }) {
  const { password, SoDienThoai, name, birthday, Gender } = route.params;
  console.log("Da nhan", password, SoDienThoai, name, birthday, Gender);
  const [idUser, setIdUser] = useState(null);
  const [image, setImage] = useState("https://chanh9999.s3.ap-southeast-1.amazonaws.com/demo3.png");
  const [imageURL, setimageAvatar] = useState("https://chanh9999.s3.ap-southeast-1.amazonaws.com/demo3.png");

  const handle_signup = async () => {
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

      // Nếu tạo người dùng thành công, chờ lấy thông tin người dùng và tạo thành viên
      await fetchUserByUserName();
      navigation.navigate("DangNhap");
    } catch (error) {
      console.error("Error signing up:", error);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi)
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
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      // Lấy ngày hiện tại và định dạng theo yêu cầu
      var now = new Date();
      // Lấy giờ, phút và giây hiện tại
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var seconds = now.getSeconds();
      const currentDate = new Date().toISOString().slice(0, 10); // Lấy ngày tháng theo định dạng YYYY-MM-DD
      // Tạo tên file mới với định dạng 'IMG_Ngày hiện tại_Giờ'
      const fileName = `IMG_${currentDate}_${hours}-${minutes}-${seconds}.png`;

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
      <View style={styles.container_image}>{image && <Image source={{ uri: image }} style={styles.image} />}</View>
      <View style={styles.container_button}>
        <TouchableOpacity style={styles.btn_chonanh} onPress={pickImage}>
          <Text style={styles.text_4}>Chọn ảnh</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn_chonanh, { backgroundColor: "gray" }]} onPress={handle_signup}>
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
