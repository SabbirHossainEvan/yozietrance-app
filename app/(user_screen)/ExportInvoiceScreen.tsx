import { useGetOrderByIdQuery } from '@/store/api/orderApiSlice';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useMemo } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const IMAGE_FALLBACK = 'https://via.placeholder.com/64';

const toNumber = (value: any, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatMoney = (value: any) => `$${toNumber(value).toFixed(2)}`;
const getItems = (order: any) => (Array.isArray(order?.orderItems) ? order.orderItems : []);

const ExportInvoiceScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: order, isLoading } = useGetOrderByIdQuery(id as string, { skip: !id });

  const items = useMemo(() => getItems(order), [order]);
  const subtotal = toNumber(order?.subtotal);
  const tax = toNumber(order?.taxAmount, 0);
  const shipping = toNumber(order?.shippingCost, 0);
  const discount = toNumber(order?.discountAmount);
  const total = toNumber(order?.totalAmount);

  const handleDownloadReceipt = async () => {
    if (!order) return;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #1f2a30; }
            .card { border: 1px solid #dbe5e9; border-radius: 10px; padding: 12px; margin-bottom: 10px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 6px; }
            .title { font-weight: 700; margin-bottom: 8px; }
            .dash { border-top: 1px dashed #cdd8dd; margin: 8px 0; }
          </style>
        </head>
        <body>
          <h2>Export invoice</h2>
          <div class="card">
            <div class="row"><span>Store</span><span>${order?.vendor?.storename || order?.vendor?.fullName || 'Vendor'}</span></div>
            <div class="row"><span>Order ID</span><span>${order?.orderNumber || order?.id}</span></div>
            <div class="row"><span>Invoice Total</span><span>${formatMoney(total)}</span></div>
          </div>
          <div class="card">
            <div class="title">Order items</div>
            ${items.map((item: any) => `
              <div class="row">
                <span>${item?.product?.name || 'Product'} x${item?.quantity || 1}</span>
                <span>${formatMoney(item?.unitPrice || item?.totalPrice)}</span>
              </div>
            `).join('')}
          </div>
          <div class="card">
            <div class="title">Payment details</div>
            <div class="row"><span>Subtotal</span><span>${formatMoney(subtotal)}</span></div>
            <div class="row"><span>Tax</span><span>${formatMoney(tax)}</span></div>
            <div class="row"><span>Shipping</span><span>${formatMoney(shipping)}</span></div>
            <div class="row"><span>Discount</span><span>${formatMoney(discount)}</span></div>
            <div class="dash"></div>
            <div class="row"><strong>Total</strong><strong>${formatMoney(total)}</strong></div>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      Alert.alert('Error', 'Unable to generate or download the receipt.');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#2A8C8B" />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Order not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1C252B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export invoice</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.vendorRow}>
            <Image source={{ uri: order?.vendor?.logoUrl || IMAGE_FALLBACK }} style={styles.logo} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.vendorName}>{order?.vendor?.storename || order?.vendor?.fullName || 'Vendor'}</Text>
              <Text style={styles.smallText} numberOfLines={2}>{order?.vendor?.address || 'Address unavailable'}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.label}>Invoice Total</Text>
              <Text style={styles.invoiceTotal}>{formatMoney(total)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Date Issued</Text>
              <Text style={styles.value}>{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</Text>
              <Text style={styles.value}>{order?.createdAt ? new Date(order.createdAt).toLocaleTimeString() : ''}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.label}>From</Text>
              <Text style={styles.value}>{order?.vendor?.storename || order?.vendor?.fullName || 'Vendor'}</Text>
              <Text style={styles.smallText}>{order?.vendor?.country || ''}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Bill to</Text>
              <Text style={styles.value}>{order?.buyer?.fullName || 'Customer'}</Text>
              <Text style={styles.smallText}>{order?.buyer?.phone || ''}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.label}>Order ID</Text>
              <Text style={styles.value}>{order?.orderNumber || order?.id}</Text>
              <Text style={styles.label}>Payment Date</Text>
              <Text style={styles.smallText}>{order?.payment?.createdAt ? new Date(order.payment.createdAt).toLocaleString() : 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Order items</Text>
          {items.map((item: any) => (
            <View key={item?.id} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item?.product?.name || 'Product'}</Text>
                <Text style={styles.itemMeta}>x{item?.quantity || 1}</Text>
              </View>
              <Text style={styles.itemPrice}>{formatMoney(item?.unitPrice || item?.totalPrice)}</Text>
            </View>
          ))}

          <View style={styles.dashed} />

          <Text style={styles.sectionTitle}>Payment details</Text>
          <View style={styles.paymentRow}><Text style={styles.label}>Subtotal</Text><Text style={styles.value}>{formatMoney(subtotal)}</Text></View>
          <View style={styles.paymentRow}><Text style={styles.label}>Tax(7.5%)</Text><Text style={styles.value}>{formatMoney(tax)}</Text></View>
          <View style={styles.paymentRow}><Text style={styles.label}>Shipping</Text><Text style={styles.value}>{formatMoney(shipping)}</Text></View>
          <View style={styles.paymentRow}><Text style={styles.label}>Discount</Text><Text style={styles.value}>{formatMoney(discount)}</Text></View>
          <View style={styles.dashed} />
          <View style={styles.paymentRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalLabel}>{formatMoney(total)}</Text></View>
        </View>

        <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadReceipt}>
          <Ionicons name="download-outline" size={20} color="#FFF" />
          <Text style={styles.downloadButtonText}>Download Receipt</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F7F6' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F7F6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1C252B' },
  content: { paddingHorizontal: 14, paddingBottom: 24 },
  card: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E0E8EB', padding: 12, marginBottom: 10 },
  vendorRow: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8EEF1' },
  vendorName: { fontSize: 14, fontWeight: '700', color: '#1F2A30' },
  smallText: { fontSize: 11, color: '#7A8891', marginTop: 2 },
  label: { fontSize: 11, color: '#6F7D86' },
  value: { fontSize: 12, color: '#1F2A30', fontWeight: '600', marginTop: 2 },
  invoiceTotal: { fontSize: 18, fontWeight: '700', color: '#1F2A30' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  divider: { height: 1, backgroundColor: '#E8EEF1', marginVertical: 10 },
  dashed: { borderStyle: 'dashed', borderWidth: 1, borderColor: '#CDD8DD', marginVertical: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1F2A30', marginBottom: 8 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  itemName: { fontSize: 13, color: '#1F2A30' },
  itemMeta: { fontSize: 11, color: '#7A8891' },
  itemPrice: { fontSize: 13, fontWeight: '700', color: '#1F2A30' },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  totalLabel: { fontSize: 15, fontWeight: '700', color: '#1F2A30' },
  downloadButton: { backgroundColor: '#2A8C8B', height: 46, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8, marginTop: 8 },
  downloadButtonText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});

export default ExportInvoiceScreen;
