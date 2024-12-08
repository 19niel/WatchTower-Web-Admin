import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "reportTodayApi",
  tagTypes: ["Reports"],
  endpoints: (builder) => ({
    getReportsToday: builder.query({
      query: () => "api/reports/today",
      transformResponse: (response) => response, // Return the whole response
      providesTags: ["Reports"],
    }),
  }),
});

export const { useGetReportsTodayQuery } = api;
export default api;
