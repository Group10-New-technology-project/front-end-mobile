import React from "react";
import { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import ToggleSwitch from "toggle-switch-react-native";

import { FontAwesome, Ionicons } from "@expo/vector-icons";
export default function QuyenRiengTu() {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const onToggle = () => {
    setIsSwitchOn(!isSwitchOn);
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.container_canhan}>
        <Text style={{ fontSize: 15, fontWeight: "bold", color: "#0008C0", marginVertical: 10 }}>
          Cá nhân
        </Text>
        <View style={styles.header_canhan}></View>
        <View style={styles.sodienthoai}>
          <FontAwesome name="birthday-cake" size={22} color="gray" />
          <View style={{ paddingLeft: 16 }}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Sinh nhật</Text>
          </View>
          <View style={{ position: "absolute", right: 10 }}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={{ marginTop: 3, alignItems: "flex-end" }}>
          <View style={{ borderWidth: 1, borderColor: "#ECECEC", width: 345 }} />
        </View>
        <View style={styles.dinhdanhtaikhoan}>
          <View style={styles.khoazalo}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome name="user-circle-o" size={22} color="gray" />
              <Text style={{ fontSize: 17, fontWeight: "500", marginHorizontal: 16 }}>
                Hiển thị trạng thái truy cập
              </Text>
            </View>
            <Text style={{ fontSize: 16, color: "#696969", fontWeight: "500", marginRight: 20 }}>
              Đang bật
            </Text>
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
        <Text style={{ fontSize: 15, fontWeight: "bold", color: "#0008C0", marginTop: 10 }}>
          Tin nhắn và cuộc gọi
        </Text>

        <View style={styles.kiemtrabaomat}>
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../../../assets/image/shield-check.png")}
          />
          <View style={{ flexDirection: "column", marginLeft: 16, marginTop: 5 }}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Hiển thị trạng thái "Đã xem"</Text>
          </View>
          <Text style={{ fontSize: 16, color: "#696969", fontWeight: "500", marginRight: 40 }}>
            Đang bật
          </Text>
          <View style={{ position: "absolute", right: 10 }}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={{ marginTop: 3, alignItems: "flex-end" }}>
          <View style={{ borderWidth: 1, borderColor: "#ECECEC", width: 345 }} />
        </View>
        <View style={styles.khoazalo}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../../assets/image/lock.png")}
            />
            <Text style={{ fontSize: 17, fontWeight: "500", marginHorizontal: 16 }}>Khóa Zalo</Text>
          </View>
          <Text style={{ fontSize: 16, color: "#696969", fontWeight: "500", marginRight: 40 }}>
            Đang tắt
          </Text>
          <View style={{ position: "absolute", right: 10 }}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
      </View>
      <View style={{ height: 7, backgroundColor: "#E6E6E6" }}></View>

      <View style={styles.container_nguontimkiem}>
        <Text style={{ fontSize: 15, fontWeight: "bold", color: "#0008C0", marginTop: 10 }}>
          Nguồn tìm kiếm và kết bạn
        </Text>
        <View style={styles.kiemtrabaomat}>
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../../../assets/image/shield-alert.png")}
          />
          <View style={{ flexDirection: "column", marginLeft: 16, marginTop: 5 }}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Tự động kết bạn từ danh bạ máy</Text>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              Thêm liên hệ danh bạ vào Zalo khi cả {"\n"} 2 đề lưu số nhau
            </Text>
          </View>
          <View style={{ position: "absolute", right: 10 }}>
            <ToggleSwitch
              isOn={isSwitchOn}
              onColor="blue"
              offColor="gray"
              size="medium"
              onToggle={onToggle}
            />
          </View>
        </View>

        <View style={{ marginTop: 3, alignItems: "flex-end" }}>
          <View style={{ borderWidth: 1, borderColor: "#ECECEC", width: 345 }} />
        </View>
        <View style={styles.thietbidangnhap}>
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../../../assets/image/smartphone.png")}
          />
          <View style={{ flexDirection: "column", marginLeft: 16, marginTop: 5 }}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>
              Quản lý nguồn tìm kiếm và kết bạn
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "400", marginTop: 3 }}>
              Quản lý các thiết bị đăng nhập
            </Text>
          </View>
          <View style={{ position: "absolute", right: 10 }}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={{ marginTop: 3, alignItems: "flex-end" }}>
          <View style={{ borderWidth: 1, borderColor: "#ECECEC", width: 345 }} />
        </View>
        <View style={styles.mat_khau}>
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../../../assets/image/unlock-keyhole.png")}
          />
          <Text style={{ fontSize: 17, fontWeight: "500", marginLeft: 16 }}>Mật khẩu</Text>
          <View style={{ position: "absolute", right: 10 }}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
      </View>

      <View style={{ height: 7, backgroundColor: "#E6E6E6" }}></View>

      <View style={styles.xoa_tai_khoan}>
        <Image
          style={{ width: 24, height: 24 }}
          source={require("../../../assets/image/badge-x.png")}
        />
        <Text style={{ fontSize: 17, fontWeight: "500", marginLeft: 16 }}>Xóa tài khoản</Text>
        <View style={{ position: "absolute", right: 10 + 12 }}>
          <Ionicons name="chevron-forward" size={18} color="gray" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  header_canhan: {
    marginTop: 1,
  },
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
  sodienthoai: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
});
