import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

export default function DangNhap({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Kiểm tra xem username và password đã được nhập hay chưa
      if (!username || !password) {
        Alert.alert("Đăng nhập không thành công", "Vui lòng nhập đầy đủ thông tin đăng nhập");
        return;
      }
      // Tạo đối tượng JSON chứa thông tin đăng nhập
      const userData = {
        username: username,
        password: password,
      };
      // Lưu đối tượng JSON vào AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      // console.log("userdata", userData);
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
      // console.log("Data", data);
      if (data.user) {
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));
        navigation.navigate("Tabs");
      } else {
        console.log("Đăng nhập không thành công");
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const hanlde_layMatKhau = () => {
    navigation.navigate("LayLaiMatKhau");
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={{ height: 39, backgroundColor: "#F9FAFE", justifyContent: "center" }}>
          <Text
            style={{
              marginLeft: 10,
              fontWeight: 500,
              fontSize: 14,
              color: "black",
            }}>
            Vui lòng nhập số điện thoại và mật khẩu để đăng nhập
          </Text>
        </View>
        <View style={{ height: 50, backgroundColor: "red" }}>
          <TextInput
            placeholder="Số điện thoại"
            placeholderTextColor="#7E828B"
            style={{
              height: 50,
              fontSize: 15,
              paddingLeft: 10,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "#F1F3F4",
              color: "black",
              backgroundColor: "#fff",
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
          <TouchableOpacity onPress={hanlde_layMatKhau}>
            <Text style={{ marginLeft: 10, color: "#0F8EF9", fontSize: 14, fontWeight: "500" }}>Quên mật khẩu</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <View style={{ marginTop: 5, height: 39, justifyContent: "center", alignItems: "center" }}>
            {username.length > 0 && password.length > 0 ? (
              <TouchableOpacity onPress={handleLogin}>
                <View
                  style={{
                    height: 40,
                    width: 190,
                    borderRadius: 50,
                    backgroundColor: "#00A3FF",
                    justifyContent: "center",
                  }}>
                  <Text style={{ fontSize: 15, color: "white", textAlign: "center", fontWeight: "500" }}>Tiếp tục</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  height: 40,
                  width: 190,
                  borderRadius: 50,
                  backgroundColor: "#C1D4E3",
                  justifyContent: "center",
                }}>
                <Text style={{ fontSize: 15, color: "white", textAlign: "center", fontWeight: "500" }}>Tiếp tục</Text>
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
