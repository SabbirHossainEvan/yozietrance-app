import { useCreateCouponMutation } from "@/store/api/couponApiSlice";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MakeNewCoupon: React.FC = () => {
  const router = useRouter();
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  // State for form fields
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minTransaction, setMinTransaction] = useState("");
  const [validFrom, setValidFrom] = useState(new Date());
  const [validUntil, setValidUntil] = useState(new Date());
  const [usageLimit, setUsageLimit] = useState("");
  const [showDatePicker, setShowDatePicker] = useState<"from" | "until" | null>(null);

  // Date format korar function
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentField = showDatePicker;
    setShowDatePicker(null);
    if (selectedDate && currentField) {
      if (currentField === "from") {
        setValidFrom(selectedDate);
      } else {
        setValidUntil(selectedDate);
      }
    }
  };

  const handleCreateCoupon = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a coupon name");
      return;
    }
    if (!code.trim()) {
      Alert.alert("Error", "Please enter a coupon code");
      return;
    }
    if (!discountValue || parseFloat(discountValue) <= 0) {
      Alert.alert("Error", "Please enter a valid discount value");
      return;
    }

    try {
      await createCoupon({
        name: name.trim(),
        code: code.trim(),
        discountType,
        discountValue: parseFloat(discountValue),
        validFrom: validFrom.toISOString(),
        validUntil: validUntil.toISOString(),
        minPurchaseAmount: minTransaction ? parseFloat(minTransaction) : undefined,
        usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
      }).unwrap();

      Alert.alert("Success", "Coupon created successfully!");
      router.replace("/(screens)/MakeCoupon");
    } catch (error: any) {
      console.error("Failed to create coupon:", error);
      Alert.alert("Error", error?.data?.message || "Failed to create coupon. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Make a New Coupon</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Form Fields */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Coupon Name (e.g., Summer Sale)"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#99ABB3"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Coupon Code (e.g., SAVE10)"
              value={code}
              onChangeText={setCode}
              placeholderTextColor="#99ABB3"
              autoCapitalize="characters"
            />
          </View>

          {/* Discount Type Selector */}
          <View style={styles.inputContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <TouchableOpacity
                style={[styles.typeBtn, discountType === 'percentage' && styles.typeBtnActive]}
                onPress={() => setDiscountType('percentage')}
              >
                <Text style={[styles.typeBtnText, discountType === 'percentage' && styles.typeBtnTextActive]}>Percentage</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, discountType === 'fixed' && styles.typeBtnActive]}
                onPress={() => setDiscountType('fixed')}
              >
                <Text style={[styles.typeBtnText, discountType === 'fixed' && styles.typeBtnTextActive]}>Fixed Amount</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={discountType === 'percentage' ? "Discount % (e.g., 10)" : "Discount Amount (e.g., 50)"}
              value={discountValue}
              onChangeText={setDiscountValue}
              keyboardType="numeric"
              placeholderTextColor="#99ABB3"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Min. Purchase Amount (optional)"
              value={minTransaction}
              onChangeText={setMinTransaction}
              keyboardType="numeric"
              placeholderTextColor="#99ABB3"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Usage Limit (optional)"
              value={usageLimit}
              onChangeText={setUsageLimit}
              keyboardType="numeric"
              placeholderTextColor="#99ABB3"
            />
          </View>

          {/* Valid From Date Picker */}
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker("from")}
          >
            <Text
              style={[
                styles.input,
                {
                  color: "#333",
                  textAlignVertical: "center",
                  paddingTop: 12,
                },
              ]}
            >
              Valid From: {formatDate(validFrom)}
            </Text>
          </TouchableOpacity>

          {/* Valid Until Date Picker */}
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker("until")}
          >
            <Text
              style={[
                styles.input,
                {
                  color: "#333",
                  textAlignVertical: "center",
                  paddingTop: 12,
                },
              ]}
            >
              Valid Until: {formatDate(validUntil)}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={showDatePicker === "from" ? validFrom : validUntil}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.createBtn}
            onPress={handleCreateCoupon}
          >
            <Text style={styles.createBtnText}>Create a coupon</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 60,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4B5563",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  inputContainer: {
    backgroundColor: "#E8F1F1",
    borderRadius: 12,
    height: 55,
    marginBottom: 16,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  input: {
    fontSize: 16,
    color: "#333",
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#349488",
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  typeBtnActive: {
    backgroundColor: "#349488",
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#349488",
  },
  typeBtnTextActive: {
    color: "#FFF",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  createBtn: {
    backgroundColor: "#349488",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  createBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default MakeNewCoupon;
