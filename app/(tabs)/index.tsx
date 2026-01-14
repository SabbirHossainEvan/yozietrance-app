import { Feather } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { commonData, quickActions, recentOrders } from "../../constants/common";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View>
        {/* THIS IS FOR HOME HEADER */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "semibold",
              }}
            >
              Hi, Rokey Mahmud
            </Text>
            <Text
              style={{
                fontSize: 14,
              }}
            >
              Dec12,2025
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                padding: 12,
                borderRadius: "100%",
                borderWidth: 0.5,
                borderColor: "#E3E6F0",
              }}
            >
              <Feather name="headphones" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/notifications")}
              style={{
                backgroundColor: "white",
                padding: 12,
                borderRadius: "100%",
                borderWidth: 0.5,
                borderColor: "#E3E6F0",
              }}
            >
              <Ionicons name="notifications-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {/* THIS IS FOR THIS MONTHS INFO PART */}
        <ScrollView>
          <View
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 140,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 16,
              }}
            >
              This Month
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 12,
              }}
            >
              {commonData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: "white",
                    borderRadius: 16,
                    padding: 16,
                    width: "48%",
                    gap: 6,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 4,
                      fontWeight: "500",
                    }}
                  >
                    {item.metric}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "500",
                    }}
                  >
                    {item.value}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 12,
                    }}
                  >
                    <Feather
                      name={
                        item.trend === "up" ? "trending-up" : "trending-down"
                      }
                      size={12}
                      color={item.trend === "up" ? "#088738" : "#E83808"}
                      style={{ marginRight: 2 }}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        color: item.trend === "up" ? "#088738" : "#E83808",
                        fontWeight: "500",
                      }}
                    >
                      {item.change}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {/* THIS IS FOR Quick Actions */}
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                Quick Actions
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  marginBottom: 10,
                  justifyContent: "space-between",
                }}
              >
                {quickActions.map((action: any) => (
                  <View
                    key={action.id}
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: "white",
                        padding: 10,
                        borderRadius: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={action.onPress}
                    >
                      <Image
                        source={action.icon}
                        style={{ width: 24, height: 24 }}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        marginTop: 6,
                      }}
                    >
                      {action.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            {/* THIS IS FOR Recent Orders */}
            <View
              style={{
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  Recent Orders
                </Text>
                <TouchableOpacity onPress={() => router.push("/(tabs)/order")}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#278687",
                      fontWeight: "500",
                    }}
                  >
                    View All
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 12, gap: 12 }}>
                {recentOrders.slice(0, 3).map((order) => (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(screens)/order_details",
                        params: { id: order.id },
                      })
                    }
                    key={order.id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: 12,
                      padding: 12,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 3,
                      elevation: 2,
                    }}
                  >
                    <View style={{ flexDirection: "row", marginBottom: 8 }}>
                      <Image
                        source={{ uri: order.customer.avatar }}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 8,
                          marginRight: 12,
                        }}
                        resizeMode="cover"
                      />
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 8,
                          }}
                        >
                          <Text style={{ color: "#2B2B2B", fontSize: 16 }}>
                            {order.orderNumber}
                          </Text>
                          <View
                            style={{
                              backgroundColor:
                                order.orderStatus.status === "Completed"
                                  ? "#E3F9E7"
                                  : order.orderStatus.status === "Pending"
                                    ? "#FFF3E0"
                                    : order.orderStatus.status === "Processing"
                                      ? "#E3F2FD"
                                      : order.orderStatus.status === "Delivered"
                                        ? "#F3E5F5"
                                        : order.orderStatus.status === "Shipped"
                                          ? "#E1F5FE"
                                          : "#F3E5F5",
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: 12,
                            }}
                          >
                            <Text
                              style={{
                                color:
                                  order.orderStatus.status === "Completed"
                                    ? "#1B5E20"
                                    : order.orderStatus.status === "Pending"
                                      ? "#E65100"
                                      : order.orderStatus.status ===
                                          "Processing"
                                        ? "#0D47A1"
                                        : order.orderStatus.status ===
                                            "Delivered"
                                          ? "#4A148C"
                                          : order.orderStatus.status ===
                                              "Shipped"
                                            ? "#01579B"
                                            : "#4A148C",
                                fontSize: 10,
                                fontWeight: "500",
                              }}
                            >
                              {order.orderStatus.status}
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#4D4D4D",
                            marginBottom: 8,
                          }}
                        >
                          {order.customer.name}
                        </Text>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Ionicons name="star" size={12} color="#FFC107" />
                          <Text style={{ fontSize: 12, marginLeft: 4 }}>
                            {order.customer.customerId}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#eaf2f2",
                        paddingLeft: 12,
                        paddingRight: 12,
                        paddingBottom: 10,
                        paddingTop: 10,
                        borderRadius: 6,
                        marginTop: 8,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "500",
                            color: "#278687",
                          }}
                        >
                          {order.customer.name}
                        </Text>
                        <Text style={{ fontSize: 12, color: "#278687" }}>
                          {order.customer.customerId}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#278687",
                        }}
                      >
                        ${order.payment.grandTotal}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
