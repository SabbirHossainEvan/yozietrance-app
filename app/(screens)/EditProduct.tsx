import { useGetCategoriesByVendorQuery } from "@/store/api/categoryApiSlice";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/store/api/product_api_slice";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // Image Picker import
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator, Alert, Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProduct: React.FC = () => {
  const router = useRouter();
  const { id, categoryId: categoryIdFromParams } = useLocalSearchParams();
  const user = useAppSelector(selectCurrentUser);

  const { data: productData, isLoading: isLoadingProduct } = useGetProductByIdQuery(id as string, { skip: !id });
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<{ label: string; value: string }[]>([]);

  // Category selection states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const { data: categoriesData } = useGetCategoriesByVendorQuery(user?.id, { skip: !user?.id });
  const categories = categoriesData?.data || (Array.isArray(categoriesData) ? categoriesData : []);

  // Modal states
  const [isSpecModalVisible, setIsSpecModalVisible] = useState(false);
  const [newSpecLabel, setNewSpecLabel] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  useEffect(() => {
    if (productData) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price?.toString() || "");
      setStockQuantity(productData.stockQuantity?.toString() || "");
      setIsActive(productData.isAvailable ?? true);
      setSelectedImages(productData.images || (productData.imageUrl ? [productData.imageUrl] : []));

      if (productData.specification) {
        const specs = Object.entries(productData.specification).map(([key, value]) => ({
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          value: Array.isArray(value) ? value.join(", ") : String(value),
        }));
        setSpecifications(specs);
      }
    }
  }, [productData]);

  useEffect(() => {
    if (productData?.categoryId) {
      setSelectedCategoryId(productData.categoryId);
      const cat = categories.find((c: any) => c.id === productData.categoryId);
      if (cat) setSelectedCategoryName(cat.name);
    } else if (categoryIdFromParams) {
      setSelectedCategoryId(categoryIdFromParams as string);
      const cat = categories.find((c: any) => c.id === categoryIdFromParams);
      if (cat) setSelectedCategoryName(cat.name);
    }
  }, [productData, categoryIdFromParams, categories]);

  const handleAddSpec = () => {
    if (newSpecLabel && newSpecValue) {
      setSpecifications([...specifications, { label: newSpecLabel, value: newSpecValue }]);
      setNewSpecLabel("");
      setNewSpecValue("");
      setIsSpecModalVisible(false);
    }
  };

  // 2. Image pick korar function
  const pickImage = async () => {
    if (selectedImages.length >= 5) {
      Alert.alert("Limit Reached", "You can only upload up to 5 images.");
      return;
    }

    // Permission check
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    // Gallery open kora
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      // New image-ti list e add kora
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
  };

  // 3. Image remove korar function
  const removeImage = (index: number) => {
    const newList = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newList);
  };

  const handleSave = async () => {
    if (!name || !price || !stockQuantity || !selectedCategoryId) {
      Alert.alert("Error", "Please fill in all required fields, including category.");
      return;
    }

    const finalCategoryId = selectedCategoryId;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stockQuantity", stockQuantity);
    formData.append("isAvailable", String(isActive));
    formData.append("categoryId", finalCategoryId);

    if (selectedImages.length === 0) {
      Alert.alert("Error", "At least one product image is required.");
      return;
    }

    selectedImages.forEach((uri, index) => {
      if (uri.startsWith('http')) {
        formData.append("imageUrl", uri);
      } else {
        formData.append("images", {
          uri: uri,
          name: `product_${index}.jpg`,
          type: "image/jpeg",
        } as any);
      }
    });

    // Temporarily removing specification as the backend returns "property specification should not exist"
    // const specObj = specifications.reduce((acc: any, spec) => {
    //   const key = spec.label.split(' ').map((word, i) => i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('');
    //   acc[key] = spec.value;
    //   return acc;
    // }, {});

    // formData.append("specification", JSON.stringify(specObj));

    try {
      if (id) {
        await updateProduct({ id, formData }).unwrap();
        Alert.alert("Success", "Product updated successfully!");
      } else {
        await createProduct(formData).unwrap();
        Alert.alert("Success", "Product created successfully!");
      }
      router.back();
    } catch (error) {
      console.error("Save Error:", error);
      Alert.alert("Error", "Failed to save product");
    }
  };

  if (id && isLoadingProduct) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#349488" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Product</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Media Section */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Media</Text>
            <Text style={styles.mediaCount}>{selectedImages.length}/5</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.mediaRow}
          >
            {/* Upload Button */}
            <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
              <View style={styles.uploadIconCircle}>
                <Ionicons name="camera" size={24} color="#FFF" />
              </View>
            </TouchableOpacity>

            {/* Selected Images List */}
            {selectedImages.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.mediaImage} />
                <TouchableOpacity
                  style={styles.removeBadge}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Product Details Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Product details</Text>

          <Text style={styles.inputLabel}>Product Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Headphones"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your product..."
            multiline
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.inputLabel}>Category</Text>
          <TouchableOpacity
            style={[styles.input, { justifyContent: "center" }]}
            onPress={() => setIsCategoryModalVisible(true)}
          >
            <Text style={{ color: selectedCategoryName ? "#333" : "#999" }}>
              {selectedCategoryName || "Select Category"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={stockQuantity}
            onChangeText={setStockQuantity}
          />
        </View>

        {/* Pricing Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <Text style={styles.inputLabel}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. $20"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={price}
            onChangeText={(text) => setPrice(text.replace("$", ""))}
          />
        </View>

        {/* Specification Section */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Specification</Text>
            <TouchableOpacity onPress={() => setIsSpecModalVisible(true)}>
              <Text style={styles.addSpecText}>Add Specification</Text>
            </TouchableOpacity>
          </View>
          {specifications.map((spec, index) => (
            <View key={index} style={styles.specCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.specLabel}>{spec.label}</Text>
                <Text style={styles.specValueText}>{spec.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </View>
          ))}
        </View>

        {/* Settings Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.activeStatusText}>Active Status</Text>
              <Text style={styles.statusSubText}>
                Product will be visible in store
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D1D1", true: "#349488" }}
              thumbColor={"#FFF"}
              onValueChange={() => setIsActive(!isActive)}
              value={isActive}
            />
          </View>
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={isUpdating || isCreating}
          >
            <Text style={styles.saveBtnText}>
              {isUpdating || isCreating ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Specification Modal */}
      <Modal
        visible={isSpecModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSpecModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Specification</Text>
              <TouchableOpacity onPress={() => setIsSpecModalVisible(false)}>
                <Ionicons name="close" size={24} color="#003D4D" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.modalInputRow}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. Brand"
                  placeholderTextColor="#AAA"
                  value={newSpecLabel}
                  onChangeText={setNewSpecLabel}
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. JBL"
                  placeholderTextColor="#AAA"
                  value={newSpecValue}
                  onChangeText={setNewSpecValue}
                />
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setIsSpecModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveBtn}
                  onPress={handleAddSpec}
                >
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Category Selection Modal */}
      <Modal
        visible={isCategoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setIsCategoryModalVisible(false)}>
                <Ionicons name="close" size={24} color="#003D4D" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              {categories.map((cat: any) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryItem}
                  onPress={() => {
                    setSelectedCategoryId(cat.id);
                    setSelectedCategoryName(cat.name);
                    setIsCategoryModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.categoryItemText,
                    selectedCategoryId === cat.id && styles.selectedCategoryText
                  ]}>
                    {cat.name}
                  </Text>
                  {selectedCategoryId === cat.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#349488" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBFB" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 60,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  scrollContent: { padding: 16 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#333" },
  mediaCount: { fontSize: 12, color: "#999" },
  mediaRow: { flexDirection: "row", marginTop: 10 },
  uploadBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#349488",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  imageWrapper: { position: "relative", marginRight: 10 },
  mediaImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#E8F3F2",
  },
  removeBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  inputLabel: { fontSize: 13, color: "#666", marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: "#F4F7F7",
    borderRadius: 10,
    height: 45,
    paddingHorizontal: 15,
    justifyContent: "center",
    color: "#333",
  },
  textArea: { height: 80, textAlignVertical: "top", paddingTop: 10 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: { flexDirection: "row", alignItems: "center" },
  addSpecText: { color: "#349488", fontSize: 13, fontWeight: "600" },
  uploadIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#349488",
    justifyContent: "center",
    alignItems: "center",
  },
  specCard: {
    backgroundColor: "#F4F7F7",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  specLabel: { fontSize: 12, color: "#999", marginBottom: 2 },
  specValueText: { fontSize: 14, color: "#333", fontWeight: "600" },
  activeStatusText: { fontSize: 15, fontWeight: "600", color: "#333" },
  statusSubText: { fontSize: 12, color: "#999", marginTop: 2 },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingBottom: 30,
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cancelBtnText: { color: "#FF6B6B", fontWeight: "bold" },
  saveBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#349488",
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: { color: "#FFF", fontWeight: "bold" },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    width: "100%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#003D4D",
  },
  modalBody: {},
  modalInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalInput: {
    flex: 1,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    marginHorizontal: 5,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalCancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#349488",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  modalCancelText: {
    color: "#349488",
    fontSize: 16,
    fontWeight: "600",
  },
  modalSaveBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#349488",
    justifyContent: "center",
    alignItems: "center",
  },
  modalSaveText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  categoryItemText: {
    fontSize: 16,
    color: "#333",
  },
  selectedCategoryText: {
    color: "#349488",
    fontWeight: "bold",
  },
});

export default EditProduct;
