import { router } from "expo-router";
import { ChevronLeft, Eye, EyeOff } from "lucide-react-native";
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

const SetNewPasswordScreen: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton}>
          <ChevronLeft
            onPress={() => router.push("/(auth)/login")}
            color="#1A1A1A"
            size={28}
          />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Back to Login</Text>
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
          {/* Titles Section */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Set a new password</Text>
            <Text style={styles.subtitle}>
              Please set a new password for your account to continue
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* New Password Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#999"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIcon}
              >
                {showNewPassword ? (
                  <Eye color="#999" size={22} />
                ) : (
                  <EyeOff color="#999" size={22} />
                )}
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                {showConfirmPassword ? (
                  <Eye color="#999" size={22} />
                ) : (
                  <EyeOff color="#999" size={22} />
                )}
              </TouchableOpacity>
            </View>

            {/* Update Button */}
            <TouchableOpacity style={styles.updateButton} activeOpacity={0.8}>
              <Text style={styles.updateButtonText}>Update Password</Text>
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
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
  },
  backButton: {
    padding: 4,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
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
    fontSize: 15,
    color: "#7C7C7C",
    lineHeight: 22,
  },
  formContainer: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  eyeIcon: {
    padding: 4,
  },
  updateButton: {
    backgroundColor: "#2D8C8C",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    // Optional shadow for depth
    shadowColor: "#2D8C8C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default SetNewPasswordScreen;
