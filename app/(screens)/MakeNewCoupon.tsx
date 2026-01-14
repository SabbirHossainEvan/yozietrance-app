import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

  // State for form fields
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [minTransaction, setMinTransaction] = useState("");
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Date format korar function
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  const handleCreateCoupon = () => {
    console.log("Coupon Created:", {
      name,
      discount,
      minTransaction,
      expiryDate,
    });
    router.back();
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
              placeholder="Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#99ABB3"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Discount"
              value={discount}
              onChangeText={setDiscount}
              keyboardType="numeric"
              placeholderTextColor="#99ABB3"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Min. transaction"
              value={minTransaction}
              onChangeText={setMinTransaction}
              keyboardType="numeric"
              placeholderTextColor="#99ABB3"
            />
          </View>

          {/* Date Picker Field */}
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={[
                styles.input,
                {
                  color: name ? "#333" : "#99ABB3",
                  textAlignVertical: "center",
                  paddingTop: 12,
                },
              ]}
            >
              {expiryDate ? formatDate(expiryDate) : "Valid until"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={expiryDate}
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
