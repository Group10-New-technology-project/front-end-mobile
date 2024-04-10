import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { API_URL } from "@env";

export default function TimKiemScreen({ route }) {
  const { searchPhone } = route.params;
  const [userData, setUserData] = useState(null);
  const [notFound, setNotFound] = useState(false); // State để đánh dấu không tìm thấy dữ liệu

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/users/username/${searchPhone}`);
        const data = await response.json();
        if (data) {
          setUserData(data);
        } else {
          // Nếu không tìm thấy dữ liệu, đánh dấu là không tìm thấy
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [searchPhone]);

  return (
    <View style={styles.container}>
      {notFound ? (
        <Text style={styles.notFoundText}>Không tìm thấy</Text>
      ) : userData ? (
        <>
          <Image source={{ uri: userData.avatar }} style={{ width: 50, height: 50, borderRadius: 50 }} />
          <Text>{userData.name}</Text>
          <Text>{userData._id}</Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
