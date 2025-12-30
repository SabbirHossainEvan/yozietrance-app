import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
    const userData = {
        name: 'Abcd.LTD',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
    };

    return (
        <SafeAreaView style={{ flex: 1}}>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
                showsVerticalScrollIndicator={false}
            >
                {/*Account Information Card*/}
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 1,
                }}>
                    {/* Profile Header */}
                    <View style={{ alignItems: 'center', marginBottom: 24 }}>
                        <Image
                            source={{ uri: userData.avatar }}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                marginBottom: 12,
                            }}
                        />
                        <Text style={{ fontSize: 22, fontWeight: '600', color: '#111' }}>
                            {userData.name}
                        </Text>
                    </View>

                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 20 }}>
                        Account Information
                    </Text>

                    {/* Personal Info Link */}
                    <TouchableOpacity onPress={
                        () => router.push('/(screens)/personal_info')
                    } 
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14 }}>
                        <Ionicons name="person-outline" size={26} color="#4B5563" />
                        <Text style={{ fontSize: 16, color: '#4B5563', marginLeft: 14, fontWeight: '500' }}>
                            Personal info
                        </Text>
                    </TouchableOpacity>

                    {/* Business Info Link */}
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14 }}>
                        <Ionicons name="business-outline" size={26} color="#4B5563" />
                        <Text style={{ fontSize: 16, color: '#4B5563', marginLeft: 14, fontWeight: '500' }}>
                            Business info
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Setting Card */}
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 1,
                }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 20 }}>
                        Setting
                    </Text>

                    {/* Permission Link */}
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14 }}>
                        <Feather name="check-circle" size={24} color="#4B5563" />
                        <Text style={{ fontSize: 16, color: '#4B5563', marginLeft: 14, fontWeight: '500' }}>
                            Permission
                        </Text>
                    </TouchableOpacity>

                    {/* Settings Link */}
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14 }}>
                        <Ionicons name="settings-outline" size={26} color="#4B5563" />
                        <Text style={{ fontSize: 16, color: '#4B5563', marginLeft: 14, fontWeight: '500' }}>
                            Settings
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Logout Card */}
                <TouchableOpacity
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 8,
                        elevation: 1,
                    }}
                >
                    <MaterialIcons name="logout" size={26} color="#4B5563" />
                    <Text style={{ fontSize: 16, color: '#4B5563', marginLeft: 14, fontWeight: '600' }}>
                        Log Out
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;