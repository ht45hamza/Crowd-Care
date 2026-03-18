import React, { useState } from "react";
import { Colors } from "@/colors";
import { Button } from "@/components/ui/button";
import { useGetUserProfileQuery, useGetImageQuery } from "@/Services/HandleAPI";
import { FileEdit } from "lucide-react";
import Sidebar from "../Home/Sidebar";
import Header from "../Home/Header";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: userprofile, isLoading } = useGetUserProfileQuery();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-medium">Loading Profile Data...</div>;
  }

  const data = userprofile?.data || {};

  const firstName = data.firstName || "";
  const lastName = data.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "User Name";
  const email = data.email || "user@example.com";
  const address = data.address || "Location not set";
  const phone = data.phone || "";
  const dob = data.dob || "";
  const aboutMe =
    data.aboutMe || "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";
  const gender = data.gender
    ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1).toLowerCase()
    : "Male";
  const profileImage = data.profileImage || "";
  const campaigns = data.totalCampaigns || 0;
  const donations = data.totalDonatedAmount || 0;
  const generate = data.totalGeneratedAmount || 0;
  const profileImageKey = profileImage;
  const { data: imageData } = useGetImageQuery(profileImageKey, {
    skip: !profileImageKey || profileImageKey.startsWith("http") || profileImageKey.startsWith("blob:"),
  });

  const displayImage =
    profileImageKey?.startsWith("http") || profileImageKey?.startsWith("blob:")
      ? profileImageKey
      : (typeof imageData === 'string' ? imageData : (imageData?.data || imageData?.url || imageData?.image || ""));

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 flex flex-col overflow-y-auto px-4 sm:px-10 py-6 sm:py-10 items-center">
          <div className="w-full max-w-[1000px] mt-2 sm:mt-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 gap-4 sm:gap-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-20 h-20 sm:w-27.5 sm:h-27.5 rounded-full bg-indigo-50 overflow-hidden flex items-center justify-center shrink-0">
                  {displayImage ? (
                    <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 font-semibold text-2xl sm:text-3xl">
                      {(firstName?.[0] || "") + (lastName?.[0] || "")}
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  <h2
                    className="text-[22px] sm:text-[30px] font-bold font-serif mb-0.5 sm:mb-1 text-black leading-tight"
                    style={{ color: Colors.primary }}
                  >
                    {fullName}
                  </h2>
                  <p className="text-gray-500 mb-0.5 sm:mb-1 font-medium text-[13px] sm:text-[15px] hover:text-gray-700 transition-colors truncate max-w-[180px] sm:max-w-none">
                    {email}
                  </p>
                  <p className="text-gray-500 font-medium text-[13px] sm:text-[15px]}">{address}</p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/edit-profile")}
                className="flex items-center gap-2 bg-[#F6F7F9] hover:bg-[#EBEDF0] text-[#111111] px-6 py-2.5 rounded-xl font-semibold transition-colors mt-2 sm:mt-0 shadow-sm border border-gray-100/50"
              >
                Edit <FileEdit size={16} className="ml-1" />
              </Button>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-3">First Name</label>
                  <div className="bg-[#F3F4F6] text-black h-14 rounded-2xl flex items-center px-5 font-medium text-[15px]">
                    {firstName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-3">Last Name</label>
                  <div className="bg-[#F3F4F6] text-black h-14 rounded-2xl flex items-center px-5 font-medium text-[15px]">
                    {lastName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-3">Date of Birth</label>
                  <div className="bg-[#F3F4F6] text-[#444] h-14 rounded-2xl flex items-center px-5 font-medium text-[15px]">
                    {dob || "17-06-1996"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-3">Phone</label>
                  <div className="bg-[#F3F4F6] text-[#444] h-14 rounded-2xl flex items-center px-5 font-medium text-[15px]">
                    {phone || "(406) 555-0120"}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#333] mb-3">About Me</label>
                  <div className="bg-[#F3F4F6] text-[#444] min-h-30 rounded-2xl p-6 font-medium text-[15px] leading-relaxed">
                    {aboutMe}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-3">Location</label>
                  <div className="bg-[#F3F4F6] text-[#444] h-14 rounded-2xl flex items-center px-5 font-medium text-[15px]">
                    {address || "New York"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#333] mb-3">Gender</label>
                  <div className="bg-[#F3F4F6] text-[#444] h-14 rounded-2xl flex items-center px-5 font-medium text-[15px]">
                    {gender}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-14 w-full">
              <h3
                className="text-[22px] sm:text-[24px] font-bold font-serif mb-6 text-black"
                style={{ color: Colors.primary }}
              >
                Contribution
              </h3>

              <div
                className="flex flex-col sm:flex-row w-full rounded-[14px] overflow-hidden shadow-sm"
                style={{ backgroundColor: Colors.secondary }}
              >
                <div className="flex-1 py-8 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-white/20 hover:bg-white/5 transition-colors">
                  <span className="text-white text-[20px] sm:text-[22px] font-medium mb-2 tracking-wide">
                    {campaigns}
                  </span>
                  <span className="text-white text-[16px] sm:text-[18px] font-medium tracking-wide">
                    Campaigns
                  </span>
                </div>

                <div className="flex-1 py-8 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-white/20 hover:bg-white/5 transition-colors">
                  <span className="text-white text-[20px] sm:text-[22px] font-medium mb-2 tracking-wide">
                    $ {donations.toLocaleString()}
                  </span>
                  <span className="text-white text-[16px] sm:text-[18px] font-medium tracking-wide">
                    Donation
                  </span>
                </div>

                <div className="flex-1 py-8 flex flex-col items-center justify-center hover:bg-white/5 transition-colors">
                  <span className="text-white text-[20px] sm:text-[22px] font-medium mb-2 tracking-wide">
                    $ {generate.toLocaleString()}
                  </span>
                  <span className="text-white text-[16px] sm:text-[18px] font-medium tracking-wide">
                    Generate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}