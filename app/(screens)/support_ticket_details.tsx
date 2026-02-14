import { supportTickets } from '@/constants/common';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SupportTicketDetailsScreen() {
    const router = useRouter();
    const { ticketId } = useLocalSearchParams();
    const [message, setMessage] = useState('');

    const ticket = supportTickets.find(t => t.id === ticketId);

    if (!ticket) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Ticket not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
                    <Text style={{ color: '#278687' }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleString();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FBF9' }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                backgroundColor: '#FFF',
                borderBottomWidth: 1,
                borderBottomColor: '#E3E6F0'
            }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back-ios-new" size={20} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: '600', marginLeft: 16, flex: 1 }}>
                    Ticket #{ticket.id}
                </Text>
                <View style={{
                    backgroundColor: ticket.status === 'open' ? '#DBEAFE' :
                        ticket.status === 'in_progress' ? '#FEF3C7' :
                            ticket.status === 'resolved' ? '#D1FAE5' : '#F3F4F6',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
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

            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    {/* Ticket Info */}
                    <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 8 }}>
                            {ticket.title}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 12, lineHeight: 20 }}>
                            {ticket.description}
                        </Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 }}>
                            <View>
                                <Text style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>Created</Text>
                                <Text style={{ fontSize: 13, color: '#4B5563' }}>{formatTime(ticket.createdAt)}</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>Priority</Text>
                                <Text style={{
                                    fontSize: 13,
                                    fontWeight: '600',
                                    color: ticket.priority === 'urgent' ? '#DC2626' :
                                        ticket.priority === 'high' ? '#EA580C' :
                                            ticket.priority === 'medium' ? '#D97706' : '#3730A3'
                                }}>
                                    {ticket.priority.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Messages */}
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
                        Discussion
                    </Text>

                    <View style={{ gap: 16, paddingBottom: 20 }}>
                        {ticket.messages.map((msg) => (
                            <View key={msg.id} style={{
                                flexDirection: 'row',
                                justifyContent: msg.isOwn ? 'flex-end' : 'flex-start'
                            }}>
                                {!msg.isOwn && (
                                    <Image
                                        source={{ uri: ticket.assignedTo?.avatar || 'https://via.placeholder.com/40' }}
                                        style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8, marginTop: 4 }}
                                    />
                                )}
                                <View style={{ maxWidth: '80%' }}>
                                    <View style={{
                                        backgroundColor: msg.isOwn ? '#278687' : '#FFF',
                                        padding: 12,
                                        borderRadius: 12,
                                        borderBottomRightRadius: msg.isOwn ? 4 : 12,
                                        borderBottomLeftRadius: msg.isOwn ? 12 : 4,
                                        borderWidth: msg.isOwn ? 0 : 1,
                                        borderColor: '#E5E7EB'
                                    }}>
                                        <Text style={{ color: msg.isOwn ? '#FFF' : '#374151', fontSize: 14, lineHeight: 20 }}>
                                            {msg.text}
                                        </Text>
                                    </View>
                                    <Text style={{
                                        fontSize: 11,
                                        color: '#9CA3AF',
                                        marginTop: 4,
                                        textAlign: msg.isOwn ? 'right' : 'left'
                                    }}>
                                        {formatTime(msg.timestamp)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* Reply Box */}
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
                    <View style={{
                        padding: 16,
                        backgroundColor: '#FFF',
                        borderTopWidth: 1,
                        borderTopColor: '#E3E6F0',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <TextInput
                            placeholder="Type a reply..."
                            value={message}
                            onChangeText={setMessage}
                            style={{
                                flex: 1,
                                backgroundColor: '#F3F4F6',
                                borderRadius: 20,
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                marginRight: 12,
                                maxHeight: 100
                            }}
                            multiline
                        />
                        <TouchableOpacity style={{
                            backgroundColor: '#278687',
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: message.trim() ? 1 : 0.6
                        }} disabled={!message.trim()}>
                            <MaterialIcons name="send" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}
