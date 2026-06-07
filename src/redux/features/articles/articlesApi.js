import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const articlesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: () => ({
        url: "/admin/articles",
        method: "GET",
      }),
      providesTags: [tagTypes.articles],
    }),
    getArticleById: builder.query({
      query: (id) => ({
        url: `/admin/articles/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.articles],
    }),
    addArticle: builder.mutation({
      query: (formData) => ({
        url: "/admin/articles",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [tagTypes.articles],
    }),
    updateArticle: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/articles/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: [tagTypes.articles],
    }),
    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `/admin/articles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.articles],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleByIdQuery,
  useAddArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articlesApi;
