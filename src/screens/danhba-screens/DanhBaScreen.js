import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";

export default function DanhBaScreen() {
  const [data, setData] = React.useState([
    { key: "1", name: "DyyBin", image: require("../../../assets/image/Cristiano.jpg") },
    { key: "2", name: "Anh 7", image: require("../../../assets/image/Cristiano.jpg") },
    { key: "3", name: "Chú Tư", image: require("../../../assets/image/Cristiano.jpg") },
    { key: "4", name: "Cậu 5", image: require("../../../assets/image/Cristiano.jpg") },
    {
      key: "5",
      name: "Cristiano Bình Dương",
      image: require("../../../assets/image/Cristiano.jpg"),
    },
    { key: "6", name: "Fan M.U", image: require("../../../assets/image/Cristiano.jpg") },
    { key: "7", name: "Cục Dàng Trôi Sông", image: require("../../../assets/image/Cristiano.jpg") },
    { key: "8", name: "Vợ", image: require("../../../assets/image/Cristiano.jpg") },
    { key: "9", name: "Em Yêu ", image: require("../../../assets/image/Cristiano.jpg") },
  ]);
  const [sumUser, setSumUser] = useState(0);
  useEffect(() => {
    setSumUser(data.length);
  }, [data]);

  const [colorText1, setColorText1] = useState("#000");
  const [colorText2, setColorText2] = useState("#645C5C");
  const [colorText3, setColorText3] = useState("#645C5C");

  const [borderBottom1, setBoderBottom1] = useState("blue");
  const [borderBottom2, setBoderBottom2] = useState("gray");
  const [borderBottom3, setBoderBottom3] = useState("gray");

  const [groupedData, setGroupedData] = useState([]);

  const sortAndGroupDataByName = () => {
    // Sắp xếp dữ liệu theo tên
    const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));

    // Phân loại dữ liệu theo chữ cái
    const groupedData = [];
    let currentChar = "";
    let currentGroup = [];
    sortedData.forEach((item) => {
      const firstChar = item.name.charAt(0).toUpperCase();
      if (firstChar !== currentChar) {
        if (currentGroup.length > 0) {
          groupedData.push({ char: currentChar, items: currentGroup });
        }
        currentChar = firstChar;
        currentGroup = [item];
      } else {
        currentGroup.push(item);
      }
    });
    // Thêm nhóm cuối cùng vào mảng
    if (currentGroup.length > 0) {
      groupedData.push({ char: currentChar, items: currentGroup });
    }

    // Cập nhật dữ liệu
    setGroupedData(groupedData);
  };

  useEffect(() => {
    sortAndGroupDataByName();
  }, []);

  console.log(groupedData);
  return (
    <View style={styles.container}>
      <View style={styles.submenu}>
        {/* <TouchableOpacity style = {styles.btn} 
                        onPress = {() => {
                            setType("All")
                            setColorText1("rgba(233, 65, 65, 1)")
                            setColorText2("rgba(190, 182, 182, 1)")
                            setColorText3("rgba(190, 182, 182, 1)")
                        }}
                    >
                        <Text style = {[styles.textbtn, {color : colorText1}]}>ALL</Text>
                    </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.submenu_btn}
          onPress={() => {
            setColorText2("#645C5C");
            setColorText3("#645C5C");
            setColorText1("#000");
            setBoderBottom1("blue");
            setBoderBottom2("gray");
            setBoderBottom3("gray");
          }}>
          <View style={[styles.lineBottom_main, { borderColor: borderBottom1 }]}>
            <Text style={[styles.submenu_text_main, { color: colorText1 }]}>Bạn bè</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submenu_btn}
          onPress={() => {
            setColorText1("#645C5C");
            setColorText2("#000");
            setColorText3("#645C5C");
            setBoderBottom1("gray");
            setBoderBottom2("blue");
            setBoderBottom3("gray");
          }}>
          <View style={[styles.lineBottom, { borderColor: borderBottom2 }]}>
            <Text style={[styles.submenu_text, { color: colorText2 }]}>Nhóm</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submenu_btn}
          onPress={() => {
            setColorText1("#645C5C");
            setColorText3("#000");
            setColorText2("#645C5C");
            setBoderBottom3("blue");
            setBoderBottom2("gray");
            setBoderBottom1("gray");
          }}>
          <View style={[styles.lineBottom, { borderColor: borderBottom3 }]}>
            <Text style={[styles.submenu_text, { color: colorText3 }]}>OA</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.options}>
        <TouchableOpacity style={styles.subOptions}>
          <View style={styles.border_options}>
            <FontAwesome5 name="user-friends" size={20} color="white" />
          </View>

          <Text style={styles.options_text}>Lời mời kết bạn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.subOptions}>
          <View style={styles.border_options}>
            <FontAwesome6 name="address-book" size={24} color="white" />
          </View>
          <Text style={styles.options_text}>Danh bạ máy</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.broken}></View>
      <View style={styles.fill}>
        <TouchableOpacity style={styles.fill_all}>
          <Text style={styles.submenu_text_main}>Tất cả</Text>
          <Text style={styles.text_count_main}>{sumUser}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fill_dn}>
          <Text style={styles.submenu_text}>Mới truy cập</Text>
          <Text style={styles.submenu_text}>{sumUser}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groupedData}
        renderItem={({ item }) => (
          <>
            <Text style={styles.header}>{item.char}</Text>
            {item.items.map((contact) => (
              <TouchableOpacity key={contact.key}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    height: 70,
                    paddingLeft: 10,
                  }}>
                  <Image style={styles.img_danhba} source={contact.image} />
                  <View>
                    <Text style={styles.text_danhba}>{contact.name}</Text>
                  </View>
                  <View style={styles.call_sections}>
                    <TouchableOpacity>
                      <Feather name="phone" size={20} color="gray" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <AntDesign name="videocamera" size={20} color="gray" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  submenu: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-around",
    height: 50,
    width: "100%",
    backgroundColor: "#D9D9D9",
    borderWidth: 1,
    borderColor: "grey",
  },
  submenu_btn: {
    height: 50,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  lineBottom_main: {
    position: "absolute",
    top: 10,
    bottom: 0,
    borderBottomWidth: 1,
    borderColor: "blue",
  },
  lineBottom: {
    position: "absolute",
    top: 10,
    bottom: 0,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  submenu_text: {
    color: "#645C5C",
    fontSize: 20,
    fontWeight: "600",
  },
  submenu_text_main: {
    color: "#000",
    fontSize: 20,
    fontWeight: "600",
  },
  options: {
    marginTop: 10,
    width: "100%",
    height: 100,
  },
  subOptions: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    justifyContent: "space-around",
  },
  options_img: {
    height: 60,
    width: 60,
  },
  options_text: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    width: 300,
  },
  broken: {
    width: "100%",
    height: 10,
    backgroundColor: "#D9D9D9",
  },
  fill: {
    width: "100%",
    height: 55,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 0.1,
    borderColor: "gray",
  },
  fill_all: {
    width: 100,
    height: 40,
    backgroundColor: "#D9D9D9",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 50,
    flexDirection: "row",
  },
  text_count_main: {
    fontSize: 18,
    color: "#000",
    fontWeight: "500",
  },
  fill_dn: {
    width: 150,
    height: 40,
    backgroundColor: "#D9D9D9",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 50,
    flexDirection: "row",
  },
  text_count_dn: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
  },
  img_danhba: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  call_sections: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 100,
    height: 50,
    alignItems: "center",
  },
  text_danhba: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    width: 180,
  },
  border_options: {
    height: 35,
    width: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "blue",
  },
  header: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
});
