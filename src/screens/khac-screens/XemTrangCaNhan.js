import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, ImageBackground, Alert } from "react-native";
import { Ionicons, AntDesign, Feather, SimpleLineIcons } from "@expo/vector-icons";

export default function XemTrangCaNhan({ navigation }) {
  const [imageAvatar, setImageAvatar] = useState("https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-18_11-13-6.png");
  const [imageCover, setImageCover] = useState("https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-18_11-13-6.png");
  const [name, setName] = useState("Chanh");

  const handleNhanTin = () => {
    navigation.navigate("Tabs");
    console.log("Nhắn tin");
  };

  const handleKetBan = () => {
    Alert.alert("Đã gửi lời mời kết bạn cho " + name + "!");
  };

  const handleChinhSuaTen = () => {
    Alert.alert("Chỉnh sửa tên");
  };
  const handleGoiThoai = () => {
    Alert.alert("Gọi thoại");
  };

  const handleCaiDat = () => {
    navigation.navigate("CaiDat");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header_profile}>
        <ImageBackground source={{ uri: imageCover }} style={{ width: "100%", height: "100%" }}></ImageBackground>
        <View style={styles.btn_top}>
          <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={27} color="white" />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={handleGoiThoai}>
              <SimpleLineIcons name="phone" size={21} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingRight: 16, paddingLeft: 16 }} onPress={handleCaiDat}>
              <Feather name="more-horizontal" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.avatar_profile}>
        <Image source={{ uri: imageAvatar }} style={styles.imageAvatar} />
      </View>

      <View style={styles.content_name}>
        <Text style={{ fontSize: 24, fontWeight: "600" }}>{name}</Text>
        <TouchableOpacity style={{ marginLeft: 6 }} onPress={handleChinhSuaTen}>
          <AntDesign name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.button_profile}>
        <TouchableOpacity style={styles.btn_nhantin} onPress={handleNhanTin}>
          <AntDesign name="message1" size={22} color="#005ECD" />
          <Text style={{ fontSize: 16, paddingLeft: 10, fontWeight: "600", color: "#005ECD" }}>Nhắn tin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn_addFriends} onPress={handleKetBan}>
          <Ionicons name="person-add-outline" size={22} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.container_profile}>
        <View style={{ borderWidth: 0.5, borderColor: "#DADADA" }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header_profile: {
    height: Dimensions.get("window").height * 0.32,
    // backgroundColor: "red",
  },
  container_profile: {
    paddingTop: 22,
  },
  avatar_profile: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.24,
    left: Dimensions.get("window").width / 3.2,
  },
  button_profile: {
    flexDirection: "row",
    paddingTop: 5,
  },
  btn_top: {
    height: 50,
    position: "absolute",
    left: 0,
    right: 0,
    top: 45,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  btn_nhantin: {
    height: 42,
    backgroundColor: "#BEE6FC",
    width: "71.5%",
    borderRadius: 40,
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  content_name: {
    paddingTop: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btn_addFriends: {
    height: 42,
    backgroundColor: "#FFF",
    width: 65,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  imageAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#FFF",
  },
});
