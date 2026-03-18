import React from 'react';
import { useNavigate } from 'react-router-dom';
import dummyCompaignImg from '@/assets/Compaign.png';
import CampaignImage from './CampaignImage';

export default function MyPendingCompaigns({ campaigns = [] }) {
    const navigate = useNavigate();

    const calculateProgress = (raised, total) => {
        if (!total || total === 0) return 0;
        const percentage = (raised / total) * 100;
        return Math.min(Math.round(percentage), 100);
    };

    const formatDuration = (duration) => {
        if (Array.isArray(duration) && duration.length >= 2) {
            return `${duration[0]} to ${duration[1]}`;
        }
        return duration || "N/A";
    };
    
    return (
        <div className="flex flex-col gap-6">
            {campaigns.map((item) => {
                const progress = calculateProgress(item.raisedAmount || 0, item.amount || 0);
                const imageKey = (item.images && item.images.length > 0) ? item.images[0] : null;

                return (
                    <div 
                        key={item._id || item.id} 
                        onClick={() => navigate('/compaign-donation', { state: { campaign: item } })}
                        className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-4 flex flex-col sm:flex-row gap-6 border border-gray-100/50 hover:shadow-md transition-all cursor-pointer group"
                    >
                        {/* Image Section */}
                        <div className="w-full sm:w-[300px] h-44 shrink-0 overflow-hidden rounded-[16px]">
                            <CampaignImage
                                imageKey={imageKey}
                                alt={item.title}
                                fallbackImage={dummyCompaignImg}
                                className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Info Section */}
                        <div className="flex flex-1 flex-col justify-center py-2 pr-2">
                            <div className="flex justify-between items-start mb-8">
                                <h3 className="text-black font-bold text-[19px] sm:text-[21px]">
                                    {item.title}
                                </h3>
                                <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[12px] font-bold rounded-full border border-orange-100 uppercase tracking-wider">
                                    Pending Review
                                </span>
                            </div>

                            {/* Progress Bar Container */}
                            <div className="w-full flex-col mb-4">
                                <div className="flex justify-end w-full">
                                    <span className="text-[12px] font-bold text-gray-400 mb-1">
                                        %{progress}
                                    </span>
                                </div>
                                <div className="w-full h-[3px] bg-gray-100 rounded-full">
                                    <div
                                        className="h-full rounded-full transition-all duration-500 opacity-50"
                                        style={{ width: `${progress}%`, backgroundColor: '#1a391e' }}
                                    ></div>
                                </div>
                            </div>

                            {/* Info Footers */}
                            <div className="flex justify-between w-full mt-1">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[#9ca3af] font-medium text-[13px] uppercase tracking-wide">
                                        Duration
                                    </span>
                                    <span className="text-black font-bold text-[14px]">
                                        {formatDuration(item.duration)}
                                    </span>
                                </div>
                                
                                <div className="flex flex-col gap-1.5 text-right">
                                    <span className="text-[#9ca3af] font-medium text-[13px] uppercase tracking-wide">
                                        {item.location}
                                    </span>
                                    <span className="text-black font-bold text-[14px]">
                                        {item.city}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
