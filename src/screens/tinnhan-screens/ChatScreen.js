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
  TouchableWithoutFeedback,
  Button,
  Alert,
  Animated,
  ActivityIndicator,
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
import axios from "axios";
import { set } from "firebase/database";

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
  fetchData,
  pinnedMessages,
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
  // const zoomWidth = modalWidth * 0.8;
  // const zoomHeight = modalHeight * 0.8;

  const [isPlaying2, setIsPlaying2] = useState(false);
  const [modalVisibleReaction, setModalVisibleReaction] = useState(false);
  const slideAnim = useRef(new Animated.Value(heightApp)).current;
  const zoomWidth = Dimensions.get("window").width;
  const zoomHeight = Dimensions.get("window").height;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const openModal = (event) => {
    console.log("Message ID", message._id);
    setModalVisible(true);
    setModalX(event.nativeEvent.pageX - 180);
    setModalY(event.nativeEvent.pageY - 150);
    // setModalX(0);
    // setModalX(0);
  };
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  };
  const findMemberId = () => {
    if (!conversation || !userData) return null;
    const member = conversation.members.find((member) => member.userId._id === userData._id);
    // console.log("member", member);
    return member ? member._id : null;
  };
  //find memberId theo userId
  const findMemberIdByUserId = (userId) => {
    if (!conversation || !userData) return null;
    const member = conversation.members.find((member) => member.userId._id === userId);
    return member ? member._id : null;
  };
  // play audio nè
  const playAudio = async (url) => {
    console.log("Playing audio");
    try {
      console.log("Loading Sound");
      setIsPlaying2(true); // Bắt đầu phát âm thanh
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      await sound.playAsync();
      setIsPlaying2(false); // Kết thúc phát âm thanh
      console.log("Kết thúc");
    } catch (error) {
      setIsPlaying2(false); // Đảm bảo rằng trạng thái được đặt lại nếu có lỗi
      console.error("Error playing audio:", error.message);
    }
  };

  const stopAudio = async () => {
    console.log("Stop audio");
    try {
      setIsPlaying2(false); // Cập nhật trạng thái ngừng phát âm thanh
      await sound.stopAsync(); // Ngừng phát âm thanh
    } catch (error) {
      console.error("Error stopping audio:", error.message);
    }
  };
  // Hàm callback để theo dõi trạng thái phát của âm thanh
  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded && !status.isPlaying) {
      isPlaying = false; // Nếu âm thanh không được phát (đã kết thúc hoặc dừng), cập nhật isPlaying
    }
  };

  // xem anh
  const openImageViewer = (imageUrl) => {
    setViewedImage(imageUrl);
  };

  const renderReplyMessage = (message) => {
    if (message.type === "image") {
      return <Image source={{ uri: message.content }} style={{ width: 50, height: 50 }}></Image>;
    } else if (message.type === "audio") {
      return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="musical-notes" size={24} color="black" />
          <Text>Ghi âm</Text>
        </View>
      );
    } else if (message.type === "video") {
      return (
        <View>
          <Video
            source={{ uri: message.content }} // Đường dẫn đến video của bạn
            style={{ width: 50, height: 50 }} // Kích thước video
            controls={true} // Hiển thị các điều khiển của video
            resizeMode="cover" // Chế độ thay đổi kích thước video
          />
        </View>
      );
    } else if (message.type === "file") {
      return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {getFileTypeIcon(message.content)}
          <TouchableOpacity onPress={() => openFile(message.content)}>
            <Text style={styles.fileName}>{renderFile(message.content)}</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return <Text>{message.content}</Text>;
    }
  };

  const renderReplyContent = (message) => {
    switch (message.type) {
      case "image":
        return <Image source={{ uri: message.content }} style={{ width: 50, height: 50 }} />;
      case "audio":
        return <Ionicons name="musical-notes" size={24} color="black" />;
      case "video":
        return (
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
        );
      case "file":
        return (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="document" size={24} color="black" />
            {/* <Text style={styles.replyContent}>{extractFileNameAndType(message.content,50)}</Text> */}
          </View>
        );
      default:
        return <Text style={styles.replyContent}>{message.content}</Text>;
    }
  };

  const rederMainMessage = () => {
    const replyMessage = message.reply;
    const memberID = findMemberIdByUserId(userData._id);
    if (message.deleteMember && message.deleteMember.includes(memberID)) {
      return null;
    } else if (replyMessage.length > 0) {
      return (
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={styles.verticalLine}></View>
            <View style={styles.replyContainer}>
              <Text style={styles.replyName}>{replyMessage[0].memberId?.userId?.name}</Text>
              {/* <Text style={styles.replyContent}>{replyMessage[0].content}</Text> */}
              <View style={styles.replyContainer}>{renderReplyMessage(replyMessage[0])}</View>
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
  // pin

  const renderMessageContent = () => {
    // Nếu tồn tại memberId trong message.deleteMembers thì không hiển thị tin nhắn
    const memberID = findMemberIdByUserId(userData._id);
    if (message.deleteMember && message.deleteMember.includes(memberID)) {
      // Nếu memberId tồn tại trong message.deleteMember, trả về null để không hiển thị tin nhắn
      return null;
    }

    // Nếu không tồn tại memberId trong message.deleteMember, tiếp tục render tin nhắn
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
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              if (!isPlaying) {
                playAudio(message.content);
              } else {
                stopAudio();
              }
            }}>
            <FontAwesome name={isPlaying2 ? "stop" : "play"} size={24} color={isPlaying2 ? "#7D7D7D" : "black"} />
            <View style={{ marginLeft: 5, height: 25, width: 105, borderRadius: 10, backgroundColor: isPlaying2 ? "#7D7D7D" : "black" }} />
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
      case "csv":
        fileTypeIcon = <FontAwesome5 name="file-csv" size={24} color="green" />;
        break;
      case "txt":
        fileTypeIcon = <FontAwesome name="file-text" size={24} color="black" />;
        break;
      // Thêm các trường hợp khác ở đây tùy theo nhu cầu
      default:
        fileTypeIcon = <MaterialCommunityIcons name="file-outline" size={24} color="black" />;
        break;
    }
    return fileTypeIcon;
  };
  // render file
  function extractFileNameAndType(url, maxLength) {
    // Tách đường dẫn file thành các phần bằng '/'
    const parts = url.split("/");
    // Lấy phần cuối cùng của đường dẫn (tên file)
    const fileNameWithExtension = parts[parts.length - 1];
    // Tách phần tên file và loại file bằng cách tìm vị trí của dấu '.' trong tên file
    const dotIndex = fileNameWithExtension.lastIndexOf(".");
    const fileName = fileNameWithExtension.substring(0, dotIndex); // Tên file
    const fileType = fileNameWithExtension.substring(dotIndex + 1); // Loại file

    // Kiểm tra độ dài của tên file và cắt nếu quá dài
    const truncatedFileName = fileName.length > maxLength ? fileName.substring(0, maxLength) + "..." : fileName;

    return { fileName: truncatedFileName, fileType };
  }

  const renderPhanDuoi = (filePath) => {
    const { fileType } = extractFileNameAndType(filePath, 50);
    return fileType;
  };

  const renderFile = (filePath) => {
    const { fileName, fileType } = extractFileNameAndType(filePath, 50);
    // console.log("File name:", fileName);
    return (
      <Text>
        {fileName}.{fileType}
      </Text>
    );
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
          memberId: findMemberIdByUserId(userData._id),
        }),
      });

      if (response.ok) {
        // console.log("Tin nhắn đã được xóa thành công");
        Alert.alert("Thông báo", "Tin nhắn đã được xóa thành công");
        // console.log("ID tin nhắn:", messageId);
        // console.log("ID cuộc trò chuyện:", conversation?._id);
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
      const video = new Video.Sound();
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

  const formatMessageContent = (content) => {
    // Loại bỏ các ký tự '<', '>', '/', và "strong"
    content = content.replace(/<|>|\/|strong/g, "");
    // Chuyển nhiều khoảng trắng liên tiếp thành một khoảng trắng duy nhất
    content = content.replace(/\s{2,}/g, " ");

    // if (content.length > 35) {
    //   return content.substring(0, 35) + "...";
    // }
    return content;
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
      if (!isAdd && !isDelete && !isChange) {
        if (mes.includes("thêm")) {
          setIsAdd(true);
        } else if (mes.includes("xóa")) {
          setIsDelete(true);
        } else if (mes.includes("bổ nhiệm")) {
          setIsChange(true);
        }
      }
    }, [mes, isAdd, isDelete, isChange]);

    return (
      <View style={styles.notifyContainer}>
        {isChange && <FontAwesome5 name="key" size={20} color="#79B836" />}
        <Image source={{ uri: message?.memberId?.userId?.avatar }} style={{ width: 18, height: 18, borderRadius: 20 }}></Image>
        <Text style={styles.notifyText}>{formatMessageContent(message.content)}</Text>
        {isAdd && <MaterialIcons style={{ paddingLeft: 10 }} name="accessibility-new" size={20} color="#FBC94C" />}
        {isDelete && <FontAwesome style={{ paddingLeft: 10 }} name="sign-out" size={20} color="black" />}
      </View>
    );
  };

  const pushPin = async (messageId) => {
    // kiểm tra số lượng trong danh sách được pin nếu = 3 thì không thêm được nữa
    if (pinnedMessages.length >= 3) {
      Alert.alert("Thông báo", "Chỉ được ghim tối đa 3 tin nhắn");
      setModalVisible(false);
      return;
    } else {
      try {
        const response = await fetch(`${API_URL}/api/v1/messages/addPinMessageToConversation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messageId: messageId,
            conversationId: conversation._id,
          }),
        });

        // Kiểm tra xem yêu cầu đã thành công hay không
        if (response.ok) {
          const memberID = findMemberId();
          try {
            const response = await axios.post(`${API_URL}/api/v1/messages/addMessageWeb`, {
              conversationId: conversation._id,
              content: `${userData.name.split(" ").slice(-1)[0]} đã ghim một tin nhắn`,
              memberId: memberID,
              type: "notify",
            });
          } catch (error) {
            console.error("Error creating conversation:", error);
          }
          console.log("Ghim tin nhắn thành công");
          socketRef.current.emit("sendMessage", { message: "Tin nhắn đã được ghim", room: conversation?._id });
          setModalVisible(false);
          fetchData();
        } else {
          console.error("Ghim tin nhắn thất bại:", response.statusText);
        }
      } catch (error) {
        console.error("Đã xảy ra lỗi khi gửi yêu cầu ghim tin nhắn:", error.message);
      }
    }
  };

  // delete pin
  const deletePin = async (messageId) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/messages/deletePinMessageToConversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: messageId,
          conversationId: conversation._id,
        }),
      });
      // Kiểm tra xem yêu cầu đã thành công hay không
      if (response.ok) {
        const memberID = findMemberId();
        try {
          const response = await axios.post(`${API_URL}/api/v1/messages/addMessageWeb`, {
            conversationId: conversation._id,
            content: `${userData.name.split(" ").slice(-1)[0]} đã bỏ ghim một tin nhắn.`,
            memberId: memberID,
            type: "notify",
          });
        } catch (error) {
          console.error("Error creating conversation:", error);
        }
        console.log("Bỏ ghim tin nhắn thành công");
        socketRef.current.emit("sendMessage", { message: "Tin nhắn ghim đã xóa", room: conversation?._id });
        setModalVisible(false);
        fetchData();
      } else {
        console.error("Bỏ ghim tin nhắn thất bại:", response.statusText);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi gửi yêu cầu bỏ ghim tin nhắn:", error.message);
    }
  };
  // add reaction
  const handleAddReaction = async (reactionType, messageId, memberId) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/messages/addReaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: messageId,
          typeReaction: reactionType,
          memberId: memberId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Xử lý cập nhật giao diện nếu cần
        socketRef.current.emit("sendMessage", { message: "Tin nhắn đã được thả cảm xúc", room: conversation?._id });
        fetchData();
        // console.log("Reaction added successfully:", data);
        setModalVisible(false);
      } else {
        // Xử lý lỗi
        console.error("Failed to add reaction:", data.message);
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
      // Xử lý lỗi nếu cần
    }
  };
  // reaction
  const renderReactions = (reactions) => {
    // Tạo đối tượng để lưu trữ loại cảm xúc và số lượng của chúng
    const reactionCounts = {};

    reactions.forEach((reaction) => {
      reaction.reactions.forEach((reactionDetail) => {
        const { typeReaction } = reactionDetail;
        if (reactionCounts.hasOwnProperty(typeReaction)) {
          reactionCounts[typeReaction] += 1;
        } else {
          reactionCounts[typeReaction] = 1;
        }
      });
    });

    // Render các icon cảm xúc dựa trên reactionCounts
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {Object.keys(reactionCounts).map((typeReaction) => {
          switch (typeReaction) {
            case "Like":
              return <AntDesign key={typeReaction} name="like1" size={15} color="#F8B54B" />;
            case "Love":
              return <AntDesign key={typeReaction} name="heart" size={15} color="red" />;
            case "Smile":
              return <FontAwesome6 key={typeReaction} name="smile-beam" size={15} color="#F8B54B" />;
            case "Wow":
              return <FontAwesome5 key={typeReaction} name="surprise" size={15} color="#F8B54B" />;
            case "Sad":
              return <FontAwesome5 key={typeReaction} name="sad-cry" size={15} color="#40D0E8" />;
            case "Angry":
              return <MaterialCommunityIcons key={typeReaction} name="emoticon-angry" size={15} color="#CD462F" />;
            default:
              return null; // Trong trường hợp không có phản ứng nào khớp
          }
        })}
      </View>
    );
  };
  // đếm số lượng reaction
  const calculateTotalReactions = (message) => {
    const memberReactionCounts = {};

    // Lặp qua mỗi phản ứng trong tin nhắn
    message.reaction.forEach((reaction) => {
      // Lặp qua mỗi phản ứng của thành viên
      reaction.reactions.forEach((react) => {
        const userId = reaction.memberId._id; // Sử dụng userId thay vì memberId._id

        // Nếu thành viên đã tồn tại trong đối tượng memberReactionCounts, cộng dồn số lượng
        if (memberReactionCounts.hasOwnProperty(userId)) {
          // Nếu loại phản ứng đã tồn tại trong thành viên, cộng dồn số lượng
          if (memberReactionCounts[userId].hasOwnProperty(react.typeReaction)) {
            memberReactionCounts[userId][react.typeReaction] += react.quantity;
          } else {
            // Nếu loại phản ứng chưa tồn tại, thêm vào memberReactionCounts
            memberReactionCounts[userId][react.typeReaction] = react.quantity;
          }
        } else {
          // Nếu thành viên chưa tồn tại, thêm vào memberReactionCounts và gán số lượng ban đầu
          memberReactionCounts[userId] = { [react.typeReaction]: react.quantity };
        }
      });
    });

    // Tính tổng số lượng phản ứng của mỗi thành viên
    let totalReactions = 0;
    Object.values(memberReactionCounts).forEach((member) => {
      Object.values(member).forEach((quantity) => {
        totalReactions += quantity;
      });
    });

    return totalReactions;
  };

  // show detail reaction
  const [selectedReactions, setSelectedReactions] = useState([]);
  // modal reaction
  const openModalReaction = () => {
    setModalVisibleReaction(true);
    setSelectedReactions(message.reaction);
    console.log("Reaction của message:", message.reaction);
    console.log("Id của message:", message._id);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModalReaction = () => {
    Animated.timing(slideAnim, {
      toValue: heightApp,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisibleReaction(false));
  };

  // delete all reaction with memberId
  const deleteAllReaction = async (messageId) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/messages/deleteReaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: messageId,
          memberId: findMemberIdByUserId(userData._id),
        }),
      });

      if (response.ok) {
        console.log("Xóa phản ứng thành công");
        socketRef.current.emit("sendMessage", { message: "Tin nhắn đã được thu hồi hết cảm xúc", room: conversation?._id });
        Alert.alert("Bạn đã gỡ cảm xúc ");
        setModalVisibleReaction(false);
        fetchData();
      } else {
        console.error("Xóa phản ứng thất bại:", response.statusText);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi xóa phản ứng:", error.message);
    }
  };

  // render detail reaction
  const renderReactionDetails = ({ item }) => {
    return (
      <View style={styles.reactionContainer}>
        {item?.memberId?.userId?.avatar && <Image source={{ uri: item.memberId.userId.avatar }} style={styles.avatarReaction} />}
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>{item?.memberId?.userId?.name}</Text>
          <View style={styles.reactionIconsContainer}>
            {item.reactions.map((reactionDetail, index) => (
              <View key={index} style={styles.reactionItem}>
                {/* Hiển thị biểu tượng phản ứng */}
                {renderReactionIcon(reactionDetail.typeReaction)}
                {/* Hiển thị số lượng của mỗi loại phản ứng */}
                <Text style={styles.reactionCount}>{reactionDetail.quantity}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  // Hàm để render icon phản ứng
  const renderReactionIcon = (typeReaction) => {
    switch (typeReaction) {
      case "Like":
        return <AntDesign name="like1" size={20} color="#F8B54B" style={styles.reactionIcon} />;
      case "Love":
        return <AntDesign name="heart" size={20} color="red" style={styles.reactionIcon} />;
      case "Smile":
        return <FontAwesome6 name="smile-beam" size={24} color="#F8B54B" style={styles.reactionIcon} />;
      case "Wow":
        return <FontAwesome5 name="surprise" size={24} color="#F8B54B" />;
      case "Sad":
        return <FontAwesome5 name="sad-cry" size={24} color="#40D0E8" style={styles.reactionIcon} />;
      case "Angry":
        return <MaterialCommunityIcons name="emoticon-angry" size={20} color="#CD462F" style={styles.reactionIcon} />;
      default:
        return null;
    }
  };

  const handleViewProfile = () => {
    navigation.navigate("XemTrangCaNhan", { user_id: message.memberId.userId._id });
  };

  const isMemberDeleted = (message, memberID) => {
    return message.deleteMember && message.deleteMember.includes(memberID);
  };

  return (
    <View>
      <View>
        <>
          {message.type === "notify" ? (
            renderNotifyMessage()
          ) : (
            <View style={[styles.rowContainer, { alignSelf: !isCurrentUserMessage ? "flex-start" : "flex-end" }]}>
              {!isCurrentUserMessage && !isMemberDeleted(message, findMemberIdByUserId(userData._id)) && (
                <TouchableOpacity onPress={handleViewProfile}>
                  <Image source={{ uri: avatar }} style={styles.avatar} />
                </TouchableOpacity>
              )}
              {!isMemberDeleted(message, findMemberIdByUserId(userData._id)) && (
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
                  {message.reaction && message.reaction.length > 0 && (
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        bottom: -12,
                        right: 20,
                        backgroundColor: "#fff",
                        borderRadius: 10,
                        paddingHorizontal: 5,
                        paddingVertical: 3,
                        flexDirection: "row",
                      }}
                      onPress={openModalReaction}>
                      {renderReactions(message.reaction)}
                      <Text style={{ fontSize: 12, color: "#000", fontWeight: "bold", marginLeft: 10 }}>
                        {calculateTotalReactions(message)}
                      </Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              )}

              <Modal transparent visible={modalVisibleReaction} onRequestClose={closeModalReaction}>
                <TouchableOpacity style={styles.modalBackgroundReaction} onPress={closeModalReaction}>
                  <Animated.View
                    style={{
                      position: "absolute",
                      top: 530,
                      right: 0,
                      transform: [{ translateY: slideAnim }],
                    }}>
                    <TouchableOpacity
                      onPress={() => deleteAllReaction(message._id)}
                      style={{
                        borderRadius: 30,
                        backgroundColor: "#fff",
                        height: 50,
                        width: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        margin: 10,
                      }}>
                      <Ionicons name="heart-dislike-outline" size={30} color="black" />
                    </TouchableOpacity>
                  </Animated.View>
                  <Animated.View style={[styles.modalContainerReaction, { transform: [{ translateY: slideAnim }] }]}>
                    <Text style={styles.modalTitle}>Cảm xúc</Text>
                    <FlatList
                      data={selectedReactions}
                      renderItem={renderReactionDetails}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </Animated.View>
                </TouchableOpacity>
              </Modal>
              <Modal
                isVisible={viewedImage !== null}
                onBackdropPress={() => setViewedImage(null)}
                backdropOpacity={0.8}
                style={{ margin: 0 }}>
                <View style={{ flex: 1, backgroundColor: "#000", paddingTop: 50 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, paddingHorizontal: 20 }}>
                    {message?.memberId?.userId?.avatar && (
                      <Image
                        source={{ uri: message?.memberId?.userId?.avatar }}
                        resizeMode="cover"
                        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                      />
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 5 }}>
                        {message?.memberId?.userId?.name}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#ccc" }}>{formatTimestamp(message.createAt)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => downloadAndSaveImage(message.content)} style={{ marginRight: 10 }}>
                      <AntDesign name="download" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Entypo name="dots-three-vertical" style={{ padding: 5 }} size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <TouchableWithoutFeedback onPress={() => setViewedImage(null)}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                      <ImageZoom cropWidth={zoomWidth} cropHeight={zoomHeight} imageWidth={zoomWidth} imageHeight={zoomHeight}>
                        <Image source={{ uri: viewedImage }} style={{ width: zoomWidth, height: zoomHeight }} resizeMode="contain" />
                      </ImageZoom>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableOpacity onPress={() => setViewedImage(null)} style={{ alignItems: "center", marginVertical: 20 }}>
                    <AntDesign name="closecircle" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </Modal>

              <Modal
                style={styles.modalContainer}
                isVisible={isModalVisible}
                onBackdropPress={toggleModal}
                backdropOpacity={0.5}
                animationIn="fadeIn"
                animationOut="fadeOut">
                <View style={[styles.modalContentIcon]}>
                  <TouchableOpacity onPress={() => handleAddReaction("Like", message._id, findMemberIdByUserId(userData._id))}>
                    <AntDesign name="like1" size={24} color="#F8B54B" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleAddReaction("Love", message._id, findMemberIdByUserId(userData._id))}>
                    <AntDesign name="heart" size={24} color="red" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleAddReaction("Smile", message._id, findMemberIdByUserId(userData._id))}>
                    <FontAwesome6 name="smile-beam" size={24} color="#F8B54B" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleAddReaction("Sad", message._id, findMemberIdByUserId(userData._id))}>
                    <FontAwesome5 name="sad-cry" size={24} color="#40D0E8" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleAddReaction("Wow", message._id, findMemberIdByUserId(userData._id))}>
                    <FontAwesome5 name="surprise" size={28} color="#F8B54B" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleAddReaction("Angry", message._id, findMemberIdByUserId(userData._id))}>
                    <MaterialCommunityIcons name="emoticon-angry" size={28} color="#CD462F" />
                  </TouchableOpacity>
                </View>
                <View style={[styles.modalContent]}>
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
                    {pinnedMessages.includes(message._id) ? (
                      <TouchableOpacity style={styles.modalItem} onPress={() => deletePin(message._id)}>
                        <View style={styles.icons}>
                          <MaterialCommunityIcons name="pin-off" size={26} color="#F39E65" />
                        </View>
                        <Text style={styles.content1}>Bỏ gim</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.modalItem} onPress={() => pushPin(message._id)}>
                        <View style={styles.icons}>
                          <AntDesign name="pushpin" size={26} color="#F39E65" />
                        </View>
                        <Text style={styles.content1}>Ghim</Text>
                      </TouchableOpacity>
                    )}

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
      </View>
    </View>
  );
}

export default function ChatScreen({ route }) {
  const flatListRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);

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
  const [pinMessages, setPinMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
      // console.log("Tin nhắn mới:", message);
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
        setMessages(data.messages);
        setLastMessageIndex(data.messages.length - 1);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: false });
      }, 200);
    }
  }, [messages]);

  const handleSizeChange = () => {
    if (!hasScrolled && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 200);
    }
  };

  const handleScrollBegin = () => {
    console.log("Đã bắt đầu cuộn");
    console.log(hasScrolled);
    setHasScrolled(true);
  };

  const findMemberId = () => {
    if (!conversation || !userData) return null;
    const member = conversation.members.find((member) => member.userId._id === userData._id);
    return member ? member._id : null;
  };

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

        // Gửi video ngay sau khi chọn
        await sendVideo(selectedVideoURIs);
      }
    } catch (error) {
      console.error("Lỗi khi chọn video từ thư viện:", error);
    }
  };

  const uploadVideoToS3 = async (videoUri) => {
    try {
      const response = await fetch(videoUri);
      const blob = await response.blob();
      const currentTime = new Date();
      const formattedTime = currentTime.toISOString().slice(0, 19).replace(/[-T:]/g, "");
      const milliseconds = currentTime.getMilliseconds();
      const filename = videoUri.split("/").pop();
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

  const sendVideo = async (videoUris) => {
    setIsLoading(true);
    try {
      const videoUrls = await Promise.all(videoUris.map(uploadVideoToS3));
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
      const messagePayload = {
        conversationId: conversationId,
        content: messageContent,
        memberId: findMemberId(),
        type: messageType,
      };

      if (repMessage) {
        console.log("Tin nhắn đã được trả lời");
        messagePayload.messageRepliedId = repMessage._id;
        response = await fetch(`${API_URL}/api/v1/messages/addReply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messagePayload),
        });
      } else {
        response = await fetch(`${API_URL}/api/v1/messages/addMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messagePayload),
        });
      }

      if (response.ok) {
        const responseData = await response.json();
        console.log("Tin nhắn đã được gửi:", responseData);
        setMessages((prevMessages) => [...prevMessages, responseData]);
        listenToMessages();
        setTextInputValue("");
        setSelectedVideo([]); // Đặt lại video đã chọn sau khi gửi
        setSelectedImages([]);
        setIsLoading(false);
        socketRef.current.emit("sendMessage", { message: messageContent, room: conversationId });
      } else {
        console.error("Lỗi khi gửi tin nhắn:", await response.json());
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
        console.log("Các ảnh đã chọn:", selectedImageURIs);
        setShowKeyboard(false);

        // Tải ảnh lên S3 và gửi ảnh ngay sau khi chọn
        const imageUrls = await Promise.all(selectedImageURIs.map(uploadImageToS3));
        await sendImage(imageUrls);
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
        console.log("Các ảnh đã chọn:", selectedImageURIs);

        // Tải ảnh lên S3 và gửi ảnh ngay sau khi chụp
        const imageUrls = await Promise.all(selectedImageURIs.map(uploadImageToS3));
        await sendImage(imageUrls);
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
  // send image
  const sendImage = async (imageUrls) => {
    setIsLoading(true);
    try {
      // Xác định loại tin nhắn và nội dung
      let messageType = "image";
      let messageContent = imageUrls.join(", ");

      let repMessage = messageRepply ? messageRepply : null;
      console.log("Nội dung", messageContent);
      console.log("ID", conversationId);
      console.log("MemberID", findMemberId());
      console.log("Type", messageType);
      console.log("repMessage", repMessage);
      console.log("ID Rep", repMessage?._id);

      let response;
      const messagePayload = {
        conversationId: conversationId,
        content: messageContent,
        memberId: findMemberId(),
        type: messageType,
      };

      if (repMessage) {
        console.log("Tin nhắn đã được trả lời");
        messagePayload.messageRepliedId = repMessage._id;
        response = await fetch(`${API_URL}/api/v1/messages/addReply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messagePayload),
        });
      } else {
        response = await fetch(`${API_URL}/api/v1/messages/addMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messagePayload),
        });
      }

      if (response.ok) {
        const responseData = await response.json();
        console.log("Tin nhắn đã được gửi:", responseData);
        setMessages((prevMessages) => [...prevMessages, responseData]);
        listenToMessages();
        Keyboard.dismiss();
        setTextInputValue("");
        setMessageRepply(null);
        setSelectedImages([]);
        setIsLoading(false);
        socketRef.current.emit("sendMessage", { message: messageContent, room: conversationId });
      } else {
        console.error("Lỗi khi gửi tin nhắn:", await response.json());
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const sendMessage = async () => {
    try {
      const imageUrls = await Promise.all(selectedImages.map(uploadImageToS3));
      let fileUrl = "";
      if (selectedFile && nameFile) {
        const encodedFileName = encodeURIComponent(nameFile);
        fileUrl = await uploadFileToS3(selectedFile, encodedFileName);
      }

      // Xác định loại tin nhắn và nội dung
      let messageType = "text";
      let messageContent = textInputValue;

      if (imageUrls.length > 0) {
        messageType = "image";
        messageContent = imageUrls.join(", ");
      } else if (fileUrl) {
        messageType = "file";
        messageContent = fileUrl;
        // Đặt lại selectedFile và nameFile sau khi gửi tệp
        setSelectedFile(null);
        setNameFile("");
      }

      let repMessage = messageRepply ? messageRepply : null;
      console.log("Nội dung", messageContent);
      console.log("ID", conversationId);
      console.log("MemberID", findMemberId());
      console.log("Type", messageType);
      console.log("repMessage", repMessage);
      console.log("ID Rep", repMessage?._id);

      let response;
      const messagePayload = {
        conversationId: conversationId,
        content: messageContent,
        memberId: findMemberId(),
        type: messageType,
      };

      if (repMessage) {
        console.log("Tin nhắn đã được trả lời");
        messagePayload.messageRepliedId = repMessage._id;
        response = await fetch(`${API_URL}/api/v1/messages/addReply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messagePayload),
        });
      } else {
        response = await fetch(`${API_URL}/api/v1/messages/addMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messagePayload),
        });
      }

      if (response.ok) {
        const responseData = await response.json();
        console.log("Tin nhắn đã được gửi:", responseData);
        setMessages((prevMessages) => [...prevMessages, responseData]);
        listenToMessages();
        Keyboard.dismiss();
        setTextInputValue("");
        setMessageRepply(null);
        setSelectedImages([]);
        socketRef.current.emit("sendMessage", { message: messageContent, room: conversationId });
      } else {
        console.error("Lỗi khi gửi tin nhắn:", await response.json());
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
  const goXemGhiAm = () => {};

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
  const uploadFileToS3 = async (fileUri, fileName) => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const currentTime = new Date();
      const formattedTime = currentTime.toISOString().slice(0, 19).replace(/[-T:]/g, "");
      const milliseconds = currentTime.getMilliseconds();
      // const encodedFileName = encodeURIComponent(fileName);
      // Tên tệp không cần mã hóa ở đây
      const s3FileName = `File_${formattedTime}_${milliseconds}/${fileName}`;
      console.log("File trước khi gửi lên S3", s3FileName);

      const params = {
        Bucket: S3_BUCKET_NAME,
        Key: s3FileName,
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

  const getFileTypeIcon = (fileExtension) => {
    let fileTypeIcon;
    const phanMoRong = renderPhanDuoi(fileExtension);
    // console.log("Phần mở rộng", phanMoRong);
    switch (phanMoRong) {
      case "doc":
      case "docx":
        fileTypeIcon = <AntDesign name="wordfile1" size={20} color="blue" />;
        break;
      case "pdf":
        fileTypeIcon = <AntDesign name="pdffile1" size={20} color="#F38A02" />;
        break;
      case "xls":
      case "xlsx":
        fileTypeIcon = <MaterialCommunityIcons name="file-excel-outline" size={20} color="black" />;
        break;
      case "csv":
        fileTypeIcon = <FontAwesome5 name="file-csv" size={20} color="green" />;
        break;
      case "txt":
        fileTypeIcon = <FontAwesome name="file-text" size={20} color="black" />;
        break;
      // Thêm các trường hợp khác ở đây tùy theo nhu cầu
      default:
        fileTypeIcon = <MaterialCommunityIcons name="file-outline" size={24} color="black" />;
        break;
    }
    return fileTypeIcon;
  };

  //reply
  function extractFileNameAndType(url, maxLength) {
    // Tách đường dẫn file thành các phần bằng '/'
    const parts = url.split("/");
    // Lấy phần cuối cùng của đường dẫn (tên file)
    const fileNameWithExtension = parts[parts.length - 1];
    // Tách phần tên file và loại file bằng cách tìm vị trí của dấu '.' trong tên file
    const dotIndex = fileNameWithExtension.lastIndexOf(".");
    const fileName = fileNameWithExtension.substring(0, dotIndex); // Tên file
    const fileType = fileNameWithExtension.substring(dotIndex + 1); // Loại file

    // Kiểm tra độ dài của tên file và cắt nếu quá dài
    const truncatedFileName = fileName.length > maxLength ? fileName.substring(0, maxLength) + "..." : fileName;

    return { fileName: truncatedFileName, fileType };
  }

  const renderPhanDuoi = (filePath) => {
    const { fileType } = extractFileNameAndType(filePath, 50);
    return fileType;
  };

  const renderFile = (filePath) => {
    const { fileName, fileType } = extractFileNameAndType(filePath, 50);
    // console.log("File name:", fileName);
    return (
      <Text>
        {fileName}.{fileType}
      </Text>
    );
  };

  //close reply
  const closeReply = () => {
    setMessageRepply(null);
  };

  // render for type message reply
  const renderReplyMessage = (message) => {
    if (message.type === "image") {
      return <Image source={{ uri: message.content }} style={{ width: 50, height: 50 }}></Image>;
    } else if (message.type === "audio") {
      return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="musical-notes" size={24} color="black" />
          <Text>Ghi âm</Text>
        </View>
      );
    } else if (message.type === "video") {
      return (
        <Video
          source={{ uri: message.content }} // Đường dẫn đến video của bạn
          style={{ width: 50, height: 50 }} // Kích thước video
          controls={true} // Hiển thị các điều khiển của video
          resizeMode="cover" // Chế độ thay đổi kích thước video
        />
      );
    } else if (message.type === "file") {
      return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {getFileTypeIcon(message.content)}
          <TouchableOpacity onPress={() => openFile(message.content)}>
            <Text style={styles.fileName}>{renderFile(message.content)}</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return <Text>{message.content}</Text>;
    }
  };
  // renderPin Message
  const renderPin = (message) => {
    const getMessageContent = () => {
      if (message.type === "image") {
        return (
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontSize: 16, color: "black" }}>[Hình Ảnh]</Text>
              <Text style={{ color: "#8C8C8E", fontSize: 13 }}>Tin nhắn của {message?.memberId?.userId?.name}</Text>
            </View>
            <Image source={{ uri: message.content }} style={{ width: 30, height: 30, borderRadius: 5 }} />
          </View>
        );
      } else if (message.type === "audio") {
        return (
          <View style={{ marginTop: 5 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="musical-notes" size={24} color="black" />
              <Text style={{ marginLeft: 5, fontSize: 16, color: "black" }}>Ghi âm</Text>
            </View>
            <Text style={{ color: "#8C8C8E", fontSize: 13 }}>Tin nhắn của {message?.memberId?.userId?.name}</Text>
          </View>
        );
      } else if (message.type === "video") {
        return (
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontSize: 16, color: "black" }}>[Video]</Text>
              <Text style={{ color: "#8C8C8E", fontSize: 13 }}>Tin nhắn của {message?.memberId?.userId?.name}</Text>
            </View>
            <Video
              source={{ uri: message.content }} // Đường dẫn đến video của bạn
              style={{ width: 30, height: 30, borderRadius: 5 }} // Kích thước video
              controls={true} // Hiển thị các điều khiển của video
              resizeMode="cover" // Chế độ thay đổi kích thước video
            />
          </View>
        );
      } else if (message.type === "file") {
        return (
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", padding: 5 }}>
              {getFileTypeIcon(message.content)}
              <TouchableOpacity onPress={() => openFile(message.content)}>
                <Text style={{ marginLeft: 5, fontSize: 16, color: "blue", textDecorationLine: "underline" }}>
                  {renderFile(message.content)}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: "#8C8C8E", fontSize: 13 }}>Tin nhắn của {message?.memberId?.userId?.name}</Text>
          </View>
        );
      } else {
        return (
          <View style={{ marginTop: 5 }}>
            <Text style={{ fontSize: 16, color: "black" }}>{message.content}</Text>
            <Text style={{ color: "#8C8C8E", fontSize: 13 }}>Tin nhắn của {message?.memberId?.userId?.name}</Text>
          </View>
        );
      }
    };

    return <View style={{ marginBottom: 10 }}>{getMessageContent()}</View>;
  };
  // render Pin in modal
  const renderPinModal = (message) => {
    const getMessageContent = () => {
      if (message.type === "image") {
        return (
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontSize: 16, color: "black" }}>[Hình Ảnh]</Text>
              <Text style={{ color: "#8C8C8E", fontSize: 13 }}>Tin nhắn của {message?.memberId?.userId?.name}</Text>
            </View>
            <Image source={{ uri: message.content }} style={{ width: 45, height: 45, borderRadius: 5 }} />
          </View>
        );
      } else if (message.type === "audio") {
        return (
          <View style={{ marginTop: 5 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="musical-notes" size={24} color="black" />
              <Text style={{ marginLeft: 5, fontSize: 16, color: "black" }}>Ghi âm</Text>
            </View>
            <Text style={{ color: "#8C8C8E", fontSize: 13 }}>Tin nhắn của {message?.memberId?.userId?.name}</Text>
          </View>
        );
      } else if (message.type === "video") {
        return (
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontSize: 16, color: "black" }}>[Video]</Text>
              <Text style={{ color: "#8C8C8E", fontSize: 13 }}>Tin nhắn của {message?.memberId?.userId?.name}</Text>
            </View>
            <Video
              source={{ uri: message.content }} // Đường dẫn đến video của bạn
              style={{ width: 45, height: 45, borderRadius: 5 }} // Kích thước video
              controls={true} // Hiển thị các điều khiển của video
              resizeMode="cover" // Chế độ thay đổi kích thước video
            />
          </View>
        );
      } else if (message.type === "file") {
        return (
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", padding: 5 }}>
              {getFileTypeIcon(message.content)}
              <TouchableOpacity onPress={() => openFile(message.content)}>
                <Text style={{ marginLeft: 5, fontSize: 16, color: "blue", textDecorationLine: "underline" }}>
                  {renderFile(message.content)}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: "#8C8C8E", fontSize: 13 }}>Tin nhắn của {message?.memberId?.userId?.name}</Text>
          </View>
        );
      } else {
        return (
          <View>
            <Text style={{ fontSize: 16, color: "black" }}>{message.content}</Text>
            <Text style={{ color: "#8C8C8E", fontSize: 13 }}>Tin nhắn của {message?.memberId?.userId?.name}</Text>
          </View>
        );
      }
    };

    return <View style={{ marginBottom: 10 }}>{getMessageContent()}</View>;
  };
  // Di chuyển logic vào một custom hook
  const [showAllPinnedMessages, setShowAllPinnedMessages] = useState(false);
  const useFetchPinnedMessages = (pinnedMessages) => {
    const [lastPinnedMessage, setLastPinnedMessage] = useState(null);
    const [messages, setMessages] = useState([]);
    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const newMessages = await Promise.all(
            pinnedMessages.map(async (messageId) => {
              const response = await fetch(`${API_URL}/api/v1/messages/getMessageById/${messageId}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });

              if (!response.ok) {
                console.error(`Error fetching message ${messageId}: ${response.statusText}`);
                return null;
              }
              const data = await response.json();
              return data;
            })
          );

          // Filter out null messages
          const filteredMessages = newMessages.filter((message) => message !== null);
          setMessages(filteredMessages);
          setLastPinnedMessage(filteredMessages[0]);
        } catch (error) {
          console.error("Error fetching pinned messages:", error);
        }
      };

      fetchMessages();
    }, [pinnedMessages]);

    return { messages, lastPinnedMessage };
  };
  const handleToggleAllMessages = () => {
    setShowAllPinnedMessages(!showAllPinnedMessages);
    console.log("showAllPinnedMessages", showAllPinnedMessages);
  };
  // delete pin
  const deletePin = async (messageId) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/messages/deletePinMessageToConversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: messageId,
          conversationId: conversation._id,
        }),
      });

      // Kiểm tra xem yêu cầu đã thành công hay không
      if (response.ok) {
        const memberID = findMemberId();
        try {
          const response = await axios.post(`${API_URL}/api/v1/messages/addMessageWeb`, {
            conversationId: conversation._id,
            content: `${userData.name.split(" ").slice(-1)[0]} đã gỡ ghim một tin nhắn.`,
            memberId: memberID,
            type: "notify",
          });
        } catch (error) {
          console.error("Error creating conversation:", error);
        }
        console.log("Bỏ ghim tin nhắn thành công");
        socketRef.current.emit("sendMessage", { message: "Tin nhắn ghim đã xóa", room: conversation?._id });
        setShowAllPinnedMessages(false);
        fetchData();
      } else {
        console.error("Bỏ ghim tin nhắn thất bại:", response.statusText);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi gửi yêu cầu bỏ ghim tin nhắn:", error.message);
    }
  };

  const RenderPinMessage = ({ pinnedMessages }) => {
    const { messages, lastPinnedMessage } = useFetchPinnedMessages(pinnedMessages);
    const renderItem = ({ item }) => (
      <View style={styles.pinMessage}>
        <View>
          <AntDesign name="message1" size={26} color="#2A89E5" />
        </View>
        <View style={{ width: 250 }}>{renderPin(item)}</View>
        <View style={{ height: 40, width: 1, backgroundColor: "#E1E1E1" }}></View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: 55,
            height: 30,
            borderWidth: 1,
            borderRadius: 20,
            alignItems: "center",
            borderBlockColor: "#7A7F82",
          }}
          onPress={handleToggleAllMessages}>
          {conversation.pinMessages.length - 1 === 0 ? (
            <AntDesign name="down" size={20} color="#7A7F82" />
          ) : (
            <>
              <Text>+{conversation.pinMessages.length - 1}</Text>
              <AntDesign name="down" size={20} color="#7A7F82" />
            </>
          )}
        </TouchableOpacity>
      </View>
    );

    return (
      <View>
        {!showAllPinnedMessages && (
          <FlatList
            data={lastPinnedMessage ? [lastPinnedMessage] : []}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
        {showAllPinnedMessages && (
          <Modal
            swipeDirection={["down"]}
            animationIn="fadeIn"
            animationOut="fade"
            transparent={true}
            visible={showAllPinnedMessages}
            onRequestClose={() => {
              setShowAllPinnedMessages(false);
            }}>
            <View style={styles.modalContainerghim}>
              <View style={styles.modalContentghim}>
                <View style={{ width: 350, height: 30, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>Danh sách ghim</Text>
                </View>
                <View style={{ width: "100%", height: 0.5, backgroundColor: "gray" }}></View>
                <FlatList
                  data={messages}
                  renderItem={({ item }) => (
                    <View>
                      <View style={styles.pinMessage2}>
                        <View>
                          <AntDesign name="message1" size={26} color="#2A89E5" style={{ marginLeft: 20 }} />
                        </View>
                        <View style={{ width: 320 }}>{renderPinModal(item)}</View>
                        <TouchableOpacity>
                          <MaterialCommunityIcons onPress={() => deletePin(item._id)} name="delete-outline" size={24} color="black" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
              <TouchableOpacity
                style={{ width: 80, height: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                onPress={() => setShowAllPinnedMessages(false)}>
                <Text style={{ color: "#fff" }}>Thu gọn</Text>
                <AntDesign name="up" size={20} color="#fff" style={{ paddingTop: 5 }} />
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF" }}>
        <ActivityIndicator size="large" color="#0091FF" />
        <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "400", color: "#0091FF" }}>Đang tải..</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={styles.container}>
        <View style={styles.header} />
        {conversation.pinMessages && <RenderPinMessage pinnedMessages={conversation.pinMessages} />}
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: "#F2F2F2" }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={88}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => {
              const isCurrentUserMessage = item.memberId?.userId?._id === userData?._id;
              const replyMessage = messageRepply;
              return (
                <MessageBubble
                  {...item}
                  message={item}
                  conversation={conversation}
                  userData={userData}
                  isCurrentUserMessage={isCurrentUserMessage}
                  setConversation={setConversation}
                  socketRef={socketRef}
                  listenToMessages={listenToMessages}
                  setMessageRepply={setMessageRepply}
                  replyMessage={replyMessage}
                  fetchData={fetchData}
                  pinnedMessages={conversation.pinMessages}
                />
              );
            }}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: 10, gap: 5 }}
            onContentSizeChange={handleSizeChange}
            onScrollBeginDrag={handleScrollBegin}
          />
          <View style={styles.header} />
          {messageRepply && (
            <View style={styles.Reply}>
              <View style={styles.replyContent}>
                <Text style={styles.nameReply}>{messageRepply.memberId.userId?.name}</Text>
                {renderReplyMessage(messageRepply)}
              </View>
              <AntDesign onPress={closeReply} name="close" size={24} color="black" />
            </View>
          )}

          <View style={[styles.inputContainer, { backgroundColor: "#FFF" }]}>
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
              <Button title="Nhấn giữ để ghi âm" onPress={goXemGhiAm}></Button>
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
    height: 12,
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
    backgroundColor: "blue",
    marginBottom: 5,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
    top: 500,
    left: 60,
  },
  modalContentIcon: {
    width: 250,
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
    position: "absolute",
    borderRadius: 20,
    elevation: 5,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    top: 440,
    left: 60,
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
    marginTop: 10,
    justifyContent: "space-between", // Khoảng cách với các phần khác
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
    paddingLeft: 4,
    fontWeight: "400",
  },
  pinMessage: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#FFF",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "96%",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pinMessage2: {
    backgroundColor: "#fff",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "98%",
    borderRadius: 10,
    marginTop: 5,
  },
  //modal ghim
  toggleButton: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 55,
    height: 30,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    borderColor: "#7A7F82",
  },
  modalContainerghim: {
    position: "absolute",
    top: -25,
    left: -23,
    right: -23,
    bottom: -25,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentghim: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 70,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#2A89E5",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  //modal reaction
  modalBackgroundReaction: {
    position: "absolute",
    top: -22,
    left: -22,
    right: -22,
    bottom: -22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainerReaction: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 300,
  },
  reactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarReaction: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  memberDetails: {
    flexDirection: "column",
  },
  memberName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  reactionIconsContainer: {
    flexDirection: "row",
  },
  reactionIcon: {
    marginRight: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10, // Khoảng cách giữa tiêu đề và danh sách cảm xúc
  },
  reactionIconsContainer: {
    flexDirection: "row",
  },
  reactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  reactionCount: {
    marginLeft: 5,
    fontSize: 14,
  },
  reactionIcon: {
    marginRight: 5,
  },
});
