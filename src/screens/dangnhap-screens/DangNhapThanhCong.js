import React, { useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput } from "react-native"; // Import Text từ react-native

import { AntDesign } from "@expo/vector-icons";
export default function DangNhapThanhCong({ navigation }) {
  const [sodienthoai, setsodienthoai] = useState("");

  // const handleNext = async () => {
  //   try {
  //     if (!sodienthoai) {
  //       alert("Vui lòng nhập số điện thoại");
  //       return;
  //     }
  //     navigation.navigate("NhapThongTinCaNhan");
  //   } catch (error) {
  //     console.error("There was an error!", error);
  //   }
  // };

  const handleNext = () => {
    navigation.navigate("TrangChu");
  };

  return (
    <View style={styles.container}>
      <View>
        <View
          style={{
            height: 39,
            backgroundColor: "#F9FAFE",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 30,
          }}>
          <Text
            style={{
              marginBottom: 5,
              marginLeft: 10,
              fontWeight: 500,
              fontSize: 25,
              color: "black",
            }}>
            Đăng Nhập Thành Công
          </Text>
          <Text
            style={{
              marginBottom: 5,
              marginLeft: 10,
              fontWeight: 500,
              fontSize: 15,
              color: "black",
            }}>
            Bây giờ bạn có thể tạo mật khẩu mới. Tài khoản và mật khẩu này dừng để đăng nhập trên
            bất cứ thiết bị nào.
          </Text>
        </View>
      </View>
      <TouchableOpacity>
        <View
          style={{
            marginTop: 15,
            height: 39,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 30,
          }}>
          <TouchableOpacity onPress={handleNext}>
            <View
              style={{
                height: 37,
                width: 182,
                borderRadius: 50,
                backgroundColor: "#00A3FF",
                justifyContent: "center",
              }}>
              <Text style={{ fontSize: 13, color: "white", textAlign: "center" }}>
                Tạo Mật Khẩu
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 45, // Chiều cao của phần header
  },
});
