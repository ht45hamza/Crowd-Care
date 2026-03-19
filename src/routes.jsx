import React from "react";
import { Route, Routes } from "react-router-dom";
import SignupScreen from "./components/Auth/SignupScreen";
import OTPverification from "./components/Auth/OTPverification";
import LoginScreen from "./components/Auth/LoginScreen";
import ForgotPassword from "./components/Auth/ForgotPassword";
import PasswordPopup from "./components/Auth/PasswordPopup";
import ResetPassword from "./components/Auth/ResetPassword";
import HomeScreen from "./components/Home/HomeScreen";
import Profile from "./components/setting/Profile";
import ChangePasswordPage from "./components/setting/ChangePasswordPage";
import Faqs from "./components/setting/Faqs";
import Privacy from "./components/setting/Privacy";
import TermsAndConditions from "./components/setting/TermsAndConditions";
import EditProfile from "./components/setting/EditProfile";
import StartCompaign from "./components/Compaign/StartCompaign";
import CompaignDetails from "./components/Compaign/CompaignDetails";
import CompaignReview from "./components/Compaign/CompaignReview";
import SearchCompaign from "./components/Compaign/SearchCompaign";
import CompaignDonation from "./components/Compaign/CompaignDonation";
import DonationReceipt from "./components/Compaign/DonationReceipt";
import DonationDetail from "./components/Compaign/DonationDetail";
import MyCampaigns from "./components/Compaign/MyCampaigns";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/otp" element={<OTPverification />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="/popup" element={<PasswordPopup />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/start-compaign" element={<StartCompaign />} />
      <Route path="/compaign-details" element={<CompaignDetails />} />
      <Route path="/compaign-review" element={<CompaignReview />} />
      <Route path="/search" element={<SearchCompaign />} />
      <Route path="/compaign-donation" element={<CompaignDonation />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route path="/faqs" element={<Faqs />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/receipt" element={<DonationReceipt />} />
      <Route path="/donation-history" element={<DonationDetail />} />
      <Route path="/my-campaigns" element={<MyCampaigns />} />
    </Routes>
  );
};

export default AppRoutes;
