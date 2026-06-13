import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const nutritionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ============ NUTRITION ============
    getAllNutrition: builder.query({
      query: ({ limit = 20, skip = 0 } = {}) => ({
        url: `/admin/nutrition?limit=${limit}&skip=${skip}`,
        method: "GET",
      }),
      providesTags: [tagTypes.nutrition],
    }),
    getSingleNutrition: builder.query({
      query: (id) => ({
        url: `/admin/nutrition/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.nutrition],
    }),
    addNutrition: builder.mutation({
      query: (data) => ({
        url: "/admin/nutrition",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.nutrition],
    }),
    updateNutrition: builder.mutation({
      query: ({ id, formdata }) => ({
        url: `/admin/nutrition/${id}`,
        method: "PUT",
        body: formdata,
      }),
      invalidatesTags: [tagTypes.nutrition],
    }),
    deleteNutrition: builder.mutation({
      query: (id) => ({
        url: `/admin/nutrition/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.nutrition],
    }),

    // ============ FOOD ============
    getAllFood: builder.query({
      query: ({ limit = 20, skip = 0 } = {}) => ({
        url: `/admin/food?limit=${limit}&skip=${skip}`,
        method: "GET",
      }),
      providesTags: [tagTypes.food],
    }),
    getSingleFood: builder.query({
      query: (id) => ({
        url: `/admin/food/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.food],
    }),
    addFood: builder.mutation({
      query: (data) => ({
        url: "/admin/food",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.food],
    }),
    updateFood: builder.mutation({
      query: ({ id, formdata }) => ({
        url: `/admin/food/${id}`,
        method: "PUT",
        body: formdata,
      }),
      invalidatesTags: [tagTypes.food],
    }),
    deleteFood: builder.mutation({
      query: (id) => ({
        url: `/admin/food/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.food],
    }),

    // ============ RECIPE ============
    getAllRecipe: builder.query({
      query: ({ limit = 20, skip = 0 } = {}) => ({
        url: `/admin/recipe?limit=${limit}&skip=${skip}`,
        method: "GET",
      }),
      providesTags: [tagTypes.recipe],
    }),
    getSingleRecipe: builder.query({
      query: (id) => ({
        url: `/admin/recipe/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.recipe],
    }),
    addRecipe: builder.mutation({
      query: (data) => ({
        url: "/admin/recipe",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.recipe],
    }),
    updateRecipe: builder.mutation({
      query: ({ id, formdata }) => ({
        url: `/admin/recipe/${id}`,
        method: "PUT",
        body: formdata,
      }),
      invalidatesTags: [tagTypes.recipe],
    }),
    deleteRecipe: builder.mutation({
      query: (id) => ({
        url: `/admin/recipe/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.recipe],
    }),
  }),
});

export const {
  // Nutrition
  useGetAllNutritionQuery,
  useGetSingleNutritionQuery,
  useAddNutritionMutation,
  useUpdateNutritionMutation,
  useDeleteNutritionMutation,
  // Food
  useGetAllFoodQuery,
  useGetSingleFoodQuery,
  useAddFoodMutation,
  useUpdateFoodMutation,
  useDeleteFoodMutation,
  // Recipe
  useGetAllRecipeQuery,
  useGetSingleRecipeQuery,
  useAddRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} = nutritionApi;
