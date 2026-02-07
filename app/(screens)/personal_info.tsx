import { useGetProfileQuery } from "@/store/api/authApiSlice";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PersonalInfoScreen = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: profileData } = useGetProfileQuery({});
  const displayUser = profileData?.data || currentUser;

  // Initialize state with Redux data or defaults
  const [user, setUser] = useState({
    name: displayUser?.name || displayUser?.fullName || displayUser?.fulllName || "User",
    avatar: displayUser?.logo || displayUser?.image || displayUser?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    dob: displayUser?.dob || "N/A",
    email: displayUser?.email || "N/A",
    phone: displayUser?.phone || displayUser?.phoneNumber || "N/A",
    idType: displayUser?.idType || "National ID",
    idNumber: displayUser?.idNumber || displayUser?.nationalIdNumber || "N/A",
  });

  // Effect to update local state when profileData changes
  React.useEffect(() => {
    if (displayUser) {
      setUser({
        name: displayUser.name || displayUser.fullName || displayUser.fulllName || "User",
        avatar: displayUser.logo || displayUser.image || displayUser.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        dob: displayUser.dob || "N/A",
        email: displayUser.email || "N/A",
        phone: displayUser.phone || displayUser.phoneNumber || "N/A",
        idType: displayUser.idType || "National ID",
        idNumber: displayUser.idNumber || displayUser.nationalIdNumber || "N/A",
      });
    }
  }, [displayUser]);


  // Function to handle image picker
  const handleImagePicker = async () => {
    // Request permissions
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Please grant camera roll permissions to upload an image."
      );
      return;
    }

    // Open gallery directly
    openGallery();
  };

  // Open gallery
  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setUser((prev) => ({ ...prev, avatar: result.assets[0].uri }));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open gallery");
    }
  };

  // Helper to render Info Rows
  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
    >
      <View style={{ width: 40 }}>{icon}</View>
      <View>
        <Text style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 2 }}>
          {label}
        </Text>
        <Text style={{ fontSize: 16, color: "#1F2937", fontWeight: "600" }}>
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 15,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#4B5563" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#1F2937" }}>
          Personal info
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(screens)/edit_personal_info")}
          style={{
            backgroundColor: "#278687",
            padding: 8,
            borderRadius: 10,
          }}
        >
          <MaterialIcons name="edit" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        {/* Profile Image Section */}
        <View style={{ alignItems: "center", marginTop: 20, marginBottom: 30 }}>
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: user.avatar }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 2,
                borderColor: "#E5E7EB",
              }}
            />
            <TouchableOpacity
              onPress={handleImagePicker}
              style={{
                position: "absolute",
                bottom: 5,
                right: 5,
                backgroundColor: "#278687",
                padding: 6,
                borderRadius: 15,
                borderWidth: 2,
                borderColor: "#fff",
              }}
            >
              <MaterialIcons name="photo-camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#1F2937",
              marginTop: 15,
            }}
          >
            {user.name}
          </Text>
        </View>

        {/* Personal Information Card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 15,
            padding: 20,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 20,
            }}
          >
            Personal Information
          </Text>
          <InfoRow
            label="Full Name"
            value={user.name}
            icon={<Ionicons name="person-outline" size={24} color="#9CA3AF" />}
          />
          <InfoRow
            label="Date of Birth"
            value={user.dob}
            icon={
              <Ionicons name="calendar-outline" size={24} color="#9CA3AF" />
            }
          />
        </View>

        {/* Contact Information Card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 15,
            padding: 20,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 20,
            }}
          >
            Contact Information
          </Text>
          <InfoRow
            label="Email"
            value={user.email}
            icon={
              <MaterialIcons name="mail-outline" size={24} color="#9CA3AF" />
            }
          />
          <InfoRow
            label="Phone"
            value={user.phone}
            icon={<Ionicons name="call-outline" size={24} color="#9CA3AF" />}
          />
        </View>

        {/* Identification Card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 15,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 20,
            }}
          >
            Identification
          </Text>
          <InfoRow
            label="ID Type"
            value={user.idType}
            icon={<FontAwesome5 name="id-card" size={20} color="#9CA3AF" />}
          />
          <InfoRow
            label="ID Number"
            value={user.idNumber}
            icon={<FontAwesome5 name="id-card" size={20} color="#9CA3AF" />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PersonalInfoScreen;
