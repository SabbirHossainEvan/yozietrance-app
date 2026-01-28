

import Slider from "@react-native-community/slider";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { ChevronLeft, Keyboard, Minus, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VendorModal from "./UserModal";

const { width } = Dimensions.get("window");

export default function ScanQRScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dynamicSize = width * 0.6 + zoom * 100;

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      // If the QR code data is a vendorCode or a URL containing it, handle it here
      // For now, let's assume it leads to connection or specific screen
      router.push("/(user_screen)/ChatDetailsScreen");
    }
  };

  const handleManualConnect = (code: string) => {
    setIsModalVisible(false);
    // Connection logic will be handled inside UserModal or here via props
    // The user request says "the User/Buyer will be connected with that Vendor."
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ChevronLeft
            color="#1A1A1A"
            size={28}
            onPress={() => router.back()}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <View style={{ width: 28 }} />
      </View>

      <Text style={styles.instructionText}>Scan for auto fill your info</Text>

      {/* Camera and Dynamic Focus Overlay */}
      <View style={styles.cameraWrapper}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          zoom={zoom}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        >
          <View style={styles.overlayContainer}>
            <View style={styles.maskOutter}>
              <View
                style={{
                  width: dynamicSize,
                  height: dynamicSize,
                  position: "relative",
                  transitionDuration: "0.1s",
                }}
              >
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>
          </View>
        </CameraView>
      </View>

      {/* Zoom Controls */}
      <View style={styles.zoomContainer}>
        <TouchableOpacity onPress={() => setZoom(Math.max(0, zoom - 0.1))}>
          <Minus color="#1A1A1A" size={22} />
        </TouchableOpacity>

        <Slider
          style={{ width: width * 0.6, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={zoom}
          onValueChange={(value) => setZoom(value)}
          minimumTrackTintColor="#2A8B8B"
          maximumTrackTintColor="#D1D1D1"
          thumbTintColor="#2A8B8B"
        />

        <TouchableOpacity onPress={() => setZoom(Math.min(1, zoom + 0.1))}>
          <Plus color="#1A1A1A" size={22} />
        </TouchableOpacity>
      </View>

      <Text style={styles.bottomHint}>
        Point your camera at the vendor s QR code or barcode
      </Text>

      <TouchableOpacity
        style={styles.manualButton}
        activeOpacity={0.8}
        onPress={() => setIsModalVisible(true)}
      >
        <Keyboard color="#4A4A4A" size={20} />
        <Text style={styles.manualButtonText}>Enter Code Manually</Text>
      </TouchableOpacity>

      <VendorModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConnect={handleManualConnect}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
  instructionText: {
    textAlign: "center",
    color: "#7C7C7C",
    fontSize: 14,
    marginTop: 20,
    marginBottom: 20,
  },
  cameraWrapper: {
    width: width * 0.9,
    height: width * 1.1,
    alignSelf: "center",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  overlayContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  maskOutter: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#2A8B8B",
    borderWidth: 5,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 10,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 10,
  },

  zoomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    gap: 12,
  },
  bottomHint: {
    textAlign: "center",
    color: "#666666",
    fontSize: 14,
    paddingHorizontal: 50,
    marginTop: 30,
  },
  manualButton: {
    flexDirection: "row",
    backgroundColor: "#F2F9F7",
    marginHorizontal: 25,
    height: 56,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    gap: 10,
  },
  manualButtonText: { fontSize: 16, fontWeight: "600", color: "#2A8B8B" },
  button: {
    backgroundColor: "#2A8B8B",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: { color: "#FFF", fontWeight: "bold" },
});
