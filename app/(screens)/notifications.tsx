import { notifications } from '@/constants/common'
import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Notifications = () => {
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
                        {notifications.map((notification) => (
                            <View style={{
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
                                <TouchableOpacity>
                                    <MaterialIcons name="more-vert" size={20} color="#8C8C8C" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>

    )
}

export default Notifications