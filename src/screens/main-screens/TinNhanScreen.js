import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";

export default function TinNhanScreen({ navigation }) {
  const user_Curren = {
    id: 111,
    name: "Cris",
    message: [{}],
    img: require("../main-screens/image/Abstract1998.png"),
  };
  const [data, setData] = React.useState([
    {
      id: 1,
      name: "DyyBin",
      image: require("../main-screens/image/Abstract1998.png"),
      message: [
        { id: 1, content: "Hello", day_time: "2021-10-10T10:10:10" },
        { id: 2, content: "Hi", day_time: "2021-10-10T10:10:10" },
        { id: 3, content: "Trả tiền bạn eii", day_time: "2021-10-10T10:10:10" },
      ],
      seen: false,
    },
    {
      id: 2,
      name: "Anh 7",
      image: require("../main-screens/image/Abstract1998.png"),
      message: [
        { id: 1, content: "Hello", day_time: "2021-10-10T10:10:10" },
        { id: 2, content: "Hi", day_time: "2021-10-10T10:10:10" },
        { id: 3, content: "Cuộc gọi nhỡ", day_time: "2021-10-10T10:10:10" },
      ],
      seen: false,
    },
    {
      id: 3,
      name: "DyyBin",
      image: require("../main-screens/image/Abstract1998.png"),
      message: [
        { id: 1, content: "Hello", day_time: "2021-10-10T10:10:10" },
        { id: 2, content: "Hi", day_time: "2021-10-10T10:10:10" },
        { id: 3, content: "Hello", day_time: "2021-10-10T10:10:10" },
      ],
      seen: false,
    },
    {
      id: 4,
      name: "DyyBin",
      image: require("../main-screens/image/Abstract1998.png"),
      message: [
        { id: 1, content: "Hello", day_time: "2021-10-10T10:10:10" },
        { id: 2, content: "Hi", day_time: "2021-10-10T10:10:10" },
        { id: 3, content: "Bye bye", day_time: "2021-10-10T10:10:10" },
      ],
      seen: false,
    },
    {
      id: 5,
      name: "DyyBin",
      image: require("../main-screens/image/Abstract1998.png"),
      message: [
        { id: 1, content: "Hello", day_time: "2021-10-10T10:10:10" },
        { id: 2, content: "Hi", day_time: "2021-10-10T10:10:10" },
        { id: 3, content: "Bắt M.U 2 lít", day_time: "2021-10-10T10:10:10" },
      ],
      seen: false,
    },
    {
      id: 6,
      name: "DyyBin",
      image: require("../main-screens/image/Abstract1998.png"),
      message: [
        { id: 1, content: "Hello", day_time: "2021-10-10T10:10:10" },
        { id: 2, content: "Hi", day_time: "2021-10-10T10:10:10" },
        { id: 3, content: "Đâu rồi", day_time: "2021-10-10T10:10:10" },
      ],
      seen: false,
    },
    {
      id: 7,
      name: "DyyBin",
      image: require("../main-screens/image/Abstract1998.png"),
      message: [
        { id: 1, content: "Hello", day_time: "2021-10-10T10:10:10" },
        { id: 2, content: "Hi", day_time: "2021-10-10T10:10:10" },
        { id: 3, content: "mai bank nha", day_time: "2021-10-10T10:10:10" },
      ],
      seen: false,
    },
    {
      id: 8,
      name: "DyyBin",
      image: require("../main-screens/image/Abstract1998.png"),
      message: [
        { id: 1, content: "Hello", day_time: "2021-10-10T10:10:10" },
        { id: 2, content: "Hi", day_time: "2021-10-10T10:10:10" },
        { id: 3, content: "Mai cf nha", day_time: "2021-10-10T10:10:10" },
      ],
      seen: false,
    },
    {
      id: 9,
      name: "DyyBin",
      image: require("../main-screens/image/Abstract1998.png"),
      message: [
        { id: 1, content: "Hello", day_time: "2021-10-10T10:10:10" },
        { id: 2, content: "Hi", day_time: "2021-10-10T10:10:10" },
        { id: 3, content: "Mai cf nha", day_time: "2021-10-10T10:10:10" },
      ],
      seen: false,
    },
    {
      id: 10,
      name: "DyyBin",
      image: require("../main-screens/image/Abstract1998.png"),
      message: [
        { id: 1, content: "Hello", day_time: "2021-10-10T10:10:10" },
        { id: 2, content: "Hi", day_time: "2021-10-10T10:10:10" },
        { id: 3, content: "Mai cf nha", day_time: "2021-10-10T10:10:10" },
      ],
      seen: false,
    },
  ]);

  const handleContactPress = (contact) => {
    navigation.navigate("ChatScreen", { userCurrent: user_Curren, contact: contact });
    console.log(contact);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const messageColor = item.seen ? "#555" : "#000";
          return (
            <TouchableOpacity style={styles.cssMessage} onPress={() => handleContactPress(item)}>
              <Image source={item.image} style={{ width: 50, height: 50, borderRadius: 50 }} />
              <View style={styles.section_header}>
                <Text style={styles.text_name}>{item.name}</Text>
                <Text style={[styles.text_message, { color: messageColor }]}>
                  {item.message[item.message.length - 1].content}
                </Text>
              </View>
              <Text>{item.message[item.message.length - 1].day_time}</Text>
            </TouchableOpacity>
          );
        }}></FlatList>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center'
  },
  cssMessage: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    // justifyContent: 'space-between',
    padding: 10,
  },
  section_header: {
    flex: 1,
    paddingLeft: 10,
  },
  text_name: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },
  text_message: {
    fontSize: 15,
    color: "#000",
  },
});
