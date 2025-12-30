import Slider from "@react-native-community/slider";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
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

const { width } = Dimensions.get("window");

export default function ScanQRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
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

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          zoom={zoom}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.unfocusedContainer}></View>
            <View style={styles.middleRow}>
              <View style={styles.unfocusedContainer}></View>
              <View style={styles.focusedContainer}>
                {/* Corner Markers */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              <View style={styles.unfocusedContainer}></View>
            </View>
            <View style={styles.unfocusedContainer}></View>
          </View>
        </CameraView>
      </View>

      {/* Zoom Controls */}
      <View style={styles.zoomContainer}>
        <Minus color="#1A1A1A" size={20} />
        <Slider
          style={{ width: width * 0.6, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={zoom}
          onValueChange={setZoom}
          minimumTrackTintColor="#2A8383"
          maximumTrackTintColor="#E8E8E8"
          thumbTintColor="#2A8383"
        />
        <Plus color="#1A1A1A" size={20} />
      </View>

      <Text style={styles.bottomHint}>
        Point your camera at the vendor s QR code or barcode
      </Text>

      {/* Manual Entry Button */}
      <TouchableOpacity
        style={styles.manualButton}
        activeOpacity={0.8}
        onPress={() => router.replace("/(user_screen)/UserModal")}
      >
        <Keyboard color="#4A4A4A" size={20} />
        <Text style={styles.manualButtonText}>Enter Code Manually</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAF9",
  },
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
    marginTop: 40,
    marginBottom: 40,
  },
  cameraContainer: {
    width: width * 0.8,
    height: width * 0.8,
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
  },
  overlay: { flex: 1 },
  middleRow: { flexDirection: "row", flex: 1 },
  focusedContainer: {
    width: width * 0.7,
    height: width * 0.7,
    position: "relative",
  },
  unfocusedContainer: { flex: 1 },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#7C7C7C",
    borderWidth: 2,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  zoomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    gap: 10,
  },
  bottomHint: {
    textAlign: "center",
    color: "#4A4A4A",
    fontSize: 14,
    paddingHorizontal: 40,
    marginTop: 60,
  },
  manualButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    gap: 10,
  },
  manualButtonText: { fontSize: 16, fontWeight: "600", color: "#4A4A4A" },
  button: {
    backgroundColor: "#2A8383",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: { color: "#FFF", fontWeight: "bold" },
});
