import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

  const [fullName, setFullName] = useState("Rokey Mahmud");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [stateValue, setStateValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);

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
            onPress={() => router.replace("/(user_screen)/ScanQRCode")}
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
              />
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.replace("/(user_screen)/PaymentScreen")}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
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
