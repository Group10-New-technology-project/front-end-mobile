import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions, FlatList, StyleSheet, Pressable } from "react-native";
import { Video, ResizeMode } from "expo-av";

const videos = [
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
];

export default function ReelScreen() {
  const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
    }
  };

  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={({ item, index }) => <Item item={item} shouldPlay={index === currentViewableItemIndex} />}
        keyExtractor={(item) => item}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
    </View>
  );
}

const Item = ({ item, shouldPlay }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState(null);

  // useEffect(() => {
  //   if (!videoRef.current) return;
  //   if (shouldPlay) {
  //     videoRef.current.playAsync();
  //   } else {
  //     videoRef.current.pauseAsync();
  //     videoRef.current.setPositionAsync(0);
  //   }
  // }, [shouldPlay]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (shouldPlay) {
      videoRef.current.playAsync().catch((error) => console.error("Error while playing video:", error)); // Xử lý lỗi khi phát video
    } else {
      videoRef.current.pauseAsync().catch((error) => console.error("Error while pausing video:", error)); // Xử lý lỗi khi tạm dừng video
      videoRef.current.setPositionAsync(0).catch((error) => console.error("Error while setting video position:", error)); // Xử lý lỗi khi đặt vị trí video
    }
  }, [shouldPlay]);

  return (
    <Pressable onPress={() => (status?.isPlaying ? videoRef.current?.pauseAsync() : videoRef.current?.playAsync())}>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: item }}
          style={styles.video}
          isLooping
          resizeMode={ResizeMode.COVER}
          useNativeControls={false}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
