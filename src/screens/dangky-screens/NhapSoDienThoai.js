import React, { useState } from "react";
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity } from "react-native";

export default function NhapSoDienThoai({ navigation }) {
  const [SoDienThoai, setSoDienThoai] = useState("");
  const [DieuKhoan, setDieuKhoan] = useState(false);
  const [DieuKhoanMang, setDieuKhoanMang] = useState(false);

  const sendVerification = () => {
    let formattedPhoneNumber = "";
    if (SoDienThoai.length === 10) {
      formattedPhoneNumber = "+84" + (SoDienThoai.startsWith("0") ? SoDienThoai.slice(1) : SoDienThoai);
    } else {
      formattedPhoneNumber = "+84" + SoDienThoai;
    }
    navigation.navigate("TaoMatKhau", {
      phone2: formattedPhoneNumber.slice(3),
      SoDienThoai: formattedPhoneNumber,
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={{ justifyContent: "center", alignContent: "center" }}>
          <View
            style={{
              height: 60,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}>
            <Text style={{ fontSize: 28, fontWeight: "700", textAlign: "center" }}>Nhập số điện thoại</Text>
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                height: 50,
                width: "90%",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1.5,
                borderColor: "#2B5DAD",
                borderRadius: 8,
              }}>
              <View style={{ width: "20%", justifyContent: "center", alignContent: "center" }}>
                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: 500 }}>+84</Text>
              </View>
              <View style={{ height: 50, width: 1, backgroundColor: "#2B5DAD" }}></View>
              <TextInput
                placeholderTextColor="#82858C"
                placeholder="Nhập số điện thoại"
                keyboardType="number-pad"
                style={{
                  borderRadius: 8,
                  width: "80%",
                  fontSize: 18,
                  paddingLeft: 10,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
                onChangeText={(text) => setSoDienThoai(text)}
              />
            </View>
          </View>

          <View style={{ height: 60, marginTop: 5, marginLeft: 5 }}>
            <View style={{ flexDirection: "row", height: 30, alignItems: "center" }}>
              <View style={{ marginLeft: 20, flexDirection: "row", height: 30, alignItems: "center" }}>
                <TouchableOpacity onPress={() => setDieuKhoan(!DieuKhoan)}>
                  {DieuKhoan ? (
                    <View>
                      <Image
                        source={require("../../../assets/img/checkbox.jpg")}
                        resizeMode="contain"
                        style={{
                          borderRadius: 5,
                          height: 19,
                          width: 19,
                        }}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        height: 19,
                        width: 19,
                        borderWidth: 2,
                        borderColor: "#707070",
                        borderRadius: 5,
                      }}></View>
                  )}
                </TouchableOpacity>
                <Text style={{ fontWeight: 500, fontSize: 14, marginLeft: 4 }}>Tôi đồng ý với </Text>
                <Text style={{ fontWeight: 700, fontSize: 14, marginLeft: 3, color: "#0187F9" }}>điều khoản Mạng xã hội Zelo</Text>
              </View>
            </View>
            <View style={{ marginLeft: 20, flexDirection: "row", height: 30, alignItems: "center" }}>
              <TouchableOpacity onPress={() => setDieuKhoanMang(!DieuKhoanMang)}>
                {DieuKhoanMang ? (
                  <View>
                    <Image
                      source={require("../../../assets/img/checkbox.jpg")}
                      resizeMode="contain"
                      style={{
                        borderRadius: 5,
                        height: 19,
                        width: 19,
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      height: 19,
                      width: 19,
                      borderWidth: 2,
                      borderColor: "#707070",
                      borderRadius: 5,
                    }}></View>
                )}
              </TouchableOpacity>
              <Text style={{ fontWeight: 500, fontSize: 14, marginLeft: 4 }}>Tôi đồng ý với </Text>
              <Text style={{ fontWeight: 700, fontSize: 14, marginLeft: 3, color: "#0187F9" }}>chính sách bảo mật Zelo</Text>
            </View>
          </View>
          <View style={{ marginTop: 30, height: 39, justifyContent: "center", alignItems: "center" }}>
            {(SoDienThoai.length === 9 || SoDienThoai.length === 10) && DieuKhoan && DieuKhoanMang ? (
              <TouchableOpacity onPress={sendVerification}>
                <View
                  style={{
                    height: 44,
                    width: 340,
                    backgroundColor: "#00A3FF",
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Text style={{ fontSize: 15, fontWeight: 500, color: "white", textAlign: "center" }}>Tiếp tục</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  height: 44,
                  width: 340,
                  backgroundColor: "#C1D4E3",
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Text style={{ fontSize: 15, fontWeight: 500, color: "white", textAlign: "center" }}>Tiếp tục</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View
        style={{
          height: 30,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Text style={{ fontWeight: 500, fontSize: 15 }}>Bạn đã có tài khoản?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("DangNhap")}>
          <Text style={{ fontWeight: 500, fontSize: 15, color: "#0187F9", marginLeft: 4 }}>Đăng nhập ngay</Text>
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
    height: 45,
  },
});
