import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BusinessInfoForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    emailOrNumber: "",
    phoneNumber: "",
    email: "",
    address: "",
    businessID: "3254 35465",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [businessIdImage, setBusinessIdImage] = useState(null);

  const handleInputChange = (field: any, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileImageUpload = async () => {
    try {
      if (Platform.OS === "web") {
        // For web, use document picker
        const result = await DocumentPicker.getDocumentAsync({
          type: ["image/*"],
          copyToCacheDirectory: true,
        });

        if (result.assets && result.assets[0]) {
          setProfileImage({
            uri: result.assets[0].uri,
            name: result.assets[0].name,
          });
        }
      } else {
        // For mobile, use image picker
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
          Alert.alert(
            "Permission Required",
            "Please grant permission to access photos"
          );
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1], // Square aspect ratio for profile
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          setProfileImage({
            uri: result.assets[0].uri,
            name: "profile_image.jpg",
          });
        }
      }
    } catch (error) {
      console.error("Profile image upload error:", error);
      Alert.alert("Error", "Failed to upload profile image");
    }
  };

  const handleBusinessIdUpload = async () => {
    try {
      if (Platform.OS === "web") {
        // For web, use document picker
        const result = await DocumentPicker.getDocumentAsync({
          type: ["image/*", "application/pdf"],
          copyToCacheDirectory: true,
        });

        if (result.assets && result.assets[0]) {
          setBusinessIdImage({
            uri: result.assets[0].uri,
            name: result.assets[0].name,
          });
        }
      } else {
        // For mobile, use image picker
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
          Alert.alert(
            "Permission Required",
            "Please grant permission to access photos"
          );
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
          setBusinessIdImage({
            uri: result.assets[0].uri,
            name: "business_id.jpg",
          });
        }
      }
    } catch (error) {
      console.error("Business ID upload error:", error);
      Alert.alert("Error", "Failed to upload file");
    }
  };

  const handleSubmit = () => {
    // Validate form
    const requiredFields = ["fullName", "phoneNumber", "email", "address"];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field].trim()
    );

    if (emptyFields.length > 0) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    if (!profileImage) {
      Alert.alert("Missing Profile Image", "Please upload your profile image");
      return;
    }

    if (!businessIdImage) {
      Alert.alert("Missing Document", "Please upload your Business ID");
      return;
    }

    // Submit logic here
    Alert.alert("Success", "Business information submitted successfully!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  //   this is for handle back
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
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
          <TouchableOpacity onPress={() => handleBack()}>
            <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            Edit Business info
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Image Upload Section */}
        <View style={{ marginBottom: 32, alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleProfileImageUpload}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60, // Makes it circular
              backgroundColor: "#f5f5f5",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
              borderColor: "#e0e0e0",
              borderStyle: "dashed",
              overflow: "hidden", // Ensures image stays within circle
            }}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage.uri }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 60,
                }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ alignItems: "center" }}>
                <MaterialIcons name="add-a-photo" size={40} color="#278687" />
                <Text
                  style={{
                    fontSize: 14,
                    color: "#278687",
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  Upload Profile Picture
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 12,
              color: "#666666",
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Click to upload your profile image
          </Text>
        </View>

        {/* Full Name Input */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "#333333",
              marginBottom: 8,
            }}
          >
            Enter Your Full Name
          </Text>
          <TextInput
            style={{
              height: 50,
              borderWidth: 1,
              borderColor: "#e0e0e0",
              borderRadius: 8,
              paddingHorizontal: 16,
              fontSize: 16,
              color: "#333333",
              backgroundColor: "#fafafa",
            }}
            placeholder="Enter email address or number"
            placeholderTextColor="#999999"
            value={formData.fullName}
            onChangeText={(text) => handleInputChange("fullName", text)}
          />
        </View>

        {/* Phone Number Input */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "#333333",
              marginBottom: 8,
            }}
          >
            Enter your Phone Number
          </Text>
          <TextInput
            style={{
              height: 50,
              borderWidth: 1,
              borderColor: "#e0e0e0",
              borderRadius: 8,
              paddingHorizontal: 16,
              fontSize: 16,
              color: "#333333",
              backgroundColor: "#fafafa",
            }}
            placeholder="Enter phone number"
            placeholderTextColor="#999999"
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange("phoneNumber", text)}
            keyboardType="phone-pad"
          />
        </View>

        {/* Email Input */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "#333333",
              marginBottom: 8,
            }}
          >
            Enter Email Address
          </Text>
          <TextInput
            style={{
              height: 50,
              borderWidth: 1,
              borderColor: "#e0e0e0",
              borderRadius: 8,
              paddingHorizontal: 16,
              fontSize: 16,
              color: "#333333",
              backgroundColor: "#fafafa",
            }}
            placeholder="Enter email address"
            placeholderTextColor="#999999"
            value={formData.email}
            onChangeText={(text) => handleInputChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Address Input */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "#333333",
              marginBottom: 8,
            }}
          >
            Enter Your Address
          </Text>
          <TextInput
            style={{
              height: 100,
              borderWidth: 1,
              borderColor: "#e0e0e0",
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingTop: 12,
              fontSize: 16,
              color: "#333333",
              backgroundColor: "#fafafa",
              textAlignVertical: "top",
            }}
            placeholder="Enter your address"
            placeholderTextColor="#999999"
            value={formData.address}
            onChangeText={(text) => handleInputChange("address", text)}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Business ID Display */}
        <View
          style={{
            marginBottom: 20,
            padding: 16,
            backgroundColor: "#f8f9fa",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#e0e0e0",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#666666",
              marginBottom: 8,
            }}
          >
            Business ID
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#333333",
            }}
          >
            {formData.businessID}
          </Text>
        </View>

        {/* Business ID Upload Section */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "#333333",
              marginBottom: 12,
            }}
          >
            Upload your Business ID
          </Text>

          <TouchableOpacity
            onPress={handleBusinessIdUpload}
            style={{
              height: 120,
              borderWidth: 2,
              borderColor: "#e0e0e0",
              borderStyle: "dashed",
              borderRadius: 12,
              backgroundColor: "#fafafa",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            {businessIdImage ? (
              <View style={{ alignItems: "center" }}>
                <MaterialIcons name="check-circle" size={48} color="#4CAF50" />
                <Text
                  style={{
                    fontSize: 14,
                    color: "#4CAF50",
                    marginTop: 8,
                  }}
                >
                  {businessIdImage.name}
                </Text>
              </View>
            ) : (
              <View style={{ alignItems: "center" }}>
                <MaterialIcons name="cloud-upload" size={48} color="#278687" />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: "#278687",
                    marginTop: 8,
                  }}
                >
                  Upload
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 12,
              color: "#666666",
              lineHeight: 16,
              textAlign: "center",
            }}
          >
            If you change any business information, your verification status
            will be reviewed again
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            height: 56,
            backgroundColor: "#278687",
            borderRadius: 28,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#ffffff",
            }}
          >
            Submit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BusinessInfoForm;
