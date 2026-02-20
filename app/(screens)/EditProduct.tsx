import { useGetCategoriesByVendorQuery } from '@/store/api/categoryApiSlice';
import { useCreateProductMutation, useGetProductByIdQuery, useUpdateProductMutation } from '@/store/api/product_api_slice';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SpecItem = { label: string; value: string };

const getEntityId = (entity: any) => entity?.id || entity?._id;

export default function EditProduct() {
  const router = useRouter();
  const { id, categoryId: categoryIdParam } = useLocalSearchParams();
  const productId = id ? String(id) : '';
  const user = useAppSelector(selectCurrentUser);

  const vendorId =
    (user as any)?.vendor?.id ||
    (user as any)?.vendor?._id ||
    user?.id ||
    (user as any)?._id;

  const { data: categories = [] } = useGetCategoriesByVendorQuery(vendorId, { skip: !vendorId });
  const { data: productData, isLoading: isLoadingProduct } = useGetProductByIdQuery(productId, { skip: !productId });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [minimumQuantity, setMinimumQuantity] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<SpecItem[]>([]);

  const [isSpecModalVisible, setIsSpecModalVisible] = useState(false);
  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  useEffect(() => {
    if (!productData) return;

    setName(productData.name || '');
    setDescription(productData.description || '');
    setPrice(productData.price != null ? String(productData.price) : '');
    setStockQuantity(productData.stockQuantity != null ? String(productData.stockQuantity) : '');
    setMinimumQuantity(productData.minimulAuantity != null ? String(productData.minimulAuantity) : '');
    setIsActive(productData.isAvailable ?? true);
    setSelectedImages(Array.isArray(productData.images) ? productData.images : []);

    // Only map actual existing specs from backend; nothing else is auto-inserted.
    const mappedSpecs =
      productData.specification && typeof productData.specification === 'object'
        ? Object.entries(productData.specification)
            .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
            .map(([key, value]) => ({
              label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
              value: Array.isArray(value) ? value.join(', ') : String(value),
            }))
        : [];
    setSpecifications(mappedSpecs);
  }, [productData]);

  useEffect(() => {
    const targetCategoryId = productData?.categoryId || categoryIdParam;
    if (!targetCategoryId) return;
    const found = categories.find((cat: any) => String(getEntityId(cat)) === String(targetCategoryId));
    setSelectedCategoryId(String(targetCategoryId));
    if (found) setSelectedCategoryName(found.name);
  }, [productData, categoryIdParam, categories]);

  const categoryOptions = useMemo(() => (Array.isArray(categories) ? categories : []), [categories]);

  const pickImage = async () => {
    if (selectedImages.length >= 5) {
      Alert.alert('Limit Reached', 'You can upload up to 5 images.');
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Photo library permission is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setSelectedImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addSpec = () => {
    const label = newSpecLabel.trim();
    const value = newSpecValue.trim();
    if (!label || !value) {
      Alert.alert('Missing fields', 'Please enter both specification key and value.');
      return;
    }
    setSpecifications((prev) => [...prev, { label, value }]);
    setNewSpecLabel('');
    setNewSpecValue('');
    setIsSpecModalVisible(false);
  };

  const removeSpec = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim() || !price.trim() || !stockQuantity.trim() || !selectedCategoryId) {
      Alert.alert('Missing fields', 'Please fill product name, price, quantity and category.');
      return;
    }
    if (!selectedImages.length) {
      Alert.alert('Missing media', 'Please add at least one product image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('description', description.trim());
    formData.append('price', String(price).trim());
    formData.append('stockQuantity', String(stockQuantity).trim());
    formData.append('isAvailable', String(isActive));
    formData.append('categoryId', selectedCategoryId);
    formData.append('minimulAuantity', String(minimumQuantity || '0'));

    // Preserve existing backend behavior: imageUrl for existing remote URLs, images for new files.
    selectedImages.forEach((uri, index) => {
      if (uri.startsWith('http')) {
        formData.append('imageUrl', uri);
      } else {
        formData.append('images', {
          uri,
          name: `product_${index}.jpg`,
          type: 'image/jpeg',
        } as any);
      }
    });

    // Keep specs client-side display only until backend supports this field.
    // This ensures "only added specs are shown" behavior in UI.

    try {
      if (productId) {
        await updateProduct({ id: productId, formData }).unwrap();
        Alert.alert('Success', 'Product updated successfully.');
      } else {
        await createProduct(formData).unwrap();
        Alert.alert('Success', 'Product created successfully.');
      }
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to save product.');
    }
  };

  if (productId && isLoadingProduct) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#278687" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1F2A30" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{productId ? 'Edit Product' : 'Add Product'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Media</Text>
            <Text style={styles.mediaCount}>{selectedImages.length}/5</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
              <View style={styles.cameraCircle}>
                <Ionicons name="camera" size={20} color="#FFF" />
              </View>
            </TouchableOpacity>
            {selectedImages.map((uri, index) => (
              <View key={`${uri}-${index}`} style={styles.imageWrap}>
                <Image source={{ uri }} style={styles.mediaImage} />
                <TouchableOpacity style={styles.removeBadge} onPress={() => removeImage(index)}>
                  <Ionicons name="close-circle" size={20} color="#F15B63" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Product details</Text>
          <Text style={styles.inputLabel}>Product Name</Text>
          <TextInput style={styles.input} placeholder="e.g. Headphones" value={name} onChangeText={setName} />
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Describe your product..." multiline value={description} onChangeText={setDescription} />
          <Text style={styles.inputLabel}>Category</Text>
          <TouchableOpacity style={styles.inputPicker} onPress={() => setIsCategoryModalVisible(true)}>
            <Text style={{ color: selectedCategoryName ? '#1F2A30' : '#8A969D' }}>{selectedCategoryName || 'Add Category'}</Text>
          </TouchableOpacity>
          <Text style={styles.inputLabel}>Quantity</Text>
          <TextInput style={styles.input} placeholder="123" keyboardType="numeric" value={stockQuantity} onChangeText={setStockQuantity} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <Text style={styles.inputLabel}>Price</Text>
          <TextInput style={styles.input} placeholder="e.g. $20" keyboardType="numeric" value={price} onChangeText={(text) => setPrice(text.replace('$', ''))} />
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Specification</Text>
            <TouchableOpacity onPress={() => setIsSpecModalVisible(true)}>
              <Text style={styles.addSpec}>Add Specification</Text>
            </TouchableOpacity>
          </View>
          {specifications.map((spec, index) => (
            <View key={`${spec.label}-${index}`} style={styles.specCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.specLabel}>{spec.label}</Text>
                <Text style={styles.specValue}>{spec.value}</Text>
              </View>
              <TouchableOpacity onPress={() => removeSpec(index)}>
                <Ionicons name="close-circle-outline" size={20} color="#95A2AA" />
              </TouchableOpacity>
            </View>
          ))}
          {specifications.length === 0 ? <Text style={styles.emptySpec}>No specification added yet.</Text> : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.activeLabel}>Active Status</Text>
              <Text style={styles.activeSub}>Product will be visible in store</Text>
            </View>
            <Switch trackColor={{ false: '#D8E0E4', true: '#2E908F' }} thumbColor="#FFF" value={isActive} onValueChange={setIsActive} />
          </View>
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveText}>Save</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={isSpecModalVisible} transparent animationType="fade" onRequestClose={() => setIsSpecModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Specification</Text>
              <TouchableOpacity onPress={() => setIsSpecModalVisible(false)}>
                <Ionicons name="close" size={24} color="#003D4D" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalInputRow}>
              <TextInput style={styles.modalInput} placeholder="e.g. Brand" value={newSpecLabel} onChangeText={setNewSpecLabel} />
              <TextInput style={styles.modalInput} placeholder="e.g. JBL" value={newSpecValue} onChangeText={setNewSpecValue} />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setIsSpecModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={addSpec}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isCategoryModalVisible} transparent animationType="slide" onRequestClose={() => setIsCategoryModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setIsCategoryModalVisible(false)}>
                <Ionicons name="close" size={24} color="#003D4D" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 350 }}>
              {categoryOptions.map((cat: any) => {
                const catId = String(getEntityId(cat));
                const selected = selectedCategoryId === catId;
                return (
                  <TouchableOpacity
                    key={catId}
                    style={styles.categoryItem}
                    onPress={() => {
                      setSelectedCategoryId(catId);
                      setSelectedCategoryName(cat.name);
                      setIsCategoryModalVisible(false);
                    }}
                  >
                    <Text style={[styles.categoryText, selected ? { color: '#2E908F', fontWeight: '700' } : null]}>{cat.name}</Text>
                    {selected ? <Ionicons name="checkmark-circle" size={20} color="#2E908F" /> : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F6F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F6F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2A30' },
  content: { paddingHorizontal: 14, paddingBottom: 24 },
  card: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDE6EA', borderRadius: 12, padding: 12, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2A30' },
  mediaCount: { fontSize: 12, color: '#8A969D' },
  uploadBox: { width: 74, height: 74, borderRadius: 10, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#2E908F', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  cameraCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#2E908F', justifyContent: 'center', alignItems: 'center' },
  imageWrap: { marginRight: 10, position: 'relative' },
  mediaImage: { width: 74, height: 74, borderRadius: 10, backgroundColor: '#E8EEF1' },
  removeBadge: { position: 'absolute', top: -6, right: -6, backgroundColor: '#FFF', borderRadius: 12 },
  inputLabel: { marginTop: 9, marginBottom: 5, fontSize: 12, color: '#6E7B84' },
  input: { height: 42, borderRadius: 8, backgroundColor: '#F2F6F6', borderWidth: 1, borderColor: '#E1E8EB', paddingHorizontal: 12, color: '#1F2A30' },
  textArea: { height: 78, textAlignVertical: 'top', paddingTop: 10 },
  inputPicker: { height: 42, borderRadius: 8, backgroundColor: '#F2F6F6', borderWidth: 1, borderColor: '#E1E8EB', paddingHorizontal: 12, justifyContent: 'center' },
  addSpec: { fontSize: 12, color: '#2E908F', fontWeight: '600' },
  specCard: { borderRadius: 8, borderWidth: 1, borderColor: '#E6ECEF', backgroundColor: '#F7FAFA', paddingHorizontal: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  specLabel: { fontSize: 12, color: '#6E7B84' },
  specValue: { fontSize: 13, color: '#1F2A30', fontWeight: '600', marginTop: 1 },
  emptySpec: { marginTop: 8, fontSize: 12, color: '#8A969D' },
  activeLabel: { fontSize: 14, fontWeight: '600', color: '#1F2A30' },
  activeSub: { fontSize: 11, color: '#8A969D', marginTop: 2 },
  footerRow: { flexDirection: 'row', marginTop: 2 },
  cancelBtn: { flex: 1, height: 44, borderRadius: 10, borderWidth: 1.3, borderColor: '#F09AA0', justifyContent: 'center', alignItems: 'center', marginRight: 8, backgroundColor: '#FFF7F7' },
  cancelText: { color: '#E36570', fontWeight: '700' },
  saveBtn: { flex: 1, height: 44, borderRadius: 10, backgroundColor: '#2E908F', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  saveText: { color: '#FFF', fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', paddingHorizontal: 20 },
  modalCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#003D4D' },
  modalInputRow: { flexDirection: 'row', marginTop: 14, gap: 10 },
  modalInput: { flex: 1, height: 56, borderRadius: 12, borderWidth: 1, borderColor: '#CFD9DE', paddingHorizontal: 12, fontSize: 17, color: '#1F2A30' },
  modalActions: { flexDirection: 'row', marginTop: 16, gap: 10 },
  modalCancel: { flex: 1, height: 52, borderRadius: 20, borderWidth: 1.5, borderColor: '#2E908F', justifyContent: 'center', alignItems: 'center' },
  modalCancelText: { color: '#2E908F', fontSize: 16, fontWeight: '700' },
  modalSave: { flex: 1, height: 52, borderRadius: 20, backgroundColor: '#2E908F', justifyContent: 'center', alignItems: 'center' },
  modalSaveText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  categoryItem: { height: 48, borderBottomWidth: 1, borderBottomColor: '#EDF2F4', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryText: { fontSize: 15, color: '#1F2A30' },
});
