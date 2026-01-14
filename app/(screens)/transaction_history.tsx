import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Simplified types
interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  status: "received" | "pending";
}

const TransactionHistoryScreen: React.FC = () => {
  // Simplified state
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      title: "Payment Received",
      amount: 570.0,
      date: "Today at 09:20 am",
      status: "received",
    },
    {
      id: "2",
      title: "Payment Received",
      amount: 570.0,
      date: "Today at 09:20 am",
      status: "received",
    },
    {
      id: "3",
      title: "Payment Received",
      amount: 570.0,
      date: "Today at 09:20 am",
      status: "received",
    },
    {
      id: "4",
      title: "Payment Pending",
      amount: 150.0,
      date: "Yesterday at 02:45 pm",
      status: "pending",
    },
  ]);

  const [loading, setLoading] = useState(false);

  // Simulate API call
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Simple handlers
  const handleBack = () => router.back();
  const handleAddPaymentMethod = () =>
    router.push("/(screens)/add_payment_method");

  // Simplified render components
  const Header = () => (
    <View style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
      <TouchableOpacity onPress={handleBack}>
        <MaterialIcons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text
        style={{ fontSize: 18, fontWeight: "600", marginLeft: 20, flex: 1 }}
      >
        Payment History
      </Text>
    </View>
  );

  const PaymentMethods = () => (
    <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Payment Methods</Text>
        <TouchableOpacity
          onPress={handleAddPaymentMethod}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <MaterialIcons name="add-circle" size={20} color="#278687" />
          <Text style={{ color: "#278687", marginLeft: 5 }}>Add card</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: "white",
          borderRadius: 10,
          padding: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#FF6B00",
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="credit-card" size={20} color="white" />
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              Mastercard **** 8888
            </Text>
            <Text style={{ fontSize: 14, color: "#666", marginTop: 2 }}>
              Primary card
            </Text>
          </View>
          <MaterialIcons name="more-vert" size={24} color="#666" />
        </View>
      </View>
    </View>
  );

  const TransactionItem = ({ item }: { item: Transaction }) => (
    <View
      style={{
        backgroundColor: "white",
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 10,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: item.status === "received" ? "#E8F5E9" : "#FFF3E0",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 15,
        }}
      >
        <MaterialIcons
          name={item.status === "received" ? "check-circle" : "schedule"}
          size={20}
          color={item.status === "received" ? "#4CAF50" : "#FF9800"}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "500" }}>{item.title}</Text>
        <Text style={{ fontSize: 14, color: "#666", marginTop: 2 }}>
          {item.date}
        </Text>
      </View>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: item.status === "received" ? "#4CAF50" : "#FF9800",
        }}
      >
        ${item.amount.toFixed(2)}
      </Text>
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
        <Header />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#278687" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Header />
            <PaymentMethods />
            <View style={{ paddingHorizontal: 20, marginBottom: 15 }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                Recent Payments
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: "center" }}>
            <MaterialIcons name="payments" size={50} color="#CCCCCC" />
            <Text style={{ marginTop: 15, color: "#666", textAlign: "center" }}>
              No payment history yet
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default TransactionHistoryScreen;
