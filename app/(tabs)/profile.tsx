
import { useGetProfileQuery } from "@/store/api/authApiSlice";
import {
  useCreateAccountLinkMutation,
  useCreateVendorAccountMutation,
  useGetVendorAccountStatusQuery,
} from "@/store/api/paymentApiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logOut, selectCurrentUser } from "@/store/slices/authSlice";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [isBusinessProfile, setIsBusinessProfile] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { data: profileData } = useGetProfileQuery({});

  // Stripe hooks
  const {
    data: stripeStatus,
    isLoading: isStripeLoading,
    refetch: refetchStripeStatus
  } = useGetVendorAccountStatusQuery(undefined, { skip: !user });

  const [createVendorAccount, { isLoading: isCreatingAccount }] = useCreateVendorAccountMutation();
  const [createAccountLink, { isLoading: isCreatingLink }] = useCreateAccountLinkMutation();

  // Use profileData if available, otherwise fallback to Redux user
  const displayUser = profileData?.data || user;

  // Refresh stripe status when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user) {
        refetchStripeStatus();
      }
    }, [user, refetchStripeStatus])
  );

  const handleConnectStripe = async () => {
    try {
      console.log("Stripe Status:", stripeStatus);
      // 1. Check if account exists, if not create one
      if (!stripeStatus?.stripeAccountId) {
        await createVendorAccount({}).unwrap();
      }


      // 2. Create account link
      const linkResponse = await createAccountLink({}).unwrap();
      console.log("Link Response:", linkResponse);
      if (linkResponse?.url) {
        router.push({
          pathname: "/(screens)/stripe_webview",
          params: {
            url: encodeURIComponent(linkResponse.url),
            flow: "connect",
            title: "Stripe Connect",
          },
        });
      }
    } catch (error: any) {
      console.error("Stripe Connect error:", error);
      Alert.alert("Error", error?.data?.message || "Failed to initiate Stripe connection.");
    }
  };

  const onLogout = async () => {
    setShowLogoutModal(false);
    try {
      // Clear AsyncStorage
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userType');

      // Clear Redux state (this now triggers a global reset)
      dispatch(logOut());

      // Navigate to login
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback navigation
      router.replace("/(auth)/login");
    }
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
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "85%",
            backgroundColor: "#FFF",
            borderRadius: 20,
            padding: 25,
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#666",
              textAlign: "center",
              marginBottom: 25,
            }}
          >
            {subtitle}
          </Text>
          <View style={{ flexDirection: "row", width: "100%" }}>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 10,
                alignItems: "center",
                marginHorizontal: 5,
                backgroundColor: "#F5F5F5",
              }}
              onPress={onClose}
            >
              <Text style={{ color: "#333", fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 10,
                alignItems: "center",
                marginHorizontal: 5,
                backgroundColor: confirmColor,
              }}
              onPress={onConfirm}
            >
              <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  const userData = {
    name:
      displayUser?.vendor?.fullName ||
      displayUser?.fullName ||
      displayUser?.name ||
      displayUser?.storename ||
      displayUser?.businessName ||
      "User",
    avatar:
      displayUser?.vendor?.logoUrl ||
      displayUser?.vendor?.logo ||
      displayUser?.logo ||
      displayUser?.image ||
      displayUser?.avatar ||
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
  };

  const isStripeConnected = stripeStatus?.chargesEnabled && stripeStatus?.payoutsEnabled;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/*Account Information Card*/}
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
            onPress={() => router.push("/(screens)/personal_info")}
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

          {/* Business Info Link */}
          <TouchableOpacity
            onPress={() => router.push("/(screens)/business_info")}
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
              <Ionicons name="business-outline" size={26} color="#4B5563" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#4B5563",
                  marginLeft: 14,
                  fontWeight: "500",
                }}
              >
                Business info
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
          {/* Make a coupon Section */}
          <TouchableOpacity
            onPress={() => router.push("/(screens)/MakeCoupon")}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
              }}
            >
              <MaterialCommunityIcons
                name="ticket-percent-outline"
                size={26}
                color="#4B5563"
              />
              <Text
                style={{
                  fontSize: 16,
                  color: "#4B5563",
                  marginLeft: 14,
                  fontWeight: "500",
                }}
              >
                Make a coupon
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color="black" />
          </TouchableOpacity>
        </View>

        {/* Payout Settings (Stripe Connect) */}
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
            Payout Settings
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="bank-transfer" size={26} color="#4B5563" />
              <Text style={{ fontSize: 16, color: "#4B5563", marginLeft: 14, fontWeight: "500" }}>
                Stripe Connect
              </Text>
            </View>

            {isStripeLoading ? (
              <ActivityIndicator size="small" color="#2D8C8C" />
            ) : isStripeConnected ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 }}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={{ color: '#4CAF50', fontWeight: 'bold', marginLeft: 5, fontSize: 12 }}>Connected</Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleConnectStripe}
                disabled={isCreatingAccount || isCreatingLink}
                style={{
                  backgroundColor: '#635BFF',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                {(isCreatingAccount || isCreatingLink) ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 12 }}>Connect</Text>
                    <MaterialIcons name="arrow-forward" size={12} color="#FFF" style={{ marginLeft: 4 }} />
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
          {!isStripeConnected && !isStripeLoading && (
            <Text style={{ fontSize: 12, color: '#666', marginTop: 10, fontStyle: 'italic' }}>
              Connect your Stripe account to receive payouts.
            </Text>
          )}
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
    </SafeAreaView>
  );
};

export default ProfileScreen;

