import React, { useRef, useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  Button,
} from "react-native";
// import Input from "../../components/InputChat";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Ionicons, Entypo, MaterialIcons, FontAwesome6, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, S3_BUCKET_NAME, API_URL } from "@env";
import io from "socket.io-client";
import { set } from "firebase/database";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { S3 } from "aws-sdk";
import { useNavigation } from "@react-navigation/native";

const heightApp = Dimensions.get("window").height;
const widthApp = Dimensions.get("window").width;

function MessageBubble({
  setMessageRepply,
  message,
  conversation,
  userData,
  isCurrentUserMessage,
  setConversation,
  listenToMessages,
  socketRef,
  replyMessage,
}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalX, setModalX] = useState(0);
  const [modalY, setModalY] = useState(0);
  const navigation = useNavigation();

  const avatar = message.memberId?.userId?.avatar;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const openModal = (event) => {
    console.log("Open modal");
    setModalVisible(true);
    setModalX(event.nativeEvent.pageX - 150);
    setModalY(event.nativeEvent.pageY);
  };
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`; // Định dạng 'giờ:phút'
  };
  const findMemberId = () => {
    if (!conversation || !userData) return null;
    const member = conversation.members.find((member) => member.userId._id === userData._id);
    // console.log("member", member);
    return member ? member._id : null;
  };
  // play audio nè
  const playAudio = async (url) => {
    console.log("Playing audio");

    try {
      console.log("Loading Sound");
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      await sound.playAsync();
      // Optionally, you can add code to handle the playback status or save the sound object for future reference
    } catch (error) {
      console.error("Error playing audio:", error.message);
    }
  };

  // stop audio
  const stopAudio = async () => {
    console.log("Stop audio");
    try {
      await sound.stopAsync();
    } catch (error) {
      console.error("Error stopping audio:", error.message);
    }
  };

  const renderMessageContent = () => {
    // neu co memberId trong message.deleteMembers thi khong hien thi message
    const memberID = findMemberId();
    const RepMess = replyMessage;
    console.log("RepMess", RepMess);
    // console.log("ID thành viên:", memberID);
    if (message.deleteMember && message.deleteMember.length > 0) {
      for (let i = 0; i < message.deleteMember.length; i++) {
        if (message.deleteMember[i]._id === memberID) {
          console.log("ID", message.deleteMember[i]._id);
          // Nếu trùng khớp, trả về null để không hiển thị tin nhắn
          return null;
        }
      }
    } else {
      if (message.recallMessage) {
        return <Text style={styles.messageText}>Tin nhắn đã thu hồi</Text>;
      } else if (message.type === "image") {
        const imageUrls = message.content.split(", ");
        return imageUrls.map((imageUrl, index) => (
          <Image key={index} source={{ uri: imageUrl }} resizeMode="contain" style={{ width: 250, height: 250 }} />
        ));
      } else if (message.type === "audio") {
        return (
          <View style={styles.audioContainer}>
            <TouchableOpacity onPress={() => playAudio(message.content)}>
              <FontAwesome name="play" size={24} color="black" />
            </TouchableOpacity>
          </View>
        );
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
      } else {
        return <Text style={styles.messageText}>{message.content}</Text>;
      }
    }
  };

  // file
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

  const openFile = async (fileUri) => {
    try {
      await Linking.openURL(fileUri);
    } catch (error) {
      console.error("Lỗi khi mở file:", error);
    }
  };
  // xoa message
  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/messages/deleteMessage`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversation?._id,
          messageId: messageId,
          memberId: findMemberId(),
        }),
      });

      if (response.ok) {
        console.log("Tin nhắn đã được xóa thành công");
        console.log("ID tin nhắn:", messageId);
        console.log("ID cuộc trò chuyện:", conversation?._id);
        console.log("ID thành viên:", findMemberId());
        const updatedMessages = conversation.messages.filter((msg) => msg._id !== messageId);
        // Cập nhật lại conversation với danh sách tin nhắn mới
        const updatedConversation = { ...conversation, messages: updatedMessages };
        // Cập nhật lại trạng thái của conversation
        setConversation(updatedConversation);
        setModalVisible(false);

        // Bạn có thể thêm các hành động khác sau khi xóa tin nhắn thành công ở đây
      } else {
        // Trường hợp phản hồi không thành công
        console.error("Lỗi khi xóa tin nhắn:", response.statusText);
        // Bạn có thể xử lý lỗi hoặc hiển thị thông báo cho người dùng ở đây
      }
    } catch (error) {
      console.error("Lỗi khi xóa tin nhắn:", error);
      // Bạn cũng có thể xử lý lỗi ở đây hoặc hiển thị thông báo cho người dùng
    }
  };

  // thu hồi
  const thuHoiMessage = async (messageId) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/messages/thuHoiMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversation?._id,
          messageId: messageId,
          memberId: findMemberId(),
        }),
      });

      if (response.ok) {
        console.log("Tin nhắn đã được thu hồi thành công");
        console.log("ID tin nhắn:", messageId);
        console.log("ID cuộc trò chuyện:", conversation?._id);
        console.log("ID thành viên:", findMemberId());
        listenToMessages();
        socketRef.current.emit("messageDeleted", { messageId, conversationId: conversation?._id });
        setModalVisible(false);
        // Bạn có thể thêm các hành động khác sau khi thu hồi tin nhắn thành công ở đây
      } else {
        // Trường hợp phản hồi không thành công
        console.error("Lỗi khi thu hồi tin nhắn:", response.statusText);
        // Bạn có thể xử lý lỗi hoặc hiển thị thông báo cho người dùng ở đây
      }
    } catch (error) {
      console.error("Lỗi khi thu hồi tin nhắn:", error);
      // Bạn cũng có thể xử lý lỗi ở đây hoặc hiển thị thông báo cho người dùng
    }
  };

  // chuyen tiếp

  // luu message khi an va tra loi
  const saveMessageRepply = (message) => {
    setMessageRepply(message);
  };

  return (
    <View style={[styles.rowContainer, { alignSelf: !isCurrentUserMessage ? "flex-start" : "flex-end" }]}>
      {!isCurrentUserMessage && !(message.deleteMember && message.deleteMember.length > 0) && (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      )}
      {message.deleteMember && message.deleteMember.length > 0 ? null : (
        <TouchableOpacity
          style={[styles.message_container, { backgroundColor: !isCurrentUserMessage ? "#FFFF" : "#CCF3FF" }]}
          onLongPress={openModal}>
          {renderMessageContent()}
          <Text style={styles.timeText}>{formatTimestamp(message.createAt)}</Text>
        </TouchableOpacity>
      )}
      <Modal
        style={styles.modalContainer}
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        backdropOpacity={0.5}
        animationIn="fadeInUp"
        animationOut="fadeOutDown">
        <View style={[styles.modalContent, { top: modalY, left: modalX }]}>
          <View style={styles.modalItems}>
            <TouchableOpacity style={styles.modalItem}>
              <View style={styles.icons}>
                <Ionicons name="copy" size={33} color="#FF9900" />
              </View>
              <Text style={styles.content1}>Sao chép</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => saveMessageRepply(message)}>
              <View style={styles.icons}>
                <Entypo name="reply" size={38} color="#E318D1" />
              </View>
              <Text style={styles.content1}>Trả lời</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalItem}
              setModalVisible={false}
              onPress={() => {
                navigation.navigate("ChuyenTiep", { message: message, memberId: findMemberId(), userID: userData._id });
                setModalVisible(false);
              }}>
              <View style={[styles.icons, { transform: [{ rotate: "deg" }] }]}>
                <Entypo name="forward" size={38} color="#004D9A" />
              </View>
              <Text style={styles.content1}>Chuyển tiếp</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalItems}>
            <TouchableOpacity style={styles.modalItem} onPress={() => deleteMessage(message._id)}>
              <View style={styles.icons}>
                <MaterialIcons name="delete" size={36} color="#797979" />
              </View>
              <Text style={styles.content1}>Xóa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => thuHoiMessage(message._id)}>
              <View style={styles.icons}>
                <MaterialIcons name="restore" size={38} color="#1DBC5D" />
              </View>
              <Text style={styles.content1}>Thu hồi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
              <View style={styles.icons}>
                <FontAwesome6 name="cloud-arrow-down" size={26} color="#00A3FF" />
              </View>
              <Text style={styles.content1}>Lưu cloud</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalItems}>
            <TouchableOpacity style={styles.modalItem}>
              <View style={styles.icons}>
                <AntDesign name="exclamationcircle" size={30} color="#4D4D4D" />
              </View>
              <Text style={styles.content1}>Coming</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
              <View style={styles.icons}>
                <AntDesign name="exclamationcircle" size={30} color="#4D4D4D" />
              </View>
              <Text style={styles.content1}>Coming</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
              <View style={styles.icons}>
                <AntDesign name="exclamationcircle" size={30} color="#4D4D4D" />
              </View>
              <Text style={styles.content1}>Coming</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function ChatScreen({ route }) {
  const flatListRef = useRef();
  const [conversation, setConversation] = useState([]);
  const { conversationId } = route.params;
  const [messages, setMessages] = useState([]);
  const [lastMessageIndex, setLastMessageIndex] = useState(0);
  const socketRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [showOthers, setShowOthers] = useState(false);
  const [showMicro, setShowMicro] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [nameFile, setNameFile] = useState("");
  const [messageText, setMessageText] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [url, setUrl] = useState("");
  const [recording, setRecording] = useState();
  const [iconSize, setIconSize] = useState(50);
  const [iconColor, setIconColor] = useState("black");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCurrentUserMessage, setIsCurrentUserMessage] = useState(false);
  const [isSelectedIconShowOthers, setIsSelectedIconShowOthers] = useState(false);
  const [messageRepply, setMessageRepply] = useState("");

  const handleShowImage = () => {
    Keyboard.dismiss();
    setShowOthers(false);
    setShowMicro(false);
    setShowImage(!showImage);
  };
  const handleShowOthers = () => {
    Keyboard.dismiss();
    setShowMicro(false);
    setShowImage(false);
    setShowOthers(!showOthers);
  };
  const handleTextInputFocus = () => {
    setIsTyping(false);
    setShowOthers(false);
    setShowMicro(false);
    setShowImage(false);
  };
  const handleChangeText = (text) => {
    setTextInputValue(text);
    setIsTyping(!!text);
  };
  const handleShowMicro = () => {
    Keyboard.dismiss();
    setShowOthers(false);
    setShowImage(false);
    setShowMicro(!showMicro);
    toggleModal();
  };
  // const handleSendMessage = async () => {
  //   console.log("Nội dung", textInputValue);
  // };

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

  const joinRoom = () => {
    socketRef.current.emit("joinRoom", { roomId: conversationId, userId: "1111" });
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
      // const response = await fetch(`http://192.168.3.106:3000/api/v1/conversation/getConversationByIdApp/${conversationId}`);
      const data = await response.json();
      setConversation(data);
      if (data && data.messages) {
        setMessages(data.messages);
        setLastMessageIndex(data.messages.length - 1);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    flatListRef.current.scrollToEnd({ animated: true });
  }, []);

  const findMemberId = () => {
    if (!conversation || !userData) return null;
    const member = conversation.members.find((member) => member.userId._id === userData._id);
    // console.log("member", member);
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
        setShowKeyboard(false);
      }
    } catch (error) {
      console.error("Lỗi khi chọn ảnh từ thư viện:", error);
    }
  };

  const takePhoto = async () => {
    setShowOthers(false);
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("Permission to access camera is required!");
        return;
      }
      const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.5,
      });

      if (!pickerResult.cancelled && pickerResult.assets) {
        const selectedImageURIs = pickerResult.assets.map((asset) => asset.uri);
        setSelectedImages(selectedImageURIs);
        console.log("Các ảnh đã chọn:", selectedImageURIs);
      }
    } catch (error) {
      console.error("Lỗi khi chụp ảnh:", error);
    }
  };

  const isImageSelected = (imageUri) => {
    return selectedImages.includes(imageUri);
  };
  const removeSelectedImage = (imageUri) => {
    setSelectedImages(selectedImages.filter((uri) => uri !== imageUri));
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

  const sendMessage = async () => {
    try {
      const imageUrls = await Promise.all(selectedImages.map(uploadImageToS3));
      let fileUrl = "";
      if (selectedFile && nameFile) {
        fileUrl = await uploadFileToS3(selectedFile, nameFile);
      }
      let messageType = "text";
      let messageContent = textInputValue;
      if (imageUrls.length > 0) {
        messageType = "image";
        messageContent = imageUrls.join(", ");
      } else if (fileUrl) {
        messageType = "file";
        messageContent = fileUrl;
      }
      console.log("Nội dung", messageContent);
      console.log("ID", conversationId);
      console.log("MemberID", findMemberId());
      console.log("Type", messageType);
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
        listenToMessages();
        setTextInputValue("");
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

  //  ghi âm

  const s3 = new S3({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: REGION,
  });

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  async function startRecording() {
    console.log("Đang ghi âm");
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        setRecording(recording);
      }
    } catch (err) {
      console.log("Error starting recording:", err);
    }
  }

  async function stopRecording() {
    console.log("Dừng ghi âm");
    setRecording(undefined);

    await recording.stopAndUnloadAsync();
    const info = await FileSystem.getInfoAsync(recording.getURI());
    const uri = info.uri;
    const response = await fetch(uri);
    const blob = await response.blob();
    const key = `RECORD_${Date.now()}.mp3`;
    try {
      const uploadResponse = await s3
        .upload({
          Bucket: S3_BUCKET_NAME,
          Key: key,
          Body: blob,
          ContentType: "audio/mpeg",
        })
        .promise();
      console.log("Upload to S3 successful!");
      // Log URL
      const uploadedUrl = `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
      setUrl(uploadedUrl);
      sendAudioMessage(uploadedUrl);
      console.log("URL:", uploadedUrl);
    } catch (error) {
      console.log("Upload to S3 failed:", error);
    }
  }
  const goXemGhiAm = () => {
    navigation.navigate("DemoReadFile", { url });
  };

  const handlePressIn = async () => {
    try {
      if (!recording) {
        await startRecording();
        setIconSize(70);
        setIconColor("blue");
      }
    } catch (error) {
      console.error("Error handling press in:", error);
    }
  };

  const handlePressOut = async () => {
    try {
      if (recording) {
        await stopRecording();
        setIconSize(50);
        setIconColor("black");
      }
    } catch (error) {
      console.error("Error handling press out:", error);
    }
  };

  // hàm gửi ghi âm
  const sendAudioMessage = async (audioUrl) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/messages/addMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversationId,
          content: audioUrl,
          memberId: findMemberId(),
          type: "audio",
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Tin nhắn âm thanh đã được gửi:", responseData);
        setMessages((prevMessages) => [...prevMessages, responseData]);
        listenToMessages();
        setTextInputValue("");
        setSelectedImages([]);
        socketRef.current.emit("message", { message: audioUrl, room: conversationId });
      } else {
        console.error("Lỗi khi gửi tin nhắn âm thanh:", responseData);
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn âm thanh:", error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // gửi file
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

  const UseFile = async () => {
    setShowOthers(false);
    try {
      const file = await DocumentPicker.getDocumentAsync();
      if (file.assets && file.assets.length > 0) {
        // Lấy URI và tên của tệp đã chọn từ mảng assets
        const selectedFile2 = {
          uri: file.assets[0].uri,
          name: file.assets[0].name,
        };
        const fileUrl = selectedFile2.uri;
        const fileName = selectedFile2.name;
        console.log("fileUrl", fileUrl);

        setNameFile(fileName);
        setTextInputValue(fileName);
        setSelectedFile(fileUrl);
        console.log("SelectedFile", selectedFile);
        console.log("URI của tệp đã chọn:", selectedFile);
        console.log("Tên của tệp đã chọn:", fileName);
      }
    } catch (error) {
      console.error("Lỗi khi chọn tệp:", error);
    }
  };

  useEffect(() => {
    console.log("SelectedFile", selectedFile);
  }, [selectedFile]);

  //reply

  //close reply
  const closeReply = () => {
    setMessageRepply(null);
  };

  console.log("Message Repply", messageRepply);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Zelo chat</Text>
        </View>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => {
              // Xác định xem tin nhắn có được gửi bởi người dùng hiện tại không
              const isCurrentUserMessage = item.memberId?.userId?._id === userData?._id;
              const replyMessage = messageRepply;
              return (
                <MessageBubble
                  {...item}
                  message={item}
                  conversation={conversation}
                  userData={userData}
                  isCurrentUserMessage={isCurrentUserMessage} // Truyền giá trị boolean cho MessageBubble
                  setConversation={setConversation}
                  socketRef={socketRef}
                  listenToMessages={listenToMessages}
                  setMessageRepply={setMessageRepply}
                  replyMessage={replyMessage}
                />
              );
            }}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: 10, gap: 10 }}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
          />

          {messageRepply && (
            <View style={styles.Reply}>
              <View style={styles.replyContent}>
                <Text style={styles.nameReply}>{messageRepply.memberId.userId?.name}</Text>
                <Text style={styles.messageContentReply}>{messageRepply.content}</Text>
              </View>
              <AntDesign onPress={closeReply} style={styles.closeButton} name="close" size={24} color="black" />
            </View>
          )}

          <View style={styles.inputContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={handleShowMicro}>
                <FontAwesome name="microphone" size={24} color="gray" />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput_container}
                placeholder="Tin nhắn"
                placeholderTextColor="gray"
                value={textInputValue}
                onFocus={handleTextInputFocus}
                onChangeText={handleChangeText}
              />
            </View>
            {!isTyping && (
              <>
                <TouchableOpacity onPress={handleShowOthers}>
                  <MaterialCommunityIcons name="dots-horizontal" size={30} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity onPress={selectImageFromGallery}>
                  <Ionicons name="image-outline" size={28} color="gray" />
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity onPress={sendMessage}>
              <MaterialCommunityIcons name="send" size={28} color="#0091FF" />
            </TouchableOpacity>
          </View>
          {showMicro && (
            <View style={{ height: 268, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
              <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <Ionicons name="mic-outline" style={[styles.iconOthers, { fontSize: iconSize, color: "blue" }]} />
              </TouchableWithoutFeedback>
              <Button title="Xem ghi am" onPress={goXemGhiAm}></Button>
            </View>
          )}
          {showOthers && (
            <View style={{ height: 268, backgroundColor: "pink", flexDirection: "row" }}>
              <TouchableOpacity style={styles.otherIconStyle} onPress={UseFile}>
                <MaterialIcons name="attach-file" size={35} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.otherIconStyle} onPress={takePhoto}>
                <AntDesign name="camerao" size={35} color="black" />
              </TouchableOpacity>
            </View>
          )}
          {showImage && (
            <View style={{ height: 268, backgroundColor: "yellow" }}>
              <Text>Image</Text>
            </View>
          )}
          {selectedImages.length > 0 && (
            <ScrollView horizontal>
              <View style={styles.imageList}>
                {selectedImages.map((imageUri, index) => (
                  <View key={index} style={{ position: "relative" }}>
                    <Image source={{ uri: imageUri }} style={styles.selectedImage} />
                    <TouchableOpacity
                      onPress={() => removeSelectedImage(imageUri)}
                      style={{ backgroundColor: "#fff", borderRadius: 20, position: "absolute", top: -10, right: 5, zIndex: 1 }}>
                      <Text style={{ color: "#000" }}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    // backgroundColor: "pink",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  message_container: {
    maxWidth: "80%",
    borderRadius: 15,
    padding: 10,
    borderWidth: 0.2,
    borderColor: "#B0B0B0",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    // backgroundColor: "green",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  messageText: {
    fontSize: 16,
    fontWeight: "400",
  },
  timeText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#AEAEAE",
  },
  modalContainer: {
    justifyContent: "flex-start",
    marginRight: 0,
  },
  modalContent: {
    width: 250,
    height: 195,
    paddingVertical: 5,
    paddingHorizontal: 10,
    position: "absolute",
    borderRadius: 20,
    elevation: 5,
    backgroundColor: "white",
  },
  modalItems: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modalItem: {
    width: 70,
    height: 50,
    margin: 5,
    // backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
  },
  content1: {
    fontSize: 12,
    fontWeight: "400",
  },
  icons: {
    height: 40,
    width: 40,
    // backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 18,
    paddingRight: 18,
    // backgroundColor: "green",
  },
  textInput_container: {
    height: 42,
    width: widthApp * 0.55,
    borderRadius: 10,
    borderColor: "#0091FF",
    fontSize: 16,
    paddingLeft: 14,
  },
  imageList: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  modal1: {
    margin: 0,
    justifyContent: "flex-end",
  },
  otherIconStyle: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  Reply: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff", // Màu nền trong suốt
    padding: 10,
    borderRadius: 10, // Chỉ có borderRadius ở phần trên
    marginTop: 10, // Khoảng cách với các phần khác
  },
  replyContent: {
    flex: 1, // Để nội dung có thể mở rộng
    marginRight: 10, // Khoảng cách giữa nội dung và biểu tượng close
    // borderWidth: 1,
    borderLeftColor: "blue",
  },
  closeButton: {
    marginLeft: "auto", // Đặt biểu tượng close ở bên phải
  },
  nameReply: {
    color: "#000", // Màu xanh dương cho tên
    marginBottom: 5,
    fontSize: 15, // Khoảng cách giữa tên và nội dung
    fontWeight: "bold", // Chữ đậm
  },
  messageContentReply: {
    color: "gray", // Màu xám cho nội dung tin nhắn
    fontSize: 12, // Kích thước font nhỏ hơn
  },
});
