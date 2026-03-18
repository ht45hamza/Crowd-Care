import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CampaignImage from './CampaignImage';
import dummyImg from '@/assets/startingimage.jpeg';

export default function DonationCard({ donation, isExpanded, onToggle }) {

    return (
        <div className="bg-white rounded-[24px] shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100 relative mb-12 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <div className="p-8 md:p-10 pb-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[20px] md:text-[22px] font-bold text-[#1a391e]">
                        {donation.title}
                    </h3>
                    <div className="text-orange-400">
                        <ChevronDown 
                            size={28} 
                            strokeWidth={1.5} 
                            className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} 
                        />
                    </div>
                </div>

                <p className="text-[#858585] text-[14px] md:text-[15px] leading-[1.7] font-medium mb-8">
                    {donation.description}
                </p>

                {/* Image Strip */}
                <div className="flex gap-2.5 mb-10 overflow-x-auto pb-2 scrollbar-hide text-[0]">
                    {donation.images.map((img, idx) => (
                        <CampaignImage 
                            key={idx} 
                            imageKey={img} 
                            alt={`Asset ${idx}`} 
                            fallbackImage={dummyImg}
                            className="w-14 h-10 md:w-16 md:h-12 rounded-lg object-cover flex-shrink-0 inline-block"
                        />
                    ))}
                </div>

                {/* Financial Info */}
                <div className="flex justify-between items-end mb-4">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[#9ca3af] text-[13px] md:text-[14px] font-medium uppercase tracking-wide">Amount Target</span>
                        <span className="text-black text-[20px] md:text-[22px] font-black">${donation.amountTarget.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1.5 text-right">
                        <span className="text-[#9ca3af] text-[13px] md:text-[14px] font-medium uppercase tracking-wide">Fundraiser</span>
                        <span className="text-black text-[20px] md:text-[22px] font-black">${donation.fundraiser.toLocaleString()}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 mb-4">
                    <div className="flex justify-end">
                        <span className="text-[13px] font-bold text-black">%{donation.progress}</span>
                    </div>
                    <div className="w-full h-[3px] bg-gray-100 rounded-full">
                        <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ width: `${donation.progress}%`, backgroundColor: '#1a391e' }}
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-2 gap-y-8 mt-6 pt-6 border-t border-gray-50 pb-4">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[#9ca3af] text-[13px] font-medium">Duration Date</span>
                                    <span className="text-black text-[15px] md:text-[16px] font-bold">{donation.durationDate}</span>
                                </div>
                                <div className="flex flex-col gap-1.5 text-right">
                                    <span className="text-[#9ca3af] text-[13px] font-medium">Location</span>
                                    <span className="text-black text-[15px] md:text-[16px] font-bold">{donation.location}</span>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[#9ca3af] text-[13px] font-medium">Debit Card</span>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-5 bg-[#1a391e]/5 rounded flex items-center justify-center p-1 border border-[#1a391e]/10">
                                            <div className="flex -space-x-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-600 opacity-90" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-90" />
                                            </div>
                                        </div>
                                        <span className="text-black text-[15px] md:text-[16px] font-bold">{donation.debitCard}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 text-right">
                                    <span className="text-[#9ca3af] text-[13px] font-medium">Amount</span>
                                    <span className="text-black text-[15px] md:text-[16px] font-bold">${donation.amountSent}</span>
                                    <span className="text-[11px] font-black text-black leading-none">%100</span>
                                </div>

                                <div className="flex flex-col gap-1.5 pt-2">
                                    <span className="text-[#9ca3af] text-[13px] font-medium">Day / Date</span>
                                    <span className="text-black text-[15px] md:text-[16px] font-bold">{donation.dayDate}</span>
                                </div>
                                <div className="flex flex-col gap-1.5 text-right pt-2">
                                    <span className="text-[#9ca3af] text-[13px] font-medium">Time</span>
                                    <span className="text-black text-[15px] md:text-[16px] font-bold">{donation.time}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Centered Footer Toggle Button */}
            <div className="absolute left-1/2 bottom-[-24px] -translate-x-1/2 z-20">
                <button 
                    onClick={onToggle}
                    className="w-12 h-12 rounded-full bg-[#f1f3f4] border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-md transition-all group"
                >
                    <div className="transform transition-transform duration-300">
                        {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                </button>
            </div>
        </div>
    );
}
