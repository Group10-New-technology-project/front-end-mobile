import { StyleSheet, Text, View, Image, Dimensions } from "react-native";

export default function KhamPhaScreen() {
  const iconsData = [
    { imageSource: require("../assets/image/Icon Zalo Video.png"), text: "Zalo Video" },
    { imageSource: require("../assets/image/icon-fiza.png"), text: "Fiza" },
    { imageSource: require("../assets/image/icon-zalopay.png"), text: "ZaloPay" },
    { imageSource: require("../assets/image/icon-dichvucong.png"), text: "Dịch vụ công" },
    { imageSource: require("../assets/image/icon-nhac-cho.png"), text: "Nhạc chờ" },
    { imageSource: require("../assets/image/icon-tim-viec.png"), text: "Tìm việc" },
    { imageSource: require("../assets/image/icon-viqr.png"), text: "Ví QR" },
    { imageSource: require("../assets/image/icon-xemthem.png"), text: "Xem Thêm" },
    { imageSource: require("../assets/image/Icon Zalo Video.png"), text: "Zalo Video 9" },
  ];
  const { width: screenWidth } = Dimensions.get("window");
  return (
    <View style={styles.container}>
      <View style={styles.header_khampha}>
        <Image style={styles.icon_zalo_video} source={require("../assets/image/Icon Zalo Video.png")} />
        <Text style={styles.text_icon}>Zalo Video</Text>
        <View style={{ position: "absolute", right: 25 }}>
          <Image source={require("../assets/image/Vector.png")} />
        </View>
      </View>
      <View style={styles.container_mini_apps}>
        <Image style={{ width: 19, height: 19, marginRight: 5 }} source={require("../assets/image/Icon Menu.png")} />
        <Text>Mini Apps yêu thích</Text>
        <Text style={{ fontWeight: "bold", fontSize: 14, color: "#0085FE", marginLeft: 170 }}>Chỉnh sửa</Text>
      </View>
      <View style={styles.all_icon}>
        {iconsData.slice(0, 4).map((item, index) => (
          <View key={index} style={styles.icons}>
            <Image style={{ width: 40, height: 40 }} source={item.imageSource} />
            <Text>{item.text}</Text>
          </View>
        ))}
      </View>
      <View style={styles.all_icon}>
        {iconsData.slice(4, 8).map((item, index) => (
          <View key={index} style={styles.icons}>
            <Image style={{ width: 40, height: 40 }} source={item.imageSource} />
            <Text>{item.text}</Text>
          </View>
        ))}
      </View>
      <View style={styles.recently_icon}>
        <Text style={{ backgroundColor: "white", fontSize: 14, fontWeight: "regular", padding: 10, color: "#8F8F8F" }}>Sử dụng gần đây</Text>
        <View style={styles.all_icon}>
          {iconsData.slice(0, 4).map((item, index) => (
            <View key={index} style={styles.icons}>
              <Image style={{ width: 40, height: 40 }} source={item.imageSource} />
              <Text>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.suggest_zalo_video}>
        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
          <Image style={{ marginLeft: 15, width: 21, height: 21 }} source={require("../assets/image/Icon Zalo Video.png")} />
          <Text style={{ fontSize: 14, marginLeft: 5 }}>Zalo Video</Text>
          <Text style={{ fontSize: 14, color: "#AAAAAA", marginLeft: 5 }}>Gợi ý cho bạn</Text>
          <View style={{ position: "absolute", right: 25 }}>
            <Image source={require("../assets/image/Vector.png")} />
          </View>
        </View>
        <View style={styles.video}>
          <Image style={{ width: screenWidth, height: screenWidth * (218 / 385) }} source={require("../assets/image/Video.png")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6E6",
  },
  header_khampha: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
  icon_zalo_video: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 5,
  },
  text_icon: {
    fontSize: 16,
    fontWeight: "regular",
  },
  icon_vector: {
    width: 5.7,
    height: 9.95,
    marginLeft: 230,
  },
  container_mini_apps: {
    marginTop: 6,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  icons: {
    flexDirection: "column",
    alignItems: "center",
  },
  all_icon: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 12,
    alignItems: "center",
  },
  suggest_zalo_video: {
    marginTop: 6,
    backgroundColor: "white",
  },
});
