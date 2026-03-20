import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import bgImage from "../../assets/startingimage.jpeg";
import logoImage from "../../assets/Logo.png";
import { Colors } from '@/colors';
import { useLoginMutation } from '@/Services/HandleAPI';
import { Navigate, useNavigate } from 'react-router-dom';
import { loginSchema } from '@/utils/validationSchemas';

export default function LoginScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const [isHoverBtn, setIsHoverBtn] = useState(false);
    const [isHoverLink, setIsHoverLink] = useState(false);
    const [isHoverForgot, setIsHoverForgot] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const [errors, setErrors] = useState({});

    const Navigate = useNavigate();

    const [login, { isLoading, error: apiError }] = useLoginMutation();
    // const [forgot, { isLoading: isLoadingForgot, error: forgotError }] = useForgotPasswordMutation();
    const [apiErrorState, setApiErrorState] = useState("");

    // Sync mutation error to local state
    React.useEffect(() => {
        if (apiError) {
            setApiErrorState(apiError?.data?.message || apiError?.error || "Login failed");
        }
    }, [apiError]);

    const validateForm = () => {
        try {
            loginSchema.validateSync({ email, password }, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err) {
            const newErrors = {};
            err.inner.forEach((e) => {
                if (!newErrors[e.path]) newErrors[e.path] = e.message;
            });
            setErrors(newErrors);
            return false;
        }
    };
    {
    // const handleforgot = async () => {
        // if (!email.trim() || !email.includes("@")) {
        //     setErrors({ ...errors, email: "Please enter a valid email to reset password" });
        //     return;
        // }

        // try {
        //     setApiErrorState("");
        //     const payload = {
        //         email: email.trim().toLowerCase()
        //     }
        //     await forgot(payload).unwrap();
        //     console.log("Forgot password OTP sent");
        //     Navigate("/ForgotPassword", { state: { email: email.trim().toLowerCase() } });
        // } catch (err) {
        //     console.log("Forgot password error:", err);
        //     setApiErrorState(err?.data?.message || "Failed to trigger password reset");
        // }
    }

    const HandleSubmit = async (e) => {
        e.preventDefault();
        setApiErrorState(""); 
        console.log("Login clicked")
        const success = validateForm()
        if (!success) {
            console.log("Verfication Failed")
            return
        }
        const payload = {
            email: email.trim().toLowerCase(),
            password: password,
            loginType: "email"
        }

        try {
            const res = await login(payload).unwrap();
            console.log("🎉 Login Success:", res);

            const token = res?.token || res?.access_token || res?.data?.token || res?.data?.access_token;

            if (token) {
                localStorage.setItem("token", token);
                console.log(token)
                Navigate("/home");
            } else {
                console.log("Token not found in response");
            }

        } catch (err) {
            console.log("🔥 Login Error (Caught in Catch):", err);
        }
    }

    const GotoSignup = () => {
        Navigate("/signup");
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
            <div className="relative z-10 w-full max-w-150 min-h-fit bg-white rounded-xl shadow-2xl p-6 sm:p-12 flex flex-col justify-center items-center ml-0 lg:ml-[2%] my-8 sm:my-0">

                {/* Logo  */}
                <div className="mb-6 sm:mb-10">
                    <img src={logoImage} alt="CrowdCareAid Logo" className="h-12.5 sm:h-15 object-contain" />
                </div>

                {/* Heading */}
                <h2 className="text-[24px] sm:text-[32px] font-bold font-serif mb-6 sm:mb-10 tracking-wide text-center" style={{ color: Colors.textMain }}>
                    Welcome Back
                </h2>

                {/* Form fields */}
                <form className="w-full space-y-4 sm:space-y-6" onSubmit={HandleSubmit}>
                    <Input
                        type="email"
                        placeholder="Enter Email Address"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setApiErrorState(""); // Clear API error on change
                        }}
                        className="border-gray-200 focus-visible:ring-1 focus-visible:ring-green-700 h-14 sm:h-16 rounded-lg px-4 text-[16px]"
                        style={{ backgroundColor: Colors.inputBg }}
                    />
                    {errors.email && (
                        <span className="text-red-600 text-sm">{errors.email}</span>
                    )}

                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                                setpassword(e.target.value);
                                setApiErrorState(""); // Clear API error on change
                            }}
                            placeholder="Enter Password"
                            className="border-gray-200 focus-visible:ring-1 focus-visible:ring-green-700 h-14 sm:h-16 rounded-lg px-4 pr-12 text-[16px]"
                            style={{ backgroundColor: Colors.inputBg }}
                        />
                        {errors.password && (
                            <span className="text-red-600 text-sm">{errors.password}</span>
                        )}

                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                            {showPassword ? <EyeOff strokeWidth={1.5} size={22} /> : <Eye strokeWidth={1.5} size={22} />}
                        </button>
                    </div>

                    <div className="flex justify-end w-full">
                        <button
                            type="button"
                            className={`text-[14px] sm:text-[15px] font-semibold transition-colors mt-0 $`}
                            style={{ color: isHoverForgot ? Colors.linkHover : Colors.link }}
                            onMouseEnter={() => setIsHoverForgot(true)}
                            onMouseLeave={() => setIsHoverForgot(false)}
                            onClick={()=>Navigate("/ForgotPassword")}
                            
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {apiErrorState && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg animate-in fade-in duration-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                            <p className="text-red-600 text-sm font-medium leading-none">
                                {apiErrorState}
                            </p>
                        </div>
                    )}

                    <Button
                        className="w-full h-14 sm:h-16 mt-6 sm:mt-8 text-white rounded-lg text-lg sm:text-xl font-medium shadow-none transition-colors"
                        style={{ backgroundColor: isHoverBtn ? Colors.primaryHover : Colors.primary }}
                        onMouseEnter={() => setIsHoverBtn(true)}
                        onMouseLeave={() => setIsHoverBtn(false)}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Log in"}
                    </Button>
                </form>

                {/* OR Divider */}
                <div className="w-full flex items-center mt-8 mb-6">
                    <div className="flex-1 h-0.5 bg-gray-200"></div>
                    <span className="px-4 text-xs font-semibold text-gray-400">OR</span>
                    <div className="flex-1 h-0.5 bg-gray-200"></div>
                </div>

                {/* Social Buttons */}
                <div className="flex gap-4 mb-8">
                    <button type="button" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22px" height="22px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
                    </button>
                    <button type="button" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22px" height="22px" fill="#1877F2"><path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.96 3.63 9.07 8.4 9.84v-6.96h-2.53v-2.88h2.53V9.66c0-2.5 1.5-3.88 3.77-3.88 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.88h-2.34v6.96c4.77-.77 8.4-4.88 8.4-9.84 0-5.5-4.46-9.96-9.96-9.96z" /></svg>
                    </button>
                </div>

                {/* Footer Link */}
                <p className="text-sm text-gray-500 font-medium">
                    Don't have account ? <a
                        href="#"
                        className="font-semibold tracking-wide ml-1 transition-colors"
                        style={{ color: isHoverLink ? Colors.linkHover : Colors.link }}
                        onMouseEnter={() => setIsHoverLink(true)}
                        onMouseLeave={() => setIsHoverLink(false)}
                        onClick={GotoSignup}
                    >Signup</a>
                </p>
            </div>
        </div>
    );
}
