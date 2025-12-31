import { recentOrders } from '@/constants/common'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Completed';

const OrderTabs = () => {
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredOrders = recentOrders.filter(order => {
        // Filter by status
        const statusMatch = activeFilter === 'All' || order.orderStatus.status === activeFilter;

        // Filter by search query (customer name)
        const searchMatch = searchQuery.trim() === '' ||
            order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());

        return statusMatch && searchMatch;
    });

    const handleBack = () => {
        router.back();
    };

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
                        {filteredOrders.map((order) => (
                            <TouchableOpacity
                                onPress={() => router.push({
                                    pathname: '/(screens)/order_details',
                                    params: { id: order.id }
                                })}
                                key={order.id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 12,
                                    padding: 12,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3,
                                    elevation: 2,
                                }}
                            >
                                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
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
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text style={{ color: "#2B2B2B", fontSize: 16 }}>{order.orderNumber}</Text>
                                            <View
                                                style={{
                                                    backgroundColor: order.orderStatus.status === 'Completed' ? '#E3F9E7' :
                                                        order.orderStatus.status === 'Pending' ? '#FFF3E0' :
                                                            order.orderStatus.status === 'Processing' ? '#E3F2FD' :
                                                                order.orderStatus.status === 'Shipped' ? '#FFF3E0' :
                                                                    order.orderStatus.status === 'Delivered' ? '#E8F5E9' : '#F3E5F5',
                                                    paddingHorizontal: 8,
                                                    paddingVertical: 2,
                                                    borderRadius: 12,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: order.orderStatus.status === 'Completed' ? '#1B5E20' :
                                                            order.orderStatus.status === 'Pending' ? '#E65100' :
                                                                order.orderStatus.status === 'Processing' ? '#0D47A1' :
                                                                    order.orderStatus.status === 'Shipped' ? '#F57C00' :
                                                                        order.orderStatus.status === 'Delivered' ? '#2E7D32' : '#4A148C',
                                                        fontSize: 10,
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {order.orderStatus.status}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={{ fontSize: 12, color: '#4D4D4D', marginBottom: 8 }}>
                                            {order.orderStatus.location}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ionicons name="star" size={12} color="#FFC107" />
                                            <Text style={{ fontSize: 12, marginLeft: 4 }}>{order.customer.customerId}</Text>
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
                                            {order.customer.name}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: '#278687' }}>
                                            {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: "#278687" }}>
                                        ${order.payment.grandTotal.toFixed(2)}
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