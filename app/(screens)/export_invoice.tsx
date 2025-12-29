import { MaterialIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { recentOrders } from '../constants/common'

const ExportInvoice = () => {
    const { id } = useLocalSearchParams();
    const order = recentOrders.find(order => order.id === id);

    if (!order) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Order not found</Text>
            </SafeAreaView>
        );
    }

    const handleBack = () => {
        router.back();
    };

    const handleDownload = () => {
        console.log('Downloading invoice for order:', order.orderNumber);
        // Add download functionality here
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 16,
                paddingHorizontal: 20,
            }}>
                <TouchableOpacity onPress={handleBack}>
                    <MaterialIcons name="arrow-back-ios-new" size={20} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>Export invoice </Text>
                <View></View>
            </View>


            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {/* Invoice Container */}
                <View style={{
                    backgroundColor: '#fff',
                    marginHorizontal: 20,
                    marginBottom: 20,
                    marginTop: 12,
                    borderRadius: 8,
                    padding: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                }}>
                    {/* Invoice Header */}
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
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
                    </View>
                    {/* Order Items Section */}
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
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
                        marginTop: 16,
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
                </View>

                {/* Download Button */}
                <View style={{
                    paddingHorizontal: 20,
                    paddingBottom: 20,
                }}>
                    <TouchableOpacity
                        onPress={handleDownload}
                        style={{
                            paddingVertical: 16,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            backgroundColor: '#278687',
                        }}
                    >
                        <MaterialIcons name="download" size={20} color="white" />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: 'white',
                        }}>
                            Download Invoice
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ExportInvoice