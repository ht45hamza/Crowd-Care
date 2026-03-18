import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import bgImage from "../../assets/startingimage.jpeg";
import logoImage from "../../assets/Logo.png";
import { Colors } from '@/colors';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResendOtpMutation } from '@/Services/HandleAPI';

export default function ForgotPassword() {
    const [resendOtp, { isLoading: Sending }] = useResendOtpMutation();
    const [isHoverBtn, setIsHoverBtn] = useState(false);
    const location = useLocation();
    const Navigate = useNavigate();

    const email = location.state?.email
    const HandleRequest = async () => {
        const res = await resendOtp({ email }).unwrap()
        Navigate("/otp", { state: { email, flow: "forgot-password" } })
        console.log(res)
    }
    return (
        <div className="relative min-h-screen w-full flex items-center p-4 sm:p-8">

            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
                {/* Green Filter Overlay */}
                <div
                    className="absolute inset-0 opacity-70 mix-blend-multiply"
                    style={{ backgroundColor: Colors.primary }}
                ></div>
            </div>

            {/* Card */}
            <div
                className="relative z-10 w-full max-w-[600px] min-h-fit bg-white rounded-xl shadow-2xl p-6 sm:p-12 flex flex-col justify-center items-center ml-0 lg:ml-[2%] my-8 sm:my-0"
            >

                {/* Logo  */}
                <div className="mb-6 sm:mb-8 mt-2">
                    <img src={logoImage} alt="CrowdCareAid Logo" className="h-[50px] sm:h-[60px] object-contain" />
                </div>

                {/* Heading */}
                <h2 className="text-[24px] sm:text-[32px] font-bold font-serif mb-4 sm:mb-6 tracking-wide text-center" style={{ color: Colors.textMain }}>
                    Reset password
                </h2>

                {/* Subtext */}
                <p className="text-[#858585] text-sm sm:text-base mb-8 sm:mb-10 text-center max-w-[420px] leading-relaxed">
                    Please enter your Email address that you used to register with us.
                </p>

                {/* Form fields */}
                <form className="w-full space-y-6 sm:space-y-8 mb-4">
                    <Input
                        type="email"
                        placeholder={email}
                        className="border-gray-200 focus-visible:ring-1 focus-visible:ring-orange-500 h-14 sm:h-16 rounded-lg px-4 bg-white text-black placeholder:text-black font-medium text-[16px]"
                    />

                    <Button
                        type="button"
                        className="w-full h-14 sm:h-16 text-white rounded-lg text-lg sm:text-xl font-medium shadow-none transition-colors"
                        style={{ backgroundColor: isHoverBtn ? Colors.secondaryHover : Colors.secondary }}
                        onMouseEnter={() => setIsHoverBtn(true)}
                        onMouseLeave={() => setIsHoverBtn(false)}
                        onClick={HandleRequest}
                    >
                        Send Email
                    </Button>
                </form>

            </div>
        </div>
    );
}
