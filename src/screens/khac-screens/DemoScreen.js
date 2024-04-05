import React, { useState } from "react";
import { View, Button, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { API_URL } from "@env";

export default function DemoScreen() {
  const response = `${API_URL}/api/v1/users/sinup`;
  console.log(response);
  console.log("http://172.20.10.2:3000/api/v1/users/sinup");

  // const response = await fetch(`${apiUrl}/users/signup`, {
  //   // Các thiết lập khác ở đây
  // });
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Open Date Picker" onPress={showDatePicker} />
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}
