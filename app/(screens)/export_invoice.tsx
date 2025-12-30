import { recentOrders } from '@/constants/common';
import { MaterialIcons } from '@expo/vector-icons';
import { printToFileAsync } from 'expo-print';
import { router, useLocalSearchParams } from 'expo-router';
import { shareAsync } from 'expo-sharing';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleBack = () => {
        router.back();
    };

    const handleDownload = () => {
        setShowDownloadModal(true);
    };

    const confirmDownload = async () => {
        try {
            setIsGenerating(true);
            const html = `
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
                        .header { display: flex; align-items: center; margin-bottom: 30px; }
                        .avatar { width: 60px; height: 60px; border-radius: 30px; margin-right: 15px; }
                        .customer-info h2 { margin: 0; font-size: 18px; color: #1F2937; }
                        .customer-info p { margin: 5px 0 0; color: #6B7280; font-size: 14px; }
                        .section-title { font-size: 16px; font-weight: bold; color: #1F2937; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                        .item { display: flex; border: 1px solid #F3F4F6; border-radius: 8px; padding: 10px; margin-bottom: 10px; }
                        .item img { width: 60px; height: 60px; border-radius: 4px; object-fit: cover; margin-right: 15px; }
                        .item-details { flex: 1; }
                        .item-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
                        .item-name { font-weight: 600; font-size: 14px; }
                        .item-price { font-weight: 600; }
                        .item-desc { font-size: 12px; color: #9CA3AF; margin-bottom: 5px; }
                        .payment-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
                        .total-row { display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px dashed #ccc; font-weight: bold; font-size: 16px; }
                        .status { display: inline-block; padding: 5px 10px; background-color: #E8F5E9; color: #2E7D32; border-radius: 15px; font-size: 12px; font-weight: bold; margin-top: 20px; }
                    </style>
                  </head>
                  <body>
                    <div class="header">
                        <img src="${order.customer.avatar}" class="avatar" />
                        <div class="customer-info">
                            <h2>${order.customer.name}</h2>
                            <p>ID: ${order.customer.customerId}</p>
                        </div>
                    </div>

                    <div class="section-title">Order Items (#${order.orderNumber})</div>
                    ${order.orderItems.map(item => `
                        <div class="item">
                            <img src="${item.image}" />
                            <div class="item-details">
                                <div class="item-row">
                                    <span class="item-name">${order.orderNumber}</span>
                                    <span class="item-price">$${item.price}</span>
                                </div>
                                <div class="item-desc">${item.description}</div>
                                <div style="text-align: right; font-size: 12px; color: #6B7280;">x${item.quantity}</div>
                            </div>
                        </div>
                    `).join('')}

                    <div style="margin-top: 30px;">
                        <div class="section-title">Payment Details</div>
                        <div class="payment-row"><span>Subtotal</span><span>$${order.payment.subtotal.toFixed(2)}</span></div>
                        <div class="payment-row"><span>Tax (25%)</span><span>$${order.payment.tax.toFixed(2)}</span></div>
                        <div class="payment-row"><span>Shipping</span><span>$${order.payment.shipping.toFixed(2)}</span></div>
                        <div class="total-row"><span>Grand Total</span><span>$${order.payment.grandTotal.toFixed(2)}</span></div>
                        
                        <div class="status">
                            ${order.payment.status} - ${order.payment.method}
                        </div>
                    </div>
                  </body>
                </html>
            `;

            const { uri } = await printToFileAsync({ html });
            console.log('File has been saved to:', uri);
            await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
            setShowDownloadModal(false);
        } catch (error) {
            console.error('Error generating PDF:', error);
            // Optionally handle error state here
        } finally {
            setIsGenerating(false);
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

            {/* Download Confirmation Modal */}
            <Modal
                visible={showDownloadModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDownloadModal(false)}
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
                        <Text style={{
                            fontSize: 20,
                            fontWeight: '600',
                            color: '#1F2937',
                            marginBottom: 8,
                        }}>
                            Download Invoice?
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: '#6B7280',
                            textAlign: 'center',
                            marginBottom: 24,
                            lineHeight: 20,
                        }}>
                            Do you want to generate and download the PDF invoice for this order?
                        </Text>

                        <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                            <TouchableOpacity
                                onPress={() => setShowDownloadModal(false)}
                                style={{
                                    flex: 1,
                                    paddingVertical: 14,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: '#D1D5DB',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={confirmDownload}
                                disabled={isGenerating}
                                style={{
                                    flex: 1,
                                    paddingVertical: 14,
                                    borderRadius: 12,
                                    backgroundColor: '#278687',
                                    alignItems: 'center',
                                    opacity: isGenerating ? 0.7 : 1,
                                }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
                                    {isGenerating ? 'Generating...' : 'Confirm'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    )
}

export default ExportInvoice