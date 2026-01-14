import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Print from "expo-print";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. Navigation types definition
type RootStackParamList = {
  ExportInvoice: undefined;
  Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "ExportInvoice">;

const ExportInvoiceScreen = ({ navigation }: Props) => {
  // 2. PDF generation function
  const handleDownloadReceipt = async () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #181725; background-color: #fff; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-card { display: flex; justify-content: space-between; align-items: center; border: 1px solid #f0f0f0; padding: 20px; border-radius: 15px; margin-bottom: 20px; }
            .details-card { border: 1px solid #f0f0f0; padding: 25px; border-radius: 20px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 15px; }
            .divider { border-top: 1px solid #f0f0f0; margin: 20px 0; }
            .dashed-divider { border-top: 1px dashed #e2e2e2; margin: 20px 0; }
            .label { color: #7c7c7c; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
            .value { font-size: 14px; font-weight: 600; }
            .item-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
            .total-row { display: flex; justify-content: space-between; align-items: center; }
            .total-label { font-size: 18px; font-weight: 700; }
            .total-price { font-size: 22px; font-weight: 700; color: #3B8C8C; }
            .teal { color: #3B8C8C; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">RECEIPT</h1>
            <p style="color: #7c7c7c;">Order #ORD-9921</p>
          </div>

          <div class="company-card">
            <div>
              <h2 style="margin: 0; font-size: 18px;">TechGadgets Inc.</h2>
              <p style="color: #7c7c7c; font-size: 12px; margin: 5px 0;">123 Innovation Drive, Tech City<br>Tax ID: US-8829102</p>
            </div>
            <div style="text-align: right;">
              <p class="label">Total Amount</p>
              <p style="font-size: 24px; font-weight: 700; margin: 0;">$90.60</p>
            </div>
          </div>

          <div class="details-card">
            <div class="row">
              <div>
                <p class="label">Date Issued</p>
                <p class="value">January 1, 2026</p>
              </div>
              <div style="text-align: right;">
                <p class="label">Bill To</p>
                <p class="value">Alex Johnson</p>
              </div>
            </div>

            <div class="divider"></div>

            <h3 style="margin-bottom: 15px;">Order Items</h3>
            <div class="item-row">
              <span>Wireless Headphones (x2)</span>
              <span class="value">$40.00</span>
            </div>
            <div class="item-row">
              <span>USB-C Fast Charging Cable (x1)</span>
              <span class="value">$20.00</span>
            </div>
            <div class="item-row">
                <span>Wireless Noise-Canceling (x2)</span>
                <span class="value">$20.00</span>
            </div>

            <div class="divider"></div>

            <div class="row">
              <span class="label">Subtotal</span>
              <span class="value">$80.00</span>
            </div>
            <div class="row">
              <span class="label">Tax (7.5%)</span>
              <span class="value">$10.00</span>
            </div>
            <div class="row">
              <span class="label">Shipping</span>
              <span class="value">$0.60</span>
            </div>

            <div class="dashed-divider"></div>

            <div class="total-row">
              <span class="total-label">Total Payment</span>
              <span class="total-price">$90.60</span>
            </div>
          </div>
          
          <p style="text-align: center; color: #7c7c7c; font-size: 10px; margin-top: 50px;">
            Thank you for shopping with TechGadgets Inc.!
          </p>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    } catch (error) {
      Alert.alert("Error", "Unable to generate or download the receipt.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#181725" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export invoice</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Company Info Card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.companyInfo}>
              <View style={styles.placeholderLogo}>
                <Ionicons name="business" size={24} color="#3B8C8C" />
              </View>
              <View>
                <Text style={styles.companyName}>TechGadgets Inc.</Text>
                <Text style={styles.smallText}>
                  123 Innovation Drive, Tech City
                </Text>
                <Text style={styles.smallText}>Tax ID: US-8829102</Text>
              </View>
            </View>
            <View style={styles.alignRight}>
              <Text style={styles.labelSmall}>Invoice Total</Text>
              <Text style={styles.totalAmountHeader}>$9.60</Text>
            </View>
          </View>
        </View>

        {/* Detailed Invoice Card */}
        <View style={styles.invoiceDetailsCard}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.labelSmall}>Date Issued</Text>
              <Text style={styles.boldText}>January 1, 2026</Text>
              <Text style={styles.boldText}>04:38 AM</Text>
            </View>
            <View style={styles.alignRight}>
              <Text style={styles.labelSmall}>From</Text>
              <Text style={styles.boldText}>TechGadgets Inc.</Text>
              <Text style={styles.smallText}>123 Innovation Drive</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.labelSmall}>Bill to</Text>
              <Text style={styles.boldText}>Alex Johnson</Text>
              <Text style={styles.smallText}>alex.j@example.com</Text>
            </View>
            <View style={styles.alignRight}>
              <Text style={styles.labelSmall}>Order ID</Text>
              <Text style={styles.boldText}>ORD-9921</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Order items</Text>
          {[1, 2, 3].map((_, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>Wireless Headphones</Text>
                <Text style={styles.itemQty}>x2 $123.00</Text>
              </View>
              <Text style={styles.itemPrice}>$20.00</Text>
            </View>
          ))}

          <View style={styles.dashedDivider} />

          <View style={styles.paymentRow}>
            <Text style={styles.labelSmall}>Subtotal</Text>
            <Text style={styles.boldText}>$80.00</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.labelSmall}>Tax (7.5%)</Text>
            <Text style={styles.boldText}>$10.00</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.labelSmall}>Shipping</Text>
            <Text style={styles.boldText}>$0.60</Text>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>$90.60</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownloadReceipt}
        >
          <Ionicons name="download-outline" size={24} color="#FFF" />
          <Text style={styles.downloadButtonText}>Download Receipt</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAF9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#181725" },
  scrollContent: { padding: 20 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  invoiceDetailsCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  companyInfo: { flexDirection: "row", alignItems: "center", flex: 0.7 },
  placeholderLogo: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#EFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  companyName: { fontSize: 15, fontWeight: "700", color: "#181725" },
  smallText: { fontSize: 11, color: "#7C7C7C" },
  labelSmall: { fontSize: 12, color: "#7C7C7C" },
  totalAmountHeader: { fontSize: 18, fontWeight: "700" },
  alignRight: { alignItems: "flex-end" },
  boldText: { fontSize: 13, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 15 },
  dashedDivider: {
    height: 1,
    borderTopWidth: 1,
    borderColor: "#E2E2E2",
    borderStyle: "dashed",
    marginVertical: 15,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 15 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  itemName: { fontSize: 13, color: "#181725" },
  itemQty: { fontSize: 11, color: "#7C7C7C" },
  itemPrice: { fontSize: 14, fontWeight: "600" },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: { fontSize: 18, fontWeight: "700", color: "#181725" },
  totalValue: { fontSize: 18, fontWeight: "700", color: "#3B8C8C" },
  downloadButton: {
    backgroundColor: "#3B8C8C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 25,
    marginBottom: 30,
  },
  downloadButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default ExportInvoiceScreen;
