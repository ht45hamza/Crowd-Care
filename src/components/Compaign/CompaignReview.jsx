import React, { useState } from 'react';
import { Colors } from '@/colors';
import Sidebar from '../Home/Sidebar';
import Header from '../Home/Header';
import { Button } from '@/components/ui/button';
import { useNavigate} from 'react-router-dom';
import { Stepper, Step } from 'react-form-stepper';
import { Check } from 'lucide-react';
import { useUploadImageMutation, useCreateCampaignMutation } from '@/Services/HandleAPI';
import { useDispatch, useSelector } from 'react-redux';           
import { resetCampaignData } from '@/Services/campaignSlice';

export default function CompaignReview() {
    const Navigate = useNavigate();
    const dispatch = useDispatch();
    const compData = useSelector((state) => state.campaign); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [createCompaign, { isLoading: Creating }] = useCreateCampaignMutation();
    const [uploadImage] = useUploadImageMutation();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        
        const categoryIdentifier = compData.categoryId;
        
        if (!categoryIdentifier) {
            alert("Category information is missing. Please go back to the first step and re-select the category.");
            return;
        }

        try {
            // Step 1: Upload images
            const uploadedImageNames = [];
            if (compData.rawImageFiles && compData.rawImageFiles.length > 0) {
                for (let i = 0; i < compData.rawImageFiles.length; i++) {
                    const formData = new FormData();
                    formData.append('image', compData.rawImageFiles[i]);
                    const uploadRes = await uploadImage(formData).unwrap();

                    let path = "";
                    let dataObj = uploadRes?.data;
                    
                    if (Array.isArray(dataObj) && dataObj.length > 0) {
                        dataObj = dataObj[0];
                    }

                    if (typeof uploadRes?.data === 'string') {
                        path = uploadRes.data;
                    } else if (typeof dataObj === 'string') {
                        path = dataObj;
                    } else {
                        path = 
                            dataObj?.image || 
                            dataObj?.url || 
                            uploadRes?.image || 
                            uploadRes?.url || 
                            "";
                    }

                    if (path) {
                        // Store only the key (path) just like profile image logic
                        uploadedImageNames.push(path);
                    }
                }
            } else {
                alert("Please attach at least one valid image to proceed.");
                return;
            }

            // Step 2: Create campaign with uploaded image names
            const payload = {
                title : compData.title,
                description : compData.description,
                amount : Number(compData.amount),
                duration : [compData.durationFrom, compData.durationTo],
                category : categoryIdentifier,
                location : compData.city ? `${compData.location}, ${compData.city}` : compData.location,
                images : uploadedImageNames
            };

            await createCompaign(payload).unwrap();
            dispatch(resetCampaignData());
            Navigate("/home");
        } catch (err) {
            if (err.data) {
                alert(`Failed to create campaign: ${err.data.message || "Validation error"}`);
            } else {
                alert("Failed to create campaign. Please try again.");
            }
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

                <main className="flex-1 flex flex-col bg-white overflow-y-auto pb-20">

                    {/* Orange Header Container */}
                    <div
                        className="w-full flex justify-center py-4 sm:py-5 shadow-sm shrink-0"
                        style={{ backgroundColor: Colors.secondary }}
                    >
                        <h2 className="text-white font-serif font-bold text-[20px] sm:text-[24px]">
                            Review
                        </h2>
                    </div>

                    <div className="w-full max-w-[1050px] mx-auto mt-4 sm:mt-6 px-4 sm:px-6 flex flex-col md:flex-row gap-6 lg:gap-16 flex-1">

                        {/* Left Column: Vertical Stepper */}
                        <div className="hidden md:flex flex-col min-w-50 py-4 relative h-full">
                            <Stepper
                                activeStep={2}
                                className="stepper-vertical"
                                styleConfig={{
                                    activeBgColor: Colors.primary,
                                    activeTextColor: '#ffffff',
                                    inactiveBgColor: '#9ca3af',
                                    inactiveTextColor: '#ffffff',
                                    completedBgColor: Colors.primary,
                                    completedTextColor: '#ffffff',
                                    size: '2rem',
                                    circleFontSize: '14px',
                                    labelFontSize: '14px',
                                    borderRadius: '50%',
                                    fontWeight: '600'
                                }}
                                connectorStyleConfig={{
                                    activeColor: Colors.primary,
                                    completedColor: Colors.primary,
                                    disabledColor: '#d1d5db',
                                    size: 2,
                                    style: 'solid'
                                }}
                            >
                                <Step label="Fundraiser Details">
                                    <Check size={16} strokeWidth={3} />
                                </Step>
                                <Step label="Amount Details">
                                    <Check size={16} strokeWidth={3} />
                                </Step>
                                <Step label="Review">3</Step>
                            </Stepper>
                        </div>

                        {/* Right Column: Form Area */}
                        <div className="flex-1 flex flex-col w-full gap-6 sm:gap-8 min-h-fit md:min-h-[680px]">

                            {/* Fundraiser Details Box */}
                            <div>
                                <h3 className="font-bold text-[15px] sm:text-[16px] tracking-wide mb-3" style={{ color: Colors.primary }}>
                                    Fundraiser Details
                                </h3>
                                <div className="w-full border border-gray-200 rounded-[14px] p-4 sm:p-6 shadow-sm bg-white flex flex-col gap-4 sm:gap-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                        <span className="w-full sm:w-45 text-gray-400 font-medium text-[14px] sm:text-[15px] shrink-0">Fundraiser Title</span>
                                        <span className="text-black font-semibold sm:font-medium text-[14px] sm:text-[15px] wrap-break-word">{compData.title || "-"}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                        <span className="w-full sm:w-45 text-gray-400 font-medium text-[14px] sm:text-[15px] shrink-0">Choose Category</span>
                                        <span className="text-black font-semibold sm:font-medium text-[14px] sm:text-[15px] wrap-break-word">{compData.categoryName || compData.category || "-"}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                        <span className="w-full sm:w-45 text-gray-400 font-medium text-[14px] sm:text-[15px] shrink-0">Location</span>
                                        <span className="text-black font-semibold sm:font-medium text-[14px] sm:text-[15px] wrap-break-word">
                                            {compData.location || "-"} {compData.city ? `, ${compData.city}` : ""}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Amount Details Box */}
                            <div>
                                <h3 className="font-bold text-[15px] sm:text-[16px] tracking-wide mb-3" style={{ color: Colors.primary }}>
                                    Amount Details
                                </h3>
                                <div className="w-full border border-gray-200 rounded-[14px] p-4 sm:p-6 shadow-sm bg-white flex flex-col gap-4 sm:gap-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                        <span className="w-full sm:w-45 text-gray-400 font-medium text-[14px] sm:text-[15px] shrink-0">Amount</span>
                                        <span className="text-black font-semibold sm:font-medium text-[14px] sm:text-[15px] wrap-break-word">${compData.amount || "0"}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                        <span className="w-full sm:w-45 text-gray-400 font-medium text-[14px] sm:text-[15px] shrink-0">Duration Date</span>
                                        <span className="text-black font-semibold sm:font-medium text-[14px] sm:text-[15px] wrap-break-word">
                                            {compData.durationFrom && compData.durationTo
                                            ? `${compData.durationFrom} to ${compData.durationTo}`
                                            : "-"}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start pt-1 gap-2 sm:gap-4">
                                        <span className="w-full sm:w-45 text-gray-400 font-medium text-[14px] sm:text-[15px] shrink-0">Attach Image</span>
                                        <div className="flex flex-wrap items-center gap-3">
                                            {compData.images && compData.images.length > 0 ? (
                                                <>
                                                    {compData.images.slice(0, 2).map((img, idx) => (
                                                        <div key={idx} className="w-12 h-8 sm:w-15 sm:h-8.75 rounded-md overflow-hidden shadow-sm">
                                                            <img src={img} alt={`img${idx}`} className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                    {compData.images.length > 2 && (
                                                        <div className="relative w-12 h-8 sm:w-15 sm:h-8.75 rounded-md overflow-hidden shadow-sm border border-gray-200">
                                                            <img src={compData.images[2]} alt="img_more" className="w-full h-full object-cover opacity-40 blur-[1px]" />
                                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50">
                                                                <span className="text-[9px] sm:text-[10px] font-bold text-gray-700">+{compData.images.length - 2} More</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-black font-semibold sm:font-medium text-[14px] sm:text-[15px]">No images attached</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description Box */}
                            <div className="flex-1 flex flex-col mt-2 sm:mt-4">
                                <h3 className="font-bold text-[15px] sm:text-[16px] tracking-wide mb-3 flex-shrink-0" style={{ color: Colors.primary }}>
                                    Description
                                </h3>
                                <div className="w-full flex-1 border border-gray-200 rounded-[14px] p-4 sm:p-6 shadow-sm bg-white min-h-[150px] sm:min-h-[200px]">
                                    <p className="text-[13px] sm:text-[14px] text-black font-medium leading-relaxed wrap-break-word whitespace-pre-wrap">
                                        {compData.description || "No description provided."}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-10 mt-auto pt-8">
                                <Button
                                    onClick={() => Navigate('/compaign-details')}
                                    className="w-full sm:w-55 h-12 sm:h-13.75 rounded-2xl bg-white text-[16px] font-semibold hover:bg-gray-50 transition-colors shadow-none"
                                    style={{ border: `1px solid ${Colors.secondary}`, color: Colors.secondary }}
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    className="w-full sm:w-55 h-12 sm:h-13.75 rounded-2xl text-white text-[16px] font-semibold hover:opacity-90 transition-opacity shadow-sm"
                                    style={{ backgroundColor: Colors.secondary }}
                                >
                                    {Creating ? "Creating..." : "Create"}
                                </Button>
                            </div>

                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
