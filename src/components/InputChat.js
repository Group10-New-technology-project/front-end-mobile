import React, { useState, useEffect } from "react";
import { TextInput, StyleSheet, Dimensions, View, TouchableOpacity, Text, Button, Keyboard, SafeAreaView } from "react-native";
import { MaterialCommunityIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { set } from "firebase/database";

const heightApp = Dimensions.get("window").height;
const widthApp = Dimensions.get("window").width;

export default function Input() {
  const [showOthers, setShowOthers] = useState(false);
  const [showMicro, setShowMicro] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");

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
  };
  handleSendMessage = () => {
    Keyboard.dismiss();
    setTextInputValue("");
    setIsTyping(false);
  };
  return (
    <SafeAreaView style={styles.container}>
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
            <TouchableOpacity onPress={handleShowImage}>
              <Ionicons name="image-outline" size={28} color="gray" />
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity onPress={handleSendMessage}>
          <MaterialCommunityIcons name="send" size={28} color="#0091FF" />
        </TouchableOpacity>
      </View>
      {showMicro && (
        <View style={{ height: 268, backgroundColor: "green" }}>
          <Text>Micro</Text>
        </View>
      )}
      {showOthers && (
        <View style={{ height: 268, backgroundColor: "pink" }}>
          <Text>Other</Text>
        </View>
      )}
      {showImage && (
        <View style={{ height: 268, backgroundColor: "yellow" }}>
          <Text>Image</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});