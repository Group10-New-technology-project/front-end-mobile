import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import Modal from "react-native-modal";
import { Dimensions, StyleSheet, Text, View, FlatList, Image, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import { FontAwesome, FontAwesome5, Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DanhBaScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [fetchData1Completed, setFetchData1Completed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [pickedItem, setPickedItem] = useState([]);
  const ID = userData?._id;
  console.log(ID);
  useEffect(() => {
    const fetchDataUserLogin = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const user = JSON.parse(storedUserData);
          console.log("Thông tin người dùng đã đăng nhập:", user);
          setUserData(user);
        } else {
          console.log("Không có thông tin người dùng được lưu");
        }
        // Đánh dấu fetchData1 đã hoàn thành
        setFetchData1Completed(true);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };
    fetchDataUserLogin();
  }, []);

  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };
  const onChange = (event) => {
    setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
  };
  const goDanhBaMay = () => {
    navigation.navigate("DanhBaMay");
    console.log("Danh bạ máy");
  };
  const goLoiMoiKetBan = () => {
    navigation.navigate("LoiMoiKetBan", { ID: ID });
    console.log("Lời mời kết bạn");
  };
  const handleLoad = () => {
    fetchData();
  };

  useEffect(() => {
    // Nếu isFocused và fetchData1 đã hoàn thành, gọi fetchData
    if (isFocused && fetchData1Completed) {
      fetchData();
    }
  }, [isFocused, fetchData1Completed]);

  const handle_deleteUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/deleteFriends`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_sender: ID,
          id_receiver: pickedItem.id,
        }),
      });
      if (response.ok) {
        Alert.alert(`Xóa bạn ${pickedItem.name} thành công`);
        setIsBottomSheetVisible(false);
        fetchData();
      } else {
        console.error("Failed to delete friend request");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchData = async () => {
    try {
      // Gửi yêu cầu lấy thông tin user
      const response = await fetch(`${API_URL}/api/v1/users/${ID}`);
      const userData = await response.json();
      // Lọc thông tin của user trong danh sách bạn bè
      const friendIds = userData.friends;
      const friendInfoPromises = friendIds.map(async (friendId) => {
        const friendResponse = await fetch(`${API_URL}/api/v1/users/${friendId}`);
        const friendData = await friendResponse.json();
        return {
          username: friendData.username,
          name: friendData.name,
          avatar: friendData.avatar,
          id: friendData._id,
        };
      });
      const friendInfo = await Promise.all(friendInfoPromises);
      setUsers(friendInfo);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  /// Sắp xếp dữ liệu theo thuộc tính 'name'
  const totalUsers = users.length;
  const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));
  //Render list user
  const renderUserItem = ({ item, index }) => {
    const isFirstInGroup = index === 0 || sortedUsers[index - 1].name[0] !== item.name[0];

    const handlePickModal = () => {
      setIsBottomSheetVisible(true);
      // console.log(item.id);
      // console.log(item.name);
      // console.log(item.username);
      setPickedItem(item);
    };
    const handleChonUser = () => {
      navigation.navigate("XemTrangCaNhan", { user_id: item.id });
      // console.log("Chọn user", item.id);
    };
    return (
      <View style={styles.contacts}>
        {isFirstInGroup && <Text style={styles.text_group_header}>{item.name[0]}</Text>}
        <View style={styles.one_contact}>
          <View style={styles.user_contacts}>
            <TouchableOpacity onPress={handleChonUser} onLongPress={handlePickModal}>
              <View style={styles.container_user}>
                <Image source={{ uri: item.avatar }} style={styles.avatar_user} />
                <Text style={styles.content_3}>{item.name}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.container_user}>
              <Feather style={{ marginHorizontal: 15 }} name="phone" size={20} color="gray" />
              <AntDesign name="videocamera" size={20} color="gray" />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderContentView = () => {
    switch (selectedIndex) {
      case 0:
        return (
          <View style={{ backgroundColor: "white", flex: 1 }}>
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
                  <TouchableOpacity onPress={handleLoad}>
                    <View style={{ flexDirection: "column" }}>
                      <Text style={styles.content_1}>Lịch sinh nhật</Text>
                      <Text style={styles.content_2}>Theo dõi sinh nhật của bạn bè</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <SafeAreaView style={styles.line} />
            <View style={styles.header_contacts}>
              <Text style={styles.content_totalUsers}>Tất cả {totalUsers}</Text>
              <Text style={styles.content_totalUsers}>Bạn mới {totalUsers}</Text>
            </View>
            <FlatList data={sortedUsers} renderItem={renderUserItem} keyExtractor={(item, index) => index.toString()} />
          </View>
        );
      case 1:
        return (
          <View style={[styles.contentView, {}]}>
            <Text style={styles.contentText}>NHÓM</Text>
          </View>
        );
      case 2:
        return (
          <View style={[styles.contentView, {}]}>
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
          values={["Bạn bè", "Nhóm", "Khác"]}
          selectedIndex={selectedIndex}
          onChange={onChange}
          fontStyle={{ fontSize: 16 }}
        />
      </View>
      {renderContentView()}
      <Modal
        style={styles.modal_container}
        isVisible={isBottomSheetVisible}
        swipeDirection={["left", "right"]}
        animationIn="slideInLeft"
        animationOut="slideOutRight"
        onSwipeComplete={toggleBottomSheet}
        onBackdropPress={toggleBottomSheet}>
        <View style={styles.modal_size}>
          <View style={{ alignItems: "center" }}>
            <SafeAreaView style={styles.line_modal} />
          </View>

          <View style={{ backgroundColor: "white", padding: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={{ uri: pickedItem.avatar }} style={styles.avatar_user} />
              <View style={{}}>
                <Text style={styles.content_3}>{pickedItem.name}</Text>
                <Text style={styles.content_2}>{pickedItem.username}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handle_deleteUser}>
              <Text style={styles.content_delete}>Xóa bạn</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  modal_container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "FFFFFF",
  },
  modal_size: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: "55%",
    width: Dimensions.get("window").width * 0.8,
  },
  line_modal: {
    marginTop: 10,
    height: 5,
    width: "30%",
    backgroundColor: "#DEE3E7",
    borderRadius: 50,
  },
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
    height: Dimensions.get("window").height * 0.04,
  },
  avatar_user: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  contacts_container: {
    // backgroundColor: "white",
  },
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
    paddingVertical: 13,
  },
  line: {
    height: 7,
    backgroundColor: "#F0F0F0",
  },
  content_delete: {
    paddingTop: 20,
    fontSize: 20,
    color: "red",
    fontWeight: "500",
  },
});
