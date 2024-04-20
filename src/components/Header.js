import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function Header({ userData, status }) {
  const navigation = useNavigation();
  const displayName = userData?.[0]?.name || "Không rõ";
  const statusName = status || "Không rõ";

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.title_tinnhan}>
          <Text style={styles.text_username}>{displayName}</Text>
          <Text style={styles.text_online}>{statusName}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity style={styles.icon_menu}>
          <Ionicons name="call-outline" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon_menu}>
          <Ionicons name="videocam-outline" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon_menu}>
          <Ionicons name="list" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
export const styles = StyleSheet.create({
  container: {
    // backgroundColor: "green",
    width: Dimensions.get("window").width - 40,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  title_tinnhan: {
    paddingLeft: 10,
  },
  text_username: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 18,
  },
  text_online: {
    color: "#D0D0D0",
    fontWeight: "300",
    fontSize: 13,
  },
  icon_menu: {
    marginHorizontal: 8,
  },
  icon_s22: {
    width: 22,
    height: 22,
  },
});
