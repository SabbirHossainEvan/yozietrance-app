import { apiSlice } from './apiSlice';

export const connectionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        connectToVendor: builder.mutation<any, { vendorCode: string }>({
            query: (data) => ({
                url: '/connections/connect',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Connection', 'Chat', 'Product', 'Category'],
        }),
        getMyConnections: builder.query<any, string | undefined>({
            query: (_userId) => ({
                url: '/connections',
                method: 'GET',
            }),
            providesTags: ['Connection'],
        }),
        disconnectFromVendor: builder.mutation<any, string>({
            query: (vendorId) => ({
                url: `/connections/disconnect/${vendorId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Connection', 'Chat', 'Product', 'Category'],
        }),
    }),
    overrideExisting: true,
});

export const {
    useConnectToVendorMutation,
    useGetMyConnectionsQuery,
    useDisconnectFromVendorMutation,
} = connectionApiSlice;
