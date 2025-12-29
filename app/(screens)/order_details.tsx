import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { recentOrders } from '../constants/common';

const OrderDetails = () => {
    const { id } = useLocalSearchParams();
    const order = recentOrders.find(order => order.id === id);
    const [showCancelModal, setShowCancelModal] = useState(false);

    if (!order) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Order not found</Text>
            </SafeAreaView>
        );
    }

    const getStatusColor = (status: any) => {
        switch (status) {
            case 'Completed': return '#4CAF50';
            case 'Pending': return '#FFA000';
            case 'Processing': return '#2196F3';
            case 'Shipped': return '#9C27B0';
            case 'Delivered': return '#4CAF50';
            default: return '#9E9E9E';
        }
    };

    const statusColor = getStatusColor(order.orderStatus.status);

    const handleBack = () => {
        router.back();
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
                <Text style={{ fontSize: 16, fontWeight: '600' }}>Orders {order.orderNumber}</Text>
                <TouchableOpacity
                    onPress={() => router.push({
                        pathname: '/(screens)/export_invoice',
                        params: { id: order.id }
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
                            source={{ uri: order.customer.avatar }}
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
                                {order.customer.name}
                            </Text>
                            <Text style={{ fontSize: 13, color: "#6B7280" }}>
                                ID: {order.customer.customerId}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{
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

                        {order.orderItems.map((item, index) => (
                            <View key={item.id}>
                                <View style={{ borderColor: '#F3F4F6', borderWidth: 1, borderRadius: 8, padding: 12, flexDirection: 'row', marginBottom: index === order.orderItems.length - 1 ? 0 : 16 }}>
                                    <Image
                                        source={{ uri: item.image }}
                                        style={{ width: 72, height: 72, borderRadius: 8, marginRight: 12 }}
                                        resizeMode="cover"
                                    />
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937', flex: 1 }}>
                                                {order.orderNumber}
                                            </Text>
                                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937' }}>
                                                ${item.price}
                                            </Text>
                                        </View>
                                        <Text style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 8 }} numberOfLines={2}>
                                            {item.description}
                                        </Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                            <Text style={{ fontSize: 12, color: '#6B7280' }}>x{item.quantity}</Text>
                                        </View>
                                    </View>
                                </View>
                                {index < order.orderItems.length - 1 && (
                                    <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 0 }} />
                                )}
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
                                ${order.payment.subtotal.toFixed(2)}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Text style={{ fontSize: 14, color: '#6B7280' }}>Tax(25%)</Text>
                            <Text style={{ fontSize: 14, color: '#1F2937', fontWeight: '500' }}>
                                ${order.payment.tax.toFixed(2)}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Text style={{ fontSize: 14, color: '#6B7280' }}>Shipping</Text>
                            <Text style={{ fontSize: 14, color: '#1F2937', fontWeight: '500' }}>
                                ${order.payment.shipping.toFixed(2)}
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
                                ${order.payment.grandTotal.toFixed(2)}
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
                                {order.payment.status}
                            </Text>
                            <Text style={{ fontSize: 12 }}>
                                {order.payment.method}
                            </Text>
                        </View>
                    </View>

                    {/* Order History Section */}
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
                            Order History
                        </Text>

                        {/* Order Created */}
                        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                            <View style={{ alignItems: 'center', marginRight: 12 }}>
                                <View style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: '#4CAF50',
                                }} />
                                <View style={{
                                    width: 2,
                                    flex: 1,
                                    backgroundColor: '#E5E7EB',
                                    marginVertical: 4,
                                }} />
                            </View>
                            <View style={{ flex: 1, paddingTop: -2 }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 4 }}>
                                    Order Created
                                </Text>
                                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                                    {order.orderStatus.location} • {order.orderStatus.date}
                                </Text>
                            </View>
                        </View>

                        {/* Processing */}
                        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                            <View style={{ alignItems: 'center', marginRight: 12 }}>
                                <View style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: order.orderStatus.status === 'Processing' ||
                                        order.orderStatus.status === 'Shipped' ||
                                        order.orderStatus.status === 'Delivered' ||
                                        order.orderStatus.status === 'Completed' ? '#4CAF50' : '#E5E7EB',
                                }} />
                                <View style={{
                                    width: 2,
                                    flex: 1,
                                    backgroundColor: '#E5E7EB',
                                    marginVertical: 4,
                                }} />
                            </View>
                            <View style={{ flex: 1, paddingTop: -2 }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 4 }}>
                                    Processing
                                </Text>
                                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                                    {order.orderStatus.location} • {order.orderStatus.date}
                                </Text>
                            </View>
                        </View>

                        {/* Shipped */}
                        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                            <View style={{ alignItems: 'center', marginRight: 12 }}>
                                <View style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: order.orderStatus.status === 'Shipped' ||
                                        order.orderStatus.status === 'Delivered' ||
                                        order.orderStatus.status === 'Completed' ? '#4CAF50' : '#E5E7EB',
                                }} />
                                <View style={{
                                    width: 2,
                                    flex: 1,
                                    backgroundColor: '#E5E7EB',
                                    marginVertical: 4,
                                }} />
                            </View>
                            <View style={{ flex: 1, paddingTop: -2 }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 4 }}>
                                    Shipped
                                </Text>
                                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                                    {order.orderStatus.location} • {order.orderStatus.date}
                                </Text>
                            </View>
                        </View>

                        {/* Delivered */}
                        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                            <View style={{ alignItems: 'center', marginRight: 12 }}>
                                <View style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: order.orderStatus.status === 'Delivered' ||
                                        order.orderStatus.status === 'Completed' ? '#4CAF50' : '#E5E7EB',
                                }} />
                                <View style={{
                                    width: 2,
                                    flex: 1,
                                    backgroundColor: '#E5E7EB',
                                    marginVertical: 4,
                                }} />
                            </View>
                            <View style={{ flex: 1, paddingTop: -2 }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 4 }}>
                                    Delivered
                                </Text>
                                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                                    {order.orderStatus.location} • {order.orderStatus.date}
                                </Text>
                            </View>
                        </View>

                        {/* Ready to Receive */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ alignItems: 'center', marginRight: 12 }}>
                                <View style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: order.orderStatus.status === 'Completed' ? '#4CAF50' : '#E5E7EB',
                                }} />
                            </View>
                            <View style={{ flex: 1, paddingTop: -2 }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937' }}>
                                    Ready to Receive
                                </Text>
                            </View>
                        </View>
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
                            borderWidth: 1,
                            borderColor: '#FF5C5C',
                        }}>
                            <Text style={{ color: '#FF5C5C', fontWeight: '600', fontSize: 16 }}>Cancel Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowCancelModal(true)} style={{
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

            {/* Cancel Order Confirmation Modal */}
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
                        {/* Warning Icon */}
                        <View style={{
                            width: 64,
                            height: 64,
                            borderRadius: 32,
                            backgroundColor: '#FEE2E2',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 16,
                        }}>
                            <MaterialIcons name="warning" size={32} color="#DC2626" />
                        </View>

                        {/* Title */}
                        <Text style={{
                            fontSize: 20,
                            fontWeight: '600',
                            color: '#1F2937',
                            textAlign: 'center',
                            marginBottom: 8,
                        }}>
                            Are you sure?
                        </Text>

                        {/* Description */}
                        <Text style={{
                            fontSize: 14,
                            color: '#6B7280',
                            textAlign: 'center',
                            lineHeight: 20,
                            marginBottom: 24,
                        }}>
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </Text>

                        {/* Buttons */}
                        <View style={{
                            flexDirection: 'row',
                            width: '100%',
                            gap: 12,
                        }}>
                            <TouchableOpacity
                                onPress={() => setShowCancelModal(false)}
                                style={{
                                    flex: 1,
                                    paddingVertical: 14,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: '#D1D5DB',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#374151',
                                }}>
                                    No, keep it
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setShowCancelModal(false);
                                    // Handle actual cancel order logic here
                                    console.log('Order cancelled');
                                }}
                                style={{
                                    flex: 1,
                                    paddingVertical: 14,
                                    borderRadius: 12,
                                    backgroundColor: '#DC2626',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#fff',
                                }}>
                                    Yes, cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default OrderDetails;
