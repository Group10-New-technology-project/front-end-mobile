import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@env";

export default function CaNhanScreen({ navigation }) {
  const [userData, setUserData] = useState(null);

  const fetchDataLogin = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        fetchDataUser(user._id);
      } else {
        console.log("Không có thông tin người dùng được lưu");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const fetchDataUser = async (userID) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/users/${userID}`);
      console.log("response", response.data);
      setUserData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  handleTKVBM = () => {
    navigation.navigate("TaiKhoanVaBaoMat");
  };

  handleQuyenRiengTu = () => {
    navigation.navigate("QuyenRiengTu");
  };

  const handleViewUser = () => {
    navigation.navigate("XemTrangCaNhan", { user_id: userData._id });
  };

  useFocusEffect(
    useCallback(() => {
      fetchDataLogin();
    }, [])
  );

  useEffect(() => {
    if (userData) {
      console.log("userData", userData.name);
      console.log("userData", userData.avatar);
    }
  }, [userData]);

  return (
    <View style={styles.container}>
      <View style={styles.header_pofile}>
        <TouchableOpacity onPress={handleViewUser} style={styles.tabs_menu}>
          {userData && userData.avatar ? (
            <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={{ uri: userData.avatar }} />
          ) : (
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={{ uri: "https://i.pinimg.com/564x/68/3d/8f/683d8f58c98a715130b1251a9d59d1b9.jpg" }}
            />
          )}
          <View style={styles.view_title}>
            <Text style={styles.title}>{userData ? userData.name : "Tên người dùng"}</Text>
            <Text style={styles.title2}>Xem trang cá nhân</Text>
          </View>
          <View style={styles.vector_location}>
            <MaterialCommunityIcons name="account-sync" size={25} color="#0091FF" />
          </View>
        </TouchableOpacity>
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
  tabs_menu: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: { fontSize: 17, fontWeight: "500", marginBottom: 5 },
  title1: { fontSize: 17, fontWeight: "500" },
  title2: { fontSize: 14, color: "#696969", fontWeight: "400" },
  line: { borderWidth: 1, borderColor: "#ECECEC", width: 360 },
  line2: { borderWidth: 4, borderColor: "#ECECEC", width: "100%" },
  line_view1: { paddingVertical: 15, alignItems: "flex-end" },
  line_view2: { paddingVertical: 16, alignItems: "flex-end" },
  vector_location: { position: "absolute", right: 18 },
  view_title: {
    flexDirection: "column",
    paddingLeft: 16,
    // backgroundColor: "green",
  },
});
