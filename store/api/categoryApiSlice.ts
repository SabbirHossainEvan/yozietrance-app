import { apiSlice } from './apiSlice';

export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addCategory: builder.mutation({
            query: (formData) => ({
                url: '/categories',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Category'],
        }),
        getCategories: builder.query({
            query: () => '/categories',
            providesTags: ['Category'],
        }),
        getCategoriesByVendor: builder.query({
            query: (vendorId) => `/categories/vendor/${vendorId}`,
            providesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/categories/${id}`,
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
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
