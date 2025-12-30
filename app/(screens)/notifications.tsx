import { notifications } from '@/constants/common'
import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Notifications = () => {
    const [notificationList, setNotificationList] = useState(notifications);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleDelete = () => {
        if (selectedId) {
            setNotificationList(prev => prev.filter(item => item.id !== selectedId));
            setModalVisible(false);
            setSelectedId(null);
        }
    };

    const confirmDelete = (id: string) => {
        setSelectedId(id);
        setModalVisible(true);
    };
    const handleBack = () => {
        router.back()
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{
                paddingLeft: 20,
                paddingRight: 20
            }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => handleBack()}>
                        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>Notifications</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Notification List */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ gap: 12, paddingBottom: 20 }}>
                        {notificationList.map((notification) => (
                            <TouchableOpacity onPress={() => confirmDelete(notification.id)} style={{
                                backgroundColor: '#fff',
                                flexDirection: 'row',
                                padding: 16,
                                marginHorizontal: 1,
                                borderRadius: 16,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 8,
                                elevation: 1,
                                alignItems: 'flex-start',
                                gap: 12
                            }} key={notification.id}>
                                <Image
                                    source={{ uri: 'https://i.pravatar.cc/150?u=' + notification.id }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        backgroundColor: '#f0f0f0'
                                    }}
                                />

                                {/* Content */}
                                <View style={{ flex: 1, gap: 4 }}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: '#5E5E5E',
                                        lineHeight: 20
                                    }}>
                                        {notification.body}
                                    </Text>
                                    <Text style={{
                                        fontSize: 14,
                                        color: '#5E5E5E',
                                        marginTop: 2
                                    }}>
                                        1 day ago
                                    </Text>
                                </View>

                                {/* Menu Option */}
                                <TouchableOpacity onPress={() => confirmDelete(notification.id)}>
                                    <MaterialIcons name="more-vert" size={20} color="#8C8C8C" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* Delete Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <View style={{
                        width: '80%',
                        backgroundColor: 'white',
                        borderRadius: 20,
                        padding: 20,
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    }}>
                        <Text style={{
                            marginBottom: 15,
                            textAlign: 'center',
                            fontSize: 18,
                            fontWeight: '600'
                        }}>Delete Notification</Text>
                        <Text style={{
                            marginBottom: 20,
                            textAlign: 'center',
                            color: '#666'
                        }}>Are you sure you want to delete this notification?</Text>
                        <View style={{ flexDirection: 'row', gap: 15 }}>
                            <Pressable
                                style={{
                                    borderRadius: 10,
                                    padding: 10,
                                    elevation: 2,
                                    backgroundColor: '#F0F0F0',
                                    minWidth: 100,
                                    alignItems: 'center'
                                }}
                                onPress={() => setModalVisible(false)}>
                                <Text style={{
                                    color: 'black',
                                    fontWeight: '600'
                                }}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={{
                                    borderRadius: 10,
                                    padding: 10,
                                    elevation: 2,
                                    backgroundColor: '#278687',
                                    minWidth: 100,
                                    alignItems: 'center'
                                }}
                                onPress={handleDelete}>
                                <Text style={{
                                    color: 'white',
                                    fontWeight: '600'
                                }}>Confirm</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >

    )
}

export default Notifications