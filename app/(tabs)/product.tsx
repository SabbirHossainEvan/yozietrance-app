import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sampleProducts } from '../constants/common';

type Product = {
    id: string;
    name: string;
    sku: string;
    price: string;
    stock: number;
    status: 'active' | 'draft' | 'low_stock';

    images: string[];

    rating: number;
    reviewsCount: number;

    stats: {
        onStock: number;
        processing: number;
        totalSold: number;
    };

    description: string;

    specification: {
        brand: string;
        model: string;
        connectivity: string;
        bluetooth: string;
        colors: string[];
        weight: string;
        size: string;
        chargingTime: string;
        playtime: string;
    };
};


const Product = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(sampleProducts);
    useEffect(() => {
        let result = [...sampleProducts];

        if (searchQuery) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (activeFilter !== 'all') {
            result = result.filter(product =>
                activeFilter === 'low_stock'
                    ? product.status === 'low_stock' || product.stock < 10
                    : product.status === activeFilter
            );
        }

        setFilteredProducts(result);
    }, [searchQuery, activeFilter]);

    const totalValue = sampleProducts
        .reduce((sum, product) => sum + parseFloat(product.price.replace('$', '').replace(',', '')) * product.stock, 0)
        .toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

    const lowStockCount = sampleProducts.filter(p => p.status === 'low_stock' || p.stock < 10).length;

    const renderStockStatus = (product: Product) => {
        if (product.status === 'draft') {
            return (
                <View style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#FFF3E0', borderRadius: 4 }}>
                    <Text style={{ fontSize: 12, color: '#E65100', fontWeight: '500' }}>Unpublish</Text>
                </View>
            );
        }

        const isLowStock = product.stock < 10;
        return (
            <Text style={{ fontSize: 12, color: isLowStock ? '#D32F2F' : '#1B5E20', fontWeight: '500' }}>
                {product.stock} in stock
            </Text>
        );
    };
    // this is for handle add product
    const handleAddProduct = () => {
        router.push('/(screens)');
    };
    const handleBack = () => {
        router.back();
    };
    return (
        <View>
            <ScrollView style={{ paddingHorizontal: 20 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    {/* Header */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
                        <TouchableOpacity onPress={() => handleBack()}>
                            <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>Products</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    {/* Search Bar */}
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

                    {/* Summary Cards */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
                        <View style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            width: '48%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2,
                        }}>
                            <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Total value</Text>
                            {/* Fixed part: remove extra $ */}
                            <Text style={{ fontSize: 18, fontWeight: '600' }}>{totalValue}</Text>
                        </View>

                        <View style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            width: '48%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2,
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: 12, color: '#666' }}>Low stock items</Text>
                                <Ionicons name="warning-outline" size={16} color="red" />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: '600' }}>{lowStockCount}</Text>
                        </View>
                    </View>
                    {/* Filter Tabs */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginBottom: 16 }}
                    >
                        {['All', 'Active', 'Drafts', 'Low Stock'].map((filter) => {
                            const filterValue = filter.toLowerCase().replace(' ', '_');
                            const isActive = activeFilter === (filterValue === 'low_stock' ? 'low_stock' : filterValue);

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
                                    onPress={() => setActiveFilter(filterValue === 'all' ? 'all' : filterValue as any)}
                                >
                                    <Text style={{
                                        color: isActive ? 'white' : '#2B2B2B',
                                        fontSize: 14
                                    }}>
                                        {filter}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                    {/* Product List */}
                    <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 16 }}>Inventory Items</Text>
                    <View>
                        {filteredProducts.map((product: Product) => (
                            <TouchableOpacity
                                onPress={() => router.push({
                                    pathname: '/(screens)/product_details',
                                    params: { id: product.id }
                                })}
                                key={product.id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 12,
                                    padding: 12,
                                    marginBottom: 12,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2,
                                    elevation: 1,
                                }}
                            >
                                <Image
                                    source={{ uri: product.images[0] }}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 8,
                                        marginRight: 12,
                                    }}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        marginBottom: 4
                                    }}>
                                        {product.name}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: '#6B7280',
                                            marginRight: 8
                                        }}>
                                            {product.sku}
                                        </Text>
                                        <View style={{
                                            paddingHorizontal: 8,
                                            paddingVertical: 2,
                                            borderRadius: 12,
                                            backgroundColor: product.status === 'active' ? '#D1FAE5' :
                                                product.status === 'low_stock' ? '#FEF3C7' : '#E5E7EB',
                                        }}>
                                            <Text style={{
                                                fontSize: 10,
                                                color: product.status === 'active' ? '#065F46' :
                                                    product.status === 'low_stock' ? '#92400E' : '#4B5563',
                                                fontWeight: '500'
                                            }}>
                                                {product.status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '700',
                                    color: '#111827'
                                }}>
                                    ${product.price}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </SafeAreaView>
            </ScrollView>

            {/* add product action Button */}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    right: 24,
                    bottom: 24,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: '#278687',
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                }}
                onPress={() => handleAddProduct()}
            >
                <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default Product;
