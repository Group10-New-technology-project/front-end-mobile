import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function TaoMatKhauScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false); // Trạng thái để kiểm tra xem hai mật khẩu đã nhập có khớp nhau không

  // Hàm xử lý khi thay đổi mật khẩu
  const handlePasswordChange = (text) => {
    setPassword(text);
    // Kiểm tra xem mật khẩu đã nhập lại có khớp với mật khẩu nhập ban đầu không
    setPasswordsMatch(text === confirmPassword);
  };

  // Hàm xử lý khi thay đổi nhập lại mật khẩu
  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    // Kiểm tra xem mật khẩu nhập lại có khớp với mật khẩu ban đầu không
    setPasswordsMatch(password === text);
  };
  const hanlde_chonTen = () => {
    navigation.navigate("ThongTinCaNhan");
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.text_2}>Nhập Mật Khẩu</Text>
        <Text style={styles.text_3}>Hãy nhập mật khẩu Zalo để đăng nhập vào lần sau</Text>
      </View>
      <View style={styles.input_password}>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={handlePasswordChange}
        />
        {/* Hiển thị biểu tượng dấu x nếu mật khẩu không rỗng */}
        {password !== "" && (
          <AntDesign
            name="closecircle"
            size={18}
            color="#0091FF"
            style={styles.clearIcon1}
            onPress={() => setPassword("")}
          />
        )}
        <TextInput
          style={[styles.input, !passwordsMatch ? styles.inputError : styles.inputSuccess]}
          secureTextEntry={true}
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
        />
        {confirmPassword !== "" && (
          <AntDesign
            name="closecircle"
            size={18}
            color="#0091FF"
            style={styles.clearIcon2}
            onPress={() => setConfirmPassword("")}
          />
        )}
      </View>
      <View style={styles.title_password}>
        <Text style={styles.text_3}>•Mật khẩu của bạn phải chứa ít nhất 8 ký tự</Text>
        <Text style={styles.text_3}>•Mật khẩu của bạn phải chứa ít nhất 1 chữ cái và 1 số</Text>
        <Text style={styles.text_3}>•Mật khẩu của bạn không được chứa khoảng trắng</Text>
      </View>
      <TouchableOpacity
        style={[styles.btn_next, passwordsMatch && styles.btnSuccess]}
        onPress={hanlde_chonTen}>
        <Text style={styles.text_1}>Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "gray",
  },
  title: {
    paddingTop: Dimensions.get("window").height * 0.18,
    alignItems: "center",
  },
  input_password: {
    paddingTop: 20,
    // backgroundColor: "pink",
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    height: 50,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: "500",
    // borderColor: "blue",
    borderWidth: 0.5,
  },
  btn_next: {
    height: 50,
    marginHorizontal: 20,
    backgroundColor: "#0091FF",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.1,
  },
  btnSuccess: {
    opacity: 1,
  },
  title_password: {
    padding: 20,
  },
  text_1: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  text_2: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text_3: {
    fontSize: 14,
    fontWeight: "500",
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  clearIcon1: {
    position: "absolute",
    top: 45,
    right: 28,
    zIndex: 1, // Đảm bảo biểu tượng hiển thị trên top
    opacity: 0.5,
  },
  clearIcon2: {
    position: "absolute",
    top: 115,
    right: 28,
    // zIndex: 1, // Đảm bảo biểu tượng hiển thị trên top
    opacity: 0.5,
  },
  inputSuccess: {
    borderColor: "green",
    borderWidth: 1,
  },
});
