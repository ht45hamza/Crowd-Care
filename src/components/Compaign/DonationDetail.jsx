import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Sidebar from '../Home/Sidebar';
import Header from '../Home/Header';
import FundraiserCard from './FundraiserCard';
import DonationCard from './DonationCard';
import { useMyDonationHistoryQuery, useGetAuthCampaignsQuery } from '@/Services/HandleAPI';
import dummyImg from '@/assets/startingimage.jpeg';

export default function DonationDetail() {
    const [activeTab, setActiveTab] = useState('Donation Details');
    const [expandedId, setExpandedId] = useState(null);

    const { data: donationsResponse, isLoading: isLoadingDonations } = useMyDonationHistoryQuery();
    const { data: campaignsResponse, isLoading: isLoadingCampaigns } = useGetAuthCampaignsQuery();

    const donationsData = donationsResponse?.data || [];
    const campaignsData = campaignsResponse?.data || [];

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const mapDonationToCard = (item) => ({
        id: item._id,
        title: item.campaign?.title || "Unknown Campaign",
        description: item.campaign?.description || "No description.",
        amountTarget: item.campaign?.amount || 0,
        fundraiser: item.campaign?.raisedAmount || 0,
        progress: item.campaign?.amount ? Math.round((item.campaign?.raisedAmount / item.campaign?.amount) * 100) : 0,
        durationDate: `${item.campaign?.duration?.[0] || "-"} to ${item.campaign?.duration?.[1] || "-"}`,
        location: item.campaign?.location || "-",
        debitCard: "Card",
        amountSent: item.amount || 0,
        dayDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-",
        time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : "-",
        category: item.campaign?.category?.name || "Uncategorized",
        images: item.campaign?.images?.length ? item.campaign.images : [dummyImg]
    });

    const mapCampaignToCard = (item) => ({
        id: item._id,
        title: item.title || "Unknown Campaign",
        description: item.description || "No description.",
        amountTarget: item.amount || 0,
        fundraiser: item.raisedAmount || 0,
        progress: item.amount ? Math.round(((item.raisedAmount || 0) / item.amount) * 100) : 0,
        durationDate: `${item.duration?.[0] || "-"} to ${item.duration?.[1] || "-"}`,
        location: item.location || "-",
        images: item.images?.length ? item.images : [dummyImg]
    });

    return (
        <div className="flex min-h-screen bg-[#fbfbfb] font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header title="Donation History" />

                <main className="flex-1 overflow-y-auto px-8 lg:px-12 py-8">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <h2 className="text-[28px] font-bold text-[#1a391e] border-l-4 border-[#1a391e] pl-4">Payment Details</h2>

                        {/* Toggle Switch */}
                        <div className="flex bg-white p-1.5 rounded-2xl w-full max-w-2xl mx-auto border border-gray-100 shadow-sm">
                            <button
                                onClick={() => { setActiveTab('Fundraiser Details'); setExpandedId(null); }}
                                className={`flex-1 py-3.5 px-6 rounded-xl text-[15px] font-bold transition-all duration-300 ${
                                    activeTab === 'Fundraiser Details' 
                                    ? 'bg-[#1a391e] text-white shadow-lg' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                                style={{ backgroundColor: activeTab === 'Fundraiser Details' ? '#1a391e' : undefined }}
                            >
                                Fundraiser Details
                            </button>
                            <button
                                onClick={() => { setActiveTab('Donation Details'); setExpandedId(null); }}
                                className={`flex-1 py-3.5 px-6 rounded-xl text-[15px] font-bold transition-all duration-300 ${
                                    activeTab === 'Donation Details' 
                                    ? 'bg-[#1a391e] text-white shadow-lg shadow-[#1a391e]/10' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                                style={{ backgroundColor: activeTab === 'Donation Details' ? '#1a391e' : undefined }}
                            >
                                Donation Details
                            </button>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex items-center gap-4 w-full">
                            <div className="relative flex-1">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={22} />
                                <input
                                    type="text"
                                    placeholder="Search your history..."
                                    className="w-full h-14 pl-14 pr-6 bg-white rounded-full border border-gray-100 shadow-sm outline-none focus:ring-4 focus:ring-[#1a391e]/5 transition-all text-[15px] font-medium placeholder:text-gray-300 text-gray-700"
                                />
                            </div>
                            <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md border border-gray-50 hover:bg-gray-50 transition-all text-gray-700">
                                <Filter size={24} />
                            </button>
                        </div>

                        {/* Card List */}
                        <div className="space-y-4 pb-12">
                            {activeTab === 'Fundraiser Details' ? (
                                isLoadingCampaigns ? (
                                    <div className="text-gray-500 text-center py-10 font-bold">Loading Fundraisers...</div>
                                ) : campaignsData.length > 0 ? (
                                    campaignsData.map((item) => (
                                        <FundraiserCard 
                                            key={item._id} 
                                            donation={mapCampaignToCard(item)} 
                                            isExpanded={expandedId === item._id} 
                                            onToggle={() => toggleExpand(item._id)}
                                        />
                                    ))
                                ) : (
                                    <div className="text-gray-500 text-center py-10 font-bold">No fundraisers found.</div>
                                )
                            ) : (
                                isLoadingDonations ? (
                                    <div className="text-gray-500 text-center py-10 font-bold">Loading Donations...</div>
                                ) : donationsData.length > 0 ? (
                                    donationsData.map((item) => (
                                        <DonationCard 
                                            key={item._id} 
                                            donation={mapDonationToCard(item)} 
                                            isExpanded={expandedId === item._id} 
                                            onToggle={() => toggleExpand(item._id)}
                                        />
                                    ))
                                ) : (
                                    <div className="text-gray-500 text-center py-10 font-bold">No donations found.</div>
                                )
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
