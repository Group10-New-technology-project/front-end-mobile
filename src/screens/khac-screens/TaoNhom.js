import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Checkbox } from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { S3 } from "aws-sdk";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, S3_BUCKET_NAME, API_URL } from "@env";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const s3 = new S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION,
});

export default function TaoNhom({ navigation }) {
  const ID = "661917fe718c270bc360f2e9";
  const [image, setImage] = useState("https://chanh9999.s3.ap-southeast-1.amazonaws.com/default_icon_camera.png");
  const [imageURL, setImageURL] = useState(null);
  const [users, setUsers] = useState([]);
  const [arrayFriends, setArrayFriends] = useState([]);
  const [nameGroup, setNameGroup] = useState("");
  const [isViewVisible, setIsViewVisible] = useState(true);
  const [isViewCheckBox, setIsViewCheckBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/users/getFriendWithDetails/${ID}`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (arrayFriends.length === 0) {
      setArrayFriends([ID]);
    }
  }, []);

  const handleCheckBox = (id) => {
    const index = arrayFriends.indexOf(id);
    if (index !== -1) {
      const newArray = [...arrayFriends];
      newArray.splice(index, 1);
      setArrayFriends(newArray);
    } else {
      setArrayFriends([...arrayFriends, id]);
    }
  };

  const createConversation = async () => {
    console.log("ten nhom:", nameGroup);
    console.log("anh nhom:", imageURL);
    if (arrayFriends.length < 2) {
      Alert.alert("Lỗi tạo nhóm", "Vui lòng chọn ít nhất 2 người bạn");
      return;
    }
    console.log("arrayFriends:", arrayFriends);
    try {
      const response = await axios.post(`${API_URL}/api/v1/conversation/createConversationWeb`, {
        arrayUserId: arrayFriends,
        name: nameGroup,
        groupImage: imageURL,
      });
      console.log("Conversation created:", response.data);
      navigation.navigate("Tabs");
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.container_listFriends}>
      <Checkbox
        style={styles.checkbox}
        value={arrayFriends.includes(item._id)}
        onValueChange={() => handleCheckBox(item._id)}
        color={"#0091FF"}
      />
      <TouchableOpacity onPress={() => handleCheckBox(item._id)}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={{ uri: item.avatar }} style={{ width: 50, height: 50, borderRadius: 50 }} />
          <View style={{ flexDirection: "column", paddingLeft: 15 }}>
            <Text style={styles.content_1}>{item.name}</Text>
            <Text style={styles.content_2}>0{item.username.slice(3)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    console.log("arrayFriends:", arrayFriends);
  }, [arrayFriends]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await uploadImageToS3(result.assets[0].uri);
    }
  };

  const uploadImageToS3 = async (imageUri) => {
    setIsLoading(true);
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var seconds = now.getSeconds();
      const currentDate = new Date().toISOString().slice(0, 10); // Lấy ngày tháng theo định dạng YYYY-MM-DD
      const fileName = `IMG_${currentDate}_${hours}-${minutes}-${seconds}.png`;
      const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: blob,
        ACL: "public-read",
      };
      const uploadResponse = await s3.upload(params).promise();
      const imageURL = uploadResponse.Location.toString();
      setImageURL(imageURL);
      console.log("Upload thành công:", imageURL);
      setIsLoading(false);
      return imageURL;
    } catch (error) {
      console.error("Error uploading image", error);
      throw error;
    }
  };

  const handleTextChange = (text) => {
    setNameGroup(text);
    setIsViewCheckBox(true);
  };
  const handleCheckPress = () => {
    if (nameGroup.length < 3 || nameGroup.length > 16) {
      Alert.alert("Error", "Tên nhóm phải có ít nhất 3 ký tự");
      return;
    } else if (imageURL === null) {
      Alert.alert("Error", "Vui lòng chọn ảnh nhóm");
      return;
    }
    setIsViewVisible(false);
    setNameGroup(nameGroup);
    console.log("nameGroup:", nameGroup);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0091FF" />
        <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "400", color: "#0091FF" }}>Đang tải ảnh lên...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {isViewVisible && (
        <View style={{ flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "white" }}>
          <TouchableOpacity onPress={pickImage}>{image && <Image source={{ uri: image }} style={styles.image} />}</TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên nhóm"
            placeholderTextColor="#AEAEAE"
            onChangeText={handleTextChange}
            value={nameGroup}
          />
          {isViewCheckBox && <MaterialCommunityIcons name="check-bold" size={30} color="#61BBFF" onPress={handleCheckPress} />}
        </View>
      )}

      <View style={{ alignItems: "center", paddingVertical: 12 }}>
        <TextInput style={styles.input_search} placeholder="Tìm tên hoặc số điện thoại" placeholderTextColor="gray" />
      </View>
      <View style={styles.list_friends}>
        <FlatList data={users} renderItem={renderItem} keyExtractor={(item) => item._id} />
      </View>
      <View style={{ height: 50, justifyContent: "center", paddingHorizontal: 20 }}>
        <Text style={styles.content_3}>Đã chọn: {arrayFriends.length - 1}</Text>
      </View>
      {!isViewVisible && (
        <TouchableOpacity style={styles.btn_continue} onPress={createConversation}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>Xác nhận</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container_listFriends: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 8,
  },
  input: {
    width: 300,
    fontSize: 18,
    fontWeight: "500",
    padding: 10,
  },
  input_search: {
    width: Dimensions.get("window").width - 20,
    fontSize: 16,
    fontWeight: "400",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#EFEFEF",
    borderRadius: 18,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 22,
    marginRight: 20,
    marginLeft: 10,
  },
  list_friends: {
    backgroundColor: "white",
    height: Dimensions.get("window").height * 0.68,
    // backgroundColor: "green",
  },
  content_1: {
    fontSize: 17,
    fontWeight: "500",
  },
  content_2: {
    fontSize: 14,
    fontWeight: "400",
    color: "#9E9E9E",
    marginTop: 4,
  },
  container_image: {
    alignItems: "center",
    paddingTop: 20,
  },
  image: {
    height: 55,
    width: 55,
    borderRadius: 55,
    // opacity: 1,
  },
  btn_continue: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
    height: 45,
    backgroundColor: "#0091FF",
    borderRadius: 30,
  },
  content_3: {
    fontSize: 18,
    fontWeight: "500",
    color: "#9E9E9E",
  },
});
