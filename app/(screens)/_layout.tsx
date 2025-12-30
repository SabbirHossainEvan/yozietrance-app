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
            <Stack.Screen
                name="export_invoice"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="chat_box"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="personal_info"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="permission"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="settings"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="privacy_policy"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="about_us"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="help"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="terms_of_service"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="change_password"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="support_requests"
                options={{
                    headerShown: false
                }}
            />

        </Stack>
    );
}