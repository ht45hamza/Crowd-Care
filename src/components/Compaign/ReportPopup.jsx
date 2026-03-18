import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateReportMutation } from '../../Services/HandleAPI';

const REPORT_REASONING = [
    "Identity fraud",
    "Undesirable or harmful",
    "Publication of inappropriate contents",
    "Harassment or bullying",
    "Other"
];

export default function ReportPopup({ isOpen, onClose, campaignId }) {
    const [Report, { isLoading }] = useCreateReportMutation();
    const [selectedReason, setSelectedReason] = useState("Undesirable or harmful");

    if (!isOpen) return null;

    const handleReport = async () => {
        if (!campaignId) {
            alert("Campaign ID is missing. Cannot submit report.");
            return;
        }

        try {
            await Report({
                campaignId,
                reason: selectedReason,
            }).unwrap();
            alert("Report submitted successfully!");
            onClose();
        } catch (error) {
            const errorMsg = error?.data?.message || error?.message || "Something went wrong.";
            alert(`Failed to submit report: ${errorMsg}`);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                    />

                    {/* Sidebar Popup */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col p-8 md:p-10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mt-12 space-y-3">
                            <h2 className="text-[26px] font-bold text-[#1a391e] tracking-tight">Report the user</h2>
                            <p className="text-[#858585] text-[15px] font-medium leading-relaxed">
                                Please help us and select a reason to understand what is going on.
                            </p>
                        </div>

                        {/* Reasons List */}
                        <div className="flex-1 mt-12 space-y-4">
                            {REPORT_REASONING.map((reason) => (
                                <button
                                    key={reason}
                                    onClick={() => setSelectedReason(reason)}
                                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-200 ${selectedReason === reason
                                            ? 'bg-white border-[#1a391e] shadow-sm'
                                            : 'bg-white border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <span className={`text-[15px] font-bold ${selectedReason === reason ? 'text-black' : 'text-gray-600'}`}>
                                        {reason}
                                    </span>

                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedReason === reason
                                            ? 'bg-[#1a391e] border-[#1a391e]'
                                            : 'border-gray-200 bg-white'
                                        }`}>
                                        {selectedReason === reason && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-auto pt-8">
                            <button
                                onClick={handleReport}
                                disabled={isLoading}
                                className="w-full h-15 bg-[#1a391e] text-white rounded-2xl text-[17px] font-bold hover:opacity-95 transition-all shadow-lg shadow-[#1a391e]/20 disabled:opacity-60"
                            >
                                {isLoading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
