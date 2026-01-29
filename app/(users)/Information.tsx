import { useGetCartQuery, useRemoveFromCartMutation } from "@/store/api/cartApiSlice";
import { useCreateOrderMutation } from "@/store/api/orderApiSlice";
import { RootState } from "@/store/store";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const stateData = [
  { label: "New York", value: "NY" },
  { label: "California", value: "CA" },
  { label: "Texas", value: "TX" },
  { label: "Florida", value: "FL" },
  { label: "New Jersey", value: "NJ" },
  { label: "Washington", value: "WA" },
];

export default function InformationScreen() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [stateValue, setStateValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const handleContinue = async () => {
    // Validation
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Error", "Please enter your address");
      return;
    }
    if (!stateValue) {
      Alert.alert("Error", "Please select a state");
      return;
    }
    if (!zipCode.trim()) {
      Alert.alert("Error", "Please enter your zip code");
      return;
    }

    // Get cart items
    const rawItems = cartData?.data?.items || cartData?.items || (Array.isArray(cartData) ? cartData : []);

    if (rawItems.length === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }

    // Construct shipping address
    const shippingAddress = `${address}, ${stateValue} ${zipCode}`;

    try {
      // Group items by vendor
      const vendorGroups: { [key: string]: any[] } = {};
      rawItems.forEach((item: any) => {
        const vendorId = item.product?.vendorId || item.product?.vendor?.id || item.productId?.vendorId || item.productId?.vendor?._id || item.productId?.vendor;
        if (!vendorId) {
          console.warn('Item missing vendorId:', item);
          return;
        }
        if (!vendorGroups[vendorId]) {
          vendorGroups[vendorId] = [];
        }
        vendorGroups[vendorId].push(item);
      });

      const vendors = Object.keys(vendorGroups);
      if (vendors.length === 0) {
        Alert.alert("Error", "Unable to process order. Products missing vendor information.");
        return;
      }

      // Create orders for each vendor
      for (const vendorId of vendors) {
        const vendorItems = vendorGroups[vendorId];
        const orderData = {
          vendorId,
          shippingAddress,
        };

        console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
        await createOrder(orderData).unwrap();

        // Remove items from cart after successful order
        for (const item of vendorItems) {
          await removeFromCart(item._id || item.id).unwrap();
        }
      }

      Alert.alert(
        "Success",
        `Order${vendors.length > 1 ? 's' : ''} placed successfully!`,
        [{ text: "OK", onPress: () => router.replace("/(user_screen)/OrderAcceptedScreen") }]
      );
    } catch (err: any) {
      console.error('Order creation error:', err);
      Alert.alert("Error", err?.data?.message || "Failed to place order");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Information</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Scan Button */}
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push("/(user_screen)/ScanQRCode")}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={20} color="#666" />
            <Text style={styles.scanButtonText}>Autofill by scanning</Text>
          </TouchableOpacity>

          {/* Full Name Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
            />
          </View>

          {/* Email Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 9999999999"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Address</Text>
            <View style={styles.addressInputContainer}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#888"
                style={styles.locationIcon}
              />
              <TextInput
                style={[styles.input, styles.autoGrowInput]}
                value={address}
                onChangeText={setAddress}
                placeholder="123 Main Street, Jersey City, New Jersey 07302, USA"
                multiline={true}
                scrollEnabled={false}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>City</Text>
              <TextInput style={styles.input} placeholder="City" />
            </View>

            <View style={[styles.formGroup, { flex: 1.2, marginRight: 8 }]}>
              <Text style={styles.label}>State</Text>
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: "#2A8383" }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={stateData}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? "Select" : "..."}
                value={stateValue}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setStateValue(item.value);
                  setIsFocus(false);
                }}
                renderRightIcon={() => (
                  <Ionicons
                    name={isFocus ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={isFocus ? "#2A8383" : "#666"}
                  />
                )}
              />
            </View>

            <View style={[styles.formGroup, { flex: 0.8 }]}>
              <Text style={styles.label}>Zip Code</Text>
              <TextInput
                style={styles.input}
                placeholder="00000"
                keyboardType="numeric"
                maxLength={5}
                value={zipCode}
                onChangeText={setZipCode}
              />
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.continueButton, (isCreatingOrder || isCartLoading) && { opacity: 0.7 }]}
            onPress={handleContinue}
            disabled={isCreatingOrder || isCartLoading}
          >
            {isCreatingOrder ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBF9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 25,
    marginTop: 10,
  },
  scanButtonText: {
    marginLeft: 10,
    color: "#666",
    fontSize: 15,
    fontWeight: "500",
  },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#444", marginBottom: 8 },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 15,
    minHeight: 50,
    fontSize: 14,
    color: "#333",
  },
  autoGrowInput: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 40,
    minHeight: 60,
  },
  addressInputContainer: { position: "relative" },
  locationIcon: { position: "absolute", left: 12, top: 15, zIndex: 1 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  dropdown: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  placeholderStyle: { fontSize: 14, color: "#888" },
  selectedTextStyle: { fontSize: 14, color: "#333" },
  continueButton: {
    backgroundColor: "#2A8383",
    borderRadius: 10,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  continueButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});

