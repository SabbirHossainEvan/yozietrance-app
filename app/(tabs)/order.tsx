import { useGetOrdersQuery } from '@/store/api/orderApiSlice'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Completed';

const OrderTabs = () => {
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const { data: ordersData, isLoading } = useGetOrdersQuery(undefined);

    const filteredOrders = (ordersData || []).filter((order: any) => {
        // Filter by status
        const statusMatch = activeFilter === 'All' || order.status === activeFilter;

        // Filter by search query (customer name)
        // Adjusting based on common API structure (customer name might be in buyer/user field)
        const customerName = order.buyer?.name || order.user?.name || order.customer?.name || "Unknown";
        const searchMatch = searchQuery.trim() === '' ||
            customerName.toLowerCase().includes(searchQuery.toLowerCase());

        return statusMatch && searchMatch;
    });

    const handleBack = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#278687" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
                    <TouchableOpacity onPress={() => handleBack()}>
                        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>Orders</Text>
                    <View />
                </View>

                {/* Order Search */}
                <View style={{ marginVertical: 16 }}>
                    <TextInput
                        placeholder="Search by name"
                        style={{
                            borderWidth: 1,
                            borderColor: '#E3E6F0',
                            borderRadius: 12,
                            padding: 16,
                            backgroundColor: '#FFF',
                            fontSize: 14
                        }}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* This is for order list filtering */}
                <View style={{ height: 50 }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ alignItems: 'center' }}
                    >
                        {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Completed'].map((filter) => {
                            const isActive = activeFilter === filter;

                            return (
                                <TouchableOpacity
                                    key={filter}
                                    style={{
                                        paddingVertical: 8,
                                        paddingHorizontal: 16,
                                        borderRadius: 8,
                                        marginRight: 8,
                                        backgroundColor: isActive ? '#278687' : '#deede8',
                                    }}
                                    onPress={() => setActiveFilter(filter)}
                                >
                                    <Text style={{
                                        color: isActive ? 'white' : '#2B2B2B',
                                        fontSize: 14,
                                        fontWeight: isActive ? '600' : '400'
                                    }}>
                                        {filter}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* this is for order list */}
                <ScrollView
                    style={{ flex: 1, marginTop: 16 }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ gap: 12 }}>
                        {filteredOrders.map((order: any) => (
                            <TouchableOpacity
                                onPress={() => router.push({
                                    pathname: '/(screens)/order_details',
                                    params: { id: order._id || order.id }
                                })}
                                key={order._id || order.id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 12,
                                    padding: 12,
                                    marginHorizontal: 1,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3,
                                    elevation: 2,
                                }}
                            >
                                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                    <Image
                                        source={{ uri: order.orderItems?.[0]?.product?.images?.[0] || 'https://via.placeholder.com/80' }}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 8,
                                            marginRight: 12,
                                        }}
                                        resizeMode="cover"
                                    />
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text style={{ color: "#2B2B2B", fontSize: 16 }}>#{order._id?.slice(-6) || order.id?.slice(-6)}</Text>
                                            <View
                                                style={{
                                                    backgroundColor: order.status === 'Completed' ? '#E3F9E7' :
                                                        order.status === 'Pending' ? '#FFF3E0' :
                                                            order.status === 'Processing' ? '#E3F2FD' :
                                                                order.status === 'Shipped' ? '#FFF3E0' :
                                                                    order.status === 'Delivered' ? '#E8F5E9' : '#F3E5F5',
                                                    paddingHorizontal: 8,
                                                    paddingVertical: 2,
                                                    borderRadius: 12,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: order.status === 'Completed' ? '#1B5E20' :
                                                            order.status === 'Pending' ? '#E65100' :
                                                                order.status === 'Processing' ? '#0D47A1' :
                                                                    order.status === 'Shipped' ? '#F57C00' :
                                                                        order.status === 'Delivered' ? '#2E7D32' : '#4A148C',
                                                        fontSize: 10,
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {order.status}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={{ fontSize: 12, color: '#4D4D4D', marginBottom: 8 }}>
                                            {order.shippingAddress || "N/A"}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ionicons name="time-outline" size={12} color="#666" />
                                            <Text style={{ fontSize: 12, marginLeft: 4 }}>{new Date(order.createdAt).toLocaleDateString()}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: "#eaf2f2",
                                    paddingLeft: 12,
                                    paddingRight: 12,
                                    paddingBottom: 10,
                                    paddingTop: 10,
                                    borderRadius: 6,
                                    marginTop: 8,
                                }}>
                                    <View>
                                        <Text style={{ fontSize: 12, fontWeight: '500', color: "#278687" }}>
                                            {order.buyer?.name || order.user?.name || "Customer"}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: '#278687' }}>
                                            {order.orderItems?.length || 0} item{order.orderItems?.length > 1 ? 's' : ''}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: "#278687" }}>
                                        ${order.totalPrice?.toFixed(2) || order.grandTotal?.toFixed(2) || "0.00"}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default OrderTabs