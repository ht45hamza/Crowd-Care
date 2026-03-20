import React from 'react';
import { X, Bell, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetNotificationQuery } from '../../Services/HandleAPI';
import { Colors } from '@/colors';

export default function NotificationPopup({ isOpen, onClose }) {
    const { data: Notification, isLoading, isError, refetch } = useGetNotificationQuery();

    const ndata = Notification?.data || [];
    const nmsg = Notification?.message;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end overflow-hidden">
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
                        className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                    <Bell size={20} className="text-[#1a391e]" />
                                </div>
                                <div>
                                    <h2 className="text-[22px] font-bold text-[#1a391e] tracking-tight line-height-1">Notifications</h2>
                                    <p className="text-[#858585] text-[13px] font-medium mt-0.5">Stay updated with latest activities</p>
                                </div>
                            </div>
                            
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all border border-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            {isLoading ? (
                                <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
                                    <div className="w-10 h-10 border-4 border-[#1a391e]/10 border-t-[#1a391e] rounded-full animate-spin"></div>
                                    <p className="text-gray-500 font-medium">Loading notifications...</p>
                                </div>
                            ) : isError ? (
                                <div className="h-full flex flex-col items-center justify-center gap-4 py-20 px-8 text-center">
                                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-2">
                                        <Info size={32} className="text-red-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Failed to load</h3>
                                    <p className="text-gray-500 text-sm">We couldn't fetch your notifications at this time.</p>
                                    <button 
                                        onClick={refetch}
                                        className="mt-2 text-sm font-bold text-[#1a391e] hover:underline"
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : ndata.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center gap-4 py-20 px-8 text-center">
                                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                                        <Bell size={40} className="text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">No Notifications Yet</h3>
                                    <p className="text-gray-500 text-sm">When you receive notifications, they will appear here.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {ndata.map((notification, index) => (
                                        <motion.div
                                            key={notification._id || index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer group hover:shadow-md ${
                                                notification.isRead === false 
                                                    ? 'bg-green-50/30 border-green-100' 
                                                    : 'bg-white border-gray-100 hover:border-gray-200'
                                            }`}
                                        >
                                            <div className="flex gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex shrink-0 items-center justify-center mt-0.5 ${
                                                    notification.isRead === false 
                                                        ? 'bg-[#1a391e] text-white shadow-lg shadow-green-900/10' 
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    <Bell size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1 gap-2">
                                                        <h4 className={`font-bold text-[15px] truncate ${
                                                            notification.isRead === false ? 'text-[#1a391e]' : 'text-gray-900'
                                                        }`}>
                                                            {notification.title || 'New Notification'}
                                                        </h4>
                                                        <span className="text-[11px] font-semibold text-gray-400 whitespace-nowrap pt-0.5 uppercase tracking-wider">
                                                            {new Date(notification.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <p className={`text-[14px] leading-relaxed break-words ${
                                                        notification.isRead === false ? 'text-gray-700 font-medium' : 'text-gray-600'
                                                    }`}>
                                                        {notification.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {ndata.length > 0 && (
                            <div className="p-6 md:p-8 pt-4 border-t border-gray-100">
                                <button
                                    onClick={onClose}
                                    className="w-full h-15 bg-[#1a391e] text-white rounded-2xl text-[17px] font-bold hover:opacity-95 transition-all shadow-lg shadow-[#1a391e]/20"
                                >
                                    Dismiss All
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
