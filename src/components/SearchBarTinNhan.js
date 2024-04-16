import React, { useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

export default function SearchBarTinNhan() {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleCaiDat = () => {
    console.log("Cài đặt");
    navigation.navigate("CaiDat");
  };
  const handleAdd = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSearchInputPress = () => {
    navigation.navigate("TimKiem", { searchPhone: "123" });
  };

  const handleTaoNhom = () => {
    setModalVisible(!isModalVisible);
    console.log("Tạo nhóm");
    navigation.navigate("TaoNhom");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.search_icon} onPress={handleSearchInputPress}>
        <View style={{ marginRight: 20 }}>
          <Feather name="search" size={22} color="white" />
        </View>
        <Text style={styles.text_search}>Tìm kiếm</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={handleCaiDat}>
          <Ionicons style={{ marginRight: 8 }} name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAdd}>
          <Ionicons name="add-sharp" size={30} color="white" />
        </TouchableOpacity>
      </View>
      {/* Modal */}
      <Modal
        style={styles.modalContainer}
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        backdropOpacity={0.5}
        animationIn="fadeInDown"
        animationOut="fadeOutUp">
        <View style={styles.modalSize}>
          <TouchableOpacity style={styles.content_container} onPress={handleAdd}>
            <MaterialCommunityIcons name="account-plus-outline" size={25} color="gray" />
            <Text style={styles.content_2}>Thêm bạn</Text>
          </TouchableOpacity>
          <View style={{ borderWidth: 0.5, borderColor: "#E8E8E8" }} />
          <TouchableOpacity style={styles.content_container} onPress={handleTaoNhom}>
            <MaterialCommunityIcons name="account-plus-outline" size={25} color="gray" />
            <Text style={styles.content_2}>Tạo nhóm</Text>
          </TouchableOpacity>
          <View style={{ borderWidth: 0.5, borderColor: "#E8E8E8" }} />
          <TouchableOpacity style={styles.content_container} onPress={handleAdd}>
            <MaterialCommunityIcons name="account-plus-outline" size={25} color="gray" />
            <Text style={styles.content_2}>Cloud của tôi</Text>
          </TouchableOpacity>
          <View style={{ borderWidth: 0.5, borderColor: "#E8E8E8" }} />
          <TouchableOpacity style={styles.content_container} onPress={handleAdd}>
            <MaterialCommunityIcons name="account-plus-outline" size={25} color="gray" />
            <Text style={styles.content_2}>Lịch Zalo</Text>
          </TouchableOpacity>
          <View style={{ borderWidth: 0.5, borderColor: "#E8E8E8" }} />
          <TouchableOpacity style={styles.content_container} onPress={handleAdd}>
            <MaterialCommunityIcons name="account-plus-outline" size={25} color="gray" />
            <Text style={styles.content_2}>Tạo cuộc gọi nhóm</Text>
          </TouchableOpacity>
          <View style={{ borderWidth: 0.5, borderColor: "#E8E8E8" }} />
          <TouchableOpacity style={styles.content_container} onPress={handleAdd}>
            <MaterialCommunityIcons name="account-plus-outline" size={25} color="gray" />
            <Text style={styles.content_2}>Thiết bị đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: Dimensions.get("window").width,
    paddingHorizontal: 18,
  },
  search_icon: {
    flexDirection: "row",
    alignItems: "center",
  },
  text_search: {
    fontSize: 18,
    fontWeight: "400",
    color: "white",
    width: 250,
  },
  modalContainer: {
    right: 0,
    top: 80,
    position: "absolute",
  },
  modalSize: {
    backgroundColor: "white",
    width: Dimensions.get("window").width * 0.6,
    height: 295,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  content_2: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "400",
  },
  content_container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
});