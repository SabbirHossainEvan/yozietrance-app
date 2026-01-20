import { Feather, Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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

  const [activeTab, setActiveTab] = useState("Chat");
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to TechHub. How can I help?",
      sender: "other",
      time: "10:30 AM",
    },
    {
      id: "2",
      text: "Hey! How is the design project going?",
      sender: "me",
      time: "10:31 AM",
    },
  ]);

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);

    if (tabName === "Catalog") {
      router.push("/(users)/categoriesScreen");
    } else if (tabName === "History") {
      router.push("/(user_screen)/OrderHistoryScreen");
    } else if (tabName === "Chat") {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

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
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Image
          source={{ uri: "https://i.pravatar.cc/150" }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{name || "Rokey Mahmud"}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
        <TouchableOpacity>
          <Feather name="more-horizontal" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* Tab Navigation Buttons */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                onPress={() => handleTabPress("Chat")}
                style={[
                  styles.tabButton,
                  activeTab === "Chat" && styles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "Chat" && styles.tabTextActive,
                  ]}
                >
                  Chat
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleTabPress("Catalog")}
                style={[
                  styles.tabButton,
                  activeTab === "Catalog" && styles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "Catalog" && styles.tabTextActive,
                  ]}
                >
                  View Catalog
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleTabPress("History")}
                style={[
                  styles.tabButton,
                  activeTab === "History" && styles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "History" && styles.tabTextActive,
                  ]}
                >
                  Order History
                </Text>
              </TouchableOpacity>
            </View>

            {/* Messages List */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              keyboardDismissMode="on-drag"
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageRow,
                    item.sender === "me"
                      ? styles.myMessageRow
                      : styles.otherMessageRow,
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
                      item.sender === "me"
                        ? styles.myBubble
                        : styles.otherBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.msgText,
                        item.sender === "me"
                          ? styles.myMsgText
                          : styles.otherMsgText,
                      ]}
                    >
                      {item.text}
                    </Text>
                    <Text
                      style={[
                        styles.timeText,
                        item.sender === "me"
                          ? styles.myTimeText
                          : styles.otherTimeText,
                      ]}
                    >
                      {item.time}
                    </Text>
                  </View>
                </View>
              )}
            />

            {/* Input Area */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.plusButton}>
                  <Feather name="plus" size={24} color="#2A8383" />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message..."
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                />
                <TouchableOpacity
                  onPress={sendMessage}
                  style={styles.sendButton}
                >
                  <Ionicons name="send" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
  avatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 10 },
  headerInfo: { flex: 1, marginLeft: 10 },
  headerName: { fontWeight: "bold", fontSize: 16, color: "#333" },
  headerStatus: { fontSize: 12, color: "green" },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  tabButton: {
    borderWidth: 1,
    borderColor: "#DDD",
    paddingVertical: 8,
    width: "30%",
    borderRadius: 8,
    alignItems: "center",
  },
  tabButtonActive: { backgroundColor: "#2A8383", borderColor: "#2A8383" },
  tabText: { fontSize: 11, color: "#666", fontWeight: "600" },
  tabTextActive: { color: "#FFF" },
  listContent: { padding: 16, flexGrow: 1 },
  messageRow: { flexDirection: "row", marginBottom: 15, maxWidth: "85%" },
  myMessageRow: { alignSelf: "flex-end" },
  otherMessageRow: { alignSelf: "flex-start" },
  msgAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    alignSelf: "flex-end",
  },
  bubble: { padding: 12, borderRadius: 20 },
  myBubble: { backgroundColor: "#2A8383", borderBottomRightRadius: 2 },
  otherBubble: {
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  msgText: { fontSize: 15, lineHeight: 20 },
  myMsgText: { color: "#FFF" },
  otherMsgText: { color: "#333" },
  timeText: { fontSize: 10, marginTop: 4, alignSelf: "flex-end" },
  myTimeText: { color: "#E0E0E0" },
  otherTimeText: { color: "#999" },
  inputWrapper: {
    padding: 12,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  inputContainer: { flexDirection: "row", alignItems: "center" },
  plusButton: { padding: 5 },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 22,
    paddingHorizontal: 15,
    minHeight: 44,
    marginHorizontal: 10,
    fontSize: 15,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#2A8383",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
