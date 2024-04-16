import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

export default function HeaderTinNhan({ conversationData1 }) {
  const conversationId = conversationData1;
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [conversationData, setConversationData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const user = JSON.parse(storedUserData);
          setUserData(user);
        } else {
          console.log("Không có thông tin người dùng được lưu");
        }

        const response = await fetch(`${API_URL}/api/v1/conversation/getConversationByIdApp/${conversationId}`);
        const data = await response.json();
        setConversationData(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  let name = "";
  let statusName = "";
  if (conversationData) {
    if (conversationData.type === "Direct") {
      const member = conversationData.members.find((member) => member.userId._id !== userData._id);
      name = member ? member.userId.name : "";
      statusName = "Vừa mới truy cập";
    } else if (conversationData.type === "Group") {
      name = conversationData.name;
      statusName = "Bấm để xem thông tin";
    }
  }

  const goThongTinNhom = () => {
    navigation.navigate("ThongTinNhom", { conversationId });
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.title_tinnhan} onPress={goThongTinNhom}>
          <Text style={styles.text_username}>{name}</Text>
          <Text style={styles.text_online}>{statusName}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity style={styles.icon_menu}>
          <Ionicons name="call-outline" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon_menu}>
          <Ionicons name="videocam-outline" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon_menu} onPress={goThongTinNhom}>
          <Ionicons name="list" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
export const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width - 40,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  title_tinnhan: {
    paddingLeft: 10,
  },
  text_username: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 18,
  },
  text_online: {
    color: "#F4F4F4",
    fontWeight: "300",
    fontSize: 13,
  },
  icon_menu: {
    marginHorizontal: 8,
  },
  icon_s22: {
    width: 22,
    height: 22,
  },
});
