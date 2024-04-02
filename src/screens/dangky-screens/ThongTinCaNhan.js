import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import DateTimePickerModal from "react-native-modal-datetime-picker";
const { width } = Dimensions.get("window");

// Component Dropdown
const Dropdown = ({ onSelect }) => {
  return (
    <View style={styles.dropdown}>
      <TouchableOpacity style={styles.option} onPress={() => onSelect("Nam")}>
        <Text style={styles.optionText}>Nam</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => onSelect("Nữ")}>
        <Text style={styles.optionText}>Nữ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => onSelect("Khác")}>
        <Text style={styles.optionText}>Khác</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function NhapSoDienThoai({ navigation }) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false); // State để kiểm soát hiển thị dropdown
  const [selectedGender, setSelectedGender] = useState(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const selectGender = (gender) => {
    setSelectedGender(gender); // Cập nhật giá trị giới tính đã chọn
    setDropdownVisible(false); // Ẩn dropdown sau khi chọn
  };
  return (
    <View style={styles.container}>
      <View>
        <View style={{ justifyContent: "center", alignContent: "center" }}>
          <View style={{ height: 45, alignItems: "center", flexDirection: "row" }}></View>

          <View
            style={{
              height: 60,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}>
            <Text
              style={{ fontSize: 24, fontWeight: "700", textAlign: "center", color: "#3D3D3D" }}>
              Thêm thông tin cá nhân
            </Text>
          </View>

          <View style={{ width: "100%", alignItems: "center", marginTop: 10 }}>
            <View
              style={{
                marginTop: 10,
                alignItems: "center",
                flexDirection: "row",
                height: 50,
                width: "90%",
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#3D3D3D",
                borderRadius: 8,
              }}>
              {!selectedDate && (
                <Text style={{ fontSize: 20, fontWeight: 500, color: "#343434", marginLeft: 20 }}>
                  Sinh Nhật
                </Text>
              )}
              <View>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
                {selectedDate && (
                  <Text style={{ fontSize: 20, fontWeight: 500, color: "#343434", marginLeft: 20 }}>
                    {selectedDate.toLocaleDateString()}
                  </Text>
                )}
              </View>

              <View style={{}}>
                <TouchableOpacity onPress={showDatePicker}>
                  <Image
                    source={require("../../../assets/img/calender.png")}
                    resizeMode="contain"
                    style={{ height: 25, width: 25, marginRight: 20 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{ width: "100%", alignItems: "center", marginTop: 10 }}>
            <View
              style={{
                marginTop: 10,
                alignItems: "center",
                flexDirection: "row",
                height: 50,
                width: "90%",
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#3D3D3D",
                borderRadius: 8,
              }}>
              {selectedGender ? (
                <Text style={{ fontSize: 20, fontWeight: 500, color: "#343434", marginLeft: 20 }}>
                  {selectedGender}
                </Text>
              ) : (
                <Text style={{ fontSize: 20, fontWeight: 500, color: "#343434", marginLeft: 20 }}>
                  Giới tính
                </Text>
              )}
              <TouchableOpacity onPress={toggleDropdown}>
                <Image
                  source={require("../../../assets/img/arrowdown.png")}
                  resizeMode="contain"
                  style={{ height: 25, width: 25, marginRight: 20 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{ marginBottom: 40, height: 39, justifyContent: "center", alignItems: "center" }}>
        {selectedDate && selectedGender ? (
          <TouchableOpacity onPress={() => navigation.navigate("ChonTen")}>
            <View
              style={{
                height: 44,
                width: 340,
                backgroundColor: "#00A3FF",
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text style={{ fontSize: 15, fontWeight: 500, color: "white", textAlign: "center" }}>
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
            <Text style={{ fontSize: 15, fontWeight: 500, color: "white", textAlign: "center" }}>
              Tiếp tục
            </Text>
          </View>
        )}
      </View>

      {/* Dropdown */}
      {dropdownVisible && <Dropdown onSelect={selectGender} />}
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
  dropdown: {
    position: "absolute",
    top: 255,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    zIndex: 1,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
    color: "#000",
  },
});
