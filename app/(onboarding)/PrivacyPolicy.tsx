import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicy() {
  const [accepted, setAccepted] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Privacy & Policy</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          <Text style={styles.updateDate}>Last updated on 23 August 2025</Text>
          <Text style={styles.textBody}>
            We collect personal information that you voluntarily provide to us
            when you register on the [app/service], express an interest in
            obtaining information about us or our products and services...
          </Text>
          <Text style={styles.sectionTitle}>1. Information we collect</Text>
          <Text style={styles.textBody}>
            The personal information that we collect depends on the context of
            your interactions with us and the [app/service]...
          </Text>
          <Text style={styles.sectionTitle}>
            2.Information use collected
          </Text>
          <Text style={styles.textBody}>
            We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you,
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
        </ScrollView>

        <TouchableOpacity
          style={[styles.nextButton, !accepted && styles.disabledButton]}
          onPress={() =>
            accepted && router.push("/(onboarding)/TermsCondition")
          }
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
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  updateDate: { color: "#777", marginBottom: 15 },
  content: { marginBottom: 20 },
  textBody: { color: "#444", lineHeight: 20, marginBottom: 15 },
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
  checkboxText: { color: "#2D8C8C", fontWeight: "600",},
  nextButton: {
    backgroundColor: "#2D8C8C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: { backgroundColor: "#ccc" },
  nextText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
