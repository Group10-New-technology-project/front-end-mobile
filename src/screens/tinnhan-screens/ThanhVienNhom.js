import { useEffect } from "react";
import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Alert } from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";

export default function ThanhVienNhom({ route, navigation }) {
  const { conversationId } = route.params;
  const [users, setUsers] = useState([]);
  const [leader, setLeader] = useState(null);
  const [deputies, setDeputies] = useState([]);
  const socketRef = useRef(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisiblePhoNhom, setModalVisiblePhoNhom] = useState(false);
  const [isModalVisibleThanhVien, setModalVisibleThanhVien] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [memberId, setmemberId] = useState(null);
  const [myName, setMyName] = useState(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(`${API_URL}`);
    }
    fetchUserData();
    fetchDataUserLogin();
    return () => {
      if (socketRef.current) {
        console.log("Ngắt kết nối socket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleChonThanhVien = (item) => {
    setSelectedUser(item);
    // setModalVisible(!isModalVisible); // full quyền
    if (deputies.includes(userData)) {
      console.log("Bạn là phó nhóm");
      setModalVisiblePhoNhom(true);
    } else if (userData === leader) {
      console.log("bạn là trưởng nhóm");
      setModalVisible(true);
    } else {
      console.log("bạn là thành viên");
      setModalVisibleThanhVien(true);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleModal2 = () => {
    setModalVisiblePhoNhom(!isModalVisiblePhoNhom);
  };
  const toggleModal3 = () => {
    setModalVisibleThanhVien(!isModalVisibleThanhVien);
  };

  const fetchDataUserLogin = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        console.log("Thông tin người dùng đã đăng nhập:", user._id);
        setUserData(user._id);
        setMyName(user.name);
        fetchMemberId(user._id);
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
        const leaderUsers = response.data.leader?.userId; //Trả về trưởng nhóm
        const leaderUsersIDList = response.data.deputy?.map((deputy) => deputy.userId); //Trả về mảng các phó nhóm
        const leaderUsersID = response.data.deputy?.map((deputy) => deputy.userId._id); //Trả về mảng các id phó nhóm
        setLeader(leaderUsers._id);
        const memberUsers = response.data.members.map((member) => member.userId);
        //Sắp xếp lại mảng thành viên để trưởng nhóm lên đầu tiên tiếp theo là các phó nhóm
        leaderUsersIDList.forEach((deputy) => {
          const deputyIndex = memberUsers.findIndex((member) => member._id === deputy._id);
          if (deputyIndex !== -1) {
            memberUsers.splice(deputyIndex, 1);
            memberUsers.unshift(deputy);
          }
        });
        const leaderIndex = memberUsers.findIndex((member) => member._id === leaderUsers._id);
        if (leaderIndex !== -1) {
          memberUsers.splice(leaderIndex, 1);
          memberUsers.unshift(leaderUsers);
        }
        setUsers(memberUsers);
        setDeputies(leaderUsersID);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleThemPhoNhom = async () => {
    setModalVisible(false);
    console.log("Them pho nhom", selectedUser._id);
    try {
      const response = await axios.post(`${API_URL}/api/v1/conversation/addDeputyToConversation`, {
        conversationID: conversationId,
        deputyUserID: selectedUser._id,
      });
      console.log("selectedUser:", selectedUser);
      const response1 = await axios.post(`${API_URL}/api/v1/messages/addMessageWeb`, {
        conversationId: conversationId,
        content: `${myName.slice(myName.lastIndexOf(" ") + 1)} đã bầu ${selectedUser.name.split(" ").slice(-1)[0]} làm phó nhóm.`,
        memberId: memberId,
        type: "notify",
      });
      socketRef.current.emit("sendMessage", { message: "messageContent", room: conversationId });
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
      const response1 = await axios.post(`${API_URL}/api/v1/messages/addMessageWeb`, {
        conversationId: conversationId,
        content: `${myName.slice(myName.lastIndexOf(" ") + 1)} đã xóa vai trò phó nhóm của ${selectedUser.name.split(" ").slice(-1)[0]}.`,
        memberId: memberId,
        type: "notify",
      });
      socketRef.current.emit("sendMessage", { message: "messageContent", room: conversationId });
      fetchUserData();
      Alert.alert("Thông báo", "Đã xóa vai trò phó nhóm của thành viên thành công");
    } catch (error) {
      console.error("Error:", error.response.data);
      Alert.alert("Error", "Failed to remove deputy from conversation. Please try again.");
    }
  };
  const handleXoaThanhVien = async () => {
    setModalVisible(false);
    try {
      const response = await axios.post(`${API_URL}/api/v1/conversation/leaveConversation`, {
        conversationID: conversationId,
        userID: selectedUser._id,
      });
      fetchUserData();
      fetchMessagesNotify(selectedUser.name);
      socketRef.current.emit("sendMessage", { message: "messageContent", room: conversationId });
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
      const response1 = await axios.post(`${API_URL}/api/v1/messages/addMessageWeb`, {
        conversationId: conversationId,
        content: `${myName.slice(myName.lastIndexOf(" ") + 1)} đã chuyển vai trò trưởng nhóm cho ${
          selectedUser.name.split(" ").slice(-1)[0]
        }.`,
        memberId: memberId,
        type: "notify",
      });
      socketRef.current.emit("sendMessage", { message: "messageContent", room: conversationId });
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
            Alert.alert("Thông báo", "Đã giải tán nhóm thành công");
            socketRef.current.emit("sendMessage", { message: conversationId, room: conversationId });
            navigation.navigate("Tabs");
          },
        },
      ]);
    } catch (error) {
      console.error("Error:", error.response.data);
      Alert.alert("Error", "Failed. Please try again.");
    }
  };

  const fetchMemberId = async (userID) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/member/getMemberByUserId/${userID}`);
      const data = response.data._id;
      setmemberId(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchMessagesNotify = async (nameUser) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/messages/addMessageWeb`, {
        conversationId: conversationId,
        content: `${myName.slice(myName.lastIndexOf(" ") + 1)} đã đuổi ${nameUser.slice(nameUser.lastIndexOf(" ") + 1)} khỏi nhóm`,
        memberId: memberId,
        type: "notify",
      });
      socketRef.current.emit("sendMessage", { message: conversationId, room: conversationId });
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const handleViewProfile = () => {
    navigation.navigate("XemTrangCaNhan", { user_id: selectedUser._id });
    setModalVisible(false);
    setModalVisiblePhoNhom(false);
    setModalVisibleThanhVien(false);
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
      {/* Modal of Leader */}
      <Modal
        style={styles.modalContainer}
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        backdropOpacity={0.5}
        // swipeDirection={"down"}
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
            <TouchableOpacity onPress={handleViewProfile}>
              <Text style={styles.content_2}>Xem thông tin cá nhân</Text>
            </TouchableOpacity>
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
      {/* Modal of Pho Nhom */}
      <Modal
        style={styles.modalContainer}
        isVisible={isModalVisiblePhoNhom}
        onBackdropPress={toggleModal2}
        swipeDirection={"down"}
        backdropOpacity={0.5}
        animationIn="fadeInUp"
        animationOut="fadeOutDown">
        <View style={styles.modalContent2}>
          <View style={styles.headerModal}>
            <Text style={[{ paddingLeft: 110 }, styles.content_5]}>Thông tin thành viên</Text>
            <TouchableOpacity onPress={toggleModal2}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ borderWidth: 0.5, borderColor: "#E4E4E4" }} />
          <View style={styles.modal_user}>
            <Image source={{ uri: selectedUser?.avatar }} style={{ width: 50, height: 50, borderRadius: 50, marginRight: 15 }} />
            <Text style={styles.content_1}>{selectedUser?.name}</Text>
          </View>
          <View style={styles.user_container}>
            <TouchableOpacity onPress={handleViewProfile}>
              <Text style={styles.content_2}>Xem thông tin cá nhân</Text>
            </TouchableOpacity>
            {selectedUser?._id !== leader && !deputies.includes(selectedUser?._id) && (
              <TouchableOpacity onPress={handleXoaThanhVien}>
                <Text style={[styles.content_2, { color: "red" }]}>Xóa khỏi nhóm</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
      {/* Modal of Thanh Vien */}
      <Modal
        style={styles.modalContainer}
        isVisible={isModalVisibleThanhVien}
        onBackdropPress={toggleModal3}
        swipeDirection={"down"}
        backdropOpacity={0.5}
        animationIn="fadeInUp"
        animationOut="fadeOutDown">
        <View style={styles.modalContent3}>
          <View style={styles.headerModal}>
            <Text style={[{ paddingLeft: 110 }, styles.content_5]}>Thông tin thành viên</Text>
            <TouchableOpacity onPress={toggleModal3}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ borderWidth: 0.5, borderColor: "#E4E4E4" }} />
          <View style={styles.modal_user}>
            <Image source={{ uri: selectedUser?.avatar }} style={{ width: 50, height: 50, borderRadius: 50, marginRight: 15 }} />
            <Text style={styles.content_1}>{selectedUser?.name}</Text>
          </View>
          <View style={styles.user_container}>
            <TouchableOpacity onPress={handleViewProfile}>
              <Text style={styles.content_2}>Xem thông tin cá nhân</Text>
            </TouchableOpacity>
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
    height: 360,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
  },
  modalContent2: {
    width: Dimensions.get("window").width,
    height: 290,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
  },
  modalContent3: {
    width: Dimensions.get("window").width,
    height: 230,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
  },
  headerModal: {
    padding: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
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
