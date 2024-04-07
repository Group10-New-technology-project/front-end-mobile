import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

export default function Home({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState("Vietnamese");

  return (
    <View style={styles.container}>
      <View style={[styles.header, {}]}>
        <Text style={{ fontSize: 50, fontWeight: "900", color: "#0091FF" }}>ZELO</Text>
        <Image
          source={require("../../../assets/img/bannerzalo.png")}
          resizeMode="contain"
          style={{ height: 356, width: 390 }}
        />
      </View>

      <View style={styles.footer}>
        <View style={{ flex: 1 }}></View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.navigate("DangNhap")}>
            <View
              style={{
                height: 46,
                width: 274,
                backgroundColor: "#00A3FF",
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text style={{ fontSize: 13, color: "white", textAlign: "center" }}>Đăng nhập</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("NhapSoDienThoai")}>
            <View
              style={{
                marginTop: 13,
                height: 46,
                width: 274,
                backgroundColor: "#F3F4F8",
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text style={{ fontSize: 13, color: "#000000", textAlign: "center" }}>Đăng ký</Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              marginTop: 10,
              height: 40,
              width: 274,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <TouchableOpacity onPress={() => setSelectedLanguage("Vietnamese")}>
              {selectedLanguage === "Vietnamese" ? (
                <View style={[styles.languageItem, styles.selectedLanguage]}>
                  <Text style={styles.languageText}>Tiếng Việt</Text>
                </View>
              ) : (
                <View style={styles.languageItem1}>
                  <Text style={styles.languageText1}>Tiếng Việt</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedLanguage("English")}>
              {selectedLanguage === "English" ? (
                <View style={[styles.languageItem, styles.selectedLanguage]}>
                  <Text style={styles.languageText}>English</Text>
                </View>
              ) : (
                <View style={styles.languageItem1}>
                  <Text style={styles.languageText1}>English</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: {
    paddingTop: 90,
    alignItems: "center",
    flex: 5.5,
    justifyContent: "space-between",
  },
  footer: {
    flex: 4.5,
    justifyContent: "center",
    alignItems: "center",
  },
  languageItem: {
    height: 38,
    width: 90,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedLanguage: {
    borderBottomColor: "#000000",
  },
  languageText: {
    marginTop: 8,
    fontSize: 13,
    textAlign: "center",
    color: "#000000", // Thêm màu văn bản cho chữ Tiếng Việt và English
  },
  languageText1: {
    marginTop: 8,
    fontSize: 13,
    textAlign: "center",
    color: "#9B9DA7", // Thêm màu văn bản cho chữ Tiếng Việt và English
  },
  languageItem1: {
    height: 38,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
  },
});
