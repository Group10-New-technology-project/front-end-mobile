import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, ImageBackground, Alert } from "react-native";
import { Ionicons, AntDesign, Feather, SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";

export default function XemTrangCaNhan({ navigation, route }) {
  const { user_id } = route.params ? route.params : { user_id: "66209e8af383cc8f56cad06d" };
  const user_login = "66209d044fa436ede9c7e25b";
  const [listFriends, setListFriends] = useState([]);
  const [listFriendsRequest, setListFriendsRequest] = useState([]);
  const [listFriendsRecived, setListFriendsRecived] = useState([]);

  const [imageAvatar, setImageAvatar] = useState(null);
  const [imageCover, setImageCover] = useState(null);
  const [name, setName] = useState("Chanh");

  const handleNhanTin = () => {
    console.log("Nhắn tin", user_id);
  };

  const handleKetBan = () => {
    Alert.alert("Đã gửi lời mời kết bạn cho " + name + "!");
  };

  const handleChinhSuaTen = () => {
    console.log("Chỉnh sửa tên");
  };
  const handleGoiThoai = () => {
    console.log("Gọi thoại");
  };

  const handleCaiDat = () => {
    navigation.navigate("CaiDat");
  };

  const handleHuyKetBan = () => {
    Alert.alert("Đã hủy kết bạn với " + name + "!");
  };

  const getThongTinUser = async () => {
    try {
      const response = await axios.get(`http://192.168.3.8:3000/api/v1/users/${user_id}`);
      const data = response.data;
      setImageAvatar(data.avatar || "image");
      setImageCover(data.coveravatar || "image");
      setName(data.name);
    } catch (error) {
      console.error(error);
    }
  };
  const getFriends = async () => {
    try {
      const response = await axios.get(`http://192.168.3.8:3000/api/v1/users/${user_login}`);
      const data = response.data;
      setListFriends(data.friends);
      setListFriendsRequest(data.friendRequest);
      setListFriendsRecived(data.friendReceived);
      console.log("DanhSachFriend", data.friends);
      console.log("DanhSachFriendRequest", data.friendRequest);
      console.log("DanhSachFriendRecived", data.friendReceived);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getThongTinUser();
    getFriends();
  }, []);

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
        {user_id !== user_login && (
          <TouchableOpacity style={{ marginLeft: 6 }} onPress={handleChinhSuaTen}>
            <AntDesign name="edit" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {user_id === user_login && (
        <View style={styles.button_profile}>
          <TouchableOpacity style={styles.btn_capnhatgioithieu}>
            <AntDesign name="edit" size={18} color="#005ECD" />
            <Text style={{ fontSize: 14, paddingLeft: 4, fontWeight: "600", color: "#005ECD" }}>Cập nhật giới thiệu bản thân</Text>
          </TouchableOpacity>
        </View>
      )}
      {listFriends.includes(user_id) && (
        <View style={styles.button_profile}>
          <TouchableOpacity style={styles.btn_nhantin} onPress={handleNhanTin}>
            <AntDesign name="message1" size={22} color="#005ECD" />
            <Text style={{ fontSize: 16, paddingLeft: 10, fontWeight: "600", color: "#005ECD" }}>Nhắn tin</Text>
          </TouchableOpacity>
          {/* Nếu là bạn bè thì hiển thị nút nhắn tin và hủy kết bạn */}
          {listFriends && listFriends.includes(user_id) && (
            <TouchableOpacity style={styles.btn_addFriends} onPress={handleHuyKetBan}>
              <Ionicons name="person-remove-sharp" size={22} color="red" />
            </TouchableOpacity>
          )}
          {/* Nếu là bạn bè đã gửi lời mời thì hiển thị nút nhắn tin và thu hồi lời mời */}
          {listFriendsRequest && listFriendsRequest.includes(user_id) && (
            <TouchableOpacity style={styles.btn_addFriends} onPress={handleKetBan}>
              <Ionicons name="person-add-outline" size={22} color="black" />
            </TouchableOpacity>
          )}
          {/* Nếu là bạn bè nhận được lời mời thì hiển thị nút chấp nhận hoặc từ chối */}
          {listFriendsRecived && listFriendsRecived.includes(user_id) && (
            <TouchableOpacity style={styles.btn_addFriends} onPress={handleKetBan}>
              <Ionicons name="person-add-outline" size={22} color="black" />
              <Ionicons name="person-add-outline" size={22} color="blue" />
            </TouchableOpacity>
          )}
          {/* Nếu là người lạ thì hiển thị nút nhắn tin và kết bạn */}
          {user_id === user_login && (
            <TouchableOpacity style={styles.btn_addFriends} onPress={handleKetBan}>
              <Ionicons name="person-add-outline" size={22} color="black" />
            </TouchableOpacity>
          )}
        </View>
      )}

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
    // backgroundColor: "green",
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
  btn_capnhatgioithieu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: 10,
  },
});
