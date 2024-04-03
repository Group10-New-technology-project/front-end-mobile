import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { firebaseConfig } from "./config";

export default function CodeXacThuc({ navigation, route }) {
  const { SoDienThoai } = route.params;
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);

  const sendVerification = () => {
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    console.log("Đã gửi đến số:", SoDienThoai);
    phoneProvider
      .verifyPhoneNumber(SoDienThoai, recaptchaVerifier.current)
      .then((id) => setVerificationId(id));
  };
  useEffect(() => {
    sendVerification();
  }, []);

  const confirmCode = () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(() => {
        setCode("");
        navigation.navigate("TaoMatKhau");
      })
      .catch(() => {
        Alert.alert("Sai mã xác thực!");
      });
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} />
      <Text style={styles.otpText}>Login using OTP</Text>
      {/* <TextInput
        placeholder="Phone Number with country code"
        style={styles.textInput}
        // onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        autoCompleteType="tel"
      /> */}
      {/* <TouchableOpacity style={styles.sendVerification} onPress={sendVerification}>
        <Text>Gửi</Text>
      </TouchableOpacity> */}
      <TextInput
        style={styles.textInput}
        placeholder="Confirm Code"
        keyboardType="number-pad"
        onChangeText={setCode}
      />
      <TouchableOpacity style={styles.confirmCode} onPress={confirmCode}>
        <Text>Xác nhận code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  otpText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    width: "80%",
    padding: 10,
    marginBottom: 20,
  },
  sendVerification: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  confirmCode: {
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: 5,
  },
});
