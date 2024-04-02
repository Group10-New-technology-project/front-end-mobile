import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput } from 'react-native'; // Import Text từ react-native
import { LinearGradient } from 'expo-linear-gradient';

export default function Login({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0085FE', '#00ACF4']}
                start={{ x: 0, y: 0 }} // Điểm bắt đầu (trái)
                end={{ x: 1, y: 0 }} // Điểm kết thúc (phải)
                style={styles.background}
            />

            <View>
                <View style={{ height: 45, alignItems: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Image
                            source={require("../../../assets/img/back.png")}
                            resizeMode="contain"
                            style={{
                                marginLeft: 17, height: 25, width: 25
                            }}
                        />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontWeight: 500, color: "#ffff", marginLeft: 15 }}>Đăng nhập</Text>

                </View>
                <View style={{ height: 39, backgroundColor: "#F9FAFE", justifyContent: 'center' }}>
                    <Text style={{ marginBottom: 5, marginLeft: 10, fontWeight: 500, fontSize: 13, color: "black" }}>
                        Vui lòng nhập số điện thoại và mật khẩu để đăng nhập
                    </Text>
                </View>
                <View style={{ height: 50, backgroundColor: "red", marginTop: 20 }}>
                    <TextInput
                        placeholder="Số điện thoại"
                        placeholderTextColor="#7E828B"
                        style={{
                            height: 50,
                            fontSize: 15,
                            paddingLeft: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: "#F1F3F4",
                            color: "black",
                            backgroundColor: "#fff",
                            // outlineColor: 'transparent', // Đặt màu viền trong suốt
                            // outlineWidth: 0, // Đặt độ rộng của viền là 0
                        }}
                        onChangeText={(text) => setUsername(text)}
                    />
                </View>
                <View style={{ height: 50, backgroundColor: "red" }}>
                    <TextInput
                        placeholder="Mật khẩu"
                        placeholderTextColor="#7E828B"
                        style={{
                            height: 50,
                            fontSize: 15,
                            paddingLeft: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: "#F1F3F4",
                            color: "black",
                            backgroundColor: "#fff",
                            // outlineColor: 'transparent', // Đặt màu viền trong suốt
                            // outlineWidth: 0, // Đặt độ rộng của viền là 0
                        }}
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry={true}
                    />
                </View>
                <View style={{ height: 50, justifyContent: 'center' }}>
                    <TouchableOpacity>
                        <Text style={{ marginLeft: 10, color: "#0F8EF9", fontSize: 14, fontWeight: 400 }}>
                            Lấy lại mật khẩu
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <View style={{ marginTop: 5, height: 39, justifyContent: 'center', alignItems: 'center' }}>

                        {username.length > 0 && password.length > 0 ? (
                            <TouchableOpacity onPress={() => navigation.navigate('Tabs')}>
                                <View style={{ height: 37, width: 182, borderRadius: 50, backgroundColor: "#00A3FF", justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 13, color: "white", textAlign: "center", }}>Đăng nhập</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={{ height: 37, width: 182, borderRadius: 50, backgroundColor: "#C1D4E3", justifyContent: 'center' }}>
                                <Text style={{ fontSize: 13, color: "white", textAlign: "center", }}>Đăng nhập</Text>
                            </View>
                        )}


                    </View>
                </TouchableOpacity>
            </View>



            <View style={{ height: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                <TouchableOpacity>
                    <Text style={{ fontSize: 13, color: "#ABABAB" }}>
                        Các câu hỏi thường gặp
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between'
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 45, // Chiều cao của phần header
    },
});
