import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { useIsFocused } from "@react-navigation/native";

export default function TinNhanScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const userID = userData?._id;

  const convertToStandardFormat = (createdAt) => {
    const regexIso8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    if (!regexIso8601.test(createdAt)) {
      const date = new Date(createdAt);
      return date.toISOString();
    }
    return createdAt;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const user = JSON.parse(storedUserData);
          console.log("Thông tin người dùng đã đăng nhập:", user._id);
          setUserData(user);
          await fetchConversations(user._id);
        } else {
          console.log("Không có thông tin người dùng được lưu");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    const fetchConversations = async (userID) => {
      try {
        const response = await fetch(`${API_URL}/api/v1/conversation/getConversationByUserId/${userID}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setConversations(data);
          setLoading(false);
          const lastMsgs = {};
          data.forEach((item) => {
            if (item.messages && item.messages.length > 0) {
              lastMsgs[item._id] = item.messages[item.messages.length - 1].content;
              let isImage = item.messages[item.messages.length - 1].type;
              if (isImage === "image") {
                lastMsgs[item._id] = "Hình ảnh";
              } else if (isImage === "file") {
                lastMsgs[item._id] = "Tài liệu";
              }
            }
          });
          setLastMessages(lastMsgs);
        } else {
          console.error("Dữ liệu trả về không phải là một mảng:", data);
        }
      } catch (error) {
        console.error("Lỗi khi tải cuộc trò chuyện:", error);
      }
    };

    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const truncateString = (str, maxLength) => {
    return str.length > maxLength ? str.slice(0, maxLength - 3) + "..." : str;
  };

  const calculateTimeDiff = (createdAt) => {
    const currentTime = new Date();
    const messageTime = new Date(createdAt);
    const diffTime = Math.abs(currentTime.getTime() - messageTime.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

    if (diffDays > 0) {
      return `${diffDays} days `;
    } else if (diffHours > 0) {
      return `${diffHours} hours `;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minutes `;
    } else {
      return `${diffSeconds} seconds `;
    }
  };

  const findSender = (conversation) => {
    if (conversation.type === "Direct" || conversation.type === "Group") {
      const otherUser = conversation.members.find((member) => member.userId._id !== userID);
      return otherUser ? otherUser.userId : null;
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => {
          var messageTimeDiff = "";
          if (!item.messages || item.messages.length === 0) {
            // không làm gì
          } else {
            const formattedCreatedAt = convertToStandardFormat(item.messages[item.messages.length - 1].createAt);
            messageTimeDiff = calculateTimeDiff(formattedCreatedAt);
          }
          let avatarUrl = "";
          let nameMem = "loading";
          const sender = findSender(item);
          if (sender) {
            avatarUrl = sender.avatar;
            nameMem = sender.name;
          }
          const lastMsg = lastMessages[item._id] || "Các bạn đã trở thành bạn bè!";
          const messageColor = item.seen ? "black" : "gray";
          return (
            <TouchableOpacity onPress={() => navigation.navigate("ChatScreen", { conversationId: item._id })}>
              <View style={styles.conversation_view}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image source={{ uri: avatarUrl }} style={{ width: 60, height: 60, borderRadius: 60 }} />
                  <View style={styles.section_header}>
                    <Text style={styles.text_content}>{nameMem}</Text>
                    <Text style={styles.text_message}>
                      {sender._id != userID ? "Bạn: " + truncateString(lastMsg, 35) : truncateString(lastMsg, 35)}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: messageColor, paddingLeft: 30, fontSize: 15 }}>{messageTimeDiff}</Text>
              </View>
              <View style={{ borderWidth: 0.5, borderColor: "#DBDBDB" }} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text_name: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },
  text_content: {
    fontSize: 17,
    fontWeight: "400",
  },
  text_message: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: "400",
    color: "gray",
  },
  section_header: {
    paddingLeft: 15,
  },
  conversation_view: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});
