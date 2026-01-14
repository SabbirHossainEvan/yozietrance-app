import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditPersonalInfoScreen = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    emailOrNumber: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const handleInputChange = (field: any, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate form
    const requiredFields = ["fullName", "phoneNumber", "email", "address"];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field].trim()
    );

    if (emptyFields.length > 0) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields before saving.",
        [{ text: "OK" }]
      );
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.", [
        { text: "OK" },
      ]);
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      Alert.alert("Invalid Phone", "Please enter a valid phone number.", [
        { text: "OK" },
      ]);
      return;
    }

    // Success - Save data and navigate back
    Alert.alert(
      "Success",
      "Your personal information has been saved successfully!",
      [
        {
          text: "OK",
          onPress: () => {
            // Here you would typically save to your backend/state management
            console.log("Saved data:", formData);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 12,
              paddingBottom: 30,
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons
                name="arrow-back-ios-new"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              Edit Personal info
            </Text>
            <View></View>
          </View>
          {/* Full Name Input */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#333333",
                marginBottom: 8,
                letterSpacing: -0.3,
              }}
            >
              Enter Your Full Name
            </Text>
            <View
              style={{
                height: 56,
                borderWidth: 1,
                borderColor: "#E0E0E0",
                borderRadius: 12,
                backgroundColor: "#FAFAFA",
                paddingHorizontal: 16,
                justifyContent: "center",
              }}
            >
              <TextInput
                style={{
                  fontSize: 16,
                  color: "#333333",
                  padding: 0,
                  margin: 0,
                  flex: 1,
                  height: "100%",
                  letterSpacing: -0.3,
                }}
                placeholder="Enter email address or number"
                placeholderTextColor="#999999"
                value={formData.fullName}
                onChangeText={(text) => handleInputChange("fullName", text)}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Phone Number Input */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#333333",
                marginBottom: 8,
                letterSpacing: -0.3,
              }}
            >
              Enter Your Phone Number
            </Text>
            <View
              style={{
                height: 56,
                borderWidth: 1,
                borderColor: "#E0E0E0",
                borderRadius: 12,
                backgroundColor: "#FAFAFA",
                paddingHorizontal: 16,
                justifyContent: "center",
              }}
            >
              <TextInput
                style={{
                  fontSize: 16,
                  color: "#333333",
                  padding: 0,
                  margin: 0,
                  flex: 1,
                  height: "100%",
                  letterSpacing: -0.3,
                }}
                placeholder="Enter phone number"
                placeholderTextColor="#999999"
                value={formData.phoneNumber}
                onChangeText={(text) => handleInputChange("phoneNumber", text)}
                keyboardType="phone-pad"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#333333",
                marginBottom: 8,
                letterSpacing: -0.3,
              }}
            >
              Enter Email Address
            </Text>
            <View
              style={{
                height: 56,
                borderWidth: 1,
                borderColor: "#E0E0E0",
                borderRadius: 12,
                backgroundColor: "#FAFAFA",
                paddingHorizontal: 16,
                justifyContent: "center",
              }}
            >
              <TextInput
                style={{
                  fontSize: 16,
                  color: "#333333",
                  padding: 0,
                  margin: 0,
                  flex: 1,
                  height: "100%",
                  letterSpacing: -0.3,
                }}
                placeholder="Enter email address"
                placeholderTextColor="#999999"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Address Input */}
          <View style={{ marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#333333",
                marginBottom: 8,
                letterSpacing: -0.3,
              }}
            >
              Enter Your Address
            </Text>
            <View
              style={{
                minHeight: 112,
                borderWidth: 1,
                borderColor: "#E0E0E0",
                borderRadius: 12,
                backgroundColor: "#FAFAFA",
                paddingHorizontal: 16,
                paddingVertical: 16,
              }}
            >
              <TextInput
                style={{
                  fontSize: 16,
                  color: "#333333",
                  padding: 0,
                  margin: 0,
                  flex: 1,
                  minHeight: 80,
                  textAlignVertical: "top",
                  letterSpacing: -0.3,
                }}
                placeholder="Enter your address"
                placeholderTextColor="#999999"
                value={formData.address}
                onChangeText={(text) => handleInputChange("address", text)}
                multiline
                numberOfLines={4}
                maxLength={200}
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.9}
            style={{
              height: 56,
              backgroundColor: "#278687",
              borderRadius: 28,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#278687",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#FFFFFF",
                letterSpacing: -0.3,
              }}
            >
              Save
            </Text>
          </TouchableOpacity>

          {/* Bottom spacing for iOS keyboard */}
          {Platform.OS === "ios" && <View style={{ height: 20 }} />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditPersonalInfoScreen;
