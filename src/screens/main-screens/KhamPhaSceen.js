import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { Video, ResizeMode } from "expo-av";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// ==========================================
export default function KhamPhaScreen() {
  const iconsData = [
    {
      key: 1,
      imageSource: require("../../../assets/image/Icon Zalo Video.png"),
      text: "Zalo Video",
    },
    { key: 2, imageSource: require("../../../assets/image/icon-zalopay.png"), text: "ZaloPay" },
    { key: 3, imageSource: require("../../../assets/image/icon-fiza.png"), text: "Fiza" },
    {
      key: 4,
      imageSource: require("../../../assets/image/icon-dichvucong.png"),
      text: "Dịch vụ công",
    },
    { key: 5, imageSource: require("../../../assets/image/icon-nhac-cho.png"), text: "Nhạc chờ" },
    { key: 6, imageSource: require("../../../assets/image/icon-tim-viec.png"), text: "Tìm việc" },
    { key: 7, imageSource: require("../../../assets/image/icon-viqr.png"), text: "Ví QR" },
    { key: 8, imageSource: require("../../../assets/image/icon-xemthem.png"), text: "Xem Thêm" },
  ];
  const videos = [
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  ];

  // const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
  // const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  // const onViewableItemsChanged = ({ viewableItems }) => {
  //   if (viewableItems.length > 0) {
  //     setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
  //   }
  // };
  // const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  const Item = ({ item, shouldPlay }) => {
    const videoRef = useRef(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
      if (!videoRef.current) return;

      if (shouldPlay) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
        videoRef.current.setPositionAsync(0);
      }
    }, [shouldPlay]);

    return (
      <Pressable
        onPress={() =>
          status?.isPlaying ? videoRef.current?.pauseAsync() : videoRef.current?.playAsync()
        }>
        <Video
          ref={videoRef}
          source={{ uri: item }}
          style={styles.video}
          isLooping
          resizeMode={ResizeMode.COVER}
          volume={0.5}
          useNativeControls={false}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      </Pressable>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header_khampha}>
        <Image style={styles.icon_zalo_video} source={iconsData[0].imageSource} />
        <Text style={styles.text_icon}>{iconsData[0].text}</Text>
        <View style={{ position: "absolute", right: 18 }}>
          <Ionicons name="chevron-forward" size={18} color="gray" />
        </View>
      </View>
      <View style={styles.line2}></View>

      <View style={styles.container_miniApp}>
        <View style={styles.header_miniApp}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="menu-open" size={24} color="#0091FF" />
            <Text style={{ marginLeft: 5 }}>Mini Apps yêu thích</Text>
          </View>
          <Text style={{ fontWeight: "bold", fontSize: 14, color: "#0085FE" }}>Chỉnh sửa</Text>
        </View>

        <View style={styles.menu_miniApp1}>
          {iconsData.slice(0, 4).map((item, index) => (
            <View key={index} style={styles.icon_apps}>
              <Image style={{ width: 40, height: 40 }} source={item.imageSource} />
              <Text style={styles.text_app}>{item.text}</Text>
            </View>
          ))}
        </View>
        {/* ========================================== */}
        <View style={styles.menu_miniApp2}>
          {iconsData.slice(4, 8).map((item, index) => (
            <View key={index} style={styles.icon_apps}>
              <Image style={{ width: 40, height: 40 }} source={item.imageSource} />
              <Text style={styles.text_app}>{item.text}</Text>
            </View>
          ))}
        </View>
        {/* ========================================== */}
        <Text style={styles.text_sudung}>Sử dụng gần đây</Text>
        <View style={styles.menu_miniApp3}>
          {iconsData.slice(4, 8).map((item, index) => (
            <View key={index} style={styles.icon_apps}>
              <Image style={{ width: 40, height: 40 }} source={item.imageSource} />
              <Text style={styles.text_app}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.line2}></View>

      <View style={styles.container_video}>
        <View style={styles.header_video}>
          <Image style={{ width: 21, height: 21 }} source={iconsData[0].imageSource} />
          <Text style={{ fontSize: 14, marginLeft: 8 }}>{iconsData[0].text}</Text>
          <Text style={{ fontSize: 14, marginLeft: 8, color: "#AAAAAA" }}>Gợi ý cho bạn</Text>
          <View style={{ position: "absolute", right: 18 }}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={styles.video_container}>
          <FlatList
            data={videos}
            renderItem={({ item, index }) => <Item item={item} shouldPlay={index === 0} />}
            keyExtractor={(item) => item}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            // pagingEnabled
            // viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
          />
        </View>
      </View>
      <View style={styles.line2}></View>
    </ScrollView>
  );
}

const { width: screenWidth } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  line2: { borderWidth: 4, borderColor: "#ECECEC", width: "100%" },
  header_khampha: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "white",
    paddingLeft: 16,
  },
  icon_zalo_video: { width: 40, height: 40, marginRight: 10 },
  text_icon: { fontSize: 16, fontWeight: "regular" },
  header_miniApp: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  menu_miniApp1: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  menu_miniApp2: { flexDirection: "row", justifyContent: "space-around", marginBottom: 25 },
  menu_miniApp3: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    marginBottom: 25,
  },
  icon_apps: { width: screenWidth / 4.1, flexDirection: "column", alignItems: "center" },
  container_video: {},
  text_app: { marginTop: 5, fontSize: 13, fontWeight: "500" },
  text_sudung: { fontSize: 14, fontWeight: "500", color: "#8F8F8F", paddingLeft: 18 },
  header_video: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 18,
    paddingVertical: 12,
  },
  video: {
    width: screenWidth / 2.8,
    height: 260,
    backgroundColor: "white",
    borderRadius: 10,
    marginRight: 8,
  },
  video_container: { paddingLeft: 18, paddingBottom: 20 },
});
