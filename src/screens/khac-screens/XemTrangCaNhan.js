import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, ImageBackground, Alert } from "react-native";
import { Ionicons, AntDesign, Feather, SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function XemTrangCaNhan({ navigation, route }) {
  const { user_id } = route.params;
  // const { user_id } = route.params ? route.params : { user_id: "66209dab4fa436ede9c7e261" };
  const [user_login, setUserData] = useState(null);
  const [listFriends, setListFriends] = useState([]);
  const [listFriendsRequest, setListFriendsRequest] = useState([]);
  const [listFriendsRecived, setListFriendsRecived] = useState([]);
  const [imageAvatar, setImageAvatar] = useState(null);
  const [imageCover, setImageCover] = useState(null);
  const [name, setName] = useState("Chanh");
  const [reloadData, setReloadData] = useState(false);

  useEffect(() => {
    fetchDataLogin();
    getThongTinUser();
    setReloadData(false);
  }, [reloadData]);

  const handleNhanTin = () => {
    console.log("Nhắn tin", user_id);
    Alert.alert(
      "",
      "Bạn có chắc chắn muốn nhắn tin với " + name + "?",
      [
        { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: false }
    );
  };
  const handleKetBan = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/addFriendRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_sender: user_login,
          id_receiver: user_id,
        }),
      });
      if (response.ok) {
        Alert.alert("Gởi lời mời kết bạn thành công đến " + name);
        setReloadData(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
    Alert.alert(
      "",
      `Bạn có chắc chắn muốn hủy kết bạn với ${name}?`, // Sử dụng template literals để tạo chuỗi
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const response = await axios.post(`${API_URL}/api/v1/users/deleteFriends`, {
                id_sender: user_login,
                id_receiver: user_id,
              });
              if (response.status === 200) {
                setReloadData(true);
                Alert.alert("Đã hủy kết bạn với " + name + "!");
              }
            } catch (error) {
              console.error("Error:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  const handleThuHoiLoiMoi = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/deleteFriendRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_sender: user_login,
          id_receiver: user_id,
        }),
      });
      if (response.ok) {
        Alert.alert("Đã thu hồi lời mời kết bạn cho " + name + "!");
        setReloadData(true);
      } else {
        console.error("Failed to delete friend request");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleChapNhanLoiMoi = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/acceptFriendRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_sender: user_id,
          id_receiver: user_login,
        }),
      });
      if (response.ok) {
        Alert.alert("Đã chấp nhận lời mời kết bạn từ " + name + "!");
      } else {
        console.error("Failed to delete friend request");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleTuChoiLoiMoi = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/deleteFriendRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_sender: user_id,
          id_receiver: user_login,
        }),
      });
      if (response.ok) {
        Alert.alert("Đã từ chối lời mời kết bạn từ " + name + "!");
        setReloadData(true);
      } else {
        console.error("Failed to delete friend request");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const getThongTinUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/users/${user_id}`);
      const data = response.data;
      setImageAvatar(data.avatar || "image");
      setImageCover(data.coveravatar || "image");
      setName(data.name);
    } catch (error) {
      console.error(error);
    }
  };
  const getFriends = async (user_login) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/users/${user_login}`);
      const data = response.data;
      setListFriends(data.friends);
      setListFriendsRequest(data.friendRequest.map((request) => request._id));
      setListFriendsRecived(data.friendReceived.map((request) => request._id));
      console.log("Friend", data.friends);
      console.log(
        "Friend Request",
        data.friendRequest.map((request) => request._id)
      );
      console.log(
        "Friend Recived",
        data.friendReceived.map((request) => request._id)
      );
    } catch (error) {
      console.error(error);
    }
  };
  const fetchDataLogin = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        setUserData(user?._id);
        getFriends(user?._id);
      } else {
        console.log("Không có thông tin người dùng được lưu");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
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
        {user_id !== user_login && (
          <TouchableOpacity style={{ marginLeft: 6 }} onPress={handleChinhSuaTen}>
            <AntDesign name="edit" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
      {/* Nếu là chính mình thì hiển thị nút cập nhật giới thiệu bản thân */}
      {user_id === user_login && (
        <View style={styles.button_profile}>
          <TouchableOpacity style={styles.btn_capnhatgioithieu}>
            <AntDesign name="edit" size={18} color="#005ECD" />
            <Text style={{ fontSize: 14, paddingLeft: 4, fontWeight: "600", color: "#005ECD" }}>Cập nhật giới thiệu bản thân</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Nếu là bạn bè thì hiển thị nút nhắn tin và hủy kết bạn */}
      {listFriends.includes(user_id) && (
        <View style={styles.button_profile}>
          <TouchableOpacity style={styles.btn_nhantin} onPress={handleNhanTin}>
            <AntDesign name="message1" size={22} color="#005ECD" />
            <Text style={{ fontSize: 16, paddingLeft: 10, fontWeight: "600", color: "#005ECD" }}>Nhắn tin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn_addFriends} onPress={handleHuyKetBan}>
            <Ionicons name="person-remove-outline" size={22} color="red" />
          </TouchableOpacity>
        </View>
      )}
      {/* Nếu là bạn bè đã gửi lời mời thì hiển thị nút nhắn tin và thu hồi lời mời */}
      {listFriendsRequest && listFriendsRequest.includes(user_id) && (
        <View style={styles.button_profile}>
          <TouchableOpacity style={styles.btn_nhantin} onPress={handleNhanTin}>
            <AntDesign name="message1" size={22} color="#005ECD" />
            <Text style={{ fontSize: 16, paddingLeft: 10, fontWeight: "600", color: "#005ECD" }}>Nhắn tin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn_addFriends} onPress={handleThuHoiLoiMoi}>
            <Ionicons name="reload-circle" size={30} color="gray" />
          </TouchableOpacity>
        </View>
      )}
      {/* Nếu là bạn bè nhận được lời mời thì hiển thị nút chấp nhận hoặc từ chối */}
      {listFriendsRecived && listFriendsRecived.includes(user_id) && (
        <View style={styles.button_profile}>
          <TouchableOpacity style={styles.btn_nhantin3} onPress={handleNhanTin}>
            <AntDesign name="message1" size={22} color="#005ECD" />
            <Text style={{ fontSize: 16, paddingLeft: 10, fontWeight: "600", color: "#005ECD" }}>Nhắn tin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn_addFriends} onPress={handleTuChoiLoiMoi}>
            <Ionicons name="close-circle-outline" size={28} color="red" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn_addFriends} onPress={handleChapNhanLoiMoi}>
            <Ionicons name="checkmark-circle-outline" size={28} color="green" />
          </TouchableOpacity>
        </View>
      )}
      {/* Nếu không phải là bạn bè thì hiển thị nút kết bạn */}
      {!listFriends.includes(user_id) &&
        !listFriendsRequest.includes(user_id) &&
        !listFriendsRecived.includes(user_id) &&
        user_id !== user_login && (
          <View style={styles.button_profile}>
            <TouchableOpacity style={styles.btn_nhantin} onPress={handleNhanTin}>
              <AntDesign name="message1" size={22} color="#005ECD" />
              <Text style={{ fontSize: 16, paddingLeft: 10, fontWeight: "600", color: "#005ECD" }}>Nhắn tin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn_addFriends} onPress={handleKetBan}>
              <Ionicons name="person-add-outline" size={22} color="#005ECD" />
            </TouchableOpacity>
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
    paddingTop: 8,
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
  btn_nhantin3: {
    height: 42,
    backgroundColor: "#BEE6FC",
    width: "54%",
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
