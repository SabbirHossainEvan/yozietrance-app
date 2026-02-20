import { apiSlice } from './apiSlice';

const toNumber = (value: any, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeSpecification = (product: any) => {
    // Backend may send specification object or array-like specifications entries.
    if (product?.specification && typeof product.specification === 'object') {
        return product.specification;
    }

    if (Array.isArray(product?.specifications)) {
        return product.specifications.reduce((acc: any, item: any) => {
            const key = item?.key || item?.label || item?.name;
            const value = item?.value;
            if (key) acc[String(key)] = value ?? '';
            return acc;
        }, {});
    }

    return {};
};

const normalizeProduct = (product: any) => {
    if (!product || typeof product !== 'object') return product;
    return {
        ...product,
        id: product.id || product._id,
        images: Array.isArray(product.images) ? product.images : (product.imageUrl ? [product.imageUrl] : []),
        price: toNumber(product.price),
        stockQuantity: toNumber(product.stockQuantity),
        averageRating: toNumber(product.averageRating),
        totalReviews: toNumber(product.totalReviews),
        specification: normalizeSpecification(product),
    };
};

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProductsByVendor: builder.query<any, { vendorId: string; categoryId?: string }>({
            query: ({ vendorId, categoryId }) => ({
                url: `/products/vendor/${vendorId}${categoryId ? `?categoryId=${categoryId}` : ''}`,
                method: 'GET',
            }),
            transformResponse: (response: any) => {
                const raw =
                    (Array.isArray(response) && response) ||
                    (Array.isArray(response?.data) && response.data) ||
                    (Array.isArray(response?.data?.data) && response.data.data) ||
                    (Array.isArray(response?.products) && response.products) ||
                    (response?.data && Array.isArray(response.data.products) && response.data.products) ||
                    [];
                return raw.map(normalizeProduct);
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
            transformResponse: (response: any) => normalizeProduct(response?.data || response),
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
