import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../tagTypes";

export const baseApi = createApi({
  reducerPath: "CarmeloApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://skinsense.duckdns.org",
    baseUrl: "http://10.10.20.46:8001",
    prepareHeaders: (headers) => {
      // Retrieve the token from your store or local storage
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: tagTypesList,
  endpoints: () => ({}),
});
