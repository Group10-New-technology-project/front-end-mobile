import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View, FlatList, Image, SafeAreaView, TouchableOpacity } from "react-native";
import { FontAwesome5, FontAwesome, Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";

export default function DanhBaScreen({ navigation }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const goDanhBaMay = () => {
    navigation.navigate("DanhBaMay");
    console.log("Danh bạ máy");
  };
  const goLoiMoiKetBan = () => {
    navigation.navigate("LoiMoiKetBan");
    console.log("Lời mời kết bạn");
  };
  const phoneBook = [
    {
      id: 1,
      name: "A Name 1",
      imageAvatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/2017_12_01_09_08_IMG_2742.JPG",
    },
    {
      id: 2,
      name: "A Name 2",
      imageAvatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/2017_12_01_09_08_IMG_2742.JPG",
    },
    {
      id: 3,
      name: "D Name 3",
      imageAvatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/2017_12_01_09_08_IMG_2742.JPG",
    },
    {
      id: 4,
      name: "C Name 4",
      imageAvatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/2017_12_01_09_08_IMG_2742.JPG",
    },
    {
      id: 5,
      name: "M Name 5",
      imageAvatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/2017_12_01_09_08_IMG_2742.JPG",
    },
    {
      id: 6,
      name: "F Name 6",
      imageAvatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/2017_12_01_09_08_IMG_2742.JPG",
    },
    {
      id: 7,
      name: "K Name 7",
      imageAvatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/2017_12_01_09_08_IMG_2742.JPG",
    },
    {
      id: 8,
      name: "L Name 8",
      imageAvatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/2017_12_01_09_08_IMG_2742.JPG",
    },
    {
      id: 9,
      name: "H Name 9",
      imageAvatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/2017_12_01_09_08_IMG_2742.JPG",
    },
    {
      id: 10,
      name: "I Name 10",
      imageAvatar: "https://chanh9999.s3.ap-southeast-1.amazonaws.com/2017_12_01_09_08_IMG_2742.JPG",
    },
  ];

  const sortedData = phoneBook.sort((a, b) => a.name.localeCompare(b.name));
  const totalUsers = phoneBook.length;
  let isAllShown = false; // Biến để kiểm tra xem phần tử "Tất cả" đã được hiển thị hay chưa
  const renderItem = ({ item, index }) => {
    // Kiểm tra nếu đây là phần tử đầu tiên của một nhóm, thêm chữ cái đầu nhóm
    const isFirstInGroup = index === 0 || sortedData[index - 1].name[0] !== item.name[0];
    let isFirstItem = false;
    // Nếu là phần tử đầu tiên trong danh sách, hoặc phần tử này là phần tử "Tất cả" và chưa được hiển thị
    if (index === 0 && !isAllShown) {
      isFirstItem = true;
      isAllShown = true; // Đánh dấu rằng phần tử "Tất cả" đã được hiển thị
    }

    return (
      <View style={styles.contacts_container}>
        {isFirstItem && (
          <View style={styles.function_contacts}>
            <View style={{ paddingLeft: 12 }}>
              <TouchableOpacity onPress={goLoiMoiKetBan}>
                <View style={styles.function_loimoiketban}>
                  <View style={styles.loimoiketban}>
                    <View style={styles.icon_contacts}>
                      <FontAwesome5 name="user-friends" size={17} color="white" />
                    </View>
                    <View style={{ flexDirection: "column" }}>
                      <Text style={styles.content_1}>Lời mời kết bạn</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={goDanhBaMay}>
                <View style={styles.function_danhbamay}>
                  <View style={styles.loimoiketban}>
                    <View style={styles.icon_contacts}>
                      <MaterialIcons name="perm-contact-cal" size={22} color="white" />
                    </View>
                    <View style={{ flexDirection: "column" }}>
                      <Text style={styles.content_1}>Danh bạ máy</Text>
                      <Text style={styles.content_2}>Liên hệ có dùng Zalo</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.function_lichsinhnhat}>
                <View style={styles.loimoiketban}>
                  <View style={styles.icon_contacts}>
                    <FontAwesome name="birthday-cake" size={17} color="white" />
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.content_1}>Lịch sinh nhật</Text>
                    <Text style={styles.content_2}>Theo dõi sinh nhật của bạn bè</Text>
                  </View>
                </View>
              </View>
            </View>
            <SafeAreaView style={styles.line} />
            <View style={styles.header_contacts}>
              <Text style={styles.content_totalUsers}>Tất cả {totalUsers}</Text>
              <Text style={styles.content_totalUsers}>Bạn mới 1</Text>
            </View>
          </View>
        )}

        <View style={styles.contacts}>
          {isFirstInGroup && <Text style={styles.text_group_header}>{item.name[0]}</Text>}
          <View style={styles.one_contact}>
            <View style={styles.user_contacts}>
              <View style={styles.container_user}>
                <Image source={{ uri: item.imageAvatar }} style={styles.avatar_user} />
                <Text style={styles.content_3}>{item.name}</Text>
              </View>
              <View style={styles.container_user}>
                <Feather style={{ marginHorizontal: 15 }} name="phone" size={20} color="gray" />
                <AntDesign name="videocamera" size={20} color="gray" />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const onChange = (event) => {
    setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
  };

  const renderContentView = () => {
    switch (selectedIndex) {
      case 0:
        return (
          <View style={{ backgroundColor: "white" }}>
            <FlatList data={phoneBook} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />
          </View>
        );
      case 1:
        return (
          <View style={[styles.contentView, {}]}>
            <Text style={styles.contentText}>View 2</Text>
            <Text style={styles.contentText}>Nhóm</Text>
          </View>
        );
      case 2:
        return (
          <View style={[styles.contentView, {}]}>
            <Text style={styles.contentText}>View 3</Text>
            <Text style={styles.contentText}>OTA</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.segmentContainer}>
        <SegmentedControl
          style={styles.segment_control}
          values={["Bạn bè", "Nhóm", "OA"]}
          selectedIndex={selectedIndex}
          onChange={onChange}
        />
      </View>
      {renderContentView()}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
    margin: 10,
  },
  content_3: {
    fontSize: 17,
    fontWeight: "400",
    marginLeft: 12,
  },
  container_user: {
    flexDirection: "row",
    alignItems: "center",
  },
  text_group_header: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 12,
  },
  segmentContainer: {},
  container: {
    flex: 1,
  },
  user_contacts: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: Dimensions.get("window").width * 0.92,
  },
  contentView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  contentText: {
    fontSize: 18,
  },
  segment_control: {
    height: Dimensions.get("window").height * 0.045,
  },
  avatar_user: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  contacts_container: {},
  one_contact: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  content_totalUsers: {
    fontSize: 16,
    fontWeight: "500",
    borderWidth: 0.5,
    borderRadius: 16,
    padding: 8,
    marginRight: 12,
    borderColor: "gray",
    color: "gray",
  },
  header_contacts: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  content_1: {
    fontSize: 18,
    fontWeight: "400",
    marginLeft: 12,
  },
  content_2: {
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 12,
    color: "gray",
  },
  icon_contacts: {
    width: 40,
    height: 40,
    backgroundColor: "#0091FF",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  loimoiketban: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  line: {
    height: 8,
    backgroundColor: "#DBDBDB",
  },
});
