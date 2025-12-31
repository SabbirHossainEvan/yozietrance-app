import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AboutUs = () => {
  const handleBack = () => {
    router.back();
  };
  return (
    <SafeAreaView>
      <View>
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
          <Text style={{ fontSize: 18, fontWeight: '600' }}>About Us</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>
      {/* About us content */}
      <ScrollView style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 10 }}>
            About Us
          </Text>
          <Text style={{ fontSize: 16, color: '#4B5563', lineHeight: 24 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
          </Text>
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 10 }}>
            Our Mission
          </Text>
          <Text style={{ fontSize: 16, color: '#4B5563', lineHeight: 24 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
          </Text>
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 10 }}>
            Our Vision
          </Text>
          <Text style={{ fontSize: 16, color: '#4B5563', lineHeight: 24 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
          </Text>
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 10 }}>
            Why Choose Us
          </Text>
          <Text style={{ fontSize: 16, color: '#4B5563', lineHeight: 24 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AboutUs