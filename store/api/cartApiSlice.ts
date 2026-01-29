import { apiSlice } from './apiSlice';

export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query<any, void>({
            query: () => '/cart',
            transformResponse: (response: any) => {
                console.log('Cart API Response:', JSON.stringify(response, null, 2));
                return response;
            },
            providesTags: (result) => {
                const tags: any[] = [{ type: 'Cart' as const, id: 'LIST' }];
                // Assuming result has an array of items, each with an id or _id
                const items = result?.data?.items || result?.items || (Array.isArray(result) ? result : []);
                if (Array.isArray(items)) {
                    items.forEach((item: any) => {
                        const id = item.id || item._id;
                        if (id) tags.push({ type: 'Cart' as const, id });
                    });
                }
                return tags;
            },
        }),
        addToCart: builder.mutation<any, { productId: string; quantity: number }>({
            query: (data) => ({
                url: '/cart/add',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),
        updateCartItem: builder.mutation<any, { itemId: string; quantity: number }>({
            query: ({ itemId, quantity }) => ({
                url: `/cart/items/${itemId}`,
                method: 'PATCH',
                body: { quantity },
            }),
            invalidatesTags: (result, error, { itemId }) => [
                { type: 'Cart', id: itemId },
                { type: 'Cart', id: 'LIST' }
            ],
        }),
        removeFromCart: builder.mutation<any, string>({
            query: (itemId) => ({
                url: `/cart/items/${itemId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveFromCartMutation,
} = cartApiSlice;
