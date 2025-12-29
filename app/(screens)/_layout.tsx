import { Stack } from 'expo-router';

export default function ScreensLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="product_details"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="order_details"
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    );
}