
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const { width } = Dimensions.get("window");

const MyCart: React.FC = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 1. Modal state define kora hoyeche
  const [isModalVisible, setIsModalVisible] = useState(false);

  const loadCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem("userCart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const TAX_RATE: number = 0.075;
  const SHIPPING_FEE: number = 0.6;

  const updateQuantity = async (id: string, type: "inc" | "dec") => {
    const newCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQty =
          type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(newCart);
    await AsyncStorage.setItem("userCart", JSON.stringify(newCart));
  };

  const removeItem = async (id: string) => {
    const newCart = cartItems.filter((item) => item.id !== id);
    setCartItems(newCart);
    await AsyncStorage.setItem("userCart", JSON.stringify(newCart));
  };

  const subtotal: number = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax: number = subtotal * TAX_RATE;
  const total: number = subtotal + tax + SHIPPING_FEE;

  // 2. Checkout handle korar function
  const handleConfirmPurchase = () => {
    setIsModalVisible(false);
    router.push("/(users)/Information" as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* 3. Modal Design (Image onujayi) */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Are you sure you want to buy this product?
            </Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.noBtn}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.noBtnText}>NO</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.yesBtn}
                onPress={handleConfirmPurchase}
              >
                <Text style={styles.yesBtnText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartCard}>
            <View style={styles.itemMainRow}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImg}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                <View style={styles.actionRow}>
                  <View style={styles.stepper}>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, "dec")}
                      style={styles.stepBtn}
                    >
                      <Text style={styles.stepText}>—</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, "inc")}
                      style={styles.stepBtn}
                    >
                      <Text style={[styles.stepText, { fontSize: 22 }]}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeItem(item.id)}
                    style={styles.deleteBtn}
                  >
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={22}
                      color="#FF6B6B"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.summaryCard}>
          <View style={styles.promoBox}>
            <Text style={styles.promoText}>YYt34uri</Text>
            <View style={styles.promoApplied}>
              <Text style={styles.appliedText}>Promo code applied</Text>
              <Ionicons name="checkmark-circle" size={18} color="#349488" />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Payment details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Subtotal</Text>
            <Text style={styles.detailValue}>${subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tax(7.5%)</Text>
            <Text style={styles.detailValue}>${tax.toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Shipping</Text>
            <Text style={styles.detailValue}>${SHIPPING_FEE.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => setIsModalVisible(true)} // Modal open hobe
          >
            <Text style={styles.checkoutBtnText}>
              Checkout (${total.toFixed(2)})
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (Apnar baki styles thakbe)
  safeArea: { flex: 1, backgroundColor: "#F8FBFB" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 60,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  scrollContent: { padding: 16 },
  cartCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  itemMainRow: { flexDirection: "row" },
  imageWrapper: {
    width: 90,
    height: 90,
    backgroundColor: "#E8F3F2",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  productImg: { width: "80%", height: "80%" },
  itemDetails: { flex: 1, marginLeft: 15, justifyContent: "space-between" },
  itemName: { fontSize: 16, fontWeight: "600", color: "#333" },
  itemPrice: { fontSize: 16, fontWeight: "bold", color: "#349488" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F6F5",
    borderRadius: 10,
    paddingHorizontal: 4,
    height: 38,
  },
  stepBtn: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  stepText: { color: "#349488", fontSize: 18, fontWeight: "600" },
  qtyText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  deleteBtn: { backgroundColor: "#FFF0F0", padding: 8, borderRadius: 8 },
  summaryCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  promoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
  },
  promoText: { fontSize: 16, color: "#333", fontWeight: "500" },
  promoApplied: { flexDirection: "row", alignItems: "center" },
  appliedText: { color: "#349488", fontSize: 13, marginRight: 6 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailLabel: { fontSize: 15, color: "#666" },
  detailValue: { fontSize: 15, fontWeight: "bold", color: "#333" },
  divider: {
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#DDD",
    marginVertical: 15,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  totalLabel: { fontSize: 18, fontWeight: "bold", color: "#333" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#333" },
  checkoutBtn: {
    backgroundColor: "#349488",
    borderRadius: 15,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  checkoutBtnText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },

  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 28,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  noBtn: {
    flex: 1,
    height: 50,
    borderWidth: 1.5,
    borderColor: "#FF6B6B",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  noBtnText: {
    color: "#FF6B6B",
    fontSize: 18,
    fontWeight: "600",
  },
  yesBtn: {
    flex: 1,
    height: 50,
    backgroundColor: "#349488",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  yesBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default MyCart;
