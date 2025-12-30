import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subText}>Login to your account</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.form}>
          <Text style={styles.label}>Enter Your E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="E-mail address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Enter Your Number</Text>
          <TextInput
            style={styles.input}
            placeholder="phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <View style={styles.passwordInputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#ccc"
                style={styles.lockIcon}
              />
              <TextInput
                style={styles.passwordInput}
                placeholder="********"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#ccc"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxActive]}
              >
                {rememberMe && (
                  <Ionicons name="checkmark" size={12} color="white" />
                )}
              </View>
              <Text style={styles.optionText}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                style={styles.forgotText}
                onPress={() => router.replace("/(auth)/forgot-password")}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Social Media Login */}
        <View style={styles.socialSection}>
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or Continue With</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialIconsRow}>
            <TouchableOpacity style={styles.socialIconCircle}>
              <FontAwesome name="google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIconCircle}>
              <FontAwesome name="apple" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIconCircle}>
              <FontAwesome name="facebook" size={24} color="#4267B2" />
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don t have an account? </Text>
            <TouchableOpacity>
              <Text
                style={styles.signUpText}
                onPress={() => router.replace("/(auth)/signup")}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBFCFC" },
  scrollContent: { paddingHorizontal: 25, paddingTop: 40, paddingBottom: 20 },
  header: { marginBottom: 30 },
  welcomeText: { fontSize: 28, fontWeight: "bold", color: "#333" },
  subText: { fontSize: 16, color: "#777", marginTop: 5 },
  form: { width: "100%" },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    elevation: 1,
  },
  passwordContainer: { marginTop: 5 },
  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 55,
    elevation: 1,
  },
  lockIcon: { marginRight: 10 },
  passwordInput: { flex: 1, fontSize: 16 },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  checkboxContainer: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: { backgroundColor: "#2A8383", borderColor: "#2A8383" },
  optionText: { color: "#777", fontSize: 13 },
  forgotText: { color: "#FF7F7F", fontSize: 13 },
  loginButton: {
    backgroundColor: "#2A8383",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  loginButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  socialSection: { marginTop: 40, alignItems: "center" },
  dividerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#EEE" },
  dividerText: { paddingHorizontal: 10, color: "#777", fontSize: 13 },
  socialIconsRow: { flexDirection: "row", gap: 20 },
  socialIconCircle: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  footerRow: { flexDirection: "row", marginTop: 30 },
  footerText: { color: "#777" },
  signUpText: { color: "#333", fontWeight: "bold" },
});
