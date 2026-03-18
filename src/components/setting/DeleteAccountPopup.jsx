import React from 'react';
import { Colors } from '@/colors';
import { Button } from "@/components/ui/button";
import { useGetUserProfileQuery, useDeleteAccountMutation } from '@/Services/HandleAPI';
import { useNavigate } from 'react-router-dom';

export default function DeleteAccountPopup({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { data: userprofile } = useGetUserProfileQuery();
    const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

    if (!isOpen) return null;

    const firstName = userprofile?.data?.firstName || "";
    const lastName = userprofile?.data?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || "User Name";

    const handleDelete = async () => {
        try {
            await deleteAccount(userprofile?.data?._id).unwrap();
            alert("Account deleted successfully");
            localStorage.removeItem("token");
            navigate("/login");
        } catch (err) {
            console.log("Delete account error:", err);
            alert(err?.data?.message || "Failed to delete account");
        }
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
                        Delete Account
                    </h3>
                </div>

                {/* Body */}
                <div className="flex flex-col items-center justify-center px-12 py-16 text-center bg-white min-h-60">
                    <h4 className="text-[20px] font-bold text-black mb-5 font-sans">
                        {fullName}
                    </h4>
                    <p className="text-[16px] text-gray-700 font-medium font-sans px-6 leading-relaxed">
                        Are you sure you want to delete this account?
                    </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex w-full h-18 font-sans pb-0">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 h-full rounded-none font-semibold text-white transition-opacity hover:opacity-90 text-[18px] hover:text-white disabled:opacity-50"
                        style={{ backgroundColor: Colors.secondary }}
                    >
                        No
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 h-full rounded-none font-semibold text-white transition-opacity hover:opacity-90 text-[18px] hover:text-white disabled:opacity-50"
                        style={{ backgroundColor: Colors.primary }}
                    >
                        {isDeleting ? "Deleting..." : "Yes"}
                    </Button>
                </div>

            </div>
        </div>
    );
}
