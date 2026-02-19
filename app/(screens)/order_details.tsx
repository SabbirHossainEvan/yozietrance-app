import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from '@/store/api/orderApiSlice';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrderDetails = () => {
    const { id } = useLocalSearchParams();
    const { data: orderResponse, isLoading, error } = useGetOrderByIdQuery(id as string, { skip: !id });
    const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

    console.log('status', updateStatus)
    const order = orderResponse?.data || orderResponse;

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#278687" />
            </SafeAreaView>
        );
    }

    if (!order || error) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Order not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 10 }}>
                    <Text style={{ color: '#278687' }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const statuses = ['Pending', 'processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'];

    const getStatusColor = (status: any) => {
        switch (status) {
            case 'Completed': return '#4CAF50';
            case 'Pending': return '#FFA000';
            case 'processing': return '#2196F3';
            case 'Shipped': return '#9C27B0';
            case 'Delivered': return '#4CAF50';
            case 'Cancelled': return '#F44336';
            default: return '#9E9E9E';
        }
    };

    const statusColor = getStatusColor(order.status);

    const handleBack = () => {
        router.back();
    };

    const handleUpdateStatus = async () => {
        if (!selectedStatus) return;
        try {
            await updateStatus({ id: id as string, status: selectedStatus }).unwrap();
            Alert.alert("Success", "Order status updated successfully");
            setShowUpdateStatusModal(false);
        } catch (err: any) {
            Alert.alert("Error", err?.data?.message || "Failed to update status");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 16,
                paddingHorizontal: 16,
            }}>
                <TouchableOpacity onPress={handleBack}>
                    <MaterialIcons name="arrow-back-ios-new" size={20} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>Order #{order._id?.slice(-6) || order.id?.slice(-6)}</Text>
                <TouchableOpacity
                    onPress={() => router.push({
                        pathname: '/(screens)/export_invoice',
                        params: { id: order._id || order.id }
                    })}
                    style={{
                        backgroundColor: "#278687",
                        padding: 8,
                        borderRadius: 50,
                        width: 36,
                        height: 36,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <Feather name="download" size={18} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {/* User Info Card */}
                <View style={{
                    backgroundColor: '#fff',
                    marginHorizontal: 16,
                    marginTop: 16,
                    borderRadius: 12,
                    padding: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 2,
                }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 12
                    }}>
                        <Image
                            source={{ uri: order.buyer?.avatar || order.user?.avatar || 'https://via.placeholder.com/48' }}
                            resizeMode="cover"
                            style={{
                                height: 48,
                                width: 48,
                                borderRadius: 24,
                                marginRight: 12
                            }}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: "600", color: '#1F2937', marginBottom: 2 }}>
                                {order.buyer?.name || order.user?.name || "Customer"}
                            </Text>
                            <Text style={{ fontSize: 13, color: "#6B7280" }}>
                                ID: {order.buyer?._id || order.user?._id || "N/A"}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            router.push({
                                pathname: '/chat_box',
                                params: {
                                    partnerId: order.user?.userId || order.buyer?.userId || order.user?._id || order.buyer?._id,
                                    name: order.buyer?.fullName || order.buyer?.name || order.user?.fullName || order.user?.name || "Customer"
                                }
                            });
                        }}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f2f8f8",
                            padding: 12,
                            borderRadius: 8,
                            gap: 8,
                            borderColor: "#E3E6F0",
                            borderWidth: 1
                        }}>
                        <AntDesign name="message" size={24} color="#2B2B2B" />
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#2B2B2B' }}>Message</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    backgroundColor: "white",
                    marginHorizontal: 12,
                    marginTop: 12,
                    marginBottom: 8,
                    borderRadius: 12,
                    padding: 12,
                    gap: 12
                }}>
                    {/* Order Items Section */}
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 1,
                        elevation: 0.5,
                    }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 16 }}>
                            Order Items
                        </Text>

                        {order.orderItems?.map((item: any, index: number) => (
                            <View key={item._id || index}>
                                <View style={{ borderColor: '#F3F4F6', borderWidth: 1, borderRadius: 8, padding: 12, flexDirection: 'row', marginBottom: index === order.orderItems.length - 1 ? 0 : 16 }}>
                                    <Image
                                        source={{ uri: item.product?.images?.[0] || 'https://via.placeholder.com/72' }}
                                        style={{ width: 72, height: 72, borderRadius: 8, marginRight: 12 }}
                                        resizeMode="cover"
                                    />
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937', flex: 1 }}>
                                                {item.product?.name || item.product?.title || "Product"}
                                            </Text>
                                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937' }}>
                                                ${item.price}
                                            </Text>
                                        </View>
                                        <Text style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 8 }} numberOfLines={2}>
                                            {item.product?.description || ""}
                                        </Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                            <Text style={{ fontSize: 12, color: '#6B7280' }}>x{item.quantity}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Payment Details Section */}
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 1,
                        elevation: 0.5,
                    }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 16 }}>
                            Payment details
                        </Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Text style={{ fontSize: 14, color: '#6B7280' }}>Subtotal</Text>
                            <Text style={{ fontSize: 14, color: '#1F2937', fontWeight: '500' }}>
                                ${order.totalPrice?.toFixed(2)}
                            </Text>
                        </View>

                        <View style={{
                            height: 1,
                            backgroundColor: '#F3F4F6',
                            marginVertical: 12,
                            borderStyle: 'dashed'
                        }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                            <Text style={{ fontSize: 15, fontWeight: '600', color: '#1F2937' }}>Grand total</Text>
                            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1F2937' }}>
                                ${order.totalPrice?.toFixed(2)}
                            </Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 6,
                        }}>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#2E7D32', backgroundColor: '#E8F5E9', padding: 6, borderRadius: 6 }}>
                                {order.status}
                            </Text>
                            <Text style={{ fontSize: 12 }}>
                                {order.paymentMethod || "Credit Card"}
                            </Text>
                        </View>
                    </View>

                    {/* Order History Section (Simplified for API) */}
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 1,
                        elevation: 0.5,
                    }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 16 }}>
                            Shipping Address
                        </Text>
                        <Text style={{ fontSize: 14, color: '#4B5563' }}>
                            {order.shippingAddress || "N/A"}
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={{
                        flexDirection: 'row',
                        paddingBottom: 12
                    }}>
                        <TouchableOpacity onPress={() => setShowCancelModal(true)} style={{
                            flex: 1,
                            flexDirection: 'row',
                            gap: 8,
                            paddingVertical: 14,
                            borderRadius: 16,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1.7,
                            borderColor: '#FF5C5C',
                        }}>
                            <Text style={{ color: '#FF5C5C', fontWeight: '600', fontSize: 16 }}>Cancel Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setSelectedStatus(order.status);
                            setShowUpdateStatusModal(true);
                        }} style={{
                            flex: 1,
                            flexDirection: 'row',
                            gap: 8,
                            alignItems: 'center',
                            paddingVertical: 14,
                            borderRadius: 16,
                            justifyContent: 'center',
                            backgroundColor: '#278687',
                            marginLeft: 12,
                        }}>
                            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Update Status</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Cancel Order Confirmation Modal (Integrated) */}
            <Modal
                visible={showCancelModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowCancelModal(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: 24,
                        width: '100%',
                        maxWidth: 320,
                        alignItems: 'center',
                    }}>
                        <Text style={{ fontSize: 20, fontWeight: '600', color: '#1F2937', marginBottom: 8 }}>Are you sure?</Text>
                        <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 }}>Do you want to cancel this order? This action will set the status to 'Cancelled'.</Text>
                        <View style={{ flexDirection: 'row', width: '100%', gap: 12 }}>
                            <TouchableOpacity onPress={() => setShowCancelModal(false)} style={{ flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1.7, borderColor: '#FF5C5C', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#FF5C5C' }}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={async () => {
                                    try {
                                        await updateStatus({ id: id as string, status: 'Cancelled' }).unwrap();
                                        setShowCancelModal(false);
                                        Alert.alert("Success", "Order cancelled");
                                    } catch (err: any) {
                                        Alert.alert("Error", err?.data?.message || "Failed to cancel");
                                    }
                                }}
                                style={{ flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#278687', alignItems: 'center' }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>Yes, cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Update Status Selection Modal */}
            <Modal
                visible={showUpdateStatusModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowUpdateStatusModal(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 320 }}>
                        <Text style={{ fontSize: 20, fontWeight: '600', color: '#1F2937', textAlign: 'center', marginBottom: 16 }}>Update Status</Text>
                        {statuses.map((s) => (
                            <TouchableOpacity
                                key={s}
                                onPress={() => setSelectedStatus(s)}
                                style={{
                                    paddingVertical: 12,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#F3F4F6',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{ fontSize: 16, color: selectedStatus === s ? '#278687' : '#374151', fontWeight: selectedStatus === s ? '600' : '400' }}>{s}</Text>
                                {selectedStatus === s && <Feather name="check" size={20} color="#278687" />}
                            </TouchableOpacity>
                        ))}
                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
                            <TouchableOpacity onPress={() => setShowUpdateStatusModal(false)} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: '#DDD', alignItems: 'center' }}>
                                <Text style={{ fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleUpdateStatus}
                                style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#278687', alignItems: 'center' }}
                                disabled={isUpdating}
                            >
                                {isUpdating ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: '600' }}>Update</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default OrderDetails;
