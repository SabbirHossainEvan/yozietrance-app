import { useGetCategoriesByVendorQuery } from "@/store/api/categoryApiSlice";
import { useGetMyConnectionsQuery } from "@/store/api/connectionApiSlice";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Category {
  id: string;
  title: string;
  image: ImageSourcePropType;
}

const CATEGORIES: Category[] = [
  {
    id: "1",
    title: "Electronics",
    image: require("../../assets/users/Mask group.png"),
  },
  {
    id: "2",
    title: "Clothing",
    image: require("../../assets/users/Mask group (1).png"),
  },
  {
    id: "3",
    title: "Accessories",
    image: require("../../assets/users/Mask group (2).png"),
  },
  {
    id: "4",
    title: "Footwear",
    image: require("../../assets/users/Mask group (3).png"),
  },
  {
    id: "5",
    title: "Groceries",
    image: require("../../assets/users/Mask group (4).png"),
  },
  {
    id: "6",
    title: "Gadgets",
    image: require("../../assets/users/unsplash_Wut0F41K9ZU.png"),
  },
];

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 48) / 2;

const CategoriesScreen: React.FC = () => {
  const [search, setSearch] = useState("");

  const { data: connections, isLoading: isConnectionsLoading } = useGetMyConnectionsQuery();
  const activeVendorId = connections?.data?.[0]?.vendor?._id || connections?.data?.[0]?.vendor?.id;

  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesByVendorQuery(
    activeVendorId,
    { skip: !activeVendorId }
  );

  const categories = categoriesData?.data || (Array.isArray(categoriesData) ? categoriesData : []);
  const filteredCategories = categories.filter((item: any) => {
    const title = item.title || item.name || "";
    return title.toLowerCase().includes(search.toLowerCase());
  });

  const handleCategoryPress = (category: any) => {
    router.push({
      pathname: "/(user_screen)/ElectronicsScreen",
      params: {
        categoryId: category._id || category.id,
        categoryName: category.name || category.title
      }
    });
  };

  const renderCategory = ({ item }: { item: any }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => handleCategoryPress(item)}>
        <Image
          source={
            item.catImage ? { uri: item.catImage } :
              item.thumbnail ? { uri: item.thumbnail } :
                (item.image ? (typeof item.image === 'string' ? { uri: item.image } : item.image) :
                  require("../../assets/users/Mask group.png"))
          }
          style={styles.categoryImage}
          resizeMode="cover"
        />
        <View style={styles.categoryButton}>
          <Text style={styles.categoryText}>{item.name || item.title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  if (isConnectionsLoading || isCategoriesLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4FB0A8" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Categories.."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredCategories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id || item._id}
        numColumns={2}
        contentContainerStyle={styles.listPadding}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBF9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 20,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  listPadding: { paddingHorizontal: 16, paddingBottom: 20 },
  columnWrapper: { justifyContent: "space-between" },
  cardContainer: { width: COLUMN_WIDTH, marginBottom: 20 },
  categoryImage: {
    width: "100%",
    height: 120,
    borderRadius: 15,
    marginBottom: 8,
    backgroundColor: "#E0E0E0",
  },
  categoryButton: {
    width: "100%",
    height: 40,
    borderWidth: 1.5,
    borderColor: "#4FB0A8",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: { color: "#4FB0A8", fontWeight: "600", fontSize: 15 },
});

export default CategoriesScreen;
