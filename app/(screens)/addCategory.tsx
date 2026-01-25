import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} from "../../store/api/categoryApiSlice";

const AddCategoryScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, name: initialName, description: initialDescription, catImage: initialImage, displayOrder: initialOrder } = params;

  // Mutations
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  // Form State
  const [name, setName] = useState(initialName as string || "");
  const [description, setDescription] = useState(initialDescription as string || "");
  const [displayOrder, setDisplayOrder] = useState(initialOrder as string || "0");
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImage as string || null);

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
        aspect: [1, 1],
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

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("displayOrder", displayOrder || "0");

      if (selectedImage && !selectedImage.startsWith('http')) {
        const uriParts = selectedImage.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("catImage", {
          uri: selectedImage,
          name: `category_${Date.now()}.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      if (id) {
        await updateCategory({ id: id as string, formData }).unwrap();
        Alert.alert("Success", "Category updated successfully");
      } else {
        await addCategory(formData).unwrap();
        Alert.alert("Success", "Category added successfully");
      }
      router.back();
    } catch (error: any) {
      console.error("Failed to save category:", error);
      Alert.alert("Error", error?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{id ? "Edit Category" : "Add New Category"}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Image Upload */}
          <View style={styles.imageSection}>
            <Text style={styles.label}>Category Image</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={handleImagePicker}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              ) : (
                <View style={styles.placeholder}>
                  <Ionicons name="camera" size={40} color="#999" />
                  <Text style={styles.uploadText}>Upload Image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Electronics"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Display Order</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={displayOrder}
                onChangeText={setDisplayOrder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Brief description of this category"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveBtn, (isAdding || isUpdating) && styles.disabledBtn]}
            onPress={handleSave}
            disabled={isAdding || isUpdating}
          >
            {isAdding || isUpdating ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveBtnText}>{id ? "Update Category" : "Create Category"}</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0"
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  backBtn: { padding: 5 },
  scrollContent: { padding: 20 },
  imageSection: { marginBottom: 25 },
  label: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 10 },
  uploadBox: {
    height: 180,
    borderRadius: 15,
    backgroundColor: "#F9FAF9",
    borderWidth: 1,
    borderColor: "#DDD",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden"
  },
  previewImage: { width: "100%", height: "100%", resizeMode: "cover" },
  placeholder: { alignItems: "center" },
  uploadText: { color: "#999", marginTop: 8, fontSize: 13 },
  form: { gap: 15 },
  inputGroup: { gap: 8 },
  input: {
    backgroundColor: "#F9FAF9",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 10,
    padding: 12,
    fontSize: 15
  },
  textArea: { height: 100, textAlignVertical: "top" },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: "#F0F0F0" },
  saveBtn: {
    backgroundColor: "#349488",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center"
  },
  saveBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  disabledBtn: { opacity: 0.7 }
});

export default AddCategoryScreen;
