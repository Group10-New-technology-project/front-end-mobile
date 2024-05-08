import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, Alert, Dimensions, ActivityIndicator } from "react-native";
import axios from "axios";
import { Checkbox } from "expo-checkbox";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";

export default function ThemNhieuThanhVienVaoMotNhom({ navigation, route }) {
  const { conversationId } = route.params;
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef(null);
  const [arrayNewFriends, setArrayNewFriends] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [arrayFriendsID, setArrayFriendsID] = useState([]);
  const [myName, setMyName] = useState("");
  const [memberId, setmemberId] = useState("");

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(`${API_URL}`);
    }
    joinRoom();
    fetchDataUserLogin();
    fetchArrayUser();
    console.log("arrayNewFriends:", arrayFriendsID);
    return () => {
      if (socketRef.current) {
        console.log("Ngắt kết nối socket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);
  const joinRoom = () => {
    socketRef.current.emit("joinRoom", { roomId: conversationId, userId: "1111" });
  };
  useEffect(() => {
    console.log("arrayNewFriends:", arrayNewFriends);
  }, [arrayNewFriends]);

  const fetchDataUserLogin = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        console.log("Đã lấy id của người dùng:", user._id);
        fetchUserData(user._id);
        setMyName(user.name);
        fetchMemberId(user._id);
      } else {
        console.log("Không có thông tin người dùng được lưu");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
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

  const fetchArrayUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/conversation/getArrayUserConversationUsers/${conversationId}`);
      console.log("response:", response.data);
      setArrayFriendsID(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchUserData = async (userData) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/users/getFriendWithDetails/${userData}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addUserToConversation = async () => {
    if (arrayNewFriends.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất 1 thành viên mới để thêm vào nhóm");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/v1/conversation/addUserToConversation`, {
        conversationID: conversationId,
        arrayUserID: arrayNewFriends,
      });
      // console.log("response:", response.data);
      fetchMessagesNotify(conversationId);
      socketRef.current.emit("sendMessage", { message: "messageContent", room: conversationId });
      Alert.alert("Thông báo", "Thêm thành viên mới vào nhóm thành công");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const fetchMessagesNotify = async (con) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/messages/addMessageWeb`, {
        conversationId: con,
        content: `${myName.slice(myName.lastIndexOf(" ") + 1)} đã thêm 1 thành viên mới`,
        memberId: memberId,
        type: "notify",
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const handleCheckBox = (id) => {
    setIsChecked(true);
    if (arrayFriendsID.includes(id)) return;
    const index = arrayNewFriends.indexOf(id);
    if (index !== -1) {
      const newArray = [...arrayNewFriends];
      newArray.splice(index, 1);
      setArrayNewFriends(newArray);
    } else {
      setArrayNewFriends([...arrayNewFriends, id]);
    }
  };

  const renderItem = ({ item }) => {
    const isChecked = arrayNewFriends.includes(item._id) || arrayFriendsID.includes(item._id);
    const isDimmed = arrayFriendsID.includes(item._id);
    const itemStyle = isDimmed ? { opacity: 0.8 } : {};

    return (
      <View style={[styles.container_listFriends, itemStyle]}>
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={() => handleCheckBox(item._id)}
          color={"#0091FF"}
          disabled={isDimmed}
        />
        <TouchableOpacity onPress={() => handleCheckBox(item._id)} disabled={isDimmed}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={{ uri: item.avatar }} style={{ width: 50, height: 50, borderRadius: 50 }} />
            <View style={{ flexDirection: "column", paddingLeft: 15 }}>
              <Text style={styles.content_1}>{item.name}</Text>
              <Text style={styles.content_2}>{isDimmed ? "Đã tham gia" : "Chưa tham gia"}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0091FF" />
        <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "400", color: "#0091FF" }}>Đang tải...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", paddingVertical: 12 }}>
        <TextInput style={styles.input_search} placeholder="Tìm tên hoặc số điện thoại" placeholderTextColor="gray" />
      </View>
      <View style={styles.list_friends}>
        <FlatList data={users} renderItem={renderItem} keyExtractor={(item) => item._id} />
      </View>
      {isChecked && (
        <View style={{ height: 50, justifyContent: "center", paddingHorizontal: 20 }}>
          <Text style={styles.content_3}>Đã chọn: {arrayNewFriends.length}</Text>
        </View>
      )}
      {isChecked && (
        <TouchableOpacity style={styles.btn_continue} onPress={addUserToConversation}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>Thêm thành viên</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container_listFriends: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 8,
  },
  input: {
    width: 300,
    fontSize: 18,
    fontWeight: "500",
    padding: 10,
  },
  input_search: {
    width: Dimensions.get("window").width - 20,
    fontSize: 16,
    fontWeight: "400",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 22,
    marginRight: 20,
    marginLeft: 10,
  },
  list_friends: {
    backgroundColor: "white",
    height: Dimensions.get("window").height * 0.68,
    // backgroundColor: "green",
  },
  content_1: {
    fontSize: 17,
    fontWeight: "500",
  },
  content_2: {
    fontSize: 14,
    fontWeight: "400",
    color: "#8F8F8F",
    marginTop: 4,
  },
  container_image: {
    alignItems: "center",
    paddingTop: 20,
  },
  image: {
    height: 55,
    width: 55,
    borderRadius: 55,
    // opacity: 1,
  },
  btn_continue: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
    height: 45,
    backgroundColor: "#0091FF",
    borderRadius: 30,
  },
  content_3: {
    fontSize: 18,
    fontWeight: "500",
    color: "#8F8F8F",
  },
});
