import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import bgImage from "../../assets/startingimage.jpeg";
import logoImage from "../../assets/Logo.png";
import otpImage from "../../assets/2wayauthenticationlogo.png";
import { Colors } from '@/colors';
import { OTPInput } from 'input-otp';
import { useVerifyOtpMutation, useResendOtpMutation } from '@/Services/HandleAPI';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OTPverification() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const flow = location.state?.flow;

    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timer, setTimer] = useState(60);
    const [isHoverResend, setIsHoverResend] = useState(false);

    const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
    const [resendOtp, { isLoading: resending }] = useResendOtpMutation();

    const otpString = otp.join("");
    const canResend = timer === 0;

    useEffect(() => {
        if (!email) {
            navigate("/");
        }
    }, [email, navigate]);

    useEffect(() => {
        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
    };

    const resetTimer = () => {
        setTimer(60);
    };

    const handleResend = async () => {
        try {
            await resendOtp({ email }).unwrap();
            alert("OTP Resent Successfully ✅");
            resetTimer();
        } catch (err) {
            alert(err?.data?.message || "Failed to resend OTP");
        }
    };

    const handleOtp = async () => {
        if (otpString.length !== 4) {
            alert("Enter Valid OTP");
            return;
        }

        try {
            await verifyOtp({ email, otp: otpString }).unwrap();

            alert("OTP Verified ✅");

            if (flow === "forgot-password") {
                navigate("/reset", { state: { email } });
            } else {
                navigate("/login");
            }
        } catch (err) {
            alert(err?.data?.message || "OTP verification failed");
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center p-4 sm:p-8">
            <div className="absolute inset-0 z-0">
                <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
                <div
                    className="absolute inset-0 opacity-70 mix-blend-multiply"
                    style={{ backgroundColor: Colors.primary }}
                />
            </div>

            <div className="relative z-10 w-full max-w-[600px] min-h-fit bg-white rounded-xl shadow-2xl p-6 sm:p-12 flex flex-col justify-center items-center ml-0 lg:ml-[2%] my-8 sm:my-0">
                <div className="mb-6 sm:mb-8 mt-2">
                    <img src={logoImage} alt="CrowdCareAid Logo" className="h-[50px] sm:h-[60px] object-contain" />
                </div>

                <h2
                    className="text-[24px] sm:text-[32px] font-bold font-serif mb-4 tracking-wide text-center"
                    style={{ color: Colors.textMain }}
                >
                    OTP Verification
                </h2>

                <p className="text-[#858585] text-sm sm:text-base mb-6 sm:mb-8 text-center max-w-xs sm:max-w-md">
                    OTP sent to {email}
                </p>

                <div className="mb-6 sm:mb-8 flex justify-center w-full">
                    <img
                        src={otpImage}
                        alt="Two Way Authentication"
                        className="w-[120px] sm:w-[180px] border-none object-contain"
                    />
                </div>

                <div className="flex justify-center w-full mt-2 mb-6 sm:mb-8">
                    <OTPInput
                        maxLength={4}
                        containerClassName="group flex items-center has-[:disabled]:opacity-30"
                        value={otpString}
                        onChange={(value) => {
                            const newOtp = value.split("").slice(0, 4);
                            while (newOtp.length < 4) newOtp.push("");
                            setOtp(newOtp);
                        }}
                        render={({ slots }) => (
                            <>
                                <div className="flex gap-2 sm:gap-4">
                                    {slots.slice(0, 2).map((slot, idx) => (
                                        <Slot key={idx} {...slot} />
                                    ))}
                                </div>

                                <FakeDash />

                                <div className="flex gap-2 sm:gap-4">
                                    {slots.slice(2).map((slot, idx) => (
                                        <Slot key={idx} {...slot} />
                                    ))}
                                </div>
                            </>
                        )}
                    />
                </div>

                <div className="flex flex-col items-center justify-center mb-6 sm:mb-10 h-auto sm:h-[30px]">
                    {!canResend ? (
                        <p className="text-[14px] sm:text-[15px] text-[#858585] font-medium text-center">
                            Didn't receive the OTP?
                            <span
                                style={{ color: Colors.link }}
                                className="font-semibold ml-1"
                            >
                                {formatTime(timer)}
                            </span>
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending}
                            className="text-[14px] sm:text-[15px] font-semibold transition-colors"
                            style={{ color: isHoverResend ? Colors.linkHover : Colors.link }}
                            onMouseEnter={() => setIsHoverResend(true)}
                            onMouseLeave={() => setIsHoverResend(false)}
                        >
                            {resending ? "Sending..." : "Resend OTP"}
                        </button>
                    )}
                </div>

                <Button
                    className="w-full h-14 sm:h-16 text-white rounded-xl text-lg sm:text-xl font-medium shadow-none transition-colors"
                    style={{ backgroundColor: Colors.primary }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = Colors.primaryHover)}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = Colors.primary)}
                    onClick={handleOtp}
                    disabled={verifying}
                >
                    {verifying ? "Verifying..." : "Verify OTP"}
                </Button>
            </div>
        </div>
    );
}

function Slot(props) {
    return (
        <div
            className={`relative w-16 h-16 sm:w-20 sm:h-20 text-2xl font-semibold rounded-xl
            flex items-center justify-center
            transition-all duration-300
            border border-gray-200 shadow-sm
            group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20
            ${props.isActive ? 'ring-1 ring-green-700' : ''}`}
            style={{ backgroundColor: Colors.inputBg }}
        >
            <div className="group-has-[input[data-input-otp-placeholder-shown]]:opacity-20">
                {props.char ?? props.placeholderChar}
            </div>
            {props.hasFakeCaret && <FakeCaret />}
        </div>
    );
}

function FakeCaret() {
    return (
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
            <div className="w-px h-8 bg-black dark:bg-white" />
        </div>
    );
}

function FakeDash() {
    return (
        <div className="flex w-6 sm:w-10 justify-center items-center">
            <div className="w-3 h-1 rounded-full bg-border" />
        </div>
    );
}