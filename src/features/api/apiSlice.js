import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Employee', 'Attendance', 'User', 'Overtime', 'Dashboard'],
  endpoints: (builder) => ({
    // Auth APIs
    signup: builder.mutation({
      query: (credentials) => ({
        url: '/auth/signup',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      providesTags: ['User'],
    }),
    createByAdmin: builder.mutation({
      query: (userData) => ({
        url: '/auth/admin/create',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    checkVerified: builder.query({
      query: () => '/auth/checkverified',
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    // Employee APIs
    createEmployee: builder.mutation({
      query: (employeeData) => ({
        url: '/employee/create',
        method: 'POST',
        body: employeeData,
      }),
      invalidatesTags: ['Employee'],
    }),
    getAllEmployees: builder.query({
      query: () => '/employee/get',
      providesTags: ['Employee'],
    }),
    updateEmployee: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/employee/update/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Employee'],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employee/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employee'],
    }),
    getEmployeeById: builder.query({
      query: (id) => `/employee/show/${id}`,
      providesTags: (result, error, id) => [{ type: 'Employee', id }],
    }),

    // Attendance APIs
    punchIn: builder.mutation({
      query: (data) => ({
        url: '/attendance/punch-in',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    punchOut: builder.mutation({
      query: (data) => ({
        url: '/attendance/punch-out',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    getTodayAttendance: builder.query({
      query: () => '/attendance/today',
      providesTags: ['Attendance'],
    }),
    getMyAttendance: builder.query({
      query: () => '/attendance/my',
      providesTags: ['Attendance'],
    }),
    getUserAttendance: builder.query({
      query: (userId) => `/attendance/user/${userId}`,
      providesTags: ['Attendance'],
    }),
    getAttendanceById: builder.query({
      query: (id) => `/attendance/${id}`,
      providesTags: (result, error, id) => [{ type: 'Attendance', id }],
    }),

    // Overtime APIs
    requestOvertime: builder.mutation({
      query: (overtimeData) => ({
        url: '/overtime/request',
        method: 'POST',
        body: overtimeData,
      }),
      invalidatesTags: ['Overtime'],
    }),
    getMyOvertimeRequests: builder.query({
      query: () => '/overtime/my-requests',
      providesTags: ['Overtime'],
    }),
    approveOvertime: builder.mutation({
      query: (id) => ({
        url: `/overtime/approve/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Overtime', 'Attendance'],
    }),
    rejectOvertime: builder.mutation({
      query: (id) => ({
        url: `/overtime/reject/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Overtime'],
    }),

    // Dashboard APIs
    getEmployeeDashboard: builder.query({
      query: () => '/dashboard/employee',
      providesTags: ['Dashboard'],
    }),
    getManagerDashboard: builder.query({
      query: () => '/dashboard/manager',
      providesTags: ['Dashboard'],
    }),
    getAdminDashboard: builder.query({
      query: () => '/dashboard/admin',
      providesTags: ['Dashboard'],
    }),
    getDailyAttendanceReport: builder.query({
      query: () => '/dashboard/reports/daily',
      providesTags: ['Dashboard'],
    }),
    getDateRangeAttendanceReport: builder.query({
      query: ({ startDate, endDate }) => ({
        url: '/dashboard/reports/range',
        params: { startDate, endDate },
      }),
      providesTags: ['Dashboard'],
    }),
    getOvertimeReport: builder.query({
      query: () => '/dashboard/reports/overtime',
      providesTags: ['Dashboard'],
    }),

    // User APIs
    getAllUsers: builder.query({
      query: ({ page, limit, search, role }) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (search) params.append('search', search);
        if (role) params.append('role', role);
        return `/users/all?${params.toString()}`;
      },
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getTeamMembers: builder.query({
      query: () => '/users/team/members',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useCreateByAdminMutation,
  useCheckVerifiedQuery,
  useLogoutMutation,
  useCreateEmployeeMutation,
  useGetAllEmployeesQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetEmployeeByIdQuery,
  usePunchInMutation,
  usePunchOutMutation,
  useGetTodayAttendanceQuery,
  useGetMyAttendanceQuery,
  useGetUserAttendanceQuery,
  useGetAttendanceByIdQuery,
  useRequestOvertimeMutation,
  useGetMyOvertimeRequestsQuery,
  useApproveOvertimeMutation,
  useRejectOvertimeMutation,
  useGetEmployeeDashboardQuery,
  useGetManagerDashboardQuery,
  useGetAdminDashboardQuery,
  useGetDailyAttendanceReportQuery,
  useGetDateRangeAttendanceReportQuery,
  useGetOvertimeReportQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetTeamMembersQuery,
} = apiSlice;