import React, { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, User, Trash2, Menu } from "lucide-react";
import { Colors } from "@/colors";
import { useDeleteAccountMutation, useGetUserProfileQuery, useGetImageQuery, useGetNotificationQuery } from "@/Services/HandleAPI";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationPopup from "./NotificationPopup";

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: userprofile, isLoading } = useGetUserProfileQuery();
  const [deleteAccount, { isLoading: deleting }] = useDeleteAccountMutation();
  const { data: Notification } = useGetNotificationQuery();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);

  const nmsg = Notification?.message;
  const ndata = Notification?.data;

  // Debug — remove once notifications are confirmed working
  console.log("bell [Header Notification Debug] ndata:", ndata, "| nmsg:", nmsg);
  const firstName = userprofile?.data?.firstName;
  const lastName = userprofile?.data?.lastName;
  const userId = userprofile?.data?._id;
  const profileImageKey = userprofile?.data?.profileImage;
  const { data: imageData } = useGetImageQuery(profileImageKey, {
    skip:
      !profileImageKey ||
      profileImageKey.startsWith("http") ||
      profileImageKey.startsWith("blob:") ||
      profileImageKey.startsWith("data:") ||
      profileImageKey === "null",
  });

  const displayImage =
    profileImageKey?.startsWith("http") || profileImageKey?.startsWith("blob:")
      ? profileImageKey
      : (typeof imageData === 'string' ? imageData : (imageData?.data || imageData?.url || imageData?.image || ""));


  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim() || "User";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/start-compaign" || path === "/compaign-details" || path === "/compaign-review")
      return "Create Campaign";
    if (path === "/search") return "Search Campaign";
    if (path === "/compaign-donation") return "Search Campaign";
    if (path === "/faqs") return "FAQ,s";
    if (path === "/profile") return "My Profile";
    if (path === "/edit-profile") return "Edit Profile";
    if (path === "/privacy") return "Privacy Policy";
    if (path === "/terms-and-conditions") return "Terms & Condition";
    if (path === "/change-password") return "Change Password";
    if (path === "/donation-history") return "Donation History";
    if (path === "/my-campaigns") return "My Campaigns";
    return "Crowd Care";
  };

  return (
    <header className="w-full h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 z-10">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu size={24} className="text-gray-600" />
        </button>

        <h1
          className="text-[17px] sm:text-[18px] font-bold tracking-wide truncate max-w-[150px] sm:max-w-none"
          style={{ color: "#111111" }}
        >
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
              {displayImage ? (
                <img src={displayImage} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-semibold text-gray-600">
                  {(firstName?.[0] || "") + (lastName?.[0] || "")}
                </span>
              )}
            </div>

            <span className="hidden sm:inline text-sm font-semibold text-gray-700 truncate max-w-[100px]">
              {isLoading ? "Loading..." : fullName}
            </span>

            <ChevronDown
              size={18}
              className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 overflow-hidden">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate("/profile");
                }}
                className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User size={16} className="mr-3 text-gray-500" />
                Edit your profile
              </button>

              <div className="h-px bg-gray-100 my-1 w-full"></div>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  window.dispatchEvent(new CustomEvent('toggleDeleteAccount', { detail: true }));
                }}
                className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} className="mr-3 text-red-500" />
                Delete account
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsNotificationOpen(true)}
          className="relative flex items-center justify-center w-10 sm:w-11.5 h-10 sm:h-11.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors bg-white focus:outline-none"
        >
          <Bell size={20} strokeWidth={1.5} />
          {ndata?.length > 0 && ndata?.some(n => !n.isRead) && (
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>

        <NotificationPopup
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      </div>
    </header>
  );
}