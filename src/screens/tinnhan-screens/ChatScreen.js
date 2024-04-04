import React, { useState, useEffect } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { Image, View, Text } from "react-native";

function ChatScreen({ route }) {
  const { userCurrent, contact } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (contact && contact.message && contact.message.length > 0) {
      const processedMessages = contact.message.map((msg) => {
        const messageUser = msg.user ? msg.user : contact; // Sử dụng thông tin người gửi từ tin nhắn hoặc từ contact
        console.log("Message User:", messageUser); // In ra thông tin của người gửi
        return {
          ...msg,
          _id: msg.id.toString(),
          text: msg.content,
          user: {
            _id: messageUser._id,
            name: messageUser.name,
            avatar: messageUser.avatar,
          },
        };
      });
      setMessages(processedMessages);
    }
  }, [contact]);
  const onSend = (newMessages = []) => {
    const updatedMessages = newMessages.map((msg) => ({
      ...msg,
      _id: Math.random().toString(),
      user: {
        _id: userCurrent.id,
        name: userCurrent.name,
        avatar: userCurrent.avatar,
      },
    }));
    setMessages((prevMessages) => GiftedChat.append(prevMessages, updatedMessages));
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{
        _id: userCurrent.id,
        name: userCurrent.name,
        avatar: userCurrent.avatar,
      }}
      renderBubble={(props) => (
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: '#f0f0f0',
            },
            right: {
              backgroundColor: '#007AFF',
            },
          }}
        >
          <Text>{props.currentMessage.text}</Text>
        </Bubble>
      )}
      renderAvatar={(props) => {
        const { currentMessage } = props;
        return (
          <Image
            source={{ uri: currentMessage.user.avatar }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        );
      }}
      renderMessage={(props) => {
        const { currentMessage } = props;
        if (currentMessage.user._id === userCurrent.id) {
          return (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              {props.renderAvatar({ ...props, position: 'right' })}
              {props.renderBubble(props)}
            </View>
          );
        }
        return (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            {props.renderAvatar({ ...props, position: 'left' })}
            {props.renderBubble(props)}
          </View>
        );
      }}
    />
  );
}

export default ChatScreen;
