import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { useIsFocused } from "@react-navigation/native";
import { set } from "firebase/database";

export default function TinNhanScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [conversations, setConversations] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [userID, setUserID] = useState(""); // Thêm userID
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

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
          console.log("ID người dùng 1", user._id);
          setUserData(user);
          setUserID(user._id); // Truyền user._id cho fetchConversations sau khi lấy được dữ liệu người dùng
          // Truyền user._id cho fetchConversations sau khi lấy được dữ liệu người dùng
          await fetchConversations(user._id);
        } else {
          console.log("Không có thông tin người dùng được lưu");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    const userId = userData._id;

    const fetchConversations = async (userID) => {
      try {
        const response = await fetch(`${API_URL}/api/v1/conversation/getConversationByUserId/${userID}`);
        const data = await response.json();
        console.log("Dữ liệu cuộc trò chuyện:", data);
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
              } else if (isImage === "audio") {
                lastMsgs[item._id] = "Voice message";
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
  console.log("Danh sách cuộc trò chuyện:", conversations);

  return (
    <View style={styles.container}>
      {loading ? ( // Kiểm tra nếu đang tải dữ liệu
        <Text>Loading...</Text> // Hiển thị chữ "Loading..."
      ) : (
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
              console.log("Thời gian 2:", formattedCreatedAt);
            }
            let avatarUrl = "";
            let nameMem = "loading";
            const sender = findSender(item);
            if (sender) {
              avatarUrl = sender.avatar;
              nameMem = sender.name;
            }
            if (item.type === "Group") {
              if (item.groupImage === "") {
                avatarUrl = "https://dyybuket.s3.ap-southeast-2.amazonaws.com/DyyDiBien.jpg";
              } else {
                avatarUrl = item.groupImage;
              }
              nameMem = item.name;
            }
            let lastMsg = "Các bạn đã trở thành bạn bè!";
            if (item.type === "Direct") {
              lastMsg = lastMessages[item._id] || "Các bạn đã trở thành bạn bè";
            } else if (item.type === "Group") {
              lastMsg = lastMessages[item._id] || "Bạn đã trở thành thành viên của nhóm!";
            }
            const messageColor = item.seen ? "black" : "gray";
            return (
              <TouchableOpacity onPress={() => navigation.navigate("ChatScreen", { conversationId: item._id })}>
                <View style={styles.conversation_view}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={{ uri: avatarUrl }} style={{ width: 60, height: 60, borderRadius: 60 }} />
                    <View style={styles.section_header}>
                      <Text style={styles.text_content}>{nameMem}</Text>
                      <Text style={styles.text_message}>
                        {sender._id != userID ? truncateString(lastMsg, 35) : truncateString(lastMsg, 35)}
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
      )}
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
