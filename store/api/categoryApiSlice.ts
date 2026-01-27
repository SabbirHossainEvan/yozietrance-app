import { apiSlice } from './apiSlice';

export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addCategory: builder.mutation({
            query: (formData) => ({
                url: '/categories',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),
        getCategories: builder.query({
            query: () => '/categories',
            providesTags: [{ type: 'Category', id: 'LIST' }],
        }),
        getCategoriesByVendor: builder.query({
            query: (vendorId) => `/categories/vendor/${vendorId}`,
            providesTags: [{ type: 'Category', id: 'LIST' }],
        }),

        updateCategory: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/categories/${id}`,
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),
    }),
});

export const {
    useAddCategoryMutation,
    useGetCategoriesQuery,
    useGetCategoriesByVendorQuery,

    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = categoryApiSlice;
