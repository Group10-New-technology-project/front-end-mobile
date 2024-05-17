import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import ToggleSwitch from "toggle-switch-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome, FontAwesome5, AntDesign, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "@env";
import * as Clipboard from "expo-clipboard";

export default function TaiKhoanVaBaoMat({ navigation }) {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [userData, setUserData] = useState(null);

  const onToggle = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  const handleMatKhau = () => {
    navigation.navigate("DoiMatKhauScreen");
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  const formattedDate = userData ? formatDate(userData.dateofbirth) : "Sinh nhật";

  useEffect(() => {
    fetchDataLogin();
  }, []);

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
  const handleXoaTaiKhoan = async () => {
    await Clipboard.setStringAsync("Đang phát triển");
    Alert.alert("Đang phát triển");
  };

  const handleViewProfile = () => {
    navigation.navigate("XemTrangCaNhan", { user_id: userData._id });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container_taikhoan}>
        <Text style={{ fontSize: 15, fontWeight: "bold", color: "#0008C0", marginVertical: 10 }}>Tài khoản</Text>
        <TouchableOpacity onPress={handleViewProfile} style={styles.header_taikhoan}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
              marginLeft: 15,
            }}>
            {userData && userData.avatar ? (
              <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={{ uri: userData.avatar }} />
            ) : (
              <Image
                style={{ width: 24, height: 24 }}
                source={{ uri: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/IMG_2024-04-12_18-16-9.png" }}
              />
            )}

            <View style={{ flexDirection: "column", paddingLeft: 15 }}>
              <Text style={{ fontSize: 16, fontWeight: "400", color: "#696969" }}>Thông tin cá nhân</Text>
              <Text style={{ fontSize: 17, fontWeight: "500" }}>{userData ? userData.name : "Name"}</Text>
            </View>
            <View style={{ position: "absolute", right: 10 }}>
              <Ionicons name="chevron-forward" size={18} color="gray" />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.sodienthoai}>
          <FontAwesome name="phone" size={26} color="black" />
          <View style={{ flexDirection: "column", paddingLeft: 16 }}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Số điện thoại</Text>
            <Text style={{ fontSize: 16, color: "#696969", fontWeight: "400", marginTop: 3 }}>
              0{userData ? userData.username.slice(3) : "Số điện thoại"}
            </Text>
          </View>
          <View style={{ position: "absolute", right: 10 }}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>

        <View style={{ marginTop: 3, alignItems: "flex-end" }}>
          <View style={{ borderWidth: 1, borderColor: "#ECECEC", width: 345 }} />
        </View>
        <View style={styles.sodienthoai}>
          <FontAwesome name="birthday-cake" size={21} color="black" />
          <View style={{ flexDirection: "column", paddingLeft: 16 }}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Sinh nhật</Text>
            <Text style={{ fontSize: 16, color: "#696969", fontWeight: "400", marginTop: 3 }}>{formattedDate}</Text>
          </View>
          <View style={{ position: "absolute", right: 10 }}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={{ marginTop: 3, alignItems: "flex-end" }}>
          <View style={{ borderWidth: 1, borderColor: "#ECECEC", width: 345 }} />
        </View>
        <View style={styles.sodienthoai}>
          <FontAwesome name="transgender" size={26} color="black" />
          <View style={{ flexDirection: "column", paddingLeft: 15 }}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Giới tính</Text>
            <Text style={{ fontSize: 16, color: "#696969", fontWeight: "400", marginTop: 3 }}>
              {userData ? userData.gender : "Giới tính"}
            </Text>
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
              <FontAwesome5 name="user-check" size={20} color="black" />
              <Text style={{ fontSize: 17, fontWeight: "500", marginHorizontal: 13 }}>Định danh tài khoản</Text>
            </View>
            <Text style={{ fontSize: 16, color: "#696969", fontWeight: "500", marginRight: 40 }}>Chưa định danh</Text>
            <View style={{ position: "absolute", right: 10 }}>
              <Ionicons name="chevron-forward" size={18} color="gray" />
            </View>
          </View>
          <View style={{ marginTop: 3, alignItems: "flex-end" }}>
            <View style={{ borderWidth: 1, borderColor: "#ECECEC", width: 345 }} />
          </View>
        </View>
        <View style={styles.maqrcuatoi}>
          <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14 }}>
            <FontAwesome name="qrcode" size={26} color="black" />
            <Text style={{ fontSize: 17, fontWeight: "500", marginHorizontal: 18 }}>Mã QR của tôi</Text>
            <View style={{ position: "absolute", right: 10 }}>
              <Ionicons name="chevron-forward" size={18} color="gray" />
            </View>
          </View>
        </View>
      </View>

      <View style={{ height: 7, backgroundColor: "#E9E9E9" }}></View>

      <View style={styles.container_baomat}>
        <Text style={{ fontSize: 15, fontWeight: "bold", color: "#0008C0", marginTop: 10 }}>Bảo mật</Text>
        <View style={styles.kiemtrabaomat}>
          <MaterialIcons name="security" size={24} color="black" />
          <View style={{ flexDirection: "column", marginLeft: 16, marginTop: 5 }}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Kiểm tra bảo mật</Text>
            <Text style={{ fontSize: 16, color: "#A8AA50", fontWeight: "400", marginTop: 3 }}>Không có vấn đề bảo mật cần xử lý</Text>
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
            <MaterialIcons name="password" size={25} color="black" />
            <Text style={{ fontSize: 17, fontWeight: "500", marginHorizontal: 16 }}>Khóa Zalo</Text>
          </View>
          <Text style={{ fontSize: 16, color: "#696969", fontWeight: "500", marginRight: 40 }}>Đang tắt</Text>
          <View style={{ position: "absolute", right: 10 }}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
      </View>
      <View style={{ height: 7, backgroundColor: "#E9E9E9" }}></View>
      <View style={styles.container_dangnhap}>
        <Text style={{ fontSize: 15, fontWeight: "bold", color: "#0008C0", marginTop: 10 }}>Đăng nhập</Text>
        <View style={styles.kiemtrabaomat}>
          <MaterialCommunityIcons name="shield-alert-outline" size={24} color="black" />
          <View style={{ flexDirection: "column", marginLeft: 16, marginTop: 5 }}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Bảo mật 2 lớp</Text>
            <Text style={{ fontSize: 16, fontWeight: "400" }}>
              Thêm hình thức xác nhận bảo vệ tài {"\n"}khoản khi đăng nhập trên thiết bị mới
            </Text>
          </View>
          <View style={{ position: "absolute", right: 10 }}>
            <ToggleSwitch isOn={isSwitchOn} onColor="#0091FF" offColor="gray" size="medium" onToggle={onToggle} />
          </View>
        </View>

        <View style={{ marginTop: 3, alignItems: "flex-end" }}>
          <View style={{ borderWidth: 1, borderColor: "#ECECEC", width: 345 }} />
        </View>
        <View style={styles.thietbidangnhap}>
          <Ionicons name="phone-portrait" size={24} color="black" />
          <View style={{ flexDirection: "column", marginLeft: 16, marginTop: 5 }}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Thiết bị đăng nhập</Text>
            <Text style={{ fontSize: 16, fontWeight: "400", marginTop: 3 }}>Quản lý các thiết bị đăng nhập</Text>
          </View>
          <View style={{ position: "absolute", right: 10 }}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={{ marginTop: 3, alignItems: "flex-end" }}>
          <View style={{ borderWidth: 1, borderColor: "#ECECEC", width: 345 }} />
        </View>
        <TouchableOpacity onPress={handleMatKhau}>
          <View style={styles.mat_khau}>
            <MaterialIcons name="lock" size={23} color="black" />
            <Text style={{ fontSize: 17, fontWeight: "500", marginLeft: 18 }}>Mật khẩu</Text>
            <View style={{ position: "absolute", right: 10 }}>
              <Ionicons name="chevron-forward" size={18} color="gray" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ height: 7, backgroundColor: "#E9E9E9" }}></View>
      <TouchableOpacity onPress={handleXoaTaiKhoan} style={styles.xoa_tai_khoan}>
        <AntDesign name="delete" size={22} color="red" />
        <Text style={{ fontSize: 17, fontWeight: "500", marginLeft: 17, color: "red" }}>Xóa tài khoản</Text>
        <View style={{ position: "absolute", right: 10 + 12 }}>
          <Ionicons name="chevron-forward" size={18} color="gray" />
        </View>
      </TouchableOpacity>
      <View style={{ height: 100, backgroundColor: "#E9E9E9" }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E9E9E9",
    flex: 1,
  },
  header_taikhoan: {
    marginTop: 1,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#A9A0A0",
    // backgroundColor: "green",
  },
  container_taikhoan: {
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  container_baomat: {
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  container_dangnhap: {
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
    paddingVertical: 14,
  },
  xoa_tai_khoan: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "white",
    paddingLeft: 12,
  },
  sodienthoai: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
});
