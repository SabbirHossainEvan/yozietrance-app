import { images } from "@/constants/import_images";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function GetStarted() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="light" backgroundColor="#2A8B8B" translucent={false} />

      {/* Top Container */}
      <View style={{ height: height * 0.65 }}>
        <ImageBackground
          source={images.getstart_image}
          style={{ flex: 1, width: "100%", height: "120%" }}
          resizeMode="cover"
        />
      </View>

      {/* Content Container */}
      <View
        style={{
          flex: 1,
          marginTop: -40,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          paddingHorizontal: 30,
          paddingTop: 45,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#1F1F1F",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Welcome to Inkooto
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#707070",
              textAlign: "center",
              lineHeight: 22,
              marginBottom: 45,
            }}
          >
            Connecting you with the best services, anytime, anywhere. Experience
            seamless support tailored just for you.
          </Text>

          {/* Get Started Button */}
          <TouchableOpacity
            style={{
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
            }}
            onPress={() => router.push("/(onboarding)/location-access")}
            activeOpacity={0.8}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}>
              Get Started
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={{ flexDirection: "row", marginTop: 25 }}>
            <Text style={{ color: "#707070", fontSize: 15 }}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <Text
                style={{
                  color: "#2A8B8B",
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}