import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  tagTypes: ['Reports'],
  endpoints: (builder) => ({
    createReport: builder.mutation({
      query: (reportData) => ({
        url: '/reports',
        method: 'POST',
        body: reportData,
      }),
      invalidatesTags: ['Reports'],
    }),
    getReports: builder.query({
      query: () => '/reports',
      providesTags: ['Reports'],
    }),
    updateReport: builder.mutation({
      query: ({ id, reportData }) => ({
        url: `/reports/${id}`,
        method: 'PUT',
        body: reportData,
      }),
      invalidatesTags: ['Reports'],
    }),
    deleteReport: builder.mutation({
      query: (id) => ({
        url: `/reports/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reports'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateReportMutation,
  useGetReportsQuery,
  useUpdateReportMutation,
  useDeleteReportMutation,
} = reportApi;

export default reportApi;
