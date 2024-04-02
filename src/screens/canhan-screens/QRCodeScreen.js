import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
export default function QRCodeScreen() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

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

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Open Date Picker" onPress={showDatePicker} />
      <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker} />
      {selectedDate && <Text style={{ marginTop: 20 }}>Selected Date: {selectedDate.toLocaleDateString()}</Text>}
    </View>
  );
}
