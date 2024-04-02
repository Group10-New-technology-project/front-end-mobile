import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TextInput ,TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function NhapSoDienThoai({ navigation }) {
    const [SoDienThoai, setSoDienThoai] = useState("");
    const [DieuKhoan, setDieuKhoan] = useState(false);
    const [DieuKhoanMang, setDieuKhoanMang] = useState(false);

    return (
        <View style={styles.container}>
            <View>
                <LinearGradient
                    colors={['#0085FE', '#00ACF4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.background}
                />
                <LinearGradient
                    colors={['#0085FE', '#00ACF4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.background}
                />
                <View style={{ justifyContent: 'center', alignContent: 'center' }}>
                    <View style={{ height: 45, alignItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => navigation.navigate('home')}>
                            <Image
                                source={require("../../../assets/img/back.png")}
                                resizeMode="contain"
                                style={{
                                    marginLeft: 17, height: 25, width: 25
                                }}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 60, width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ fontSize: 28, fontWeight: '700', textAlign: 'center' }}>Nhập số điện thoại</Text>
                    </View>
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <View style={{ marginTop: 10, flexDirection: 'row', height: 50, width: '90%', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: "#2B5DAD", borderRadius: 8 }}>
                            <View style={{ width: '20%', justifyContent: 'center', alignContent: 'center' }}>
                                <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 500 }}>+84</Text>
                            </View>
                            <View style={{ height: 50, width: 1, backgroundColor: "#2B5DAD" }}></View>
                            <TextInput
                                placeholderTextColor="#82858C"
                                style={{
                                    borderRadius: 8,
                                    width: '80%',
                                    fontSize: 18,
                                    paddingLeft: 10,
                                    // borderBottomWidth: 1,
                                    // borderBottomColor: "#F1F3F4",
                                    // color: "black",
                                    // backgroundColor: "#fff",
                                    fontSize: 18,
                                     fontWeight: 'bold',
                                    // outlineWidth: 0, // Remove outlineColor prop
                                }}
                                onChangeText={(text) => setSoDienThoai(text)}
                            />
                        </View>
                    </View>

                    <View style={{ height: 60, marginTop: 5, marginLeft: 5 }}>
                        <View style={{ flexDirection: 'row', height: 30, alignItems: 'center' }}>
                            <View style={{ marginLeft: 20, flexDirection: 'row', height: 30, alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => setDieuKhoan(!DieuKhoan)}>
                                    {DieuKhoan ? (
                                        <View>
                                            <Image
                                                source={require("../../../assets/img/checkbox.jpg")}
                                                resizeMode="contain"
                                                style={{
                                                    borderRadius: 5,
                                                    height: 19, width: 19
                                                }}
                                            />
                                        </View>
                                    ) : (
                                        <View style={{ height: 19, width: 19, borderWidth: 2, borderColor: "#707070", borderRadius: 5 }}></View>
                                    )}
                                </TouchableOpacity>
                                <Text style={{ fontWeight: 500, fontSize: 14, marginLeft: 4 }}>Tôi đồng ý với </Text>
                                <Text style={{ fontWeight: 700, fontSize: 14, marginLeft: 3, color: "#0187F9" }}>điều khoản Mạng xã hội Zalo</Text>
                            </View>

                        </View>
                        <View style={{ marginLeft: 20, flexDirection: 'row', height: 30, alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => setDieuKhoanMang(!DieuKhoanMang)}>
                                {DieuKhoanMang ? (
                                    <View>
                                        <Image
                                            source={require("../../../assets/img/checkbox.jpg")}
                                            resizeMode="contain"
                                            style={{
                                                borderRadius: 5,
                                                height: 19, width: 19
                                            }}
                                        />
                                    </View>
                                ) : (
                                    <View style={{ height: 19, width: 19, borderWidth: 2, borderColor: "#707070", borderRadius: 5 }}></View>
                                )}
                            </TouchableOpacity>
                            <Text style={{ fontWeight: 500, fontSize: 14, marginLeft: 4 }}>Tôi đồng ý với </Text>
                            <Text style={{ fontWeight: 700, fontSize: 14, marginLeft: 3, color: "#0187F9" }}>điều khoản Mạng xã hội Zalo</Text>
                        </View>

                    </View>
                    <View style={{ marginTop: 30, height: 39, justifyContent: 'center', alignItems: 'center' }}>
                        {SoDienThoai.length === 10 && DieuKhoan && DieuKhoanMang ? (
                            <TouchableOpacity onPress={() => navigation.navigate('MaXacThuc')}>
                                <View style={{ height: 44, width: 340, backgroundColor: "#00A3FF", borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontSize: 15, fontWeight: 500, color: "white", textAlign: "center" }}>Tiếp tục</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={{ height: 44, width: 340, backgroundColor: "#C1D4E3", borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 15, fontWeight: 500, color: "white", textAlign: "center" }}>Tiếp tục</Text>
                            </View>
                        )}
                    </View>


                </View>
            </View>
            <View style={{ height: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontWeight: 500, fontSize: 15 }}>Bạn đã có tài khoản?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('login')}>
                    <Text style={{ fontWeight: 500, fontSize: 15, color: "#0187F9", marginLeft: 4 }}>Đăng nhập ngay</Text>
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
        height: 45,
    },
});
