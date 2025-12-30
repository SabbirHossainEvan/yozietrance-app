import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
}

export default function ChatDetailScreen() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const [inputText, setInputText] = useState("");

  const [activeTab, setActiveTab] = useState("Catalog");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to TechHub Electronics. How can I help you today?",
      sender: "other",
      time: "10:30 AM",
    },
    {
      id: "2",
      text: "Hey! How was the new design project coming along?",
      sender: "me",
      time: "10:30 AM",
    },
  ]);

  const sendMessage = () => {
    if (inputText.trim().length === 0) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, newMessage]);
    setInputText("");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Image
          source={{ uri: "https://i.pravatar.cc/150" }}
          style={styles.headerAvatar}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerName}>{name || "Rokey Mahmud"}</Text>
          <Text style={styles.onlineStatus}>Online</Text>
        </View>
        <TouchableOpacity>
          <Feather name="more-horizontal" size={24} />
        </TouchableOpacity>
      </View>

      {/* Dynamic Buttons Row */}
      <View style={styles.topButtons}>
        <TouchableOpacity
          style={[styles.topBtn, activeTab === "Catalog" && styles.activeBtn]}
          onPress={() => {
            setActiveTab("Catalog");
            router.replace("/(users)/categoriesScreen");
          }}
        >
          <Text
            style={[
              styles.btnText,
              activeTab === "Catalog" && styles.activeBtnText,
            ]}
          >
            📦 View Catalog
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.topBtn, activeTab === "Vendor" && styles.activeBtn]}
        >
          <Text
            style={[
              styles.btnText,
              activeTab === "Vendor" && styles.activeBtnText,
            ]}
          >
            Vendor Info
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.topBtn, activeTab === "History" && styles.activeBtn]}
          onPress={() => {
            setActiveTab("History");
            router.replace("/(user_screen)/OrderHistoryScreen");
          }}
        >
          <Text
            style={[
              styles.btnText,
              activeTab === "History" && styles.activeBtnText,
            ]}
          >
            Order History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chat Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageRow,
              item.sender === "me" ? styles.myRow : styles.otherRow,
            ]}
          >
            {item.sender === "other" && (
              <Image
                source={{ uri: "https://i.pravatar.cc/150" }}
                style={styles.msgAvatar}
              />
            )}
            <View
              style={[
                styles.bubble,
                item.sender === "me" ? styles.myBubble : styles.otherBubble,
              ]}
            >
              <Text
                style={[
                  styles.msgText,
                  item.sender === "me" ? styles.myText : null,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.msgTime,
                  item.sender === "me" ? styles.myTimeText : null,
                ]}
              >
                {item.time}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Message Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inputArea}>
          <TouchableOpacity>
            <Feather name="plus" size={24} color="#2A8383" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBF9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },
  headerAvatar: { width: 40, height: 40, borderRadius: 20 },
  headerName: { fontWeight: "bold", fontSize: 16, color: "#333" },
  onlineStatus: { fontSize: 12, color: "green" },

  topButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    backgroundColor: "#FFF",
  },
  topBtn: {
    borderWidth: 1,
    borderColor: "#DDD",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  activeBtn: {
    backgroundColor: "#2A8383",
    borderColor: "#2A8383",
  },
  btnText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  activeBtnText: {
    color: "#FFF",
  },

  messageRow: { flexDirection: "row", marginBottom: 20, maxWidth: "80%" },
  myRow: { alignSelf: "flex-end" },
  otherRow: { alignSelf: "flex-start" },
  msgAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: "flex-end",
  },
  bubble: { padding: 12, borderRadius: 18 },
  otherBubble: { backgroundColor: "#FFF", borderBottomLeftRadius: 0 },
  myBubble: { backgroundColor: "#2A8383", borderBottomRightRadius: 0 },
  msgText: { fontSize: 14, color: "#333", lineHeight: 20 },
  myText: { color: "#FFF" },
  msgTime: {
    fontSize: 10,
    color: "#999",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  myTimeText: {
    color: "#E0E0E0",
  },

  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    marginHorizontal: 10,
    fontSize: 15,
  },
  sendBtn: {
    backgroundColor: "#2A8383",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
});
