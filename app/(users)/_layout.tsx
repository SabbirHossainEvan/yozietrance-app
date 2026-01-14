import { Tabs } from "expo-router";
import {
  Home,
  MessageCircle,
  Package,
  ShoppingBag,
  User,
} from "lucide-react-native";
import React from "react";

export default function UsersLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2A8383",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
          height: 85,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => <MessageCircle size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: "Order",
          tabBarIcon: ({ color }) => <Package size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="categoriesScreen"
        options={{
          title: "Categories",
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
          tabBarStyle: {
            height: 65,
            paddingBottom: 10,
            paddingTop: 10,
            display: "flex",
          },
        }}
      />
      <Tabs.Screen
        name="Information"
        options={{
          title: "Information",
          tabBarButton: () => null,
          tabBarItemStyle: { display: "none" },
          tabBarStyle: {
            height: 65,
            paddingBottom: 10,
            paddingTop: 10,
            display: "flex",
          },
        }}
      />
    </Tabs>
  );
}
