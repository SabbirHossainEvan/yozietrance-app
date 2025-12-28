import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { commonData } from '../constants/common';
import { images } from '../constants/import_images';

// Quick actions data
const quickActions = [
  { id: 1, name: 'Add Product', icon: images.add_product },
  { id: 2, name: 'Add Client', icon: images.order_icon },
  { id: 3, name: 'Add Order', icon: images.invoice_icon },
  { id: 4, name: 'Add Expense', icon: images.analytics_icon },
];
export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View style={{
        paddingLeft: 20,
        paddingRight: 20,
      }}>
        {/* THIS IS FOR HOME HEADER */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 12,
          paddingBottom: 12,
        }}>
          <View>
            <Text style={{
              fontSize: 18,
              fontWeight: 'semibold',
            }}>Hi, Rokey Mahmud</Text>
            <Text style={{
              fontSize: 14,
            }}>Dec12,2025</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}>
            <View style={{
              backgroundColor: 'white',
              padding: 12,
              borderRadius: "100%",
              borderWidth: 0.5,
              borderColor: "#E3E6F0",
            }}>
              <Feather name="headphones" size={24} color="black" />
            </View>
            <View style={{
              backgroundColor: 'white',
              padding: 12,
              borderRadius: "100%",
              borderWidth: 0.5,
              borderColor: "#E3E6F0",
            }}>
              <Ionicons name="notifications-outline" size={24} color="black" />
            </View>
          </View>
        </View>
        {/* THIS IS FOR THIS MONTHS INFO PART */}
        <View>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 16,
          }}>This Month</Text>

          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 12,
          }}>
            {commonData.map((item, index) => (
              <View key={index} style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                width: '48%',
                gap: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}>
                {/* <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <View style={{
                    backgroundColor: '#F3F6FF',
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Feather 
                      name={item.metric === 'Sales' ? 'dollar-sign' : 
                            item.metric === 'Active Orders' ? 'shopping-bag' :
                            item.metric === 'Products' ? 'package' : 'users'} 
                      size={18} 
                      color="#4C6FFF" 
                    />
                  </View>
                 
                </View> */}
                <Text style={{
                  fontSize: 14,
                  marginBottom: 4,
                }}>
                  {item.metric}
                </Text>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '500',
                }}>
                  {item.value}
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 12,
                }}>
                  <Feather
                    name={item.trend === 'up' ? 'trending-up' : 'trending-down'}
                    size={12}
                    color={item.trend === 'up' ? '#088738' : '#E83808'}
                    style={{ marginRight: 2 }}
                  />
                  <Text style={{
                    fontSize: 10,
                    color: item.trend === 'up' ? '#088738' : '#E83808',
                    fontWeight: '500',
                  }}>
                    {item.change}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          {/* THIS IS FOR Quick Actions */}
          <View>
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
            }}>Quick Actions</Text>
            <View style={{
              flexDirection: 'row',
              marginTop: 10,
              marginBottom: 10,
              justifyContent: 'space-between',
            }}>
              {quickActions.map((action) => (
                <View key={action.id} style={{
                  alignItems: 'center',
                }}>
                  <TouchableOpacity style={{
                    backgroundColor: "white",
                    padding: 10,
                    borderRadius: "100%",
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Image source={action.icon} style={{ width: 24, height: 24 }} />
                  </TouchableOpacity>
                  <Text style={{
                    fontSize: 10,
                    textAlign: 'center',
                    marginTop: 6
                  }}>
                    {action.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}