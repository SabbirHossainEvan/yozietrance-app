import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
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
    price: "$20.00",
    rating: 4.4,
    reviews: "1,256",
    image: require("../../assets/users/Mask group.png"),
  },
  {
    id: "2",
    title: "USB Keyboard",
    price: "$20.00",
    rating: 4.4,
    reviews: "1,256",
    image: require("../../assets/users/Mask group (1).png"),
  },
  {
    id: "3",
    title: "Wireless Earbuds",
    price: "$20.00",
    rating: 4.4,
    reviews: "1,256",
    image: require("../../assets/users/Mask group (2).png"),
  },
  {
    id: "4",
    title: "Power Bank",
    price: "$20.00",
    rating: 4.4,
    reviews: "1,256",
    image: require("../../assets/users/Mask group (3).png"),
  },
];

const ElectronicsScreen = () => {
  const router = useRouter();
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});

  const loadAddedItems = async () => {
    try {
      const cartData = await AsyncStorage.getItem("userCart");
      if (cartData) {
        const cartItems = JSON.parse(cartData);
        const addedMap: { [key: string]: boolean } = {};
        cartItems.forEach((item: any) => {
          addedMap[item.id] = true;
        });
        setAddedItems(addedMap);
      }
    } catch (error) {
      console.log("Error loading cart for UI sync:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAddedItems();
    }, []),
  );

  const addToCart = async (product: any) => {
    try {
      // 1. Get existing cart
      const existingCart = await AsyncStorage.getItem("userCart");
      let cart = existingCart ? JSON.parse(existingCart) : [];

      // 2. Check if item exists
      const existingItemIndex = cart.findIndex(
        (item: any) => item.id === product.id,
      );

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        // New Item
        cart.push({
          id: product.id,
          name: product.title,
          price: parseFloat(product.price.replace("$", "")),
          quantity: 1,
          image: Image.resolveAssetSource(product.image).uri,
        });
      }

      // 3. Save back to storage
      await AsyncStorage.setItem("userCart", JSON.stringify(cart));

      // 4. Update UI state
      setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Electronics</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar Section */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput
          placeholder="Search Product.."
          style={styles.searchInput}
          placeholderTextColor="#888"
        />
      </View>

      {/* Product Grid List */}
      <FlatList
        data={PRODUCTS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listPadding}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push("/(user_screen)/ProductDetails")}
          >
            {/* Light Blue Image Container */}
            <View style={styles.imageBox}>
              <Image
                source={item.image}
                style={styles.img}
                resizeMode="contain"
              />
            </View>

            {/* Product Title */}
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>

            {/* Rating Section */}
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FFB800" />
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Text style={styles.reviews}>({item.reviews} reviews)</Text>
            </View>

            {/* Price and Circular Add Button */}
            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.priceText}>
                  {item.price}
                  <Text style={styles.unitText}> /unit</Text>
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.addButton,
                  addedItems[item.id] && { backgroundColor: "#E0F2F1" },
                ]}
                onPress={() => addToCart(item)}
              >
                {addedItems[item.id] ? (
                  <Ionicons name="checkmark" size={24} color="#2A8383" />
                ) : (
                  <Ionicons name="add" size={24} color="#333" />
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 2,
    alignItems: "center",
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  listPadding: { padding: 16 },
  columnWrapper: { justifyContent: "space-between" },

  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  imageBox: {
    height: 130,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  img: { width: "100%", height: "100%" },
  title: {
    fontWeight: "bold",
    marginTop: 12,
    fontSize: 16,
    color: "#2D3E33",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
    color: "#333",
  },
  reviews: {
    fontSize: 13,
    color: "#999",
    marginLeft: 4,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  unitText: {
    fontSize: 12,
    color: "#888",
    fontWeight: "normal",
  },
  addButton: {
    backgroundColor: "#F2F2F2",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ElectronicsScreen;
