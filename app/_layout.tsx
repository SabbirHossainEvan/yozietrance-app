import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DefaultTheme,
  Theme
} from "@react-navigation/native";
import { Stack } from "expo-router";
import React from 'react';
import "react-native-reanimated";
import { Provider } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { store } from '../store/store';
import "./global.css";

const CustomLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#F3F8F4",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Auto-login logic
  React.useEffect(() => {
    const checkLogin = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const userString = await AsyncStorage.getItem('user');

        if (accessToken && userString) {
          const user = JSON.parse(userString);
          console.log('Auto-login: Restoring session');
          store.dispatch(setCredentials({
            user,
            accessToken,
            refreshToken: refreshToken || ''
          }));
          // Optional: Navigate to home if needed, but router might not be ready here.
          // Usually better to render different layout or let the screens redirect.
        }
      } catch (e) {
        console.error('Auto-login failed:', e);
      }
    };

    checkLogin();
  }, []);

  return (
    <Provider store={store}>
      {/* <ThemeProvider
        value={colorScheme === "dark" ? DarkTheme : CustomLightTheme}
      > */}
      <Stack>
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(users)" options={{ headerShown: false }} />
        <Stack.Screen name="(user_screen)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      {/* <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
        /> */}
      {/* </ThemeProvider> */}
    </Provider>
  );
}
