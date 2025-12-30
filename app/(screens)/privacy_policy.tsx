import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const PrivacyPolicy = () => {
    const handleBack = () => {
        router.back();
    };

    return (
        // FIX 1: Add flex: 1 to SafeAreaView
        <SafeAreaView style={{ flex: 1}}>

            {/* FIX 2: Add flex: 1 to this wrapper View */}
            <View style={{ flex: 1 }}>

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
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>Privacy Policy</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Body */}
                {/* FIX 3: Ensure ScrollView has flex: 1 (it does by default, but parent must be constrained) */}
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View>
                        {/* Main Title */}
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 20 }}>
                            Privacy & Policy
                        </Text>

                        {/* Main Description */}
                        <Text style={{ fontSize: 16, color: '#4B5563', lineHeight: 24, marginBottom: 30 }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </Text>

                        {/* Section 1 */}
                        <View style={{ marginBottom: 25 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 }}>
                                1. Information we collect
                            </Text>
                            <Text style={{ fontSize: 16, color: '#4B5563', lineHeight: 24 }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </Text>
                        </View>

                        {/* Section 2 */}
                        <View style={{ marginBottom: 25 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 }}>
                                2. How We Use Your Information
                            </Text>
                            <Text style={{ fontSize: 16, color: '#4B5563', lineHeight: 24 }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </Text>
                        </View>

                        {/* Section 3 */}
                        <View style={{ marginBottom: 40 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 }}>
                                3. Information Sharing
                            </Text>
                            <Text style={{ fontSize: 16, color: '#4B5563', lineHeight: 24 }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default PrivacyPolicy