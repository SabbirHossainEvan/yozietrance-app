import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterVendorMutation } from "../../store/api/authApiSlice";
import { setCredentials } from "../../store/slices/authSlice";
import { updateVendorRegistration } from "../../store/slices/registrationSlice";
import { RootState } from "../../store/store";

const BusinessIdUploadScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const vendorData = useSelector((state: RootState) => state.registration.vendor);
  const [registerVendor, { isLoading }] = useRegisterVendorMutation();

  // States
  const [businessId, setBusinessId] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }



    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("ImagePicker Error: ", error);
      Alert.alert("Error", "Something went wrong while picking the image.");
    }
  };

  const handleSubmit = async () => {
    if (!businessId || !selectedImage) {
      Alert.alert("Required", "Please provide Business ID and upload an image.");
      return;
    }

    try {
      // FIX: Merging current states with Redux data to avoid stale selector values
      const latestData = {
        ...vendorData,
        businessId: selectedImage,
        bussinessRegNumber: businessId,
      };

      dispatch(updateVendorRegistration({
        businessId: selectedImage,
        bussinessRegNumber: businessId,
      }));

      // Use FormData for multipart/form-data request
      const formData = new FormData();

      // Append text fields with EXACT keys provided by user
      // fulllName, phone, email, address, storename, storeDescription, gender, nationalIdNumber, bussinessRegNumber, logo, nidFront, businessId

      const safeAppend = (key: string, value: any) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      };

      safeAppend('fullName', latestData.fullName);
      safeAppend('phone', latestData.phone);
      // safeAppend('email', latestData.email);
      safeAppend('address', latestData.address);
      safeAppend('storename', latestData.storename); // This maps to businessName in frontend usually
      safeAppend('storeDescription', latestData.storeDescription);
      safeAppend('gender', latestData.gender || 'Other');
      safeAppend('nationalIdNumber', latestData.nationalIdNumber);
      safeAppend('bussinessRegNumber', latestData.bussinessRegNumber || businessId); // Using businessId input as reg number if provided there

      // Append files
      if (latestData.logo) {
        formData.append('logo', {
          uri: latestData.logo,
          name: 'logo.jpg',
          type: 'image/jpeg',
        } as any);
      }

      if (latestData.nidFront) {
        formData.append('nidFront', {
          uri: latestData.nidFront,
          name: 'nid_front.jpg',
          type: 'image/jpeg',
        } as any);
      }

      if (latestData.nidBack) {
        formData.append('nidBack', {
          uri: latestData.nidBack,
          name: 'nid_back.jpg',
          type: 'image/jpeg',
        } as any);
      }

      // User listed 'businessId' at the end of the list. In this specific screen context, 
      // 'businessId' variable is the text input for ID Number, and 'selectedImage' is the image.
      // However, usually 'businessId' implies the image document in this app's context based on variables (selectedImage).
      // Let's assume the user meant the FILE key is 'businessId'.
      if (selectedImage) {
        formData.append('businessId', { // This key 'businessId' for the file
          uri: selectedImage,
          name: 'business_id.jpg',
          type: 'image/jpeg',
        } as any);
      }

      console.log('Registering Vendor with Latest Data (FormData)');

      const response = await registerVendor(formData).unwrap();
      const updatedUser = response?.data?.user || response?.user || response?.data;

      if (updatedUser) {
        // Update Redux
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        dispatch(setCredentials({
          user: updatedUser,
          accessToken: accessToken || '',
          refreshToken: refreshToken || ''
        }));

        // Update AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }

      Alert.alert("Success", "Vendor registration successful!", [
        { text: "OK", onPress: () => router.push("/(tabs)") }
      ]);

    } catch (error: any) {
      console.error("Vendor registration failed:", error);
      Alert.alert("Error", error?.data?.message || "Registration failed");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Business ID Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Business ID</Text>
            <TextInput
              style={styles.input}
              placeholder="3264 35465"
              placeholderTextColor="#999"
              value={businessId}
              onChangeText={setBusinessId}
              keyboardType="numeric"
            />
          </View>

          {/* Business ID Upload Section */}
          <View style={styles.uploadSection}>
            <Text style={styles.label}>Upload your Business ID</Text>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={handleImagePicker}
              activeOpacity={0.7}
            >
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.previewImage}
                />
              ) : (
                <View style={styles.placeholder}>
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/512/685/685655.png",
                    }}
                    style={styles.cameraIcon}
                  />
                  <Text style={styles.uploadText}>Upload</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BusinessIdUploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FBF9",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  inputSection: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 15 : 12,
    fontSize: 16,
    color: "#000",
  },
  uploadSection: {
    marginBottom: 20,
  },
  uploadBox: {
    width: "100%",
    height: 180,
    borderWidth: 1.5,
    borderColor: "#C0C0C0",
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  placeholder: {
    alignItems: "center",
  },
  cameraIcon: {
    width: 35,
    height: 35,
    tintColor: "#444",
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 18,
    color: "#444",
    fontWeight: "500",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  footer: {
    padding: 20,
    backgroundColor: "#F7FBF9",
  },
  submitButton: {
    backgroundColor: "#318585",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
