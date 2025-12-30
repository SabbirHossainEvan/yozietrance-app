import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  // Modal States
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const userProfileImage =
    "https://xsgames.co/randomusers/assets/avatars/male/74.jpg";

  const sections = [
    {
      title: "Account Information",
      data: [
        {
          id: "1",
          title: "Profile Info",
          icon: "account-outline",
          onPress: () => router.push("/(user_screen)/ProfileInfoScreen"),
        },
      ],
    },
    {
      title: "Policy Center",
      data: [
        {
          id: "2",
          title: "Privacy Policy",
          icon: "shield-check-outline",
          onPress: () => router.push("/(user_screen)/PrivacyPolicyScreen"),
        },
        {
          id: "3",
          title: "Terms & Condition",
          icon: "file-document-outline",
          onPress: () => router.push("/(user_screen)/TermsAndConditionScreen"),
        },
      ],
    },
    {
      title: "Settings",
      data: [
        {
          id: "4",
          title: "Help & Support",
          icon: "help-circle-outline",
          onPress: () => router.push("/(user_screen)/HelpSupportScreen"),
        },
        {
          id: "5",
          title: "Log Out",
          icon: "logout",
          onPress: () => setLogoutModalVisible(true),
        },
        {
          id: "6",
          title: "Delete Account",
          icon: "trash-can-outline",
          color: "#FF5A5F",
          onPress: () => setDeleteModalVisible(true),
        },
      ],
    },
  ];

  const ConfirmationModal = ({
    visible,
    onClose,
    onConfirm,
    title,
    subtitle,
    confirmText,
    confirmColor,
    icon,
  }: any) => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <MaterialCommunityIcons name={icon} size={50} color={confirmColor} />
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalSubtitle}>{subtitle}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: confirmColor }]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: userProfileImage }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.userName}>Rokey</Text>
        </View>

        {/* Menu Sections */}
        {sections.map((section, index) => (
          <View key={index} style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            <View style={styles.card}>
              {section.data.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    itemIndex === section.data.length - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.menuItemLeft}>
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={22}
                      color={item.color || "#666"}
                    />
                    <Text
                      style={[
                        styles.menuItemText,
                        item.color ? { color: item.color } : null,
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#CCC"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* --- Log Out Modal --- */}
      <ConfirmationModal
        visible={isLogoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={() => {
          setLogoutModalVisible(false);
          console.log("Logged Out");
        }}
        title="Log Out?"
        subtitle="Are you sure you want to sign out of your account?"
        confirmText="Log Out"
        confirmColor="#333"
        icon="logout-variant"
      />

      {/* --- Delete Account Modal --- */}
      <ConfirmationModal
        visible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={() => {
          setDeleteModalVisible(false);
          console.log("Account Deleted");
        }}
        title="Delete Account?"
        subtitle="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Delete"
        confirmColor="#FF5A5F"
        icon="alert-circle-outline"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAF9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  scrollContent: { paddingBottom: 40 },
  profileSection: { alignItems: "center", marginVertical: 20 },
  imageContainer: {
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: "#fff",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 55,
  },
  userName: { marginTop: 12, fontSize: 20, fontWeight: "bold", color: "#333" },
  sectionContainer: { paddingHorizontal: 16, marginBottom: 20 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#888",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EEE",
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  menuItemText: { marginLeft: 15, fontSize: 16, color: "#444" },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  modalButtons: { flexDirection: "row", width: "100%" },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: { backgroundColor: "#F5F5F5" },
  cancelButtonText: { color: "#333", fontWeight: "bold" },
  confirmButtonText: { color: "#FFF", fontWeight: "bold" },
});

export default ProfileScreen;
