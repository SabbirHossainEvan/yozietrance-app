import { useGetOrdersQuery } from '@/store/api/orderApiSlice'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const IMAGE_FALLBACK = 'https://via.placeholder.com/80';

const toNumber = (value: any, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const formatMoney = (value: any) => `$${toNumber(value).toFixed(2)}`;

const getOrderItems = (order: any) => Array.isArray(order?.orderItems) ? order.orderItems : [];
const isProductPayload = (order: any) =>
    !!order && !Array.isArray(order?.orderItems) && (order?.name || order?.price || order?.images?.length);

const getPrimaryItem = (order: any) => getOrderItems(order)[0];

const getProductImage = (order: any) => {
    const item = getPrimaryItem(order);
    return (
        order?.images?.[0] ||
        order?.imageUrl ||
        item?.product?.images?.[0] ||
        item?.product?.imageUrl ||
        item?.imageUrl ||
        item?.image ||
        IMAGE_FALLBACK
    );
};

const getProductName = (order: any) => {
    const item = getPrimaryItem(order);
    return (
        order?.name ||
        order?.title ||
        item?.product?.name ||
        item?.productName ||
        item?.name ||
        item?.title ||
        'Product'
    );
};

const getOrderTotal = (order: any) => {
    if (order?.price != null) return toNumber(order.price);
    if (order?.totalPrice != null) return toNumber(order.totalPrice);
    if (order?.grandTotal != null) return toNumber(order.grandTotal);

    const calculated = getOrderItems(order).reduce((sum: number, item: any) => {
        const qty = toNumber(item?.quantity, 1);
        const unitPrice = item?.price ?? item?.unitPrice ?? item?.product?.price ?? 0;
        return sum + toNumber(unitPrice) * qty;
    }, 0);
    return calculated;
};

const getCustomerName = (order: any) =>
    order?.vendor?.name ||
    order?.category?.name ||
    order?.buyer?.name ||
    order?.user?.name ||
    order?.customer?.name ||
    order?.shippingAddress?.fullName ||
    "Customer";

const getShippingAddress = (order: any) => {
    if (isProductPayload(order)) {
        return order?.description || `SKU: ${order?.sku || "N/A"}`;
    }
    if (typeof order?.shippingAddress === 'string' && order.shippingAddress.trim()) {
        return order.shippingAddress;
    }
    const addr = order?.shippingAddress;
    if (addr && typeof addr === 'object') {
        return [addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.postalCode]
            .filter(Boolean)
            .join(', ') || 'N/A';
    }
    return 'N/A';
};

const getOrderCode = (order: any) => {
    const rawId = String(order?._id || order?.id || '');
    return rawId ? `#${rawId.slice(-6)}` : '#------';
};

const getDisplayStatus = (order: any) => {
    if (order?.status) return order.status;
    if (order?.isAvailable === true) return 'Processing';
    if (order?.isAvailable === false) return 'Pending';
    return 'Pending';
};

const getItemSummary = (order: any) => {
    const items = getOrderItems(order);
    const count = items.length;
    if (count === 0 && isProductPayload(order)) {
        const stock = order?.stockQuantity ?? 0;
        return `Stock: ${stock} • SKU: ${order?.sku || "N/A"}`;
    }
    if (count === 0) return '0 items';
    const firstName = getProductName(order);
    if (count === 1) return `1 item • ${firstName}`;
    return `${count} items • ${firstName} +${count - 1} more`;
};

const OrderTabs = () => {
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const { data: ordersData, isLoading } = useGetOrdersQuery(undefined);

    const filteredOrders = (ordersData || []).filter((order: any) => {
        // Filter by status
        const displayStatus = getDisplayStatus(order);
        const statusMatch = activeFilter === 'All' || displayStatus === activeFilter;

        // Filter by search query (customer name)
        // Adjusting based on common API structure (customer name might be in buyer/user field)
        const customerName = getCustomerName(order);
        const productName = getProductName(order);
        const orderCode = getOrderCode(order);
        const searchMatch = searchQuery.trim() === '' ||
            customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            orderCode.toLowerCase().includes(searchQuery.toLowerCase());

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
                                        source={{ uri: getProductImage(order) }}
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
                                            <Text style={{ color: "#2B2B2B", fontSize: 16 }}>{getOrderCode(order)}</Text>
                                            <View
                                                style={{
                                                    backgroundColor: getDisplayStatus(order) === 'Completed' ? '#E3F9E7' :
                                                        getDisplayStatus(order) === 'Pending' ? '#FFF3E0' :
                                                            getDisplayStatus(order) === 'Processing' ? '#E3F2FD' :
                                                                getDisplayStatus(order) === 'Shipped' ? '#FFF3E0' :
                                                                    getDisplayStatus(order) === 'Delivered' ? '#E8F5E9' : '#F3E5F5',
                                                    paddingHorizontal: 8,
                                                    paddingVertical: 2,
                                                    borderRadius: 12,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: getDisplayStatus(order) === 'Completed' ? '#1B5E20' :
                                                            getDisplayStatus(order) === 'Pending' ? '#E65100' :
                                                                getDisplayStatus(order) === 'Processing' ? '#0D47A1' :
                                                                    getDisplayStatus(order) === 'Shipped' ? '#F57C00' :
                                                                        getDisplayStatus(order) === 'Delivered' ? '#2E7D32' : '#4A148C',
                                                        fontSize: 10,
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {getDisplayStatus(order)}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={{ fontSize: 12, color: '#4D4D4D', marginBottom: 8 }}>
                                            {getShippingAddress(order)}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ionicons name="time-outline" size={12} color="#666" />
                                            <Text style={{ fontSize: 12, marginLeft: 4 }}>
                                                {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                                            </Text>
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
                                            {getCustomerName(order)}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: '#278687' }}>
                                            {getItemSummary(order)}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: "#278687" }}>
                                        {formatMoney(getOrderTotal(order))}
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
