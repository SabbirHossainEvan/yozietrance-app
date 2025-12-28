import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddProduct() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showSpecInputs, setShowSpecInputs] = useState(false);
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [specs, setSpecs] = useState<Array<{ key: string, value: string }>>([]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSubmit = () => {
    // Add your form submission logic here
    console.log({
      productName,
      description,
      price,
      stock,
      image,
      specs
    });
    // router.back(); // Uncomment to go back after submission
  };

  return (
    <SafeAreaView style={{
      flex: 1, marginLeft: 20,
      marginRight: 20,
    }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>Products</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Product Image Upload */}
        <View style={{
          padding: 16,
          marginBottom: 20,
          backgroundColor: '#FFF',
          borderRadius: 12
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: 16
          }}>
            Product Image
          </Text>

          <TouchableOpacity
            onPress={pickImage}
            style={{
              height: 160,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderStyle: 'dashed',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: image ? 'transparent' : '#F9FAFB',
              overflow: 'hidden'
            }}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover'
                }}
              />
            ) : (
              <>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#F3F4F6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12
                }}>
                  <MaterialIcons name="add" size={24} color="#6B7280" />
                </View>
                <Text style={{
                  fontSize: 14,
                  color: '#6B7280',
                  fontWeight: '500',
                  marginBottom: 4
                }}>
                  Upload Image
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: '#9CA3AF'
                }}>
                  or drag and drop
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Product Details */}
        <View style={{
          padding: 16,
          marginBottom: 20,
          backgroundColor: '#FFF',
          borderRadius: 12
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: 20
          }}>
            Product Details
          </Text>

          {/* Product Name */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 14,
              color: '#4B5563',
              marginBottom: 8,
              fontWeight: '500'
            }}>
              Product Name
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 8,
                padding: 12,
                fontSize: 15,
                color: '#1F2937',
                backgroundColor: '#FFF',
              }}
              placeholder="Enter product name"
              placeholderTextColor="#9CA3AF"
              value={productName}
              onChangeText={setProductName}
            />
          </View>

          {/* Description */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 14,
              color: '#4B5563',
              marginBottom: 8,
              fontWeight: '500'
            }}>
              Description
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 8,
                padding: 12,
                fontSize: 15,
                color: '#1F2937',
                backgroundColor: '#FFF',
                height: 100,
                textAlignVertical: 'top',
              }}
              placeholder="Enter product description"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Price and Stock Row */}
          <View style={{
            flexDirection: 'row',
            marginBottom: 20,
            gap: 16
          }}>
            {/* Price */}
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 14,
                color: '#4B5563',
                marginBottom: 8,
                fontWeight: '500'
              }}>
                Price
              </Text>
              <View style={{ position: 'relative' }}>
                <Text style={{
                  position: 'absolute',
                  left: 12,
                  top: 12,
                  fontSize: 15,
                  color: '#9CA3AF',
                  zIndex: 1
                }}>
                  $
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 8,
                    padding: 12,
                    paddingLeft: 32,
                    fontSize: 15,
                    color: '#1F2937',
                    backgroundColor: '#FFF',
                  }}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
            </View>
          </View>

          {/* Category */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 14,
              color: '#4B5563',
              marginBottom: 8,
              fontWeight: '500'
            }}>
              Category
            </Text>
            <View style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 8,
              padding: 2,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FFF',
            }}>
              <TextInput
                placeholder="Add category"
                placeholderTextColor="#9CA3AF"
                style={{
                  color: '#9CA3AF',
                  fontSize: 15,
                  paddingLeft: 12,
                }} />

            </View>
          </View>
        </View>
        {/* Specification */}
        <View style={{
          padding: 16,
          marginBottom: 20,
          backgroundColor: '#FFF',
          borderRadius: 12,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: 16
            }}>
              Specification
            </Text>
            <TouchableOpacity onPress={() => setShowSpecInputs(true)}>
              <Text style={{ color: '#278687' }}>Add Specification</Text>
            </TouchableOpacity>
          </View>
          <View>
            {showSpecInputs && (
              <View style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 15,
                        color: '#1F2937',
                        backgroundColor: '#FFF',
                      }}
                      placeholder="Enter key"
                      placeholderTextColor="#9CA3AF"
                      value={specKey}
                      onChangeText={setSpecKey}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 15,
                        color: '#1F2937',
                        backgroundColor: '#FFF',
                      }}
                      placeholder="Enter value"
                      placeholderTextColor="#9CA3AF"
                      value={specValue}
                      onChangeText={setSpecValue}
                      onSubmitEditing={() => {
                        if (specKey.trim() && specValue.trim()) {
                          setSpecs([...specs, { key: specKey, value: specValue }]);
                          setSpecKey('');
                          setSpecValue('');
                          setShowSpecInputs(false);
                        }
                      }}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => setShowSpecInputs(false)}
                    style={{
                      padding: 8,
                      borderRadius: 4
                    }}
                  >
                    <Text style={{ color: '#6B7280' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (specKey.trim() && specValue.trim()) {
                        setSpecs([...specs, { key: specKey, value: specValue }]);
                        setSpecKey('');
                        setSpecValue('');
                        setShowSpecInputs(false);
                      }
                    }}
                    style={{
                      backgroundColor: '#278687',
                      padding: 8,
                      borderRadius: 4
                    }}
                  >
                    <Text style={{ color: 'white' }}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {specs.length > 0 ? specs.map((spec, index) => (
              <View key={index} style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
                padding: 12,
                backgroundColor: '#F3F4F6',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#E5E7EB'
              }}>
                <View style={{
                  flex: 1,
                  flexDirection: 'column',
                  paddingRight: 8
                }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '500',
                    marginRight: 8
                  }}>
                    {spec.key}:
                  </Text>
                  <Text style={{
                    color: '#6B7280',
                    fontSize: 14,
                    fontWeight: '500'
                  }}>
                    {spec.value}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    const newSpecs = [...specs];
                    newSpecs.splice(index, 1);
                    setSpecs(newSpecs);
                  }}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: '#E5E7EB',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <MaterialIcons name="close" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            )) : <View>
              <Text style={{ color: '#6B7280', fontSize: 14, fontWeight: '500' }}>No specification added</Text>
            </View>}
          </View>
        </View>
      </ScrollView>

      {/* Add Product Button */}
      <View style={{
        backgroundColor: '#FFF',
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#278687',
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
          }}
          onPress={handleSubmit}
        >
          <Text style={{
            color: '#FFF',
            fontSize: 16,
            fontWeight: '600'
          }}>
            Add Product
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView >
  );
}