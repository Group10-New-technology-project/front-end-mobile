import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, Button, SafeAreaView, Alert } from "react-native";
import * as Contacts from "expo-contacts";

export default function DanhBaMay() {
  const [contacts, setContacts] = useState([]);
  const [totalContacts, setTotalContacts] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
        });

        if (data.length > 0) {
          // Sắp xếp danh sách liên hệ theo tên ABC
          const sortedContacts = data.sort((a, b) => (a.name > b.name ? 1 : -1));
          setContacts(sortedContacts);
          setTotalContacts(sortedContacts.length);
        }
      }
    })();
  }, []);

  const renderItem = ({ item }) => {
    if (!item.name || item.phoneNumbers.length === 0) {
      return null; // Bỏ qua các liên hệ không có tên hoặc số điện thoại
    }
    // Lấy số điện thoại đầu tiên từ mảng phoneNumbers
    const firstPhoneNumber = item.phoneNumbers[0].number;

    return (
      <View style={styles.item}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ marginLeft: 12, alignItems: "flex-start" }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.phoneNumber}>{firstPhoneNumber}</Text>
          </View>
        </View>
      </View>
    );
  };

  const handleRefreshContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
      });

      if (data.length > 0) {
        const sortedContacts = data.sort((a, b) => (a.name > b.name ? 1 : -1));
        setContacts(sortedContacts);
        setTotalContacts(sortedContacts.length);
      }
      Alert.alert("Cập nhật danh bạ thành công");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header_contacts}>
        <Text style={styles.content_totalUsers}>Tất cả {totalContacts}</Text>
        <Button title="Cập nhật Contacts" onPress={handleRefreshContacts} />
      </View>
      <SafeAreaView style={{ height: 8, backgroundColor: "#DBDBDB" }} />
      <FlatList data={contacts} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    padding: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0091FF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
    color: "#fff",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  phoneNumber: {
    fontSize: 14,
  },
  content_totalUsers: {
    fontSize: 16,
    fontWeight: "500",
    borderWidth: 0.5,
    borderRadius: 16,
    padding: 8,
    marginRight: 12,
    borderColor: "gray",
    color: "gray",
  },
  header_contacts: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
});
