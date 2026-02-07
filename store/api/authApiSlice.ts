
import { apiSlice } from './apiSlice';


export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        registerBuyer: builder.mutation({
            query: (data) => ({
                url: '/auth/register/buyer',
                method: 'POST',
                body: data,
            }),
        }),
        registerVendor: builder.mutation({
            query: (data) => ({
                url: '/auth/register/vendor',
                method: 'POST',
                body: data,
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
        getProfile: builder.query({
            query: () => '/auth/me',
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/auth/me',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        changePassword: builder.mutation({
            query: (data) => ({
                url: '/auth/change-password',
                method: 'POST',
                body: data,
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    useRegisterBuyerMutation,
    useRegisterVendorMutation,
    useLoginMutation,
    useForgotPasswordScreenMutation,
    useOTPVerificationMutation,
    useSetNewPasswordScreenMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation
} = authApiSlice;
