import React from 'react';
import { Colors } from '@/colors';
import { Button } from "@/components/ui/button";
import { useGetUserProfileQuery } from '@/Services/HandleAPI';
import { useNavigate } from 'react-router-dom';

export default function SignOutPopup({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { data: userprofile } = useGetUserProfileQuery();

    if (!isOpen) return null;

    const firstName = userprofile?.data?.firstName || "";
    const lastName = userprofile?.data?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || "User Name";

    const handleSignOut = () => {
        localStorage.removeItem("token");
        navigate("/");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="w-[600px] max-w-[95vw] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div
                    className="h-24 flex items-center justify-center"
                    style={{ backgroundColor: Colors.primary }}
                >
                    <h3 className="text-white text-[28px] font-bold font-serif tracking-wide pt-1">
                        Sign out
                    </h3>
                </div>

                {/* Body */}
                <div className="flex flex-col items-center justify-center px-12 py-16 text-center bg-white min-h-60">
                    <h4 className="text-[20px] font-bold text-black mb-5 font-sans">
                        {fullName}
                    </h4>
                    <p className="text-[16px] text-gray-700 font-medium font-sans px-6 leading-relaxed">
                        Are you sure you want to sign out of this account?
                    </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex w-full h-18 font-sans pb-0">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 h-full rounded-none font-semibold text-white transition-opacity hover:opacity-90 text-[18px] hover:text-white"
                        style={{ backgroundColor: Colors.secondary }}
                    >
                        No
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleSignOut}
                        className="flex-1 h-full rounded-none font-semibold text-white transition-opacity hover:opacity-90 text-[18px] hover:text-white"
                        style={{ backgroundColor: Colors.primary }}
                    >
                        Yes
                    </Button>
                </div>

            </div>
        </div>
    );
}
