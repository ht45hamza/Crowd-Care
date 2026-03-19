import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://dev.api.crowdcareaid.com/api",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ["User"],
    endpoints: (builder) => ({

        signup: builder.mutation({
            query: (body) => ({
                url: "/signup",
                method: "POST",
                body,
            }),
        }),

        verifyOtp: builder.mutation({
            query: (body) => ({
                url: "/verifyOtp",
                method: "POST",
                body,
            }),
        }),

        login: builder.mutation({
            query: (body) => ({
                url: "/login",
                method: "POST",
                body,
            }),
        }),

        forgotPassword: builder.mutation({
            query: (body) => ({
                url: "/forgotPassword",
                method: "POST",
                body,
            }),
        }),

        resendOtp: builder.mutation({
            query: (body) => ({
                url: "/resendOtp",
                method: "POST",
                body,
            }),
        }),

        resetPassword: builder.mutation({
            query: (body) => ({
                url: "/resetPassword",
                method: "POST",
                body,
            }),
        }),

        getUserProfile: builder.query({
            query: () => ({
                url: "/getUserProfile",
                method: "GET",
            }),
            providesTags: ["User"],
        }),

        updateUserProfile: builder.mutation({
            query: (body) => ({
                url: "/editProfile", 
                method: "PATCH", 
                body,
            }),
            invalidatesTags: ["User"],
        }),
        deleteAccount: builder.mutation({
            query: (id) => ({
                url: `/deleteAccount`,
                method: "DELETE",
                body: { id } 
            }),
        }),
        changePassword : builder.mutation ({
            query : (body) => ({
                url : "/changePassword",
                method : "PATCH",
                body
            }),
        }),
        uploadImage : builder.mutation ({
            query : (body) =>({
                url : "/uploadImage",
                method : "POST",
                body
            }),
        }),
        getImage: builder.query({
            query: (key) => ({
                url: "/getImage",
                method: "GET",
                params: { key },
            }),
        }),
        createCampaign : builder.mutation ({
            query : (body)=>({
                url : "/createCampaign",
                method : "POST",
                body
            }),
        }),
        getPopularCampaigns : builder.query ({
            query : ()=>({
                url : "/getPopularCampaigns",
                method : "GET"
            }),
        }),
        getRecentCampaigns : builder.query ({
            query : ()=>({
                url : "/getRecentCampaigns",
                method : "GET"
            }),
        }),
        createCategory : builder.mutation ({
            query : (body) => ({
                url : "/createCategory",
                method : "POST",
                body
            }),
        }),
        getCategory : builder.query ({
            query : ()=>({
                url : "/getCategories",
                method : "GET"
            }),
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/updateCategory/${id}`,
                method: "PATCH",
                body
            }),
        }),
        getAllCampaigns : builder.query ({
            query : ()=>({
                url : "getAllCampaigns",
                method : "GET"
            }),
        }),
        getAuthCampaigns : builder.query ({
            query : ()=> ({
                url : "/getAuthUserCampaign",
                method : "GET"
            }),
        }),
        createReport : builder.mutation ({
            query : (body)=>({
                url : "/createReport",
                method : "POST",
                body
            }),
        }),
        getReports : builder.query ({
            query : ()=>({
                url: "/getReports",
                method: "GET"
            }),
        }),
        donate : builder.mutation ({
            query : (body) => ({
                url : "/donate",
                method : "POST",
                body
            }),
        }),
        myDonationHistory : builder.query ({
            query : ()=>({
                url : "/myDonationHistory",
                method : "get",
            }),
        }),
        allDonationHistory : builder.query ({
            query : () => ({
                url : "allDonationHistory",
                method : "GET"
            }),
        }),
       updateDonation : builder.mutation ({
        query : (body) => ({
            url : "/updateDonationStatus",
            method : "PATCH",
            body
            }),
       }), 
        getCampaignDonators : builder.query ({
         query : (campaignId) => ({
             url : `/getCampaignDonators/${campaignId}`,
             method : "GET"
         }), 
        }),
        getNotification : builder.query ({
            query : (g)=> ({
                url : "/getUserNotifications",
                method : "GET"
            })
        })
    }),
});

export const {
    useSignupMutation,
    useVerifyOtpMutation,
    useLoginMutation,
    useForgotPasswordMutation,
    useResendOtpMutation,
    useResetPasswordMutation,
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useDeleteAccountMutation,
    useChangePasswordMutation,
    useUploadImageMutation,
    useGetImageQuery,
    useCreateCampaignMutation,
    useGetPopularCampaignsQuery,
    useGetRecentCampaignsQuery,
    useCreateCategoryMutation,
    useGetCategoryQuery,
    useUpdateCategoryMutation,
    useGetAllCampaignsQuery,
    useGetAuthCampaignsQuery,
    useCreateReportMutation,
    useGetReportsQuery,
    useDonateMutation,
    useMyDonationHistoryQuery,
    useAllDonationHistoryQuery,
    useUpdateDonationMutation,
    useGetCampaignDonatorsQuery,
    useGetNotificationQuery
} = api;