import { useGetProfileQuery } from "@/store/api/authApiSlice";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons
} from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Modal, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const [isBusinessProfile, setIsBusinessProfile] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { data: profileData } = useGetProfileQuery({});
  const displayUser = profileData?.data;

  const onLogout = () => {
    setShowLogoutModal(false);
    router.replace("/(onboarding)/GetStarted");
  };

  const toggleSwitch = () => {
    setShowSwitchModal(true);
  };

  const onConfirmSwitch = () => {
    setIsBusinessProfile(!isBusinessProfile);
    setShowSwitchModal(false);
  };

  const ConfirmationModal = ({
    visible,
    onClose,
    onConfirm,
    title,
    subtitle,
    confirmText,
    confirmColor,
  }: any) => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
        <View style={{ width: "85%", backgroundColor: "#FFF", borderRadius: 20, padding: 25, alignItems: "center" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>{title}</Text>
          <Text style={{ fontSize: 14, color: "#666", textAlign: "center", marginBottom: 25 }}>{subtitle}</Text>
          <View style={{ flexDirection: "row", width: "100%" }}>
            <TouchableOpacity
              style={{ flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center", marginHorizontal: 5, backgroundColor: "#F5F5F5" }}
              onPress={onClose}
            >
              <Text style={{ color: "#333", fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center", marginHorizontal: 5, backgroundColor: confirmColor }}
              onPress={onConfirm}
            >
              <Text style={{ color: "#FFF", fontWeight: "bold" }}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  const userData = {
    name: displayUser?.fullName || displayUser?.name || "User",
    avatar: displayUser?.avatar || displayUser?.image || displayUser?.logo || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/*Account Information Card*/}

        {/* Profile Header */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Image
            source={{ uri: userData.avatar }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 12,
            }}
          />
          <Text style={{ fontSize: 22, fontWeight: "600", color: "#111" }}>
            {userData.name}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 1,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 20,
            }}
          >
            Account Information
          </Text>


          {/* Personal Info Link */}
          <TouchableOpacity
            onPress={() => router.push("/(user_screen)/ProfileInfoScreen")}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
              }}
            >
              <Ionicons name="person-outline" size={26} color="#4B5563" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#4B5563",
                  marginLeft: 14,
                  fontWeight: "500",
                }}
              >
                Personal info
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(screens)/transaction_history")}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
              }}
            >
              <AntDesign name="transaction" size={24} color="black" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#4B5563",
                  marginLeft: 14,
                  fontWeight: "500",
                }}
              >
                Transaction History
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color="black" />
          </TouchableOpacity>
        </View>


        {/* Setting Card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 1,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 20,
            }}
          >
            Setting
          </Text>

          {/* Switch Profile */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 14,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons name="people-outline" size={26} color="#4B5563" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#4B5563",
                  marginLeft: 14,
                  fontWeight: "500",
                }}
              >
                Switch profile
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#78788029", true: "#E3E6F0" }}
              thumbColor={isBusinessProfile ? "#278687" : "#fff"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isBusinessProfile}
            />
          </View>


          {/* Permission Link */}
          <TouchableOpacity
            onPress={() => router.push("/(screens)/permission")}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
              }}
            >
              <Feather name="check-circle" size={24} color="#4B5563" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#4B5563",
                  marginLeft: 14,
                  fontWeight: "500",
                }}
              >
                Permission
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color="black" />
          </TouchableOpacity>
          {/* Settings Link */}
          <TouchableOpacity
            onPress={() => router.push("/(screens)/settings")}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
              }}
            >
              <Ionicons name="settings-outline" size={26} color="#4B5563" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#4B5563",
                  marginLeft: 14,
                  fontWeight: "500",
                }}
              >
                Settings
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color="black" />
          </TouchableOpacity>
        </View>

        {/* Logout Card */}
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 1,
          }}
          onPress={() => setShowLogoutModal(true)}
        >
          <MaterialIcons name="logout" size={26} color="#4B5563" />
          <Text
            style={{
              fontSize: 16,
              color: "#4B5563",
              marginLeft: 14,
              fontWeight: "600",
            }}
          >
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
        onConfirm={onConfirmSwitch}
        title="Switch Profile?"
        subtitle={`Are you sure you want to switch to ${isBusinessProfile ? "Personal" : "Business"} profile?`}
        confirmText="Confirm"
        confirmColor="#2D8C8C"
      />

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={onLogout}
        title="Log Out?"
        subtitle="Are you sure you want to log out?"
        confirmText="Log Out"
        confirmColor="#FF3B30"
      />
    </SafeAreaView >
  );
};

export default ProfileScreen;
