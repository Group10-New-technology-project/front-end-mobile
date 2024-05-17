import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { useIsFocused } from "@react-navigation/native";
import io from "socket.io-client";
import Modal from "react-native-modal";
import axios from "axios";

export default function TinNhanScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [conversations, setConversations] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [userID, setUserID] = useState(""); // Thêm userID
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const socketRef = useRef(null);
  const [TuiGui, setTuiGui] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [conversationId, setConversationId] = useState("");

  const convertToStandardFormat = (createdAt) => {
    const regexIso8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    if (!regexIso8601.test(createdAt)) {
      const date = new Date(createdAt);
      return date.toISOString();
    }
    return createdAt;
  };

  const fetchData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        setUserData(user);
        setUserID(user._id); // Truyền user._id cho fetchConversations sau khi lấy được dữ liệu người dùng
        await fetchConversations(user._id);
      } else {
        console.log("Không có thông tin người dùng được lưu");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };
  const sortConversationsByLastMessage = (conversations) => {
    return conversations.sort((a, b) => {
      const lastMsgTimeA = getLastMessageTime(a.messages);
      const lastMsgTimeB = getLastMessageTime(b.messages);
      return new Date(lastMsgTimeB) - new Date(lastMsgTimeA);
    });
  };

  const getLastMessageTime = (messages) => {
    if (messages.length === 0) return null;
    const lastMessage = messages[messages.length - 1];
    return lastMessage.createAt;
  };

  const fetchConversations = async (userID) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/conversation/getConversationByUserId/${userID}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        const sortedConversations = sortConversationsByLastMessage(data);
        console.log(
          "Danh sách thời gian của các cuộc trò chuyện:",
          sortedConversations.map((conversation) => getLastMessageTime(conversation.messages))
        );

        // Cập nhật state và dừng hiệu ứng loading
        setConversations(sortedConversations);
        setLoading(false);

        // Xử lý tin nhắn cuối cùng của mỗi cuộc trò chuyện
        const lastMsgs = {};
        sortedConversations.forEach((conversation) => {
          if (conversation.messages.length > 0) {
            lastMsgs[conversation._id] = conversation.messages[conversation.messages.length - 1].content;
            let check = conversation.messages[conversation.messages.length - 1].memberId.userId._id;
            if (check == userID) {
              setTuiGui("Bạn: ");
            }
            let isImage = conversation.messages[conversation.messages.length - 1].type;
            if (isImage === "image") {
              lastMsgs[conversation._id] = "Hình ảnh";
            } else if (isImage === "file") {
              lastMsgs[conversation._id] = "Tài liệu";
            } else if (isImage === "audio") {
              lastMsgs[conversation._id] = "Voice message";
            } else if (isImage === "video") {
              lastMsgs[conversation._id] = "Video";
            }
          }
        });
        // Cập nhật state cho tin nhắn cuối cùng của mỗi cuộc trò chuyện
        setLastMessages(lastMsgs);
      } else {
        console.error("Dữ liệu trả về không phải là một mảng:", data);
      }
    } catch (error) {
      console.error("Lỗi khi tải cuộc trò chuyện:", error);
    }
  };

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(`${API_URL}`);
    }
    listenToMessages();
    fetchData();
    const userId = userData._id;

    if (isFocused) {
      fetchData();
    }
    return () => {
      if (socketRef.current) {
        console.log("Ngắt kết nối socket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isFocused]);

  const listenToMessages = () => {
    socketRef.current.on("sendMessage", (message) => {
      console.log("Tin nhắn mới:", message);
      fetchData();
    });
  };
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
      return `${diffDays} ngày `;
    } else if (diffHours > 0) {
      return `${diffHours} giờ `;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} phút `;
    } else {
      return `${diffSeconds} giây `;
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
  toggleBottom = () => {
    setIsVisible(!isVisible);
  };

  const handleNhanGiu = (conversationId) => {
    console.log("CON", conversationId);
    setConversationId(conversationId);
    setIsVisible(true);
  };

  handle_deleteConver = async () => {
    const response = await axios.post(`${API_URL}/api/v1/conversation/deleteConversationById/${conversationId}`);
    const data = await response.data;
    Alert.alert("Xóa cuộc trò chuyện thành công!");
    setIsVisible(false);
    fetchData();
  };

  return (
    <View style={styles.container}>
      {loading ? ( // Kiểm tra nếu đang tải dữ liệu
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "500", color: "gray" }}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => {
            var messageTimeDiff = "";
            if (!item.messages || item.messages.length === 0) {
              console.log("Không có tin nhắn");
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
            if (item.type === "Group") {
              if (item.groupImage === "") {
                avatarUrl = "https://dyybuket.s3.ap-southeast-2.amazonaws.com/DyyDiBien.jpg";
              } else {
                avatarUrl = item.groupImage;
              }
              nameMem = item.name;
            }
            let lastMsg = "Hãy bắt đầu trò chuyện !";
            if (item.type === "Direct") {
              lastMsg = lastMessages[item._id] || "Hãy bắt đầu trò chuyện !";
            } else if (item.type === "Group") {
              lastMsg = lastMessages[item._id] || "Bạn đã trở thành thành viên của nhóm!";
            }
            const messageColor = item.seen ? "black" : "gray";
            return (
              <TouchableOpacity
                onLongPress={() => handleNhanGiu(item._id)}
                onPress={() => navigation.navigate("ChatScreen", { conversationId: item._id })}>
                <View style={styles.conversation_view}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={{ uri: avatarUrl }} style={{ width: 60, height: 60, borderRadius: 60 }} />
                    <View style={styles.section_header}>
                      <Text style={styles.text_content}>{nameMem}</Text>
                      <Text style={styles.text_message}>
                        {item.type === "Direct" && item.messages.length > 0 && item.messages[item.messages.length - 1].type != "notify"
                          ? TuiGui + truncateString(lastMsg, 35)
                          : truncateString(lastMsg, 30)}
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
      <Modal
        style={styles.modal_container}
        isVisible={isVisible}
        onSwipeComplete={toggleBottom}
        onBackdropPress={toggleBottom}
        animationIn="fadeIn"
        animationOut="fadeOut">
        <View style={styles.modal_size}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
            onPress={handle_deleteConver}>
            <Text style={styles.content_delete}>Xóa cuộc trò chuyện</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  modal_container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "FFFFFF",
  },
  modal_size: {
    backgroundColor: "white",
    borderRadius: 20,
    height: 100,
    width: 220,
  },
  content_delete: {
    fontSize: 18,
    fontWeight: "500",
    color: "red",
  },
});
