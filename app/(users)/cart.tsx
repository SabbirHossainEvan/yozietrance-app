import { useGetCartQuery, useRemoveFromCartMutation, useUpdateCartItemMutation } from "@/store/api/cartApiSlice";
import { useTranslation } from "@/hooks/use-translation";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Image, Modal, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
  const { t } = useTranslation();
  const router = useRouter();
  const { data: cartData, isLoading, isError, refetch } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const cartItems = useMemo(() => {
    const rawItems = cartData?.data?.items || cartData?.items || (Array.isArray(cartData) ? cartData : []);

    return rawItems.map((item: any) => ({
      id: item.id || item._id,
      name: item.product?.name || item.product?.title || item.productId?.title || item.productId?.name || item.title || item.name || t("cart_unknown_product", "Unknown Product"),
      price: parseFloat(item.product?.price || item.productId?.price || item.price || 0),
      quantity: item.quantity,
      image: item.product?.images?.[0] || item.product?.imageUrl || item.productId?.images?.[0] || item.productId?.image || item.image || "https://via.placeholder.com/150",
    }));
  }, [cartData, t]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const TAX_RATE: number = 0.075;
  const SHIPPING_FEE: number = 0.6;

  const updateQuantity = async (id: string, type: "inc" | "dec") => {
    const item = cartItems.find((i: any) => i.id === id);
    if (!item) return;

    const newQty = type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
    if (newQty === item.quantity) return;

    try {
      await updateCartItem({ itemId: id, quantity: newQty }).unwrap();
    } catch (err: any) {
      Alert.alert(t("error", "Error"), err?.data?.message || t("cart_failed_update_quantity", "Failed to update quantity"));
    }
  };

  const removeItem = async (id: string) => {
    try {
      await removeFromCart(id).unwrap();
    } catch (err: any) {
      Alert.alert(t("error", "Error"), err?.data?.message || t("cart_failed_remove_item", "Failed to remove item"));
    }
  };

  const subtotal: number = cartItems.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );
  const tax: number = subtotal * TAX_RATE;
  const total: number = subtotal + tax + SHIPPING_FEE;

  const handleConfirmPurchase = () => {
    setIsModalVisible(false);
    router.push("/(users)/Information" as any);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#349488" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t("cart_confirm_buy_q", "Are you sure you want to buy this product?")}
            </Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.noBtn}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.noBtnText}>{t("cart_no", "NO")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.yesBtn}
                onPress={handleConfirmPurchase}
              >
                <Text style={styles.yesBtnText}>{t("cart_yes", "Yes")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("cart_title", "My Cart")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cartItems.map((item: any) => (
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
                      <Text style={styles.stepText}>-</Text>
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
              <Text style={styles.appliedText}>{t("cart_promo_applied", "Promo code applied")}</Text>
              <Ionicons name="checkmark-circle" size={18} color="#349488" />
            </View>
          </View>

          <Text style={styles.sectionTitle}>{t("order_details_payment_details", "Payment details")}</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("order_details_subtotal", "Subtotal")}</Text>
            <Text style={styles.detailValue}>${subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("order_details_tax", "Tax(7.5%)")}</Text>
            <Text style={styles.detailValue}>${tax.toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("order_details_shipping", "Shipping")}</Text>
            <Text style={styles.detailValue}>${SHIPPING_FEE.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t("chat_total_label", "Total")}</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.checkoutBtnText}>
              {t("cart_checkout", "Checkout")} (${total.toFixed(2)})
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
