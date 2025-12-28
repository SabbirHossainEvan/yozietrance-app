// app/screens/AddProductScreen.tsx
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type RootStackParamList = {
    AddProduct: undefined;
    // Add other screens here
};

const AddProductScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Product</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Add your form fields here */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Product Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter product name"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter price"
                        keyboardType="decimal-pad"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Stock</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter stock quantity"
                        keyboardType="numeric"
                    />
                </View>

                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add Product</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E3E6F0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E3E6F0',
    },
    addButton: {
        backgroundColor: '#278687',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AddProductScreen;