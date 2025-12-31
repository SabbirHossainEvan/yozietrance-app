import { Entypo, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Notification {
  id: string;
  userImage: string;
  message: string;
  time: string;
}

const INITIAL_DATA: Notification[] = [
  {
    id: "1",
    userImage: "https://via.placeholder.com/50",
    message: "Your delivery has been successfully completed!!",
    time: "1 day ago",
  },
  {
    id: "2",
    userImage: "https://via.placeholder.com/50",
    message: "Your delivery has been successfully completed!!",
    time: "2 days ago",
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] =
    useState<Notification[]>(INITIAL_DATA);

  const handleDelete = (id: string, type: "remove" | "delete") => {
    const message =
      type === "remove" ? "Removed from view" : "Permanently deleted";

    setNotifications((prev) => prev.filter((item) => item.id !== id));

    Alert.alert("Success", message);
  };

  const showOptions = (id: string) => {
    Alert.alert("Options", "Choose an action", [
      { text: "Remove", onPress: () => handleDelete(id, "remove") },
      {
        text: "Delete",
        onPress: () => handleDelete(id, "delete"),
        style: "destructive",
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const renderItem: ListRenderItem<Notification> = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push("/(user_screen)/notification-details")}
    >
      <Image source={{ uri: item.userImage }} style={styles.avatar} />

      <View style={styles.textContainer}>
        <Text style={styles.messageText} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>

      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => showOptions(item.id)}
      >
        <Entypo name="dots-three-vertical" size={16} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(users)")}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No notifications
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBF9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  listContent: { paddingHorizontal: 15, paddingTop: 10 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#EEE" },
  textContainer: { flex: 1, marginLeft: 15, marginRight: 10 },
  messageText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    fontWeight: "500",
  },
  timeText: { fontSize: 13, color: "#999", marginTop: 8 },
  moreButton: { padding: 10 },
});
