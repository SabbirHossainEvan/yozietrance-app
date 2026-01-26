// import { useSignupMutation } from "@/store/api/authApiSlice";
// import React, { useState } from "react";
// import {
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// import { router } from "expo-router";
// import { Apple, Chrome, Facebook } from "lucide-react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const SignUpScreen: React.FC = () => {
//   const [fullName, setFullName] = useState<string>("");
//   const [contact, setContact] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

//   const [signup, { isLoading, error }] = useSignupMutation();

//   const handleSignup = async () => {
//     if (!acceptedTerms) {
//       alert("Please accept the terms and conditions");
//       return;
//     }

//     try {
//       // Assuming the API expects email, password, and confirmPassword (or similar)
//       // The user request mentioned confirmPassword but the UI doesn't have it.
//       // I will send password as confirmPassword for now based on the request body example,
//       // or just send what is available. The prompt body example was:
//       // "email": "...", "password": "...", "confirmPassword": "..."
//       // The UI shows specific fields: Full Name, Email/Phone, Password.
//       // I will map 'contact' to 'email' for the API request.

//       const payload = {
//         name: fullName, // Added name as it is in the form
//         email: contact,
//         password: password,
//         confirmPassword: password, // sending same password as per implied requirement from user provided JSON
//       };

//       const userData = await signup(payload).unwrap();
//       console.log('Signup successful', userData);
//       // Navigate to next screen, e.g. user-selection or login
//       router.push("/user-selection");
//     } catch (err) {
//       console.error('Signup failed', err);
//       // You might want to show a toast or alert here
//       alert("Signup failed: " + (err as any)?.data?.message || JSON.stringify(err));
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Header Section */}
//           <View style={styles.headerContainer}>
//             <Text style={styles.title}>Sign Up</Text>
//             <Text style={styles.subtitle}>
//               It only takes a minute to create your account
//             </Text>
//           </View>

//           {/* Form Section */}
//           <View style={styles.formContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Full name"
//               placeholderTextColor="#999"
//               value={fullName}
//               onChangeText={setFullName}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="E-mail address or phone number"
//               placeholderTextColor="#999"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               value={contact}
//               onChangeText={setContact}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               placeholderTextColor="#999"
//               secureTextEntry
//               value={password}
//               onChangeText={setPassword}
//             />

//             {/* Terms and Conditions */}
//             <TouchableOpacity
//               style={styles.checkboxContainer}
//               onPress={() => setAcceptedTerms(!acceptedTerms)}
//             >
//               <View
//                 style={[
//                   styles.checkbox,
//                   acceptedTerms && styles.checkboxChecked,
//                 ]}
//               />
//               <Text style={styles.termsText}>Accept terms & conditions</Text>
//             </TouchableOpacity>

//             {/* Sign Up Button */}
//             <TouchableOpacity
//               style={[styles.signUpButton, isLoading && { opacity: 0.7 }]}
//               onPress={handleSignup}
//               disabled={isLoading}
//             >
//               <Text style={styles.signUpButtonText}>
//                 {isLoading ? "Signing Up..." : "Sign Up"}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Divider */}
//           <View style={styles.dividerContainer}>
//             <View style={styles.line} />
//             <Text style={styles.dividerText}>Or Continue With</Text>
//             <View style={styles.line} />
//           </View>

//           {/* Social Icons */}
//           <View style={styles.socialContainer}>
//             <TouchableOpacity style={styles.socialIcon}>
//               <Chrome color="#EA4335" size={24} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.socialIcon}>
//               <Apple color="#000" size={24} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.socialIcon}>
//               <Facebook color="#1877F2" size={24} />
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8FAF9",
//   },
//   scrollContent: {
//     paddingHorizontal: 24,
//     paddingTop: 60,
//     paddingBottom: 40,
//   },
//   headerContainer: {
//     marginBottom: 40,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     color: "#1A1A1A",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 15,
//     color: "#7C7C7C",
//     lineHeight: 22,
//   },
//   formContainer: {
//     gap: 16,
//   },
//   input: {
//     height: 56,
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#E8E8E8",
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     color: "#000",
//   },
//   checkboxContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 8,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 1.5,
//     borderColor: "#7C7C7C",
//     borderRadius: 4,
//     marginRight: 10,
//   },
//   checkboxChecked: {
//     backgroundColor: "#2D8C8C",
//     borderColor: "#2D8C8C",
//   },
//   termsText: {
//     fontSize: 14,
//     color: "#7C7C7C",
//   },
//   signUpButton: {
//     backgroundColor: "#2D8C8C",
//     height: 56,
//     borderRadius: 12,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 24,
//   },
//   signUpButtonText: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   dividerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 40,
//   },
//   line: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#E0E0E0",
//   },
//   dividerText: {
//     marginHorizontal: 10,
//     color: "#7C7C7C",
//     fontSize: 14,
//   },
//   socialContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 20,
//   },
//   socialIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#FFFFFF",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
// });

// export default SignUpScreen;



import { useSignupMutation } from "@/store/api/authApiSlice";
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

import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { router } from "expo-router";
import { Apple, Chrome, Facebook } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUpScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const [contact, setContact] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // Confirm password state add kora hoyeche
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  const [signup, { isLoading, error }] = useSignupMutation();

  const handleSignup = async () => {
    if (!acceptedTerms) {
      alert("Please accept the terms and conditions");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const payload = {
        email: contact,
        password: password,
        confirmPassword: confirmPassword,
      };

      const response = await signup(payload).unwrap();
      console.log('Signup successful', response);

      const { data } = response;
      if (data && data.accessToken) {
        dispatch(setCredentials({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken }));
        router.replace("/(onboarding)/user-selection");
      } else {
        // Fallback or error handling if structure is different, though likely same
        console.error("Signup response missing data/token", response);
        alert("Signup successful but failed to auto-login. Please login manually.");
        router.push("/(auth)/login");
      }
    } catch (err) {
      console.error('Signup failed', err);
      alert("Signup failed: " + ((err as any)?.data?.message || "Something went wrong"));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>
              It only takes a minute to create your account
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="E-mail address or phone number"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={contact}
              onChangeText={setContact}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {/* Terms and Conditions */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
            >
              <View
                style={[
                  styles.checkbox,
                  acceptedTerms && styles.checkboxChecked,
                ]}
              />
              <Text style={styles.termsText}>Accept terms & conditions</Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signUpButton, isLoading && { opacity: 0.7 }]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <Text style={styles.signUpButtonText}>
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>Or Continue With</Text>
            <View style={styles.line} />
          </View>

          {/* Social Icons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialIcon}>
              <Chrome color="#EA4335" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Apple color="#000" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Facebook color="#1877F2" size={24} />
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#7C7C7C",
    lineHeight: 22,
  },
  formContainer: {
    gap: 16,
  },
  input: {
    height: 58, // Height ektu barano hoyeche image-er moto korte
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E2E2", // Image-er moto light border
    borderRadius: 10, // Rounded corners
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#7C7C7C",
    borderRadius: 4,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#2D8C8C",
    borderColor: "#2D8C8C",
  },
  termsText: {
    fontSize: 14,
    color: "#7C7C7C",
  },
  signUpButton: {
    backgroundColor: "#2D8C8C",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 40,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#7C7C7C",
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default SignUpScreen;