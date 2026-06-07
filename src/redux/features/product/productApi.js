import { baseApi } from "../../baseApi/baseApi";
import { tagTypes } from "../../tagTypes";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (formdata) => {
        return {
          url: "/admin/product",
          method: "POST",
          body: formdata,
        };
      },
      invalidatesTags: [tagTypes.products],
    }),

    getAllProducts: builder.query({
      query: ({ search = "", condition = "", category = "", limit = 50, offset = 0 }) => {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append("search", search);
        if (condition && condition !== "All") queryParams.append("condition", condition);
        if (category && category !== "All") queryParams.append("category", category);
        queryParams.append("limit", limit);
        queryParams.append("offset", offset);

        return {
          url: `/admin/product?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.products],
    }),

    getProductById: builder.query({
      query: (id) => ({
        url: `/admin/product/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.products],
    }),

    updateProduct: builder.mutation({
      query: ({ id, formdata }) => {
        return {
          url: `/admin/product/${id}`,
          method: "PUT",
          body: formdata,
        };
      },
      invalidatesTags: [tagTypes.products],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.products],
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
} = productApi;
