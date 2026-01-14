import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

const BusinessIdUploadScreen: React.FC = () => {
  const router = useRouter();

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

  const handleSubmit = () => {
    console.log("Business ID:", businessId);
    console.log("Selected Image:", selectedImage);

    router.push("/(tabs)");
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
          >
            <Text style={styles.submitButtonText}>Submit</Text>
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
