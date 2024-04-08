import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

export default function LoiMoiKetBan() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  let data = 1;

  const onChange = (event) => {
    setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
  };
  //View 1-2
  const renderContentView = () => {
    switch (selectedIndex) {
      case 0:
        return (
          <View style={[styles.contentView, {}]}>
            <Text style={styles.contentText}>View 1</Text>
          </View>
        );
      case 1:
        return (
          <View style={[styles.contentView, {}]}>
            <Text style={styles.contentText}>View 2</Text>
          </View>
        );

      default:
        return 0;
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.segmentContainer}>
        <SegmentedControl
          style={styles.segment_control}
          values={[`Đã nhận ${data}`, `Đã gửi ${data}`]}
          selectedIndex={selectedIndex}
          onChange={onChange}
          fontStyle={{ fontSize: 16 }}
        />
      </View>
      {renderContentView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "pink",
    flex: 1,
  },
  segment_control: {
    height: Dimensions.get("window").height * 0.045,
  },
});
