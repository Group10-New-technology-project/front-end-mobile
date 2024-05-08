import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, Dimensions } from "react-native";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TimKiemScreen({ route, navigation }) {
  const { searchPhone } = route.params;
  const [userLogin, setUserLogin] = useState(null);
  const ID = userLogin?._id;
  const [userData, setUserData] = useState(null);
  const isFirstRender = useRef(true);
  const [dataFriends, setDataFriends] = useState([]);

  useEffect(() => {
    fetchDataUserLogin();
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/users/username/${searchPhone}`);
        if (!response.ok) {
          console.log("Không tìm thấy người dùng");
          // Alert.alert("Không tìm thấy người dùng");
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchIds();
    fetchUserData();
  }, [searchPhone]);

  const fetchDataUserLogin = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        setUserLogin(user);
        console.log("Thông tin người dùng được lưu");
      } else {
        console.log("Không có thông tin người dùng được lưu");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const fetchIds = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/getfriend/${ID}`);
      const dataFriends = await response.json();
      console.log(`Danh sách ID bạn bè của ${ID}`);
      console.log(dataFriends);
      setDataFriends(dataFriends);
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
    }
  };

  const handleAddFriend = async () => {
    console.log("Gởi lời mời kết bạn đến " + userData._id);
    try {
      const response = await fetch(`${API_URL}/api/v1/users/addFriendRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_sender: ID,
          id_receiver: userData._id,
        }),
      });

      if (response.ok) {
        Alert.alert("Gởi lời mời kết bạn thành công đến " + userData.name);
        navigation.navigate("XemTrangCaNhan", { user_id: userData._id });
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred, please try again later");
    }
  };
  const handleViewUser = () => {
    navigation.navigate("XemTrangCaNhan", { user_id: userData._id });
  };

  return (
    <View style={styles.container}>
      {userData && (
        <View>
          {userData._id ? (
            <>
              <TouchableOpacity style={styles.userContainer} onPress={handleViewUser}>
                <View style={{ flexDirection: "row" }}>
                  <Image source={{ uri: userData.avatar }} style={{ width: 55, height: 55, borderRadius: 55 }} />
                  <View style={{ paddingLeft: 15, justifyContent: "center" }}>
                    <Text style={{ fontSize: 18, fontWeight: "500", marginBottom: 5 }}>{userData.name}</Text>
                    <Text style={{ fontSize: 16, fontWeight: 400, color: "#7F7F7F" }}>{userData.username}</Text>
                  </View>
                </View>
                <View style={{ justifyContent: "center" }}>
                  {/* {dataFriends.includes(userData._id) || userData._id === ID ? null : (
                    <TouchableOpacity style={{ paddingRight: 5 }} onPress={handleAddFriend}>
                      <Ionicons name="person-add" size={28} color="#0091FF" />
                    </TouchableOpacity>
                  )} */}
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                paddingTop: Dimensions.get("window").height * 0.4,
              }}>
              <Text style={{ fontSize: 20, fontWeight: "500", color: "gray" }}>Không tìm thấy người dùng</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
  userContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "#F7F7F7",
    padding: 20,
  },
});
