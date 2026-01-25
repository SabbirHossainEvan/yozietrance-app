
import { apiSlice } from './apiSlice';


export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (credentials) => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        login: builder.mutation({
            query: (credentials) => {
                console.log('Login mutation called with:', JSON.stringify(credentials));
                return {
                    url: '/auth/login',
                    method: 'POST',
                    body: credentials,
                };
            },
        }),
        ForgotPasswordScreen: builder.mutation({
            query: (data) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: data,
            }),
        }),
        OTPVerification: builder.mutation({
            query: (data) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body: data,
            }),
        }),
        SetNewPasswordScreen: builder.mutation({
            query: (data) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: data,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useSignupMutation, useLoginMutation, useForgotPasswordScreenMutation, useOTPVerificationMutation, useSetNewPasswordScreenMutation } = authApiSlice;
