import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, HeartPulse, Users } from 'lucide-react';
import coinsImg from '@/assets/coins.jpeg';
import startingImg from '@/assets/startingimage.jpeg';
import CampaignImage from '@/components/Compaign/CampaignImage';
import { useGetCategoryQuery, useGetAllCampaignsQuery, useGetAuthCampaignsQuery } from '@/Services/HandleAPI';


export default function Dashboard() {
    const navigate = useNavigate();
    const { data: categoriesResponse } = useGetCategoryQuery();
    const { data: allCampaignsResponse, isLoading: isLoadingAll } = useGetAllCampaignsQuery();
    const { data: authCampaignsResponse, isLoading: isLoadingAuth } = useGetAuthCampaignsQuery();

    const categoriesData = categoriesResponse?.data || [];
    const allCampaignsData = allCampaignsResponse?.data || [];
    const authCampaignsData = authCampaignsResponse?.data || [];
    
    const handleClick = (item) => {
        navigate("/compaign-donation", { state: { campaign: item } });
    };


    const renderCard = (item) => {
        const id = item._id || item.id;
        const title = item.title;
        const target = item.amount || item.target || 0;
        const raised = item.raisedAmount || item.raised || 0;
        const progress = target > 0 ? Math.round((raised / target) * 100) : 0;
        const categoryName = item.category?.name || item.category || 'Uncategorized';
        const location = item.location || 'Unknown location';
        
        const imageKey = (item.images && item.images.length > 0) ? item.images[0] : item.image;

        return (
        <div key={id} className="min-w-[280px] sm:min-w-[calc(50%-16px)] lg:min-w-[calc(33.333%-20px)] bg-white rounded-[24px] shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-lg shrink-0">
            <div className="h-44 overflow-hidden relative">
                <CampaignImage 
                    imageKey={imageKey} 
                    alt={title} 
                    fallbackImage={startingImg}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
            </div>
            <div className="p-5 flex flex-col">
                <h4 className="text-[15px] font-bold text-black text-center mb-4 min-h-[40px] flex items-center justify-center">{title}</h4>
                
                <div className="flex flex-col gap-1.5 mb-5">
                    <div className="flex justify-end pr-0.5">
                        <span className="text-[11px] font-black text-black tracking-tighter">%{progress}</span>
                    </div>
                    <div className="w-full h-[3px] bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full rounded-full transition-all duration-700" 
                            style={{ width: `${progress}%`, backgroundColor: '#1a391e' }}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-start mb-6 gap-2">
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                        <span className="text-gray-400 text-[11px] font-medium tracking-tight truncate">Raised of <span className="text-black font-black">${raised.toLocaleString()}</span></span>
                        <span className="text-gray-400 text-[11px] font-medium truncate">{categoryName}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 text-right overflow-hidden">
                        <span className="text-gray-400 text-[11px] font-medium tracking-tight truncate">Target <span className="text-black font-black">${target.toLocaleString()}</span></span>
                        <span className="text-gray-400 text-[11px] font-medium truncate">{location}</span>
                    </div>
                </div>

                <button 
                    onClick={() => handleClick(item)}
                    className="w-full h-10 rounded-xl text-white text-[13px] font-bold transition-all duration-300 bg-[#1a391e] hover:bg-gray-500 shadow-sm"
                >
                    View
                </button>
            </div>
        </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-8 md:gap-14 pb-12 sm:pb-24">
            {/* Page Title */}
            <h1 className="text-[28px] sm:text-[34px] md:text-[45px] font-bold text-[#f59e0b] mt-4 leading-tight px-1">
                What Do you want to donate today?
            </h1>

            {/* Banner Section */}
            <div className="relative w-full h-64 sm:h-72 md:h-96 rounded-[30px] sm:rounded-[40px] overflow-hidden shadow-2xl group border border-white/20">
                <img src={coinsImg} alt="Banner background" className="absolute inset-0 w-full h-full object-cover" />
                {/* Intense Green Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a391e] via-[#1a391e]/85 to-transparent flex flex-col items-start justify-center p-6 sm:p-12 lg:p-20">
                    <h2 className="text-[28px] sm:text-[44px] md:text-[64px] font-black text-white leading-[1.1] mb-6 sm:mb-12 max-w-2xl drop-shadow-lg">
                        Start Your own Funding
                    </h2>
                    <button 
                        onClick={() => navigate('/start-compaign')}
                        className="bg-[#f59e0b] hover:bg-[#d97706] text-white px-8 sm:px-14 py-3 sm:py-5 rounded-xl sm:rounded-2xl text-[16px] sm:text-[20px] font-black transition-all shadow-[0_10px_40px_rgba(245,158,11,0.4)] active:scale-95"
                    >
                        Start Campaign
                    </button>
                </div>
            </div>

            {/* Categories Section - Horizontal Scroll */}
            <section className="flex flex-col gap-6 sm:gap-8 overflow-hidden">
                <div className="flex justify-between items-center">
                    <h3 className="text-[24px] sm:text-[28px] font-black text-[#1a391e]">Category</h3>
                </div>
                <div className="flex gap-4 sm:gap-8 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2 scroll-smooth min-h-[100px]">
                    {categoriesData.length > 0 ? categoriesData.map((cat) => (
                        <div 
                            key={cat._id || cat.id} 
                            className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-gray-100 flex items-center gap-4 sm:gap-6 hover:shadow-md transition-all cursor-pointer group active:scale-[0.98] min-w-[200px] sm:min-w-[280px] shrink-0"
                        >
                            <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform overflow-hidden">
                                {cat.logo ? (
                                    <img src={cat.logo} alt={cat.name} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                                ) : (
                                    <HeartPulse className="text-orange-400" size={28} />
                                )}
                            </div>
                            <span className="text-[18px] sm:text-[20px] font-black text-[#1a391e]">{cat.name}</span>
                        </div>
                    )) : (
                        <div className="w-full py-10 flex justify-center items-center">
                            <p className="text-gray-400 font-medium italic">No categories available</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Top Fundraiser Section - Horizontal Scroll */}
            <section className="flex flex-col gap-6 sm:gap-8 overflow-hidden">
                <div className="flex justify-between items-center">
                    <h3 className="text-[24px] sm:text-[28px] font-black text-[#1a391e]">Top Fundraiser</h3>
                </div>
                <div className="flex gap-4 sm:gap-8 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2 scroll-smooth min-h-[200px]">
                    {isLoadingAll ? (
                        <div className="w-full flex justify-center py-10">
                            <div className="w-8 h-8 border-4 border-[#1a391e] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : allCampaignsData.length > 0 ? (
                        allCampaignsData.map(renderCard)
                    ) : (
                        <div className="w-full py-10 flex justify-center items-center">
                            <p className="text-gray-400 font-medium italic">No fundraisers available</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Recent Project Section - Horizontal Scroll */}
            <section className="flex flex-col gap-6 sm:gap-8 overflow-hidden">
                <div className="flex justify-between items-center">
                    <h3 className="text-[24px] sm:text-[28px] font-black text-[#1a391e]">Recent project</h3>
                </div>
                <div className="flex gap-4 sm:gap-8 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2 scroll-smooth min-h-[200px]">
                    {isLoadingAuth ? (
                        <div className="w-full flex justify-center py-10">
                            <div className="w-8 h-8 border-4 border-[#1a391e] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : authCampaignsData.length > 0 ? (
                        authCampaignsData.map(renderCard)
                    ) : (
                        <div className="w-full py-10 flex justify-center items-center">
                            <p className="text-gray-400 font-medium italic">No recent projects available</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
