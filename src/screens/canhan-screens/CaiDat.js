import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons, AntDesign, Feather } from "@expo/vector-icons";

export default function CaiDat() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.menu_1}>
        <View style={styles.title_1}>
          <MaterialCommunityIcons name="shield-lock-open-outline" size={24} color="#0091FF" />
          <Text style={styles.title1}>Tài khoản và bảo mật</Text>
          <View style={styles.vector_location}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={styles.location_line}>
          <View style={styles.line}></View>
        </View>
        <View style={styles.title_1}>
          <MaterialCommunityIcons name="lock-outline" size={24} color="#0091FF" />
          <Text style={styles.title1}>Quyền riêng tư</Text>
          <View style={styles.vector_location}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
      </View>
      <View style={styles.line2}></View>
      <View style={styles.menu_2}>
        <View style={styles.title_1}>
          <MaterialCommunityIcons name="archive-sync-outline" size={24} color="#0091FF" />
          <Text style={styles.title1}>Dung lượng và dữ liệu</Text>
          <View style={styles.vector_location}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={styles.location_line}>
          <View style={styles.line}></View>
        </View>
        <View style={styles.title_1}>
          <MaterialCommunityIcons name="autorenew" size={24} color="#0091FF" />
          <Text style={styles.title1}>Sao lưu và khôi phục</Text>
          <View style={styles.vector_location}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
      </View>
      <View style={styles.line2}></View>
      <View style={styles.menu_3}>
        <View style={styles.title_1}>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#0091FF" />
          <Text style={styles.title1}>Thông báo</Text>
          <View style={styles.vector_location}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={styles.location_line}>
          <View style={styles.line}></View>
        </View>
        <View style={styles.title_1}>
          <Feather name="message-circle" size={24} color="#0091FF" />
          <Text style={styles.title1}>Tin nhắn</Text>
          <View style={styles.vector_location}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={styles.location_line}>
          <View style={styles.line}></View>
        </View>
        <View style={styles.title_1}>
          <MaterialCommunityIcons name="shield-lock-open-outline" size={24} color="#0091FF" />
          <Text style={styles.title1}>Cuộc gọi</Text>
          <View style={styles.vector_location}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={styles.location_line}>
          <View style={styles.line}></View>
        </View>
        <View style={styles.title_1}>
          <MaterialCommunityIcons name="shield-lock-open-outline" size={24} color="#0091FF" />
          <Text style={styles.title1}>Nhật ký</Text>
          <View style={styles.vector_location}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={styles.location_line}>
          <View style={styles.line}></View>
        </View>
        <View style={styles.title_1}>
          <MaterialCommunityIcons name="shield-lock-open-outline" size={24} color="#0091FF" />
          <Text style={styles.title1}>Danh bạ</Text>
          <View style={styles.vector_location}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={styles.location_line}>
          <View style={styles.line}></View>
        </View>
        <View style={styles.title_1}>
          <MaterialCommunityIcons name="shield-lock-open-outline" size={24} color="#0091FF" />
          <Text style={styles.title1}>Giao diện và ngôn ngữ</Text>
          <View style={styles.vector_location}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
      </View>
      <View style={styles.line2}></View>
      <View style={styles.menu_4}>
        <View style={styles.title_1}>
          <MaterialCommunityIcons name="shield-lock-open-outline" size={24} color="#0091FF" />
          <Text style={styles.title1}>Thông tin về Zalo</Text>
          <View style={styles.vector_location}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={styles.location_line}>
          <View style={styles.line}></View>
        </View>
        <View style={styles.title_1}>
          <MaterialCommunityIcons name="shield-lock-open-outline" size={24} color="#0091FF" />
          <Text style={styles.title1}>Liên hệ hỗ trợ</Text>
          <View style={styles.vector_location}>
            <TouchableOpacity style={{ padding: 5, backgroundColor: "#C5C5C5", borderRadius: 18 }}>
              <AntDesign name="message1" size={18} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.line2}></View>
      <View style={styles.menu_5}>
        <View style={styles.title_1}>
          <MaterialCommunityIcons name="shield-lock-open-outline" size={24} color="#0091FF" />
          <Text style={styles.title1}>Chuyển tài khoản</Text>
          <View style={styles.vector_location}>
            <Ionicons name="chevron-forward" size={18} color="gray" />
          </View>
        </View>
        <View style={styles.location_line}>
          <View style={styles.line}></View>
        </View>
      </View>
      <View style={styles.logout}>
        <TouchableOpacity style={styles.btn_logout}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="logout" size={22} color="gray" />
            <Text style={styles.title1}>Đăng xuất</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "pink",
    flex: 1,
  },
  menu_1: {
    paddingLeft: 18,
  },
  menu_2: {
    paddingLeft: 18,
  },
  menu_3: {
    paddingLeft: 18,
  },
  menu_4: {
    paddingLeft: 18,
  },
  menu_5: {
    paddingLeft: 18,
  },
  logout: {
    paddingTop: 18,
    paddingLeft: 18,
    paddingRight: 18,
  },

  title_1: {
    // backgroundColor: "yellow",
    flexDirection: "row",
    alignItems: "center",
    height: 50,
  },
  vector_location: { position: "absolute", right: 18 },
  title1: { fontSize: 17, fontWeight: "500", marginLeft: 16 },
  location_line: {
    alignItems: "flex-end",
  },
  line: { borderWidth: 1, borderColor: "#ECECEC", width: "90%" },
  line2: { borderWidth: 4, borderColor: "#ECECEC", width: "100%" },
  btn_logout: {
    height: 50,
    backgroundColor: "#C5C5C5",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
