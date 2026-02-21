
import { useGetProfileQuery } from '@/store/api/authApiSlice';
import { useGetVendorQrQuery } from '@/store/api/connectionApiSlice';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Share, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const AbcdStoreCard = () => {
    const user = useAppSelector(selectCurrentUser);
    const { data: profileData } = useGetProfileQuery(undefined, { refetchOnFocus: true });

    const vendorId =
        (profileData as any)?.data?.vendor?.id ||
        (profileData as any)?.data?.vendor?._id ||
        (user as any)?.vendor?.id ||
        (user as any)?.vendor?._id ||
        (user as any)?.id ||
        (user as any)?._id;

    const {
        data: qrData,
        isLoading: isQrLoading,
        isError: isQrError,
    } = useGetVendorQrQuery(vendorId, { skip: !vendorId });

    const vendorCode =
        qrData?.vendorCode ||
        (user as any)?.vendorCode ||
        (user as any)?.vendor_code ||
        (user as any)?.vendorID ||
        (user as any)?.code ||
        "N/A";
    const businessName = user?.businessName || user?.storename || "Your Store";
    const storeUrl = `ABCD.store/v/${vendorCode}`;
    const qrDataUrl = qrData?.qrDataUrl;

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(storeUrl);
        Alert.alert('Copied', 'Link copied to clipboard!');
    };

    // Function for the Share button
    const onShare = async () => {
        try {
            await Share.share({
                message: `Check out our official store: ${storeUrl}`,
            });
        } catch (error) {
            // Check if error is an instance of Error to access .message safely
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log('An unknown error occurred');
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F7F5' }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 12,
                paddingHorizontal: 20,
            }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>My QR Code</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 40 }}>
                <View style={{
                    width: width * 0.9,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    paddingHorizontal: 20,
                    paddingVertical: 32,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 2,
                }}>
                    <View style={{ marginBottom: 16 }}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }}
                            style={{ width: 100, height: 100, borderRadius: 50 }}
                        />
                    </View>

                    <Text style={{ fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 }}>
                        {businessName}
                    </Text>

                    <Text style={{ fontSize: 24, fontWeight: '600', color: '#328888', marginBottom: 24 }}>
                        Official Store Link
                    </Text>

                    {/* QR Code Section */}
                    <View style={{
                        padding: 16,
                        borderWidth: 1,
                        borderColor: '#E8F0FE',
                        borderRadius: 24,
                        marginBottom: 24, // Adjusted spacing
                        backgroundColor: '#FFF',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {isQrLoading ? (
                            <View style={{ width: 180, height: 180, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="large" color="#328888" />
                            </View>
                        ) : qrDataUrl ? (
                            <Image
                                source={{ uri: qrDataUrl }}
                                style={{ width: 180, height: 180 }}
                                resizeMode="contain"
                            />
                        ) : (
                            <QRCode
                                value={storeUrl}
                                size={180}
                                color="#000"
                                backgroundColor="#FFFFFF"
                            />
                        )}
                    </View>
                    {isQrError ? (
                        <Text style={{ color: '#B45309', fontSize: 12, marginBottom: 12 }}>
                            Could not load server QR. Showing local fallback QR.
                        </Text>
                    ) : null}

                    {/* --- ADDED SHARE BUTTON --- */}
                    <TouchableOpacity
                        onPress={onShare}
                        activeOpacity={0.8}
                        style={{
                            backgroundColor: '#328888',
                            width: '100%',
                            height: 54,
                            borderRadius: 12,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 24,
                        }}
                    >
                        <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>Share QR Code</Text>
                    </TouchableOpacity>

                    {/* Vendor Input Section */}
                    <View style={{ width: '100%' }}>
                        <Text style={{ fontSize: 16, color: '#444', fontWeight: '500', marginBottom: 10 }}>
                            Vendor Code
                        </Text>

                        <View style={{
                            flexDirection: 'row',
                            height: 54,
                            width: '100%',
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#D1D1D1',
                            overflow: 'hidden'
                        }}>
                            <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 16, backgroundColor: '#F9F9F9' }}>
                                <Text style={{ color: '#666', fontSize: 15 }}>{vendorCode}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={copyToClipboard}
                                activeOpacity={0.8}
                                style={{
                                    backgroundColor: '#328888',
                                    paddingHorizontal: 24,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>Copy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        </SafeAreaView>
    );
};

export default AbcdStoreCard;
