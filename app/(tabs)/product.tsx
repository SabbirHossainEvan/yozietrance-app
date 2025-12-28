import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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
    image: string;
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
            <ScrollView style={{ paddingHorizontal: 16 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
                    <TouchableOpacity>
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
                                    borderRadius: 20,
                                    marginRight: 8,
                                    backgroundColor: isActive ? '#278687' : '#F0F0F0',
                                }}
                                onPress={() => setActiveFilter(filterValue === 'all' ? 'all' : filterValue as any)}
                            >
                                <Text style={{
                                    color: isActive ? 'white' : '#666',
                                    fontWeight: '500',
                                    fontSize: 14
                                }}>
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

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
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>${totalValue}</Text>
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
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="warning" size={16} color="#D32F2F" style={{ marginRight: 4 }} />
                            <Text style={{ fontSize: 12, color: '#666' }}>Low stock items</Text>
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#D32F2F' }}>{lowStockCount}</Text>
                    </View>
                </View>

                {/* Product List */}
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 16 }}>Inventory Items</Text>
                <View style={{ marginBottom: 80 }}>
                    {filteredProducts.map((product) => (
                        <View
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
                                source={{ uri: product.image }}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 8,
                                    marginRight: 12
                                }}
                                resizeMode="cover"
                            />
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '500' }}>#{product.id}</Text>
                                    {renderStockStatus(product)}
                                </View>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '500',
                                        marginBottom: 4,
                                        flexShrink: 1
                                    }}
                                    numberOfLines={1}
                                >
                                    {product.name}
                                </Text>
                                <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{product.sku}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600' }}>{product.price}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Floating Action Button */}
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
                onPress={() => console.log('Add new product')}
            >
                <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Product;