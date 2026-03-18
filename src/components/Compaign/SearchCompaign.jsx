import React, { useState } from 'react';
import Sidebar from '../Home/Sidebar';
import Header from '../Home/Header';
import { Colors } from '@/colors';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import searchImg from '@/assets/search.png';
import startingImg from '@/assets/startingimage.jpeg';
import { useNavigate } from 'react-router-dom';
import CampaignImage from './CampaignImage';
import { useGetAllCampaignsQuery } from '@/Services/HandleAPI';

export default function SearchCompaign() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: campaignsResponse, isLoading, isError } = useGetAllCampaignsQuery();
    const allCampaigns = campaignsResponse?.data || [];

    // Filter campaigns by title (case-insensitive) - show all if no search term
    const filteredData = searchTerm.trim()
        ? allCampaigns.filter((campaign) =>
            campaign.title?.toLowerCase().includes(searchTerm.trim().toLowerCase())
        )
        : allCampaigns;

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
                    
                    {/* Search Bar Container */}
                    <div className="w-full mx-auto max-w-[1100px]">
                        <div className="relative w-full shadow-[0_2px_15px_rgba(0,0,0,0.03)] bg-white rounded-[24px] overflow-hidden flex items-center px-4 h-14 sm:h-16.25">
                            <SearchIcon className="text-gray-400 ml-2" size={20} strokeWidth={1.5} />
                            <Input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-none shadow-none focus-visible:ring-0 text-[14px] sm:text-[15px] text-black font-medium placeholder:text-gray-400 h-full w-full bg-transparent"
                            />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="mt-8 sm:mt-12 flex flex-col w-full max-w-[1100px] mx-auto pb-10">
                        {isLoading ? (
                            <div className="flex items-center justify-center mt-16">
                                <p className="text-[#a1a1aa] font-medium text-[15px]">Loading campaigns...</p>
                            </div>
                        ) : isError ? (
                            <div className="flex items-center justify-center mt-16">
                                <p className="text-red-400 font-medium text-[15px]">Failed to load campaigns. Please try again.</p>
                            </div>
                        ) : filteredData.length === 0 ? (
                            // Empty State
                            <div className="flex flex-col items-center justify-center mt-6">
                                <img
                                    src={searchImg}
                                    alt="Search empty State"
                                    className="w-70 h-70 object-contain mb-4"
                                />
                                <p className="text-[#a1a1aa] font-medium text-[15px] mb-1">
                                    {searchTerm.trim() ? "No campaigns found" : "No data available to show"}
                                </p>
                                <p className="text-[#a1a1aa] font-medium text-[15px]">
                                    {searchTerm.trim() ? "Try a different search term" : "Please search"}
                                </p>
                            </div>
                        ) : (
                            // Result Cards List
                            <div className="flex flex-col gap-4 sm:gap-6">
                                {filteredData.map((item) => {
                                    const progress = item.amount > 0
                                        ? Math.min(Math.round(((item.raisedAmount || 0) / item.amount) * 100), 100)
                                        : 0;

                                    const durationText = item.duration && item.duration.length === 2
                                        ? `${item.duration[0]} - ${item.duration[1]}`
                                        : "-";

                                    return (
                                        <div 
                                            key={item._id || item.id} 
                                            onClick={() => navigate('/compaign-donation', { state: { campaign: item } })}
                                            className="w-full bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 border border-gray-100/50 hover:shadow-md transition-shadow cursor-pointer"
                                        >
                                            {/* Image Section */}
                                            <div className="w-full sm:w-[320px] h-40 sm:h-45 shrink-0 overflow-hidden rounded-[14px]">
                                                <CampaignImage
                                                    imageKey={(item.images && item.images.length > 0) ? item.images[0] : item.image}
                                                    alt={item.title}
                                                    fallbackImage={startingImg}
                                                    className="w-full h-full"
                                                />
                                            </div>

                                            {/* Info Section */}
                                            <div className="flex flex-1 flex-col justify-center py-2 sm:pr-2">
                                                <h3 className="text-black font-semibold text-[16px] sm:text-[20px] mb-4 sm:mb-8 leading-tight">
                                                    {item.title}
                                                </h3>

                                                {/* Progress Bar Container */}
                                                <div className="w-full flex-col mb-4">
                                                    <div className="flex justify-end w-full">
                                                        <span className="text-[12px] font-semibold text-gray-500 mb-1">
                                                            %{progress}
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-0.75 bg-gray-200">
                                                        <div
                                                            className="h-full transition-all duration-700"
                                                            style={{ width: `${progress}%`, backgroundColor: Colors.primary }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Info Footers */}
                                                <div className="flex justify-between w-full mt-1">
                                                    <div className="flex flex-col gap-1 sm:gap-1.5">
                                                        <span className="text-[#9ca3af] font-medium text-[11px] sm:text-[13px]">
                                                            Duration Date
                                                        </span>
                                                        <span className="text-black font-semibold text-[11px] sm:text-[13px]">
                                                            {durationText}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex flex-col gap-1 sm:gap-1.5 text-right">
                                                        <span className="text-[#9ca3af] font-medium text-[11px] sm:text-[13px]">
                                                            Location
                                                        </span>
                                                        <span className="text-black font-semibold text-[11px] sm:text-[13px]">
                                                            {item.location || "-"}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
