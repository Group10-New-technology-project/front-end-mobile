import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from "react-native";
import Swiper from "react-native-swiper";

export default function TrangChu({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState("Vietnamese");

  const images = [
    require("../../../assets/baner1.png"),
    require("../../../assets/baner2.png"),
    require("../../../assets/baner3.png"),
    require("../../../assets/baner4.png"),
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 52, fontWeight: "700", color: "#0091FF" }}>Zelo</Text>
        <Swiper style={styles.wrapper} showsButtons={false} autoplay={true} autoplayTimeout={4}>
          {images.map((image, index) => (
            <View key={index} style={styles.slide}>
              <Image
                source={image}
                resizeMode="contain"
                style={{
                  width: Dimensions.get("window").width,
                  height: Dimensions.get("window").width,
                }}
              />
            </View>
          ))}
        </Swiper>
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
              <Text style={{ fontSize: 14, fontWeight: "500", color: "white", textAlign: "center" }}>Đăng nhập</Text>
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
              <Text style={{ fontSize: 14, fontWeight: "500", color: "#000000", textAlign: "center" }}>Đăng ký</Text>
            </View>
          </TouchableOpacity>
          <View style={{ marginTop: 10, height: 40, width: 274, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
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
    paddingTop: 80,
    alignItems: "center",
    flex: 5,
    backgroundColor: "#FFFFFF",
    // backgroundColor: "green",
  },
  wrapper: {},

  slide: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 3.2,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
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
    color: "#000000",
  },
  languageText1: {
    marginTop: 8,
    fontSize: 13,
    textAlign: "center",
    color: "#9B9DA7",
  },
  languageItem1: {
    height: 38,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
  },
});
