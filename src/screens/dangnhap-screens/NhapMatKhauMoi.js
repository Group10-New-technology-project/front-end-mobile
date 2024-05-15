import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";

export default function NhapMatKhauMoi({ route, navigation }) {
  const { SoDienThoai } = route.params;
  // const SoDienThoai = "+84787847370";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isHidden, setIsHidden] = useState(true);

  const title = "Mật khẩu phải gồm chữ, số hoặc ký tự đặc biệt không được chứa năm sinh và tên Zalo của bạn";

  useEffect(() => {
    console.log(SoDienThoai);
  }, []);

  const handleHienPassword = () => {
    setIsHidden(!isHidden);
  };

  const validatePassword = (password, confirmPassword) => {
    const minLength = 8;
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const digitRegex = /[0-9]/;
    const whitespaceRegex = /\s/;
    if (password.length < minLength) {
      Alert.alert("Mật khẩu phải chứa ít nhất 8 ký tự.");
    } else if (!lowercaseRegex.test(password)) {
      Alert.alert("Mật khẩu phải chứa ít nhất một chữ cái viết thường.");
    } else if (!uppercaseRegex.test(password)) {
      Alert.alert("Mật khẩu phải chứa ít nhất một chữ cái viết hoa.");
    } else if (!digitRegex.test(password)) {
      Alert.alert("Mật khẩu phải chứa ít nhất một chữ số.");
    } else if (whitespaceRegex.test(password)) {
      Alert.alert("Mật khẩu không được chứa khoảng trắng.");
    } else if (password === "") {
      Alert.alert("Vui lòng nhập mật khẩu!");
    } else if (confirmPassword === "") {
      Alert.alert("Vui lòng nhập mật khẩu xác nhận!");
    } else if (password !== confirmPassword) {
      Alert.alert("Mật khẩu nhập lại không đúng");
    } else if (password === confirmPassword) {
      Alert.alert("Cập nhật mật khẩu thành công!");
      updatePassword(SoDienThoai, confirmPassword);
    }
  };

  const handleCapNhat = () => {
    validatePassword(password, confirmPassword);
  };

  const updatePassword = async (SoDienThoai, confirmPassword) => {
    try {
      const response = await axios.post("http://192.168.3.84:3000/api/v1/users/updatePassword", {
        username: SoDienThoai,
        password: confirmPassword,
      });
      // console.log(response.data);
      navigation.navigate("DangNhap");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={{ fontSize: 16, color: "black", textAlign: "center" }}>{title}</Text>
      </View>
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <Text style={{ fontSize: 16, color: "#0091FF", marginLeft: 10, marginTop: 15 }}>Mật khẩu mới</Text>
        <TouchableOpacity onPress={handleHienPassword}>
          <Text style={{ fontSize: 16, color: "gray", marginRight: 10, marginTop: 15 }}> {isHidden ? "Hiện" : "Ẩn"}</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.textInput}
        placeholder="Nhập mật khẩu mới"
        placeholderTextColor="#7E828B"
        secureTextEntry={isHidden}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Nhập lại mật khẩu mới"
        placeholderTextColor="#7E828B"
        secureTextEntry={isHidden}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <View style={{ alignItems: "center", paddingTop: 20 }}>
        <TouchableOpacity style={styles.btnCapNhat} onPress={handleCapNhat}>
          <Text style={{ fontSize: 15, color: "white", textAlign: "center", fontWeight: "500" }}>Cập nhật</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  textInput: {
    fontSize: 17,
    height: 50,
    paddingLeft: 12,
    borderBottomWidth: 1,
    borderColor: "#F1F3F4",
    color: "black",
    backgroundColor: "#fff",
  },
  btnCapNhat: {
    height: 40,
    width: 190,
    borderRadius: 50,
    backgroundColor: "#00A3FF",
    justifyContent: "center",
    alignItems: "center",
  },
});
