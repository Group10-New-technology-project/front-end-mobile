import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import { Ionicons, Octicons } from "@expo/vector-icons";

export default function XemThongTinProfile({ route, navigation }) {
  const { user_id } = route.params;
  const [dataUser, setDataUser] = useState({});

  useEffect(() => {
    fetchDataUser();
  }, []);

  const fetchDataUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/users/${user_id}`);
      // console.log(response.data);
      setDataUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    // Đảm bảo rằng ngày và tháng có hai chữ số bằng cách thêm '0' vào trước nếu cần
    const formattedDay = day < 10 ? "0" + day : day;
    const formattedMonth = month < 10 ? "0" + month : month;

    // Trả về ngày định dạng
    return formattedDay + "/" + formattedMonth + "/" + year;
  };

  return (
    <View style={styles.container}>
      <View style={styles.coverImage}>
        <Image source={{ uri: dataUser.coveravatar }} style={styles.image} />
      </View>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btn_top}>
        <Ionicons name="chevron-back" size={25} color="white" />
        <Ionicons name="chatbubble-ellipses-outline" size={25} color="white" />
      </TouchableOpacity>
      <View style={{ position: "absolute", top: 200, left: 18, flexDirection: "row", alignItems: "center" }}>
        <Image source={{ uri: dataUser.avatar }} style={styles.avatar} />
        <Text style={{ fontSize: 22, fontWeight: "500", color: "#FFF", marginHorizontal: 10 }}>{dataUser.name}</Text>
        <Octicons name="check-circle-fill" size={18} color="#1C89ED" />
      </View>
      <View styles={styles.info}>
        <Text style={{ fontSize: 16, fontWeight: "500", paddingLeft: 18, paddingTop: 18 }}>Thông tin cá nhân</Text>
        <View style={styles.content1}>
          <Text style={styles.title1}>Giới tính</Text>
          <Text style={{ fontSize: 16 }}>{dataUser.gender}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.content1}>
          <Text style={styles.title1}>Ngày sinh</Text>
          <Text style={{ fontSize: 16 }}>{formatDate(dataUser.dateofbirth)}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.content1}>
          <Text style={styles.title1}>Số điện thoại</Text>
          <Text style={{ fontSize: 16 }}>{dataUser.username ? `0${dataUser.username.slice(3)}` : ""}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.content1}>
          <Text style={styles.title1}>Ngày tham gia</Text>
          <Text style={{ fontSize: 16 }}>{formatDate(dataUser.createdAt)}</Text>
        </View>
        <View style={styles.line} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 275,
  },
  avatar: {
    borderWidth: 3,
    borderColor: "white",
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  info: {
    paddingLeft: 18,
  },
  line: {
    height: 1,
    backgroundColor: "#E2E2E2",
    marginLeft: 18,
  },
  content1: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
  },
  title1: {
    width: 140,
    fontSize: 16,
    color: "gray",
  },
  btn_top: {
    position: "absolute",
    top: 54,
    left: 14,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    width: "92%",
  },
});
