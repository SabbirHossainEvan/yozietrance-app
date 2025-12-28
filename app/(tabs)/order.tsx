import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { recentOrders } from '../constants/common'

const OrderTabs = () => {
    return (

        <SafeAreaView style={{ paddingHorizontal: 20 }}>
            <View>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
                    <TouchableOpacity>
                        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>Orders</Text>
                    <View />
                </View>
                {/* Order Search */}
                <View style={{ marginVertical: 16 }}>
                    <TextInput placeholder="Search by name" style={{
                        borderWidth: 1,
                        borderColor: '#E3E6F0',
                        borderRadius: 12,
                        padding: 16,
                        backgroundColor: '#FFF',
                        fontSize: 14
                    }} />
                </View>
                {/* This is for order list sorting */}
                <View>
                    <Text>Sort by</Text>
                </View>
                {/* this is for order list */}
                <ScrollView style={{ marginBottom: 100 }}>
                    <View style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                        {recentOrders.map((order: any) => (
                            <View
                                key={order.id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 12,
                                    padding: 12,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3,
                                    elevation: 2,
                                }}
                            >


                                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                    <Image
                                        source={{ uri: order.image }}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 8,
                                            marginRight: 12,
                                        }}
                                        resizeMode="cover"
                                    />
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text style={{ color: "#2B2B2B", fontSize: 16 }}>#{order.id}</Text>
                                            <View
                                                style={{
                                                    backgroundColor: order.status === 'Completed' ? '#E3F9E7' :
                                                        order.status === 'Pending' ? '#FFF3E0' :
                                                            order.status === 'Processing' ? '#E3F2FD' : '#F3E5F5',
                                                    paddingHorizontal: 8,
                                                    paddingVertical: 2,
                                                    borderRadius: 12,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: order.status === 'Completed' ? '#1B5E20' :
                                                            order.status === 'Pending' ? '#E65100' :
                                                                order.status === 'Processing' ? '#0D47A1' : '#4A148C',
                                                        fontSize: 10,
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {order.status}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={{ fontSize: 12, color: '#4D4D4D', marginBottom: 8 }}>{order.address}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ionicons name="star" size={12} color="#FFC107" />
                                            <Text style={{ fontSize: 12, marginLeft: 4 }}>{order.rating}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: "#eaf2f2",
                                    paddingLeft: 12,
                                    paddingRight: 12,
                                    paddingBottom: 10,
                                    paddingTop: 10,
                                    borderRadius: 6,
                                    marginTop: 8,
                                }}>
                                    <View>
                                        <Text style={{ fontSize: 12, fontWeight: '500', color: "#278687", }}>{order.customerName}</Text>
                                        <Text style={{ fontSize: 12, color: '#278687', }}>{order.items}</Text>
                                    </View>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: "#278687", }}>{order.total}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default OrderTabs