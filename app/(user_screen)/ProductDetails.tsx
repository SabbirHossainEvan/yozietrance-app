import { router } from "expo-router";
import React, { useState } from "react";
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

// Star Component for Reviews
const StarRating = ({ rating = 5 }) => (
  <View style={styles.starRow}>
    {[...Array(rating)].map((_, i) => (
      <Text key={i} style={styles.star}>
        ★
      </Text>
    ))}
  </View>
);

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Blue");

  const productData: { [key: string]: { image: any; bg: string } } = {
    Black: {
      image: {
        uri: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      },
      bg: "#F2F2F2",
    },
    White: {
      image: {
        uri: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
      },
      bg: "#FFFFFF",
    },
    Blue: {
      image: { uri: "https://i.ibb.co/Vp6Yj7v/headphones.png" },
      bg: "#E8F3F2",
    },
  };

  const unitPrice = 3.44;

  const specs = [
    { label: "Brand", value: "JBL" },
    { label: "Model", value: "Tune 720BT" },
    { label: "Connectivity", value: "Bluetooth | Charging cable" },
    { label: "Bluetooth", value: "5.3" },
    { label: "Weight", value: "220g" },
    { label: "Size", value: "40mm" },
    { label: "Charging time", value: "2 hours from empty" },
    { label: "Playtime", value: "Up to 76 hours" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View
            style={[
              styles.imageContainer,
              { backgroundColor: productData[selectedColor].bg },
            ]}
          >
            <Image
              source={productData[selectedColor].image}
              style={styles.productImg}
              resizeMode="contain"
            />
            <View style={styles.pagination}>
              <View
                style={[
                  styles.dot,
                  selectedColor === "Blue" ? styles.activeDot : null,
                ]}
              />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.mainTitle}>
                Wireless Noise-Canceling{"\n"}Headphones
              </Text>
              <View style={styles.stockBadge}>
                <Text style={styles.stockText}>● IN STOCK</Text>
              </View>
            </View>
            <Text style={styles.skuText}>SKU: EC-100</Text>
            <Text style={styles.priceText}>${unitPrice.toFixed(2)}</Text>
          </View>

          {/* Description Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              Industry-leading noise-canceling with Dual Noise Sensor
              technology. Next-level music with Edge-AI, co-developed with Sony
              Music Studios Tokyo. Up to 30-hour battery life with quick
              charging (10 min charge for 5 hours of playback).
            </Text>
          </View>

          {/* Specification Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Specification</Text>
            {specs.map((item, index) => (
              <View key={index} style={styles.specRow}>
                <Text style={styles.specLabel}>{item.label}</Text>
                <Text style={styles.specValueText}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Quantity Section */}
          <Text style={styles.sectionLabel}>Quantity</Text>
          <View style={styles.quantityRow}>
            <View style={styles.stepper}>
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.stepBtn}>—</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                <Text style={styles.stepBtn}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.couponBox}>
              <TextInput
                placeholder="Add Coupon"
                style={styles.couponInput}
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.applyBtn}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Color Selection */}
          <Text style={styles.sectionLabel}>Color</Text>
          <View style={styles.colorOptions}>
            {["Black", "White", "Blue"].map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setSelectedColor(c)}
                style={[
                  styles.colorChip,
                  selectedColor === c && styles.activeChip,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedColor === c && styles.activeChipText,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Buttons */}
          <TouchableOpacity style={styles.outlineBtn}>
            <Text
              style={styles.outlineBtnText}
              onPress={() => router.push("/(user_screen)/ChatDetailsScreen")}
            >
              💬 Ask Vendor
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push("/(users)/Information")}
          >
            <Text style={styles.primaryBtnText}>
              Buy ${(unitPrice * quantity).toFixed(2)}
            </Text>
          </TouchableOpacity>

          {/* Reviews Section */}
          <View style={styles.reviewList}>
            <Text style={styles.cardTitle}>Reviews</Text>
            {[
              {
                name: "Darrell Steward",
                date: "12/04/21",
                comment:
                  "His music helped me prepare for my math exams, long sessions were easy. Her techniques and practice sessions are very effective.",
              },
              {
                name: "Albert Flores",
                date: "10/04/21",
                comment:
                  "The always found math boring and hard, but she made it fun with games, and visual explanations.",
              },
              {
                name: "Ronald Richards",
                date: "10/04/21",
                comment:
                  "I used to struggle so much with Algebra, but after just a few sessions with Sarah, everything started making sense.",
              },
            ].map((review, i) => (
              <View key={i} style={styles.reviewItem}>
                <View style={styles.reviewerHeader}>
                  <View style={styles.avatar} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                      <Text style={styles.reviewerName}>{review.name}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                    <StarRating />
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 50,
  },
  backArrow: { fontSize: 35, color: "#444" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  container: { padding: 16 },
  imageContainer: {
    borderRadius: 24,
    height: 280,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  productImg: { width: "85%", height: "85%" },
  pagination: { flexDirection: "row", position: "absolute", bottom: 15 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C4C4C4",
    marginHorizontal: 4,
  },
  activeDot: { backgroundColor: "#349488", width: 22 },
  titleSection: { marginBottom: 20 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    lineHeight: 26,
  },
  stockBadge: {
    backgroundColor: "#E8F5F3",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  stockText: { color: "#349488", fontSize: 10, fontWeight: "800" },
  skuText: { color: "#999", fontSize: 14, marginTop: 5 },
  priceText: {
    color: "#349488",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },
  descriptionText: { fontSize: 14, color: "#666", lineHeight: 22 },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F9F9F9",
  },
  specLabel: { color: "#888", fontSize: 14 },
  specValueText: { color: "#333", fontWeight: "600", fontSize: 14 },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 10,
  },
  quantityRow: { flexDirection: "row", marginBottom: 20 },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  stepBtn: { fontSize: 18, color: "#349488", padding: 10 },
  qtyText: { marginHorizontal: 15, fontWeight: "bold" },
  couponBox: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    overflow: "hidden",
  },
  couponInput: { flex: 1, paddingHorizontal: 15, fontSize: 14 },
  applyBtn: {
    backgroundColor: "#349488",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  applyText: { color: "#FFF", fontWeight: "bold" },
  colorOptions: { flexDirection: "row", gap: 12, marginBottom: 25 },
  colorChip: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  activeChip: { borderColor: "#349488", backgroundColor: "#E8F3F2" },
  chipText: { color: "#666" },
  activeChipText: { color: "#349488", fontWeight: "bold" },
  outlineBtn: {
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#349488",
    alignItems: "center",
    marginBottom: 12,
  },
  outlineBtnText: { color: "#349488", fontWeight: "bold", fontSize: 16 },
  primaryBtn: {
    padding: 18,
    borderRadius: 15,
    backgroundColor: "#349488",
    alignItems: "center",
    marginBottom: 30,
  },
  primaryBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 18 },
  reviewItem: { marginBottom: 25 },
  reviewerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#E0E0E0",
    marginRight: 12,
  },
  reviewList: {
    marginTop: 10,
    marginBottom: 30,
  },

  reviewerName: { fontWeight: "bold", fontSize: 15 },
  reviewDate: { color: "#AAA", fontSize: 11 },
  reviewComment: { color: "#666", fontSize: 14, lineHeight: 20 },
  starRow: { flexDirection: "row", marginTop: 2 },
  star: { color: "#FFB100", fontSize: 14 },
});

export default ProductDetails;
