import { useDeactivateCouponMutation, useGetCouponsByVendorQuery } from "@/store/api/couponApiSlice";
import { RootState } from "@/store/store";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

// 1. Coupon Card Component
const CouponCard = ({
  id,
  type,
  color,
  code,
  description,
  expiry,
  minSpend,
  discount,
  onDelete,
}: any) => {
  return (
    <View style={[styles.couponContainer, { borderColor: color }]}>
      <View style={[styles.leftStrip, { backgroundColor: color }]}>
        <Text style={styles.verticalText}>{type}</Text>
        {/* Dotted Cut-out effect */}
        <View style={styles.dotContainer}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={styles.whiteDot} />
          ))}
        </View>
      </View>

      {/* Right Content Area */}
      <View style={styles.couponContent}>
        <View style={styles.topRow}>
          <View style={styles.codeRow}>
            <Text style={styles.codeLabel}>Code:{code}</Text>
            <TouchableOpacity hitSlop={10}>
              <MaterialCommunityIcons
                name="content-copy"
                size={18}
                color="#333"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.discountText}>{discount}%</Text>
        </View>

        <Text style={styles.descriptionText}>{description}</Text>

        <View style={styles.divider} />

        <View style={styles.bottomRow}>
          <View style={styles.infoBox}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.infoLabel}>Valid until</Text>
              <Text style={styles.infoValue}>{expiry}</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="bag-handle-outline" size={16} color="#666" />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.infoLabel}>Min. transaction</Text>
              <Text style={styles.infoValue}>${minSpend}</Text>
            </View>
          </View>

          {/* Delete Icon */}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDelete(id)}
          >
            <Ionicons name="trash-outline" size={20} color="#FF4B6E" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const MakeCoupon: React.FC = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const vendorId = user?.userId || user?.id || "";

  const { data: couponsData, isLoading, error } = useGetCouponsByVendorQuery(vendorId, {
    skip: !vendorId,
  });
  const [deactivateCoupon] = useDeactivateCouponMutation();

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Coupon",
      "Are you sure you want to delete this coupon? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deactivateCoupon(id).unwrap();
            } catch (err) {
              console.error("Failed to deactivate coupon:", err);
              Alert.alert("Error", "Failed to delete coupon. Please try again.");
            }
          }
        }
      ]
    );
  };

  console.log('MakeCoupon - vendorId:', vendorId);
  console.log('MakeCoupon - couponsData:', couponsData);
  console.log('MakeCoupon - isLoading:', isLoading);
  console.log('MakeCoupon - error:', error);

  // Map API coupons to component format
  const coupons = React.useMemo(() => {
    if (!couponsData || !Array.isArray(couponsData)) {
      console.log('MakeCoupon - couponsData is not an array:', couponsData);
      return [];
    }

    console.log('MakeCoupon - mapping coupons, count:', couponsData.length);
    return couponsData
      .filter(c => c.isActive) // Only show active coupons
      .map((coupon) => ({
        id: coupon.id,
        type: coupon.discountType === 'percentage' ? 'DISCOUNT' : 'CASHBACK',
        color: coupon.discountType === 'percentage' ? '#FF9100' : '#FF4B6E',
        code: coupon.code,
        description: `${coupon.discountType === 'percentage' ? 'DISCOUNT' : 'CASHBACK'} on Orders Over $${coupon.minPurchaseAmount || 0}`,
        expiry: new Date(coupon.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        minSpend: coupon.minPurchaseAmount?.toString() || "0",
        discount: coupon.discountValue.toString(),
      }));
  }, [couponsData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Make a Coupon</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.replace("/(screens)/MakeNewCoupon")}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#349488" />
        </View>
      ) : error ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: '#666', textAlign: 'center' }}>Failed to load coupons. Please try again.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {coupons.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ color: '#666', fontSize: 16 }}>No coupons yet</Text>
              <Text style={{ color: '#999', fontSize: 14, marginTop: 8 }}>Tap + to create your first coupon</Text>
            </View>
          ) : (
            coupons.map((item) => (
              <CouponCard key={item.id} {...item} onDelete={handleDelete} />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBFB" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 70,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  addBtn: {
    backgroundColor: "#349488",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: { padding: 20 },

  // Coupon Card Styles
  couponContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    overflow: "hidden", // Important for left strip
  },
  leftStrip: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  verticalText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    width: 150,
    textAlign: "center",
    transform: [{ rotate: "-90deg" }],
  },
  dotContainer: {
    position: "absolute",
    left: -6,
    height: "100%",
    justifyContent: "space-around",
  },
  whiteDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F8FBFB", // Matches screen background
  },
  couponContent: {
    flex: 1,
    padding: 15,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  discountText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 12,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 10,
    color: "#999",
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF5F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE5EA'
  },
});

export default MakeCoupon;
