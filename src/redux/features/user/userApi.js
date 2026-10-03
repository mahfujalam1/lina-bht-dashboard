import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 1, limit = 10, search = "", plan = "", status = "" } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (search) params.append("search", search);
        if (plan) params.append("plan", plan);
        if (status) params.append("status", status);
        return {
          url: `/admin/users?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.users],
    }),

    getUserDetails: builder.query({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.users, id }],
    }),

    updateUserStatus: builder.mutation({
      query: ({ id, is_active }) => ({
        url: `/admin/users/${id}/status`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: [tagTypes.users],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.users],
    }),

    updateMyProfile: builder.mutation({
      query: (formData) => ({
        url: "/admin/profile/me",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: [tagTypes.users],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useUpdateMyProfileMutation,
} = userApi;

// Backwards compatibility alias for typo in old components
export const useUdpateMyProfileMutation = useUpdateMyProfileMutation;
export const useGetAllUsersQuery = useGetUsersQuery;
export const useUsersGrowthQuery = () => ({ data: null, isLoading: false });
