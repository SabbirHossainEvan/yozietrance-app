import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const PRODUCTS = [
  {
    id: "1",
    title: "Optical Mouse",
    price: "$3.44",
    rating: 4.4,
    reviews: "1,256",
    image: require("../../assets/users/Mask group.png"),
  },
  {
    id: "2",
    title: "USB Keyboard",
    price: "$3.44",
    rating: 4.4,
    reviews: "1,256",
    image: require("../../assets/users/Mask group (1).png"),
  },
  {
    id: "3",
    title: "Wireless Earbuds",
    price: "$3.44",
    rating: 4.4,
    reviews: "1,256",
    image: require("../../assets/users/Mask group (2).png"),
  },
  {
    id: "4",
    title: "Power Bank",
    price: "$3.44",
    rating: 4.4,
    reviews: "1,256",
    image: require("../../assets/users/Mask group (3).png"),
  },
  {
    id: "5",
    title: "Wireless Earbuds",
    price: "$3.44",
    rating: 4.4,
    reviews: "1,256",
    image: require("../../assets/users/Mask group (2).png"),
  },
  {
    id: "6",
    title: "Power Bank",
    price: "$3.44",
    rating: 4.4,
    reviews: "1,256",
    image: require("../../assets/users/Mask group (3).png"),
  },
];

const ElectronicsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Electronics</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchBar}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#888"
          style={{ marginTop: 10 }}
        />
        <TextInput
          placeholder="Search Product.."
          style={{ flex: 1, marginLeft: 10 }}
        />
      </View>

      <FlatList
        data={PRODUCTS}
        numColumns={2}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageBox}>
              <Image
                source={item.image}
                style={styles.img}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFB800" />
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Text style={styles.reviews}>({item.reviews})</Text>
            </View>
            <View style={styles.footer}>
              <View style={styles.priceTag}>
                <Text style={styles.price}>{item.price}</Text>
              </View>
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => router.replace("/(user_screen)/ProductDetails")}
              >
                <Text style={{ color: "#FFF", fontSize: 12 }}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAF8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    margin: 16,
    padding: 8,
    borderRadius: 25,
    elevation: 2,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 10,
    marginBottom: 16,
    elevation: 2,
  },
  imageBox: {
    height: 110,

    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  img: { width: "100%", height: "100%" },
  title: { fontWeight: "bold", marginTop: 10 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  ratingText: { fontSize: 12, fontWeight: "bold", marginLeft: 4 },
  reviews: { fontSize: 10, color: "#AAA", marginLeft: 2 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  priceTag: {
    borderWidth: 1,
    borderColor: "#4FB0A8",
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 3,
  },
  price: { color: "#4FB0A8", fontWeight: "bold" },
  viewBtn: {
    backgroundColor: "#4FB0A8",
    borderRadius: 12,
    paddingHorizontal: 26,
    paddingVertical: 6,
  },
});

export default ElectronicsScreen;
