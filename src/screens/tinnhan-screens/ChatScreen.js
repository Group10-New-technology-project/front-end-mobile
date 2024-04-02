import React, { useState } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native";

function ChatScreen({ route }) {
  const { userCurrent, contact } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{
        _id: userCurrent.id, // Sử dụng ID của user hiện tại làm người gửi
      }}
      renderAvatar={(props) => {
        // Kiểm tra xem tin nhắn hiện tại có phải từ người gửi hay không
        const isSender = props.currentMessage.user._id === userCurrent.id;
        console.log(currentMessage.user.id);
        console.log(userCurrent.id);
        return (
          <View>
            <Text>A7</Text>
            <Image
              source={isSender ? userCurrent.image : contact.image}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          </View>
        );
      }}
    />
  );
}

export default ChatScreen;
