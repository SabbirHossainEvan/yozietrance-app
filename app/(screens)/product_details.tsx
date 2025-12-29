import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sampleProducts } from '../constants/common';

const { width } = Dimensions.get('window');

const ProductDetails = () => {
    const { id } = useLocalSearchParams();
    const product = sampleProducts.find(p => p.id === id);

    if (!product) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Product not found</Text>
            </SafeAreaView>
        );
    }

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 20 }}>
                <TouchableOpacity onPress={() => handleBack()}>
                    <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>Product Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                {/* Product Images */}
                <View style={{
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E7EB',
                    borderRadius: 12,
                    padding: 12
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: 8,
                    }}>
                        <Text>Media</Text>
                        <TouchableOpacity>
                            <Ionicons name="add" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={{ uri: product.images[0] }}
                        style={{
                            width: '100%',
                            height: 217,
                            borderRadius: 12,
                        }}
                        resizeMode="cover"
                    />
                </View>

                {/* Product Info */}
                <View>
                    <View style={{
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E5E7EB',
                        borderRadius: 12,
                        padding: 12,
                        marginVertical: 16,
                        width: '100%',
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                        </View>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: '600',
                        }}>{product.name}</Text>
                        <View style={{
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: 12,
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            backgroundColor: product.status === 'active' ? '#D1FAE5' :
                                product.status === 'low_stock' ? '#FEF3C7' : '#E5E7EB',
                        }}>
                            <Text style={{ fontSize: 12, fontWeight: '500' }}>
                                {product.status === 'active' ? 'Active' :
                                    product.status === 'low_stock' ? 'Low Stock' : 'Draft'}
                            </Text>
                        </View>
                        <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>{product.sku}</Text>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 16 }}>
                            ${product.price}
                        </Text>
                    </View>

                    {/* Stock Info */}
                    <View style={{
                        flexDirection: 'row',
                        marginBottom: 16,
                        gap: 8,
                    }}>
                        <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12 }}>
                            <Text style={{ fontSize: 12, marginBottom: 4 }}>On Stock</Text>
                            <Text style={{ fontSize: 20, fontWeight: '600', color: '#111827' }}>
                                {product.stats.onStock}
                            </Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12 }}>
                            <Text style={{ fontSize: 12, marginBottom: 4 }}>Processing</Text>
                            <Text style={{ fontSize: 20, fontWeight: '600', color: '#111827' }}>
                                {product.stats.processing}
                            </Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12 }}>
                            <Text style={{ fontSize: 12, marginBottom: 4 }}>Total Sold</Text>
                            <Text style={{ fontSize: 20, fontWeight: '600', color: '#111827' }}>
                                {product.stats.totalSold}
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 16,
                    }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 }}>
                            Description
                        </Text>
                        <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22 }}>
                            {product.description}
                        </Text>
                    </View>

                    {/* Specification */}
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 16,
                    }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 }}>
                            Specification
                        </Text>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingVertical: 8,
                                borderBottomWidth: 1,
                                borderBottomColor: '#F3F4F6',
                            }}>
                                <Text style={{ fontSize: 14, color: '#6B7280' }}>Brand</Text>
                                <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>
                                    {product.specification.brand}
                                </Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingVertical: 8,
                                borderBottomWidth: 1,
                                borderBottomColor: '#F3F4F6',
                            }}>
                                <Text style={{ fontSize: 14, color: '#6B7280' }}>Model</Text>
                                <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>
                                    {product.specification.model}
                                </Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingVertical: 8,
                                borderBottomWidth: 1,
                                borderBottomColor: '#F3F4F6',
                            }}>
                                <Text style={{ fontSize: 14, color: '#6B7280' }}>Connectivity</Text>
                                <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>
                                    {product.specification.connectivity}
                                </Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingVertical: 8,
                                borderBottomWidth: 1,
                                borderBottomColor: '#F3F4F6',
                            }}>
                                <Text style={{ fontSize: 14, color: '#6B7280' }}>Bluetooth</Text>
                                <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>
                                    {product.specification.bluetooth}
                                </Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingVertical: 8,
                            }}>
                                <Text style={{ fontSize: 14, color: '#6B7280' }}>Colors</Text>
                                <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>
                                    {product.specification.colors.join(', ')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                {/* Footer Buttons */}
                <View style={{
                    flexDirection: 'row',
                    paddingBottom: 12
                }}>
                    <TouchableOpacity style={{
                        flex: 1,
                        flexDirection: 'row',
                        gap: 8,
                        paddingVertical: 14,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5d8d5',
                        borderWidth: 1,
                        borderColor: '#f5d8d5',
                    }}>
                        <Ionicons name="trash" size={24} color="#fe5c5d" />
                        <Text style={{ color: '#fe5c5d', fontWeight: '600', fontSize: 16 }}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
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
                        <Feather name="edit" size={24} color="white" />
                        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Edit Product</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </SafeAreaView>
    );
};

export default ProductDetails;