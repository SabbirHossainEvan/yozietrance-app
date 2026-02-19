
import { useGetOrderByIdQuery } from '@/store/api/orderApiSlice';
import { useCreatePaymentIntentMutation } from '@/store/api/paymentApiSlice';
import { useStripe } from '@stripe/stripe-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PaymentScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
    const stripePublishableKey = (process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '').trim();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const [selectedMethod, setSelectedMethod] = useState<string>('stripe');
    const [isProcessing, setIsProcessing] = useState(false);

    // Fetch order details
    const { data: orderData, isLoading: isOrderLoading, error: orderError } = useGetOrderByIdQuery(orderId, {
        skip: !orderId,
    });

    const [createPaymentIntent, { isLoading: isPaymentLoading }] = useCreatePaymentIntentMutation();

    // Extract order details safely
    const order = orderData?.data || orderData; // Adjust based on API structure
    const totalPayable = order?.totalPrice || order?.grandTotal || 0;
    const items = order?.orderItems || [];
    const firstItemName = items.length > 0 ? (items[0].product?.title || items[0].product?.name || "Product") : "Item";
    const itemCount = items.length;
    const displayItemName = itemCount > 1 ? `${firstItemName} + ${itemCount - 1} more` : firstItemName;


    const handleContinue = async () => {
        if (!orderId) {
            Alert.alert("Error", "Order ID not found.");
            return;
        }
        if (!stripePublishableKey) {
            Alert.alert("Error", "Stripe key is missing. Set EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY.");
            return;
        }

        try {
            setIsProcessing(true);
            const response = await createPaymentIntent({ orderId }).unwrap();
            const paymentIntentClientSecret =
                response?.paymentIntentClientSecret ||
                response?.clientSecret ||
                response?.data?.paymentIntentClientSecret ||
                response?.data?.clientSecret;
            const customerId =
                response?.customerId ||
                response?.data?.customerId;
            const customerEphemeralKeySecret =
                response?.customerEphemeralKeySecret ||
                response?.ephemeralKeySecret ||
                response?.data?.customerEphemeralKeySecret ||
                response?.data?.ephemeralKeySecret;

            if (paymentIntentClientSecret) {
                const initResult = await initPaymentSheet({
                    merchantDisplayName: 'Yozietrance',
                    paymentIntentClientSecret,
                    ...(customerId && customerEphemeralKeySecret
                        ? {
                            customerId,
                            customerEphemeralKeySecret,
                          }
                        : {}),
                    returnURL: 'yozietranceapp://stripe-redirect',
                });

                if (initResult.error) {
                    Alert.alert("Error", initResult.error.message);
                    return;
                }

                const presentResult = await presentPaymentSheet();
                if (presentResult.error) {
                    if (presentResult.error.code !== 'Canceled') {
                        Alert.alert("Error", presentResult.error.message);
                    }
                    return;
                }

                router.replace("/(user_screen)/OrderAcceptedScreen");
                return;
            }

            if (response?.paymentLink) {
                router.push({
                    pathname: '/(screens)/stripe_webview',
                    params: {
                        url: encodeURIComponent(response.paymentLink),
                        flow: 'payment',
                        title: 'Stripe Payment',
                    },
                });
                return;
            }

            Alert.alert("Error", "Failed to create Stripe SDK payment session.");
        } catch (error: any) {
            console.error("Payment intent error:", error);
            Alert.alert("Error", error?.data?.message || "Failed to initiate payment.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isOrderLoading) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#00797C" />
            </SafeAreaView>
        );
    }

    if (orderError || !order) {
        return (
            <SafeAreaView style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>Failed to load order details.</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Text style={styles.backArrow}>{"<"}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Booking Summary:</Text>

                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <SummaryRow label="Item" value={displayItemName} />
                    <SummaryRow label="Quantity" value={itemCount.toString()} />
                    {/* Add discount/coupon checks if available in order object */}
                    {/* <SummaryRow label="Discount" value={`-$${0.00}`} /> */}

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Payable</Text>
                        <Text style={styles.totalValue}>${Number(totalPayable).toFixed(2)}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Payment Method</Text>

                {/* Payment Selection */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                        styles.paymentOption,
                        selectedMethod === 'stripe' && styles.selectedBorder
                    ]}
                    onPress={() => setSelectedMethod('stripe')}
                >
                    <View style={styles.paymentLeft}>
                        <View style={styles.cardIconPlaceholder}>
                            <View style={styles.cardLines} />
                        </View>
                        <Text style={styles.paymentText}>Stripe</Text>
                    </View>

                    <View style={styles.radioOuter}>
                        {selectedMethod === 'stripe' && <View style={styles.radioInner} />}
                    </View>
                </TouchableOpacity>

                {/* Action Button */}
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                    disabled={isProcessing || isPaymentLoading}
                >
                    {isProcessing || isPaymentLoading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.continueText}>Continue</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[{ maxWidth: '60%', textAlign: 'right' }, styles.value]} numberOfLines={1}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFB'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backArrow: {
        fontSize: 24,
        color: '#333',
        fontWeight: '300'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333'
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 10
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 12,
        marginTop: 10
    },
    summaryCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E8EDED',
        marginBottom: 25,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8 },
            android: { elevation: 2 },
        }),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16
    },
    label: {
        color: '#555',
        fontSize: 15
    },
    value: {
        color: '#333',
        fontSize: 15,
        fontWeight: '400'
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0'
    },
    totalLabel: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A'
    },
    totalValue: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A'
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E8EDED',
        marginBottom: 20,
    },
    selectedBorder: {
        borderColor: '#00797C',
    },
    paymentLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cardIconPlaceholder: {
        width: 32,
        height: 22,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#00797C',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4
    },
    cardLines: {
        width: '100%',
        height: 2,
        backgroundColor: '#00797C',
        borderRadius: 1
    },
    paymentText: {
        marginLeft: 12,
        fontSize: 15,
        color: '#333',
        fontWeight: '500'
    },
    radioOuter: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center'
    },
    radioInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#00797C'
    },
    continueButton: {
        backgroundColor: '#00797C',
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    continueText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700'
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    backButton: {
        padding: 10,
        backgroundColor: '#EEE',
        borderRadius: 5,
    },
    backButtonText: {
        color: '#333',
    }
});

export default PaymentScreen;
