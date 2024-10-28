import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const reportApi = createApi({
    reducerPath: 'reportApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }), // Ensure base URL is set in .env
    endpoints: (builder) => ({
        fetchReports: builder.query({
            query: () => '/reports',
            providesTags: ['Report'],
        }),
        createReport: builder.mutation({
            query: (formData) => ({
                url: '/reports',
                method: 'POST',
                body: formData, // Send FormData directly
            }),
            invalidatesTags: ['Report'],
        }),
        updateReport: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/reports/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['Report'],
        }),
        deleteReport: builder.mutation({
            query: (id) => ({
                url: `/reports/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Report'],
        }),
    }),
});

export const {
    useFetchReportsQuery,
    useCreateReportMutation,
    useUpdateReportMutation,
    useDeleteReportMutation,
} = reportApi;

export default reportApi;
