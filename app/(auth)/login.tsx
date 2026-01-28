


import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLoginMutation } from "@/store/api/authApiSlice";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    console.log('Attempting login with:', emailOrPhone);
    try {
      const userData = await login({ email: emailOrPhone, password }).unwrap();
      console.log('Login successful, complete response:', JSON.stringify(userData, null, 2));

      const { data } = userData;

      if (!data || !data.accessToken) {
        console.error('Login response missing data or accessToken!', userData);
        alert("Login failed: Invalid server response");
        return;
      }

      console.log('User data from response:', JSON.stringify(data.user, null, 2));

      // Save to AsyncStorage
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      if (data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
      }

      dispatch(setCredentials({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken }));

      // Auto-navigate based on userType
      const userType = data.user?.userType;
      console.log('User type detected:', userType);

      if (userType === 'vendor') {
        console.log('Redirecting vendor to (tabs)...');
        router.replace("/(tabs)");
      } else if (userType === 'buyer') {
        console.log('Redirecting buyer to (users)...');
        router.replace("/(users)");
      } else {
        console.log('Unknown userType, redirecting to user-selection...');
        router.replace("/(onboarding)/user-selection");
      }
    } catch (err) {
      console.error('Login error full object:', JSON.stringify(err, null, 2));
      alert("Login failed: " + ((err as any)?.data?.message || "Check your credentials"));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="#333" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subText}>Login to your account</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Enter Your E-mail Or Number</Text>
          <TextInput
            style={styles.input}
            placeholder="E-mail address or number"
            placeholderTextColor="#999"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordInputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#ccc" style={styles.lockIcon} />
            <TextInput
              style={styles.passwordInput}
              placeholder="********"
              placeholderTextColor="#ccc"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Ionicons
                name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                size={22}
                color="#ccc"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.optionText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.loginButtonText}>Login</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.socialSection}>
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or Continue With</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialIconsRow}>
            <TouchableOpacity style={styles.socialIconCircle}><FontAwesome name="google" size={24} color="#DB4437" /></TouchableOpacity>
            <TouchableOpacity style={styles.socialIconCircle}><FontAwesome name="apple" size={24} color="black" /></TouchableOpacity>
            <TouchableOpacity style={styles.socialIconCircle}><FontAwesome name="facebook" size={24} color="#4267B2" /></TouchableOpacity>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don t have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FBFB" },
  backButton: { paddingHorizontal: 20, paddingTop: 10 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 20 },
  header: { marginTop: 20, marginBottom: 30 },
  welcomeText: { fontSize: 28, fontWeight: "bold", color: "#1A1A1A" },
  subText: { fontSize: 16, color: "#7C7C7C", marginTop: 5 },
  form: { width: "100%" },
  label: { fontSize: 15, fontWeight: "500", color: "#444", marginBottom: 10, marginTop: 15 },
  input: {
    height: 58,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
  },
  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 58,
  },
  lockIcon: { marginRight: 12 },
  passwordInput: { flex: 1, height: "100%", fontSize: 16 },
  optionsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15 },
  checkboxContainer: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#D1D1D1",
    borderRadius: 10, // Circular checkbox
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: { borderColor: "#2D8C8C" },
  checkboxInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#2D8C8C" },
  optionText: { color: "#7C7C7C", fontSize: 14 },
  forgotText: { color: "#FF7070", fontSize: 14, fontWeight: "500" }, // Red text
  loginButton: {
    backgroundColor: "#3A8B8B", // Teal color from image
    height: 58,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  loginButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  socialSection: { marginTop: 40, alignItems: "center" },
  dividerRow: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E0E0E0" },
  dividerText: { paddingHorizontal: 15, color: "#7C7C7C", fontSize: 13 },
  socialIconsRow: { flexDirection: "row", gap: 20 },
  socialIconCircle: {
    width: 55, height: 55, borderRadius: 28, backgroundColor: "#FFF",
    justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#EAEAEA",
  },
  footerRow: { flexDirection: "row", marginTop: 35 },
  footerText: { color: "#7C7C7C", fontSize: 15 },
  signUpText: { color: "#1A1A1A", fontWeight: "bold", fontSize: 15 },
});