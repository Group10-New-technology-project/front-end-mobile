import { useState } from "react";
import { View, TextInput, StyleSheet, Dimensions, TouchableOpacity, Text } from "react-native";
import Modal from "react-native-modal";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// --------------
export default function SearchBar() {
  const navigation = useNavigation();

  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };

  const handleSearchInputPress = () => {
    setIsBottomSheetVisible(true);
  };
  const handleCaiDat = () => {
    console.log("Cài đặt");
    navigation.navigate("CaiDat");
  };
  const handleQR = () => {
    navigation.navigate("QRCodeScreen");
    console.log("QR");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.search_icon} onPress={handleSearchInputPress}>
        <View style={{ marginRight: 10 }}>
          <Feather name="search" size={22} color="white" />
        </View>

        <TextInput
          style={styles.input_search}
          placeholder="Tìm kiếm"
          placeholderTextColor="white"
        />
      </TouchableOpacity>

      <View style={{ flexDirection: "row", alignItems: "center", paddingRight: 40 }}>
        <TouchableOpacity onPress={handleCaiDat}>
          <Ionicons style={{ marginRight: 14 }} name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleQR}>
          <MaterialCommunityIcons name="qrcode-scan" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <Modal
        style={styles.modal_container}
        isVisible={isBottomSheetVisible}
        swipeDirection={["down"]}
        onSwipeComplete={toggleBottomSheet}
        onBackdropPress={toggleBottomSheet}>
        <View style={styles.modal_size}>
          <View style={styles.line_modal}></View>
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
    // backgroundColor: "pink",
  },
  search_icon: {
    flexDirection: "row",
    alignItems: "center",
  },
  input_search: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
    width: Dimensions.get("window").width * 0.5,
  },
  modal_size: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 20,
    height: "50%",
    alignItems: "center",
  },
  line_modal: {
    marginTop: 5,
    height: 5,
    width: "20%",
    backgroundColor: "#DEE3E7",
    borderRadius: 50,
  },
  modal_container: {
    justifyContent: "flex-end",
    margin: 0,
  },
});
