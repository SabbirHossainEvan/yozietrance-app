import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function UserSelection() {
  const [selectedRole, setSelectedRole] = useState<"user" | "vendor" | null>(
    null
  );

  const handleSelection = (role: "user" | "vendor") => {
    setSelectedRole(role);

    if (role === "user") {
      console.log(role);
      router.push("/(users)");
    } else {
      router.push("/login");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <View style={styles.cardContainer}>
          {/* User Card */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.roleCard,
              selectedRole === "user" ? styles.activeCard : styles.inactiveCard,
            ]}
            onPress={() => handleSelection("user")}
          >
            <Feather name="users" size={width * 0.08} color={selectedRole === "user" ? "white" : "#2A8383"} />
            <Text
              style={[
                styles.roleText,
                { color: selectedRole === "user" ? "white" : "#2A8383" },
              ]}
            >
              User
            </Text>
          </TouchableOpacity>

          {/* Vendor Card */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.roleCard,
              selectedRole === "vendor"
                ? styles.activeCard
                : styles.inactiveCard,
            ]}
            onPress={() => handleSelection("vendor")}
          >
            <MaterialCommunityIcons
              name="handshake-outline"
              size={width * 0.1}
              color={selectedRole === "vendor" ? "white" : "#2A8383"}
            />
            <Text
              style={[
                styles.roleText,
                { color: selectedRole === "vendor" ? "white" : "#2A8383" },
              ]}
            >
              Vendor
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFB",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  roleCard: {
    width: width * 0.42,
    height: width * 0.42,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  activeCard: {
    backgroundColor: "#2A8383",
    borderColor: "#2A8383",
  },
  inactiveCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E0E0E0",
  },
  roleText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "600",
  },
});
