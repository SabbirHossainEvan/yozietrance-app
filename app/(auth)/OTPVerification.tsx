import { useOTPVerificationMutation } from "@/store/api/authApiSlice";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ShieldCheck } from "lucide-react-native";
import React, { useRef, useState } from "react";
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

const OTPVerification: React.FC = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);

  const [verifyOtp, { isLoading }] = useOTPVerificationMutation();

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await verifyOtp({ email, otp: otpString }).unwrap();
      // Assuming verifyOtp returns success, navigate to SetNewPassword
      // We pass email and potentially the OTP (if reset endpoint needs it) to the next screen
      router.push({ pathname: "/(auth)/SetNewPassword", params: { email, otp: otpString } });
    } catch (err) {
      console.error("OTP Verification failed", err);
      alert("Verification failed: " + ((err as any)?.data?.message || "Invalid OTP"));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>OTP Verification</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.centerSection}>
            <View style={styles.iconCircle}>
              <ShieldCheck color="#FFFFFF" size={40} fill="#2D8C8C" />
            </View>
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>
              We ve sent a 6-digit code to {email || "your email"}
            </Text>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={[
                  styles.otpInput,
                  otp[index] ? styles.otpInputActive : null,
                ]}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                ref={(el) => {
                  if (el) inputs.current[index] = el;
                }}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.pasteButton}>
            <Text style={styles.pasteCodeText}>Paste Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.verifyButton, isLoading && { opacity: 0.7 }]}
            activeOpacity={0.8}
            onPress={handleVerify}
            disabled={isLoading}
          >
            <Text style={styles.verifyButtonText}>{isLoading ? "Verifying..." : "Verify"}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.resendText}>
              Did n t receive the code?{" "}
              <TouchableOpacity>
                <Text style={styles.resendLink}>Resend</Text>
              </TouchableOpacity>
            </Text>
            <TouchableOpacity
              style={styles.bottomLoginBtn}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.bottomLoginText}>Back to Login</Text>
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
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
  },
  centerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2D8C8C",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#7C7C7C",
    textAlign: "center",
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  otpInputActive: {
    borderColor: "#2D8C8C",
  },
  pasteButton: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  pasteCodeText: {
    color: "#1A1A1A",
    fontSize: 15,
    fontWeight: "600",
  },
  verifyButton: {
    backgroundColor: "#2D8C8C",
    width: "100%",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    elevation: 3,
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
  },
  resendText: {
    color: "#7C7C7C",
    fontSize: 14,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  resendLink: {
    color: "#1A1A1A",
    fontWeight: "700",
    marginLeft: 5,
  },
  bottomLoginBtn: {
    paddingVertical: 10,
  },
  bottomLoginText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
});

export default OTPVerification;
