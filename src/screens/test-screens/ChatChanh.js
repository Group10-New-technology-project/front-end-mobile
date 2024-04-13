import React, { useRef, useEffect } from "react";
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View, Image } from "react-native";
import Input from "../../components/InputChat";

function MessageBubble({ member, content, avatar, createAt }) {
  const formattedTime = new Date(createAt.$date).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  return (
    <View style={[styles.rowContainer, { alignSelf: member === "user" ? "flex-start" : "flex-end" }]}>
      {member !== "bot" && <Image source={{ uri: avatar }} style={styles.avatar} />}
      <View style={[styles.message_container, { backgroundColor: member === "user" ? "#FFFF" : "#CCF3FF" }]}>
        <Text style={styles.messageText}>{content}</Text>
        <Text style={styles.timeText}>{formattedTime}</Text>
      </View>
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
    backgroundColor: "#F0F0F0",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
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
    // flexDirection: "row",
    // alignItems: "center",
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
});

const conversation = [
  {
    member: "bot",
    content: "Xin chào 😂",
    createAt: { $date: "2024-04-08T11:53:49.156Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    member: "bot",
    content: "Xin chào 😂",
    createAt: { $date: "2024-04-08T11:53:49.156Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    member: "user",
    content: "Tôi đang ở trung tâm thành phố San Francisco.",
    createAt: { $date: "2024-04-08T11:54:37.724Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    member: "user",
    content: "Tôi không cần trợ lý ảo.",
    createAt: { $date: "2024-04-08T11:56:24.814Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    member: "bot",
    content: "Tôi sẽ giúp bạn, bạn cứ thử xem.",
    createAt: { $date: "2024-04-08T11:56:49.912Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    member: "user",
    content: "Tôi cần một chiếc xe.",
    createAt: { $date: "2024-04-08T11:57:17.015Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    member: "bot",
    content: "Tôi sẽ gọi cho bạn một chiếc xe.",
    createAt: { $date: "2024-04-08T11:57:43.110Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    member: "user",
    content: "Cảm ơn bạn.",
    createAt: { $date: "2024-04-08T11:58:12.206Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    member: "bot",
    content: "Không có gì.",
    createAt: { $date: "2024-04-08T11:58:37.305Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    member: "bot",
    content: "Không có gì.",
    createAt: { $date: "2024-04-08T11:58:37.305Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    member: "user",
    content: "Không có gì.",
    createAt: { $date: "2024-04-08T11:58:37.305Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },

  {
    member: "user",
    content: "Không có gì.",
    createAt: { $date: "2024-04-08T11:58:37.305Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    member: "user",
    content: "Không có gì.",
    createAt: { $date: "2024-04-08T11:58:37.305Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    member: "user",
    content: "Không có gì.",
    createAt: { $date: "2024-04-08T11:58:37.305Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
  {
    member: "user",
    content: "Không có gì.",
    createAt: { $date: "2024-04-08T11:58:37.305Z" },
    avatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_0-21-30.png",
  },
];
