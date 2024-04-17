import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, Dimensions, Alert } from "react-native";
import { API_URL } from "@env";
import { Checkbox } from "expo-checkbox";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

export default function ThemThanhVienVaoNhieuNhom({ navigation, route }) {
  const { userFriendId, name } = route.params;
  const [conversations, setConversations] = useState([]);
  const [arrayConverstation, setArrayConverstation] = useState([]);
  const [arrayNewCovertation, setArrayNewCovertation] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    fetchDataUserLogin();
    fetchArrayCovner();
  }, []);

  useEffect(() => {
    console.log("NewArrayConver:", arrayNewCovertation);
  }, [arrayNewCovertation]);

  const fetchDataUserLogin = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        console.log("Đã lấy id của người dùng:", user._id);
        fetchData(user._id);
      } else {
        console.log("Không có thông tin người dùng được lưu");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const fetchData = async (userID) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/conversation/getConversationByUserId/${userID}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        const groupConversations = data.filter((item) => item.type === "Group");
        setConversations(groupConversations);
      } else {
        console.error("Dữ liệu trả về không phải là một mảng:", data);
      }
    } catch (error) {
      console.error("Lỗi khi tải cuộc trò chuyện:", error);
    }
  };

  const fetchArrayCovner = async () => {
    console.log("userFriendId:", userFriendId);
    try {
      const response = await axios.get(`${API_URL}/api/v1/conversation/getArrayConversationUsersByUser/${userFriendId}`);
      setArrayConverstation(response.data);
      console.log("arrayConverstation:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addUserToArrayConver = async () => {
    console.log("arrayConverstation:", arrayNewCovertation);
    console.log("user:", userFriendId);
    if (arrayNewCovertation.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất 1 nhóm để thêm thành viên");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/v1/conversation/addUserToArrayConversation`, {
        userID: userFriendId,
        arrayConversationID: arrayNewCovertation,
      });
      console.log("response:", response.data);
      Alert.alert("Thông báo", "Thêm thành viên mới vào nhóm thành công");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const handleCheckBox = (id) => {
    setIsChecked(true);
    if (arrayConverstation.includes(id)) return;
    const index = arrayNewCovertation.indexOf(id);
    if (index !== -1) {
      const newArray = [...arrayNewCovertation];
      newArray.splice(index, 1);
      setArrayNewCovertation(newArray);
    } else {
      setArrayNewCovertation([...arrayNewCovertation, id]);
    }
  };

  const handleTaoNhomWith = () => {
    console.log("userFriendId:", userFriendId);
  };

  const renderItem = ({ item }) => {
    const isChecked = arrayNewCovertation.includes(item._id) || arrayConverstation.includes(item._id);
    const isDimmed = arrayConverstation.includes(item._id);
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
            <Image source={{ uri: item.groupImage }} style={{ width: 50, height: 50, borderRadius: 50 }} />
            <View style={{ flexDirection: "column", paddingLeft: 15 }}>
              <Text style={styles.content_1}>{item.name}</Text>
              <Text style={styles.content_2}>{isDimmed ? "Đã tham gia" : "Chưa tham gia"}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", paddingVertical: 12 }}>
        <TextInput style={styles.input_search} placeholder="Nhập tên nhóm" placeholderTextColor="gray" />
      </View>
      <TouchableOpacity
        onPress={handleTaoNhomWith}
        style={{ flexDirection: "row", alignItems: "center", paddingLeft: 14, paddingBottom: 15, paddingTop: 10 }}>
        <AntDesign name="addusergroup" size={24} color="#0091FF" />
        <Text style={styles.content_4}>Tạo nhóm với {name}</Text>
      </TouchableOpacity>
      <View style={{ height: 8, backgroundColor: "#EBEBEB" }} />
      <View style={{ padding: 5 }}>
        <Text style={{ fontSize: 14, fontWeight: "500" }}>Nhóm trò chuyện</Text>
      </View>
      <View style={styles.list_friends}>
        <FlatList data={conversations} renderItem={renderItem} keyExtractor={(item) => item._id} />
      </View>
      {isChecked && (
        <View style={{ height: 50, justifyContent: "center", paddingHorizontal: 20 }}>
          <Text style={styles.content_3}>Đã chọn: {arrayNewCovertation.length}</Text>
        </View>
      )}
      {isChecked && (
        <TouchableOpacity style={styles.btn_continue} onPress={addUserToArrayConver}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>Thêm vào nhóm</Text>
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
    height: Dimensions.get("window").height * 0.6,
    // backgroundColor: "green",
  },
  content_1: {
    fontSize: 17,
    fontWeight: "500",
  },
  content_4: {
    fontSize: 17,
    fontWeight: "400",
    paddingLeft: 10,
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
