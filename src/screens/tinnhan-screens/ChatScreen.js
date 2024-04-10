import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Image, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, S3_BUCKET_NAME, API_URL } from "@env";
import { S3 } from "aws-sdk";
import io from "socket.io-client";

export default function ChatScreen({ route }) {
  const { conversationId } = route.params;
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const scrollViewRef = useRef();
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isTextInputFocused, setIsTextInputFocused] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(`${API_URL}`);
    }
    listenToMessages();
    joinRoom();
    fetchData();
    return () => {
      if (socketRef.current) {
        console.log("Ngắt kết nối socket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);
  // useEffect(() => {
  //   listenToMessages();
  //   joinRoom();
  //   fetchData();
  // }, []);

  const joinRoom = () => {
    socketRef.current.emit("joinRoom", conversationId);
  };

  const listenToMessages = () => {
    socketRef.current.on("message", (message) => {
      console.log("Tin nhắn mới:", message);
      fetchData();
    });
  };

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
      setConversation(data);
      if (data && data.messages) {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  const sendMessage = async () => {
    try {
      setIsSendingMessage(true);
      const imageUrls = await Promise.all(selectedImages.map(uploadImageToS3));
      let messageType = "text";
      let messageContent = messageText;
      if (imageUrls.length > 0) {
        messageType = "image";
        messageContent = imageUrls.join(", ");
      }
      const response = await fetch(`${API_URL}/api/v1/messages/addMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversationId,
          content: messageContent,
          memberId: findMemberId(),
          type: messageType,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Tin nhắn đã được gửi:", responseData);
        setMessages((prevMessages) => [...prevMessages, responseData]);
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
        listenToMessages();
        setMessageText("");
        setSelectedImages([]);
        socketRef.current.emit("message", { message: messageContent, room: conversationId });
      } else {
        console.error("Lỗi khi gửi tin nhắn:", responseData);
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const findMemberId = () => {
    if (!conversation || !userData) return null;
    const member = conversation.members.find((member) => member.userId._id === userData._id);
    console.log("member", member);
    return member ? member._id : null;
  };

  const selectImageFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.5,
        allowsMultipleSelection: true,
      });

      if (!pickerResult.cancelled && pickerResult.assets) {
        const selectedImageURIs = pickerResult.assets.map((asset) => asset.uri);
        setSelectedImages(selectedImageURIs);
        console.log("Các ảnh đã chọn:", selectedImageURIs);
      }
    } catch (error) {
      console.error("Lỗi khi chọn ảnh từ thư viện:", error);
    }
  };

  const isImageSelected = (imageUri) => {
    return selectedImages.includes(imageUri);
  };

  const toggleImageSelection = (imageUri) => {
    if (isImageSelected(imageUri)) {
      setSelectedImages(selectedImages.filter((uri) => uri !== imageUri));
    } else {
      setSelectedImages([...selectedImages, imageUri]);
    }
  };

  const uploadImageToS3 = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const currentTime = new Date();
      const formattedTime = currentTime.toISOString().slice(0, 19).replace(/[-T:]/g, "");
      const milliseconds = currentTime.getMilliseconds();
      const filename = imageUri.split("/").pop();
      const fileName = `IMG_${formattedTime}_${milliseconds}_${filename}`;
      const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: blob,
        ACL: "public-read",
      };

      const s3 = new S3({
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
        region: REGION,
      });

      const uploadResponse = await s3.upload(params).promise();
      console.log("Tải lên thành công", uploadResponse.Location);
      return uploadResponse.Location.toString();
    } catch (error) {
      console.error("Error uploading image", error);
      throw error;
    }
  };

  const renderImages = (content) => {
    const imageUrls = content.split(", ");
    return imageUrls.map((imageUrl, index) => <Image key={index} source={{ uri: imageUrl }} style={{ width: 100, height: 100, margin: 5 }} />);
  };

  const handleConversationClick = () => {
    // Cuộn xuống dưới cùng của FlatList khi bạn click vào cuộc trò chuyện
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, isTextInputFocused ? null : { padding: 0 }]}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 85 : 0}>
      <FlatList
        ref={scrollViewRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const isCurrentUser = item.memberId?.userId?._id === userData?._id;
          const avatar = item.memberId?.userId?.avatar;
          const messageContainerStyle = isCurrentUser ? styles.currentUserMessageContainer : styles.otherUserMessageContainer;
          const messageContentStyle = isCurrentUser ? styles.currentUserMessageContent : styles.otherUserMessageContent;

          return (
            <View style={[styles.messageContainer, messageContainerStyle]}>
              {!isCurrentUser && <Image source={{ uri: avatar }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 5 }} />}
              {item.type === "image" ? (
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{renderImages(item.content)}</View>
              ) : (
                <Text style={[styles.messageContent, messageContentStyle]}>{item.content}</Text>
              )}
            </View>
          );
        }}
      />
      {/* <View style={[styles.inputSection, !isTextInputFocused && styles.inputSectionNotFocused]}> */}
      <View style={styles.inputSection}>
        <MaterialIcons name="insert-emoticon" size={30} color="black" />
        <TextInput
          style={styles.textInput}
          placeholder="Tin Nhắn"
          value={messageText}
          onChangeText={(text) => setMessageText(text)}
          onFocus={() => setIsTextInputFocused(true)}
          onBlur={() => setIsTextInputFocused(false)}
        />
        <TouchableOpacity onPress={selectImageFromGallery}>
          <Ionicons name="image-outline" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={30} color="blue" />
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={selectedImages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleImageSelection(item)}>
            <Image
              source={{ uri: item }}
              style={{
                width: 100,
                height: 100,
                margin: 5,
                borderWidth: isImageSelected(item) ? 2 : 0,
                borderColor: "blue",
              }}
            />
          </TouchableOpacity>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#E2E9F1",
    position: "relative",
  },
  messageContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end", // Thay đổi thành flex-end
  },
  messageContent: {
    fontSize: 16,
    maxWidth: "70%",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "flex-end", // Thay đổi thành flex-end
  },
  currentUserMessageContainer: {
    justifyContent: "flex-end",
  },
  otherUserMessageContainer: {
    justifyContent: "flex-start",
  },
  currentUserMessageContent: {
    backgroundColor: "#D0F0FD",
    color: "#000",
  },
  otherUserMessageContent: {
    backgroundColor: "#fff",
    color: "black",
  },
  inputSection: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  // inputSectionNotFocused: {
  //   backgroundColor: "#fff",
  //   flexDirection: "row",
  //   alignItems: "center",
  //   paddingHorizontal: 15,
  //   paddingVertical: 5,
  //   position: "absolute",
  //   left:0,
  //   right:0,
  //   bottom:5,

  // },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
});
