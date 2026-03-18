import React, { useState } from 'react';
import Sidebar from '../Home/Sidebar';
import Header from '../Home/Header';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MyActiveCompaigns from './MyActiveCompaigns';
import MyPendingCompaigns from './MyPendingCompaigns';
import { useGetAuthCampaignsQuery } from '@/Services/HandleAPI';

export default function MyCampaigns() {
    const [activeTab, setActiveTab] = useState('Active');
    const [searchTerm, setSearchTerm] = useState('');
    const { data: authCampaigns, isLoading, isError } = useGetAuthCampaignsQuery();

    const campaigns = authCampaigns?.data || [];

    // Filter by search term
    const filteredCampaigns = campaigns.filter(campaign => 
        campaign.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by status (assuming 'active' and 'pending')
    const activeCampaigns = filteredCampaigns.filter(c => c.status === 'active' || c.status === 'approved');
    const pendingCampaigns = filteredCampaigns.filter(c => c.status === 'pending');

    return (
        <div className="flex min-h-screen bg-[#f5f5f5] font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col bg-[#fbfbfb]">
                <Header title="My Campaigns" />

                <main className="flex-1 flex flex-col overflow-y-auto px-8 lg:px-12 py-12 pb-20">
                    
                    {/* Search Bar Container */}
                    <div className="w-full mx-auto max-w-6xl">
                        <div className="relative w-full shadow-[0_4px_25px_rgba(0,0,0,0.03)] bg-white rounded-full overflow-hidden flex items-center px-6 h-16 border border-gray-100/50">
                            <SearchIcon className="text-gray-300" size={24} strokeWidth={1.5} />
                            <Input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-none shadow-none focus-visible:ring-0 text-[16px] text-black font-medium placeholder:text-gray-300 h-full w-full bg-transparent ml-2"
                            />
                        </div>

                        {/* Toggle Switch */}
                        <div className="flex bg-white p-1.5 rounded-2xl w-full max-w-2xl mx-auto border border-gray-100 shadow-sm mt-12 mb-12">
                            <button
                                onClick={() => setActiveTab('Active')}
                                className={`flex-1 py-3.5 px-6 rounded-xl text-[15px] font-bold transition-all duration-300 ${
                                    activeTab === 'Active' 
                                    ? 'bg-[#1a391e] text-white shadow-lg shadow-[#1a391e]/20' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                                style={{ backgroundColor: activeTab === 'Active' ? '#1a391e' : undefined }}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setActiveTab('Pending')}
                                className={`flex-1 py-3.5 px-6 rounded-xl text-[15px] font-bold transition-all duration-300 ${
                                    activeTab === 'Pending' 
                                    ? 'bg-[#1a391e] text-white shadow-lg' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                                style={{ backgroundColor: activeTab === 'Pending' ? '#1a391e' : undefined }}
                            >
                                Pending
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="mt-4">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-20">
                                    <Loader2 className="animate-spin text-[#1a391e]" size={40} />
                                </div>
                            ) : isError ? (
                                <div className="text-center py-20 text-red-500 font-medium">
                                    Failed to load campaigns. Please try again later.
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'Active' ? (
                                        <MyActiveCompaigns campaigns={activeCampaigns} />
                                    ) : (
                                        <MyPendingCompaigns campaigns={pendingCampaigns} />
                                    )}
                                    
                                    {activeTab === 'Active' && activeCampaigns.length === 0 && (
                                        <div className="text-center py-20 text-gray-400 font-medium">
                                            No active campaigns found.
                                        </div>
                                    )}
                                    {activeTab === 'Pending' && pendingCampaigns.length === 0 && (
                                        <div className="text-center py-20 text-gray-400 font-medium">
                                            No pending campaigns found.
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
