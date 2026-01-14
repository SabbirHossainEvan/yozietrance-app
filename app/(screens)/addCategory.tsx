import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
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

const AddCategory: React.FC = () => {
  const router = useRouter();
  const [categoryName, setCategoryName] = useState("Electronics");

  // Default image dummy URL
  const [image, setImage] = useState(
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500"
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Categories</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Thumbnail Section */}
          <View style={styles.card}>
            <Text style={styles.label}>Thumbnail</Text>

            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.previewImage} />
            </View>

            <Text style={styles.infoText}>
              Upload a JPG or PNG. Max size 2MB.
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.changeBtn}>
                <Text style={styles.changeBtnText}>Change Image</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => setImage("")}
              >
                <Text style={styles.removeBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Input Section */}
          <View style={styles.card}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={categoryName}
                onChangeText={setCategoryName}
                placeholder="Enter category name"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={[styles.buttonRow, { marginTop: 20 }]}>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => {
                console.log("Saving:", { categoryName, image });
                router.back();
              }}
            >
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    color: "#333",
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    // Shadow for iOS/Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  imagePreviewContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#E8F3F2",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // Change Image Button
  changeBtn: {
    flex: 1.5,
    backgroundColor: "#349488",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  changeBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  // Remove Button
  removeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FF6B6B",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  removeBtnText: {
    color: "#FF6B6B",
    fontWeight: "600",
    fontSize: 15,
  },
  // Input Section
  inputWrapper: {
    backgroundColor: "#F4F7F7",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  input: {
    fontSize: 15,
    color: "#333",
  },
  // Bottom Buttons
  deleteBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FF6B6B",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#FFF",
  },
  deleteBtnText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveBtn: {
    flex: 1.2,
    backgroundColor: "#349488",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddCategory;
