import { useEffect } from "react";
import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Alert } from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ThanhVienNhom({ route, navigation }) {
  const { conversationId } = route.params;
  const [users, setUsers] = useState([]);
  const [leader, setLeader] = useState(null);
  const [deputies, setDeputies] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchDataUserLogin();
  }, []);

  const fetchDataUserLogin = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        console.log("Thông tin người dùng đã đăng nhập:", user._id);
        setUserData(user._id);
      } else {
        console.log("Không có thông tin người dùng được lưu");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/conversation/getConversationById/${conversationId}`);
      if (response.data) {
        const leaderUserId = response.data.leader?.userId;
        console.log("Leader's userId:", leaderUserId._id);
        setLeader(leaderUserId._id);
        const memberUsers = response.data.members.map((member) => member.userId);
        setUsers(memberUsers);
        const deputyUsers = response.data.deputy?.map((deputy) => deputy.userId._id);
        setDeputies(deputyUsers);
        // console.log("Deputies:", deputyUsers);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChonThanhVien = (item) => {
    console.log(userData);
    if (userData !== leader) {
      console.log(item._id);
      return;
    }
    setModalVisible(true);
    setSelectedUser(item);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleThemPhoNhom = async () => {
    setModalVisible(false);
    console.log("Them pho nhom", selectedUser._id);
    try {
      const response = await axios.post(`${API_URL}/api/v1/conversation/addDeputyToConversation`, {
        conversationID: conversationId,
        deputyUserID: selectedUser._id,
      });

      fetchUserData();
      Alert.alert("Thông báo", "Đã thêm nhóm phó cho thành viên thành công");
    } catch (error) {
      console.error("Error:", error.response.data);
      Alert.alert("Error", "Failed to remove deputy from conversation. Please try again.");
    }
  };
  const handleXoaPhoNhom = async () => {
    setModalVisible(false);
    console.log("xoa pho nhom", selectedUser._id);
    try {
      const response = await axios.post(`${API_URL}/api/v1/conversation/removeDeputyFromConversation`, {
        conversationID: conversationId,
        deputyUserID: selectedUser._id,
      });

      fetchUserData();
      Alert.alert("Thông báo", "Đã xóa vai trò phó nhóm của thành viên thành công");
    } catch (error) {
      console.error("Error:", error.response.data);
      Alert.alert("Error", "Failed to remove deputy from conversation. Please try again.");
    }
  };
  const handleXoaThanhVien = async () => {
    console.log("xoa thanh vien", selectedUser._id);
    setModalVisible(false);
    try {
      const response = await axios.post(`${API_URL}/api/v1/conversation/leaveConversation`, {
        conversationID: conversationId,
        userID: selectedUser._id,
      });

      fetchUserData();
      Alert.alert("Thông báo", `Đã xóa thành viên ${selectedUser.name} khỏi nhóm thành công`);
    } catch (error) {
      console.error("Error:", error.response.data);
      Alert.alert("Error", "Failed to remove deputy from conversation. Please try again.");
    }
  };
  const handleChuyenNhomTruong = async () => {
    console.log("chuyen nhom truong", selectedUser._id);
    setModalVisible(false);
    try {
      const response = await axios.post(`${API_URL}/api/v1/conversation/selectNewLeader`, {
        conversationID: conversationId,
        newLeaderUserID: selectedUser._id,
      });

      fetchUserData();
      Alert.alert("Thông báo", `Chuyển trưởng nhóm đến ${selectedUser.name} thành công`);
    } catch (error) {
      console.error("Error:", error.response.data);
      Alert.alert("Error", "Failed to remove deputy from conversation. Please try again.");
    }
  };
  const handleGiaiTanNhom = async () => {
    setModalVisible(false);
    try {
      Alert.alert("Thông báo", "Bạn có chắc chắn muốn giải tán nhóm?", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const response = await axios.post(`${API_URL}/api/v1/conversation/deleteConversationById/${conversationId}`);
            console.log("Giai tan nhom thanh cong");
            Alert.alert("Thông báo", "Đã giải tán nhóm thành công");
            navigation.navigate("Tabs");
          },
        },
      ]);
    } catch (error) {
      console.error("Error:", error.response.data);
      Alert.alert("Error", "Failed. Please try again.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.container_thanhvien}>
      <TouchableOpacity style={styles.thanhvien} onPress={() => handleChonThanhVien(item)}>
        <Image source={{ uri: item.avatar }} style={{ width: 48, height: 48, borderRadius: 48 }} />
        <View style={{ flexDirection: "column", paddingLeft: 15 }}>
          <Text style={styles.content_4}>{item.name}</Text>
          <Text style={styles.content_6}>
            {item._id === leader ? "Trưởng nhóm" : deputies.includes(item._id) ? "Phó nhóm" : "Thành viên"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header_view}>
        <Text style={styles.text_thanhvien}>Thành viên ({users.length})</Text>
      </View>
      <FlatList data={users} renderItem={renderItem} keyExtractor={(item) => item._id} />
      <Modal
        style={styles.modalContainer}
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        backdropOpacity={0.5}
        animationIn="fadeInUp"
        animationOut="fadeOutDown">
        <View style={styles.modalContent}>
          <View style={styles.headerModal}>
            <Text style={[{ paddingLeft: 110 }, styles.content_5]}>Thông tin thành viên</Text>
            <TouchableOpacity onPress={toggleModal}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ borderWidth: 0.5, borderColor: "#E4E4E4" }} />
          <View style={styles.modal_user}>
            <Image source={{ uri: selectedUser?.avatar }} style={{ width: 50, height: 50, borderRadius: 50, marginRight: 15 }} />
            <Text style={styles.content_1}>{selectedUser?.name}</Text>
          </View>
          <View style={styles.user_container}>
            <Text style={styles.content_2}>Xem thông tin cá nhân</Text>
            {selectedUser?._id === leader && <Text style={styles.content_2}>Bạn là nhóm trưởng</Text>}
            {deputies.includes(selectedUser?._id) && (
              <TouchableOpacity onPress={handleXoaPhoNhom}>
                <Text style={styles.content_2}>Xóa vai trò phó nhóm</Text>
              </TouchableOpacity>
            )}
            {!deputies.includes(selectedUser?._id) && selectedUser?._id !== leader && (
              <TouchableOpacity onPress={handleThemPhoNhom}>
                <Text style={styles.content_2}>Bổ nhiệm vai trò phó nhóm</Text>
              </TouchableOpacity>
            )}
            {selectedUser?._id !== leader && (
              <TouchableOpacity onPress={handleChuyenNhomTruong}>
                <Text style={[styles.content_2, { color: "green" }]}>Bổ nhiệm vai trò trưởng nhóm</Text>
              </TouchableOpacity>
            )}
            {selectedUser?._id === leader && (
              <TouchableOpacity onPress={handleGiaiTanNhom}>
                <Text style={[styles.content_2, { color: "red" }]}>Giải tán nhóm</Text>
              </TouchableOpacity>
            )}
            {selectedUser?._id !== leader && (
              <TouchableOpacity onPress={handleXoaThanhVien}>
                <Text style={[styles.content_2, { color: "red" }]}>Xóa khỏi nhóm</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container_thanhvien: {
    // backgroundColor: "green",
  },
  thanhvien: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 15,
  },
  modalContainer: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContent: {
    width: Dimensions.get("window").width,
    height: 380,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
  },
  headerModal: {
    padding: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "green",
  },
  modal_user: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    paddingLeft: 20,
  },
  user_container: {
    paddingTop: 20,
    paddingLeft: 20,
  },
  content_1: {
    fontSize: 18,
    fontWeight: "500",
  },
  content_2: {
    fontSize: 17,
    fontWeight: "400",
    paddingVertical: 12,
  },
  content_3: {
    fontSize: 14,
    fontWeight: "300",
  },
  content_4: {
    fontSize: 16,
    fontWeight: "500",
  },
  content_5: {
    fontSize: 17,
    fontWeight: "400",
  },
  content_6: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "400",
    color: "gray",
  },
  text_thanhvien: {
    color: "#0091FF",
    fontSize: 14,
    fontWeight: "500",
  },
  header_view: {
    padding: 10,
  },
});
