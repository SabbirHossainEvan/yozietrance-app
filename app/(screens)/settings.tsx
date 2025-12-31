import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
    // Helper for rendering menu rows
    const SettingItem = ({ label, onPress }: { label: string; onPress: () => void }) => (
        <TouchableOpacity
            onPress={onPress}
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 20,
            }}
        >
            <Text style={{ fontSize: 16, color: '#1F2937', fontWeight: '500' }}>
                {label}
            </Text>
            <Entypo name="chevron-thin-right" size={18} color="#4B5563" />
        </TouchableOpacity>
    );

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 12,
                paddingHorizontal: 20,
            }}>
                <TouchableOpacity onPress={() => handleBack()}>
                    <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 20,
                    paddingTop: 10,
                    paddingBottom: 30
                }}
            >
                <View style={{ marginBottom: 40 }}>

                    <SettingItem label="Change Password" onPress={() => router.push('/(screens)/change_password')} />
                    <SettingItem label="About Us" onPress={() => router.push('/(screens)/about_us')} />
                    <SettingItem label="Help" onPress={() => router.push('/(screens)/help')} />
                    <SettingItem label="Support Requests" onPress={() => router.push('/(screens)/support_requests')} />
                    <SettingItem label="Privacy Policy" onPress={() => router.push('/(screens)/privacy_policy')} />
                    <SettingItem label="Terms of service" onPress={() => router.push('/(screens)/terms_of_service')} />
                </View>

                {/* Spacer to push button to bottom if content is short */}
                <View style={{ flex: 1 }} />

                {/* Delete Account Button */}
                <TouchableOpacity
                    style={{
                        backgroundColor: '#2D8A8A',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 16,
                        borderRadius: 12,
                        marginTop: 20,
                    }}
                >
                    <MaterialIcons name="delete-outline" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700' }}>
                        Delete Account
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsScreen;