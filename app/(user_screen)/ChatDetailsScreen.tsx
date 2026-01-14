import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FBF9" }}>
      {/* Header Section */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#F1F1F1" }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Image
          source={{ uri: "https://i.pravatar.cc/150" }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16, color: "#333" }}>{name || "Rokey Mahmud"}</Text>
          <Text style={{ fontSize: 12, color: "green" }}>Online</Text>
        </View>
        <TouchableOpacity>
          <Feather name="more-horizontal" size={24} />
        </TouchableOpacity>
      </View>

      {/* Dynamic Buttons Row */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#EEE", backgroundColor: "#FFF" }}>
        <TouchableOpacity
          style={[
            { borderWidth: 1, borderColor: "#DDD", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: "transparent", width: "30%" },
            activeTab === "Catalog" && { backgroundColor: "#2A8383", borderColor: "#2A8383" }
          ]}
        >
          <Text
            style={[
              { fontSize: 12, color: "#666", fontWeight: "500" },
              activeTab === "Catalog" && { color: "#FFF" },
            ]}
          >
            Chat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            { borderWidth: 1, borderColor: "#DDD", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: "transparent", width: "30%" },
            activeTab === "Vendor" && { backgroundColor: "#2A8383", borderColor: "#2A8383" }
          ]}
        >
          <Text
            style={[
              { fontSize: 12, color: "#666", fontWeight: "500" },
              activeTab === "Vendor" && { color: "#FFF" },
            ]}
            onPress={() => {
              setActiveTab("Catalog");
              router.push("/(users)/categoriesScreen");
            }}
          >
            View Catalog
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            { borderWidth: 1, borderColor: "#DDD", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: "transparent", width: "30%" },
            activeTab === "History" && { backgroundColor: "#2A8383", borderColor: "#2A8383" }
          ]}
          onPress={() => {
            setActiveTab("History");
            router.push("/(user_screen)/OrderHistoryScreen");
          }}
        >
          <Text
            style={[
              { fontSize: 12, color: "#666", fontWeight: "500" },
              activeTab === "History" && { color: "#FFF" },
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
              { flexDirection: "row", marginBottom: 20, maxWidth: "80%" },
              item.sender === "me" ? { alignSelf: "flex-end" } : { alignSelf: "flex-start" },
            ]}
          >
            {item.sender === "other" && (
              <Image
                source={{ uri: "https://i.pravatar.cc/150" }}
                style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8, alignSelf: "flex-end" }}
              />
            )}
            <View
              style={[
                { padding: 12, borderRadius: 18 },
                item.sender === "me" ? { backgroundColor: "#2A8383", borderBottomRightRadius: 0 } : { backgroundColor: "#FFF", borderBottomLeftRadius: 0 },
              ]}
            >
              <Text
                style={[
                  { fontSize: 14, color: "#333", lineHeight: 20 },
                  item.sender === "me" ? { color: "#FFF" } : null,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  { fontSize: 10, color: "#999", marginTop: 5, alignSelf: "flex-end" },
                  item.sender === "me" ? { color: "#E0E0E0" } : null,
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
        <View style={{ flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: "#FFF", borderTopWidth: 1, borderTopColor: "#EEE" }}>
          <TouchableOpacity>
            <Feather name="plus" size={24} color="#2A8383" />
          </TouchableOpacity>
          <TextInput
            style={{ flex: 1, backgroundColor: "#F5F5F5", borderRadius: 25, paddingHorizontal: 15, height: 45, marginHorizontal: 10, fontSize: 15 }}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity onPress={sendMessage} style={{ backgroundColor: "#2A8383", width: 45, height: 45, borderRadius: 22.5, justifyContent: "center", alignItems: "center", elevation: 2 }}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


