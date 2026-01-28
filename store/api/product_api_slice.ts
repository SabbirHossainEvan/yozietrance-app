import { apiSlice } from './apiSlice';

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProductsByVendor: builder.query<any, { vendorId: string; categoryId?: string }>({
            query: ({ vendorId, categoryId }) => ({
                url: `/products/vendor/${vendorId}${categoryId ? `?categoryId=${categoryId}` : ''}`,
                method: 'GET',
            }),
            transformResponse: (response: any) => {
                if (Array.isArray(response)) return response;
                if (Array.isArray(response?.data)) return response.data;
                if (Array.isArray(response?.products)) return response.products;
                if (response?.data && Array.isArray(response.data.products)) return response.data.products;
                return [];
            },
            providesTags: (result) => {
                const tags: any[] = [{ type: 'Product' as const, id: 'LIST' }];
                if (Array.isArray(result)) {
                    result.forEach((p: any) => {
                        const id = p.id || p._id;
                        if (id) tags.push({ type: 'Product' as const, id });
                    });
                }
                return tags;
            },
        }),
        getProductById: builder.query<any, string>({
            query: (id) => `/products/${id}`,
            transformResponse: (response: any) => response?.data || response,
            providesTags: (result, error, id) => [{ type: 'Product', id }],
        }),
        createProduct: builder.mutation({
            query: (formData) => ({
                url: '/products',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
        updateProduct: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/products/${id}`,
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, { type: 'Product', id: 'LIST' }],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetProductsByVendorQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApiSlice;
