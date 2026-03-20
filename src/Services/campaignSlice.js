// src/Services/campaignSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Step 1
    title: '',
    category: '',
    location: '',
    city: '',
    categoryId: '',
    categoryName: '',
    categoryLogo: '',
    // Step 2
    amount: '',
    durationFrom: '',
    durationTo: '',
    description: '',
    images: [],          // blob URLs for preview
    rawImageFiles: [],   // actual File objects for upload
};

const campaignSlice = createSlice({
    name: 'campaign',
    initialState,
    reducers: {
        updateCampaignData: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetCampaignData: () => initialState,
    },
});

export const { updateCampaignData, resetCampaignData } = campaignSlice.actions;
export default campaignSlice.reducer;