import { configureStore } from "@reduxjs/toolkit";
import { api } from "./HandleAPI";
import campaignReducer from "./campaignSlice"


export const store =configureStore({
    reducer: {
    [api.reducerPath]: api.reducer,
    campaign: campaignReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})