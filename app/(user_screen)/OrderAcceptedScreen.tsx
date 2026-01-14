import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { router } from "expo-router";
import { CheckCircle2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. Define your navigation types to fix ts(7031)
type RootStackParamList = {
  Home: undefined;
  OrderHistory: undefined;
  OrderAccepted: undefined;
  // Add other screens here...
};

type Props = NativeStackScreenProps<RootStackParamList, "OrderAccepted">;

const OrderAcceptedScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Illustration Area */}
        <View style={styles.iconCircle}>
          <CheckCircle2 size={100} color="#3B8C8C" strokeWidth={1.5} />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Your Order has been{"\n"}accepted</Text>
          <Text style={styles.subtitle}>
            Your items have been placed and are on their way to being processed.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace("/(users)")}
          >
            <Text style={styles.primaryButtonText}>Back to home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF9",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  iconCircle: {
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#181725",
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#7C7C7C",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 15,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  primaryButton: {
    backgroundColor: "#3B8C8C",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E2E2",
  },
  secondaryButtonText: {
    color: "#181725",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default OrderAcceptedScreen;
