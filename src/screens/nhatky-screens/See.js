import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image, Text, FlatList, TouchableOpacity, TextInput } from "react-native"; // Import Text từ react-native
import Modal from "react-native-modal";
import { useRoute } from "@react-navigation/native";

export default function See({ navigation }) {
  const [isFocusedLike, setisFocusedLike] = useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [comment, setComment] = useState("");
  const route = useRoute();
  const selectedImage = route.params && route.params.selectedImage ? route.params.selectedImage : null;

  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };

  return (
    <View style={styles.container}>
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            height: 40,
            flexDirection: "row",
            marginTop: 50,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: "#ffff", marginLeft: 10, fontSize: 16 }}>Đóng</Text>
          </TouchableOpacity>

          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "#ffff", fontSize: 16 }}>2 giờ trước</Text>
            <Text style={{ color: "#ffff", fontSize: 16 }}>1/6</Text>
          </View>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 40,
                marginBottom: 23,
                marginRight: 10,
                fontWeight: 500,
                color: "#ffff",
              }}>
              ...
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Image source={{ uri: selectedImage }} resizeMode="contain" style={{ height: 400, width: 390 }} />
        </View>
        <View style={{ height: 150 }}>
          <View style={{ height: 45 }}>
            <ScrollView>
              <Text style={{ color: "#ffff", fontSize: 16, marginLeft: 13, marginRight: 13 }}>
                Kỹ năng viết đoạn văn ngắn · Trong cấu trúc đề thi minh họa
              </Text>
            </ScrollView>
          </View>

          <View style={{ justifyContent: "center", alignItems: "center", marginTop: 9 }}>
            <View style={{ width: "93%", borderWidth: 0.01, borderColor: "#4C4C4C" }}></View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", height: 22, marginTop: 10 }}>
            <Image source={require("../../../assets/img/tym.png")} resizeMode="contain" style={{ height: 18, width: 17, marginLeft: 17 }} />
            <Text style={{ fontSize: 13, fontWeight: 500, marginLeft: 5, color: "#ffff" }}>100 người khác</Text>
          </View>

          {!isFocusedLike && (
            <View style={{ flexDirection: "row", height: 30, marginTop: 15 }}>
              <TouchableOpacity onPress={() => setisFocusedLike(true)}>
                <View
                  style={{
                    marginLeft: 13,
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    flexDirection: "row",
                    height: 29,
                    width: 40,
                    borderRadius: 50,
                    backgroundColor: "#212121",
                  }}>
                  <Image
                    source={require("../../../assets/img/tymWhite.png")}
                    resizeMode="contain"
                    style={{ height: 25, width: 23, marginTop: 2 }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleBottomSheet}>
                <View
                  style={{
                    marginLeft: 7,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    height: 29,
                    width: 40,
                    borderRadius: 50,
                    backgroundColor: "#212121",
                  }}>
                  <Image
                    source={require("../../../assets/img/commentWhite1.png")}
                    resizeMode="contain"
                    style={{ height: 19, width: 19, marginTop: 2 }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}
          {isFocusedLike && (
            <View style={{ flexDirection: "row", height: 30, marginTop: 15 }}>
              <TouchableOpacity onPress={() => setisFocusedLike(false)}>
                <View
                  style={{
                    marginLeft: 13,
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    flexDirection: "row",
                    height: 29,
                    width: 40,
                    borderRadius: 50,
                    backgroundColor: "#520100",
                  }}>
                  <Image
                    source={require("../../../assets/img/tym.png")}
                    resizeMode="contain"
                    style={{ height: 25, width: 19, marginTop: 2 }}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleBottomSheet}>
                <View
                  style={{
                    marginLeft: 7,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    height: 29,
                    width: 40,
                    borderRadius: 50,
                    backgroundColor: "#212121",
                  }}>
                  <Image
                    source={require("../../../assets/img/commentWhite1.png")}
                    resizeMode="contain"
                    style={{ height: 19, width: 19, marginTop: 2 }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Modal
        isVisible={isBottomSheetVisible}
        style={styles.bottomSheet}
        swipeDirection={["down"]}
        onSwipeComplete={toggleBottomSheet}
        onBackdropPress={toggleBottomSheet}>
        <View style={styles.bottomSheetContainer}>
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                height: 5,
                width: "13%",
                backgroundColor: "#DEE3E7",
                borderRadius: 50,
              }}></View>
          </View>
          <View style={{ justifyContent: "space-between", flex: 1 }}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
                <Image
                  source={require("../../../assets/img/tym.png")}
                  resizeMode="contain"
                  style={{ height: 15, width: 15, marginLeft: 10 }}
                />
                <Text style={{ fontSize: 13, fontWeight: 500, marginLeft: 5 }}>8 người</Text>
              </View>
              <View style={{ justifyContent: "center" }}>
                <Image
                  source={require("../../../assets/img/iconInComment.png")}
                  resizeMode="contain"
                  style={{
                    height: 100,
                    width: 130,
                    borderRadius: 50,
                    marginTop: 15,
                    alignSelf: "center",
                  }}
                />
              </View>
            </View>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                borderTopWidth: 0.1,
                borderTopColor: "#F5F5F5",
              }}>
              <TouchableOpacity>
                <Image
                  source={require("../../../assets/img/iconcomment.png")}
                  resizeMode="cover"
                  style={{ height: 30, width: 30, marginLeft: 5 }}
                />
              </TouchableOpacity>

              <TextInput
                placeholder="Nhập bình luận"
                placeholderTextColor="#82858C"
                style={{
                  height: 28,
                  fontSize: 15,
                  width: 270,
                  paddingLeft: 10,
                  borderBottomColor: "#F1F3F4",
                  color: "black",
                  backgroundColor: "#ffff", // Màu trắng với độ trong suốt 50%
                  // outlineColor: 'transparent', // Đặt màu viền trong suốt
                  // outlineWidth: 0, // Đặt độ rộng của viền là 0
                  marginLeft: 5,
                }}
                onChangeText={(text) => setComment(text)}
              />
              <TouchableOpacity>
                <Image source={require("../../../assets/img/imageComment.png")} resizeMode="cover" style={{ height: 25, width: 25 }} />
              </TouchableOpacity>
              {comment.length > 0 ? (
                <TouchableOpacity>
                  <Image
                    source={require("../../../assets/img/sendOn.png")}
                    resizeMode="contain"
                    style={{ height: 50, width: 50, transform: [{ rotate: "45deg" }] }}
                  />
                </TouchableOpacity>
              ) : (
                <Image
                  source={require("../../../assets/img/sendOff.png")}
                  resizeMode="contain"
                  style={{ marginLeft: 5, height: 50, width: 50, transform: [{ rotate: "45deg" }] }}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  bottomSheet: {
    justifyContent: "flex-end",
    margin: 0,
  },
  bottomSheetContainer: {
    backgroundColor: "white",
    padding: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "55%",
  },
});
