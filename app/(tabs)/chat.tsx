import { chatConversations, supportTickets } from '@/constants/common';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatTabs = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'chat' | 'support'>('chat');
    const [searchQuery, setSearchQuery] = useState('');

    const handleChatPress = (conversationId: string) => {
        router.push(`/(screens)/chat_box?conversationId=${conversationId}`);
    };

    const handleBack = () => {
        router.back();
    };

    const handleTabPress = (tab: 'chat' | 'support') => {
        setActiveTab(tab);
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const filteredChats = chatConversations.filter(chat =>
        chat.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredTickets = supportTickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {/* Fixed Header */}
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
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>Chat</Text>
                    <View style={{ width: 20 }}></View>
                </View>

                {/* Fixed Search Bar */}
                <View style={{ marginVertical: 16, paddingHorizontal: 20 }}>
                    <TextInput
                        placeholder="Search by name"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={{
                            borderWidth: 1,
                            borderColor: '#E3E6F0',
                            borderRadius: 12,
                            padding: 16,
                            backgroundColor: '#FFF',
                            fontSize: 14
                        }}
                    />
                </View>

                {/* Fixed Tabs */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 16 }}>
                    <TouchableOpacity
                        onPress={() => handleTabPress('chat')}
                        style={{
                            padding: 16,
                            backgroundColor: activeTab === 'chat' ? '#278687' : '#e6f1ef',
                            borderRadius: 12,
                            width: '48%',
                        }}
                    >
                        <Text style={{ color: activeTab === 'chat' ? '#fff' : '#2B2B2B', textAlign: 'center' }}>Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleTabPress('support')}
                        style={{
                            padding: 16,
                            backgroundColor: activeTab === 'support' ? '#278687' : '#e6f1ef',
                            borderRadius: 12,
                            width: '48%',
                        }}
                    >
                        <Text style={{ color: activeTab === 'support' ? '#fff' : '#2B2B2B', textAlign: 'center' }}>Support</Text>
                    </TouchableOpacity>
                </View>

                {/* Scrollable Content */}
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    showsVerticalScrollIndicator={false}
                >
                    {activeTab === 'chat' ? (
                        <View style={{ paddingHorizontal: 20 }}>
                            {/* Chat List Items */}
                            <View style={{ gap: 12 }}>
                                {filteredChats.map((conversation) => (
                                    <TouchableOpacity
                                        key={conversation.id}
                                        onPress={() => handleChatPress(conversation.id)}
                                        style={{
                                            backgroundColor: '#F3F8F4',
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#E3E6F0',
                                            paddingVertical: 16,
                                            paddingHorizontal: 12,
                                            borderRadius: 12,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <View style={{ position: 'relative' }}>
                                            <Image
                                                source={{ uri: conversation.participant.avatar }}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 20,
                                                    marginRight: 12,
                                                }}
                                                resizeMode="cover"
                                            />
                                            {conversation.isOnline && (
                                                <View style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    right: 10,
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: 6,
                                                    backgroundColor: '#10B981',
                                                    borderWidth: 2,
                                                    borderColor: '#fff',
                                                }} />
                                            )}
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937' }}>
                                                    {conversation.participant.name}
                                                </Text>
                                                <Text style={{ fontSize: 11, color: '#9CA3AF' }}>
                                                    {formatTime(conversation.lastMessage.timestamp)}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 12, color: '#6B7280', flex: 1 }} numberOfLines={1}>
                                                    {conversation.isTyping ? (
                                                        <Text style={{ fontStyle: 'italic', color: '#278687' }}>Typing...</Text>
                                                    ) : (
                                                        conversation.lastMessage.text
                                                    )}
                                                </Text>
                                                {conversation.unreadCount > 0 && (
                                                    <View style={{
                                                        backgroundColor: '#278687',
                                                        borderRadius: 10,
                                                        paddingHorizontal: 6,
                                                        paddingVertical: 2,
                                                        marginLeft: 8,
                                                    }}>
                                                        <Text style={{ fontSize: 10, color: '#fff', fontWeight: '600' }}>
                                                            {conversation.unreadCount}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            {conversation.orderContext && (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                                    <MaterialIcons name="shopping-bag" size={12} color="#9CA3AF" />
                                                    <Text style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 4 }}>
                                                        {conversation.orderContext.orderNumber} • {conversation.orderContext.status}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <View style={{ paddingHorizontal: 20 }}>
                            {/* Support Tickets List */}
                            <View style={{ gap: 12 }}>
                                {filteredTickets.map((ticket) => (
                                    <TouchableOpacity
                                        key={ticket.id}
                                        style={{
                                            backgroundColor: '#fff',
                                            borderRadius: 12,
                                            padding: 16,
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2,
                                            elevation: 1,
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 4 }}>
                                                    {ticket.title}
                                                </Text>
                                                <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }} numberOfLines={2}>
                                                    {ticket.description}
                                                </Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <View style={{
                                                        backgroundColor: ticket.priority === 'urgent' ? '#FEE2E2' :
                                                            ticket.priority === 'high' ? '#FED7AA' :
                                                                ticket.priority === 'medium' ? '#FEF3C7' : '#E0E7FF',
                                                        paddingHorizontal: 6,
                                                        paddingVertical: 2,
                                                        borderRadius: 4,
                                                    }}>
                                                        <Text style={{
                                                            fontSize: 10,
                                                            fontWeight: '600',
                                                            color: ticket.priority === 'urgent' ? '#DC2626' :
                                                                ticket.priority === 'high' ? '#EA580C' :
                                                                    ticket.priority === 'medium' ? '#D97706' : '#3730A3',
                                                        }}>
                                                            {ticket.priority.toUpperCase()}
                                                        </Text>
                                                    </View>
                                                    <View style={{
                                                        backgroundColor: ticket.status === 'open' ? '#DBEAFE' :
                                                            ticket.status === 'in_progress' ? '#FEF3C7' :
                                                                ticket.status === 'resolved' ? '#D1FAE5' : '#F3F4F6',
                                                        paddingHorizontal: 6,
                                                        paddingVertical: 2,
                                                        borderRadius: 4,
                                                    }}>
                                                        <Text style={{
                                                            fontSize: 10,
                                                            fontWeight: '600',
                                                            color: ticket.status === 'open' ? '#1D4ED8' :
                                                                ticket.status === 'in_progress' ? '#D97706' :
                                                                    ticket.status === 'resolved' ? '#065F46' : '#6B7280',
                                                        }}>
                                                            {ticket.status.replace('_', ' ').toUpperCase()}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image
                                                    source={{ uri: ticket.customer.avatar }}
                                                    style={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: 12,
                                                        marginRight: 8,
                                                    }}
                                                    resizeMode="cover"
                                                />
                                                <Text style={{ fontSize: 12, color: '#6B7280' }}>
                                                    {ticket.customer.name}
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 11, color: '#9CA3AF' }}>
                                                {formatTime(ticket.createdAt)}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}
export default ChatTabs