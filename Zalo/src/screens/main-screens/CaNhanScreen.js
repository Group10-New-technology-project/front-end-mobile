import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CaNhanScreen({ navigation }) {
  handleTaiKhoanScreen = () => {
    navigation.navigate("TaiKhoanVaBaoMat");
  };
  handleQuyenRiengTu = () => {
    navigation.navigate("QuyenRiengTu");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header_pofile}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 12,
            marginLeft: 20,
          }}>
          <Image source={require("../../../assets/image/Avatar Zalo.png")} />
          <View style={{ flexDirection: "column", paddingLeft: 15 }}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Name</Text>
            <Text style={{ fontSize: 14, color: "#696969", fontWeight: "400" }}>
              Xem trang cá nhân
            </Text>
          </View>
          <Image
            style={{ position: "absolute", right: 25 }}
            source={require("../../../assets/image/Icon Trans Account.png")}
          />
        </View>
      </View>
      <View style={styles.container_menu}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            marginLeft: 20,
          }}>
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../../../assets/image/IMG_9197 1.png")}
          />
          <View style={{ flexDirection: "column", paddingLeft: 15 }}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Ví QR</Text>
            <Text style={{ fontSize: 14, color: "#696969", fontWeight: "400" }}>
              Lưu trữ và xuất trình các mã QR quan trọng
            </Text>
          </View>
        </View>
        <View style={{ paddingVertical: 4, alignItems: "flex-end" }}>
          <View style={{ borderWidth: 1, borderColor: "#ECECEC", width: 350 }} />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            marginLeft: 20,
          }}>
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../../../assets/image/IMG_9197 1 (1).png")}
          />
          <View style={{ flexDirection: "column", paddingLeft: 15 }}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Nhạc chờ Zalo</Text>
            <Text style={{ fontSize: 14, color: "#696969", fontWeight: "400" }}>
              Đăng ký nhạc chờ, thể hiện cá tính
            </Text>
          </View>
          <View style={{ position: "absolute", right: 25 }}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={{ paddingVertical: 4, alignItems: "flex-end" }}>
          <View style={{ borderWidth: 1, borderColor: "#ECECEC", width: 350 }} />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            marginLeft: 20,
          }}>
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../../../assets/image/cloud-cua-toi.png")}
          />
          <View style={{ flexDirection: "column", paddingLeft: 15 }}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Cloud của tôi</Text>
            <Text style={{ fontSize: 14, color: "#696969", fontWeight: "400" }}>
              Lưu trữ các tin nhắn quan trọng
            </Text>
          </View>
          <View style={{ position: "absolute", right: 25 }}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
      </View>
      <View style={styles.container_cloud}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 16,
            marginLeft: 20,
          }}>
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../../../assets/image/dung-luong.png")}
          />
          <View style={{ flexDirection: "column", paddingLeft: 15 }}>
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Dung lượng và dữ liệu</Text>
            <Text style={{ fontSize: 14, color: "#696969", fontWeight: "400" }}>
              Quản lý dữ liệu Zalo của bạn
            </Text>
          </View>
          <View style={{ position: "absolute", right: 25 }}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
      </View>
      <View style={styles.container_function}>
        <TouchableOpacity onPress={handleTaiKhoanScreen}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 15,
              marginLeft: 20,
            }}>
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../../assets/image/tai-khoan.png")}
            />

            <View style={{ flexDirection: "column", paddingLeft: 15 }}>
              <Text style={{ fontSize: 17, fontWeight: "500" }}>Tài khoản và bảo mật</Text>
            </View>

            <View style={{ position: "absolute", right: 25 }}>
              <Ionicons name="chevron-forward" size={18} color="gray" />
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ paddingVertical: 4, alignItems: "flex-end" }}>
          <View style={{ borderWidth: 1, borderColor: "#ECECEC", width: 350 }} />
        </View>
        <TouchableOpacity onPress={handleQuyenRiengTu}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 15,
              marginLeft: 20,
            }}>
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../../assets/image/quyen-rieng-tu.png")}
            />
            <View style={{ flexDirection: "column", paddingLeft: 15 }}>
              <Text style={{ fontSize: 17, fontWeight: "500" }}>Quyền riêng tư</Text>
            </View>
            <View style={{ position: "absolute", right: 25 }}>
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
    backgroundColor: "#E6E6E6",
  },
  header_pofile: {
    backgroundColor: "white",
  },
  container_menu: {
    backgroundColor: "white",
    marginTop: 8,
  },
  container_function: {
    backgroundColor: "white",
    marginTop: 8,
  },
  container_cloud: {
    backgroundColor: "white",
    marginTop: 8,
  },
});
