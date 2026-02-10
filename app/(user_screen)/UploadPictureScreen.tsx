import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { useRegisterBuyerMutation } from "@/store/api/authApiSlice";
import { updateBuyerRegistration } from "../../store/slices/registrationSlice";
import { RootState } from "../../store/store";

const UploadPictureScreen = () => {
  const dispatch = useDispatch();
  const buyerData = useSelector((state: RootState) => state.registration.buyer);
  const [registerBuyer, { isLoading }] = useRegisterBuyerMutation();
  const [image, setImage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert("Required", "Please upload a profile picture.");
      return;
    }

    try {
      // Update slice with final image
      dispatch(updateBuyerRegistration({ profilePhotoUrl: image }));

      // Use FormData for multipart/form-data request (required for file uploads)
      const formData = new FormData();

      // Append text fields (Exclude email as backend rejects it)
      if (buyerData.fullName) formData.append('fullName', buyerData.fullName);
      if (buyerData.phone) formData.append('phone', buyerData.phone);
      if (buyerData.gender) formData.append('gender', buyerData.gender);
      if (buyerData.nidNumber) formData.append('nidNumber', buyerData.nidNumber);

      // Append files
      // NOTE: Backend error literally said 'nidFontPhotoUrl' (missing 'r'). 
      // We will follow the backend's requested key name.
      if (image) {
        formData.append('profilePhotoUrl', {
          uri: image,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);
      }

      if (buyerData.nidFrontPhotoUrl) {
        formData.append('nidFontPhotoUrl', {
          uri: buyerData.nidFrontPhotoUrl,
          name: 'nid_front.jpg',
          type: 'image/jpeg',
        } as any);
      }

      if (buyerData.nidBackPhotoUrl) {
        formData.append('nidBackPhotoUrl', {
          uri: buyerData.nidBackPhotoUrl,
          name: 'nid_back.jpg',
          type: 'image/jpeg',
        } as any);
      }

      console.log('Registering Buyer with FormData');

      await registerBuyer(formData).unwrap();

      Alert.alert("Success", "Registration successful!", [
        { text: "OK", onPress: () => router.push("/(users)") }
      ]);
    } catch (error: any) {
      console.error("Registration validation failed:", error);
      Alert.alert("Error", error?.data?.message || "Registration failed");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Upload your picture</Text>

        {/* Upload Box Section */}
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={pickImage}
          activeOpacity={0.7}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="camera" size={45} color="#444" />
              <Text style={styles.uploadText}>Upload</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF9", // Matching your background color
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 50,
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    color: "#181725",
    marginBottom: 20,
  },
  uploadBox: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#7C7C7C",
    borderStyle: "dashed", // Dashed border as per your image
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 40,
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#181725",
    marginTop: 10,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  submitButton: {
    backgroundColor: "#3B8C8C", // Teal color matching your buttons
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    left: 25,
    right: 25,
  },
  disabledButton: {
    backgroundColor: "#A0C4C4", // Lighter teal when disabled
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default UploadPictureScreen;
