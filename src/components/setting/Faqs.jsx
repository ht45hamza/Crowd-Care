import React, { useState } from "react";
import { Colors } from "@/colors";
import Sidebar from "../Home/Sidebar";
import Header from "../Home/Header";
import { Plus, Minus } from "lucide-react";

export default function Faqs() {
    const [openIndex, setOpenIndex] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    const faqData = [
        {
            question: "What does lorem means",
            answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
        {
            question: "Whare can i subscribe to your newsletter?",
            answer: "You can subscribe by entering your email at the bottom of our home page. We will send you updates on new features and announcements."
        },
        {
            question: "Whare can i subscribe to your newsletter?",
            answer: "You can subscribe by entering your email at the bottom of our home page. We will send you updates on new features and announcements."
        },
        {
            question: "Whare can i subscribe to your newsletter?",
            answer: "You can subscribe by entering your email at the bottom of our home page. We will send you updates on new features and announcements."
        }
    ];

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

                        <h2 className="text-[22px] sm:text-[32px] font-bold font-serif mb-6 sm:mb-10 text-left" style={{ color: Colors.primary }}>
                            FAQ's
                        </h2>

                        <div className="flex flex-col gap-6">
                            {faqData.map((faq, index) => {
                                const isOpen = openIndex === index;

                                return (
                                    <div
                                        key={index}
                                        className="bg-white border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden transition-all duration-300"
                                    >
                                        <button
                                            onClick={() => toggleFaq(index)}
                                            className="w-full flex justify-between items-center p-4 sm:p-6 bg-white hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <span className="font-bold text-[14px] sm:text-[16px] pr-4 sm:pr-8 font-serif leading-tight" style={{ color: Colors.primary }}>
                                                {faq.question}
                                            </span>

                                            <span
                                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300"
                                                style={{ backgroundColor: Colors.primary, color: 'white' }}
                                            >
                                                {isOpen ? <Minus size={16} sm:size={18} strokeWidth={2.5} /> : <Plus size={16} sm:size={18} strokeWidth={2.5} />}
                                            </span>
                                        </button>

                                        
                                        <div
                                            className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                                        >
                                            <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-1 sm:pt-2 text-[13px] sm:text-[14px] leading-relaxed text-[#333333] whitespace-pre-line font-medium">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
