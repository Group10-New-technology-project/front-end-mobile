import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, S3_BUCKET_NAME, API_URL } from "@env";
import { S3 } from "aws-sdk";
import io from "socket.io-client";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";
import Modal from "react-native-modal";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";

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
  const [shouldShowSendButton, setShouldShowSendButton] = useState(false);
  const [shouldShowOtherIcons, setShouldShowOtherIcons] = useState(true);
  const [showIconsContainer, setShowIconsContainer] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [iconSize, setIconSize] = useState(24); // Kích thước ban đầu của icon
  const [iconColor, setIconColor] = useState("black"); // Màu ban đầu của icon
  const [selectedFile, setSelectedFile] = useState("");
  const [nameFile, setNameFile] = useState("");
  const [lastMessageIndex, setLastMessageIndex] = useState(0);
  const [url, setUrl] = useState("");

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const s3 = new S3({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: REGION,
  });

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Sau khi dữ liệu đã được tải, đặt isDataLoaded thành true
  useEffect(() => {
    if (messages.length > 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

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

  const handleDotsIconPress = () => {
    const newShowIconsContainer = !showIconsContainer;
    setShowIconsContainer(newShowIconsContainer);
    if (!newShowIconsContainer) {
      // Đẩy thanh TextInput lên khi hiển thị các icon mới
      Keyboard.dismiss();
    }
  };

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
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
        setMessages(data.messages);
        setLastMessageIndex(data.messages.length - 1);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    if (messages.length > 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [isDataLoaded]);

  const sendMessage = async () => {
    try {
      setIsSendingMessage(true);
      const imageUrls = await Promise.all(selectedImages.map(uploadImageToS3));
      let fileUrl = "";
      if (selectedFile && nameFile) {
        fileUrl = await uploadFileToS3(selectedFile, nameFile);
      }
      let messageType = "text";
      let messageContent = messageText;
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
      }
    } catch (error) {
      console.error("Lỗi khi chọn ảnh từ thư viện:", error);
    }
  };

  const takePhoto = async () => {
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

  const UseFile = async () => {
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
        setMessageText(fileName);
        setSelectedFile(fileUrl);
        console.log("SelectedFile", selectedFile);
        // console.log('URI của tệp đã chọn:', selectedFile);
        // console.log('Tên của tệp đã chọn:', fileName);
        // Tiếp tục xử lý với URI và tên của tệp đã chọn ở đây
      }
    } catch (error) {
      console.error("Lỗi khi chọn tệp:", error);
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

  const renderImages = (content) => {
    const imageUrls = content.split(", ");
    return imageUrls.map((imageUrl, index) => (
      <Image key={index} source={{ uri: imageUrl }} resizeMode="contain" style={{ width: 150, height: 150 }} />
    ));
  };

  const handleConversationClick = () => {
    // Cuộn xuống dưới cùng của FlatList khi bạn click vào cuộc trò chuyện
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`; // Định dạng 'giờ:phút'
  };

  useEffect(() => {
    if (messageText.trim().length === 0 && selectedImages.length === 0) {
      setShouldShowOtherIcons(true); // Hiển thị các icon khác khi không có text hoặc ảnh được chọn
      setShouldShowSendButton(false);
    } else {
      setShouldShowOtherIcons(false); // Ẩn các icon khác khi có text hoặc ảnh được chọn
      setShouldShowSendButton(true);
    }
  }, [messageText, selectedImages]);

  useEffect(() => {
    console.log("SelectedFile", selectedFile);
  }, [selectedFile]);

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

  const handleDownloadFile = async (fileUrl) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}${fileUrl.split("/").pop()}`;
      await FileSystem.downloadAsync(fileUrl, fileUri);
      console.log("File downloaded to:", fileUri);
      // Tiếp tục xử lý với fileUri ở đây, chẳng hạn hiển thị thông báo cho người dùng hoặc mở file.
      openFile(fileUri);
    } catch (error) {
      console.error("Lỗi khi tải xuống file:", error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A"; // Nếu không có timestamp, trả về "N/A"

    const date = new Date(timestamp); // Chuyển đổi timestamp thành đối tượng Date
    const hours = date.getHours(); // Lấy giờ
    const minutes = date.getMinutes(); // Lấy phút

    // Chuẩn hóa định dạng giờ và phút để luôn hiển thị hai chữ số
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Trả về chuỗi định dạng giờ:phút
    return `${formattedHours}:${formattedMinutes}`;
  };

  //Ghi âm
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
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
        listenToMessages();
        setMessageText("");
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
            <View style={[styles.messageContainer, messageContainerStyle, { paddingVertical: 10 }]}>
              {!isCurrentUser && <Image source={{ uri: avatar }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 5 }} />}
              {item.type === "image" ? (
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>{renderImages(item.content)}</View>
              ) : (
                <>
                  {item.type === "file" && (
                    <TouchableOpacity onPress={() => openFile(item.content)}>
                      <View
                        style={{
                          width: 150,
                          height: 110,
                          justifyContent: "center",
                          borderRadius: 20,
                          alignItems: "center",
                          backgroundColor: "#D0F0FD",
                        }}>
                        {/* Hiển thị icon của loại file dựa trên phần mở rộng */}
                        {getFileTypeIcon(item.content)}
                        <Text style={[styles.messageContent, messageContentStyle, { marginLeft: 5, color: "#000" }]}>{renderFile(item.content)}</Text>
                        <Text style={[styles.messageContent1, messageContentStyle]}>{item.createAt ? formatTime(item.createAt) : "N/A"}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  {item.type === "audio" && (
                    <TouchableOpacity onPress={() => playAudio(item.content)}>
                      <View
                        style={{
                          width: 150,
                          height: 60,
                          justifyContent: "center",
                          borderRadius: 20,
                          alignItems: "center",
                          backgroundColor: "#D0F0FD",
                          flexDirection: "row",
                        }}>
                        {/* Icon for audio message */}
                        {/* <Ionicons name="volume-high-outline" size={24} color="black" style={{ marginRight: 5 }} /> */}
                        <Text style={[styles.messageContent1, messageContentStyle]}>{item.createAt ? formatTime(item.createAt) : "N/A"}</Text>
                        <AntDesign name="sound" size={24} color="black" style={{ marginRight: 5 }} />
                        <Text style={[styles.messageContent, messageContentStyle, { marginLeft: 5, color: "#000" }]}>Audio</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  {item.type === "text" && (
                    <View style={[styles.messageContent, messageContentStyle]}>
                      <Text style={[styles.messageContent, messageContentStyle]}>{item.content}</Text>
                      <Text style={[styles.messageContent1, messageContentStyle]}>{item.createAt ? formatTime(item.createAt) : "N/A"}</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          );
        }}
        keyboardShouldPersistTaps="always"
        onLayout={() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }
        }}
      />
      {/* <View style={[styles.inputSection, !isTextInputFocused && styles.inputSectionNotFocused]}> */}
      <View style={styles.inputSection}>
        <TouchableOpacity onPress={takePhoto}>
          <AntDesign name="camerao" size={30} color="black" />
        </TouchableOpacity>

        <TextInput
          style={[styles.textInput, shouldShowOtherIcons ? null : { width: 300 }]}
          placeholder="Tin Nhắn"
          value={messageText}
          onChangeText={(text) => setMessageText(text)}
          onFocus={() => setIsTextInputFocused(true)}
          onBlur={() => setIsTextInputFocused(false)}
        />
        {shouldShowOtherIcons && (
          <>
            <TouchableOpacity onPress={UseFile}>
              <MaterialIcons name="attach-file" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal}>
              <Ionicons name="mic-outline" size={24} color={"black"} style={styles.iconOthers} />
            </TouchableOpacity>
            <TouchableOpacity onPress={selectImageFromGallery}>
              <Ionicons name="image-outline" size={30} color="black" style={styles.iconOthers} />
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          onPress={sendMessage}
          style={{ opacity: shouldShowSendButton ? 1 : 0, pointerEvents: shouldShowSendButton ? "auto" : "none" }}>
          <Ionicons name="send" size={30} color="blue" />
        </TouchableOpacity>
      </View>

      {/* //Render tin nhắn  */}
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
      <Modal
        isVisible={isModalVisible}
        style={styles.modal}
        backdropOpacity={0}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        avoidKeyboard={true}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        useNativeDriverForBackdrop={true}
        useNativeDriver={true}>
        <View style={styles.modalContent}>
          <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Ionicons name="mic-outline" style={[styles.iconOthers, { fontSize: iconSize, color: "blue" }]} />
          </TouchableWithoutFeedback>
          <Button title="Xem ghi am" onPress={goXemGhiAm}></Button>
        </View>
      </Modal>
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
  // imgRender:{
  //     width: screenWidth * 0.8, // Đặt kích thước chiều rộng của ảnh là 80% chiều rộng màn hình
  //     height: screenHeight * 0.5, // Đặt kích thước chiều cao của ảnh là 50% chiều cao màn hình
  //     resizeMode: 'contain', // Đảm bảo ảnh không bị biến dạng
  // },
  messageContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end", // Thay đổi thành flex-end
  },
  messageContent: {
    fontSize: 18,
    // maxWidth: "70%",
    // flexWrap: "wrap",
    // padding: 12,
    // borderRadius: 10,
    // overflow: "hidden",
    // alignSelf: "flex-end",
  },
  messageContent1: {
    fontSize: 13,
    // flexWrap: "wrap",
    // padding: 12,
    // borderRadius: 10,
    // overflow: "hidden",
    alignSelf: "flex-start",
  },
  currentUserMessageContainer: {
    justifyContent: "flex-end",
  },
  otherUserMessageContainer: {
    justifyContent: "flex-start",
  },
  currentUserMessageContent: {
    backgroundColor: "#D0F0FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    color: "#000",
  },
  otherUserMessageContent: {
    backgroundColor: "#fff",
    color: "black",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    // backgroundColor: "green",
  },

  inputSectionNotFocused: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 5,
  },
  inputSectionWithIcons: {
    position: "absolute",
    bottom: 200, // Điều chỉnh giá trị bottom tùy theo yêu cầu của bạn
    width: "100%", // Đảm bảo rằng inputSection chiếm full width
  },
  textInput: {
    // flex: 1,
    width: 230,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
  iconOthers: {
    padding: 5,
  },
  newIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 200,
    width: "100%",
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
