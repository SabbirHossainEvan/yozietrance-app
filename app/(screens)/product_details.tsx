import { useDeleteProductMutation, useGetProductByIdQuery } from '@/store/api/product_api_slice';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FALLBACK = 'https://via.placeholder.com/200';

const toNumber = (value: any, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const money = (value: any) => `$${toNumber(value).toFixed(2)}`;

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id as string, { skip: !id });
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const specs = useMemo(() => {
    const raw = product?.specification && typeof product.specification === 'object' ? product.specification : {};
    return Object.entries(raw)
      .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
      .map(([key, value]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        value: Array.isArray(value) ? value.join(', ') : String(value),
      }));
  }, [product]);

  const handleDelete = () => {
    Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct(id as string).unwrap();
            router.back();
          } catch {
            Alert.alert('Error', 'Failed to delete product');
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#278687" />
      </SafeAreaView>
    );
  }

  if (!product || isError) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={{ color: '#2A3237' }}>Product not found</Text>
      </SafeAreaView>
    );
  }

  const status = !product.isAvailable
    ? { label: 'Draft', bg: '#F0F3F4', text: '#56616A' }
    : Number(product.stockQuantity) < 10
      ? { label: 'Low Stock', bg: '#FFF4D9', text: '#A56700' }
      : { label: 'Active', bg: '#E8F8EE', text: '#248D5A' };

  const images = Array.isArray(product.images) && product.images.length ? product.images : [FALLBACK];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios-new" size={22} color="#1F2A30" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.mediaHeader}>
            <Text style={styles.sectionTitle}>Media</Text>
            <Text style={styles.mediaCount}>{images.length}/5</Text>
          </View>
          <Image source={{ uri: images[0] }} style={styles.heroImage} />
        </View>

        <View style={styles.card}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Text style={[styles.statusText, { color: status.text }]}>{status.label}</Text>
            </View>
          </View>
          <View style={styles.skuRatingRow}>
            <Text style={styles.sku}>SKU: {product.sku || 'N/A'}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={13} color="#F0B429" />
              <Text style={styles.ratingText}>{toNumber(product.averageRating).toFixed(1)} ({product.totalReviews || 0})</Text>
            </View>
          </View>
          <Text style={styles.price}>{money(product.price)}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>On Stock</Text>
              <Text style={styles.statValue}>{product.stockQuantity || 0}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Processing</Text>
              <Text style={styles.statValue}>{product?._count?.orderItems || 0}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Sold</Text>
              <Text style={styles.statValue}>{product?._count?.orderItems || 0}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description || 'No description provided.'}</Text>
        </View>

        {specs.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Specification</Text>
            {specs.map((spec, index) => (
              <View key={`${spec.label}-${index}`} style={[styles.specRow, index < specs.length - 1 ? styles.specBorder : null]}>
                <Text style={styles.specLabel}>{spec.label}</Text>
                <Text style={styles.specValue}>{spec.value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} disabled={isDeleting}>
            <Ionicons name="trash-outline" size={18} color="#EF595A" />
            <Text style={styles.deleteText}>{isDeleting ? 'Deleting...' : 'Delete'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push({ pathname: '/(screens)/EditProduct', params: { id: product.id } })}
          >
            <Feather name="edit-2" size={16} color="#FFF" />
            <Text style={styles.editText}>Edit Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F6F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F6F5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2A30' },
  content: { paddingHorizontal: 14, paddingBottom: 20 },
  card: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDE6EA', borderRadius: 12, padding: 12, marginBottom: 10 },
  mediaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2A30' },
  mediaCount: { color: '#8A969D', fontSize: 12 },
  heroImage: { width: '100%', height: 190, borderRadius: 10, backgroundColor: '#E8EEF1' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productName: { fontSize: 18, fontWeight: '700', color: '#1F2A30', flex: 1, paddingRight: 8 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  skuRatingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  sku: { fontSize: 12, color: '#6E7B84' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, color: '#4F5D66', marginLeft: 6 },
  price: { marginTop: 8, fontSize: 20, fontWeight: '700', color: '#278687' },
  statsRow: { flexDirection: 'row', marginTop: 10, gap: 8 },
  statBox: { flex: 1, backgroundColor: '#F4F8F8', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  statLabel: { fontSize: 11, color: '#6E7B84' },
  statValue: { marginTop: 2, fontSize: 16, fontWeight: '700', color: '#1F2A30' },
  description: { marginTop: 4, fontSize: 13, color: '#58656E', lineHeight: 20 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9 },
  specBorder: { borderBottomWidth: 1, borderBottomColor: '#EDF2F4' },
  specLabel: { fontSize: 13, color: '#6E7B84' },
  specValue: { fontSize: 13, color: '#1F2A30', fontWeight: '600', maxWidth: '55%', textAlign: 'right' },
  footerRow: { flexDirection: 'row', marginTop: 4, marginBottom: 6 },
  deleteBtn: { flex: 1, height: 44, borderRadius: 10, borderWidth: 1.4, borderColor: '#F2B6BA', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginRight: 8, gap: 6, backgroundColor: '#FFF6F6' },
  deleteText: { color: '#EF595A', fontWeight: '700' },
  editBtn: { flex: 1, height: 44, borderRadius: 10, backgroundColor: '#278687', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginLeft: 8, gap: 6 },
  editText: { color: '#FFF', fontWeight: '700' },
});
