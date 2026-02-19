import { supportTickets } from '@/constants/common';
import { useGetConversationsQuery, useMarkAsReadMutation } from '@/store/api/chatApiSlice';
import { useGetMyConnectionsQuery } from '@/store/api/connectionApiSlice';
import { RootState } from '@/store/store';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
//
const ChatTabs = () => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);
    const currentUserId = user?.userId || user?.id || (user as any)?._id;
    const [activeTab, setActiveTab] = useState<'chat' | 'support'>('chat');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: conversationsData, isLoading: isConversationsLoading } = useGetConversationsQuery(currentUserId, {
        skip: !currentUserId,
        refetchOnMountOrArgChange: true,
    });
    const { data: connectionsData, isLoading: isConnectionsLoading } = useGetMyConnectionsQuery(currentUserId, {
        skip: !currentUserId,
        refetchOnMountOrArgChange: true,
    });
    const [markAsRead] = useMarkAsReadMutation();

    const conversations = useMemo(() => {
        const chatList = Array.isArray(conversationsData) ? [...conversationsData] : [];
        const connections = connectionsData?.data || [];

        const isMe = (id: string) => id === user?.id || id === user?.userId;

        // Add partner and normalized participant to existing conversations
        const enrichedChatList = chatList.map(conv => {
            const partner = conv.participants?.find((p: any) => !isMe(p._id || p.id || p.userId))
                || conv.participant
                || (conv.participants?.[0] && !isMe(conv.participants[0]._id || conv.participants[0].id) ? conv.participants[0] : conv.participants?.[1]);

            return {
                ...conv,
                participant: partner
            };
        });

        // Map conversation partner IDs
        const existingPartnerIds = new Set(
            enrichedChatList.map(conv => {
                const partner = conv.participant;
                return partner?.userId || partner?._id || partner?.id;
            }).filter(Boolean)
        );

        // Add connections that don't have a conversation yet
        connections.forEach((conn: any) => {
            const partner = conn.user || conn.buyer; // For vendor, the connection is to a user/buyer
            const partnerId = partner?.userId || partner?._id || partner?.id;
            if (partner && partnerId && !existingPartnerIds.has(partnerId)) {
                enrichedChatList.push({
                    _id: partnerId,
                    id: partnerId,
                    participants: [partner],
                    lastMessage: null,
                    unreadCount: 0,
                    isConnectionOnly: true,
                    participant: partner
                });
            }
        });

        return enrichedChatList;
    }, [conversationsData, connectionsData, user?.id, user?.userId]);

    const chatsLoading = isConversationsLoading || isConnectionsLoading;

    const handleChatPress = (participantId: string, name: string) => {
        router.push({
            pathname: "/chat_box",
            params: { partnerId: participantId, conversationId: participantId, name }
        });
    };

    const handleTicketPress = (ticketId: string) => {
        router.push(`/(screens)/support_ticket_details?ticketId=${ticketId}`);
    };

    const handleBack = () => {
        router.back();
    };

    const handleTabPress = (tab: 'chat' | 'support') => {
        setActiveTab(tab);
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };


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
                                {chatsLoading ? (
                                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>Loading conversations...</Text>
                                ) : (
                                    (conversations || []).filter((c: any) => {
                                        const p = c.participant || {};
                                        const name = p.storename || p.name || p.businessName || p.fullName || '';
                                        return name.toLowerCase().includes(searchQuery.toLowerCase());
                                    }).map((conversation: any) => {
                                        const participant = conversation.participant || {};
                                        const partnerId = participant.userId || participant._id || participant.id;
                                        const displayName = participant.storename || participant.name || participant.fullName || participant.fulllName || 'User';
                                        return (
                                            <TouchableOpacity
                                                key={conversation.id || conversation._id || partnerId}
                                                onPress={() => {
                                                    if ((conversation.unreadCount || 0) > 0 && (conversation.lastMessage?._id || conversation.lastMessage?.id)) {
                                                        markAsRead(conversation.lastMessage._id || conversation.lastMessage.id);
                                                    }
                                                    handleChatPress(partnerId, displayName);
                                                }}
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
                                                        source={{ uri: participant.avatar || participant.logoUrl || 'https://via.placeholder.com/40' }}
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
                                                        <View>
                                                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2937' }}>
                                                                {displayName}
                                                            </Text>
                                                            <Text style={{ fontSize: 10, color: '#278687', fontWeight: '500' }}>#{participant.userId?.slice(-6).toUpperCase() || participant._id?.slice(-6).toUpperCase() || 'ID'}</Text>
                                                        </View>
                                                        <Text style={{ fontSize: 11, color: '#9CA3AF' }}>
                                                            {conversation.lastMessage?.createdAt ? formatTime(new Date(conversation.lastMessage.createdAt)) : ''}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 12, color: '#6B7280', flex: 1 }} numberOfLines={1}>
                                                            {conversation.isTyping ? (
                                                                <Text style={{ fontStyle: 'italic', color: '#278687' }}>Typing...</Text>
                                                            ) : (
                                                                conversation.lastMessage?.messageText || conversation.lastMessage?.text || (conversation.isConnectionOnly ? 'Connect to start chatting' : 'No messages yet')
                                                            )}
                                                        </Text>
                                                        {(conversation.unreadCount || 0) > 0 && (
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
                                        );
                                    }))}
                                {!chatsLoading && (conversations || []).length === 0 && (
                                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>No conversations found</Text>
                                )}
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
