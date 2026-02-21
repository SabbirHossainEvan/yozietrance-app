import { useAddToCartMutation } from "@/store/api/cartApiSlice";
import { useCreateOrderMutation } from "@/store/api/orderApiSlice";
import { useGetProductByIdQuery } from "@/store/api/product_api_slice";
import { useCreateReviewMutation, useGetProductReviewsQuery } from "@/store/api/reviewApiSlice";
import { RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

const ProductDetails = () => {
  const router = useRouter();
  const { id, productId } = useLocalSearchParams();
  const actualId = (id || productId) as string;
  const { data: product, isLoading, error } = useGetProductByIdQuery(actualId, { skip: !actualId });
  const { data: reviewsData, isLoading: isReviewsLoading } = useGetProductReviewsQuery(
    { productId: actualId },
    { skip: !actualId }
  );
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [createReview, { isLoading: isSubmittingReview }] = useCreateReviewMutation();
  const user = useSelector((state: RootState) => state.auth.user);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Teal");
  const [coupon, setCoupon] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // Review Modal State
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");

  const reviews = reviewsData?.data?.reviews || [];
  const totalReviews = reviewsData?.data?.meta?.total || 0;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : (product?.rating?.toFixed(1) || "0.0");

  const handleReviewSubmit = async () => {
    if (!user) {
      Alert.alert("Error", "Please login to submit a review");
      return;
    }
    if (!userComment.trim()) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }

    try {
      await createReview({
        productId: actualId,
        rating: userRating,

      }).unwrap();
      Alert.alert("Success", "Review submitted successfully!");
      setIsReviewModalVisible(false);
      setUserComment("");
      setUserRating(5);
    } catch (err: any) {
      Alert.alert("Error", err?.data?.message || "Failed to submit review");
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (!user) {
      Alert.alert("Error", "Please login to place an order");
      return;
    }

    try {
      const orderData = {
        vendorId: product.vendorId || product.vendor?._id || product.vendor,
        orderItems: [
          {
            product: product._id || product.id,
            quantity: quantity,
            price: product.price
          }
        ],
        shippingAddress: "Default Shipping Address", // User should provide this in a real app
        totalPrice: product.price * quantity,
      };

      const result = await createOrder(orderData).unwrap();
      Alert.alert("Success", "Order placed successfully!", [
        { text: "OK", onPress: () => router.push("/(users)/order") }
      ]);
    } catch (err: any) {
      Alert.alert("Error", err?.data?.message || "Failed to place order");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FBF9' }}>
        <ActivityIndicator size="large" color="#2D8C8C" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FBF9' }}>
        <Text>Product not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#2D8C8C' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const productImages = product.images?.length > 0 ? product.images : ["https://i.ibb.co/Vp6Yj7v/headphones.png"];

  const specs = product.specification ? Object.entries(product.specification).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    value: Array.isArray(value) ? value.join(", ") : String(value),
  })) : [];

  // Extract colors from product if available
  const productColors = product.colors || product.specification?.colors || [];
  const hasColors = Array.isArray(productColors) && productColors.length > 0;

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const cardWidth = width - 40;
    const newIndex = Math.round(scrollPosition / cardWidth);
    setActiveIndex(newIndex);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FBF9" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FBF9" />
      {/* Floating Review Button */}
      <TouchableOpacity
        onPress={() => {
          if (!user) {
            Alert.alert("Login Required", "Please login to give a review");
            return;
          }
          setIsReviewModalVisible(true);
        }}
        style={{ position: 'absolute', bottom: 30, zIndex: 9999, right: 15, backgroundColor: "#FFF", width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center", elevation: 4, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, borderWidth: 1, borderColor: "#2D8C8C" }}>
        <Ionicons name="star-outline" size={24} color="#2D8C8C" />
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
            keyExtractor={(item: string, index: number) => index.toString()}
            renderItem={({ item }: { item: string }) => (
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
            {productImages.map((_: string, index: number) => (
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
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 8 }}>{product.title || product.name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
          <View style={{ flexDirection: "row", marginRight: 8 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons key={i} name="star" size={14} color={i <= (product.rating || 0) ? "#FFD700" : "#E0E0E0"} />
            ))}
          </View>
          <Text style={{ fontSize: 12, fontWeight: "bold", color: "#333" }}>
            {avgRating} <Text style={{ fontWeight: "400", color: "#777", textDecorationLine: "underline" }}>({totalReviews} reviews)</Text>
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Sku: {product.sku || "N/A"}</Text>

        {/* Price */}
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#2D8C8C", marginBottom: 10 }}>${product.price}</Text>

        {/* Description */}
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6 }}>Description</Text>
        <Text style={{ fontSize: 13, color: "#666", lineHeight: 20, marginBottom: 20 }}>
          {product.description || "No description available."}
        </Text>

        {/* Specification Card - Only show if specs exist */}
        {specs.length > 0 && (
          <View style={{ marginBottom: 25, position: 'relative', marginTop: 10 }}>
            <View style={{ backgroundColor: "#FFF", borderRadius: 16, padding: 16, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } }}>
              <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 15, color: "#333" }}>Specification</Text>
              {specs.map((item, index) => (
                <View key={index} style={[
                  { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F0F0F0", alignItems: "center" },
                  index === specs.length - 1 && { borderBottomWidth: 0 }
                ]}>
                  <Text style={{ fontSize: 13, color: "#555", flex: 1 }}>{item.label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#333", textAlign: "right" }}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Color Selection - Only show if product has colors */}
        {hasColors && (
          <>
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
          </>
        )}

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
          onPress={async () => {
            if (!product) return;
            if (!user) {
              Alert.alert("Error", "Please login to add items to cart");
              return;
            }
            try {
              await addToCart({
                productId: product._id || product.id,
                quantity: quantity
              }).unwrap();
              Alert.alert("Success", "Product added to cart!", [
                { text: "OK", onPress: () => router.push("/(users)/cart") }
              ]);
            } catch (err: any) {
              Alert.alert("Error", err?.data?.message || "Failed to add to cart");
            }
          }}
          style={[{ borderWidth: 1.5, borderColor: "#2D8C8C", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 12 }, isAdding && { opacity: 0.7 }]}
          disabled={isAdding}
        >
          {isAdding ? <ActivityIndicator color="#2D8C8C" /> : <Text style={{ color: "#2D8C8C", fontWeight: "700", fontSize: 16 }}>Add To Cart</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buyBtn, isCreating && { opacity: 0.7 }]}
          onPress={handleBuyNow}
          disabled={isCreating}
        >
          {isCreating ? <ActivityIndicator color="white" /> : <Text style={styles.buyBtnText}>Buy ${product.price}</Text>}
        </TouchableOpacity>

        {/* Reviews */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 15 }}>Customer Reviews</Text>

          {isReviewsLoading ? (
            <ActivityIndicator color="#2D8C8C" style={{ marginVertical: 20 }} />
          ) : reviewsData?.data?.reviews && reviewsData.data.reviews.length > 0 ? (
            reviewsData.data.reviews.map((review: any) => (
              <View key={review._id} style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: "row", marginBottom: 8 }}>
                  <Image
                    source={{ uri: review.user?.profilePhotoUrl || "https://ui-avatars.com/api/?name=" + (review.user?.fullName || "User") }}
                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                  />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 14, fontWeight: "700", color: "#333" }}>{review.user?.fullName || "Unknown User"}</Text>
                      <Text style={{ fontSize: 12, color: "#999" }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 2 }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Ionicons key={i} name="star" size={12} color={i <= review.rating ? "#FFD700" : "#E0E0E0"} />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={{ fontSize: 13, color: "#555", lineHeight: 18 }}>
                  {review.comment}
                </Text>
              </View>
            ))
          ) : (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <Text style={{ color: '#777' }}>No reviews yet for this product.</Text>
            </View>
          )}
        </View>

      </ScrollView>

      {/* Review Modal */}
      <Modal
        visible={isReviewModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsReviewModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#333' }}>Give a Review</Text>
              <TouchableOpacity onPress={() => setIsReviewModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>Rating</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
                  <Ionicons
                    name={star <= userRating ? "star" : "star-outline"}
                    size={32}
                    color={star <= userRating ? "#FFD700" : "#E0E0E0"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>Comment</Text>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Tell us what you think about this product..."
              value={userComment}
              onChangeText={setUserComment}
              style={{ backgroundColor: '#F8FBF9', borderRadius: 12, padding: 15, height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#EEE', marginBottom: 24 }}
            />

            <TouchableOpacity
              onPress={handleReviewSubmit}
              disabled={isSubmittingReview}
              style={{ backgroundColor: '#2D8C8C', borderRadius: 12, paddingVertical: 14, alignItems: 'center', opacity: isSubmittingReview ? 0.7 : 1 }}
            >
              {isSubmittingReview ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>Submit Review</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buyBtn: {
    backgroundColor: "#2D8C8C",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 30,
  },
  buyBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default ProductDetails;