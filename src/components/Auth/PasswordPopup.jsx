import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import bgImage from "../../assets/startingimage.jpeg";
import logoImage from "../../assets/Logo.png";
import { Colors } from '@/colors';
import { useNavigate } from 'react-router-dom';


export function PasswordPopupComponent({ onClose }) {
    const [isHoverBtn, setIsHoverBtn] = useState(false);
    const Navigate = useNavigate();

    const success = () => {
        Navigate("/login")
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            ></div>


            <div className="relative z-10 w-full max-w-[600px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col items-center pb-12 mt-[-5%] sm:mt-0">


                <div className="w-full flex justify-center py-8 bg-white">
                    <img src={logoImage} alt="CrowdCareAid Logo" className="h-[60px] object-contain" />
                </div>


                <div
                    className="w-full py-5 text-center text-white text-xl font-medium tracking-wide"
                    style={{ backgroundColor: Colors.primary }}
                >
                    Password Change
                </div>


                <p className="text-[#333] text-[18px] font-medium my-12 text-center">
                    Password Changed Successfully
                </p>


                <Button
                    className="w-[220px] h-14 text-white rounded-lg text-lg font-medium shadow-none transition-colors"
                    style={{ backgroundColor: isHoverBtn ? Colors.primaryHover : Colors.primary }}
                    onMouseEnter={() => setIsHoverBtn(true)}
                    onMouseLeave={() => setIsHoverBtn(false)}
                    onClick={success}
                >
                    Okay
                </Button>
            </div>
        </div>
    );
}


export default function PasswordPopup() {
    const [showPopup, setShowPopup] = useState(true);

    return (
        <div className="relative min-h-screen w-full flex items-center p-4 sm:p-8 overflow-hidden">


            <div className="absolute inset-0 z-0">
                <img src={bgImage} alt="Background" className="w-full h-full object-cover" />

                <div
                    className="absolute inset-0 opacity-70 mix-blend-multiply"
                    style={{ backgroundColor: Colors.primary }}
                ></div>
            </div>


            <div
                className="relative z-10 w-full max-w-[600px] h-[750px] bg-white rounded-xl shadow-2xl p-8 sm:p-12 flex flex-col items-center ml-0 lg:ml-[2%] opacity-20 pointer-events-none"
            >
                <div className="mb-8 mt-2">
                    <img src={logoImage} alt="CrowdCareAid Logo" className="h-[60px] object-contain" />
                </div>
                <h2 className="text-[32px] font-bold font-serif mb-6 tracking-wide text-center" style={{ color: Colors.textMain }}>
                    Change Password
                </h2>
            </div>


            {showPopup && (
                <PasswordPopupComponent onClose={() => setShowPopup(false)} />
            )}

        </div>
    );
}

