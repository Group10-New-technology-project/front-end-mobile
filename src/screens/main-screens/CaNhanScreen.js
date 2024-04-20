import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";

export default function CaNhanScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  handleTKVBM = () => {
    navigation.navigate("TaiKhoanVaBaoMat");
  };
  handleQuyenRiengTu = () => {
    navigation.navigate("QuyenRiengTu");
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const user = JSON.parse(storedUserData);
          console.log("Thông tin người dùng đã đăng nhập:", user);
          setUserData(user);
        } else {
          console.log("Không có thông tin người dùng được lưu");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header_pofile}>
        <View style={styles.tabs_menu}>
          {userData && userData.avatar ? (
            <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={{ uri: userData.avatar }} />
          ) : (
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={{ uri: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_18-16-9.png" }}
            />
          )}
          <View style={styles.view_title}>
            <Text style={styles.title}>{userData ? userData.name : "Tên người dùng"}</Text>
            <Text style={styles.title2}>Xem trang cá nhân</Text>
          </View>
          <View style={styles.vector_location}>
            <MaterialCommunityIcons name="account-sync" size={25} color="#0091FF" />
          </View>
        </View>
      </View>
      <View style={styles.line2}></View>
      {/* -------------------- */}
      <View style={styles.container_menu1}>
        <View style={styles.tabs_menu}>
          <MaterialCommunityIcons name="wallet-travel" size={24} color="#0091FF" />
          <View style={styles.view_title}>
            <Text style={styles.title}>Ví QR</Text>
            <Text style={styles.title2}>Lưu trữ và xuất trình các mã QR quan trọng</Text>
          </View>
        </View>
        <View style={styles.line_view1}>
          <View style={styles.line} />
        </View>
        <View style={styles.tabs_menu}>
          <MaterialCommunityIcons name="music" size={24} color="#0091FF" />
          <View style={styles.view_title}>
            <Text style={styles.title}>Nhạc chờ Zalo</Text>
            <Text style={styles.title2}>Đăng ký nhạc chờ, thể hiện cá tính</Text>
          </View>
          <View style={styles.vector_location}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={styles.line_view1}>
          <View style={styles.line} />
        </View>
        <View style={styles.tabs_menu}>
          <MaterialCommunityIcons name="cloud-download-outline" size={24} color="#0091FF" />
          <View style={styles.view_title}>
            <Text style={styles.title}>Cloud của tôi</Text>
            <Text style={styles.title2}>Lưu trữ các tin nhắn quan trọng</Text>
          </View>
          <View style={styles.vector_location}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
      </View>
      <View style={styles.line2}></View>
      {/* -------------------- */}
      <View style={styles.container_menu2}>
        <View style={styles.tabs_menu}>
          <MaterialCommunityIcons name="archive-sync-outline" size={24} color="#0091FF" />
          <View style={styles.view_title}>
            <Text style={styles.title}>Dung lượng và dữ liệu</Text>
            <Text style={styles.title2}>Quản lý dữ liệu Zalo của bạn</Text>
          </View>
          <View style={styles.vector_location}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
      </View>
      <View style={styles.line2}></View>
      {/* -------------------- */}
      <View style={styles.container_menu3}>
        <TouchableOpacity onPress={handleTKVBM}>
          <View style={styles.tabs_menu}>
            <MaterialCommunityIcons name="shield-lock-open-outline" size={24} color="#0091FF" />
            <View style={styles.view_title}>
              <Text style={styles.title1}>Tài khoản và bảo mật</Text>
            </View>
            <View style={styles.vector_location}>
              <Ionicons name="chevron-forward" size={18} color="gray" />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.line_view2}>
          <View style={styles.line} />
        </View>

        <TouchableOpacity onPress={handleQuyenRiengTu}>
          <View style={styles.tabs_menu}>
            <MaterialCommunityIcons name="lock-outline" size={24} color="#0091FF" />
            <View style={styles.view_title}>
              <Text style={styles.title1}>Quyền riêng tư</Text>
            </View>
            <View style={styles.vector_location}>
              <Ionicons name="chevron-forward" size={18} color="gray" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  header_pofile: {
    paddingLeft: 18,
    marginVertical: 14,
  },
  container_menu1: {
    paddingLeft: 18,
    marginVertical: 14,
  },
  container_menu2: {
    paddingLeft: 18,
    marginVertical: 14,
  },
  container_menu3: {
    paddingLeft: 18,
    marginVertical: 16,
  },
  tabs_menu: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 17, fontWeight: "500", marginBottom: 5 },
  title1: { fontSize: 17, fontWeight: "500" },
  title2: { fontSize: 14, color: "#696969", fontWeight: "400" },
  line: { borderWidth: 1, borderColor: "#ECECEC", width: 360 },
  line2: { borderWidth: 4, borderColor: "#ECECEC", width: "100%" },
  line_view1: { paddingVertical: 15, alignItems: "flex-end" },
  line_view2: { paddingVertical: 16, alignItems: "flex-end" },
  vector_location: { position: "absolute", right: 18 },
  view_title: { flexDirection: "column", paddingLeft: 16 },
});
