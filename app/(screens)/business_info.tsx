import { images } from "@/constants/import_images";
import { useGetProfileQuery } from "@/store/api/authApiSlice";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const VerificationCard = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: profileData } = useGetProfileQuery({});
  const displayUser = profileData?.data || currentUser;

  // handle back
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Main Card */}
        <View>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 12,
            }}
          >
            <TouchableOpacity onPress={() => handleBack()}>
              <MaterialIcons
                name="arrow-back-ios-new"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              Business info
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(screens)/edit_business_info")}
              style={{
                backgroundColor: "#278687",
                padding: 8,
                borderRadius: 10,
              }}
            >
              <MaterialIcons name="edit" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 2,
              padding: 24,
              marginTop: 16,
            }}
          >
            <View
              style={{
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Image
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 50,
                }}
                source={displayUser?.logo ? { uri: displayUser.logo } : images.welcome_image}
              />
            </View>
            {/* Personal Information Section */}
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#000000",
                  marginBottom: 24,
                  letterSpacing: 0.2,
                }}
              >
                Business Information
              </Text>
              {/* Business Name*/}
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <View style={{ marginTop: 4 }}>
                  {/* REMOVED the <Text> wrapper around Feather icon */}
                  <Feather name="user" size={24} color="black" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#666666",
                      marginBottom: 8,
                    }}
                  >
                    Business Name
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "400",
                      color: "#000000",
                    }}
                  >
                    {displayUser?.businessName || displayUser?.storename || "N/A"}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View
                style={{
                  height: 1,
                  backgroundColor: "#e0e0e0",
                  marginBottom: 24,
                }}
              />
              {/* Contact Information */}
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#000000",
                  marginBottom: 24,
                  letterSpacing: 0.2,
                }}
              >
                Contact Information
              </Text>

              {/* Email */}
              <View
                style={{
                  marginBottom: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={{ marginTop: 4 }}>
                  {/* REMOVED the <Text> wrapper around Feather icon */}
                  <Fontisto name="email" size={24} color="black" />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#666666",
                      marginBottom: 8,
                      letterSpacing: 0.2,
                    }}
                  >
                    Email
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "400",
                      color: "#000000",
                      letterSpacing: 0.2,
                    }}
                  >
                    {displayUser?.email || "N/A"}
                  </Text>
                </View>
              </View>

              {/* Phone */}
              <View
                style={{
                  marginBottom: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={{ marginTop: 4 }}>
                  {/* REMOVED the <Text> wrapper around Feather icon */}
                  <FontAwesome6 name="phone" size={24} color="black" />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#666666",
                      marginBottom: 8,
                      letterSpacing: 0.2,
                    }}
                  >
                    Phone
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "400",
                      color: "#000000",
                      letterSpacing: 0.2,
                    }}
                  >
                    {displayUser?.phone || "N/A"}
                  </Text>
                </View>
              </View>

              {/* Address */}
              <View
                style={{
                  marginBottom: 24,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={{ marginTop: 4 }}>
                  {/* REMOVED the <Text> wrapper around Feather icon */}
                  <SimpleLineIcons
                    name="location-pin"
                    size={24}
                    color="black"
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#666666",
                      marginBottom: 8,
                      letterSpacing: 0.2,
                    }}
                  >
                    Addresse
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "400",
                      color: "#000000",
                      letterSpacing: 0.2,
                      lineHeight: 22,
                    }}
                  >
                    {displayUser?.address || "N/A"}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View
                style={{
                  height: 1,
                  backgroundColor: "#e0e0e0",
                  marginBottom: 24,
                }}
              />

              {/* Identification */}
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#000000",
                  marginBottom: 24,
                  letterSpacing: 0.2,
                }}
              >
                Identification
              </Text>
              {/* Business ID */}
              <View
                style={{
                  marginBottom: 24,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={{ marginTop: 4 }}>
                  {/* REMOVED the <Text> wrapper around Feather icon */}
                  <FontAwesome name="id-card-o" size={24} color="black" />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#666666",
                      marginBottom: 8,
                      letterSpacing: 0.2,
                    }}
                  >
                    Business ID
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "400",
                      color: "#000000",
                      letterSpacing: 0.2,
                    }}
                  >
                    {displayUser?.vendorCode || displayUser?.businessID || "N/A"}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View
                style={{
                  height: 1,
                  backgroundColor: "#e0e0e0",
                  marginBottom: 24,
                }}
              />

              {/* Warning Note */}
              <View
                style={{
                  backgroundColor: "#F3F8F4",
                  padding: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#278687",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    color: "#333333",
                    lineHeight: 20,
                    letterSpacing: 0.2,
                  }}
                >
                  If you change any business information, your verification
                  status will be reviewed again and may take up to 15 days.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerificationCard;
