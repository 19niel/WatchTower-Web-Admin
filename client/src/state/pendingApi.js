// client/src/state/pendingApi.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pendingApi = createApi({
  reducerPath: 'pendingApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // Adjust base URL if needed
  endpoints: (builder) => ({
    getPendingReports: builder.query({
      query: () => '/reports/pending',
    }),
    activateReport: builder.mutation({
      query: (id) => ({
        url: `/reports/${id}/activate`,
        method: 'PATCH',
      }),
    }),
    deleteReport: builder.mutation({
      query: (id) => ({
        url: `/reports/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetPendingReportsQuery,
  useActivateReportMutation,
  useDeleteReportMutation,
} = pendingApi;
