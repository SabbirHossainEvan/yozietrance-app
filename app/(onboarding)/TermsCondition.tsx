import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsCondition() {
  const [accepted, setAccepted] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Terms & Condition</Text>
          <TouchableOpacity onPress={() => router.back()}>
            {/* <Ionicons name="close" size={24} color="#333" /> */}
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome to Services App!</Text>
          <Text style={styles.textBody}>
            Accessing or using our services, you agree to be bound by these
            Terms of Service. If you do not agree with any part of the terms,
            you must not use our services.
          </Text>
          <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
          <Text style={styles.textBody}>
            • Use the service only for lawful purposes.
          </Text>
          <Text style={styles.textBody}>
            • Provide accurate information when required.
          </Text>
          <Text style={styles.textBody}>
            • Maintain the confidentiality of your account password.
          </Text>
          <Text style={styles.sectionTitle}>3. Intellectual Property</Text>
          <Text style={styles.textBody}>
            All content, trademarks, and data on this service, including but not
            limited to text, graphics, logos, and images, are the property of
            [Your Company Name]
          </Text>
          <Text style={styles.sectionTitle}>4. Disclaimers</Text>
          <Text style={styles.textBody}>
            The service is provided on an as is and as available basis. [Your
            Company Name] makes no warranties, expressed or implied, regarding
            the operation.{" "}
          </Text>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAccepted(!accepted)}
          >
            <View style={[styles.checkbox, accepted && styles.checked]}>
              {accepted && <Ionicons name="checkmark" size={14} color="#FFF" />}
            </View>
            <Text style={styles.checkboxText}>Accept terms & conditions</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !accepted && styles.disabledButton]}
          onPress={() => accepted && router.replace("/(onboarding)/GetStarted")}
          disabled={!accepted}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  welcomeText: { fontWeight: "bold", marginBottom: 10 },
  content: { marginBottom: 20 },
  textBody: { color: "#444", lineHeight: 20, marginBottom: 10 },
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 10 },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#2D8C8C",
    borderRadius: 4,
    marginRight: 10,
  },
  checked: { backgroundColor: "#2D8C8C" },
  checkboxText: { color: "#2D8C8C", fontWeight: "600" },
  nextButton: {
    backgroundColor: "#2D8C8C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: { backgroundColor: "#ccc" },
  nextText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
