import { apiSlice } from './apiSlice';

export const paymentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPaymentIntent: builder.mutation({
            query: (data) => ({
                url: '/payments/create-intent',
                method: 'POST',
                body: data,
            }),
        }),
        getPaymentStatus: builder.query({
            query: (sessionId) => `/payments/status/${sessionId}`,
        }),
        getPaymentByOrderId: builder.query({
            query: (orderId) => `/payments/order/${orderId}`,
        }),
        getAllPayments: builder.query({
            query: () => '/payments',
            providesTags: ['Payment'],
        }),
        // Vendor Endpoints
        createVendorAccount: builder.mutation({
            query: () => ({
                url: '/payments/vendor/stripe/account',
                method: 'POST',
            }),
            transformResponse: (response: any) => response?.data || response,
        }),
        createAccountLink: builder.mutation({
            query: () => ({
                url: '/payments/vendor/stripe/account-link',
                method: 'POST',
            }),
            transformResponse: (response: any) => response?.data || response,
        }),
        getVendorAccountStatus: builder.query({
            query: () => '/payments/vendor/stripe/status',
            transformResponse: (response: any) => response?.data || response,
        }),
    }),
    overrideExisting: true,
});

export const {
    useCreatePaymentIntentMutation,
    useGetPaymentStatusQuery,
    useGetPaymentByOrderIdQuery,
    useGetAllPaymentsQuery,
    useCreateVendorAccountMutation,
    useCreateAccountLinkMutation,
    useGetVendorAccountStatusQuery,
} = paymentApiSlice;
