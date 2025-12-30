// import { useRouter } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import React from "react";
// import {
//   Dimensions,
//   Image,
//   ImageBackground,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const { height } = Dimensions.get("window");

// export default function GetStarted() {
//   const router = useRouter();

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar style="dark" />

//       {/* Upper Illustration Section */}
//       <View style={styles.imageContainer}>
//         <Image
//           source={require("../../assets/users/Ecommerce campaign-bro 1.png")}
//           style={styles.image}
//           resizeMode="contain"
//         />
//       </View>

//       {/* Bottom Content Section with Background Image Shape */}
//       <ImageBackground
//         source={require("../../assets/users/frame_2147229865.png")}
//         style={styles.contentCard}
//         resizeMode="stretch"
//       >
//         <View style={styles.innerContent}>
//           <Text style={styles.title}>Welcome to Inkooto</Text>
//           <Text style={styles.subtitle}>
//             Connecting you with the best services, anytime, anywhere. Experience
//             seamless support tailored just for you.
//           </Text>

//           {/* Get Started Button */}
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => router.push("/(onboarding)/location-access")}
//           >
//             <Text style={styles.buttonText}>Get Started</Text>
//           </TouchableOpacity>

//           {/* Login Link */}
//           <View style={styles.loginContainer}>
//             <Text style={styles.loginText}>Already have an account? </Text>
//             <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
//               <Text style={styles.loginLink}>Login</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ImageBackground>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F2F9F7",
//   },
//   imageContainer: {
//     flex: 1.2,
//     justifyContent: "center",
//     padding: 10,
//     marginTop: 60,
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//   },
//   contentCard: {
//     height: height * 0.55,
//     width: "100%",
//     justifyContent: "flex-end",
//   },
//   innerContent: {
//     paddingHorizontal: 30,
//     paddingBottom: 50,
//     alignItems: "center",
//     width: "100%",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//     marginBottom: 15,
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#E0F2F1",
//     textAlign: "center",
//     lineHeight: 22,
//     marginBottom: 40,
//   },
//   button: {
//     backgroundColor: "#FFFFFF",
//     width: "100%",
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   buttonText: {
//     color: "#000000",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   loginContainer: {
//     flexDirection: "row",
//     marginTop: 20,
//   },
//   loginText: {
//     color: "#E0F2F1",
//     fontSize: 14,
//   },
//   loginLink: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "bold",
//     textDecorationLine: "underline",
//   },
// });

import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function GetStarted() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#2A8B8B" translucent={false} />

      <View style={styles.topContainer}>
        <ImageBackground
          source={require("../../assets/images/Group 2085663099.png")}
          style={styles.bgImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.innerContent}>
          <Text style={styles.title}>Welcome to Inkooto</Text>
          <Text style={styles.subtitle}>
            Connecting you with the best services, anytime, anywhere. Experience
            seamless support tailored just for you.
          </Text>

          {/* Get Started Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(onboarding)/location-access")}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topContainer: {
    height: height * 0.65,
    width: "100%",
  },
  bgImage: {
    flex: 1,
    width: "100%",
    height: "120%",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 45,
  },
  innerContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F1F1F",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#707070",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 45,
  },
  button: {
    backgroundColor: "#2A8B8B",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#2A8B8B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 25,
  },
  loginText: {
    color: "#707070",
    fontSize: 15,
  },
  loginLink: {
    color: "#2A8B8B",
    fontSize: 15,
    fontWeight: "bold",
  },
});
