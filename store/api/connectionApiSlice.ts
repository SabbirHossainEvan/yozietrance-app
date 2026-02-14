import { apiSlice } from './apiSlice';

export const connectionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        connectToVendor: builder.mutation<any, { vendorCode: string }>({
            query: (data) => ({
                url: '/connections/connect',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product', 'Category'], // Potentially invalidates these as connection changes available data
        }),
        getMyConnections: builder.query<any, void>({
            query: () => ({
                url: '/connections',
                method: 'GET',
            }),
        }),
        disconnectFromVendor: builder.mutation<any, string>({
            query: (vendorId) => ({
                url: `/connections/disconnect/${vendorId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product', 'Category'],
        }),
    }),
    overrideExisting: true,
});

export const {
    useConnectToVendorMutation,
    useGetMyConnectionsQuery,
    useDisconnectFromVendorMutation,
} = connectionApiSlice;
