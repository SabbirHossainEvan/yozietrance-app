import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OrderDetails = () => {
  const router = useRouter();
  const { status } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(5);

  const orderItems = [
    {
      id: "1",
      title: "#ORD-2025",
      price: 20,
      qty: 2,
      desc: "Lorem ipsum ultricies in tortor...",
    },
    {
      id: "2",
      title: "#ORD-2025",
      price: 20,
      qty: 2,
      desc: "Lorem ipsum ultricies in tortor...",
    },
  ];

  const statusSteps = [
    {
      label: "Order Created",
      date: "18 May 2025",
      location: "Mirpur 11, Dhaka",
      key: "Created",
    },
    {
      label: "Processing",
      date: "22 May 2025",
      location: "Mirpur 11, Dhaka",
      key: "Processing",
    },
    {
      label: "Shipped",
      date: "23 May 2025",
      location: "Mirpur 11, Dhaka",
      key: "Shipped",
    },
    {
      label: "Ready For Pickup",
      date: "23 May 2025",
      location: "Mirpur 11, Dhaka",
      key: "Shipped",
    },
    { label: "Pickup", date: "", location: "", key: "Delivered" },
  ];

  const checkCompleted = (stepKey: string) => {
    const levels: any = { Processing: 1, Shipped: 2, Delivered: 4 };
    const currentLevel = levels[status as string] || 0;
    const stepLevel = levels[stepKey] || 0;
    return stepLevel <= currentLevel;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders #ORD-2025</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <View style={styles.card}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: "https://i.@pravatar.cc/100" }}
              style={styles.avatar}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.userName}>Ronald Richards</Text>
              <Text style={styles.userId}>ID: #225432</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.messageBtn}>
            <Ionicons name="chatbubble-outline" size={18} color="#333" />
            <Text style={styles.messageBtnText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Order Items */}
        <Text style={styles.sectionTitle}>Order items</Text>
        <View style={styles.card}>
          {orderItems.map((item, idx) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                idx !== orderItems.length - 1 && styles.borderBottom,
              ]}
            >
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.itemImg}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                </View>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemDesc} numberOfLines={2}>
                    {item.desc}
                  </Text>
                  <Text style={styles.itemQty}>x{item.qty}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Details */}
        <Text style={styles.sectionTitle}>Payment details</Text>
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>$80.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax(7.5%)</Text>
            <Text style={styles.summaryValue}>$10.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>$0.60</Text>
          </View>
          <View style={styles.dashedLine} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Grand total</Text>
            <Text style={styles.totalValue}>$90.60</Text>
          </View>
          <View style={styles.paidBadge}>
            <Text style={styles.paidText}>Paid</Text>
            <Text style={styles.paidSubText}>Via Credit Card ending 4242</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Order history</Text>
        <View style={styles.card}>
          {statusSteps.map((step, index) => {
            const completed = index === 0 || checkCompleted(step.key);
            const isLast = index === statusSteps.length - 1;
            return (
              <View key={index} style={styles.historyRow}>
                <View style={styles.historyLeft}>
                  <View style={[styles.dot, completed && styles.dotActive]}>
                    {completed && (
                      <Ionicons name="checkmark" size={8} color="#FFF" />
                    )}
                  </View>
                  {!isLast && (
                    <View
                      style={[styles.line, completed && styles.lineActive]}
                    />
                  )}
                </View>
                <View style={styles.historyRight}>
                  <Text
                    style={[
                      styles.historyLabel,
                      completed && styles.textActive,
                    ]}
                  >
                    {step.label}
                  </Text>
                  {step.date ? (
                    <Text style={styles.historySub}>
                      {step.location} • {step.date}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>

        {status === "Delivered" && (
          <TouchableOpacity
            style={styles.feedbackMainBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.feedbackMainBtnText}>Give Feedback</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Feedback Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>

            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={40} color="#2A8383" />
            </View>

            <Text style={styles.modalTitle}>Task Completed</Text>
            <Text style={styles.modalSub}>
              Average Rating and Feedback{"\n"}Tamim Sarkar
            </Text>

            <Text style={styles.avgRatingLabel}>Avg. Rating</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setRating(s)}
                  style={styles.starItem}
                >
                  <Ionicons
                    name="star"
                    size={35}
                    color={s <= rating ? "#FF9500" : "#E0E0E0"}
                  />
                  <Text style={styles.starText}>
                    {s === 1
                      ? "Bad"
                      : s === 3
                        ? "Good"
                        : s === 5
                          ? "Amazing"
                          : ""}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Feedback Note</Text>
              <TextInput
                placeholder="Type here..."
                multiline
                style={styles.textInput}
              />
            </View>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBF9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  scrollContent: { padding: 16 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 1,
  },
  userInfo: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  userName: { fontSize: 16, fontWeight: "700" },
  userId: { fontSize: 12, color: "#999" },
  messageBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  messageBtnText: { marginLeft: 8, fontWeight: "600" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  itemRow: { flexDirection: "row", paddingVertical: 12 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  itemImg: { width: 60, height: 60, borderRadius: 10 },
  itemTitle: { fontWeight: "700", fontSize: 14 },
  itemPrice: { fontWeight: "700", color: "#333" },
  itemDesc: { fontSize: 12, color: "#999", marginTop: 4, flex: 0.9 },
  itemQty: { fontSize: 12, color: "#666" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: { color: "#666" },
  summaryValue: { fontWeight: "600" },
  dashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    borderStyle: "dashed",
    marginVertical: 10,
  },
  totalLabel: { fontSize: 16, fontWeight: "700" },
  totalValue: { fontSize: 16, fontWeight: "700", color: "#2A8383" },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "#F0F9F7",
    padding: 8,
    borderRadius: 8,
  },
  paidText: { color: "#2A8383", fontWeight: "bold", marginRight: 10 },
  paidSubText: { color: "#666", fontSize: 11 },
  historyRow: { flexDirection: "row", height: 70 },
  historyLeft: { alignItems: "center", marginRight: 15, width: 20 },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#DDD",
    alignItems: "center",
    justifyContent: "center",
  },
  dotActive: { backgroundColor: "#2A8383" },
  line: { width: 2, flex: 1, backgroundColor: "#DDD", marginVertical: 2 },
  lineActive: { backgroundColor: "#2A8383" },
  historyRight: { flex: 1 },
  historyLabel: { fontSize: 14, color: "#999" },
  textActive: { color: "#2A8383", fontWeight: "700" },
  historySub: { fontSize: 11, color: "#BBB", marginTop: 2 },
  feedbackMainBtn: {
    backgroundColor: "#2A8383",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  feedbackMainBtnText: { color: "#FFF", fontWeight: "bold" },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
  },
  closeBtn: { alignSelf: "flex-end" },
  checkCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E8F6F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold" },
  modalSub: { textAlign: "center", color: "#999", marginVertical: 10 },
  avgRatingLabel: {
    alignSelf: "flex-start",
    fontWeight: "bold",
    marginTop: 10,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 15,
  },
  starItem: { alignItems: "center" },
  starText: { fontSize: 10, color: "#999", marginTop: 4 },
  inputContainer: { width: "100%" },
  inputLabel: { fontWeight: "bold", marginBottom: 8 },
  textInput: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    padding: 12,
    textAlignVertical: "top",
  },
  doneBtn: {
    backgroundColor: "#2A8383",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  doneBtnText: { color: "#FFF", fontWeight: "bold" },
});

export default OrderDetails;
