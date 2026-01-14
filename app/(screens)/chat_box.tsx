// import { chatConversations, recentOrders } from '@/constants/common'
// import { MaterialIcons } from '@expo/vector-icons'
// import { useLocalSearchParams, useRouter } from 'expo-router'
// import React, { useState } from 'react'
// import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'

// const ChatBox = () => {
//     const router = useRouter();
//     const { conversationId } = useLocalSearchParams();
//     const [message, setMessage] = useState('');
//     const [activeInfoTab, setActiveInfoTab] = useState<'userInfo' | 'orderHistory'>('userInfo');

//     const conversation = chatConversations.find(conv => conv.id === conversationId);

//     if (!conversation) {
//         return (
//             <SafeAreaView style={{ flex: 1 }}>
//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                     <Text style={{ fontSize: 16, color: '#6B7280' }}>Conversation not found</Text>
//                 </View>
//             </SafeAreaView>
//         );
//     }

//     const handleBack = () => {
//         router.back();
//     };

//     const handleSendMessage = () => {
//         if (message.trim()) {
//             console.log('Message sent:', message);
//             setMessage('');
//         }
//     };

//     const formatTime = (date: Date) => {
//         return date.toLocaleTimeString('en-US', {
//             hour: 'numeric',
//             minute: '2-digit',
//             hour12: true
//         });
//     };

//     return (
//         <SafeAreaView style={{ flex: 1 }}>
//             {/* Header */}
//             <View style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 paddingHorizontal: 20,
//                 paddingVertical: 16,
//                 borderBottomWidth: 1,
//                 borderBottomColor: '#F3F4F6'
//             }}>
//                 <TouchableOpacity onPress={handleBack}>
//                     <MaterialIcons name="arrow-back-ios-new" size={20} color="black" />
//                 </TouchableOpacity>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 16 }}>
//                     <View style={{ position: 'relative' }}>
//                         <Image
//                             source={{ uri: conversation.participant.avatar }}
//                             style={{ width: 40, height: 40, borderRadius: 20 }}
//                             resizeMode="cover"
//                         />
//                         {conversation.isOnline && (
//                             <View style={{
//                                 position: 'absolute',
//                                 bottom: 0,
//                                 right: 0,
//                                 width: 12,
//                                 height: 12,
//                                 borderRadius: 6,
//                                 backgroundColor: '#10B981',
//                                 borderWidth: 2,
//                                 borderColor: '#fff',
//                             }} />
//                         )}
//                     </View>
//                     <View style={{ marginLeft: 12 }}>
//                         <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>
//                             {conversation.participant.name}
//                         </Text>
//                         <Text style={{ fontSize: 12, color: '#6B7280' }}>
//                             {conversation.isOnline ? 'Online' : 'Offline'}
//                         </Text>
//                     </View>
//                 </View>
//                 <TouchableOpacity>
//                     <MaterialIcons name="more-vert" size={20} color="#6B7280" />
//                 </TouchableOpacity>
//             </View>

//             {/* Tabs Section */}
//             <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
//                 <View style={{ flexDirection: 'row', marginBottom: 16 }}>
//                     <TouchableOpacity
//                         onPress={() => setActiveInfoTab('userInfo')}
//                         style={{
//                             flex: 1,
//                             paddingVertical: 12,
//                             backgroundColor: activeInfoTab === 'userInfo' ? '#278687' : '#e6f1ef',
//                             borderRadius: 8,
//                             alignItems: 'center',
//                         }}
//                     >
//                         <Text style={{
//                             color: activeInfoTab === 'userInfo' ? '#fff' : '#2B2B2B',
//                             fontSize: 14
//                         }}>User Info</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         onPress={() => setActiveInfoTab('orderHistory')}
//                         style={{
//                             flex: 1,
//                             paddingVertical: 12,
//                             backgroundColor: activeInfoTab === 'orderHistory' ? '#278687' : '#e6f1ef',
//                             borderRadius: 8,
//                             alignItems: 'center',
//                             marginLeft: 8,
//                         }}
//                     >
//                         <Text style={{
//                             color: activeInfoTab === 'orderHistory' ? '#fff' : '#2B2B2B',
//                             fontSize: 14
//                         }}>Order History</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             {/* Content Area */}
//             <View style={{ flex: 1 }}>
//                 {activeInfoTab === 'userInfo' ? (
//                     <>
//                         <ScrollView
//                             style={{ flex: 1, paddingHorizontal: 20 }}
//                             contentContainerStyle={{ paddingVertical: 16 }}
//                         >
//                             {conversation.messages.map((msg) => (
//                                 <View key={msg.id} style={{ marginBottom: 16 }}>
//                                     {msg.isOwn ? (
//                                         <View style={{ alignItems: 'flex-end' }}>
//                                             <View style={{
//                                                 backgroundColor: '#278687',
//                                                 borderRadius: 18,
//                                                 borderBottomRightRadius: 4,
//                                                 paddingHorizontal: 16,
//                                                 paddingVertical: 12,
//                                                 maxWidth: '80%',
//                                             }}>
//                                                 <Text style={{ fontSize: 14, color: '#fff', lineHeight: 20 }}>
//                                                     {msg.text}
//                                                 </Text>
//                                             </View>
//                                             <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
//                                                 {formatTime(msg.timestamp)}
//                                             </Text>
//                                         </View>
//                                     ) : (
//                                         <View style={{ alignItems: 'flex-start' }}>
//                                             <View style={{
//                                                 backgroundColor: '#fff',
//                                                 borderRadius: 18,
//                                                 borderBottomLeftRadius: 4,
//                                                 paddingHorizontal: 16,
//                                                 paddingVertical: 12,
//                                                 maxWidth: '80%',
//                                                 borderWidth: 1,
//                                                 borderColor: '#E5E7EB',
//                                             }}>
//                                                 <Text style={{ fontSize: 14, color: '#1F2937', lineHeight: 20 }}>
//                                                     {msg.text}
//                                                 </Text>
//                                             </View>
//                                             <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
//                                                 {formatTime(msg.timestamp)}
//                                             </Text>
//                                         </View>
//                                     )}
//                                 </View>
//                             ))}

//                             {conversation.isTyping && (
//                                 <View style={{ alignItems: 'flex-start', marginBottom: 16 }}>
//                                     <View style={{
//                                         backgroundColor: '#fff',
//                                         borderRadius: 18,
//                                         borderBottomLeftRadius: 4,
//                                         paddingHorizontal: 16,
//                                         paddingVertical: 12,
//                                         borderWidth: 1,
//                                         borderColor: '#E5E7EB',
//                                     }}>
//                                         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                             {[1, 2, 3].map((dot) => (
//                                                 <View key={dot} style={{
//                                                     width: 8, height: 8, borderRadius: 4,
//                                                     backgroundColor: '#9CA3AF', marginRight: 4
//                                                 }} />
//                                             ))}
//                                         </View>
//                                     </View>
//                                 </View>
//                             )}
//                         </ScrollView>

//                         {/* Message Input - Only in User Info Tab */}
//                         <View style={{
//                             paddingHorizontal: 20,
//                             paddingVertical: 16,
//                         }}>
//                             <View style={{
//                                 flexDirection: 'row',
//                                 alignItems: 'center',
//                                 backgroundColor: '#F3F4F6',
//                                 paddingHorizontal: 16,
//                                 paddingVertical: 8,
//                                 borderWidth: 1,
//                                 borderColor: '#E5E7EB',
//                                 borderRadius: 22,
//                             }}>
//                                 <TouchableOpacity style={{ marginRight: 12 }}>
//                                     <MaterialIcons name="attach-file" size={20} color="#6B7280" />
//                                 </TouchableOpacity>
//                                 <TextInput
//                                     value={message}
//                                     onChangeText={setMessage}
//                                     placeholder="Type a message..."
//                                     placeholderTextColor="#9CA3AF"
//                                     style={{ flex: 1, fontSize: 14, color: '#1F2937', maxHeight: 100 }}
//                                     multiline
//                                 />
//                                 <TouchableOpacity
//                                     onPress={handleSendMessage}
//                                     style={{
//                                         marginLeft: 12,
//                                         backgroundColor: message.trim() ? '#278687' : '#D1D5DB',
//                                         borderRadius: 20,
//                                         width: 36,
//                                         height: 36,
//                                         justifyContent: 'center',
//                                         alignItems: 'center',
//                                     }}
//                                 >
//                                     <MaterialIcons
//                                         name="send"
//                                         size={18}
//                                         color={message.trim() ? '#fff' : '#9CA3AF'}
//                                     />
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                     </>
//                 ) : (
//                     /* Order History View */
//                     <ScrollView
//                         style={{ flex: 1, paddingHorizontal: 20 }}
//                         contentContainerStyle={{ paddingBottom: 20 }}
//                         showsVerticalScrollIndicator={false}
//                     >
//                         <View style={{ gap: 12, marginTop: 10 }}>
//                             {recentOrders.filter((order) => order.customer.name === conversation.participant.name).length > 0 ? (
//                                 recentOrders.filter((order) => order.customer.name === conversation.participant.name).map((order) => (
//                                     <TouchableOpacity
//                                         key={order.id}
//                                         onPress={() => router.push(`/(screens)/order_details?id=${order.id}`)}
//                                         style={{
//                                             backgroundColor: 'white',
//                                             borderRadius: 8,
//                                             padding: 12,
//                                             shadowColor: '#000',
//                                             shadowOffset: { width: 0, height: 1 },
//                                             shadowOpacity: 0.1,
//                                             shadowRadius: 3,
//                                             elevation: 2,
//                                         }}
//                                     >
//                                         <View style={{ flexDirection: 'row', marginBottom: 8 }}>
//                                             <Image
//                                                 source={{ uri: order.customer.avatar }}
//                                                 style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
//                                                 resizeMode="cover"
//                                             />
//                                             <View style={{ flex: 1 }}>
//                                                 <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 4 }}>
//                                                     {order.orderNumber}
//                                                 </Text>
//                                                 <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>
//                                                     {order.orderStatus.date}
//                                                 </Text>
//                                                 <Text style={{ fontSize: 12, color: '#6B7280' }}>
//                                                     {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''} • ${order.payment.grandTotal.toFixed(2)}
//                                                 </Text>
//                                             </View>
//                                         </View>
//                                         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                                             <View style={{
//                                                 backgroundColor:
//                                                     ['Delivered', 'Completed'].includes(order.orderStatus.status) ? '#D1FAE5' :
//                                                         order.orderStatus.status === 'Processing' ? '#FEF3C7' :
//                                                             order.orderStatus.status === 'Shipped' ? '#DBEAFE' : '#FEE2E2',
//                                                 paddingHorizontal: 8,
//                                                 paddingVertical: 4,
//                                                 borderRadius: 12,
//                                             }}>
//                                                 <Text style={{
//                                                     fontSize: 12,
//                                                     fontWeight: '600',
//                                                     color:
//                                                         ['Delivered', 'Completed'].includes(order.orderStatus.status) ? '#065F46' :
//                                                             order.orderStatus.status === 'Processing' ? '#D97706' :
//                                                                 order.orderStatus.status === 'Shipped' ? '#1D4ED8' : '#DC2626',
//                                                 }}>
//                                                     {order.orderStatus.status}
//                                                 </Text>
//                                             </View>
//                                             <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
//                                                 {order.orderStatus.location}
//                                             </Text>
//                                         </View>
//                                     </TouchableOpacity>
//                                 ))
//                             ) : (
//                                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
//                                     <Text style={{ fontSize: 16, color: '#6B7280' }}>No orders found</Text>
//                                 </View>
//                             )}
//                         </View>
//                     </ScrollView>
//                 )}
//             </View>
//         </SafeAreaView>
//     );
// };

// export default ChatBox;

import { chatConversations } from "@/constants/common";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. Type error fix korar jonno interface define kora
interface CouponData {
  id: string;
  code: string;
  type: string;
  discount: string;
  color: string;
  desc: string;
}

interface CustomChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  type: "text" | "image" | "file" | "coupon"; // Ekhane 'coupon' add kora hoyeche
  couponDetails?: CouponData;
}

// Mock Coupons Data
const AVAILABLE_COUPONS: CouponData[] = [
  {
    id: "c1",
    code: "6sfdxx",
    type: "NEW USER",
    discount: "5%",
    color: "#7C3AED",
    desc: "NEW USER on Orders Over $35",
  },
  {
    id: "c2",
    code: "6sfdxx",
    type: "CASHBACK",
    discount: "5%",
    color: "#FF4D67",
    desc: "CASHBACK on Orders Over $35",
  },
  {
    id: "c3",
    code: "6sfdxx",
    type: "DISCOUNT",
    discount: "5%",
    color: "#FF8A00",
    desc: "DISCOUNT on Orders Over $35",
  },
];

const ChatBox = () => {
  const router = useRouter();
  const { conversationId } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const conversation = chatConversations.find(
    (conv) => conv.id === conversationId
  );

  // 2. ChatMessages state-ke CustomChatMessage type deya hoyeche
  const [chatMessages, setChatMessages] = useState<CustomChatMessage[]>(
    (conversation?.messages as unknown as CustomChatMessage[]) || []
  );

  if (!conversation)
    return (
      <SafeAreaView>
        <Text>Not found</Text>
      </SafeAreaView>
    );

  const handleSendMessage = (
    text: string,
    type: "text" | "coupon" = "text",
    couponData?: CouponData
  ) => {
    if (!text.trim() && type === "text") return;

    const newMessage: CustomChatMessage = {
      id: Date.now().toString(),
      text: text,
      timestamp: new Date(),
      isOwn: true,
      type: type,
      couponDetails: couponData,
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setShowOptions(false);
  };

  const handleSelectCoupon = (coupon: CouponData) => {
    handleSendMessage(`Sent a coupon: ${coupon.code}`, "coupon", coupon);
    setShowCouponModal(false);
  };

  // Chat er bhitorer Coupon Card UI
  const renderCouponInChat = (coupon: CouponData) => (
    <View style={styles.chatCouponCard}>
      <View style={[styles.chatCouponLeft, { backgroundColor: coupon.color }]}>
        <Text style={styles.chatCouponVerticalText}>{coupon.type}</Text>
      </View>
      <View style={styles.chatCouponRight}>
        <Text style={{ fontWeight: "bold", fontSize: 13, color: "#1F2937" }}>
          Code: {coupon.code}
        </Text>
        <Text style={{ fontSize: 10, color: "#6B7280" }} numberOfLines={1}>
          {coupon.desc}
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            color: "#278687",
            marginTop: 2,
          }}
        >
          {coupon.discount} OFF
        </Text>
      </View>
    </View>
  );

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios-new" size={20} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              marginLeft: 15,
            }}
          >
            <Image
              source={{ uri: conversation.participant.avatar }}
              style={styles.avatar}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.userName}>
                {conversation.participant.name}
              </Text>
              <Text style={{ fontSize: 12, color: "#10B981" }}>
                {conversation.isOnline ? "Online" : "Offline"}
              </Text>
            </View>
          </View>
        </View>

        {/* Chat List */}
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {chatMessages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.isOwn
                  ? { justifyContent: "flex-end" }
                  : { justifyContent: "flex-start" },
              ]}
            >
              <View
                style={{
                  alignItems: msg.isOwn ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                }}
              >
                <View
                  style={[
                    styles.bubble,
                    msg.isOwn ? styles.ownBubble : styles.otherBubble,
                  ]}
                >
                  {msg.type === "coupon" && msg.couponDetails ? (
                    renderCouponInChat(msg.couponDetails)
                  ) : (
                    <Text
                      style={{
                        color: msg.isOwn ? "#fff" : "#1F2937",
                        fontSize: 14,
                      }}
                    >
                      {msg.text}
                    </Text>
                  )}
                </View>
                <Text style={styles.timestamp}>
                  {formatTime(msg.timestamp)}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Attachment Menu */}
        {showOptions && (
          <View style={styles.optionsGrid}>
            <OptionBtn icon="image" label="Photo" onPress={() => {}} />
            <OptionBtn icon="camera-alt" label="Camera" onPress={() => {}} />
            <OptionBtn icon="location-on" label="Location" onPress={() => {}} />
            <OptionBtn
              icon="confirmation-number"
              label="Coupon"
              onPress={() => setShowCouponModal(true)}
            />
          </View>
        )}

        {/* Input Section */}
        <View style={styles.inputBar}>
          <TouchableOpacity
            onPress={() => setShowOptions(!showOptions)}
            style={styles.plusBtn}
          >
            <MaterialIcons
              name={showOptions ? "close" : "add"}
              size={26}
              color="#6B7280"
            />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity onPress={() => handleSendMessage(message)}>
            <View
              style={[
                styles.sendBtn,
                { backgroundColor: message.trim() ? "#278687" : "#D1D5DB" },
              ]}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Coupon Selection Modal */}
        <Modal visible={showCouponModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.dragHandle} />
                <Text style={styles.modalTitle}>Select Coupon</Text>
                <TouchableOpacity
                  onPress={() => setShowCouponModal(false)}
                  style={styles.closeBtn}
                >
                  <MaterialIcons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ padding: 20 }}>
                {AVAILABLE_COUPONS.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.couponListCard}
                    onPress={() => handleSelectCoupon(item)}
                  >
                    <View
                      style={[styles.sideBar, { backgroundColor: item.color }]}
                    >
                      <Text style={styles.sideText}>{item.type}</Text>
                    </View>
                    <View style={{ flex: 1, padding: 12 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontWeight: "bold", color: "#1F2937" }}>
                          Code:{item.code}
                        </Text>
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: 20,
                            color: "#1F2937",
                          }}
                        >
                          {item.discount}
                        </Text>
                      </View>
                      <Text
                        style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}
                      >
                        {item.desc}
                      </Text>
                      <View style={styles.couponFooterLine}>
                        <Text style={styles.footerMinText}>Min. $35</Text>
                        <Text style={styles.footerMinText}>
                          Valid until May 25, 2025
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const OptionBtn = ({ icon, label, onPress }: any) => (
  <TouchableOpacity
    style={{ alignItems: "center", width: "25%" }}
    onPress={onPress}
  >
    <View style={styles.optionIconCircle}>
      <MaterialIcons name={icon} size={24} color="#278687" />
    </View>
    <Text style={styles.optionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#fff",
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  userName: { fontWeight: "600", fontSize: 16, color: "#1F2937" },
  messageRow: { flexDirection: "row", marginBottom: 12 },
  bubble: { padding: 10, borderRadius: 18, elevation: 1 },
  ownBubble: { backgroundColor: "#278687", borderBottomRightRadius: 4 },
  otherBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  timestamp: { fontSize: 10, color: "#9CA3AF", marginTop: 4 },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  plusBtn: { marginRight: 10 },
  textInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
    color: "#1F2937",
    maxHeight: 100,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  optionsGrid: {
    flexDirection: "row",
    paddingVertical: 20,
    backgroundColor: "#F9FAFB",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  optionIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E6F1F1",
    justifyContent: "center",
    alignItems: "center",
  },
  optionLabel: { fontSize: 12, marginTop: 6, color: "#4B5563" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "70%",
  },
  modalHeader: { padding: 16, alignItems: "center" },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#D1D5DB",
    borderRadius: 3,
    marginBottom: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  closeBtn: { position: "absolute", right: 20, top: 25 },
  couponListCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  sideBar: { width: 45, justifyContent: "center", alignItems: "center" },
  sideText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10,
    transform: [{ rotate: "-90deg" }],
    width: 90,
    textAlign: "center",
  },
  couponFooterLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 6,
  },
  footerMinText: { fontSize: 10, color: "#9CA3AF" },
  // Chat Coupon Design
  chatCouponCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 220,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  chatCouponLeft: { width: 35, justifyContent: "center", alignItems: "center" },
  chatCouponVerticalText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "bold",
    transform: [{ rotate: "-90deg" }],
    width: 70,
    textAlign: "center",
  },
  chatCouponRight: { flex: 1, padding: 10 },
});

export default ChatBox;
