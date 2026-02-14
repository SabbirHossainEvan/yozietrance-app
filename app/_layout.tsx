import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DefaultTheme,
  Theme
} from "@react-navigation/native";
import { Stack } from "expo-router";
import React from 'react';
import "react-native-reanimated";
import { Provider, useSelector } from 'react-redux';
import { SocketProvider } from "../context/SocketContext";
import { useGetProfileQuery } from "../store/api/authApiSlice";
import { setCredentials } from '../store/slices/authSlice';
import { RootState, store } from '../store/store';
import "./global.css";

const AuthSync = () => {
  const dispatch = store.dispatch;
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.userId;
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);

  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: !token || !!userId
  });

  React.useEffect(() => {
    if (profileData?.data && token) {
      const resolvedUserId = profileData.data.userId || profileData.data.vendor?.userId || profileData.data.buyer?.userId || profileData.data.id;

      if (resolvedUserId && userId !== resolvedUserId) {
        console.log('Syncing profile: Found Account ID:', resolvedUserId);
        dispatch(setCredentials({
          user: { ...user, ...profileData.data, userId: resolvedUserId },
          accessToken: token,
          refreshToken: refreshToken || ''
        }));
      }
    }
  }, [profileData, token, userId, refreshToken, dispatch]);

  return null;
};

const CustomLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#F3F8F4",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = React.useState(false);

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
        }
      } catch (e) {
        console.error('Auto-login failed:', e);
      } finally {
        setIsReady(true);
      }
    };

    checkLogin();
  }, []);

  if (!isReady) {
    return null; // Or return a custom loading component/splash screen
  }

  return (
    <Provider store={store}>
      <AuthSync />
      <SocketProvider>
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
          {/* <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          /> */}
        </Stack>
        {/* <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
        /> */}
        {/* </ThemeProvider> */}
      </SocketProvider>
    </Provider >
  );
}
