import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { logOut, setCredentials } from '../slices/authSlice';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as any;
        const token = state.auth?.accessToken;
        console.log('Redux State Auth:', state.auth);
        console.log('Access Token:', token);
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
    timeout: 120000,
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const refreshToken = (api.getState() as any).auth.refreshToken;
                if (!refreshToken) {
                    api.dispatch(logOut());
                    return result;
                }

                const refreshResult = await baseQuery(
                    {
                        url: '/auth/refresh-token',
                        method: 'POST',
                        body: { refreshToken },
                    },
                    api,
                    extraOptions
                );

                if (refreshResult.data) {
                    const data = refreshResult.data as any;
                    const user = (api.getState() as any).auth.user;

                    api.dispatch(setCredentials({
                        user,
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken
                    }));

                    result = await baseQuery(args, api, extraOptions);
                } else {
                    api.dispatch(logOut());
                }
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }
    return result;
};

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Category', 'Product', 'Order', 'Cart', 'User', 'Review', 'Chat'], // Define tag types for invalidation here if needed
    endpoints: (builder) => ({}),
});

export const { } = apiSlice;
