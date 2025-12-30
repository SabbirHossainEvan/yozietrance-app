import { router } from "expo-router";
import {
  Bell,
  Package,
  QrCode,
  TrendingUp,
  Truck,
  Zap,
} from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const Dashboard: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity
            onPress={() => router.push("/(user_screen)/ProfileInfoScreen")}
            activeOpacity={0.7}
          >
            <Image
              source={{
                uri: "https://xsgames.co/randomusers/assets/avatars/male/74.jpg",
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View style={styles.userText}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.userName}>Rokey Mahmud</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Bell
            color="#2D8C8C"
            size={24}
            onPress={() => router.replace("/(user_screen)/Notification")}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View
              style={[styles.statIconCircle, { backgroundColor: "#F0F9F9" }]}
            >
              <TrendingUp color="#2D8C8C" size={20} />
            </View>
            <Text style={styles.statNumber}>56</Text>
            <Text style={styles.statLabel}>Completed Order</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[styles.statIconCircle, { backgroundColor: "#F0F9F9" }]}
            >
              <Zap color="#2D8C8C" size={20} />
            </View>
            <Text style={styles.statNumber}>85</Text>
            <Text style={styles.statLabel}>Active Orders</Text>
          </View>
        </View>

        {/* QR Scan Section */}
        <TouchableOpacity
          style={styles.qrSection}
          onPress={() => router.replace("/(user_screen)/ScanQRCode")}
        >
          <View style={styles.qrTextContent}>
            <Text style={styles.qrTitle}>Scan Vendor QR Code</Text>
            <Text style={styles.qrSubtitle}>
              Connect with local vendors instantly
            </Text>
          </View>
          <View style={styles.qrIconBox}>
            <QrCode color="#FFFFFF" size={32} />
          </View>
        </TouchableOpacity>

        {/* How It Works Section */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.sectionTitleWhite}>How It Works</Text>
          <View style={styles.stepsList}>
            <Text style={styles.stepItem}>
              1. Scan a vendor s QR code or barcode
            </Text>
            <Text style={styles.stepItem}>
              2. Browse their catalog and chat directly
            </Text>
            <Text style={styles.stepItem}>
              3. Negotiate prices and place orders
            </Text>
            <Text style={styles.stepItem}>4. Track delivery in real-time</Text>
          </View>
        </View>

        {/* Recent Tracking Section */}
        <Text style={styles.sectionTitleMain}>Recent Tracking order</Text>
        <View style={styles.trackingCard}>
          <Text style={styles.orderId}>Order id : 1923838</Text>

          <View style={styles.trackingStatusRow}>
            <View style={styles.statusItem}>
              <Truck color="#2D8C8C" size={24} />
              <Text style={styles.statusLabel}>Pickup</Text>
            </View>
            <View style={styles.statusItem}>
              <Truck color="#2D8C8C" size={24} />
              <Text style={styles.statusLabel}>On going</Text>
            </View>
            <View style={styles.statusItem}>
              <Package color="#999" size={24} />
              <Text style={styles.statusLabel}>Delivery</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userText: {
    justifyContent: "center",
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D8C8C",
  },
  userName: {
    fontSize: 14,
    color: "#7C7C7C",
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  statCard: {
    width: (width - 55) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D8C8C",
  },
  statLabel: {
    fontSize: 13,
    color: "#7C7C7C",
    marginTop: 4,
  },
  qrSection: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    elevation: 2,
  },
  qrTextContent: {
    flex: 1,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D8C8C",
  },
  qrSubtitle: {
    fontSize: 13,
    color: "#7C7C7C",
    marginTop: 5,
  },
  qrIconBox: {
    width: 56,
    height: 56,
    backgroundColor: "#2D8C8C",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  howItWorksCard: {
    backgroundColor: "#2D8C8C",
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
  },
  sectionTitleWhite: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  stepsList: {
    gap: 10,
  },
  stepItem: {
    color: "#E0F2F2",
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitleMain: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D8C8C",
    marginBottom: 15,
  },
  trackingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },
  orderId: {
    fontSize: 14,
    color: "#4A4A4A",
    marginBottom: 20,
  },
  trackingStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statusItem: {
    alignItems: "center",
    gap: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: "#4A4A4A",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#E8E8E8",
    borderRadius: 4,
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2D8C8C",
    borderRadius: 4,
    width: "45%", // Dynamic width based on order progress
  },
});

export default Dashboard;
