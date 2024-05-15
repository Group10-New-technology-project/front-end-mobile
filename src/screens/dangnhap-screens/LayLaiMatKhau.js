import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import axios from "axios";
import { API_URL } from "@env";

export default function LayLaiMatKhau({ navigation }) {
  const [sodienthoai, setsodienthoai] = useState("");
  const [listPhoneNumber, setListPhoneNumber] = useState([]);

  useEffect(() => {
    getPhoneNumber();
  }, []);

  const getPhoneNumber = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/users/demo/getAllUserName`);
      setListPhoneNumber(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNext = () => {
    if (!sodienthoai || sodienthoai.length !== 10) {
      Alert.alert("Số điện thoại không hợp lệ!");
      return;
    } else if (listPhoneNumber.includes("+84" + sodienthoai.slice(1))) {
      navigation.navigate("MaXacThucLayLaiMatKhau", {
        SoDienThoai: "+84" + sodienthoai.slice(1),
      });
    } else {
      Alert.alert("Số điện thoại không tồn tại trong hệ thống!");
    }
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
            Nhập số điện thoại để lấy lại mật khẩu
          </Text>
        </View>
        <View style={{ height: 50, backgroundColor: "red", marginTop: 5 }}>
          <TextInput
            placeholder="Số điện thoại"
            placeholderTextColor="#7E828B"
            keyboardType="number-pad"
            style={{
              height: 50,
              fontSize: 20,
              paddingLeft: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#F1F3F4",
              color: "black",
              backgroundColor: "#fff",
              fontWeight: "bold",
            }}
            onChangeText={(text) => setsodienthoai(text)}
          />
        </View>
        <TouchableOpacity>
          <View style={{ marginTop: 30, height: 39, justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity onPress={handleNext}>
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
