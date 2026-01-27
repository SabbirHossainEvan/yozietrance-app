import { useGetProductsByVendorQuery } from "@/store/api/product_api_slice";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type Product = {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
  status: "active" | "draft" | "low_stock";

  images: string[];

  rating: number;
  reviewsCount: number;

  stats: {
    onStock: number;
    processing: number;
    totalSold: number;
  };

  description: string;

  specification: {
    brand: string;
    model: string;
    connectivity: string;
    bluetooth: string;
    colors: string[];
    weight: string;
    size: string;
    chargingTime: string;
    playtime: string;
  };
};

const Product = () => {
  const { categoryId: paramCategoryId, categoryName } = useLocalSearchParams();
  const user = useAppSelector(selectCurrentUser);
  const vendorId = user?.id || (user as any)?._id;
  const categoryId = (paramCategoryId as string) || "df336259-5279-407c-9467-cd4c5cda409d";

  const { data: productsData, isLoading, isError, refetch, isFetching } = useGetProductsByVendorQuery(
    { vendorId: vendorId || "", categoryId },
    { skip: !vendorId }
  );



  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const extractProducts = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.products)) return data.products;
    if (data.data && Array.isArray(data.data.products)) return data.data.products;
    return [];
  };

  useEffect(() => {
    const products = extractProducts(productsData);
    let result = [...products];

    if (searchQuery) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilter !== "all") {
      result = result.filter((product) => {
        const isLowStock = product.stockQuantity < 10;
        if (activeFilter === "low_stock") return isLowStock;
        if (activeFilter === "active") return product.isAvailable;
        if (activeFilter === "drafts") return !product.isAvailable;
        return true;
      });
    }

    setFilteredProducts(result);
  }, [searchQuery, activeFilter, productsData]);

  const rawProducts = extractProducts(productsData);

  const totalValue = rawProducts
    .reduce(
      (sum: number, product: any) =>
        sum + (product.price || 0) * (product.stockQuantity || 0),
      0
    )
    .toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  const lowStockCount = rawProducts.filter(
    (p: any) => (p.stockQuantity || 0) < 10
  ).length;

  const renderStockStatus = (product: any) => {
    if (!product.isAvailable) {
      return (
        <View
          style={{
            alignSelf: "flex-start",
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: "#FFF3E0",
            borderRadius: 4,
          }}
        >
          <Text style={{ fontSize: 12, color: "#E65100", fontWeight: "500" }}>
            Unpublish
          </Text>
        </View>
      );
    }

    const isLowStock = product.stockQuantity < 10;
    return (
      <Text
        style={{
          fontSize: 12,
          color: isLowStock ? "#D32F2F" : "#1B5E20",
          fontWeight: "500",
        }}
      >
        {product.stockQuantity} in stock
      </Text>
    );
  };
  // this is for handle add product
  const handleAddProduct = () => {
    router.push({
      pathname: "/(screens)/EditProduct",
      params: { categoryId }
    });
  };
  const handleBack = () => {
    router.back();
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* Header - Fixed at top */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 12,
          }}
        >
          <TouchableOpacity onPress={() => handleBack()}>
            <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            {(categoryName as string) || "Electronics"}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
        >
          {/* Search Bar */}
          <View style={{ marginVertical: 16 }}>
            <TextInput
              placeholder="Search by name"
              style={{
                borderWidth: 1,
                borderColor: "#E3E6F0",
                borderRadius: 12,
                padding: 16,
                backgroundColor: "#FFF",
                fontSize: 14,
              }}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/*Cards */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 24,
              marginHorizontal: 1,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                width: "48%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                Total value
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                {totalValue}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                width: "48%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 12, color: "#666" }}>
                  Low stock items
                </Text>
                <Ionicons name="warning-outline" size={16} color="red" />
              </View>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                {lowStockCount}
              </Text>
            </View>
          </View>

          {/* Filter Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["All", "Active", "Drafts", "Low Stock"].map((filter) => {
              const filterValue = filter.toLowerCase().replace(" ", "_");
              const isActive =
                activeFilter ===
                (filterValue === "low_stock" ? "low_stock" : filterValue);

              return (
                <TouchableOpacity
                  key={filter}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    marginRight: 8,
                    backgroundColor: isActive ? "#278687" : "#deede8",
                  }}
                  onPress={() =>
                    setActiveFilter(
                      filterValue === "all" ? "all" : (filterValue as any)
                    )
                  }
                >
                  <Text
                    style={{
                      color: isActive ? "white" : "#2B2B2B",
                      fontSize: 14,
                    }}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Product List */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 16,
              marginTop: 16,
            }}
          >
            Inventory Items
          </Text>
          <View>
            {isLoading ? (
              <ActivityIndicator size="large" color="#278687" style={{ marginTop: 20 }} />
            ) : isError ? (
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#FF6B6B' }}>Error loading products</Text>
            ) : filteredProducts.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>No products found</Text>
            ) : (
              filteredProducts.map((product: any) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/(screens)/product_details",
                      params: { id: product.id || product._id },
                    })
                  }
                  key={product.id || product._id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: 12,
                    padding: 12,
                    marginHorizontal: 1,
                    marginBottom: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 1,
                  }}
                >
                  <Image
                    source={{ uri: product.imageUrl || (product.images && product.images[0]) || "https://via.placeholder.com/150" }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      marginRight: 12,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        marginBottom: 4,
                      }}
                    >
                      {product.name}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#6B7280",
                          marginRight: 8,
                        }}
                      >
                        {product.sku || 'N/A'}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 12,
                          backgroundColor:
                            product.isAvailable
                              ? (product.stockQuantity < 10 ? "#FEF3C7" : "#D1FAE5")
                              : "#E5E7EB",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            color:
                              product.isAvailable
                                ? (product.stockQuantity < 10 ? "#92400E" : "#065F46")
                                : "#4B5563",
                            fontWeight: "500",
                          }}
                        >
                          {product.isAvailable
                            ? (product.stockQuantity < 10 ? "low stock" : "active")
                            : "draft"}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#278687",
                        marginBottom: 4,
                      }}
                    >
                      ${product.price}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>
                      {product.stockQuantity} in stock
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </View>

      {/* add product action Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 24,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#278687",
          justifyContent: "center",
          alignItems: "center",
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
        onPress={() => handleAddProduct()}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Product;
