import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image, Text, FlatList, TouchableOpacity, TextInput } from "react-native"; // Import Text từ react-native
import { LinearGradient } from "expo-linear-gradient";
import Modal from "react-native-modal";

const data = [
  { key: "1", text: "https://i.pinimg.com/564x/eb/58/cc/eb58cc5cfecde2911c1bd9bb8df69ce7.jpg" },
  { key: "2", text: "https://i.pinimg.com/originals/ef/ca/c5/efcac57d996e596b0a982194990ee462.jpg" },
  {
    key: "3",
    text: "https://inkythuatso.com/uploads/thumbnails/800/2022/05/hinh-nen-binh-minh-4k-cho-dien-thoai-5-inkythuatso-30-14-54-47.jpg",
  },
  { key: "4", text: "https://media.baoquangninh.vn/upload/image/202310/medium/2137171_f1207af841cbfc6683b03f4d1fdab7ce.jpg" },
];
const data1 = [
  {
    key: "1",
    text: "Đoạn văn là một khái niệm quan trọng trong viết văn, tạo nên sự tổ chức và sắp xếp logic cho nội dung. Nó không chỉ mang trong mình một nội dung nhất định mà còn phản ánh sự phân đoạn hình thức của văn bản.",
    image: ["https://cdn.pixabay.com/photo/2016/06/10/16/55/film-1448444_640.jpg"],
    avt: "https://cdn.pixabay.com/photo/2016/06/10/16/55/film-1448444_640.jpg",
    name: "Phạm Nhật Vượng",
  },
  {
    key: "2",
    text: "Đồng thời, cần chú ý đến cách viết hình thức, đảm bảo sự sắp xếp hợp lý và thẩm mỹ của văn bản.",
    image: [
      "https://1.bp.blogspot.com/-UMlr0xWowhQ/YO1onzwKKtI/AAAAAAABK6E/Iln8bfciJkYqR99Rf2pOBqq93kbJFrtegCLcBGAsYHQ/s0/hinh-anh-dep-Taihinhanh-Vn%2B%25287%2529.jpg",
      "https://cdnphoto.dantri.com.vn/5RLwSd8f6OOjIguWr7O_q164Gjk=/thumb_w/960/2020/01/29/nhung-buc-anh-dep-tuyet-voi-ve-tinh-bandocx-1580279520092.jpeg",
    ],
    avt: "https://vcdn1-dulich.vnecdn.net/2021/07/16/10-1626444969.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=iB4TkcQKa7HRoRURnLeZRQ",
    name: "Sơn Tùng MTP",
  },
  {
    key: "3",
    text: "Cấu trúc hình thức là một yếu tố quan trọng trong việc tổ chức và trình bày đoạn văn. Nó bao gồm cả bố cục và ngôn ngữ được sử dụng trong việc xây dựng đoạn văn.",
    image: [
      "https://uploads.nguoidothi.net.vn/content/f29d9806-6f25-41c0-bcf8-4095317e3497.jpg",
      "https://1.bp.blogspot.com/-UMlr0xWowhQ/YO1onzwKKtI/AAAAAAABK6E/Iln8bfciJkYqR99Rf2pOBqq93kbJFrtegCLcBGAsYHQ/s0/hinh-anh-dep-Taihinhanh-Vn%2B%25287%2529.jpg",
      "https://cdn.pixabay.com/photo/2016/06/10/16/55/film-1448444_640.jpg",
    ],
    avt: "https://inkythuatso.com/uploads/thumbnails/800/2023/03/2-hinh-anh-ngay-moi-binh-minh-tren-nui-inkythuatso-09-10-45-21.jpg",
    name: "Nguyễn Trường Tuấn Kiệt",
  },
  {
    key: "4",
    text: "Phần mở đoạn (M) thường đặt ở đầu đoạn văn và có nhiệm vụ giới thiệu chủ đề hoặc ý chính của đoạn. Nó có thể giới thiệu ngắn gọn các thông tin cần thiết để đưa người đọc vào bối cảnh hoặc tạo ra sự gợi mở và thu hút từ đầu đoạn.",
    image: [
      "https://www.elle.vn/wp-content/uploads/2021/03/11/427109/4-hinh-anh-dep-Capadocia-Alex-Azabache-1024x1536.jpg",
      "https://uploads.nguoidothi.net.vn/content/f29d9806-6f25-41c0-bcf8-4095317e3497.jpg",
      "https://imagev3.vietnamplus.vn/w1000/Uploaded/2024/xpcwvovt/2022_03_24/ttxvn_ha_noi_6.jpg.webp",
      "https://cdn.pixabay.com/photo/2016/06/10/16/55/film-1448444_640.jpg",
    ],
    avt: "https://cdn.pixabay.com/photo/2016/06/10/16/55/film-1448444_640.jpg",
    name: "Ngọc Trinh",
  },
  {
    key: "5",
    text: "Phần triển khai đoạn (a) là trung tâm của đoạn văn, nơi các ý bộ phận được trình bày và phát triển. Đây là phần quan trọng nhất trong việc truyền đạt thông tin, lập luận và ý kiến của tác giả. Phần này có thể bao gồm nhiều câu và các ý bộ phận được sắp xếp một cách mạch lạc và logic.",
    image: [
      "https://media.baoquangninh.vn/upload/image/202310/medium/2137171_f1207af841cbfc6683b03f4d1fdab7ce.jpg",
      "https://www.elle.vn/wp-content/uploads/2021/03/11/427109/4-hinh-anh-dep-Capadocia-Alex-Azabache-1024x1536.jpg",
      "https://uploads.nguoidothi.net.vn/content/f29d9806-6f25-41c0-bcf8-4095317e3497.jpg",
      "https://imagev3.vietnamplus.vn/w1000/Uploaded/2024/xpcwvovt/2022_03_24/ttxvn_ha_noi_6.jpg.webp",
      "https://cdn.pixabay.com/photo/2016/06/10/16/55/film-1448444_640.jpg",
    ],
    avt: "https://cdn.pixabay.com/photo/2016/06/10/16/55/film-1448444_640.jpg",
    name: "Ngọc Hương",
  },
];
export default function NhatKyScreen({ navigation }) {
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedLike, setisFocusedLike] = useState(false);
  const [username, setUsername] = useState("");
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [itemHeights, setItemHeights] = useState({});

  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };
  const updateViewHeight = (index, height) => {
    setItemHeights((prevItemHeights) => ({
      ...prevItemHeights,
      [index]: height,
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <ScrollView nestedScrollEnabled>
            <View style={{ height: 55, alignItems: "center", flexDirection: "row" }}>
              <View style={{ height: 45, width: 45, borderRadius: 50, marginLeft: 10 }}>
                <Image
                  source={{ uri: "https://i.pinimg.com/564x/8b/66/47/8b66470192b33bf7375aaf25cf963a10.jpg" }}
                  resizeMode="cover"
                  style={{ height: 45, width: 45, borderRadius: 50 }}
                />
              </View>
              <Text style={{ fontSize: 16, color: "#98999A", marginLeft: 12 }}>Hôm nay bạn thế nào?</Text>
            </View>
            <View style={{ height: 53, alignItems: "center", justifyContent: "space-evenly", flexDirection: "row" }}>
              <View
                style={{
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  width: 90,
                  height: 32,
                  backgroundColor: "#F5F5F5",
                  borderRadius: 50,
                  flexDirection: "row",
                }}>
                <Image
                  source={require("../../../assets/image/album.png")}
                  resizeMode="contain"
                  style={{ height: 17, width: 17, marginLeft: 10 }}
                />
                <Text style={{ fontSize: 12, fontWeight: 500, marginRight: 10 }}>Ảnh</Text>
              </View>
              <View
                style={{
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  width: 90,
                  height: 32,
                  backgroundColor: "#F5F5F5",
                  borderRadius: 50,
                  flexDirection: "row",
                }}>
                <Image
                  source={require("../../../assets/image/clip1.png")}
                  resizeMode="contain"
                  style={{ height: 17, width: 17, marginLeft: 10 }}
                />
                <Text style={{ fontSize: 12, fontWeight: 500, marginRight: 10 }}>Video</Text>
              </View>
              <View
                style={{
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  width: 90,
                  height: 32,
                  backgroundColor: "#F5F5F5",
                  borderRadius: 50,
                  flexDirection: "row",
                }}>
                <Image
                  source={require("../../../assets/image/album.png")}
                  resizeMode="contain"
                  style={{ height: 17, width: 17, marginLeft: 10 }}
                />
                <Text style={{ fontSize: 12, fontWeight: 500, marginRight: 10 }}>Album</Text>
              </View>
              <View
                style={{
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  width: 90,
                  height: 32,
                  backgroundColor: "#F5F5F5",
                  borderRadius: 50,
                  flexDirection: "row",
                }}>
                <Image
                  source={require("../../../assets/image/diary.png")}
                  resizeMode="contain"
                  style={{ height: 17, width: 17, marginLeft: 10 }}
                />
                <Text style={{ fontSize: 12, fontWeight: 500, marginRight: 12 }}>Kỷ niệm</Text>
              </View>
            </View>
            <View style={{ height: 10, backgroundColor: "#F2F4F5" }}></View>
            <View style={{ height: 30, justifyContent: "center" }}>
              <Text style={{ fontSize: 13, fontWeight: 700, marginLeft: 12 }}>Khoảnh khắc</Text>
            </View>
            <View style={{ height: 141, flexDirection: "row" }}>
              <FlatList
                data={data}
                horizontal
                keyExtractor={(item) => item.key} // Đảm bảo mỗi item có một key duy nhất
                renderItem={({ item }) => (
                  <TouchableOpacity>
                    <View style={{ height: 141, width: 90, borderRadius: 10, marginLeft: 7 }}>
                      <Image source={{ uri: item.text }} resizeMode="cover" style={{ height: 139, width: 90, borderRadius: 10 }} />
                      <LinearGradient
                        colors={["rgba(9, 2, 5, 0.1)", "rgba(0, 0, 0, 0.8)"]}
                        locations={[0.2, 0.8]} // Vị trí màu trong gradient
                        start={{ x: 0, y: 0 }} // Điểm bắt đầu (trên)
                        end={{ x: 0, y: 1 }} // Điểm kết thúc (dưới)
                        style={styles.backgroundImage}
                      />
                      <View
                        style={{
                          height: 70,
                          width: 70,
                          position: "absolute",
                          left: 10,
                          bottom: 0,
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        <View
                          style={{ alignItems: "center", borderWidth: 1, borderColor: "#5666D3", height: 38, width: 38, borderRadius: 50 }}>
                          <Image source={{ uri: item.text }} resizeMode="cover" style={{ height: 36, width: 36, borderRadius: 50 }} />
                          <Text style={{ fontSize: 13, color: "#ffff" }}>{item.key}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View style={{ height: 10, backgroundColor: "#F2F4F5", marginTop: 7 }}></View>

            <View style={{ marginTop: 10 }}>
              {/* // latlish2 */}
              {data1.map((item, index) => (
                <View key={item.key} style={{ marginTop: 10 }}>
                  <View style={{ height: 45, flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity>
                      <View style={{ height: 43, width: 43, borderRadius: 50, marginLeft: 10 }}>
                        <Image source={{ uri: item.avt }} resizeMode="cover" style={{ height: 43, width: 43, borderRadius: 50 }} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <View style={{ height: 43 }}>
                        <Text style={{ fontSize: 14, fontWeight: 500, marginLeft: 12 }}>{item.name}</Text>
                        <Text style={{ fontSize: 12, color: "#8E8E93", marginLeft: 12 }}>2 giờ trước</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{ justifyContent: "center", marginTop: 10, marginLeft: 12, marginBottom: 10 }}>
                    <Text
                      style={{ fontSize: 13, fontWeight: 500 }}
                      onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        updateViewHeight(index, height);
                      }}>
                      {item.text}
                    </Text>
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <View style={{ height: 250 }}>
                      {item.image.length == 1 && (
                        <TouchableOpacity onPress={() => navigation.navigate("XemAnhBaiViet", { selectedImage: item.image[0] })}>
                          <Image source={{ uri: item.image[0] }} resizeMode="cover" style={{ height: 250, width: 300, borderRadius: 4 }} />
                        </TouchableOpacity>
                      )}
                      {item.image.length == 2 && (
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity onPress={() => navigation.navigate("XemAnhBaiViet", { selectedImage: item.image[0] })}>
                            <Image
                              source={{ uri: item.image[0] }}
                              resizeMode="cover"
                              style={{ height: 250, width: 180, borderRadius: 4, marginLeft: 5 }}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => navigation.navigate("XemAnhBaiViet", { selectedImage: item.image[1] })}>
                            <Image
                              source={{ uri: item.image[1] }}
                              resizeMode="cover"
                              style={{ height: 250, width: 180, borderRadius: 4, marginLeft: 5 }}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                      {item.image.length == 3 && (
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity onPress={() => navigation.navigate("XemAnhBaiViet", { selectedImage: item.image[0] })}>
                            <Image
                              source={{ uri: item.image[0] }}
                              resizeMode="cover"
                              style={{ height: 250, width: 123, borderRadius: 4, marginLeft: 5 }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => navigation.navigate("XemAnhBaiViet", { selectedImage: item.image[1] })}>
                            <Image
                              source={{ uri: item.image[1] }}
                              resizeMode="cover"
                              style={{ height: 250, width: 123, borderRadius: 4, marginLeft: 5 }}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => navigation.navigate("XemAnhBaiViet", { selectedImage: item.image[2] })}>
                            <Image
                              source={{ uri: item.image[2] }}
                              resizeMode="cover"
                              style={{ height: 250, width: 123, borderRadius: 4, marginLeft: 5 }}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                      {item.image.length == 4 && (
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity onPress={() => navigation.navigate("XemAnhBaiViet", { selectedImage: item.image[0] })}>
                            <Image
                              source={{ uri: item.image[0] }}
                              resizeMode="cover"
                              style={{ height: 250, width: 123, borderRadius: 4, marginLeft: 5 }}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => navigation.navigate("XemAnhBaiViet", { selectedImage: item.image[1] })}>
                            <Image
                              source={{ uri: item.image[1] }}
                              resizeMode="cover"
                              style={{ height: 250, width: 123, borderRadius: 4, marginLeft: 5 }}
                            />
                          </TouchableOpacity>

                          <View style={{ justifyContent: "space-around" }}>
                            <TouchableOpacity onPress={() => navigation.navigate("XemAnhBaiViet", { selectedImage: item.image[2] })}>
                              <Image
                                source={{ uri: item.image[2] }}
                                resizeMode="cover"
                                style={{ height: 122, width: 122, borderRadius: 4, marginLeft: 5 }}
                              />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate("XemAnhBaiViet", { selectedImage: item.image[3] })}>
                              <Image
                                source={{ uri: item.image[3] }}
                                resizeMode="cover"
                                style={{ height: 122, width: 122, borderRadius: 4, marginLeft: 5 }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                      {item.image.length > 4 && (
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity>
                            <Image
                              source={{ uri: item.image[0] }}
                              resizeMode="cover"
                              style={{ height: 250, width: 123, borderRadius: 4, marginLeft: 5 }}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity>
                            <Image
                              source={{ uri: item.image[1] }}
                              resizeMode="cover"
                              style={{ height: 250, width: 123, borderRadius: 4, marginLeft: 5 }}
                            />
                          </TouchableOpacity>

                          <View style={{ justifyContent: "space-around" }}>
                            <TouchableOpacity>
                              <Image
                                source={{ uri: item.image[2] }}
                                resizeMode="cover"
                                style={{ height: 122, width: 122, borderRadius: 4, marginLeft: 5 }}
                              />
                            </TouchableOpacity>

                            <TouchableOpacity>
                              <Image
                                source={{ uri: item.image[3] }}
                                resizeMode="cover"
                                style={{ height: 122, width: 122, borderRadius: 4, marginLeft: 5 }}
                              />
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity>
                            <View
                              style={{
                                height: 122,
                                width: 122,
                                position: "absolute",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 4,
                                right: 0.2,
                                bottom: 1.3,
                              }}>
                              <Text style={{ fontSize: 18, color: "#ffff" }}>+{item.image.length - 4}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", height: 22, marginTop: 10 }}>
                    <Image
                      source={require("../../../assets/image/tym.png")}
                      resizeMode="contain"
                      style={{ height: 18, width: 17, marginLeft: 17 }}
                    />
                    <Text style={{ fontSize: 13, fontWeight: 500, marginLeft: 5 }}>100 người khác</Text>
                  </View>
                  {!isFocusedLike && (
                    <View style={{ flexDirection: "row", height: 30, marginTop: 10 }}>
                      <TouchableOpacity onPress={() => setisFocusedLike(true)}>
                        <View
                          style={{
                            marginLeft: 13,
                            alignItems: "center",
                            justifyContent: "space-evenly",
                            flexDirection: "row",
                            height: 29,
                            width: 79,
                            borderRadius: 50,
                            backgroundColor: "#D9D9D9",
                          }}>
                          <Image
                            source={require("../../../assets/image/tymblack.png")}
                            resizeMode="contain"
                            style={{ height: 25, width: 19, marginLeft: 5 }}
                          />
                          <Text style={{ fontSize: 14, marginRight: 8 }}>Thích</Text>
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
                            backgroundColor: "#D9D9D9",
                          }}>
                          <Image
                            source={require("../../../assets/image/comment1.png")}
                            resizeMode="contain"
                            style={{ height: 16, width: 18, marginLeft: 5 }}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                  {isFocusedLike && (
                    <View style={{ flexDirection: "row", height: 30, marginTop: 10 }}>
                      <TouchableOpacity onPress={() => setisFocusedLike(false)}>
                        <View
                          style={{
                            marginLeft: 13,
                            alignItems: "center",
                            justifyContent: "space-evenly",
                            flexDirection: "row",
                            height: 29,
                            width: 79,
                            borderRadius: 50,
                            backgroundColor: "#F7F7F7",
                          }}>
                          <Image
                            source={require("../../../assets/image/tym.png")}
                            resizeMode="contain"
                            style={{ height: 25, width: 19, marginLeft: 5 }}
                          />
                          <Text style={{ fontWeight: 500, fontSize: 14, marginRight: 8, color: "#710001" }}>Thích</Text>
                        </View>
                      </TouchableOpacity>

                      <View
                        style={{
                          marginLeft: 7,
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexDirection: "row",
                          height: 29,
                          width: "72%",
                          borderRadius: 50,
                          backgroundColor: "#F7F7F7",
                        }}>
                        <TextInput
                          placeholder="Nhập bình luận"
                          placeholderTextColor="#7B7B7B"
                          style={{
                            height: 26,
                            fontSize: 14,
                            width: 150,
                            paddingLeft: 10,
                            // outlineColor: 'transparent', // Đặt màu viền trong suốt
                            // outlineWidth: 0, // Đặt độ rộng của viền là 0
                            borderRadius: 50,
                            marginLeft: 5,
                          }}
                        />
                        <Image
                          source={require("../../../assets/image/iconcomment.png")}
                          resizeMode="contain"
                          style={{ height: 25, width: 25, marginRight: 14 }}
                        />
                      </View>
                    </View>
                  )}
                </View>
              ))}
              <View style={{ height: 10, backgroundColor: "#F2F4F5", marginTop: 7 }}></View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <Modal
        isVisible={isBottomSheetVisible}
        style={styles.bottomSheet}
        swipeDirection={["down"]}
        onSwipeComplete={toggleBottomSheet}
        onBackdropPress={toggleBottomSheet}>
        <View style={styles.bottomSheetContainer}>
          <View style={{ alignItems: "center" }}>
            <View style={{ height: 5, width: "13%", backgroundColor: "#DEE3E7", borderRadius: 50 }}></View>
          </View>
          <View style={{ justifyContent: "space-between", flex: 1 }}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
                <Image
                  source={require("../../../assets/image/tym.png")}
                  resizeMode="contain"
                  style={{ height: 15, width: 15, marginLeft: 10 }}
                />
                <Text style={{ fontSize: 13, fontWeight: 500, marginLeft: 5 }}>8 người</Text>
              </View>
              <View style={{ justifyContent: "center" }}>
                <Image
                  source={require("../../../assets/image/iconInComment.png")}
                  resizeMode="contain"
                  style={{ height: 100, width: 130, borderRadius: 50, marginTop: 15, alignSelf: "center" }}
                />
              </View>
            </View>
            <View style={{ alignItems: "center", flexDirection: "row", borderTopWidth: 0.1, borderTopColor: "#F5F5F5" }}>
              <TouchableOpacity>
                <Image
                  source={require("../../../assets/image/iconcomment.png")}
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

                  marginLeft: 5,
                }}
                onChangeText={(text) => setComment(text)}
              />
              <TouchableOpacity>
                <Image source={require("../../../assets/image/imageComment.png")} resizeMode="cover" style={{ height: 25, width: 25 }} />
              </TouchableOpacity>
              {comment.length > 0 ? (
                <TouchableOpacity>
                  <Image
                    source={require("../../../assets/image/sendOn.png")}
                    resizeMode="contain"
                    style={{ height: 50, width: 50, transform: [{ rotate: "45deg" }] }}
                  />
                </TouchableOpacity>
              ) : (
                <Image
                  source={require("../../../assets/image/sendOff.png")}
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
    backgroundColor: "#fff",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 45, // Chiều cao của phần header
  },
  backgroundImage: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 70,
    bottom: 0, // Chiều cao của phần header
    borderBottomLeftRadius: 10, // Radius ở góc dưới bên trái
    borderBottomRightRadius: 10,
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
