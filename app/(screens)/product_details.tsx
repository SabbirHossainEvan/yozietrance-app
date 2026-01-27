import { useDeleteProductMutation, useGetProductByIdQuery } from "@/store/api/productApiSlice";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator, Alert, Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ProductDetails = () => {
  const { id } = useLocalSearchParams();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id as string, { skip: !id });
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleDelete = () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(id as string).unwrap();
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to delete product");
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#278687" />
      </SafeAreaView>
    );
  }

  if (!product || isError) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#F8F9FB",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Product not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: "#278687" }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 12,
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity onPress={() => handleBack()}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Product Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* Product Images */}
        <View
          style={{
            backgroundColor: "#fff",
            justifyContent: "center",
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 8,
            }}
          >
            <Text>Media</Text>
            <TouchableOpacity>
              <Ionicons name="add" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: product.imageUrl || (product.images && product.images[0]) || "https://via.placeholder.com/150" }}
            style={{
              width: "100%",
              height: 217,
              borderRadius: 12,
            }}
            resizeMode="cover"
          />
        </View>

        {/* Product Info */}
        <View>
          <View
            style={{
              backgroundColor: "#fff",
              justifyContent: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#E5E7EB",
              borderRadius: 12,
              padding: 12,
              marginVertical: 16,
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            ></View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
              }}
            >
              {product.name}
            </Text>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12,
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor:
                  product.isAvailable
                    ? (product.stockQuantity < 10 ? "#FEF3C7" : "#D1FAE5")
                    : "#E5E7EB",
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "500" }}>
                {product.isAvailable
                  ? (product.stockQuantity < 10 ? "Low Stock" : "Active")
                  : "Draft"}
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
              {product.sku || 'N/A'}
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#111827",
                marginBottom: 16,
              }}
            >
              ${product.price}
            </Text>
          </View>

          {/* Stock Info */}
          <View
            style={{
              flexDirection: "row",
              marginBottom: 16,
              gap: 8,
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text style={{ fontSize: 12, marginBottom: 4 }}>On Stock</Text>
              <Text
                style={{ fontSize: 20, fontWeight: "600", color: "#111827" }}
              >
                {product.stockQuantity || 0}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text style={{ fontSize: 12, marginBottom: 4 }}>Processing</Text>
              <Text
                style={{ fontSize: 20, fontWeight: "600", color: "#111827" }}
              >
                {product.stats?.processing || 0}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text style={{ fontSize: 12, marginBottom: 4 }}>Total Sold</Text>
              <Text
                style={{ fontSize: 20, fontWeight: "600", color: "#111827" }}
              >
                {product.stats?.totalSold || 0}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#111827",
                marginBottom: 12,
              }}
            >
              Description
            </Text>
            <Text style={{ fontSize: 14, color: "#4B5563", lineHeight: 22 }}>
              {product.description}
            </Text>
          </View>

          {/* Specification */}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#111827",
                marginBottom: 12,
              }}
            >
              Specification
            </Text>
            <View style={{ flexDirection: "column" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: "#F3F4F6",
                }}
              >
                <Text style={{ fontSize: 14, color: "#6B7280" }}>Brand</Text>
                <Text
                  style={{ fontSize: 14, color: "#111827", fontWeight: "500" }}
                >
                  {product.specification?.brand || 'N/A'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: "#F3F4F6",
                }}
              >
                <Text style={{ fontSize: 14, color: "#6B7280" }}>Model</Text>
                <Text
                  style={{ fontSize: 14, color: "#111827", fontWeight: "500" }}
                >
                  {product.specification?.model || 'N/A'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: "#F3F4F6",
                }}
              >
                <Text style={{ fontSize: 14, color: "#6B7280" }}>
                  Connectivity
                </Text>
                <Text
                  style={{ fontSize: 14, color: "#111827", fontWeight: "500" }}
                >
                  {product.specification?.connectivity || 'N/A'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: "#F3F4F6",
                }}
              >
                <Text style={{ fontSize: 14, color: "#6B7280" }}>
                  Bluetooth
                </Text>
                <Text
                  style={{ fontSize: 14, color: "#111827", fontWeight: "500" }}
                >
                  {product.specification?.bluetooth || 'N/A'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 8,
                }}
              >
                <Text style={{ fontSize: 14, color: "#6B7280" }}>Colors</Text>
                <Text
                  style={{ fontSize: 14, color: "#111827", fontWeight: "500" }}
                >
                  {product.specification?.colors?.join(", ") || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* Footer Buttons */}
        <View
          style={{
            flexDirection: "row",
            paddingBottom: 12,
          }}
        >
          <TouchableOpacity
            disabled={isDeleting}
            onPress={handleDelete}
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 8,
              paddingVertical: 14,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5d8d5",
              borderWidth: 1,
              borderColor: "#f5d8d5",
              opacity: isDeleting ? 0.7 : 1,
            }}
          >
            <Ionicons name="trash" size={24} color="#fe5c5d" />
            <Text style={{ color: "#fe5c5d", fontWeight: "600", fontSize: 16 }}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.replace({ pathname: "/(screens)/EditProduct", params: { id } })}
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              paddingVertical: 14,
              borderRadius: 16,
              justifyContent: "center",
              backgroundColor: "#278687",
              marginLeft: 12,
            }}
          >
            <Feather name="edit" size={24} color="white" />
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
              Edit Product
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetails;
