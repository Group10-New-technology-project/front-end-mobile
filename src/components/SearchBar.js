import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function SearchBar() {
  const navigation = useNavigation();

  const handleCaiDat = () => {
    console.log("Cài đặt");
    navigation.navigate("CaiDatNhanh");
  };
  const handleQR = () => {
    navigation.navigate("QRCodeScreen");
    console.log("QR");
  };
  const handleSearchInputPress = () => {
    navigation.navigate("TimKiem", { searchPhone: "123" });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.search_icon} onPress={handleSearchInputPress}>
        <View style={{ marginRight: 20 }}>
          <Feather name="search" size={22} color="white" />
        </View>
        <Text style={styles.text_search}>Tìm kiếm</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", alignItems: "center", paddingRight: 3 }}>
        <TouchableOpacity onPress={handleCaiDat}>
          <Ionicons style={{ marginRight: 13 }} name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleQR}>
          <MaterialCommunityIcons name="qrcode-scan" size={22} color="white" />
        </TouchableOpacity>
      </View>
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
});
