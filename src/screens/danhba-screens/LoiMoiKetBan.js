import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, Alert } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { API_URL } from "@env";

export default function LoiMoiKetBan({ route }) {
  const { ID } = route.params;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userInfosRequest, setuserInfosRequest] = useState({});
  const [friendRecived, setfriendRecived] = useState([]);
  const [userInfosRecived, setuserInfosRecived] = useState({});
  const onChange = (event) => {
    setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
  };

  useEffect(() => {
    fetchDataFriendRequests();
  }, []);
  useEffect(() => {
    fetchDataFriendRecived();
  }, []);

  const fetchDataFriendRequests = async () => {
    try {
      // Lấy danh sách lời mời kết bạn
      const friendRequestResponse = await fetch(`${API_URL}/api/v1/users/getfriendRequest/${ID}`);
      const friendRequestData = await friendRequestResponse.json();
      setFriendRequests(friendRequestData);
      // Lấy thông tin người dùng cho mỗi yêu cầu kết bạn
      const userInfoPromises = friendRequestData.map(async (request) => {
        const userId = request._id;
        const userInfoResponse = await fetch(`${API_URL}/api/v1/users/${userId}`);
        return await userInfoResponse.json();
      });
      const userInfosRequestData = await Promise.all(userInfoPromises);
      setuserInfosRequest(userInfosRequestData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDataFriendRecived = async () => {
    try {
      // Lấy danh sách lời mời kết bạn
      const friendRecivedResponse = await fetch(`${API_URL}/api/v1/users/getfriendRecived/${ID}`);
      const friendRecivedData = await friendRecivedResponse.json();
      setfriendRecived(friendRecivedData);

      // Lấy thông tin người dùng cho mỗi yêu cầu kết bạn
      const userInfoPromises = friendRecivedData.map(async (request) => {
        const userId = request._id;
        const userInfoResponse = await fetch(`${API_URL}/api/v1/users/${userId}`);
        return await userInfoResponse.json();
      });
      const userInfosRecivedData = await Promise.all(userInfoPromises);
      setuserInfosRecived(userInfosRecivedData);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItemRequest = ({ item, index }) => (
    <View style={{ borderBottomWidth: 2, padding: 10, borderColor: "#EAEAEA", justifyContent: "space-between", width: 500 }}>
      <View style={{ flexDirection: "row" }}>
        <Image source={{ uri: userInfosRequest[index]?.avatar }} style={{ width: 60, height: 60, borderRadius: 60 }} />
        <View style={{ justifyContent: "center", marginLeft: 10 }}>
          <Text style={styles.content_1}>{userInfosRequest[index]?.name}</Text>
          <Text style={styles.content_3}>{item.date ? new Date(item.date).toLocaleString() : "N/A"}</Text>
          <Text style={styles.content_2}>{item.content}</Text>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center", paddingLeft: 40 }}>
          <TouchableOpacity style={styles.btn_thuhoi} onPress={() => handleThuHoiLoiMoi(item)}>
            <Text style={styles.content_1}>Thu hồi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleThuHoiLoiMoi = async (item) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/deleteFriendRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_sender: ID,
          id_receiver: item._id,
        }),
      });
      if (response.ok) {
        Alert.alert("Đã thu hồi lời mời kết bạn");
        fetchDataFriendRequests();
      } else {
        console.error("Failed to delete friend request");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderItemRecived = ({ item, index }) => (
    <View style={{ borderBottomWidth: 2, padding: 10, borderColor: "#EAEAEA" }}>
      {/* <Text>ID: {item._id}</Text> */}
      {/* <Text>Username: {userInfosRecived[index]?.username}</Text> */}
      <View style={{ flexDirection: "row" }}>
        <Image source={{ uri: userInfosRecived[index]?.avatar }} style={{ width: 60, height: 60, borderRadius: 60 }} />
        <View style={{ justifyContent: "center", marginLeft: 10 }}>
          <Text style={styles.content_1}>{userInfosRecived[index]?.name}</Text>
          <Text style={styles.content_3}>{item.date ? new Date(item.date).toLocaleString() : "N/A"}</Text>
          <Text style={styles.content_2}>{item.content}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingHorizontal: 25, paddingTop: 10 }}>
        <TouchableOpacity style={styles.btn_tuchoi} onPress={() => handleTuChoiLoiMoi(item)}>
          <Text style={styles.content_1}>Từ chối</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn_accept} onPress={() => handleChapNhanLoiMoi(item)}>
          <Text style={styles.content_1_blue}>Chấp nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleTuChoiLoiMoi = async (item) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/deleteFriendRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_sender: item._id,
          id_receiver: ID,
        }),
      });
      if (response.ok) {
        Alert.alert("Từ chối lời mời thành công");
        fetchDataFriendRecived();
      } else {
        console.error("Failed to delete friend request");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getMemberIdByUserId = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/member/getMemberByUserId/${userId}`);
      if (!response.ok) {
        console.log("Không tìm thấy người dùng");
        return;
      }
      const data = await response.json();
      console.log("ID người dùng:", data._id);
      return data._id;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const createConversationApp = async (memberId1, memberId2) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/conversation/createConversationApp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Name",
          type: "Direct",
          members: [memberId1, memberId2],
          leader: memberId1,
        }),
      });
      if (!response.ok) {
        console.log("Không tạo được cuộc trò chuyện");
        return;
      }
      const data = await response.json();
      console.log("ID cuộc trò chuyện:", data._id);
      return data._id;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  //Chấp nhận lời mời kết bạn
  const handleChapNhanLoiMoi = async (item) => {
    console.log(item._id);
    try {
      const response = await fetch(`${API_URL}/api/v1/users/acceptFriendRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_sender: item._id,
          id_receiver: ID,
        }),
      });
      if (response.ok) {
        Alert.alert("Chấp nhận lời mời kết bạn thành công");
        fetchDataFriendRecived();
        createConversationApp(await getMemberIdByUserId(ID), await getMemberIdByUserId(item._id));
      } else {
        console.error("Failed to delete friend request");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  let data_request = userInfosRequest.length;
  let data_recived = userInfosRecived.length;

  //VIEW 1-2
  const renderContentView = () => {
    switch (selectedIndex) {
      case 0:
        return (
          <View style={[styles.contentView, { backgroundColor: "white" }]}>
            <FlatList data={friendRecived} renderItem={renderItemRecived} keyExtractor={(item) => item._id} />
          </View>
        );
      case 1:
        return (
          <View style={[styles.contentView, { backgroundColor: "white" }]}>
            <FlatList data={friendRequests} renderItem={renderItemRequest} keyExtractor={(item) => item._id} />
          </View>
        );

      default:
        return 0;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.segmentContainer}>
        <SegmentedControl
          style={styles.segment_control}
          values={[`Đã nhận ${data_recived}`, `Đã gửi ${data_request}`]}
          selectedIndex={selectedIndex}
          onChange={onChange}
          fontStyle={{ fontSize: 16 }}
        />
      </View>
      {renderContentView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  segment_control: {
    height: Dimensions.get("window").height * 0.045,
  },
  btn_tuchoi: {
    backgroundColor: "#EAEAEA",
    paddingVertical: 5,
    width: 120,
    borderRadius: 10,
    alignItems: "center",
  },
  btn_accept: {
    backgroundColor: "#BBEFFF",
    paddingVertical: 5,
    width: 120,
    borderRadius: 10,
    alignItems: "center",
  },
  btn_thuhoi: {
    backgroundColor: "#EAEAEA",
    width: 100,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  content_2: {
    fontSize: 16,
    fontWeight: "400",
    color: "black",
  },
  content_3: {
    fontSize: 16,
    fontWeight: "400",
    color: "#7F7F7F",
  },
  content_1: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  content_1_blue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0098C8",
  },
});
