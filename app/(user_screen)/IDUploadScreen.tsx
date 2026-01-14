import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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

const IDUploadScreen = () => {
  // State variables with types
  const [idNumber, setIdNumber] = useState<string>("");
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  // Type-safe pickImage function
  const pickImage = async (type: "front" | "back") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === "front") {
        setFrontImage(result.assets[0].uri);
      } else {
        setBackImage(result.assets[0].uri);
      }
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
          {/* National ID Number Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>National ID No</Text>
            <TextInput
              style={styles.input}
              placeholder="3264 35465 341654"
              placeholderTextColor="#C7C7CD"
              value={idNumber}
              onChangeText={setIdNumber}
              keyboardType="numeric"
            />
          </View>

          {/* Upload Front Side */}
          <View style={styles.uploadGroup}>
            <Text style={styles.label}>
              Upload your National ID picture (Front)
            </Text>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => pickImage("front")}
              activeOpacity={0.7}
            >
              {frontImage ? (
                <Image
                  source={{ uri: frontImage }}
                  style={styles.previewImage}
                />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons name="camera" size={40} color="#181725" />
                  <Text style={styles.uploadText}>Upload</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Upload Back Side */}
          <View style={styles.uploadGroup}>
            <Text style={styles.label}>
              Upload your National ID picture (Back)
            </Text>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => pickImage("back")}
              activeOpacity={0.7}
            >
              {backImage ? (
                <Image
                  source={{ uri: backImage }}
                  style={styles.previewImage}
                />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons name="camera" size={40} color="#181725" />
                  <Text style={styles.uploadText}>Upload</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={[styles.nextButton, !idNumber && styles.disabledButton]}
            disabled={!idNumber}
            onPress={() => router.push("/(user_screen)/UploadPictureScreen")}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF9",
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 30,
    flexGrow: 1,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#181725",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#181725",
    borderWidth: 1,
    borderColor: "#D1D1D1",
  },
  uploadGroup: {
    marginBottom: 25,
  },
  uploadBox: {
    height: 180,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#7C7C7C",
    borderStyle: "dashed", // Dashed border as per design
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#181725",
    marginTop: 10,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  nextButton: {
    backgroundColor: "#3B8C8C", // Theme teal color
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#A0C4C4",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default IDUploadScreen;
