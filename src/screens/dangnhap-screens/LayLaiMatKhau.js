import React, { useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput } from "react-native"; // Import Text từ react-native

import { AntDesign } from "@expo/vector-icons";
export default function LayLaiMatKhau({ navigation }) {
  const [sodienthoai, setsodienthoai] = useState("");

  const handleNext = async () => {
    try {
      if (!sodienthoai) {
        alert("Vui lòng nhập số điện thoại");
        return;
      }
      navigation.navigate("MaXacThucLayLaiMatKhau", {
        SoDienThoai: sodienthoai,
      });
    } catch (error) {
      console.error('There was an error!', error);
    }
  };


  return (
    <View style={styles.container}>
      <View>
        <View style={{ height: 39, backgroundColor: "#F9FAFE", justifyContent: "center" }}>
          <Text
            style={{
              marginBottom: 5,
              marginLeft: 10,
              fontWeight: 500,
              fontSize: 13,
              color: "black",
            }}>
            Nhập số điện thoại để lấy lại mật khẩu
          </Text>
        </View>
        <View style={{ height: 50, backgroundColor: "red", marginTop: 5 }}>
          <TextInput
            placeholder="Số điện thoại"
            placeholderTextColor="#7E828B"
            keyboardType="numbers-and-punctuation"
            style={{
              height: 50,
              fontSize: 20,
              paddingLeft: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#F1F3F4",
              color: "black",
              backgroundColor: "#fff",
              fontWeight:'bold'
              // outlineColor: 'transparent', // Đặt màu viền trong suốt
              // outlineWidth: 0, // Đặt độ rộng của viền là 0
            }}
            onChangeText={(text) => setsodienthoai(text)}
          />
          <AntDesign
            name="closecircle"
            size={18}
            color="#0091FF"
            style={{
              position: "absolute",
              top: 10,
              right: 20,
              zIndex: 1, // Đảm bảo biểu tượng hiển thị trên top
              opacity: 0.5,
            }}
            onPress={() => setsodienthoai("")}
          />
        </View>
        <TouchableOpacity>
          <View
            style={{ marginTop: 15, height: 39, justifyContent: "center", alignItems: "center" }}>
            {sodienthoai.length > 9 || sodienthoai.length <15 ? (
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
                    Đăng nhập
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  height: 37,
                  width: 182,
                  borderRadius: 50,
                  backgroundColor: "#C1D4E3",
                  justifyContent: "center",
                }}>
                <Text style={{ fontSize: 13, color: "white", textAlign: "center" }}>Tiếp Tục</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 45, // Chiều cao của phần header
  },
});
