import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Teal");
  const [coupon, setCoupon] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const productImages = [
    "https://i.ibb.co/Vp6Yj7v/headphones.png",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
  ];

  const specs = [
    { label: "Brand", value: "JBL" },
    { label: "Model", value: "Tune 720BT" },
    { label: "Connectivity", value: "Bluetooth | Charging cable" },
    { label: "Bluetooth", value: "5.3" },
    { label: "Colors", value: "2 Options", isColor: true },
    { label: "Weight", value: "220g" },
    { label: "Size", value: "40mm" },
    { label: "Charging time", value: "2 hours from empty" },
    { label: "Playtime", value: "Up to 76 hours" },
  ];

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const cardWidth = width - 40;
    const newIndex = Math.round(scrollPosition / cardWidth);
    setActiveIndex(newIndex);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FBF9" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FBF9" />
      {/* Floating Chat Button */}
      <TouchableOpacity onPress={() => router.push("/(screens)/chat_box")} style={{ position: 'absolute', bottom: 30, zIndex: 9999, right: 15, backgroundColor: "#FFF", width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center", elevation: 4, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, borderWidth: 1, borderColor: "#2D8C8C" }}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#2D8C8C" />
      </TouchableOpacity>
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 10 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#333" }}>Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Product Image Carousel */}
        <View style={{ backgroundColor: "#ADD8D6", borderRadius: 20, height: 250, justifyContent: "center", alignItems: "center", marginBottom: 20, position: "relative" }}>
          <FlatList
            data={productImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ width: width - 40, height: 250, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={{ uri: item }}
                  style={{ width: "70%", height: "70%" }}
                  resizeMode="contain"
                />
              </View>
            )}
          />

          {/* Pagination Dots */}
          <View style={{ flexDirection: "row", position: "absolute", bottom: 15 }}>
            {productImages.map((_, index) => (
              <View
                key={index}
                style={[
                  { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.5)", marginHorizontal: 3 },
                  activeIndex === index && { backgroundColor: "#2D8C8C" }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Title & Rating */}
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 8 }}>Wireless Noise-Canceling Headphones</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
          <View style={{ flexDirection: "row", marginRight: 8 }}>
            {[1, 2, 3, 4].map((i) => (
              <Ionicons key={i} name="star" size={14} color="#FFD700" />
            ))}
            <Ionicons name="star-half" size={14} color="#FFD700" />
          </View>
          <Text style={{ fontSize: 12, fontWeight: "bold", color: "#333" }}>
            4.8 <Text style={{ fontWeight: "400", color: "#777", textDecorationLine: "underline" }}>(5,387 reviews)</Text>
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Sku: EC-100</Text>

        {/* Price */}
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#2D8C8C", marginBottom: 10 }}>$3.44</Text>

        {/* Description */}
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6 }}>Description</Text>
        <Text style={{ fontSize: 13, color: "#666", lineHeight: 20, marginBottom: 20 }}>
          Industry-leading noise canceling with Dual Noise Sensor technology. Next-
          level music with Edge-AI, co-developed with Sony Music Studios Tokyo. Up to
          30-hour battery life with quick charging (10 min charge for 5 hours of
          playback).
        </Text>

        {/* Specification Card */}
        <View style={{ marginBottom: 25, position: 'relative', marginTop: 10 }}>
          <View style={{ backgroundColor: "#FFF", borderRadius: 16, padding: 16, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } }}>
            <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 15, color: "#333" }}>Specification</Text>
            {specs.map((item, index) => (
              <View key={index} style={[
                { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F0F0F0", alignItems: "center" },
                index === specs.length - 1 && { borderBottomWidth: 0 }
              ]}>
                <Text style={{ fontSize: 13, color: "#555", flex: 1 }}>{item.label}</Text>
                {item.isColor ? (
                  <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <View style={{ width: 12, height: 12, borderRadius: 6, marginLeft: 6, backgroundColor: "#2D8C8C" }} />
                    <View style={{ width: 12, height: 12, borderRadius: 6, marginLeft: 6, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#DDD" }} />
                    <Text style={{ fontSize: 13, fontWeight: "600", color: "#333", textAlign: "right" }}> {item.value}</Text>
                  </View>
                ) : (
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#333", textAlign: "right" }}>{item.value}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Color Selection */}
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 10 }}>Color</Text>
        <View style={{ flexDirection: "row", marginBottom: 20, gap: 12 }}>
          <TouchableOpacity
            onPress={() => setSelectedColor("Black")}
            style={[{ width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: "transparent", backgroundColor: "black" }, selectedColor === "Black" && { borderWidth: 2, borderColor: "#2D8C8C" }]}
          />
          <TouchableOpacity
            onPress={() => setSelectedColor("Teal")}
            style={[{ width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: "transparent", backgroundColor: "#6FA4A4" }, selectedColor === "Teal" && { borderWidth: 2, borderColor: "#2D8C8C" }]}
          />
          <TouchableOpacity
            onPress={() => setSelectedColor("White")}
            style={[{ width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: "transparent", backgroundColor: "white" }, selectedColor === "White" && { borderWidth: 2, borderColor: "#2D8C8C" }]}
          />
        </View>

        {/* Quantity */}
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}>

          <Text style={{ fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 30 }}>Quantity</Text>
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#EFF4F4", width: 120, borderRadius: 8, justifyContent: "space-between", padding: 4 }}>
              <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: 32, height: 32, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF", borderRadius: 6, shadowColor: "#000", shadowOpacity: 0.05, elevation: 1 }}>
                <Text style={{ fontSize: 18, color: "#2D8C8C", fontWeight: "bold" }}>—</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: "#2D8C8C" }}>{quantity}</Text>
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={{ width: 32, height: 32, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF", borderRadius: 6, shadowColor: "#000", shadowOpacity: 0.05, elevation: 1 }}>
                <Text style={{ fontSize: 18, color: "#2D8C8C", fontWeight: "bold" }}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 10, color: "#FF6B6B", marginTop: 6 }}>Minimum order quantity: 10</Text>
          </View>
        </View>

        {/* Coupon */}
        <View style={{ flexDirection: "row", marginBottom: 20, gap: 10 }}>
          <TextInput
            placeholder="Add Coupon"
            value={coupon}
            onChangeText={setCoupon}
            style={{ flex: 1, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 8, paddingHorizontal: 15, height: 44 }}
          />
          <TouchableOpacity style={{ backgroundColor: "#2D8C8C", borderRadius: 8, paddingHorizontal: 20, justifyContent: "center", alignItems: "center", height: 44 }}>
            <Text style={{ color: "#FFF", fontWeight: "600", fontSize: 14 }}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          onPress={() => router.push("/cart")}
          style={{ borderWidth: 1.5, borderColor: "#2D8C8C", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 12 }}>
          <Text style={{ color: "#2D8C8C", fontWeight: "700", fontSize: 16 }}>Add To Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ backgroundColor: "#2D8C8C", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 30 }}>
          <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 16 }}>Buy $3.44</Text>
        </TouchableOpacity>

        {/* Reviews */}
        <View style={{ marginBottom: 20 }}>
          {/* Review 1 */}
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", marginBottom: 8 }}>
              <Image source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: "#333" }}>Darrell Steward</Text>
                  <Text style={{ fontSize: 12, color: "#999" }}>12/04/25</Text>
                </View>
                <View style={{ flexDirection: "row", marginRight: 8 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Ionicons key={i} name="star" size={12} color="#FFD700" />
                  ))}
                </View>
              </View>
            </View>
            <Text style={{ fontSize: 13, color: "#555", lineHeight: 18 }}>
              Ms. Sarah helped me prepare for my IB math exams, I improved from a 4 to a 6! Her techniques and practice sessions are very effective.
            </Text>
          </View>

          {/* Review 2 */}
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", marginBottom: 8 }}>
              <Image source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: "#333" }}>Albert Flores</Text>
                  <Text style={{ fontSize: 12, color: "#999" }}>10/04/25</Text>
                </View>
                <View style={{ flexDirection: "row", marginRight: 8 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Ionicons key={i} name="star" size={12} color="#FFD700" />
                  ))}
                </View>
              </View>
            </View>
            <Text style={{ fontSize: 13, color: "#555", lineHeight: 18 }}>
              I've always found math boring and hard, but she made it fun with games, and visual explanations.
            </Text>
          </View>

          {/* Review 3 */}
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", marginBottom: 8 }}>
              <Image source={{ uri: "https://randomuser.me/api/portraits/men/45.jpg" }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: "#333" }}>Ronald Richards</Text>
                  <Text style={{ fontSize: 12, color: "#999" }}>10/04/25</Text>
                </View>
                <View style={{ flexDirection: "row", marginRight: 8 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Ionicons key={i} name="star" size={12} color="#FFD700" />
                  ))}
                </View>
              </View>
            </View>
            <Text style={{ fontSize: 13, color: "#555", lineHeight: 18 }}>
              I used to struggle so much with algebra, but after just a few sessions with Sarah, everything started making sense.
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetails;