// import { Feather, Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   FlatList,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// interface Message {
//   id: string;
//   text: string;
//   sender: "me" | "other";
//   time: string;
// }

// export default function ChatDetailScreen() {
//   const { name } = useLocalSearchParams();
//   const router = useRouter();
//   const [inputText, setInputText] = useState("");

//   const [activeTab, setActiveTab] = useState("Catalog");

//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: "1",
//       text: "Hello! Welcome to TechHub Electronics. How can I help you today?",
//       sender: "other",
//       time: "10:30 AM",
//     },
//     {
//       id: "2",
//       text: "Hey! How was the new design project coming along?",
//       sender: "me",
//       time: "10:30 AM",
//     },
//   ]);

//   const sendMessage = () => {
//     if (inputText.trim().length === 0) return;
//     const newMessage: Message = {
//       id: Date.now().toString(),
//       text: inputText,
//       sender: "me",
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };
//     setMessages([...messages, newMessage]);
//     setInputText("");
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FBF9" }}>
//       {/* Header Section */}
//       <View style={{ flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#F1F1F1" }}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="chevron-back" size={28} />
//         </TouchableOpacity>
//         <Image
//           source={{ uri: "https://i.pravatar.cc/150" }}
//           style={{ width: 40, height: 40, borderRadius: 20 }}
//         />
//         <View style={{ flex: 1, marginLeft: 10 }}>
//           <Text style={{ fontWeight: "bold", fontSize: 16, color: "#333" }}>{name || "Rokey Mahmud"}</Text>
//           <Text style={{ fontSize: 12, color: "green" }}>Online</Text>
//         </View>
//         <TouchableOpacity>
//           <Feather name="more-horizontal" size={24} />
//         </TouchableOpacity>
//       </View>

//       {/* Dynamic Buttons Row */}
//       <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#EEE", backgroundColor: "#FFF" }}>
//         <TouchableOpacity
//           style={[
//             { borderWidth: 1, borderColor: "#DDD", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: "transparent", width: "30%" },
//             activeTab === "Catalog" && { backgroundColor: "#2A8383", borderColor: "#2A8383" }
//           ]}
//         >
//           <Text
//             style={[
//               { fontSize: 12, color: "#666", fontWeight: "500" },
//               activeTab === "Catalog" && { color: "#FFF" },
//             ]}
//           >
//             Chat
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             { borderWidth: 1, borderColor: "#DDD", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: "transparent", width: "30%" },
//             activeTab === "Vendor" && { backgroundColor: "#2A8383", borderColor: "#2A8383" }
//           ]}
//         >
//           <Text
//             style={[
//               { fontSize: 12, color: "#666", fontWeight: "500" },
//               activeTab === "Vendor" && { color: "#FFF" },
//             ]}
//             onPress={() => {
//               setActiveTab("Catalog");
//               router.push("/(users)/categoriesScreen");
//             }}
//           >
//             View Catalog
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             { borderWidth: 1, borderColor: "#DDD", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: "transparent", width: "30%" },
//             activeTab === "History" && { backgroundColor: "#2A8383", borderColor: "#2A8383" }
//           ]}
//           onPress={() => {
//             setActiveTab("History");
//             router.push("/(user_screen)/OrderHistoryScreen");
//           }}
//         >
//           <Text
//             style={[
//               { fontSize: 12, color: "#666", fontWeight: "500" },
//               activeTab === "History" && { color: "#FFF" },
//             ]}
//           >
//             Order History
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Chat Messages List */}
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View
//             style={[
//               { flexDirection: "row", marginBottom: 20, maxWidth: "80%" },
//               item.sender === "me" ? { alignSelf: "flex-end" } : { alignSelf: "flex-start" },
//             ]}
//           >
//             {item.sender === "other" && (
//               <Image
//                 source={{ uri: "https://i.pravatar.cc/150" }}
//                 style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8, alignSelf: "flex-end" }}
//               />
//             )}
//             <View
//               style={[
//                 { padding: 12, borderRadius: 18 },
//                 item.sender === "me" ? { backgroundColor: "#2A8383", borderBottomRightRadius: 0 } : { backgroundColor: "#FFF", borderBottomLeftRadius: 0 },
//               ]}
//             >
//               <Text
//                 style={[
//                   { fontSize: 14, color: "#333", lineHeight: 20 },
//                   item.sender === "me" ? { color: "#FFF" } : null,
//                 ]}
//               >
//                 {item.text}
//               </Text>
//               <Text
//                 style={[
//                   { fontSize: 10, color: "#999", marginTop: 5, alignSelf: "flex-end" },
//                   item.sender === "me" ? { color: "#E0E0E0" } : null,
//                 ]}
//               >
//                 {item.time}
//               </Text>
//             </View>
//           </View>
//         )}
//         contentContainerStyle={{ padding: 16 }}
//       />

//       {/* Message Input Area */}
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <View style={{ flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: "#FFF", borderTopWidth: 1, borderTopColor: "#EEE" }}>
//           <TouchableOpacity>
//             <Feather name="plus" size={24} color="#2A8383" />
//           </TouchableOpacity>
//           <TextInput
//             style={{ flex: 1, backgroundColor: "#F5F5F5", borderRadius: 25, paddingHorizontal: 15, height: 45, marginHorizontal: 10, fontSize: 15 }}
//             placeholder="Type a message..."
//             value={inputText}
//             onChangeText={setInputText}
//           />
//           <TouchableOpacity onPress={sendMessage} style={{ backgroundColor: "#2A8383", width: 45, height: 45, borderRadius: 22.5, justifyContent: "center", alignItems: "center", elevation: 2 }}>
//             <Ionicons name="send" size={20} color="white" />
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

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

  // যেহেতু এটি চ্যাট স্ক্রিন, তাই ডিফল্টভাবে 'Chat' একটিভ থাকবে
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

  // নেভিগেশন হ্যান্ডলার ফাংশন
  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName); // বাটন হাইলাইট করার জন্য

    if (tabName === "Catalog") {
      router.push("/(users)/categoriesScreen");
    } else if (tabName === "History") {
      router.push("/(user_screen)/OrderHistoryScreen");
    } else if (tabName === "Chat") {
      // আপনি অলরেডি চ্যাট স্ক্রিনে আছেন, তাই এখানে নতুন করে পুশ করার দরকার নেই
      // চাইলে লিস্ট স্ক্রল টু টপ করতে পারেন
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
