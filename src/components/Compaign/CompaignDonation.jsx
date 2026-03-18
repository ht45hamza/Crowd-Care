import React, { useState } from 'react';
import { Colors } from '@/colors';
import Sidebar from '../Home/Sidebar';
import Header from '../Home/Header';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import startingImg from '@/assets/startingimage.jpeg';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentPopup from './PaymentPopup';
import ReportPopup from './ReportPopup';
import { useDonateMutation, useGetCampaignDonatorsQuery } from '@/Services/HandleAPI';
import CampaignImage from './CampaignImage';
import UserImage from './UserImage';

export default function CompaignDonation() {
    const navigate = useNavigate();
    const location = useLocation();
    const campaign = location.state?.campaign || {};
    
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [donate, { isLoading: isDonating }] = useDonateMutation();
    const { data: donatorsResponse } = useGetCampaignDonatorsQuery(campaign?._id, { skip: !campaign?._id });
    
    const donatorsList = donatorsResponse?.data || [];
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const campaignImages = Array.isArray(campaign.images) && campaign.images.length > 0
        ? campaign.images 
        : [campaign.image].filter(Boolean);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % campaignImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + campaignImages.length) % campaignImages.length);
    };

    return (
        <div className="flex h-screen bg-[#f5f5f5] font-sans overflow-hidden">
            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#fbfbfb]">
                <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

                <main className="flex-1 flex flex-col overflow-y-auto px-4 sm:px-8 lg:px-24 py-8 sm:py-12 pb-20">
                    <div className="w-full max-w-225 mx-auto flex flex-col gap-6 sm:gap-8">
                        
                        {/* Image Banner Section - Slider */}
                        <div className="relative w-full h-75 sm:h-100 rounded-[24px] overflow-hidden shadow-sm bg-gray-100 group">
                            <CampaignImage 
                                key={currentImageIndex}
                                imageKey={campaignImages[currentImageIndex]}
                                alt={`Campaign Banner ${currentImageIndex + 1}`}
                                fallbackImage={startingImg}
                                className="w-full h-full transition-opacity duration-300"
                            />
                            
                            {/* Navigation Arrows */}
                            {campaignImages.length > 1 && (
                                <>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all z-30 lg:opacity-0 lg:group-hover:opacity-100"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft size={28} />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all z-30 lg:opacity-0 lg:group-hover:opacity-100"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight size={28} />
                                    </button>
                                    
                                    {/* Dots Indicator */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                                        {campaignImages.map((_, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                                className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                                                aria-label={`Go to image ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Report Icon */}
                            <div 
                                onClick={() => setIsReportOpen(true)}
                                className="absolute top-6 right-6 w-11 h-11 bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center cursor-pointer hover:bg-black/50 transition group/report z-10"
                            >
                                <AlertTriangle className="text-white group-hover/report:scale-110 transition-transform" size={20} strokeWidth={1.5} />
                            </div>
                        </div>

                        {/* Title and Description */}
                        <div className="flex flex-col gap-3 sm:gap-4 mt-2">
                            <h2 className="text-[22px] sm:text-[28px] font-bold text-black tracking-tight leading-tight">
                                {campaign.title || "No Title"}
                            </h2>
                            <p className="text-[#858585] text-[13px] sm:text-[15px] font-medium leading-[1.6] sm:leading-[1.8] whitespace-pre-wrap">
                                {campaign.description || "No description provided."}
                            </p>
                        </div>

                        {/* Fundraising Information Details */}
                        <div className="flex flex-col w-full mt-4">
                            
                            <div className="flex justify-between items-center w-full mb-3">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[#9ca3af] text-[13px] md:text-[14px] font-medium uppercase tracking-wide">Total Fundraise</span>
                                    <span className="text-black text-[18px] md:text-[20px] font-black">$ {campaign.raisedAmount?.toLocaleString() || "0"}</span>
                                </div>
                                <div className="flex flex-col gap-1.5 text-right">
                                    <span className="text-[#9ca3af] text-[13px] md:text-[14px] font-medium uppercase tracking-wide">Target Amount</span>
                                    <span className="text-black text-[18px] md:text-[20px] font-black">$ {campaign.amount?.toLocaleString() || "0"}</span>
                                </div>
                            </div>

                            {/* Progress Bar Container */}
                            <div className="w-full flex-col mb-4">
                                <div className="flex justify-end w-full">
                                    <span className="text-[13px] font-bold text-black mb-1">
                                        %{campaign.amount > 0 ? Math.round(((campaign.raisedAmount || 0) / campaign.amount) * 100) : 0}
                                    </span>
                                </div>
                                <div className="w-full h-1 bg-gray-200">
                                    <div
                                        className="h-full transition-all duration-700"
                                        style={{ 
                                            width: `${campaign.amount > 0 ? Math.min(Math.round(((campaign.raisedAmount || 0) / campaign.amount) * 100), 100) : 0}%`, 
                                            backgroundColor: Colors.primary 
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex justify-between w-full mt-4 pb-6 sm:pb-10">
                                <div className="flex flex-col gap-1 sm:gap-1.5">
                                    <span className="text-[#9ca3af] text-[12px] sm:text-[14px] font-medium uppercase tracking-wide">Location</span>
                                    <span className="text-black text-[15px] sm:text-[18px] font-bold">{campaign.location || "-"}</span>
                                </div>
                                <div className="flex flex-col gap-1 sm:gap-1.5 text-right">
                                    <span className="text-[#9ca3af] text-[12px] sm:text-[14px] font-medium uppercase tracking-wide">Duration Date</span>
                                    <span className="text-black text-[15px] sm:text-[18px] font-bold">
                                        {campaign.duration ? `${campaign.duration[0]} to ${campaign.duration[1]}` : "-"}
                                    </span>
                                </div>
                            </div>

                            {/* Doner List Section */}
                            {/* Doner List Section */}
                            <div className="flex flex-col gap-6 mt-4">
                                <h3 className="text-[20px] font-bold text-[#1a391e]">Doner List</h3>
                                
                                <div className="space-y-6">
                                    {donatorsList.length > 0 ? (
                                        donatorsList.map((donor, index) => (
                                            <div key={index} className="flex flex-col gap-4 pb-6 border-b border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                                        <UserImage 
                                                            imageKey={donor.user?.profileImage} 
                                                            firstName={donor.user?.firstName} 
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-black font-bold text-[15px]">
                                                            {donor.user ? `${donor.user.firstName} ${donor.user.lastName}` : "Anonymous"}
                                                        </span>
                                                        <span className="text-[#9ca3af] text-[13px]">{donor.user?.email || "No email provided"}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between text-[14px]">
                                                    <span className="text-gray-400 font-medium">Donation Date</span>
                                                    <span className="text-black font-bold">
                                                        {donor.createdAt ? new Date(donor.createdAt).toLocaleDateString() : "-"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-[14px]">
                                                    <span className="text-gray-400 font-medium">Donation Amount</span>
                                                    <span className="text-black font-bold">$ {donor.amount || 0}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-500 font-medium pb-4">No donations yet. Be the first to donate!</div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Buttons Section */}
                            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-8 sm:mt-12 mb-8">
                                <Button
                                    onClick={() => navigate(-1)}
                                    className="w-full sm:flex-1 h-12 sm:h-14 rounded-2xl bg-white text-[16px] font-bold hover:bg-gray-50 transition-colors border-2 shadow-none order-2 sm:order-1"
                                    style={{ borderColor: Colors.primary, color: Colors.primary }}
                                >
                                    Back
                                </Button>
                                <Button
                                    className="w-full sm:flex-1 h-12 sm:h-14 rounded-2xl text-white text-[16px] font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[#1a391e]/20 order-1 sm:order-2"
                                    style={{ backgroundColor: Colors.primary }}
                                    onClick={() => setIsPaymentOpen(true)}
                                >
                                    Donate
                                </Button>
                            </div>

                        </div>
                    </div>
                </main>
            </div>

            <PaymentPopup
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                onSubmit={async (amount) => {
                    try {
                        const payload = {
                            campaignId: campaign?._id || campaign?.id || "",
                            amount: Number(amount)
                        };
                        const response = await donate(payload).unwrap();
                        setIsPaymentOpen(false);
                        navigate("/receipt", { 
                            state: { 
                                amount, 
                                campaignName: campaign.title,
                                transactionId: response?._id || response?.data?._id || Math.floor(Math.random() * 1000000) 
                            } 
                        });
                    } catch (error) {
                        console.error("Donation failed:", error);
                        alert("Donation failed. Please try again.");
                    }
                }}
            />

            <ReportPopup 
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                campaignId={campaign?._id || campaign?.id || ""}
            />
        </div>
    );
}
