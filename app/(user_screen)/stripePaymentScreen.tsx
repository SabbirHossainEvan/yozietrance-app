import React, { useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** * Define the interface for your dynamic data 
 */
interface BookingData {
    itemName: string;
    price: number;
    quantity: number;
    discount: number;
    coupon: number;
    totalPayable: number;
}

interface Props {
    data?: BookingData;
    onContinue?: (method: string) => void;
    onBack?: () => void;
}

const PaymentScreen: React.FC<Props> = ({ data, onContinue, onBack }) => {
    const [selectedMethod, setSelectedMethod] = useState<string>('stripe');

    // Default values if no props are passed
    const {
        itemName = "Optical Mouse",
        price = 3.44,
        quantity = 1,
        discount = 2.00,
        coupon = 2.00,
        totalPayable = 37.00
    } = data || {};

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Text style={styles.backArrow}>{"<"}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Booking Summary:</Text>

                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <SummaryRow label={itemName} value={`$${price.toFixed(2)}`} />
                    <SummaryRow label="Quantity" value={quantity.toString()} />
                    <SummaryRow label="Discount" value={`-$${discount.toFixed(2)}`} />
                    <SummaryRow label="Coupon" value={`-$${coupon.toFixed(2)}`} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Payable</Text>
                        <Text style={styles.totalValue}>${totalPayable.toFixed(2)}</Text>
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
                        <Text style={styles.paymentText}>Payment Stripe</Text>
                    </View>

                    <View style={styles.radioOuter}>
                        {selectedMethod === 'stripe' && <View style={styles.radioInner} />}
                    </View>
                </TouchableOpacity>

                {/* Action Button */}
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => onContinue?.(selectedMethod)}
                >
                    <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

/**
 * Reusable Row Component for the Summary
 */
const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFB'
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
});

export default PaymentScreen;