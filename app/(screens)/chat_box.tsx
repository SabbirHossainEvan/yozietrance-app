import { useGetCategoriesByVendorQuery } from "@/store/api/categoryApiSlice";
import { useGetMessagesQuery, useSendMessageMutation } from "@/store/api/chatApiSlice";
import { useGetOrdersQuery } from "@/store/api/orderApiSlice";
import { RootState } from "@/store/store";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

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
  timestamp: string;
  isOwn: boolean;
  type: "text" | "image" | "file" | "coupon";
  couponDetails?: CouponData;
}

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
];

const ChatBox = () => {
  const router = useRouter();
  const { conversationId, name, fullname, partnerId: partnerIdParam } = useLocalSearchParams();
  console.log('ChatBox Params:', { conversationId, name, fullname, partnerIdParam });
  const displayName = fullname || name || "Partner";
  const activePartnerId = (conversationId || partnerIdParam) as string;
  console.log('ChatBox activePartnerId:', activePartnerId);

  const [messageText, setMessageText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Chat");
  const flatListRef = useRef<FlatList>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const isVendorSide = user?.userType?.toUpperCase() === "VENDOR";

  // API Queries
  const { data: messagesData, isLoading: messagesLoading } = useGetMessagesQuery(activePartnerId, {
    skip: !activePartnerId,
  });
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesByVendorQuery(
    activePartnerId,
    { skip: isVendorSide || !activePartnerId || activeTab !== "Categories" }
  );
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery(undefined, {
    skip: activeTab !== "Order History"
  });

  const [sendMessage] = useSendMessageMutation();

  const chatMessages = useMemo(() => {
    if (!Array.isArray(messagesData)) {
      return [];
    }
    return messagesData.map((msg: any) => ({
      id: msg._id || msg.id,
      text: msg.messageText || msg.text,
      timestamp: msg.createdAt,
      isOwn: msg.senderId === user?.userId || msg.senderId === user?.id || (msg.sender?._id || msg.sender?.id || msg.sender) === (user?.userId || user?.id),
      type: msg.type || "text",
      couponDetails: msg.couponDetails,
    }));
  }, [messagesData, user?.id]);

  const filteredOrders = useMemo(() => {
    return (ordersData || []).filter((order: any) => {
      const vendorId = order.vendorId?.userId || order.vendor?.userId || order.vendorId?._id || order.vendorId?.id || order.vendor?._id || order.vendor?.id || order.vendorId;
      const buyerId = order.buyer?.userId || order.user?.userId || order.user?._id || order.userId?._id || order.userId?.id || order.userId;
      return vendorId === activePartnerId || buyerId === activePartnerId;
    });
  }, [ordersData, activePartnerId]);

  const handleSendMessage = async (text: string, type: string = "text", coupon?: CouponData) => {
    if (!text.trim() && type === "text") return;
    try {
      await sendMessage({
        receiverId: activePartnerId,
        messageText: type === "coupon" ? "Sent a coupon: " + coupon?.code : text,
      }).unwrap();
      setMessageText("");
      setShowOptions(false);
    } catch (error) {
      console.error("Failed to send", error);
    }
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderMessage = ({ item: msg }: { item: CustomChatMessage }) => (
    <View style={[styles.messageRow, msg.isOwn ? styles.rowReverse : {}]}>
      {!msg.isOwn && (
        <Image source={{ uri: "https://via.placeholder.com/32" }} style={styles.msgAvatar} />
      )}
      <View style={[styles.bubbleWrapper, msg.isOwn ? styles.alignEnd : styles.alignStart]}>
        <View style={[styles.bubble, msg.isOwn ? styles.myBubble : styles.otherBubble]}>
          <Text style={[styles.msgText, msg.isOwn ? styles.myMsgText : styles.otherMsgText]}>
            {msg.text}
          </Text>
        </View>
        <Text style={styles.timeText}>{formatTime(msg.timestamp)}</Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <MaterialIcons name="arrow-back-ios-new" size={20} color="#333" />
      </TouchableOpacity>
      <View style={styles.headerPartnerContainer}>
        <Image source={{ uri: "https://via.placeholder.com/40" }} style={styles.headerAvatar} />
        <View style={styles.headerTextContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.headerName}>{displayName}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.headerId}>#{activePartnerId?.slice(-6)?.toUpperCase() || "ID"}</Text>
            <View style={[styles.onlineDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
      </View>

    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {["Chat", "Categories", "Order History"].map((tab) => {
        if (isVendorSide && tab === "Categories") return null;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => {
              if (tab === "Categories") {
                router.push("/(users)/categoriesScreen");
              } else if (tab === "Order History") {
                router.push("/(user_screen)/OrderHistoryScreen");
              } else {
                setActiveTab(tab);
              }
            }}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Categories":
        return (
          <View style={{ flex: 1, padding: 16 }}>
            {categoriesLoading ? <ActivityIndicator color="#2A8383" /> : (
              <FlatList
                data={categoriesData}
                numColumns={2}
                keyExtractor={(item) => item._id || item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.categoryCard}>
                    <Image source={{ uri: item.catImage || 'https://via.placeholder.com/80' }} style={styles.categoryImg} />
                    <Text style={styles.categoryLabel}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No categories found</Text>}
              />
            )}
          </View>
        );
      case "Order History":
        return (
          <View style={{ flex: 1, padding: 16 }}>
            {ordersLoading ? <ActivityIndicator color="#2A8383" /> : (
              <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item._id || item.id}
                renderItem={({ item }) => (
                  <View style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                      <Text style={styles.orderNo}>Order #{(item._id || item.id)?.slice(-6)?.toUpperCase() || 'ID'}</Text>
                      <Text style={[styles.orderStatus, { color: item.status === 'DELIVERED' ? '#4CAF50' : '#FF9800' }]}>{item.status}</Text>
                    </View>
                    <Text style={styles.orderDate}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Date N/A'}</Text>
                    <Text style={styles.orderTotal}>Total: ${item.totalAmount || '0.00'}</Text>
                  </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No orders found between you</Text>}
              />
            )}
          </View>
        );
      default:
        return (messagesLoading ? <ActivityIndicator color="#2A8383" /> :
          <FlatList
            ref={flatListRef}
            data={chatMessages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatList}
            renderItem={renderMessage}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {renderHeader()}
      {renderTabs()}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {renderContent()}

            {activeTab === "Chat" && (
              <>
                {showOptions && isVendorSide && (
                  <View style={styles.attachmentMenu}>
                    <View style={styles.attachmentRow}>
                      <AttachmentBtn icon="image" label="Photo" onPress={() => { }} />
                      <AttachmentBtn icon="camera-alt" label="camera" onPress={() => { }} />
                      <AttachmentBtn icon="location-on" label="Location" onPress={() => { }} />
                      <AttachmentBtn icon="confirmation-number" label="Coupon" onPress={() => setShowCouponModal(true)} />
                    </View>
                  </View>
                )}

                <View style={styles.inputArea}>
                  <TouchableOpacity onPress={() => setShowOptions(!showOptions)} style={styles.plusBtn}>
                    <Feather name={showOptions ? "x" : "plus"} size={28} color="#2A8383" />
                  </TouchableOpacity>
                  <TextInput
                    placeholder="Type a message..."
                    style={styles.textInput}
                    value={messageText}
                    onChangeText={setMessageText}
                    multiline
                  />
                  <TouchableOpacity onPress={() => handleSendMessage(messageText)}>
                    <View style={[styles.sendBtn, !messageText.trim() && { backgroundColor: "#DDD" }]}>
                      <Ionicons name="send" size={18} color="white" />
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <CouponModal
        visible={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        onSelect={(c: CouponData) => handleSendMessage("", "coupon", c)}
      />
    </SafeAreaView>
  );
};

const AttachmentBtn = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.attachBtn} onPress={onPress}>
    <View style={styles.attachIconCircle}>
      <MaterialIcons name={icon} size={24} color="#2A8383" />
    </View>
    <Text style={styles.attachLabel}>{label}</Text>
  </TouchableOpacity>
);

const CouponModal = ({ visible, onClose, onSelect }: any) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Coupon</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ padding: 15 }}>
          {AVAILABLE_COUPONS.map(coupon => (
            <TouchableOpacity key={coupon.id} style={styles.couponItem} onPress={() => { onSelect(coupon); onClose(); }}>
              <View style={[styles.couponSide, { backgroundColor: coupon.color }]}>
                <Text style={styles.couponTypeText}>{coupon.type}</Text>
              </View>
              <View style={styles.couponBody}>
                <Text style={styles.couponCode}>Code:{coupon.code}</Text>
                <Text style={styles.couponDesc}>{coupon.desc}</Text>
                <Text style={styles.couponDiscount}>{coupon.discount} OFF</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerPartnerContainer: { flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 12 },
  headerAvatar: { width: 44, height: 44, borderRadius: 22 },
  headerTextContainer: { marginLeft: 10 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  headerName: { fontSize: 18, fontWeight: "700", color: "#333" },
  onlineBadge: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#4CAF50", marginLeft: 6 },
  headerStatus: { fontSize: 13, color: "#999", marginTop: 1 },
  headerId: { fontSize: 13, color: "#999", marginTop: 1 },

  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F3F7F6",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    minWidth: 80,
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#2A8383", borderColor: "#2A8383" },
  tabText: { fontSize: 14, color: "#666", fontWeight: "600" },
  activeTabText: { color: "#FFF" },

  chatList: { padding: 16, flexGrow: 1 },
  messageRow: { marginBottom: 16, flexDirection: "row" },
  rowReverse: { flexDirection: "row-reverse" },
  msgAvatar: { width: 32, height: 32, borderRadius: 16, alignSelf: "flex-end", marginRight: 8 },
  bubbleWrapper: { maxWidth: "80%" },
  alignEnd: { alignItems: "flex-end" },
  alignStart: { alignItems: "flex-start" },
  bubble: { padding: 12, borderRadius: 16 },
  myBubble: { backgroundColor: "#2A8383", borderBottomRightRadius: 2 },
  otherBubble: { backgroundColor: "#F3F7F6", borderBottomLeftRadius: 2, borderWidth: 1, borderColor: "#E8E8E8" },
  msgText: { fontSize: 15, lineHeight: 20 },
  myMsgText: { color: "#FFF" },
  otherMsgText: { color: "#333" },
  timeText: { fontSize: 11, color: "#999", marginTop: 4 },

  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#fff",
  },
  plusBtn: { padding: 8 },
  textInput: {
    flex: 1,
    backgroundColor: "#F3F7F6",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 120,
    marginHorizontal: 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2A8383",
    justifyContent: "center",
    alignItems: "center",
  },

  attachmentMenu: {
    paddingVertical: 20,
    backgroundColor: "#F8FAF9",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  attachmentRow: { flexDirection: "row", justifyContent: "space-around" },
  attachBtn: { alignItems: "center" },
  attachIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#E6F1F1", justifyContent: "center", alignItems: "center" },
  attachLabel: { fontSize: 12, color: "#666", marginTop: 8 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, height: "60%" },
  modalHeader: { padding: 20, flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#EEE" },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  couponItem: { flexDirection: "row", backgroundColor: "#FFF", borderRadius: 12, borderWidth: 1, borderColor: "#EEE", marginBottom: 12, overflow: "hidden" },
  couponSide: { width: 40, justifyContent: "center", alignItems: "center" },
  couponTypeText: { color: "white", fontSize: 10, fontWeight: "bold", transform: [{ rotate: "-90deg" }], width: 60, textAlign: "center" },
  couponBody: { flex: 1, padding: 12 },
  couponCode: { fontSize: 14, fontWeight: "bold" },
  couponDesc: { fontSize: 12, color: "#666", marginTop: 4 },
  couponDiscount: { fontSize: 16, fontWeight: "bold", color: "#2A8383", marginTop: 4 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8, marginRight: 4 },
  categoryCard: { width: 150, margin: 8, backgroundColor: '#fff', borderRadius: 12, padding: 8, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  categoryImg: { width: 80, height: 80, borderRadius: 8, marginBottom: 8 },
  categoryLabel: { fontSize: 13, fontWeight: '600', color: '#333', textAlign: 'center' },
  orderCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 1, borderLeftWidth: 4, borderLeftColor: '#2A8383' },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderNo: { fontSize: 15, fontWeight: '700', color: '#333' },
  orderStatus: { fontSize: 12, fontWeight: '700' },
  orderDate: { fontSize: 12, color: '#999', marginBottom: 4 },
  orderTotal: { fontSize: 14, fontWeight: '600', color: '#2A8383' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 15 },
});

export default ChatBox;
