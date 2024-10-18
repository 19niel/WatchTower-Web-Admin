import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
const reportApi = createApi({
    reducerPath: 'reportApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL  }), // Update to your server's base URL
    endpoints: (builder) => ({
        // Endpoint to fetch all reports
        fetchReports: builder.query({
            query: () => '/reports', // Adjust the URL to match your backend route
        }),
        // Endpoint to create a new report
        createReport: builder.mutation({
            query: (reportData) => ({
                url: '/reports', // Adjust the URL to match your backend route
                method: 'POST',
                body: reportData,
            }),
        }),
        // Optional: Endpoint to update a report
        updateReport: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/reports/${id}`, // Adjust the URL to match your backend route
                method: 'PATCH',
                body: patch,
            }),
        }),
        // Optional: Endpoint to delete a report
        deleteReport: builder.mutation({
            query: (id) => ({
                url: `/reports/${id}`, // Adjust the URL to match your backend route
                method: 'DELETE',
            }),
        }),
    }),
});

// Export hooks for usage in functional components
export const {
    useFetchReportsQuery,
    useCreateReportMutation,
    useUpdateReportMutation,
    useDeleteReportMutation,
} = reportApi;

// Export the API service to be included in the store
export default reportApi;
