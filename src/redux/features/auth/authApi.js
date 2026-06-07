import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/admin/auth/signin",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/admin/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/admin/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/admin/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/admin/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
    refresh: builder.mutation({
      query: (data) => ({
        url: "/admin/auth/refresh",
        method: "POST",
        body: data,
      }),
    }),
    signout: builder.mutation({
      query: (data) => ({
        url: "/admin/auth/signout",
        method: "POST",
        body: data,
      }),
    }),
    me: builder.query({
      query: () => ({
        url: "/admin/auth/me",
        method: "GET",
      }),
    }),
    getMyProfile: builder.query({
      query: (data) => ({
        url: "/auth/me",
        method: "GET",
        body: data,
      }),
      providesTags: [tagTypes.users],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useRefreshMutation,
  useSignoutMutation,
  useMeQuery,
  useGetMyProfileQuery,
  useLogoutMutation,
} = authApi;
