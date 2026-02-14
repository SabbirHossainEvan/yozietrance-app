import { apiSlice } from './apiSlice';

export interface Coupon {
    id: string;
    name: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    validFrom: string;
    validUntil: string;
    minPurchaseAmount?: number;
    usageLimit?: number;
    usedCount?: number;
    isActive: boolean;
    vendorId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateCouponRequest {
    name: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    validFrom: string;
    validUntil: string;
    minPurchaseAmount?: number;
    usageLimit?: number;
}

export interface AssignCouponRequest {
    buyerId: string;
}

export const couponApiSlice = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Get all coupons for a vendor
        getCouponsByVendor: builder.query({
            query: (vendorId) => {
                console.log('Coupon API - Query string:', `/coupons?vendorId=${vendorId}`);
                return `/coupons?vendorId=${vendorId}`;
            },
            async onQueryStarted(arg, { queryFulfilled }) {
                console.log('Coupon API - Query started for vendorId:', arg);
                try {
                    const { data } = await queryFulfilled;
                    console.log('Coupon API - Query fulfilled with data length:', Array.isArray(data) ? data.length : 'not an array');
                } catch (err) {
                    console.error('Coupon API - Query failed:', err);
                }
            },
            transformResponse: (response: any) => {
                try {
                    console.log('Coupon API - transformResponse called');
                    if (!response) return [];
                    if (Array.isArray(response)) return response;
                    if (response.data && Array.isArray(response.data)) return response.data;
                    if (response.coupons && Array.isArray(response.coupons)) return response.coupons;
                    return [];
                } catch (error) {
                    console.error('Coupon API - transformResponse error:', error);
                    return [];
                }
            },
            providesTags: (result) => {
                console.log('Coupon API - providesTags called with result count:', Array.isArray(result) ? result.length : 'not an array');
                const tags: any[] = [{ type: 'Coupon', id: 'LIST' }];
                if (Array.isArray(result)) {
                    result.forEach((item: any) => {
                        if (item && item.id) tags.push({ type: 'Coupon' as const, id: item.id });
                    });
                }
                return tags;
            },
        }),

        // Get coupon by ID
        getCouponById: builder.query<Coupon, string>({
            query: (id) => `/coupons/${id}`,
            providesTags: (result, error, id) => [{ type: 'Coupon', id }],
        }),

        // Create a new coupon
        createCoupon: builder.mutation<Coupon, CreateCouponRequest>({
            query: (couponData) => ({
                url: '/coupons',
                method: 'POST',
                body: couponData,
            }),
            invalidatesTags: [{ type: 'Coupon', id: 'LIST' }],
        }),

        // Assign coupon to buyer
        assignCoupon: builder.mutation<any, { id: string; buyerId: string }>({
            query: ({ id, buyerId }) => ({
                url: `/coupons/${id}/assign`,
                method: 'POST',
                body: { buyerId },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Coupon', id }],
        }),

        // Deactivate coupon
        deactivateCoupon: builder.mutation<Coupon, string>({
            query: (id) => ({
                url: `/coupons/${id}/deactivate`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Coupon', id },
                { type: 'Coupon', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetCouponsByVendorQuery,
    useGetCouponByIdQuery,
    useCreateCouponMutation,
    useAssignCouponMutation,
    useDeactivateCouponMutation,
} = couponApiSlice;
