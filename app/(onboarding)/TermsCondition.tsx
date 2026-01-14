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

export default function TermsCondition() {
  const [accepted, setAccepted] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Terms & Condition</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.welcomeText}>Welcome to LlinkTo!</Text>
            <Text style={styles.textBody}>
              By accessing or using the Platform, you acknowledge that you have
              read, understood, and agree to be bound by these Terms. If you do
              not agree, you must not use the Platform.
            </Text>

            <Text style={styles.sectionTitle}>1. Definitions</Text>
            <Text style={styles.textBody}>
              • User means any individual or legal entity using the Platform.
            </Text>
            <Text style={styles.textBody}>
              • Buyer means a User purchasing products through the Platform.
            </Text>
            <Text style={styles.textBody}>
              • Supplier means a legally registered business entity offering
              products for sale.
            </Text>
            <Text style={styles.textBody}>
              • Order means a purchase commitment approved by the Supplier and
              paid.
            </Text>
            <Text style={styles.textBody}>
              • Completed Transaction means delivery is confirmed, no dispute is
              opened within 15 days, and payment is released.
            </Text>

            <Text style={styles.sectionTitle}>
              2. Eligibility and Registration
            </Text>
            <Text style={styles.textBody}>
              2.1 Supplier use is for legally registered business entities only.
            </Text>
            <Text style={styles.textBody}>
              2.2 Buyers must act on behalf of a business and for business
              purposes only.
            </Text>
            <Text style={styles.textBody}>
              2.3 LlinkTo may require identity verification (KYC/KYB) at any
              time.
            </Text>

            <Text style={styles.sectionTitle}>3. Role of the Platform</Text>
            <Text style={styles.textBody}>
              3.1 LlinkTo operates a technology platform facilitating
              transactions.
            </Text>
            <Text style={styles.textBody}>
              3.2 LlinkTo is not a party to any sales contract or logistics
              provider.
            </Text>

            <Text style={styles.sectionTitle}>4. Listings and Reviews</Text>
            <Text style={styles.textBody}>
              4.1 Suppliers are responsible for descriptions, pricing, and
              compliance.
            </Text>
            <Text style={styles.textBody}>
              4.3 Illegal, abusive, or misleading content is strictly
              prohibited.
            </Text>
            <Text style={styles.textBody}>
              4.4 All reviews are subject to approval by LlinkTo prior to
              publication.
            </Text>

            <Text style={styles.sectionTitle}>5. Orders and Disputes</Text>
            <Text style={styles.textBody}>
              5.1 An Order is created after Supplier approval and payment
              authorization.
            </Text>
            <Text style={styles.textBody}>
              5.3 Buyers may open a Dispute within 15 days for damaged or
              incorrect goods.
            </Text>
            <Text style={styles.textBody}>
              5.5 LlinkTo may require replacements, impose penalties, or
              withhold payouts.
            </Text>

            <Text style={styles.sectionTitle}>6. Payments and Fees</Text>
            <Text style={styles.textBody}>
              6.1 All payments are processed by licensed third-party providers
              (PSPs).
            </Text>
            <Text style={styles.textBody}>
              6.3 LlinkTo s service fee is deducted at the time of Supplier
              payout.
            </Text>

            <Text style={styles.sectionTitle}>7. Shipping and Taxes</Text>
            <Text style={styles.textBody}>
              7.1 Users are solely responsible for shipping, customs, and taxes.
            </Text>
            <Text style={styles.textBody}>
              7.2 Any logistics cooperation is provided for convenience only and
              without liability.
            </Text>

            <Text style={styles.sectionTitle}>8. Prohibited Products</Text>
            <Text style={styles.textBody}>
              The sale of illegal drugs, weapons, human organs, or counterfeit
              goods is strictly prohibited.
            </Text>

            <Text style={styles.sectionTitle}>9. Intellectual Property</Text>
            <Text style={styles.textBody}>
              All Platform IP, software, design, and content are owned by
              LlinkTo or its licensors.
            </Text>

            <Text style={styles.sectionTitle}>10. Limitation of Liability</Text>
            <Text style={styles.textBody}>
              LlinkTo is not liable for indirect damages. Total liability is
              limited to fees paid in the preceding 12 months.
            </Text>

            <Text style={styles.sectionTitle}>11. Indemnification</Text>
            <Text style={styles.textBody}>
              Users agree to hold LlinkTo harmless from claims arising from
              platform use or violations.
            </Text>

            <Text style={styles.sectionTitle}>
              12. Suspension and Termination
            </Text>
            <Text style={styles.textBody}>
              LlinkTo may terminate access for term breaches, legal risks, or
              authority requests.
            </Text>

            <Text style={styles.sectionTitle}>13. Changes to Terms</Text>
            <Text style={styles.textBody}>
              Continued use of the Platform constitutes acceptance of updated
              Terms.
            </Text>

            <Text style={styles.sectionTitle}>14. Governing Law</Text>
            <Text style={styles.textBody}>
              These Terms are governed by the laws of the State of Israel.
              Disputes must first be attempted via internal resolution.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAccepted(!accepted)}
          >
            <View style={[styles.checkbox, accepted && styles.checked]}>
              {accepted && <Ionicons name="checkmark" size={14} color="#FFF" />}
            </View>
            <Text style={styles.checkboxText}>Accept terms & conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, !accepted && styles.disabledButton]}
            onPress={() =>
              accepted && router.replace("/(onboarding)/GetStarted")
            }
            disabled={!accepted}
          >
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>
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
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  scrollContent: { marginBottom: 10 },
  welcomeText: { fontWeight: "bold", marginBottom: 10, fontSize: 16 },
  content: { marginBottom: 10 },
  textBody: { color: "#444", lineHeight: 20, marginBottom: 8 },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 15,
    marginBottom: 10,
    color: "#2D8C8C",
  },
  footer: { marginTop: 10 },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
