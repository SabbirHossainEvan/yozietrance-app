import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface InfoItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  isLast?: boolean;
}

const InfoItem = ({ icon, label, value, isLast }: InfoItemProps) => (
  <View style={[styles.infoRow, isLast && { borderBottomWidth: 0 }]}>
    <View style={styles.iconWrapper}>
      <MaterialCommunityIcons name={icon} size={22} color="#888" />
    </View>
    <View style={styles.textWrapper}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const ProfileInfoScreen = () => {
  const [profileImage, setProfileImage] = useState(
    "https://xsgames.co/randomusers/assets/avatars/male/74.jpg"
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="chevron-left" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Info</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => router.push("/(user_screen)/EditProfileScreen")}
        >
          <MaterialCommunityIcons
            name="account-edit-outline"
            size={26}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileSection}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: profileImage }} style={styles.avatar} />

            <TouchableOpacity style={styles.cameraBadge} onPress={pickImage}>
              <MaterialCommunityIcons
                name="camera-outline"
                size={16}
                color="#FFF"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Rokey</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <InfoItem
            icon="account-outline"
            label="Full Name"
            value="Rokey Mahmud"
          />
          <InfoItem
            icon="calendar-month-outline"
            label="Date of Birth"
            value="May 15, 1990"
            isLast
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <InfoItem
            icon="email-outline"
            label="Email"
            value="alice@example.com"
          />
          <InfoItem
            icon="phone-outline"
            label="Phone"
            value="+1 (555) 123-4567"
            isLast
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Identification</Text>
          <InfoItem
            icon="card-account-details-outline"
            label="ID Type"
            value="Passport"
          />
          <InfoItem
            icon="card-text-outline"
            label="ID Number"
            value="P123456789"
            isLast
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FBF9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  headerBtn: {
    padding: 5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 25,
  },
  imageWrapper: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1E5D68",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#444",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  iconWrapper: {
    width: 40,
    alignItems: "flex-start",
  },
  textWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
});

export default ProfileInfoScreen;
