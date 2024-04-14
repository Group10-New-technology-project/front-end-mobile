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
} from "react-native";
import Input from "../../components/InputChat";
import Modal from "react-native-modal";
import { AntDesign, Ionicons, Entypo, MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
const heightApp = Dimensions.get("window").height;
const widthApp = Dimensions.get("window").width;

function MessageBubble({ member, content, avatar, createAt }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalX, setModalX] = useState(0);
  const [modalY, setModalY] = useState(0);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const openModal = (event) => {
    console.log("Open modal");
    setModalVisible(true);
    setModalX(event.nativeEvent.pageX - 150);
    setModalY(event.nativeEvent.pageY);
  };

  const formattedTime = new Date(createAt.$date).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  return (
    <View style={[styles.rowContainer, { alignSelf: member === "user" ? "flex-start" : "flex-end" }]}>
      {member !== "bot" && <Image source={{ uri: avatar }} style={styles.avatar} />}
      <TouchableOpacity
        style={[styles.message_container, { backgroundColor: member === "user" ? "#FFFF" : "#CCF3FF" }]}
        onLongPress={openModal}>
        <Text style={styles.messageText}>{content}</Text>
        <Text style={styles.timeText}>{formattedTime}</Text>
      </TouchableOpacity>
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
                <Ionicons name="copy" size={35} color="#FF9900" />
              </View>
              <Text style={styles.content1}>Sao chép</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
              <View style={styles.icons}>
                <Entypo name="reply" size={40} color="#E318D1" />
              </View>
              <Text style={styles.content1}>Trả lời</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
              <View style={[styles.icons, { transform: [{ rotate: "deg" }] }]}>
                <Entypo name="forward" size={40} color="#004D9A" />
              </View>
              <Text style={styles.content1}>Chuyển tiếp</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalItems}>
            <TouchableOpacity style={styles.modalItem}>
              <View style={styles.icons}>
                <MaterialIcons name="delete" size={38} color="#797979" />
              </View>
              <Text style={styles.content1}>Xóa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
              <View style={styles.icons}>
                <MaterialIcons name="restore" size={40} color="#1DBC5D" />
              </View>
              <Text style={styles.content1}>Thu hồi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
              <View style={styles.icons}>
                <FontAwesome6 name="cloud-arrow-down" size={28} color="#00A3FF" />
              </View>
              <Text style={styles.content1}>Lưu cloud</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalItems}>
            <TouchableOpacity style={styles.modalItem}>
              <View style={styles.icons}>
                <AntDesign name="exclamationcircle" size={32} color="#4D4D4D" />
              </View>
              <Text style={styles.content1}>Coming</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
              <View style={styles.icons}>
                <AntDesign name="exclamationcircle" size={32} color="#4D4D4D" />
              </View>
              <Text style={styles.content1}>Coming</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
              <View style={styles.icons}>
                <AntDesign name="exclamationcircle" size={32} color="#4D4D4D" />
              </View>
              <Text style={styles.content1}>Coming</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function ChatChanh({}) {
  const flatListRef = useRef();

  useEffect(() => {
    flatListRef.current.scrollToEnd({ animated: true });
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Zelo chat</Text>
        </View>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
          <FlatList
            ref={flatListRef}
            data={conversation}
            renderItem={({ item }) => <MessageBubble {...item} />}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: 10, gap: 10 }}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })} // Tự động cuộn xuống khi nội dung thay đổi
          />
          <View style={styles.input_container}>
            <Input />
          </View>
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
    height: 40,
    backgroundColor: "pink",
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
});

const conversation = [
  {
    id: 1,
    member: "bot",
    content: "Xin chào 😂",
    createAt: { $date: "2024-04-08T11:53:49.156Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    id: 2,
    member: "bot",
    content: "Xin chào 😂",
    createAt: { $date: "2024-04-08T11:53:49.156Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    id: 3,
    member: "user",
    content: "Tôi đang ở trung tâm thành phố San Francisco.",
    createAt: { $date: "2024-04-08T11:54:37.724Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    id: 4,
    member: "user",
    content: "Tôi không cần trợ lý ảo.",
    createAt: { $date: "2024-04-08T11:56:24.814Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    id: 5,
    member: "bot",
    content: "Tôi sẽ giúp bạn, bạn cứ thử xem.",
    createAt: { $date: "2024-04-08T11:56:49.912Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    id: 6,
    member: "user",
    content: "Tôi cần một chiếc xe.",
    createAt: { $date: "2024-04-08T11:57:17.015Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    id: 7,
    member: "bot",
    content: "Tôi sẽ gọi cho bạn một chiếc xe.",
    createAt: { $date: "2024-04-08T11:57:43.110Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    id: 8,
    member: "user",
    content: "Cảm ơn bạn.",
    createAt: { $date: "2024-04-08T11:58:12.206Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    id: 9,
    member: "bot",
    content: "Không có gì.",
    createAt: { $date: "2024-04-08T11:58:37.305Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    id: 10,
    member: "bot",
    content: "Không có gì.",
    createAt: { $date: "2024-04-08T11:58:37.305Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    id: 11,
    member: "user",
    content: "Không có gì.",
    createAt: { $date: "2024-04-08T11:58:37.305Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },

  {
    id: 12,
    member: "user",
    content: "Không có gì.",
    createAt: { $date: "2024-04-08T11:58:37.305Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
];
