import { MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { chatConversations, recentOrders } from '../constants/common'

const ChatBox = () => {
    const router = useRouter();
    const { conversationId } = useLocalSearchParams();
    const [message, setMessage] = useState('');
    const [activeInfoTab, setActiveInfoTab] = useState<'userInfo' | 'orderHistory'>('userInfo');

    const conversation = chatConversations.find(conv => conv.id === conversationId);

    if (!conversation) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#6B7280' }}>Conversation not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    const handleBack = () => {
        router.back();
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            console.log('Message sent:', message);
            setMessage('');
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <SafeAreaView style={{ flex: 1}}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#F3F4F6'
            }}>
                <TouchableOpacity onPress={handleBack}>
                    <MaterialIcons name="arrow-back-ios-new" size={20} color="black" />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 16 }}>
                    <View style={{ position: 'relative' }}>
                        <Image
                            source={{ uri: conversation.participant.avatar }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                            resizeMode="cover"
                        />
                        {conversation.isOnline && (
                            <View style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 12,
                                height: 12,
                                borderRadius: 6,
                                backgroundColor: '#10B981',
                                borderWidth: 2,
                                borderColor: '#fff',
                            }} />
                        )}
                    </View>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2937' }}>
                            {conversation.participant.name}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#6B7280' }}>
                            {conversation.isOnline ? 'Online' : 'Offline'}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <MaterialIcons name="more-vert" size={20} color="#6B7280" />
                </TouchableOpacity>
            </View>

            {/* Tabs Section */}
            <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                    <TouchableOpacity
                        onPress={() => setActiveInfoTab('userInfo')}
                        style={{
                            flex: 1,
                            paddingVertical: 12,
                            backgroundColor: activeInfoTab === 'userInfo' ? '#278687' : '#e6f1ef',
                            borderRadius: 8,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{
                            color: activeInfoTab === 'userInfo' ? '#fff' : '#2B2B2B',
                            fontSize: 14
                        }}>User Info</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveInfoTab('orderHistory')}
                        style={{
                            flex: 1,
                            paddingVertical: 12,
                            backgroundColor: activeInfoTab === 'orderHistory' ? '#278687' : '#e6f1ef',
                            borderRadius: 8,
                            alignItems: 'center',
                            marginLeft: 8,
                        }}
                    >
                        <Text style={{
                            color: activeInfoTab === 'orderHistory' ? '#fff' : '#2B2B2B',
                            fontSize: 14
                        }}>Order History</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content Area */}
            <View style={{ flex: 1 }}>
                {activeInfoTab === 'userInfo' ? (
                    <>
                        <ScrollView
                            style={{ flex: 1, paddingHorizontal: 20 }}
                            contentContainerStyle={{ paddingVertical: 16 }}
                        >
                            {conversation.messages.map((msg) => (
                                <View key={msg.id} style={{ marginBottom: 16 }}>
                                    {msg.isOwn ? (
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <View style={{
                                                backgroundColor: '#278687',
                                                borderRadius: 18,
                                                borderBottomRightRadius: 4,
                                                paddingHorizontal: 16,
                                                paddingVertical: 12,
                                                maxWidth: '80%',
                                            }}>
                                                <Text style={{ fontSize: 14, color: '#fff', lineHeight: 20 }}>
                                                    {msg.text}
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                                                {formatTime(msg.timestamp)}
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={{ alignItems: 'flex-start' }}>
                                            <View style={{
                                                backgroundColor: '#fff',
                                                borderRadius: 18,
                                                borderBottomLeftRadius: 4,
                                                paddingHorizontal: 16,
                                                paddingVertical: 12,
                                                maxWidth: '80%',
                                                borderWidth: 1,
                                                borderColor: '#E5E7EB',
                                            }}>
                                                <Text style={{ fontSize: 14, color: '#1F2937', lineHeight: 20 }}>
                                                    {msg.text}
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                                                {formatTime(msg.timestamp)}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ))}

                            {conversation.isTyping && (
                                <View style={{ alignItems: 'flex-start', marginBottom: 16 }}>
                                    <View style={{
                                        backgroundColor: '#fff',
                                        borderRadius: 18,
                                        borderBottomLeftRadius: 4,
                                        paddingHorizontal: 16,
                                        paddingVertical: 12,
                                        borderWidth: 1,
                                        borderColor: '#E5E7EB',
                                    }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {[1, 2, 3].map((dot) => (
                                                <View key={dot} style={{
                                                    width: 8, height: 8, borderRadius: 4,
                                                    backgroundColor: '#9CA3AF', marginRight: 4
                                                }} />
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            )}
                        </ScrollView>

                        {/* Message Input - Only in User Info Tab */}
                        <View style={{
                            paddingHorizontal: 20,
                            paddingVertical: 16,
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#F3F4F6',
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderWidth: 1,
                                borderColor: '#E5E7EB',
                                borderRadius: 22,
                            }}>
                                <TouchableOpacity style={{ marginRight: 12 }}>
                                    <MaterialIcons name="attach-file" size={20} color="#6B7280" />
                                </TouchableOpacity>
                                <TextInput
                                    value={message}
                                    onChangeText={setMessage}
                                    placeholder="Type a message..."
                                    placeholderTextColor="#9CA3AF"
                                    style={{ flex: 1, fontSize: 14, color: '#1F2937', maxHeight: 100 }}
                                    multiline
                                />
                                <TouchableOpacity
                                    onPress={handleSendMessage}
                                    style={{
                                        marginLeft: 12,
                                        backgroundColor: message.trim() ? '#278687' : '#D1D5DB',
                                        borderRadius: 20,
                                        width: 36,
                                        height: 36,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <MaterialIcons
                                        name="send"
                                        size={18}
                                        color={message.trim() ? '#fff' : '#9CA3AF'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                ) : (
                    /* Order History View */
                    <ScrollView
                        style={{ flex: 1, paddingHorizontal: 20 }}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ gap: 12, marginTop: 10 }}>
                            {recentOrders.filter((order) => order.customer.name === conversation.participant.name).length > 0 ? (
                                recentOrders.filter((order) => order.customer.name === conversation.participant.name).map((order) => (
                                    <View
                                        key={order.id}
                                        style={{
                                            backgroundColor: 'white',
                                            borderRadius: 8,
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
                                                source={{ uri: order.customer.avatar }}
                                                style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
                                                resizeMode="cover"
                                            />
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 4 }}>
                                                    {order.orderNumber}
                                                </Text>
                                                <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>
                                                    {order.orderStatus.date}
                                                </Text>
                                                <Text style={{ fontSize: 12, color: '#6B7280' }}>
                                                    {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''} • ${order.payment.grandTotal.toFixed(2)}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View style={{
                                                backgroundColor:
                                                    ['Delivered', 'Completed'].includes(order.orderStatus.status) ? '#D1FAE5' :
                                                        order.orderStatus.status === 'Processing' ? '#FEF3C7' :
                                                            order.orderStatus.status === 'Shipped' ? '#DBEAFE' : '#FEE2E2',
                                                paddingHorizontal: 8,
                                                paddingVertical: 4,
                                                borderRadius: 12,
                                            }}>
                                                <Text style={{
                                                    fontSize: 12,
                                                    fontWeight: '600',
                                                    color:
                                                        ['Delivered', 'Completed'].includes(order.orderStatus.status) ? '#065F46' :
                                                            order.orderStatus.status === 'Processing' ? '#D97706' :
                                                                order.orderStatus.status === 'Shipped' ? '#1D4ED8' : '#DC2626',
                                                }}>
                                                    {order.orderStatus.status}
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                                                {order.orderStatus.location}
                                            </Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
                                    <Text style={{ fontSize: 16, color: '#6B7280' }}>No orders found</Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
};

export default ChatBox;