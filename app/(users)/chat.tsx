import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ChatUser {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  avatar: string;
}

const CHAT_DATA: ChatUser[] = [
  {
    id: "1",
    name: "Stephen Yustiono",
    lastMessage: "Nice. I don't know why I...",
    time: "9:30 am",
    unreadCount: 1,
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: "2",
    name: "Stephen Yustiono",
    lastMessage: "Nice. I don't know why I...",
    time: "9:30 am",
    unreadCount: 1,
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: "3",
    name: "Stephen Yustiono",
    lastMessage: "Nice. I don't know why I...",
    time: "9:30 am",
    avatar: "https://i.pravatar.cc/150?u=3",
  },
];

export default function ChatScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: ChatUser }) => (
    <TouchableOpacity
      style={styles.chatCard}
      onPress={() => router.replace("/ChatDetailsScreen")}
      // onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id, name: item.name } })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text
            style={[
              styles.timeText,
              item.unreadCount ? styles.activeTime : null,
            ]}
          >
            {item.time}
          </Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput placeholder="Search......." style={styles.searchInput} />
      </View>

      <FlatList
        data={CHAT_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16 }}
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
    padding: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    margin: 16,
    borderRadius: 15,
    padding: 12,
    alignItems: "center",
    elevation: 2,
  },
  searchInput: { marginLeft: 10, flex: 1 },
  chatCard: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#D1F2EB",
  },
  chatInfo: { flex: 1, marginLeft: 15, justifyContent: "center" },
  chatHeader: { flexDirection: "row", justifyContent: "space-between" },
  userName: { fontSize: 16, fontWeight: "600", color: "#333" },
  timeText: { fontSize: 12, color: "#999" },
  activeTime: { color: "#2A8383" },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  lastMessage: { fontSize: 14, color: "#777", flex: 1 },
  unreadBadge: {
    backgroundColor: "#2A8383",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
});
