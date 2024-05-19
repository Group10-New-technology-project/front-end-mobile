import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Animated } from "react-native";

export default function TrangChu({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState("Vietnamese");
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const images = [
    require("../../../assets/baner1.png"),
    require("../../../assets/baner2.png"),
    require("../../../assets/baner3.png"),
    require("../../../assets/baner4.png"),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(translateX, {
        toValue: -Dimensions.get("window").width,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        translateX.setValue(Dimensions.get("window").width);
        Animated.timing(translateX, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 52, fontWeight: "700", color: "#0091FF" }}>Zelo</Text>
        <Animated.Image
          source={images[currentIndex]}
          resizeMode="contain"
          style={[
            {
              height: Dimensions.get("window").width,
              width: Dimensions.get("window").width,
              transform: [{ translateX }],
            },
          ]}
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
    paddingTop: 90,
    alignItems: "center",
    flex: 5,
    backgroundColor: "#FFFFFF",
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
