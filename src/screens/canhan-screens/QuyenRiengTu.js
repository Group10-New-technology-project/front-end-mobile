import React from "react";
import { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import ToggleSwitch from "toggle-switch-react-native";
import { FontAwesome, Ionicons, AntDesign, Feather } from "@expo/vector-icons";

export default function QuyenRiengTu() {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const onToggle = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container_canhan}>
        <Text style={{ fontSize: 15, fontWeight: "bold", color: "#0008C0", marginTop: 10 }}>Cá nhân</Text>
        <View style={styles.header_canhan}></View>
        <View style={styles.dinhdanhtaikhoan}>
          <View style={styles.khoazalo}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome name="user-circle-o" size={22} color="black" />
              <Text style={{ fontSize: 17, fontWeight: "500", marginHorizontal: 16 }}>Hiển thị trạng thái truy cập</Text>
            </View>
            <Text style={{ fontSize: 16, color: "#696969", fontWeight: "500", marginRight: 40 }}>Đang bật</Text>
            <View style={{ position: "absolute", right: 10 }}>
              <Ionicons name="chevron-forward" size={18} color="gray" />
            </View>
          </View>
          <View style={{ marginTop: 3, alignItems: "flex-end" }}></View>
        </View>
        <View style={styles.maqrcuatoi}></View>
      </View>

      <View style={{ height: 7, backgroundColor: "#E6E6E6" }}></View>

      <View style={styles.container_tinnhanvacuocgoi}>
        <Text style={{ fontSize: 15, fontWeight: "bold", color: "#0008C0", marginTop: 10 }}>Tin nhắn và cuộc gọi</Text>

        <View style={styles.kiemtrabaomat}>
          <Image style={{ width: 24, height: 24 }} source={require("../../../assets/image/shield-check.png")} />
          <View style={{ flexDirection: "row", marginLeft: 16, marginTop: 5, alignItems: "center" }}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Hiển thị trạng thái "Đã xem"</Text>
            <Text style={{ fontSize: 16, color: "#696969", fontWeight: "500", marginLeft: 24 }}>Đang bật</Text>
          </View>
          <View style={{ position: "absolute", right: 10 }}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={{ marginTop: 3, alignItems: "flex-end" }}>
          <View style={{ borderWidth: 1, borderColor: "#ECECEC", width: 345 }} />
        </View>
        <View style={styles.khoazalo}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image style={{ width: 24, height: 24 }} source={require("../../../assets/image/lock.png")} />
            <Text style={{ fontSize: 17, fontWeight: "500", marginHorizontal: 16 }}>Cho phép nhắn tin</Text>
          </View>
          <Text style={{ fontSize: 16, color: "#696969", fontWeight: "500", marginRight: 40 }}>Mọi người</Text>
          <View style={{ position: "absolute", right: 10 }}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={{ marginTop: 3, alignItems: "flex-end" }}>
          <View style={{ borderWidth: 1, borderColor: "#ECECEC", width: 345 }} />
        </View>
        <View style={styles.khoazalo}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="phone-call" size={24} color="black" />
            <Text style={{ fontSize: 17, fontWeight: "500", marginHorizontal: 16 }}>Cho phép gọi điện</Text>
          </View>
          <Text style={{ fontSize: 16, color: "#696969", fontWeight: "500", marginRight: 40 }}>Mọi người</Text>
          <View style={{ position: "absolute", right: 10 }}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
      </View>

      <View style={{ height: 7, backgroundColor: "#E6E6E6" }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  header_canhan: {},
  container_canhan: {
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  container_tinnhanvacuocgoi: {
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  container_nguontimkiem: {
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  kiemtrabaomat: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  khoazalo: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    justifyContent: "space-between",
  },
  thietbidangnhap: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  mat_khau: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  xoa_tai_khoan: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  dinhdanhtaikhoan: {},
});
