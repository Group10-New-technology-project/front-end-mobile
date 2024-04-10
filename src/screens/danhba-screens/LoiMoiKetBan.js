import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, Alert } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { API_URL } from "@env";

export default function LoiMoiKetBan() {
  let ID = "60aae4843ae33121e0de8506";
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

  useEffect(() => {
    fetchDataFriendRecived();
  }, []);
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
    <View style={{ borderBottomWidth: 1, padding: 10, backgroundColor: "yellow" }}>
      <Text>ID: {item._id}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Content: {item.content}</Text>
      <Text>User Information:</Text>
      <Text>Username: {userInfosRequest[index]?.username}</Text>
      <Text>Name: {userInfosRequest[index]?.name}</Text>
      <TouchableOpacity onPress={() => handleThuHoiLoiMoi(item)}>
        <Text>Thu hồi</Text>
      </TouchableOpacity>
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
    <View style={{ borderBottomWidth: 1, padding: 10, backgroundColor: "green" }}>
      <Text>ID: {item._id}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Content: {item.content}</Text>
      <Text>User Information:</Text>
      <Text>Username: {userInfosRecived[index]?.username}</Text>
      <Text>Name: {userInfosRecived[index]?.name}</Text>
      <TouchableOpacity onPress={() => handleTuChoiLoiMoi(item)}>
        <Text>Từ chối</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleChapNhanLoiMoi(item)}>
        <Text>Chấp nhận</Text>
      </TouchableOpacity>
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
      fetchDataFriendRecived();
      if (response.ok) {
        Alert.alert("Từ chối lời mời thành công");
        fetchDataFriendRecived;
      } else {
        console.error("Failed to delete friend request");
      }
    } catch (error) {
      console.error("Error:", error);
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
});
