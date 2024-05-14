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
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AntDesign,
  Ionicons,
  Entypo,
  MaterialIcons,
  FontAwesome6,
  FontAwesome,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, S3_BUCKET_NAME, API_URL } from "@env";
import io from "socket.io-client";
import { Audio, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import * as MediaLibrary from "expo-media-library";
import { S3 } from "aws-sdk";
import { useNavigation } from "@react-navigation/native";
import { Zocial } from "@expo/vector-icons";
import ImageZoom from "react-native-image-pan-zoom";

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
  const [viewedImage, setViewedImage] = useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const avatar = message.memberId?.userId?.avatar;

  const modalWidth = Dimensions.get("window").width;
  const modalHeight = Dimensions.get("window").height;

  // Kích thước cụ thể cho khung zoom và ảnh (ví dụ: 80% của kích thước modal)
  const zoomWidth = modalWidth * 0.8;
  const zoomHeight = modalHeight * 0.8;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const openModal = (event) => {
    // console.log("Open modal");
    setModalVisible(true);
    setModalX(event.nativeEvent.pageX - 180);
    setModalY(event.nativeEvent.pageY - 150);
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

  // xem anh
  const openImageViewer = (imageUrl) => {
    setViewedImage(imageUrl);
  };

  const rederMainMessage = () => {
    const replyMessage = message.reply;
    if (message.deleteMember && message.deleteMember.length > 0) {
      for (let i = 0; i < message.deleteMember.length; i++) {
        if (message.deleteMember[i]._id === memberID) {
          console.log("ID", message.deleteMember[i]._id);
          return null;
        }
      }
    } else if (replyMessage.length > 0) {
      return (
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={styles.verticalLine}></View>
            <View style={styles.replyContainer}>
              <Text style={styles.replyName}>{replyMessage[0].memberId?.userId?.name}</Text>
              <Text style={styles.replyContent}>{replyMessage[0].content}</Text>
            </View>
          </View>
          {renderMessageContent()}
        </View>
      );
    } else {
      return renderMessageContent();
    }
    // console.log("ID thành viên:", memberID);
  };

  const renderMessageContent = () => {
    // neu co memberId trong message.deleteMembers thi khong hien thi message
    const memberID = findMemberId();
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
          <TouchableOpacity key={index} onPress={() => openImageViewer(imageUrl)}>
            <Image key={index} source={{ uri: imageUrl }} resizeMode="contain" style={{ width: 250, height: 250 }} />
          </TouchableOpacity>
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
      } else if (message.type === "video") {
        return (
          <View style={styles.videoContainer}>
            <Video
              source={{ uri: message.content }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay={isPlaying}
              isLooping
              style={styles.video}
              // onPlaybackStatusUpdate={(status) => setIsPlaying(status.isPlaying)}
              useNativeControls
            />
            {isPlaying && (
              <TouchableOpacity onPress={handlePlayPause} style={styles.pauseButton}>
                <MaterialIcons name="pause" size={50} color="white" />
              </TouchableOpacity>
            )}
            {!isPlaying && (
              <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
                <MaterialIcons name="play-arrow" size={50} color="white" />
              </TouchableOpacity>
            )}
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
        console.log("Tin nhắn đã được xóa thành công");
        Alert.alert("Thông báo", "Tin nhắn đã được xóa thành công");
        console.log("ID tin nhắn:", messageId);
        console.log("ID cuộc trò chuyện:", conversation?._id);
        console.log("ID thành viên:", findMemberId());
        const updatedMessages = conversation.messages.filter((msg) => msg._id !== messageId);
        // Cập nhật lại conversation với danh sách tin nhắn mới
        const updatedConversation = { ...conversation, messages: updatedMessages };
        socketRef.current.emit("sendMessage", { message: "Tin nhắn đã được xóa thành công", room: conversation?._id });
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
        socketRef.current.emit("sendMessage", { message: "Tin nhắn đã được thu hồi", room: conversation?._id });
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
    setModalVisible(false);
  };

  // download anh
  const downloadAndSaveImage = async (imageUrl) => {
    try {
      // Kiểm tra quyền truy cập thư viện ảnh
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("không có quyền truy cập thư viện ảnh");
        return;
      }

      // Tải xuống ảnh và lưu trữ vào thư mục tạm thời của ứng dụng
      const temporaryFileUri = `${FileSystem.cacheDirectory}temp_image.jpg`;
      const downloadResult = await FileSystem.downloadAsync(imageUrl, temporaryFileUri);

      if (downloadResult.status === 200) {
        // Lưu ảnh vào thư viện hình ảnh của thiết bị
        const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
        alert("Tải ảnh thành công");
      } else {
        alert("Failed to download image!");
      }
    } catch (error) {
      console.error("Error while downloading and saving image:", error);
    }
  };

  // play video
  const PlayVideo = ({ videoUri }) => {
    // Phát video khi component được render
    React.useEffect(() => {
      // Tạo một audio instance
      const video = new Video.Sound();

      // Load video từ URI được cung cấp
      video.loadAsync({ uri: videoUri }).then(() => {
        // Phát video sau khi đã được load thành công
        video.playAsync();
      });

      // Trả về một hàm để dọn dẹp khi component bị unmount
      return () => {
        video.unloadAsync();
      };
    }, [videoUri]); // Render lại component nếu videoUri thay đổi

    return null; // Không cần phải render bất cứ điều gì
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const renderNotifyMessage = () => {
    const [isAdd, setIsAdd] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isChange, setIsChange] = useState(false);
    const [isAvt, setIsAvt] = useState("");
    const mes = message.content;
    const fullName = message.memberId?.userId?.name;
    const firstWord = mes.split(" ")[0];
    useEffect(() => {
      // Chỉ chạy khi component được render lần đầu tiên
      if (!isAdd && !isDelete && !isChange) {
        if (mes.includes("thêm")) {
          setIsAdd(true);
        } else if (mes.includes("đuổi")) {
          setIsDelete(true);
        } else if (mes.includes("bổ nhiệm")) {
          setIsChange(true);
        }
      }
    }, [mes, isAdd, isDelete, isChange]);
    return (
      <View style={styles.notifyContainer}>
        {isChange && <FontAwesome5 name="key" size={20} color="#79B836" />}
        <Image source={{ uri: message.memberId.userId.avatar }} style={{ width: 20, height: 20, borderRadius: 20 }}></Image>
        <Text style={styles.notifyText}>{message.content}</Text>
        {isAdd && <MaterialIcons style={{ paddingLeft: 10 }} name="accessibility-new" size={20} color="#FBC94C" />}
        {isDelete && <FontAwesome style={{ paddingLeft: 10 }} name="sign-out" size={20} color="black" />}
      </View>
    );
  };

  return (
    <>
      {message.type === "notify" ? (
        renderNotifyMessage()
      ) : (
        <View style={[styles.rowContainer, { alignSelf: !isCurrentUserMessage ? "flex-start" : "flex-end" }]}>
          {!isCurrentUserMessage && !(message.deleteMember && message.deleteMember.length > 0) && (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          )}
          {message.deleteMember && message.deleteMember.length > 0 ? null : (
            <TouchableOpacity
              style={[
                styles.message_container,
                {
                  backgroundColor: !isCurrentUserMessage ? "#FFFF" : "#CCF3FF",
                },
              ]}
              onLongPress={openModal}>
              {rederMainMessage()}
              <Text style={styles.timeText}>{formatTimestamp(message.createAt)}</Text>
            </TouchableOpacity>
          )}
          <Modal isVisible={viewedImage !== null} onBackdropPress={() => setViewedImage(null)} backdropOpacity={0.8}>
            <View style={{ flex: 1, backgroundColor: "#000", padding: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                {message?.memberId?.userId?.avatar && (
                  <Image
                    source={{ uri: message?.memberId?.userId?.avatar }}
                    resizeMode="cover"
                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                  />
                )}
                <View style={{ width: 220 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 5 }}>
                    {message?.memberId?.userId?.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#ccc" }}>{formatTimestamp(message.createAt)}</Text>
                </View>
                <TouchableOpacity onPress={() => downloadAndSaveImage(message.content)}>
                  <AntDesign name="download" size={24} color="#fff" />
                </TouchableOpacity>
                <Entypo name="dots-three-vertical" style={{ padding: 5 }} size={24} color="#fff" />
              </View>
              <TouchableWithoutFeedback onPress={() => setViewedImage(null)}>
                <View style={{ flex: 1 }}>
                  <ImageZoom
                    cropWidth={zoomWidth}
                    cropHeight={Dimensions.get("window").height}
                    imageWidth={Dimensions.get("window").width}
                    imageHeight={Dimensions.get("window").height}>
                    <Image source={{ uri: viewedImage }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                  </ImageZoom>
                </View>
              </TouchableWithoutFeedback>
              <TouchableOpacity onPress={() => setViewedImage(null)} style={{ alignItems: "center", marginTop: 20 }}>
                <AntDesign name="closecircle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </Modal>

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
      )}
    </>
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
  const [selectedVideo, setSelectedVideo] = useState("");

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
    socketRef.current.on("sendMessage", (message) => {
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

  // video

  const selectVideoFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("Permission to access media library is required!");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 0.5,
        allowsMultipleSelection: true,
        videoMaxSize: 10 * 1024 * 1024, // 10MB
      });

      if (!pickerResult.cancelled && pickerResult.assets) {
        const selectedVideoURIs = pickerResult.assets.map((asset) => asset.uri);
        console.log("Các video đã chọn:", selectedVideoURIs);
        setShowOthers(false);
        setSelectedVideo(selectedVideoURIs);
        setShowKeyboard(false);
      }
    } catch (error) {
      console.error("Lỗi khi chọn video từ thư viện:", error);
    }
  };

  // đẩy video len s3
  const uploadVideoToS3 = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const currentTime = new Date();
      const formattedTime = currentTime.toISOString().slice(0, 19).replace(/[-T:]/g, "");
      const milliseconds = currentTime.getMilliseconds();
      const filename = imageUri.split("/").pop();
      const fileName = `Video_${formattedTime}_${milliseconds}_${filename}`;
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
      console.log("Tải video thành công", uploadResponse.Location);
      return uploadResponse.Location.toString();
    } catch (error) {
      console.error("Error uploading video", error);
      throw error;
    }
  };
  // send video
  const sendVideo = async () => {
    try {
      const videoUrls = await Promise.all(selectedVideo.map(uploadVideoToS3));
      let messageType = "text";
      let messageContent = textInputValue;
      if (videoUrls.length > 0) {
        messageType = "video";
        messageContent = videoUrls.join(", ");
      }
      let repMessage = messageRepply ? messageRepply : null;
      console.log("Nội dung", messageContent);
      console.log("ID", conversationId);
      console.log("MemberID", findMemberId());
      console.log("Type", messageType);
      console.log("repMessage", repMessage);
      console.log("ID Rep", repMessage?._id);
      let response;
      if (repMessage) {
        console.log("Tin nhắn đã được trả lời");
        response = await fetch(`${API_URL}/api/v1/messages/addReply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId: conversationId,
            content: messageContent,
            memberId: findMemberId(),
            type: messageType,
            messageRepliedId: repMessage?._id,
          }),
        });
      } else {
        response = await fetch(`${API_URL}/api/v1/messages/addMessage`, {
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
      }
      if (response.ok) {
        const responseData = await response.json();
        console.log("Tin nhắn đã được gửi:", responseData);
        setMessages((prevMessages) => [...prevMessages, responseData]);
        listenToMessages();
        setTextInputValue("");
        setSelectedImages([]);
        socketRef.current.emit("sendMessage", { message: messageContent, room: conversationId });
      } else {
        console.error("Lỗi khi gửi tin nhắn:", responseData);
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    } finally {
      setIsSendingMessage(false);
    }
  };
  // play video

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
      let repMessage = messageRepply ? messageRepply : null;
      console.log("Nội dung", messageContent);
      console.log("ID", conversationId);
      console.log("MemberID", findMemberId());
      console.log("Type", messageType);
      console.log("repMessage", repMessage);
      console.log("ID Rep", repMessage?._id);
      let response;
      if (repMessage) {
        console.log("Tin nhắn đã được trả lời");
        response = await fetch(`${API_URL}/api/v1/messages/addReply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId: conversationId,
            content: messageContent,
            memberId: findMemberId(),
            type: messageType,
            messageRepliedId: repMessage?._id,
          }),
        });
      } else {
        response = await fetch(`${API_URL}/api/v1/messages/addMessage`, {
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
      }
      if (response.ok) {
        const responseData = await response.json();
        console.log("Tin nhắn đã được gửi:", responseData);
        setMessages((prevMessages) => [...prevMessages, responseData]);
        listenToMessages();
        setTextInputValue("");
        setMessageRepply(null);
        setSelectedImages([]);
        socketRef.current.emit("sendMessage", { message: messageContent, room: conversationId });
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
        socketRef.current.emit("sendMessage", { message: audioUrl, room: conversationId });
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

  // render for type message reply
  const renderReplyMessage = (message) => {
    if (message.type === "image") {
      return <Image source={{ uri: message.content }} style={{ width: 50, height: 50 }}></Image>;
    } else if (message.type === "audio") {
      return <Ionicons name="musical-notes" size={24} color="black" />;
    } else if (message.type === "video") {
      return <Ionicons name="videocam" size={24} color="black" />;
    } else if (message.type === "file") {
      return <Ionicons name="document" size={24} color="black" />;
    } else {
      return <Text>{message.content}</Text>;
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={styles.container}>
        <View style={styles.header}>{/* <Text style={styles.title}>Zelo chat</Text> */}</View>
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: "#F2F2F2" }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={88}>
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
                {renderReplyMessage(messageRepply)}
                {/* <Text style={styles.messageContentReply}>{messageRepply.content}</Text> */}
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
            <View
              style={{
                height: 268,
                backgroundColor: "#fff",
                flexDirection: "row",
                justifyContent: "center",
                flexWrap: "wrap",
                alignItems: "center",
              }}>
              <View style={styles.option}>
                <TouchableOpacity style={styles.otherIconStyleViTri}>
                  <AntDesign name="enviromento" size={35} color="#fff" />
                </TouchableOpacity>
                <Text>Định vị</Text>
              </View>
              <View style={styles.option}>
                <TouchableOpacity style={styles.otherIconStyleFile} onPress={UseFile}>
                  <MaterialIcons name="attach-file" size={35} color="#fff" />
                </TouchableOpacity>
                <Text>Tài liệu</Text>
              </View>
              <View style={styles.option}>
                <TouchableOpacity style={styles.otherIconStyleCamera} onPress={takePhoto}>
                  <AntDesign name="camerao" size={35} color="#fff" />
                </TouchableOpacity>
                <Text>Camera</Text>
              </View>
              <View style={styles.option}>
                <TouchableOpacity style={styles.otherIconStyleCloud}>
                  <AntDesign name="cloudo" size={35} color="#fff" />
                </TouchableOpacity>
                <Text>Cloud</Text>
              </View>
              <View style={styles.option}>
                <TouchableOpacity style={styles.otherIconStyleGif}>
                  <MaterialIcons name="gif" size={35} color="#fff" />
                </TouchableOpacity>
                <Text>@GIF</Text>
              </View>
              <View style={styles.option}>
                <TouchableOpacity style={styles.otherIconStylePerson}>
                  <Zocial name="persona" size={35} color="#fff" />
                </TouchableOpacity>
                <Text>Danh bạ</Text>
              </View>
              <View style={styles.option}>
                <TouchableOpacity style={styles.otherIconStyleQR}>
                  <MaterialCommunityIcons name="qrcode-remove" size={35} color="#fff" />
                </TouchableOpacity>
                <Text>Mã QR</Text>
              </View>
              <View style={styles.option}>
                <TouchableOpacity style={styles.otherIconStyleMoney} onPress={selectVideoFromGallery}>
                  <Entypo name="video" size={35} color="#fff" />
                </TouchableOpacity>
                <Text>Video</Text>
              </View>
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
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    height: 20,
    backgroundColor: "#F2F2F2",
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
    paddingVertical: 5,
    backgroundColor: "#FFFFFF",
  },
  textInput_container: {
    height: 42,
    width: widthApp * 0.55,
    borderRadius: 10,
    borderColor: "#0091FF",
    fontSize: 16,
    paddingLeft: 14,
    // backgroundColor: "green",
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
  optionals: {
    alignContent: "center",
  },
  otherIconStyleFile: {
    width: 70,
    height: 70,
    backgroundColor: "#4054D7",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  // #D84B97
  otherIconStylePerson: {
    width: 70,
    height: 70,
    backgroundColor: "#3195E0",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  otherIconStyleQR: {
    width: 70,
    height: 70,
    backgroundColor: "#94EEC4",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  otherIconStyleMoney: {
    width: 70,
    height: 70,
    backgroundColor: "#D84B97",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  otherIconStyleViTri: {
    width: 70,
    height: 70,
    backgroundColor: "#FF5F83",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  otherIconStyleGif: {
    width: 70,
    height: 70,
    backgroundColor: "#53C97D",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  otherIconStyleCamera: {
    width: 70,
    height: 70,
    backgroundColor: "#DE5372",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  otherIconStyleCloud: {
    width: 70,
    height: 70,
    backgroundColor: "#3D7EF2",
    borderRadius: 40,
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
  replyContainer: {
    borderRadius: 5,
  },
  replyName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  replyContent: {
    marginBottom: 5,
    color: "gray",
  },
  mainMessageContainer: {
    marginLeft: 10,
  },
  verticalLine: {
    width: 1.5,
    height: "80%", // Chiều cao của đường dọc
    backgroundColor: "#3989FF", // Màu sắc của đường dọc
    marginRight: 5,
  },
  videoContainer: {
    width: 250,
    height: 250,
    position: "relative",
  },
  video: {
    flex: 1,
  },
  playButton: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  pauseButton: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  option: {
    justifyContent: "center",
    alignItems: "center",
  },
  notifyContainer: {
    justifyContent: "center",
    alignItems: "center", // Căn giữa theo chiều ngang
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 24,
    flexDirection: "row",
  },
  notifyText: {
    fontSize: 12, // Đặt kích thước chữ mong muốn
    color: "#000", // Đặt màu chữ là màu đen
    textAlign: "center", // Căn giữa nội dung văn bản
    paddingLeft: 10,
    fontWeight: "400",
  },
});
