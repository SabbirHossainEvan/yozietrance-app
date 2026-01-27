import { apiSlice } from './apiSlice';

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProductsByVendor: builder.query<any, { vendorId: string; categoryId?: string }>({
            query: ({ vendorId, categoryId }) => ({
                url: `/products/vendor/${vendorId}${categoryId ? `?categoryId=${categoryId}` : ''}`,
                method: 'GET',
            }),
            providesTags: (result) => {
                const products = Array.isArray(result) ? result : (result?.data || result?.products || []);
                const tags: any[] = [{ type: 'Product' as const, id: 'LIST' }];
                if (Array.isArray(products)) {
                    products.forEach((p: any) => {
                        const id = p.id || p._id;
                        if (id) tags.push({ type: 'Product' as const, id });
                    });
                }
                return tags;
            },
        }),
        getProductById: builder.query<any, string>({
            query: (id) => `/products/${id}`,
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
