import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Colors } from "@/colors";
import Sidebar from "../Home/Sidebar";
import Header from "../Home/Header";
import { Eye, EyeOff } from "lucide-react";
import { useChangePasswordMutation } from "@/Services/HandleAPI";
import { changePasswordSchema } from "@/utils/validationSchemas";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [changePassword, { isLoading: Changing }] = useChangePasswordMutation();
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear field error on change
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
        if (apiError) setApiError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");

        try {
            changePasswordSchema.validateSync(formData, { abortEarly: false });
            setErrors({});
        } catch (validationErr) {
            const newErrors = {};
            validationErr.inner.forEach((err) => {
                if (!newErrors[err.path]) newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
            return;
        }

        try {
            await changePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
            }).unwrap();

            toast.success("Password changed successfully!");

            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setErrors({});
        } catch (error) {
            console.error("Change password error:", error);
            const msg = error?.data?.message || "Failed to change password";
            setApiError(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="flex h-screen bg-white font-sans overflow-hidden">
            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
                <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

                <main className="flex-1 flex flex-col overflow-y-auto px-4 sm:px-10 py-6 sm:py-10 items-center">
                    <div className="w-full max-w-[1000px] mt-2 sm:mt-10">
                        <h2
                            className="text-[22px] sm:text-[32px] font-bold font-serif mb-6 sm:mb-10 text-left"
                            style={{ color: Colors.primary }}
                        >
                            Change Password
                        </h2>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col h-full min-h-87.5"
                        >
                                <div className="space-y-6 grow">
                                    <div className="relative">
                                        <Input
                                            type={showOld ? "text" : "password"}
                                            name="oldPassword"
                                            value={formData.oldPassword}
                                            onChange={handleChange}
                                            placeholder="Old Password"
                                            className="h-14 sm:h-16.25 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-6 pr-12 text-[14px] sm:text-[15px] font-medium text-black focus-visible:ring-1 focus-visible:ring-gray-300 transition-colors w-full placeholder:text-gray-400"
                                            style={{ backgroundColor: "#ffffff" }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOld(!showOld)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                        {errors.oldPassword && <p className="text-red-500 text-xs mt-1 ml-2">{errors.oldPassword}</p>}
                                    </div>

                                    <div className="relative">
                                        <Input
                                            type={showNew ? "text" : "password"}
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="New Password"
                                            className="h-14 sm:h-16.25 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-6 pr-12 text-[14px] sm:text-[15px] font-medium text-black focus-visible:ring-1 focus-visible:ring-gray-300 transition-colors w-full placeholder:text-gray-400"
                                            style={{ backgroundColor: "#ffffff" }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNew(!showNew)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                        {errors.newPassword && <p className="text-red-500 text-xs mt-1 ml-2">{errors.newPassword}</p>}
                                    </div>

                                    <div className="relative">
                                        <Input
                                            type={showConfirm ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm Password"
                                            className="h-14 sm:h-16.25 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-6 pr-12 text-[14px] sm:text-[15px] font-medium text-black focus-visible:ring-1 focus-visible:ring-gray-300 transition-colors w-full placeholder:text-gray-400"
                                            style={{ backgroundColor: "#ffffff" }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-2">{errors.confirmPassword}</p>}
                                    </div>
                                </div>

                                {apiError && (
                                    <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg animate-in fade-in duration-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                        <p className="text-red-600 text-sm font-medium leading-none">
                                            {apiError}
                                        </p>
                                    </div>
                                )}

                            <div className="mt-10 sm:mt-16">
                                <Button
                                    type="submit"
                                    disabled={Changing}
                                    className="w-full h-12 sm:h-13.75 rounded-2xl text-white text-[16px] font-semibold shadow-sm hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: Colors.primary }}
                                >
                                    {Changing ? "Changing..." : "Continue"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}