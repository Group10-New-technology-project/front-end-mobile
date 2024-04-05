import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { firebaseConfig } from "../../config/FirebaseConfig";

export default function MaXacThucLayLaiMatKhau({ navigation, route }) {
  const { SoDienThoai } = route.params;
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const refs = useRef([...Array(6)].map(() => React.createRef()));
  const [countdown, setCountdown] = useState(60);
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);

  const sendVerification = () => {
    console.log("Đã gửi đến số:", SoDienThoai);
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    phoneProvider
      .verifyPhoneNumber(SoDienThoai, recaptchaVerifier.current)
      .then((id) => setVerificationId(id));
  };
  useEffect(() => {
    sendVerification();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    refs.current[0].current.focus();
  }, []);

  const handleChangeText = (index, value) => {
    const newOTP = [...otp];
    newOTP[index] = value;

    if (index < 5 && value.length === 1) {
      refs.current[index + 1].current.focus();
    }

    setOTP(newOTP);
  };

  function convertArrayToString(array) {
    return array.join("");
  }

  const confirmCode = () => {
    const otpString = convertArrayToString(otp);
    const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, otpString);
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(() => {
        navigation.navigate("DangNhapThanhCong", {
          SoDienThoai: SoDienThoai,
        });
      })
      .catch(() => {
        Alert.alert("Mã xác thực không đúng, vui lòng nhập lại");
        setOTP(["", "", "", "", "", ""]);
      });
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={{ justifyContent: "center", alignContent: "center" }}>
          <View style={{ height: 45, alignItems: "center", flexDirection: "row" }}>
            <TouchableOpacity onPress={() => navigation.navigate("home")}>
              <Image
                source={require("../../../assets/img/back.png")}
                resizeMode="contain"
                style={{ marginLeft: 17, height: 25, width: 25 }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: 60,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}>
            <Text style={{ fontSize: 24, fontWeight: "700", textAlign: "center" }}>
              Nhập mã xác thực
            </Text>
            <FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={firebaseConfig}
            />
          </View>
          <View style={{ height: 30, alignItems: "center" }}>
            <Text style={{ fontWeight: 500, fontSize: 14, color: "#444444" }}>
              Nhập dãy 6 số được gửi đến số điện thoại
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: 500, fontSize: 19 }}>(+84) </Text>
              <Text style={{ fontWeight: 500, fontSize: 19 }}>787847378</Text>
            </View>
          </View>
          <View style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                height: 50,
                width: "75%",
                justifyContent: "center",
                alignItems: "center",
              }}>
              {otp.map((value, index) => (
                <TextInput
                  key={index}
                  ref={refs.current[index]}
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={1}
                  value={value}
                  onChangeText={(text) => handleChangeText(index, text)}
                />
              ))}
            </View>
          </View>
          <View
            style={{ marginTop: 25, height: 39, justifyContent: "center", alignItems: "center" }}>
            {otp.every((val) => val.length === 1) ? (
              <TouchableOpacity onPress={confirmCode}>
                <View
                  style={{
                    height: 44,
                    width: 340,
                    backgroundColor: "#00A3FF",
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Text
                    style={{ fontSize: 15, fontWeight: 500, color: "white", textAlign: "center" }}>
                    Tiếp tục
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  height: 44,
                  width: 340,
                  backgroundColor: "#C1D4E3",
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Text
                  style={{ fontSize: 15, fontWeight: 500, color: "white", textAlign: "center" }}>
                  Tiếp tục
                </Text>
              </View>
            )}
          </View>
          <View
            style={{
              marginTop: 18,
              height: 30,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Text style={{ fontWeight: 500, fontSize: 15 }}>Bạn không nhận được mã?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("login")}>
              <Text style={{ fontWeight: 500, fontSize: 15, color: "#6B6B6B", marginLeft: 4 }}>
                Gửi lại ({countdown}s)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          height: 30,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <TouchableOpacity onPress={() => navigation.navigate("")}>
          <Text style={{ fontWeight: 500, fontSize: 15, color: "#0187F9", marginLeft: 4 }}>
            ? Tôi cần hỗ trợ thêm về mã xác thực
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 45,
  },
  input: {
    borderRadius: 8,
    width: 42,
    height: 50,
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#444444",
    color: "black",
    backgroundColor: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    padding: 15,
    marginHorizontal: 3,
  },
});
