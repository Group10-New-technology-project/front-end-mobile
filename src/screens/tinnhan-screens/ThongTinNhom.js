import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ScrollView, Alert } from "react-native";
import { AntDesign, MaterialCommunityIcons, MaterialIcons, Ionicons, Feather, FontAwesome6 } from "@expo/vector-icons";
import { API_URL } from "@env";
import axios from "axios";

export default function ThongTinNhom({ navigation, route }) {
  const { conversationId, userId } = route.params;
  const [ConversationData, setConversationData] = useState(null);
  const [userFriendId, setUserFriendId] = useState(null);
  const [type, setType] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("a");
  const [arrayimage, setArrayImage] = useState([]);
  const [isFirstSelected, setIsFirstSelected] = useState([true, true, true]);
  const handleXoaThanhVien = async () => {
    try {
      console.log("conversationId", conversationId);
      console.log("userId", userId);
      const response = await axios.post(`${API_URL}/api/v1/conversation/leaveConversation`, {
        conversationID: conversationId,
        userID: userId,
      });
      navigation.navigate("Tabs");
    } catch (error) {
      console.error("Error:", error.response.data);
      Alert.alert("Error", "Failed to remove deputy from conversation. Please try again.");
    }
  };
  const handleGiaiTanNhom = async () => {
    try {
      Alert.alert("Thông báo", "Bạn có chắc chắn muốn giải tán nhóm?", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const response = await axios.post(`${API_URL}/api/v1/conversation/deleteConversationById/${conversationId}`);
            console.log("Giai tan nhom thanh cong");
            Alert.alert("Thông báo", "Đã giải tán nhóm thành công");
            navigation.navigate("Tabs");
          },
        },
      ]);
    } catch (error) {
      console.error("Error:", error.response.data);
      Alert.alert("Error", "Failed. Please try again.");
    }
  };

  const toggleSelection = (index) => {
    setIsFirstSelected((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  useEffect(() => {
    fetchConversationData();
  }, []);

  const fetchConversationData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/conversation/getConversationByIdApp/${conversationId}`);
      const data = await response.json();
      setConversationData(data);

      if (data) {
        if (data.type === "Direct") {
          setType("Direct");
          const member = data.members.find((member) => member.userId && member.userId._id !== userId);
          let name1 = member ? member.userId.name : "";
          setName(name1);
          setImage(member ? member.userId.avatar : "");
          setUserFriendId(member ? member.userId._id : "");
        } else if (data.type === "Group") {
          setType("Group");
          setName(data.name);
          if (data.groupImage && data.groupImage !== "") {
            setImage(data.groupImage);
          } else {
          }
        }

        for (let i = 0; i < data.messages.length; i++) {
          if (data.messages[i].type === "image") {
            setArrayImage((arrayimage) => [...arrayimage, data.messages[i].content]);
          }
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu cuộc trò chuyện:", error);
    }
  };

  const handleXemThanhVien = () => {
    navigation.navigate("ThanhVienNhom", { conversationId: conversationId });
  };
  const handleThemThanhVien = () => {
    navigation.navigate("ThemNhieuThanhVienVaoNhom", { conversationId: conversationId });
  };
  const AddFriendToGroup = () => {
    navigation.navigate("ThemThanhVienVaoNhieuNhom", { userFriendId: userFriendId, name: name });
  };
  const handleTaoNhomVoi = () => {
    navigation.navigate("TaoNhom", { userFriendId: userFriendId });
  };

  return (
    <ScrollView nestedScrollEnabled={true}>
      {type === "Group" ? (
        <View style={styles.container}>
          <View style={{ height: 230, justifyContent: "flex-start", alignItems: "center" }}>
            <View style={{ marginTop: 10, height: 75, width: 75, backgroundColor: "white", borderRadius: 50 }}>
              <Image style={{ height: 75, width: 75, borderRadius: 50 }} source={{ uri: image }} />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "500",
                  color: "#232323",
                  // fontFamily: "Sans-serif",
                  marginTop: 15,
                }}>
                {name}
              </Text>
            </View>
            <View style={{ marginTop: 18, flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ marginHorizontal: 11, height: 80, width: 70, alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity>
                  <View
                    style={{
                      borderRadius: 50,
                      height: 45,
                      width: 45,
                      backgroundColor: "#F7F7F7",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <AntDesign name="search1" size={20} color="#111111" />
                  </View>
                </TouchableOpacity>
                <Text style={{ textAlign: "center", color: "#212121" }}>Tìm tin nhắn</Text>
              </View>
              <View style={{ marginHorizontal: 11, height: 80, width: 70, alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={handleThemThanhVien}>
                  <View
                    style={{
                      borderRadius: 50,
                      height: 45,
                      width: 45,
                      backgroundColor: "#F7F7F7",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <AntDesign name="addusergroup" size={20} color="#111111" />
                  </View>
                </TouchableOpacity>
                <Text style={{ textAlign: "center", color: "#212121" }}>Thêm thành viên</Text>
              </View>
              <View style={{ marginHorizontal: 11, height: 80, width: 70, alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity>
                  <View
                    style={{
                      borderRadius: 50,
                      height: 45,
                      width: 45,
                      backgroundColor: "#F7F7F7",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <MaterialIcons name="brush" size={21} color="#111111" />
                  </View>
                </TouchableOpacity>

                <Text style={{ textAlign: "center", color: "#212121" }}>Đổi hình nền</Text>
              </View>
              <View style={{ marginHorizontal: 11, height: 80, width: 70, alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity>
                  <View
                    style={{
                      borderRadius: 50,
                      height: 45,
                      width: 45,
                      backgroundColor: "#F7F7F7",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <MaterialCommunityIcons name="bell-outline" size={22} color="#111111" />
                  </View>
                </TouchableOpacity>

                <Text style={{ textAlign: "center", color: "#212121" }}>Tắt thông báo</Text>
              </View>
            </View>
          </View>
          <View style={{ height: 8, backgroundColor: "#F7F8FA" }}></View>
          <View style={{ height: 50, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", marginLeft: 10 }}>
              <Ionicons name="alert-circle-outline" size={25} color="#7C828A" />
              <TouchableOpacity>
                <Text style={{ marginLeft: 17, marginTop: 2, fontSize: 16, color: "#7C828A" }}>Thêm mô tả nhóm</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity>
              <Ionicons name="chevron-forward-outline" size={17} color="#7C828A" style={{ marginRight: 10 }} />
            </TouchableOpacity>
          </View>
          <View style={{ height: 8, backgroundColor: "#F7F8FA" }}></View>
          <View style={{ height: 285, justifyContent: "flex-start", alignItems: "center" }}>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <MaterialCommunityIcons name="folder-multiple-image" size={21} color="#7F8284" />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Ảnh, file, link đã gửi</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward-outline" size={17} color="#7C828A" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", marginLeft: 10 }}>
              {arrayimage.length === 0 ? (
                <View
                  style={{
                    margin: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 70,
                    width: 360,
                    backgroundColor: "#FAFAFA",
                    borderRadius: 3,
                    flexDirection: "row",
                  }}>
                  <Image
                    style={{ height: 40, width: 40, borderRadius: 50, marginLeft: 10 }}
                    source={{
                      uri: "https://static.vecteezy.com/system/resources/previews/010/895/506/non_2x/cloud-icon-sign-for-web-and-app-free-png.png",
                    }}
                  />
                  <Text style={{ color: "#768EA1", padding: 10 }}>Hình mới nhất của cuộc trò chuyện sẽ xuất hiện ở đây</Text>
                </View>
              ) : (
                <>
                  <FlatList
                    horizontal={true}
                    data={arrayimage.slice(0, 4)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity>
                        <View key={item} style={{ margin: 2, height: 70, width: 65, backgroundColor: "white", borderRadius: 3 }}>
                          <Image style={{ height: 70, width: 65, borderRadius: 5 }} source={{ uri: item }} />
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity>
                    <View
                      style={{
                        margin: 2,
                        height: 70,
                        width: 65,
                        backgroundColor: "#ECF0F3",
                        borderRadius: 3,
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      <Ionicons name="arrow-forward-outline" size={20} color="#108AEF" />
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <View style={{ marginTop: 7, height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <Ionicons name="calendar-outline" size={21} color="#7F8284" />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Lịch nhóm</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward-outline" size={17} color="#7C828A" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>
            <View style={{ height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <AntDesign name="pushpino" size={20} color="#7C828A" style={{ transform: [{ rotateY: "180deg" }] }} />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Tin nhắn đã ghim</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward-outline" size={17} color="#7C828A" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>
            <View style={{ height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <MaterialIcons name="bar-chart" size={21} color="#7C828A" />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Bình chọn</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward-outline" size={17} color="#7C828A" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 8, backgroundColor: "#F7F8FA" }}></View>
          <View style={{ height: 110, justifyContent: "flex-start", alignItems: "center" }}>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <Ionicons name="people-outline" size={21} color="#7F8284" />
                <TouchableOpacity onPress={handleXemThanhVien}>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>
                    Xem thành viên <Text style={{ fontSize: 15 }}>(5)</Text>
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward-outline" size={17} color="#7C828A" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 7, height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <MaterialCommunityIcons name="link-variant" size={21} color="#7C828A" />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Link tham gia nhóm</Text>
                  <Text style={{ marginLeft: 17, fontSize: 11, color: "#7C828A" }}>https://zalo.me/tuankietdeptrai</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward-outline" size={17} color="#7C828A" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 8, backgroundColor: "#F7F8FA" }}></View>
          <View style={{ height: 220, justifyContent: "flex-start", alignItems: "center" }}>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <AntDesign name="pushpino" size={20} color="#7C828A" style={{ transform: [{ rotateY: "180deg" }] }} />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Ghim cuộc trò chuyện</Text>
                </TouchableOpacity>
              </View>
              {isFirstSelected[0] ? (
                <TouchableOpacity onPress={() => toggleSelection(0)}>
                  <View
                    style={{
                      height: 22,
                      width: 38,
                      backgroundColor: "#E9E9EB",
                      borderRadius: 50,
                      justifyContent: "center",
                      marginRight: 10,
                    }}>
                    <View style={{ marginLeft: 1, height: 20, width: 20, backgroundColor: "white", borderRadius: 50 }}></View>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => toggleSelection(0)}>
                  <View
                    style={{
                      height: 22,
                      width: 38,
                      backgroundColor: "#0085FE",
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "flex-end",
                      marginRight: 10,
                    }}>
                    <View style={{ marginLeft: 1, height: 20, width: 20, backgroundColor: "white", borderRadius: 50 }}></View>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            <View style={{ marginTop: 7, height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10, alignItems: "center" }}>
                <MaterialCommunityIcons name="label-outline" size={21} color="#7C828A" />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Thẻ phân loại</Text>
                  <Text style={{ marginLeft: 17, fontSize: 11, color: "#7C828A" }}>Chưa gắn thẻ</Text>
                </TouchableOpacity>
              </View>
              <View></View>
            </View>
            <View style={{ marginTop: 7, height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <Ionicons name="eye-off-outline" size={20} color="#7C828A" style={{ transform: [{ rotateY: "180deg" }] }} />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Ẩn trò chuyện</Text>
                </TouchableOpacity>
              </View>
              {isFirstSelected[1] ? (
                <TouchableOpacity onPress={() => toggleSelection(1)}>
                  <View
                    style={{
                      height: 22,
                      width: 38,
                      backgroundColor: "#E9E9EB",
                      borderRadius: 50,
                      justifyContent: "center",
                      marginRight: 10,
                    }}>
                    <View style={{ marginLeft: 1, height: 20, width: 20, backgroundColor: "white", borderRadius: 50 }}></View>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => toggleSelection(1)}>
                  <View
                    style={{
                      height: 22,
                      width: 38,
                      backgroundColor: "#0085FE",
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "flex-end",
                      marginRight: 10,
                    }}>
                    <View style={{ marginLeft: 1, height: 20, width: 20, backgroundColor: "white", borderRadius: 50 }}></View>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10, alignItems: "center" }}>
                <MaterialCommunityIcons name="account-cog-outline" size={21} color="#7C828A" />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Cài đặt cá nhân</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward-outline" size={17} color="#7C828A" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 8, backgroundColor: "#F7F8FA" }}></View>
          <View style={{ height: 220, justifyContent: "flex-start", alignItems: "center" }}>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10, justifyContent: "center" }}>
                <AntDesign name="warning" size={20} color="#7C828A" style={{ transform: [{ rotateY: "180deg" }] }} />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Báo xấu</Text>
                </TouchableOpacity>
              </View>
              <View></View>
            </View>

            <View style={{ marginTop: 5, height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10, justifyContent: "center" }}>
                <Feather name="pie-chart" size={21} color="#7C828A" />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Dung lượng trò chuyện</Text>
                </TouchableOpacity>
              </View>
              <View></View>
            </View>
            <View style={{ marginTop: 7, height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <Ionicons name="trash-outline" size={20} color="#7C828A" style={{ transform: [{ rotateY: "180deg" }] }} />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Xóa lịch sử trò chuyện</Text>
                </TouchableOpacity>
              </View>
              <View></View>
            </View>
            <View style={{ marginTop: 5, height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10, alignItems: "center" }}>
                <Ionicons name="log-out-outline" size={20} color="#EC514C" style={{ transform: [{ rotateY: "180deg" }] }} />
                <TouchableOpacity onPress={() => handleXoaThanhVien()}>
                  <Text style={{ marginLeft: 17, fontSize: 16, color: "#EC514C" }}>Rời nhóm</Text>
                </TouchableOpacity>
              </View>
              <View></View>
            </View>
          </View>
        </View>
      ) : type === "Direct" ? (
        <View style={styles.container}>
          <View style={{ height: 230, justifyContent: "flex-start", alignItems: "center" }}>
            <View style={{ marginTop: 10, height: 75, width: 75, backgroundColor: "white", borderRadius: 50 }}>
              <Image style={{ height: 75, width: 75, borderRadius: 50 }} source={{ uri: image }} />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "500",
                  color: "#232323",
                  marginTop: 15,
                }}>
                {name}
              </Text>
            </View>
            <View style={{ marginTop: 18, flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ marginHorizontal: 11, height: 80, width: 70, alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity>
                  <View
                    style={{
                      borderRadius: 50,
                      height: 45,
                      width: 45,
                      backgroundColor: "#F7F7F7",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <AntDesign name="search1" size={20} color="#111111" />
                  </View>
                </TouchableOpacity>

                <Text style={{ textAlign: "center", color: "#212121" }}>Tìm tin nhắn</Text>
              </View>
              <View style={{ marginHorizontal: 11, height: 80, width: 70, alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity>
                  <View
                    style={{
                      borderRadius: 50,
                      height: 45,
                      width: 45,
                      backgroundColor: "#F7F7F7",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <FontAwesome6 name="user" size={18} color="#111111" />
                  </View>
                </TouchableOpacity>

                <Text style={{ textAlign: "center", color: "#212121" }}>Trang cá nhân</Text>
              </View>
              <View style={{ marginHorizontal: 11, height: 80, width: 70, alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity>
                  <View
                    style={{
                      borderRadius: 50,
                      height: 45,
                      width: 45,
                      backgroundColor: "#F7F7F7",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <MaterialIcons name="brush" size={21} color="#111111" />
                  </View>
                </TouchableOpacity>

                <Text style={{ textAlign: "center", color: "#212121" }}>Đổi hình nền</Text>
              </View>
              <View style={{ marginHorizontal: 11, height: 80, width: 70, alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity>
                  <View
                    style={{
                      borderRadius: 50,
                      height: 45,
                      width: 45,
                      backgroundColor: "#F7F7F7",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <MaterialCommunityIcons name="bell-outline" size={22} color="#111111" />
                  </View>
                </TouchableOpacity>

                <Text style={{ textAlign: "center", color: "#212121" }}>Tắt thông báo</Text>
              </View>
            </View>
          </View>
          <View style={{ height: 8, backgroundColor: "#F7F8FA" }}></View>
          <View style={{ height: 170, justifyContent: "flex-start", alignItems: "center" }}>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10, alignItems: "center" }}>
                <AntDesign name="edit" size={21} color="#7C828A" />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Đổi tên gợi nhớ</Text>
                </TouchableOpacity>
              </View>
              <View></View>
            </View>
            <View style={{ marginTop: 7, height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <AntDesign name="staro" size={20} color="#7C828A" style={{ transform: [{ rotateY: "180deg" }] }} />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Đánh dấu bạn thân</Text>
                </TouchableOpacity>
              </View>
              {isFirstSelected[3] ? (
                <TouchableOpacity onPress={() => toggleSelection(3)}>
                  <View
                    style={{
                      height: 22,
                      width: 38,
                      backgroundColor: "#E9E9EB",
                      borderRadius: 50,
                      justifyContent: "center",
                      marginRight: 10,
                    }}>
                    <View style={{ marginLeft: 1, height: 20, width: 20, backgroundColor: "white", borderRadius: 50 }}></View>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => toggleSelection(3)}>
                  <View
                    style={{
                      height: 22,
                      width: 38,
                      backgroundColor: "#0085FE",
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "flex-end",
                      marginRight: 10,
                    }}>
                    <View style={{ marginLeft: 1, height: 20, width: 20, backgroundColor: "white", borderRadius: 50 }}></View>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ marginTop: 7, height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <MaterialCommunityIcons name="clock-time-five-outline" size={21} color="#7C828A" />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Nhật ký chung</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward-outline" size={17} color="#7C828A" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 8, backgroundColor: "#F7F8FA" }}></View>
          <View style={{ height: 125, justifyContent: "flex-start", alignItems: "center" }}>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <MaterialCommunityIcons name="folder-multiple-image" size={21} color="#7F8284" />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Ảnh, file, link đã gửi</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward-outline" size={17} color="#7C828A" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", marginLeft: 10 }}>
              {arrayimage.length === 0 ? (
                <View
                  style={{
                    margin: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 70,
                    width: 360,
                    backgroundColor: "#FAFAFA",
                    borderRadius: 3,
                    flexDirection: "row",
                  }}>
                  <Image
                    style={{ height: 40, width: 40, borderRadius: 50, marginLeft: 10 }}
                    source={{
                      uri: "https://static.vecteezy.com/system/resources/previews/010/895/506/non_2x/cloud-icon-sign-for-web-and-app-free-png.png",
                    }}
                  />
                  <Text style={{ color: "#768EA1", padding: 10 }}>Hình mới nhất của cuộc trò chuyện sẽ xuất hiện ở đây</Text>
                </View>
              ) : (
                <>
                  <FlatList
                    horizontal={true}
                    data={arrayimage.slice(0, 4)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity>
                        <View key={item} style={{ margin: 2, height: 70, width: 65, backgroundColor: "white", borderRadius: 3 }}>
                          <Image style={{ height: 70, width: 65, borderRadius: 5 }} source={{ uri: item }} />
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity>
                    <View
                      style={{
                        margin: 2,
                        height: 70,
                        width: 65,
                        backgroundColor: "#ECF0F3",
                        borderRadius: 3,
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      <Ionicons name="arrow-forward-outline" size={20} color="#108AEF" />
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
          <View style={{ height: 8, backgroundColor: "#F7F8FA" }}></View>
          <View style={{ height: 170, justifyContent: "flex-start", alignItems: "center" }}>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <AntDesign name="addusergroup" size={21} color="#7F8284" />
                <TouchableOpacity onPress={handleTaoNhomVoi}>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Tạo nhóm với {name}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward-outline" size={17} color="#7C828A" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 7, height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <Ionicons name="person-add-outline" size={21} color="#7C828A" style={{ transform: [{ rotateY: "180deg" }] }} />
                <TouchableOpacity onPress={AddFriendToGroup}>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Thêm {name} vào nhóm</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward-outline" size={17} color="#7C828A" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 7, height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <Feather name="users" size={21} color="#7C828A" style={{ transform: [{ rotateY: "180deg" }] }} />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>
                    Xem nhóm chung <Text style={{ fontSize: 11 }}>(11)</Text>
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward-outline" size={17} color="#7C828A" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 8, backgroundColor: "#F7F8FA" }}></View>
          <View style={{ height: 275, justifyContent: "flex-start", alignItems: "center" }}>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <AntDesign name="pushpino" size={20} color="#7C828A" style={{ transform: [{ rotateY: "180deg" }] }} />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Ghim cuộc trò chuyện</Text>
                </TouchableOpacity>
              </View>
              {isFirstSelected[0] ? (
                <TouchableOpacity onPress={() => toggleSelection(0)}>
                  <View
                    style={{
                      height: 22,
                      width: 38,
                      backgroundColor: "#E9E9EB",
                      borderRadius: 50,
                      justifyContent: "center",
                      marginRight: 10,
                    }}>
                    <View style={{ marginLeft: 1, height: 20, width: 20, backgroundColor: "white", borderRadius: 50 }}></View>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => toggleSelection(0)}>
                  <View
                    style={{
                      height: 22,
                      width: 38,
                      backgroundColor: "#0085FE",
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "flex-end",
                      marginRight: 10,
                    }}>
                    <View style={{ marginLeft: 1, height: 20, width: 20, backgroundColor: "white", borderRadius: 50 }}></View>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10, alignItems: "center" }}>
                <MaterialCommunityIcons name="label-outline" size={21} color="#7C828A" />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Thẻ phân loại</Text>
                  <Text style={{ marginLeft: 17, fontSize: 11, color: "#7C828A" }}>Chưa gắn thẻ</Text>
                </TouchableOpacity>
              </View>
              <View></View>
            </View>
            <View style={{ marginTop: 7, height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <Ionicons name="eye-off-outline" size={21} color="#7C828A" style={{ transform: [{ rotateY: "180deg" }] }} />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Ẩn trò chuyện</Text>
                </TouchableOpacity>
              </View>
              {isFirstSelected[1] ? (
                <TouchableOpacity onPress={() => toggleSelection(1)}>
                  <View
                    style={{
                      height: 22,
                      width: 38,
                      backgroundColor: "#E9E9EB",
                      borderRadius: 50,
                      justifyContent: "center",
                      marginRight: 10,
                    }}>
                    <View style={{ marginLeft: 1, height: 20, width: 20, backgroundColor: "white", borderRadius: 50 }}></View>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => toggleSelection(1)}>
                  <View
                    style={{
                      height: 22,
                      width: 38,
                      backgroundColor: "#0085FE",
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "flex-end",
                      marginRight: 10,
                    }}>
                    <View style={{ marginLeft: 1, height: 20, width: 20, backgroundColor: "white", borderRadius: 50 }}></View>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10, alignItems: "center" }}>
                <MaterialCommunityIcons name="account-cog-outline" size={21} color="#7C828A" />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Cài đặt cá nhân</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward-outline" size={17} color="#7C828A" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 7, height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10, alignItems: "center" }}>
                <MaterialCommunityIcons name="timer-outline" size={21} color="#7C828A" />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Tin nhắn tự xóa</Text>
                  <Text style={{ marginLeft: 17, fontSize: 11, color: "#7C828A" }}>Không tự xóa</Text>
                </TouchableOpacity>
              </View>
              <View></View>
            </View>
          </View>
          <View style={{ height: 8, backgroundColor: "#F7F8FA" }}></View>
          <View style={{ height: 220, justifyContent: "flex-start", alignItems: "center" }}>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10, justifyContent: "center" }}>
                <AntDesign name="warning" size={20} color="#7C828A" style={{ transform: [{ rotateY: "180deg" }] }} />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Báo xấu</Text>
                </TouchableOpacity>
              </View>
              <View></View>
            </View>
            <View style={{ marginTop: 5, height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10, alignItems: "center" }}>
                <MaterialCommunityIcons name="block-helper" size={21} color="#7C828A" />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Quản lý chặn</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward-outline" size={17} color="#7C828A" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 5, height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10, justifyContent: "center" }}>
                <Feather name="pie-chart" size={21} color="#7C828A" />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Dung lượng trò chuyện</Text>
                </TouchableOpacity>
              </View>
              <View></View>
            </View>
            <View style={{ marginTop: 7, height: 1, width: 350, backgroundColor: "#E0E0E0", marginLeft: 40 }}></View>
            <View style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <Ionicons name="trash-outline" size={20} color="#7C828A" style={{ transform: [{ rotateY: "180deg" }] }} />
                <TouchableOpacity>
                  <Text style={{ marginLeft: 17, fontSize: 16 }}>Xóa lịch sử trò chuyện</Text>
                </TouchableOpacity>
              </View>
              <View></View>
            </View>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
});
