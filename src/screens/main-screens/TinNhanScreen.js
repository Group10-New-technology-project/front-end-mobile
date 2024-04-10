import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TinNhanScreen({ navigation }) {
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
          console.log("Thông tin người dùng đã đăng nhập:", user);
          setUserData(user);
        } else {
          console.log("Không có thông tin người dùng được lưu");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (!userID) return;

        const response = await fetch(`http://192.168.99.218:3000/api/v1/conversation/getConversationByUserId/${userID}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setConversations(data);
          setLoading(false);

          const lastMsgs = {};
          data.forEach((item) => {
            if (item.messages && item.messages.length > 0) {
              lastMsgs[item._id] = item.messages[item.messages.length - 1].content;
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

    fetchConversations();
  }, [userID]);

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
    if (conversation.type === "Direct") {
      const otherUser = conversation.members.find((member) => member.userId._id !== userID);
      return otherUser ? otherUser.userId : null;
    } else {
      // Implement logic for finding sender in group conversation if needed

      return null;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => {
          if (!item.messages || item.messages.length === 0) {
            return null;
          }

          const formattedCreatedAt = convertToStandardFormat(item.messages[item.messages.length - 1].createAt);
          const messageTimeDiff = calculateTimeDiff(formattedCreatedAt);
          console.log("Thời gian 2:", formattedCreatedAt);
          let avatarUrl = "";
          let nameMem = "loading";

          const sender = findSender(item);
          if (sender) {
            avatarUrl = sender.avatar;
            nameMem = sender.name;
          }

          const lastMsg = lastMessages[item._id] || "";
          const messageColor = item.seen ? "#555" : "#000";

          return (
            <TouchableOpacity style={styles.cssMessage} onPress={() => navigation.navigate("ChatScreen", { conversationId: item._id })}>
              <Image source={{ uri: avatarUrl }} style={{ width: 50, height: 50, borderRadius: 50 }} />
              <View style={styles.section_header}>
                <Text>{nameMem}</Text>
                <Text style={styles.text_message}>
                  {sender && sender._id === userID ? "Bạn: " + truncateString(lastMsg, 35) : truncateString(lastMsg, 35)}
                </Text>
              </View>
              <Text style={{ color: messageColor, padding: 5 }}>{messageTimeDiff}</Text>
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
  },
  cssMessage: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    padding: 10,
  },
  section_header: {
    flex: 1,
    paddingLeft: 10,
  },
  text_name: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },
  text_message: {
    fontSize: 17,
    color: "#000",
    paddingTop: 5,
  },
});
