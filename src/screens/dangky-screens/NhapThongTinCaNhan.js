import React, { useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, Dimensions } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

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

export default function NhapThongTinCaNhan({ navigation, route }) {
  const { password, SoDienThoai } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);

  const handleTiepTuc = () => {
    console.log(selectedDate);
    console.log(selectedGender);
    navigation.navigate("NhapTenNguoiDung", {
      birthday: selectedDate ? selectedDate.toISOString() : null,
      Gender: selectedGender,
      password: password,
      SoDienThoai: SoDienThoai,
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setSelectedDate(selectedDate || selectedDate);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const selectGender = (gender) => {
    setSelectedGender(gender);
    setDropdownVisible(false);
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
            <Text style={{ fontSize: 24, fontWeight: "700", textAlign: "center", color: "#3D3D3D" }}>Thêm thông tin cá nhân</Text>
          </View>

          <View>
            <View style={{ paddingLeft: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "500", color: "gray" }}>Chọn sinh nhật</Text>
            </View>
            <View style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
              <DateTimePicker value={selectedDate || new Date()} mode="date" display="spinner" onChange={handleDateChange} />
            </View>
          </View>

          <View style={{}}>
            <View style={{ paddingLeft: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "500", color: "gray" }}>Chọn giới tính</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  marginTop: 20,
                  alignItems: "center",
                  flexDirection: "row",
                  height: 50,
                  width: "85%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#3D3D3D",
                  borderRadius: 15,
                }}>
                {selectedGender ? (
                  <Text style={{ fontSize: 20, fontWeight: "500", color: "#343434", marginLeft: 20 }}>{selectedGender}</Text>
                ) : (
                  <Text style={{ fontSize: 20, fontWeight: "500", color: "#343434", marginLeft: 20 }}>Giới tính</Text>
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
      </View>
      <View style={{ marginBottom: 40, height: 39, justifyContent: "center", alignItems: "center" }}>
        {selectedGender ? (
          <TouchableOpacity onPress={handleTiepTuc}>
            <View
              style={{
                height: 44,
                width: 340,
                backgroundColor: "#00A3FF",
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text style={{ fontSize: 15, fontWeight: "500", color: "white", textAlign: "center" }}>Tiếp tục</Text>
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
            <Text style={{ fontSize: 15, fontWeight: "500", color: "white", textAlign: "center" }}>Tiếp tục</Text>
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
    // alignItems: "center",
    justifyContent: "space-between",
  },
  dropdown: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.5185,
    right: 21,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 1,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionText: {
    fontSize: 16,
  },
});
