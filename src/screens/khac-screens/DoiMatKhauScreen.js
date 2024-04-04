import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet , TextInput, TouchableOpacity} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function DoiMatKhauScreen({navigation}) {
    const [userData, setUserData] = useState(null);
    const [passwordOld, setPasswordOld] = useState("");
    const [passwordNew, setPasswordNew] = useState("");
    const [passwordReNew, setPasswordReNew] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const storedUserData = await AsyncStorage.getItem('userData');
            if (storedUserData) {
              const user = JSON.parse(storedUserData);
              console.log('Thông tin người dùng đã đăng nhập:', user);
              setUserData(user);
            } else {
              console.log('Không có thông tin người dùng được lưu');
            }
          } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
          }
        };
      
        fetchData();
      }, []);

      handleUpdate = async () => {
        try {
      
          // Gọi API để cập nhật mật khẩu
          const response = await fetch('http://192.168.3.226:3000/api/v1/users/updateMK', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: userData.username,
              passwordOld,
              passwordNew,
              passwordReNew,
            }),
          });
          const data = await response.json();
      
          // Kiểm tra phản hồi từ API
          if (response.ok) {
            // Cập nhật mật khẩu mới trong AsyncStorage
            const updatedUserData = { ...userData, password: passwordNew };
            await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      
            // Thông báo cho người dùng và đặt lại các state về rỗng
            alert("Cập nhật mật khẩu thành công");
            setPasswordOld("");
            setPasswordNew("");
            setPasswordReNew("");
            navigation.navigate('TrangChu')
          } else {
            // Xử lý lỗi từ API
            alert(data.error || 'Đã có lỗi xảy ra khi cập nhật mật khẩu');
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật mật khẩu:", error);
          alert("Đã có lỗi xảy ra khi cập nhật mật khẩu. Vui lòng thử lại sau");
        }
      };


      
      
  return (
    <View style={styles.container}>
      <View style={styles.header}> 
        <Text style={styles.textHeader}>Mật khẩu phải gồm chữ, số hoặc ký tự đặc biệt;</Text> 
        <Text style={styles.textHeader}>không được chứa năm sinh và tên Zalo của bạn.</Text>
      </View>
      <View style={styles.section}>
        <View style={styles.subSection}>
          <Text style={styles.textSectionTitle}>Mật khẩu hiện tại</Text>
          <TextInput style={styles.textInput} placeholder="Nhập mật khẩu hiện tại" secureTextEntry={!showPassword} onChangeText={(text) => setPasswordOld(text)} />
          <View style={styles.line} />
        </View>
        <TouchableOpacity style = {styles.btnOption} onPress={() => setShowPassword(!showPassword)}>
            <Text style = {styles.textOption}>{showPassword ? "Ẩn" : "Hiện"}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <View style={styles.subSection}>
          <Text style={styles.textSectionTitle}>Mật khẩu mới</Text>
          <TextInput secureTextEntry={true} style={styles.textInput} placeholder="Nhập mật khẩu mới" onChangeText={(text) => setPasswordNew(text)} />

            <View style={styles.line} />
         
          <TextInput secureTextEntry={true} style={styles.textInput} placeholder="Nhập lại mật khẩu mới" onChangeText={(text) => setPasswordReNew(text)} />
            <View style={styles.line} />
        </View>
      </View>
      <TouchableOpacity onPress={handleUpdate} style ={ styles.btnUpdate}>
        <Text style = {styles.btnText}>Cập nhật</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: "center",
    alignItems: "left",
    padding: 20,
    shadowColor: "#000",
  },
  textHeader: {
    fontSize: 16,
    fontWeight: "330",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ECECEC",
    height: 120,
  },
  textSectionTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#0098F9",
  },
  textInput: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 15,
    color:"#000",

  },
  line: {
        borderBottomWidth: 1,
        borderBottomColor: "#ECECEC",
        // marginTop: 15,
        // marginBottom: 15,
        margin:10,
        flex:1,
        width:320},
  
  subSection: {},
  btnUpdate: {
    backgroundColor: "#C0D4E3",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 220,
    height: 45,
    borderRadius: 25,
    marginTop: 20,
  },
  btnText: {
    fontSize: 18,
    fontWeight: "200",
    color: "#fff",
  },
  textOption: {
    fontSize: 18,
    color:"#C0D4E3",
    fontWeight: "500",
  },
  btnOption:{
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
  }
  

  
});
