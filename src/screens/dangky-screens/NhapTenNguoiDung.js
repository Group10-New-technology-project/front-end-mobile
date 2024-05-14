import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Text, Alert, TouchableOpacity, TextInput } from "react-native"; // Import Text từ react-native
import { LinearGradient } from "expo-linear-gradient";
const { width } = Dimensions.get("window");

export default function NhapTenNguoiDung({ navigation, route }) {
  const { password, SoDienThoai, birthday, Gender } = route.params;
  const [name, setName] = useState("");
  const handle_chonAnh = () => {
    if (name.length < 2 || name.length > 40) {
      Alert.alert("Tên Zalo phải từ 2-40 ký tự");
    } else {
      navigation.navigate("ChonAnhDaiDien", {
        birthday: birthday,
        Gender: Gender,
        password: password,
        SoDienThoai: SoDienThoai,
        name: name,
      });
    }
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0085FE", "#00ACF4"]}
        start={{ x: 0, y: 0 }} // Điểm bắt đầu (trái)
        end={{ x: 1, y: 0 }} // Điểm kết thúc (phải)
        style={styles.background}
      />
      <LinearGradient
        colors={["#0085FE", "#00ACF4"]}
        start={{ x: 0, y: 0 }} // Điểm bắt đầu (trái)
        end={{ x: 1, y: 0 }} // Điểm kết thúc (phải)
        style={styles.background}
      />
      <View style={{ paddingTop: 50 }}>
        <View style={{ height: 45, justifyContent: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: 700, marginLeft: 12, marginTop: 20 }}>Tên Zalo</Text>
        </View>
        <View style={{ height: 50, alignItems: "center" }}>
          <TextInput
            placeholder="Gồm 2-40 ký tự"
            placeholderTextColor="#82858C"
            style={{
              height: 50,
              width: width * 0.95,
              fontSize: 16,
              paddingLeft: 5,
              borderBottomWidth: 1,
              borderBottomColor: "#F1F3F4",
              color: "black",
              backgroundColor: "#fff",
              // outlineColor: 'transparent', // Đặt màu viền trong suốt
              // outlineWidth: 0, // Đặt độ rộng của viền là 0
            }}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View style={{ height: 30 }}>
          <Text style={{ fontSize: 16, marginLeft: 12, marginTop: 10, fontWeight: 500 }}>Lưu ý khi đặt tên:</Text>
        </View>
        <View style={{ height: 60, marginTop: 5 }}>
          <View style={{ marginLeft: 20, flexDirection: "row", height: 30, alignItems: "center" }}>
            <Text style={{ fontWeight: 700, fontSize: 30, marginBottom: 16 }}>.</Text>
            <Text style={{ fontWeight: 500, fontSize: 16, marginLeft: 4 }}>Không vi phạm</Text>
            <Text style={{ fontWeight: 500, fontSize: 16, marginLeft: 3, color: "#2CA3DC" }}>Quy định đặt tên zalo.</Text>
          </View>
          <View style={{ marginLeft: 20, flexDirection: "row", height: 30, alignItems: "center" }}>
            <Text style={{ fontWeight: 700, fontSize: 30, marginBottom: 16 }}>.</Text>
            <Text style={{ fontWeight: 500, fontSize: 16, marginLeft: 4 }}>Nên sử dụng tên thật giúp bạn bè dễ nhận ra</Text>
          </View>
        </View>
      </View>
      <View style={styles.container_button}>
        <TouchableOpacity style={styles.btn_chonanh} onPress={handle_chonAnh}>
          <Text style={styles.text_4}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 45,
  },
  text_4: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  btn_chonanh: {
    backgroundColor: "#0091FF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  container_button: {
    paddingBottom: 40,
  },
});
