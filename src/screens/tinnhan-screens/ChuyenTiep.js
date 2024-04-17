import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from "react-native";
import {
  AntDesign,
  Ionicons,
  Entypo,
  MaterialIcons,
  FontAwesome6,
  FontAwesome,
  MaterialCommunityIcons,
  EvilIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, S3_BUCKET_NAME, API_URL } from "@env";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { S3 } from "aws-sdk";
import io from "socket.io-client";

export default function ChuyenTiep({ route }) {
  const navigation = useNavigation();
  const { message, memberId, userID } = route.params;
  const handleBack = () => {
    navigation.goBack();
  };
  const [conversations, setConversations] = useState([]); // State chứa danh sách cuộc trò chuyện
  const [isCircleSelected, setIsCircleSelected] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const socketRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  console.log("message", message);
  console.log("memberId", memberId);
  console.log("userId", userID);

  // data conversation
  const fetchConversations = async (userID) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/conversation/getConversationByUserId/${userID}`);
      const data = await response.json();
      console.log("Dữ liệu cuộc trò chuyện:", data);
      if (Array.isArray(data)) {
        setConversations(data);
      } else {
        console.error("Dữ liệu trả về không phải là một mảng:", data);
      }
    } catch (error) {
      console.error("Lỗi khi tải cuộc trò chuyện:", error);
    }
  };

  useEffect(() => {
    fetchConversations(userID);
  }, []);

  console.log("conversations", conversations);

  const findSender = (conversations) => {
    if (conversations.type === "Direct" || conversations.type === "Group") {
      const otherUser = conversations.members.find((member) => member.userId._id !== userID);
      return otherUser ? otherUser.userId : null;
    } else {
      return null;
    }
  };

  const handleConversationPress = (conversationId) => {
    setSelectedConversationId(conversationId);
  };
  //Xử lý tin nhắn
  // Socket

  const listenToMessages = () => {
    socketRef.current.on("message", (message) => {
      console.log("Tin nhắn mới:", message);
    });

    const joinRoom = () => {
      socketRef.current.emit("joinRoom", { roomId: selectedConversationId, userId: "1111" });
    };

    useEffect(() => {
      if (!socketRef.current) {
        socketRef.current = io(`${API_URL}`);
      }
      listenToMessages();
      joinRoom();
      return () => {
        if (socketRef.current) {
          console.log("Ngắt kết nối socket");
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }, []);
  };

  // Ảnh
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

  // file
  const uploadFileToS3 = async (fileUri, name) => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const currentTime = new Date();
      const formattedTime = currentTime.toISOString().slice(0, 19).replace(/[-T:]/g, "");
      const milliseconds = currentTime.getMilliseconds();
      const fileName = `${name}_File_${formattedTime}_${milliseconds}`;
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
      console.error("Error uploading file", error);
      throw error;
    }
  };
  const getFileTypeIcon = (fileExtension) => {
    let fileTypeIcon;
    const phanMoRong = renderPhanDuoi(fileExtension);
    // console.log("Phần mở rộng", phanMoRong);
    switch (phanMoRong) {
      case "doc":
      case "docx":
        fileTypeIcon = <AntDesign name="wordfile1" size={50} color="blue" />;
        break;
      case "pdf":
        fileTypeIcon = <AntDesign name="pdffile1" size={50} color="#F38A02" />;
        break;
      case "xls":
      case "xlsx":
        fileTypeIcon = <MaterialCommunityIcons name="file-excel-outline" size={24} color="black" />;
        break;
      // Thêm các trường hợp khác ở đây tùy theo nhu cầu
      default:
        fileTypeIcon = <MaterialCommunityIcons name="file-outline" size={24} color="black" />;
        break;
    }
    return fileTypeIcon;
  };

  const renderPhanDuoi = (filePath) => {
    // Tìm vị trí của dấu `_` trong đường dẫn file
    const underscoreIndex = filePath.indexOf("_");
    // Kiểm tra xem có dấu "_" không
    if (underscoreIndex !== -1) {
      // Lấy phần từ từ đầu đến vị trí của dấu `_`
      const fileNameWithExtension = filePath.substring(0, underscoreIndex);

      // Xóa phần mở rộng và 10 ký tự đầu
      const fileNameWithoutPrefix = fileNameWithExtension.slice(50, -5);

      // Tìm vị trí của dấu `.`, đánh dấu phần mở rộng của tệp
      const dotIndex = fileNameWithExtension.lastIndexOf(".");

      // Kiểm tra xem có dấu "." không
      if (dotIndex !== -1) {
        // Lấy phần từ từ đầu đến vị trí của dấu `.`
        const fileName = fileNameWithoutPrefix.substring(0, dotIndex);
        // Lấy phần mở rộng của tệp từ vị trí dấu `.`
        const fileExtension = fileNameWithExtension.substring(dotIndex + 1);
        // Hiển thị phần tên tệp kèm phần mở rộng
        return fileExtension;
      }
    }

    // Trả về null nếu không tìm thấy dấu "_" hoặc "."
    return null;
  };

  const renderFile = (filePath) => {
    // Tìm vị trí của dấu `_` trong đường dẫn file
    const underscoreIndex = filePath.indexOf("_");

    // Kiểm tra xem có dấu "_" không
    if (underscoreIndex !== -1) {
      // Lấy phần từ từ đầu đến vị trí của dấu `_`
      const fileNameWithExtension = filePath.substring(0, underscoreIndex);

      // Xóa phần mở rộng và 10 ký tự đầu
      const fileNameWithoutPrefix = fileNameWithExtension.slice(50, -5);

      // Tìm vị trí của dấu `.`, đánh dấu phần mở rộng của tệp
      const dotIndex = fileNameWithExtension.lastIndexOf(".");

      // Kiểm tra xem có dấu "." không
      if (dotIndex !== -1) {
        // Lấy phần từ từ đầu đến vị trí của dấu `.`
        const fileName = fileNameWithoutPrefix.substring(0, dotIndex);

        // Lấy phần mở rộng của tệp từ vị trí dấu `.`
        const fileExtension = fileNameWithExtension.substring(dotIndex + 1);

        // Hiển thị phần tên tệp kèm phần mở rộng
        return (
          <Text>
            {fileName}.{fileExtension}
          </Text>
        );
      }
    }

    // Trả về null nếu không tìm thấy dấu "_" hoặc "."
    return null;
  };
  // audio
  const sendAudioMessage = async (audioUrl) => {
    try {
      if (!socketRef.current) {
        socketRef.current = io(`${API_URL}`);
      }

      const response = await fetch(`${API_URL}/api/v1/messages/addMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: selectedConversationId,
          content: audioUrl,
          memberId: memberId,
          type: "audio",
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Tin nhắn âm thanh đã được gửi:", responseData);
        // setMessages((prevMessages) => [...prevMessages, responseData]);
        if (socketRef.current) {
          socketRef.current.emit("message", { message: audioUrl, room: selectedConversationId });
          listenToMessages();
        }
      } else {
        console.error("Lỗi khi gửi tin nhắn âm thanh:", responseData);
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn âm thanh:", error);
    } finally {
    }
  };

  // Hàm gửi tin nhắn
  const sendMessage = async () => {
    console.log("Tin nhắn", message.content);
    try {
      if (message.type === "audio") {
        sendAudioMessage(message.content);
        navigation.goBack();
        return;
      }
      let fileUrl = "";
      let imageUrls = [];
      if (message.type === "image") {
        if (Array.isArray(message.content)) {
          imageUrls = await Promise.all(message.content.map(uploadImageToS3));
        } else {
          // Nếu message.content không phải là mảng, coi nó như một URL ảnh đơn và tải lên S3
          imageUrls = [await uploadImageToS3(message.content)];
        }
      } else if (message.type === "file") {
        fileUrl = message.content;
      }
      let messageType = "text";
      let messageContent = message.content;
      if (imageUrls.length > 0) {
        messageType = "image";
        messageContent = imageUrls.join(", ");
      }
      if (fileUrl) {
        messageType = "file";
        messageContent = fileUrl;
      }
      console.log("Nội dung", messageContent);
      console.log("ID", selectedConversationId);
      console.log("MemberID", memberId);
      console.log("Type", messageType);
      if (!socketRef.current) {
        socketRef.current = io(`${API_URL}`);
      }
      const response = await fetch(`${API_URL}/api/v1/messages/addMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: selectedConversationId,
          content: messageContent,
          memberId: memberId,
          type: messageType,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Tin nhắn đã được gửi:", responseData);
        navigation.goBack();
        setSelectedImages([]);
        if (socketRef.current) {
          socketRef.current.emit("message", { message: messageContent, room: selectedConversationId });
        }
      } else {
        console.error("Lỗi khi gửi tin nhắn:", responseData);
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    } finally {
    }
  };

  //render content for type message
  const renderMessageContent = () => {
    // neu co memberId trong message.deleteMembers thi khong hien thi message
    if (message.type === "image") {
      const imageUrls = message.content.split(", ");
      return imageUrls.map((imageUrl, index) => (
        <Image key={index} source={{ uri: imageUrl }} resizeMode="contain" style={{ width: 150, height: 150 }} />
      ));
    } else if (message.type === "file") {
      const fileExtension = message.content;
      return (
        <View style={styles.fileContainer}>
          {getFileTypeIcon(fileExtension)}
          <TouchableOpacity onPress={() => openFile(message.content)}>
            <Text style={styles.fileName}>{renderFile(message.content)}</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (message.type === "audio") {
      return (
        <View style={styles.audioContainer}>
          <TouchableOpacity style={{ flexDirection: "row", padding: 10 }} onPress={() => playAudio(message.content)}>
            <FontAwesome name="file-audio-o" size={24} color="black" />
            <Text style={styles.audioText}>Voice message</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <Text style={styles.textContent}>{message.content.length > 50 ? `${message.content.substring(0, 50)}...` : message.content}</Text>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Phần tiêu đề và nút trở về */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <EvilIcons name="search" size={24} color="black" />
        <TextInput style={styles.searchInput} placeholder="Search..." />
      </View>
      {/* Phần nội dung */}
      <View style={styles.content}>
        <Text>Cuộc trò chuyện gần đây</Text>
      </View>

      <View style={styles.render}>
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => {
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
            return (
              <TouchableOpacity>
                <View style={styles.conversation_view}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Entypo
                      name="circle"
                      size={24}
                      color={selectedConversationId === item._id ? "blue" : "gray"}
                      style={styles.btnChoice}
                      onPress={() => handleConversationPress(item._id)} // Gọi hàm handleConversationPress khi icon được nhấn
                    />
                    <Image source={{ uri: avatarUrl }} style={{ width: 60, height: 60, borderRadius: 60 }} />
                    <View style={styles.section_header}>
                      <Text style={styles.textContent}>{nameMem}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ borderWidth: 0.5, borderColor: "#DBDBDB" }} />
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={styles.ContentMessage}>
        {renderMessageContent()}
        <TouchableOpacity style={styles.btnSend} onPress={() => sendMessage()}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    marginTop: 30,
  },
  backButton: {
    paddingRight: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    // paddingHorizontal: 12,
    width: "90%",
    alignSelf: "center",
    marginVertical: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  content: {
    justifyContent: "flex-start", // Căn trái
    alignItems: "flex-start", // Căn trái
    alignSelf: "flex-start", // Căn trái
    width: "90%", // Đảm bảo nội dung không quá rộng
    marginLeft: "5%", //
  },
  messageText: {
    fontSize: 16,
    marginBottom: 20,
  },
  ContentMessage: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 40, // Giảm padding từ 50 xuống 20
    paddingHorizontal: 20, // Thêm paddingHorizontal để căn đều các thành phần
    borderRadius: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    justifyContent: "space-between", // Căn đều các thành phần ra hai bên
    alignItems: "center",
  },
  btnSend: {
    width: 60,
    height: 60,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  render: {
    flex: 1,
    marginTop: 20,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  itemName: {
    fontSize: 18,
  },
  conversation_view: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  section_header: {
    paddingLeft: 15,
  },
  btnChoice: {
    paddingRight: 10,
  },
  textContent: {
    fontSize: 16,
    color: "black",
    fontWeight: "400",
    // nếu dài quá thì để dấu ...
    width: 250,
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  audioText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
