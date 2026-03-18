import React, { useState } from 'react';
import { Colors } from '@/colors';
import Sidebar from '../Home/Sidebar';
import Header from '../Home/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import compaignImage from '@/assets/Compaign.png';
import { Stepper, Step } from 'react-form-stepper';
import { Check } from 'lucide-react';
import {useGetCategoryQuery } from '@/Services/HandleAPI';

export default function StartCompaign() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: categoriesData } = useGetCategoryQuery();
    const categories = categoriesData?.data || [];

    const [compData, setCompData] = useState({
        title: '',
        category: '',
        location: '',
        city: ''
    });

    const handleContinue = () => {
        if (!compData.title || !compData.category || !compData.location || !compData.city) {
            alert('Please fill out all fundraiser details.');
            return;
        }

        const selectedCategory = categories.find(cat => cat.name === compData.category);
        
        if (!selectedCategory || !selectedCategory._id) {
            alert('Category ID not found. Please try re-selecting the category.');
            return;
        }

        // Passing the data to the next step
        navigate('/compaign-details', { 
            state: { 
                ...compData, 
                categoryName: selectedCategory.name,
                categoryId: selectedCategory._id,
                categoryLogo: selectedCategory.logo || ''
            } 
        });
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

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

                <main className="flex-1 flex flex-col bg-white overflow-y-auto pb-20">

                    {/* Orange Header Container */}
                    <div
                        className="w-full flex justify-center py-4 sm:py-5 shadow-sm shrink-0"
                        style={{ backgroundColor: Colors.secondary }}
                    >
                        <h2 className="text-white font-serif font-bold text-[20px] sm:text-[24px]">
                            Fundraiser Details
                        </h2>
                    </div>

                    <div className="w-full max-w-262.5 mx-auto mt-4 sm:mt-6 px-4 sm:px-6 flex flex-col md:flex-row gap-6 lg:gap-16 flex-1">

                        {/* Left Column: Vertical Stepper */}
                        <div className="hidden md:flex flex-col min-w-50 py-4 relative h-full">
                            <Stepper
                                activeStep={0}
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
                                <Step label="Fundraiser Details">1</Step>
                                <Step label="Amount Details">2</Step>
                                <Step label="Review">3</Step>
                            </Stepper>
                        </div>

                        {/* Right Column: Form Area */}
                        <div className="flex-1 flex flex-col w-full min-h-fit md:min-h-170">

                            {/* Image Banner */}
                            <div className="w-full h-40 sm:h-55 rounded-2xl overflow-hidden relative mb-6 sm:mb-10 shadow-sm border border-gray-100 shrink-0">
                                <img
                                    src={compaignImage}
                                    alt="Give Hope"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0" style={{ backgroundColor: `${Colors.primary}B3` }}></div>
                                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10">
                                    <p className="font-semibold text-[13px] sm:text-[15px] mb-0.5" style={{ color: Colors.secondary }}>
                                        Empower Change
                                    </p>
                                    <h3 className="text-white font-serif font-bold text-[20px] sm:text-[28px] leading-tight">
                                        Contribute to Our Cause Today
                                    </h3>
                                </div>
                            </div>

                            {/* Input Fields */}
                            <div className="flex flex-col gap-4 sm:gap-6 flex-1">
                                <Input
                                    placeholder="Enter Title"
                                    value={compData.title}
                                    onChange={(e) => setCompData({ ...compData, title: e.target.value })}
                                    className="h-14 sm:h-16.25 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-6 text-[15px] font-medium text-black placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 transition-colors bg-white w-full"
                                />

                                <div className="relative w-full">
                                    <select
                                        value={compData.category}
                                        onChange={(e) => setCompData({ ...compData, category: e.target.value })}
                                        className="h-14 sm:h-16.25 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-6 pr-16 text-[15px] font-medium text-[black] focus-visible:ring-1 focus-visible:ring-gray-300 transition-colors bg-white w-full appearance-none outline-none"
                                    >
                                        <option value="" disabled className="text-gray-300">Choose Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id || cat.id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    
                                    {/* Display selected category logo */}
                                    {compData.category && categories.find(c => c.name === compData.category)?.logo && (
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <img 
                                                src={categories.find(c => c.name === compData.category).logo} 
                                                alt="" 
                                                className="w-8 h-8 rounded-md object-contain"
                                            />
                                        </div>
                                    )}
                                    
                                    {/* Custom Dropdown Arrow (if no logo) */}
                                    {!categories.find(c => c.name === compData.category)?.logo && (
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            ▼
                                        </div>
                                    )}
                                </div>

                                <Input
                                    placeholder="Enter Location"
                                    value={compData.location}
                                    onChange={(e) => setCompData({ ...compData, location: e.target.value })}
                                    className="h-14 sm:h-16.25 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-6 text-[15px] font-medium text-black placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 transition-colors bg-white w-full"
                                />

                                <Input
                                    placeholder="City"
                                    value={compData.city}
                                    onChange={(e) => setCompData({ ...compData, city: e.target.value })}
                                    className="h-14 sm:h-16.25 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-6 text-[15px] font-medium text-black placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 transition-colors bg-white w-full"
                                />

                                {/* Action Buttons */}
                                <div className="flex justify-center sm:justify-end mt-auto pt-8">
                                    <Button
                                        onClick={handleContinue}
                                        className="w-full sm:w-auto h-12 sm:h-14 px-14 rounded-2xl text-white text-[16px] font-semibold hover:opacity-90 transition-opacity"
                                        style={{ backgroundColor: Colors.secondary }}
                                    >
                                        Continue
                                    </Button>
                                </div>
                            </div>

                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
