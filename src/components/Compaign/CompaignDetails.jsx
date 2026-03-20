import React, { useState } from 'react';
import { Colors } from '@/colors';
import Sidebar from '../Home/Sidebar';
import Header from '../Home/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Stepper, Step } from 'react-form-stepper';
import { campaignDetailsSchema } from '@/utils/validationSchemas';
import { useDispatch, useSelector } from 'react-redux';           // ← add
import { updateCampaignData } from '@/Services/campaignSlice';    // ← add

export default function CompaignDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const campaignData = useSelector((state) => state.campaign);  // ← add

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [errors, setErrors] = useState({});

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (campaignData.images.length + files.length > 8) {
            alert("You can only upload up to 8 images.");
            return;
        }
        const newBlobs = files.map(file => URL.createObjectURL(file));
        dispatch(updateCampaignData({
            images: [...campaignData.images, ...newBlobs],
            rawImageFiles: [...campaignData.rawImageFiles, ...files],
        }));
    };

    const removeImage = (indexToRemove) => {
        dispatch(updateCampaignData({
            images: campaignData.images.filter((_, i) => i !== indexToRemove),
            rawImageFiles: campaignData.rawImageFiles.filter((_, i) => i !== indexToRemove),
        }));
    };

    const handleContinue = () => {
        try {
            campaignDetailsSchema.validateSync({
                amount: campaignData.amount,
                durationFrom: campaignData.durationFrom,
                durationTo: campaignData.durationTo,
                description: campaignData.description,
                imageCount: campaignData.images.length,
            }, { abortEarly: false });
            setErrors({});
        } catch (validationErr) {
            const newErrors = {};
            validationErr.inner.forEach((err) => { newErrors[err.path] = err.message; });
            setErrors(newErrors);
            return;
        }
        navigate('/compaign-review'); // ← no state needed
    };

    return (
        <div className="flex h-screen bg-white font-sans overflow-hidden">
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)} />
            )}
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
                <main className="flex-1 flex flex-col bg-white overflow-y-auto pb-20">
                    <div className="w-full flex justify-center py-4 sm:py-5 shadow-sm shrink-0"
                        style={{ backgroundColor: Colors.secondary }}>
                        <h2 className="text-white font-serif font-bold text-[20px] sm:text-[24px]">Amount Details</h2>
                    </div>

                    <div className="w-full max-w-[1050px] mx-auto mt-4 sm:mt-6 px-4 sm:px-6 flex flex-col md:flex-row gap-6 lg:gap-16 flex-1">
                        <div className="hidden md:flex flex-col min-w-50 py-4 relative h-full">
                            <Stepper activeStep={1} className="stepper-vertical"
                                styleConfig={{
                                    activeBgColor: Colors.primary, activeTextColor: '#ffffff',
                                    inactiveBgColor: '#9ca3af', inactiveTextColor: '#ffffff',
                                    completedBgColor: Colors.primary, completedTextColor: '#ffffff',
                                    size: '2rem', circleFontSize: '14px', labelFontSize: '14px',
                                    borderRadius: '50%', fontWeight: '600'
                                }}
                                connectorStyleConfig={{
                                    activeColor: Colors.primary, completedColor: Colors.primary,
                                    disabledColor: '#d1d5db', size: 2, style: 'solid'
                                }}>
                                <Step label="Fundraiser Details"><Check size={16} strokeWidth={3} /></Step>
                                <Step label="Amount Details">2</Step>
                                <Step label="Review">3</Step>
                            </Stepper>
                        </div>

                        <div className="flex-1 flex flex-col w-full min-h-fit md:min-h-170">
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8 pt-2">
                                {/* Amount */}
                                <div className="flex-1 flex flex-col">
                                    <Input
                                        type="number" min="0" placeholder="Amount"
                                        value={campaignData.amount}                     // ← Redux
                                        onChange={(e) => {
                                            dispatch(updateCampaignData({ amount: e.target.value }));
                                            if (errors.amount) setErrors({ ...errors, amount: "" });
                                        }}
                                        className="flex-1 h-14 sm:h-[65px] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-6 text-[15px] font-medium text-black placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 transition-colors bg-white w-full"
                                    />
                                    {errors.amount && <p className="text-red-500 text-xs mt-1 ml-2">{errors.amount}</p>}
                                </div>

                                {/* Duration */}
                                <div className="flex-1 flex flex-col">
                                    <div className={`flex gap-2 h-14 sm:h-[65px] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-4 items-center bg-white transition-colors focus-within:ring-1 focus-within:ring-gray-300 ${errors.durationFrom || errors.durationTo ? 'border-red-500' : ''}`}>
                                        <span className="text-gray-400 text-[14px] sm:text-[15px] font-medium whitespace-nowrap hidden lg:inline">Duration Date</span>
                                        <input type="date"
                                            value={campaignData.durationFrom}           // ← Redux
                                            onChange={(e) => {
                                                dispatch(updateCampaignData({ durationFrom: e.target.value }));
                                                if (errors.durationFrom) setErrors({ ...errors, durationFrom: "" });
                                            }}
                                            className="flex-1 text-[12px] sm:text-[14px] text-gray-500 font-medium bg-transparent outline-none min-w-0"
                                        />
                                        <span className="text-gray-500 font-medium">-</span>
                                        <input type="date"
                                            value={campaignData.durationTo}             // ← Redux
                                            onChange={(e) => {
                                                dispatch(updateCampaignData({ durationTo: e.target.value }));
                                                if (errors.durationTo) setErrors({ ...errors, durationTo: "" });
                                            }}
                                            className="flex-1 text-[12px] sm:text-[14px] text-gray-500 font-medium bg-transparent outline-none min-w-0"
                                        />
                                    </div>
                                    {(errors.durationFrom || errors.durationTo) && (
                                        <p className="text-red-500 text-xs mt-1 ml-2">{errors.durationFrom || errors.durationTo}</p>
                                    )}
                                </div>
                            </div>

                            {/* Images */}
                            <div className="mb-6 sm:mb-8">
                                <h3 className="font-bold text-[15px] sm:text-[16px] tracking-wide mb-3" style={{ color: Colors.primary }}>
                                    Attach Images {campaignData.images.length}/8
                                </h3>
                                <div className="w-full flex items-center p-4 sm:p-6 border border-gray-200 rounded-3xl sm:rounded-4xl shadow-sm relative overflow-hidden bg-white gap-4 sm:gap-6">
                                    <div className="relative w-14 h-14 sm:w-17.5 sm:h-17.5 rounded-full border border-gray-400 flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden">
                                        <div className="text-gray-400 text-2xl sm:text-3xl font-light mb-1">+</div>
                                        <input type="file" multiple accept="image/*" onChange={handleImageUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    </div>
                                    <div className="flex-1 border border-gray-200 rounded-3xl sm:rounded-4xl p-4 sm:p-6 flex flex-wrap gap-3 sm:gap-4 shadow-sm bg-white min-h-[100px] sm:min-h-35">
                                        {campaignData.images.length === 0 && (
                                            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic">No images uploaded</div>
                                        )}
                                        {campaignData.images.map((imgSrc, index) => (
                                            <div key={index} className="relative w-16 h-10 sm:w-21.25 sm:h-13.75 rounded-lg sm:rounded-xl overflow-hidden shadow-sm">
                                                <img src={imgSrc} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                                                <button onClick={() => removeImage(index)}
                                                    className="absolute top-0.5 right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-100 transition-colors">
                                                    <X size={8} style={{ color: Colors.primary }} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {errors.imageCount && <p className="text-red-500 text-xs mt-2 ml-2">{errors.imageCount}</p>}
                            </div>

                            {/* Description */}
                            <div className="mb-0 flex-1 flex flex-col mt-4">
                                <h3 className="font-bold text-[16px] tracking-wide mb-3" style={{ color: Colors.primary }}>Description</h3>
                                <div className="relative w-full flex-1 flex flex-col">
                                    <textarea
                                        placeholder="Write here"
                                        value={campaignData.description}                // ← Redux
                                        onChange={(e) => {
                                            dispatch(updateCampaignData({ description: e.target.value }));
                                            if (errors.description) setErrors({ ...errors, description: "" });
                                        }}
                                        maxLength={500}
                                        className="w-full h-full min-h-[150px] p-4 sm:p-6 border border-gray-200 rounded-3xl sm:rounded-4xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] resize-none outline-none focus:ring-1 focus:ring-gray-300 text-[15px] font-medium placeholder:text-gray-400"
                                    />
                                    {errors.description && <p className="text-red-500 text-xs mt-1 ml-2">{errors.description}</p>}
                                    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-sm font-semibold text-gray-500">
                                        {campaignData.description.length}/500
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-10 mt-auto pt-8">
                                <Button onClick={() => navigate('/start-compaign')}
                                    className="w-full sm:w-55 h-12 sm:h-13.75 rounded-2xl bg-white text-[16px] font-semibold hover:bg-gray-50 transition-colors shadow-none"
                                    style={{ border: `1px solid ${Colors.secondary}`, color: Colors.secondary }}>
                                    Back
                                </Button>
                                <Button onClick={handleContinue}
                                    className="w-full sm:w-55 h-12 sm:h-13.75 rounded-2xl text-white text-[16px] font-semibold hover:opacity-90 transition-opacity shadow-sm"
                                    style={{ backgroundColor: Colors.secondary }}>
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}