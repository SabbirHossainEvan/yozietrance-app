import { Stack } from 'expo-router';

export default function ScreensLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="product_details" />
            <Stack.Screen name="order_details" />
            <Stack.Screen name="export_invoice" />
            <Stack.Screen name="chat_box" />
            <Stack.Screen name="personal_info" />
            <Stack.Screen name="permission" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="privacy_policy" />
            <Stack.Screen name="about_us" />
            <Stack.Screen name="help" />
            <Stack.Screen name="terms_of_service" />
            <Stack.Screen name="change_password" />
            <Stack.Screen name="support_requests" />
            <Stack.Screen name="qr_code" />
            <Stack.Screen name="notifications" />
        </Stack>
    );
}