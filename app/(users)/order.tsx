import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

export const DUMMY_ORDERS = [
  {
    id: "1",
    orderNo: "#ORD-2025",
    status: "Processing",
    price: 259.0,
    address: "6391 Elgin St. Celina, Delaware 10299",
    rating: "4.8 (1.2k)",
    customer: "Alice freeman",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    itemSummary: "4 items • Wireless Headphones 3x...",
  },
  {
    id: "2",
    orderNo: "#ORD-2026",
    status: "Pending",
    price: 150.0,
    address: "6391 Elgin St. Celina, Delaware 10299",
    rating: "4.5 (800)",
    customer: "John Doe",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    itemSummary: "2 items • Smart Watch 1x...",
  },
  {
    id: "3",
    orderNo: "#ORD-2027",
    status: "Delivered",
    price: 320.0,
    address: "6391 Elgin St. Celina, Delaware 10299",
    rating: "4.9 (2.1k)",
    customer: "Sarah Smith",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    itemSummary: "1 item • Laptop Stand 1x...",
  },
  {
    id: "4",
    orderNo: "#ORD-2028",
    status: "Shipped",
    price: 89.0,
    address: "6391 Elgin St. Celina, Delaware 10299",
    rating: "4.7 (1.5k)",
    customer: "Mike Ross",
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb",
    itemSummary: "3 items • Bluetooth Speaker 2x...",
  },
  {
    id: "5",
    orderNo: "#ORD-2029",
    status: "Canceled",
    price: 45.0,
    address: "6391 Elgin St. Celina, Delaware 10299",
    rating: "4.2 (500)",
    customer: "Emily Blunt",
    image: "https://images.unsplash.com/photo-1581094794329-e8f4acd3d9b7",
    itemSummary: "1 item • Mouse 1x...",
  },
];

export default function OrdersScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Delivered", "Processing", "Shipped", "Canceled"];

  const filteredOrders =
    activeFilter === "All"
      ? DUMMY_ORDERS
      : DUMMY_ORDERS.filter((o) => o.status === activeFilter);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Processing":
        return { bg: "#E8F2FF", text: "#2F80ED" };
      case "Delivered":
        return { bg: "#E8F9EE", text: "#27AE60" };
      case "Shipped":
        return { bg: "#F2E8FF", text: "#9B51E0" };
      case "Canceled":
        return { bg: "#FFE8E8", text: "#EB5757" };
      default:
        return { bg: "#FFF4E8", text: "#F2994A" };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput placeholder="Search......" style={styles.searchInput} />
      </View>

      <View style={{ height: 50, marginBottom: 10 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveFilter(item)}
              style={[
                styles.filterBtn,
                activeFilter === item && styles.filterBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item && { color: "#FFF" },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/OrderDetails",
                params: { status: item.status },
              })
            }
          >
            <View style={styles.cardTop}>
              <Image
                source={{
                  uri: "https://xsgames.co/randomusers/assets/avatars/male/74.jpg",
                }}
                style={styles.img}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.row}>
                  <Text style={styles.orderNo}>{item.orderNo}</Text>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: getStatusStyle(item.status).bg },
                    ]}
                  >
                    <Text
                      style={{
                        color: getStatusStyle(item.status).text,
                        fontSize: 10,
                        fontWeight: "700",
                      }}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.address}>{item.address}</Text>
                <View style={styles.row}>
                  <Ionicons name="star" size={14} color="#FFB400" />
                  <Text style={styles.rating}>{item.rating}</Text>
                </View>
              </View>
            </View>
            <View style={styles.cardBottom}>
              <Text style={styles.customer}>{item.customer}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBF9" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    margin: 15,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  searchInput: { marginLeft: 10, flex: 1 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFF",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#EEE",
    justifyContent: "center",
  },
  filterBtnActive: { backgroundColor: "#2A8383", borderColor: "#2A8383" },
  filterText: { color: "#666", fontSize: 14 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  cardTop: { flexDirection: "row" },
  img: { width: 60, height: 60, borderRadius: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNo: { fontWeight: "bold", fontSize: 16 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  address: { fontSize: 12, color: "#999", marginVertical: 4 },
  rating: { fontSize: 12, marginLeft: 4, color: "#666" },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  customer: { color: "#2A8383", fontWeight: "600" },
  price: { fontWeight: "bold", color: "#2A8383", fontSize: 16 },
});
