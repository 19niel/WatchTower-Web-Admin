import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: [
    
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Performance",

    // WatchTOwer
    "User",
    "Admins",
    "Citizens",
    "Rescuers",
    "Reports",
    "Admins",
    "Dashboard",
    "OverallStats"


  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),

    getProducts: build.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "client/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
    getGeography: build.query({
      query: () => "client/geography",
      providesTags: ["Geography"],
    }),
    getOverallStats: build.query({
      query: () => "overallstats",
      providesTags: ["OverallStats"],
    }),
    getUserPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),


    // WatchTower File
    getCitizens: build.query({
      query: () => "client/citizens",
      providesTags: ["Citizens"],
    }),
    getRescuers: build.query({
      query: () => "client/rescuers",
      providesTags: ["Rescuers"],
    }),
    getReports: build.query({
      query: () => "reports",
      providesTags: ["Reports"],
    }),
    getAdmins: build.query({
      query: () => "management/admins",
      providesTags: ["Admins"],
    }),
    getDashboard: build.query({
      query: () => "general/dashboard",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetUserPerformanceQuery,

  // WatchTower File
  useGetAdminQuery,
  useGetCitizensQuery,
  useGetRescuersQuery,
  useGetReportsQuery,
  useGetAdminsQuery,
  useGetDashboardQuery,
  useGetOverallStatsQuery,

} = api;
