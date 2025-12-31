import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot Password</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.textContainer}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Don t worry! Enter your registered email or phone number.
            </Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Content</Text>
            <Text style={styles.inputGuide}>
              Enter your email or phone number
            </Text>

            <View style={styles.inputWrapper}>
              <Mail color="#999" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email or phone"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => router.push("/(auth)/OTPVerification")}
            >
              <Text style={styles.sendButtonText}>Send Reset Code</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Remembered your password?{" "}
              <Text
                style={styles.loginLink}
                onPress={() => router.push("/(auth)/login")}
              >
                Login
              </Text>
            </Text>
            <TouchableOpacity>
              <Text style={styles.helpText}>Need Help?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: "#F8FAF9",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  backButton: {
    padding: 4,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  textContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#7C7C7C",
    lineHeight: 24,
  },
  formSection: {
    marginBottom: 40,
  },
  label: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 20,
  },
  inputGuide: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4A4A4A",
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#2D8C8C",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  footerContainer: {
    alignItems: "center",
    gap: 15,
    marginTop: 20,
  },
  footerText: {
    fontSize: 15,
    color: "#7C7C7C",
  },
  loginLink: {
    color: "#2D8C8C",
    fontWeight: "700",
  },
  helpText: {
    fontSize: 15,
    color: "#7C7C7C",
  },
});

export default ForgotPasswordScreen;
