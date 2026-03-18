import React, { useState, useEffect } from "react";
import SignupScreen from "./components/Auth/SignupScreen";
import OTPverification from "./components/Auth/OTPverification";
import { Route, Routes } from "react-router-dom";
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
import SignOutPopup from "./components/setting/SignOutPopup";
import DeleteAccountPopup from "./components/setting/DeleteAccountPopup";

function App() {
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const handleSignOut = () => setIsSignOutOpen(true);
    const handleDelete = () => setIsDeleteOpen(true);

    window.addEventListener('toggleSignOut', handleSignOut);
    window.addEventListener('toggleDeleteAccount', handleDelete);

    return () => {
      window.removeEventListener('toggleSignOut', handleSignOut);
      window.removeEventListener('toggleDeleteAccount', handleDelete);
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<SignupScreen />} />
        <Route path="/otp" element={<OTPverification />} />
        <Route path="/login" element={<LoginScreen />} />
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

      {/* Global Modals - Rendered outside the Sidebar for full-screen width */}
      <SignOutPopup isOpen={isSignOutOpen} onClose={() => setIsSignOutOpen(false)} />
      <DeleteAccountPopup isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} />
    </>
  );
}

export default App; 