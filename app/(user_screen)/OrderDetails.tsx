import { useGetOrderByIdQuery } from "@/store/api/orderApiSlice";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
  const { id, status: initialStatus } = useLocalSearchParams();
  const { data: orderResponse, isLoading, error } = useGetOrderByIdQuery(id as string, { skip: !id });

  const order = orderResponse?.data || orderResponse;
  const status = order?.status || initialStatus;

  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(5);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2A8383" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  if (!order || error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Order not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 10 }}>
            <Text style={{ color: '#2A8383' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const orderItems = order.orderItems || [];

  const statusSteps = [
    {
      label: "Order Created",
      date: new Date(order.createdAt).toLocaleDateString(),
      location: order.shippingAddress || "",
      key: "Pending",
    },
    {
      label: "Processing",
      date: status === "Processing" ? "Updating..." : "",
      location: "",
      key: "Processing",
    },
    {
      label: "Shipped",
      date: "",
      location: "",
      key: "Shipped",
    },
    {
      label: "Delivered",
      date: "",
      location: "",
      key: "Delivered",
    },
  ];

  const checkCompleted = (stepKey: string) => {
    const levels: any = { Pending: 0, Processing: 1, Shipped: 2, Delivered: 3, Completed: 4 };
    const currentLevel = levels[status as string] || 0;
    const stepLevel = levels[stepKey] || 0;
    return stepLevel <= currentLevel;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders #ORD-2025</Text>
        <View style={{ width: 24 }} />
      </View> */}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#181725" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Orders #ORD-2025</Text>

        {/* Added Download Button */}
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => router.push({
            pathname: "/(user_screen)/ExportInvoiceScreen",
            params: { id: order._id || order.id }
          })}
        >
          <Ionicons name="download-outline" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <View style={styles.card}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: order.buyer?.avatar || order.user?.avatar || "https://i.pravatar.cc/100" }}
              style={styles.avatar}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.userName}>{order.buyer?.name || order.user?.name || "Customer"}</Text>
              <Text style={styles.userId}>ID: {order.buyer?._id || order.user?._id || "N/A"}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.messageBtn}
            onPress={() => {
              const partnerId = order.vendorId?.userId || order.vendor?.userId || order.vendorId?._id || order.vendorId?.id || order.vendor?._id || order.vendor?.id || order.vendorId;
              if (partnerId) {
                router.push({
                  pathname: "/chat_box",
                  params: {
                    partnerId: partnerId,
                    fullname: order.vendorId?.businessName || order.vendorId?.storename || order.vendorId?.fullName || "Vendor"
                  }
                });
              } else {
                alert("Vendor information not available for chat");
              }
            }}
          >
            <Ionicons name="chatbubble-outline" size={18} color="#333" />
            <Text style={styles.messageBtnText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Order Items */}
        <Text style={styles.sectionTitle}>Order items</Text>
        <View style={styles.card}>
          {orderItems.map((item: any, idx: number) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                idx !== orderItems.length - 1 && styles.borderBottom,
              ]}
            >
              <Image
                source={{ uri: item.product?.images?.[0] || "https://via.placeholder.com/100" }}
                style={styles.itemImg}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemTitle}>{item.product?.name || item.product?.title || "Product"}</Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                </View>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemDesc} numberOfLines={2}>
                    {item.product?.description || ""}
                  </Text>
                  <Text style={styles.itemQty}>x{item.quantity}</Text>
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
            <Text style={styles.summaryValue}>${order.totalPrice?.toFixed(2)}</Text>
          </View>
          <View style={styles.dashedLine} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Grand total</Text>
            <Text style={styles.totalValue}>${order.totalPrice?.toFixed(2)}</Text>
          </View>
          <View style={styles.paidBadge}>
            <Text style={styles.paidText}>{order.status === 'Pending' ? 'Unpaid' : 'Paid'}</Text>
            <Text style={styles.paidSubText}>Via {order.paymentMethod || "Credit Card"}</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#F7FAF9",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#181725",
  },
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
  downloadButton: {
    backgroundColor: "#3B8C8C", // The teal color from your UI
    width: 45,
    height: 45,
    borderRadius: 22.5, // Makes it a perfect circle
    justifyContent: "center",
    alignItems: "center",
  },
  doneBtnText: { color: "#FFF", fontWeight: "bold" },
});

export default OrderDetails;
