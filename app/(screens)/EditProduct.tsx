import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // Image Picker import
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
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
  const [isActive, setIsActive] = useState(true);

  // 1. Image state: Ekhane selected images gulo thakbe
  const [selectedImages, setSelectedImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200",
  ]);

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

  const specifications = [
    { label: "Brand", value: "JBL" },
    { label: "Model", value: "Tune 720BT" },
    { label: "Connectivity", value: "Bluetooth | Charging cable" },
    { label: "Bluetooth", value: "5.3" },
    { label: "Colors", value: "2 Options", isColor: true },
    { label: "Weight", value: "220g" },
    { label: "Size", value: "40mm" },
    { label: "Charging time", value: "2 hours from empty" },
    { label: "Playtime", value: "Up to 76 hours" },
  ];

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
            <Text style={styles.label}>Media</Text>
            <Text style={styles.mediaCount}>{selectedImages.length}/5</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.mediaRow}
          >
            {/* Upload Button */}
            <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
              <MaterialCommunityIcons
                name="camera-outline"
                size={30}
                color="#349488"
              />
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
          />

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your product..."
            multiline
            placeholderTextColor="#999"
          />
        </View>

        {/* Specification Section */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Specification</Text>
            <TouchableOpacity>
              <Text style={styles.addSpecText}>Add Specification</Text>
            </TouchableOpacity>
          </View>
          {specifications.map((spec, index) => (
            <TouchableOpacity key={index} style={styles.specItem}>
              <View>
                <Text style={styles.specLabel}>{spec.label}</Text>
                <View style={styles.row}>
                  {spec.isColor && <View style={styles.colorDot} />}
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings & Footer (Agertai thakbe) */}
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
          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  specItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  specLabel: { fontSize: 12, color: "#999", marginBottom: 2 },
  specValue: { fontSize: 14, color: "#333", fontWeight: "500" },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#349488",
    marginRight: 6,
  },
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
});

export default EditProduct;
