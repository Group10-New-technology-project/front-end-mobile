import React, { useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput, Alert } from "react-native"; // Import Text từ react-native
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DangNhap({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Kiểm tra xem username và password đã được nhập hay chưa
      if (!username || !password) {
        Alert.alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
        return;
      }

      // Tạo đối tượng JSON chứa thông tin đăng nhập
      const userData = {
        username: username,
        password: password,
      };

      // Lưu đối tượng JSON vào AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      console.log("Đã lưu thông tin đăng nhập vào AsyncStorage");
      console.log("userdata", userData);

      // Gửi yêu cầu đăng nhập đến máy chủ API
      const response = await fetch("http://192.168.3.226:3000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // console.log(response);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Data", data);
      if (data.user) {
        // Đăng nhập thành công, điều hướng tới màn hình Tabs
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));
        navigation.navigate("Tabs");
      } else {
        // Đăng nhập không thành công, hiển thị thông báo lỗi
        Alert.alert("Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (error) {
      console.error("There was an error!", error);
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
            Vui lòng nhập số điện thoại và mật khẩu để đăng nhập
          </Text>
        </View>
        <View style={{ height: 50, backgroundColor: "red", marginTop: 20 }}>
          <TextInput
            placeholder="Số điện thoại"
            placeholderTextColor="#7E828B"
            style={{
              height: 50,
              fontSize: 15,
              paddingLeft: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#F1F3F4",
              color: "black",
              backgroundColor: "#fff", // outlineColor: 'transparent', // Đặt màu viền trong suốt
              // outlineWidth: 0, // Đặt độ rộng của viền là 0
            }}
            onChangeText={(text) => setUsername(text)}
          />
        </View>
        <View style={{ height: 50, backgroundColor: "red" }}>
          <TextInput
            placeholder="Mật khẩu"
            placeholderTextColor="#7E828B"
            style={{
              height: 50,
              fontSize: 15,
              paddingLeft: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#F1F3F4",
              color: "black",
              backgroundColor: "#fff",
              // outlineColor: 'transparent', // Đặt màu viền trong suốt
              // outlineWidth: 0, // Đặt độ rộng của viền là 0
            }}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
        </View>
        <View style={{ height: 50, justifyContent: "center" }}>
          <TouchableOpacity>
            <Text style={{ marginLeft: 10, color: "#0F8EF9", fontSize: 14, fontWeight: 400 }}>
              Lấy lại mật khẩu
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <View
            style={{ marginTop: 5, height: 39, justifyContent: "center", alignItems: "center" }}>
            {username.length > 0 && password.length > 0 ? (
              <TouchableOpacity onPress={handleLogin}>
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
                <Text style={{ fontSize: 13, color: "white", textAlign: "center" }}>Đăng nhập</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ height: 30, justifyContent: "center", alignItems: "center", marginBottom: 5 }}>
        <TouchableOpacity>
          <Text style={{ fontSize: 13, color: "#ABABAB" }}>Các câu hỏi thường gặp</Text>
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
