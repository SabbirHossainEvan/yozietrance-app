import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 48) / 2;

// Dummy Data
const categories = [
  {
    id: "1",
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=500",
  },
  {
    id: "2",
    name: "Clothing",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=500",
  },
  {
    id: "3",
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500",
  },
  {
    id: "4",
    name: "Footwear",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500",
  },
  {
    id: "5",
    name: "Groceries",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500",
  },
  {
    id: "6",
    name: "Gadgets",
    image:
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=500",
  },
];

const ProductScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/(screens)/addCategory")}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search by Category"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      {/* Categories Grid */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {categories.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.catImage} />
              </View>
              <TouchableOpacity
                style={styles.nameBadge}
                onPress={() => router.replace("/(tabs)/electronics-products")}
              >
                <Text style={styles.catName}>{item.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Sub-component for Bottom Tab

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBFB" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#333" },
  iconBtn: { padding: 5 },
  addBtn: {
    backgroundColor: "#349488",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: "#E8F3F2",
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: "#333" },
  scrollContent: { paddingBottom: 100 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  card: {
    width: COLUMN_WIDTH,
    marginBottom: 20,
  },
  imageContainer: {
    width: "100%",
    height: 120,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#EEE",
  },
  catImage: { width: "100%", height: "100%", resizeMode: "cover" },
  nameBadge: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#349488",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#F0F9F8",
  },
  catName: { color: "#349488", fontWeight: "600", fontSize: 14 },
  bottomTab: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    position: "absolute",
    bottom: 0,
    width: "100%",
    justifyContent: "space-around",
    paddingBottom: 25, // For iPhone home indicator
  },
  tabItem: { alignItems: "center" },
  tabLabel: { fontSize: 12, color: "#666", marginTop: 4 },
  activeTabLabel: { color: "#349488", fontWeight: "bold" },
  activeIndicator: {
    width: 25,
    height: 3,
    backgroundColor: "#349488",
    marginTop: 4,
    borderRadius: 2,
  },
});

export default ProductScreen;
