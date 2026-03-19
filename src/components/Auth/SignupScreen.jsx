import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import bgImage from "../../assets/startingimage.jpeg";
import logoImage from "../../assets/Logo.png";
import { Colors } from "@/colors";
import { useSignupMutation } from "@/Services/HandleAPI";
import { useNavigate } from "react-router-dom";


export default function SignupScreen() {
  // Form states
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isHoverBtn, setIsHoverBtn] = useState(false);
  const [isHoverLink, setIsHoverLink] = useState(false);

  // Field errors
  const [errors, setErrors] = useState({});
  const Navigate = useNavigate();

  // RTK Query mutation
  const [signup, { isLoading, isSuccess, isError, data, error: apiError }] =
    useSignupMutation();

  const [apiErrorState, setApiErrorState] = useState("");

  // Sync mutation error to local state
  useEffect(() => {
    if (apiError) {
      setApiErrorState(apiError?.data?.message || apiError?.error || "Signup failed");
    }
  }, [apiError]);

  // ✅ Console logs for API status
  useEffect(() => {
    if (isLoading) {
      console.log("🚀 API Request Started...");
    }

    if (isSuccess) {
      console.log("✅ API Request Successful");
      console.log("Response Data:", data);
    }

    if (isError) {
      console.log("❌ API Request Failed");
      console.log("Error Object:", apiError);
    }
  }, [isLoading, isSuccess, isError, data, apiError]);

  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!secondName.trim()) newErrors.secondName = "Second name is required";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!email.includes("@")) newErrors.email = "Incorrect email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setApiErrorState(""); // Clear API error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErrorState(""); // Clear previous errors
    console.log("📩 Submit Clicked");

    // NOTE: validateForm sets errors async. For logging, log after validateForm returns.
    const ok = validateForm();
    if (!ok) {
      console.log("⚠️ Validation Failed");
      return;
    }

    // Prepare payload (match backend keys)
    const payload = {
      firstName: firstName.trim(),
      lastName: secondName.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    console.log("📦 Payload Sending:", payload);

    try {
      const res = await signup(payload).unwrap();
      console.log("🎉 Signup Success (Unwrapped Response):", res);
      Navigate("/otp", { state: { email, flow: "signup" } });
    } catch (err) {
      console.log("🔥 Signup Error (Caught in Catch):", err);
    }
  };
  const GotoLogin = () => {
    Navigate("/");
  }

  return (
    <div className="relative min-h-screen w-full flex items-center p-4 sm:p-8">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 opacity-70 mix-blend-multiply"
          style={{ backgroundColor: Colors.primary }}
        />
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-150 min-h-fit bg-white rounded-xl shadow-2xl p-6 sm:p-12 flex flex-col justify-center items-center ml-0 lg:ml-[2%] my-8 sm:my-0"
      >
        {/* Logo */}
        <div className="mb-4 sm:mb-8">
          <img src={logoImage} alt="Logo" className="h-10 sm:h-14 object-contain" />
        </div>

        <h2
          className="text-xl sm:text-2xl font-bold font-serif mb-6 sm:mb-8 tracking-wide text-center"
          style={{ color: Colors.textMain }}
        >
          Create your Account
        </h2>

        {/* Form */}
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          {/* Names */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full">
              <Input
                type="text"
                placeholder="First Name"
                className="border-gray-200 focus-visible:ring-1 focus-visible:ring-green-700 h-14 rounded-lg px-4"
                value={firstName}
                onChange={handleInputChange(setFirstName)}
                style={{ backgroundColor: Colors.inputBg }}
              />
              {errors.firstName && (
                <span className="text-red-600 text-sm">
                  {errors.firstName}
                </span>
              )}
            </div>

            <div className="w-full">
              <Input
                type="text"
                placeholder="Second Name"
                className="border-gray-200 focus-visible:ring-1 focus-visible:ring-green-700 h-14 rounded-lg px-4"
                value={secondName}
                onChange={handleInputChange(setSecondName)}
                style={{ backgroundColor: Colors.inputBg }}
              />
              {errors.secondName && (
                <span className="text-red-600 text-sm">
                  {errors.secondName}
                </span>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <Input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={handleInputChange(setEmail)}
              className="border-gray-200 focus-visible:ring-1 focus-visible:ring-green-700 h-14 rounded-lg px-4"
              style={{ backgroundColor: Colors.inputBg }}
            />
            {errors.email && (
              <span className="text-red-600 text-sm">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={handleInputChange(setPassword)}
                className="border-gray-200 focus-visible:ring-1 focus-visible:ring-green-700 h-14 rounded-lg px-4 pr-12"
                style={{ backgroundColor: Colors.inputBg }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff strokeWidth={1.5} size={20} />
                ) : (
                  <Eye strokeWidth={1.5} size={20} />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-600 text-sm">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleInputChange(setConfirmPassword)}
                className="border-gray-200 focus-visible:ring-1 focus-visible:ring-green-700 h-14 rounded-lg px-4 pr-12"
                style={{ backgroundColor: Colors.inputBg }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff strokeWidth={1.5} size={20} />
                ) : (
                  <Eye strokeWidth={1.5} size={20} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-red-600 text-sm">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* API Error UI */}
          {apiErrorState && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg animate-in fade-in duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
              <p className="text-red-600 text-sm font-medium leading-none">
                {apiErrorState}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 mt-4 text-white rounded-lg text-lg font-medium shadow-none transition-colors"
            style={{
              backgroundColor: isHoverBtn ? Colors.primaryHover : Colors.primary,
            }}
            onMouseEnter={() => setIsHoverBtn(true)}
            onMouseLeave={() => setIsHoverBtn(false)}
          >
            {isLoading ? "Signing up..." : "Signup"}
          </Button>

          {/* Success UI */}
          {isSuccess && (
            <div className="flex items-center gap-2 justify-center">
              <p className="text-green-700 text-sm font-medium">
                Account created successfully ✅
              </p>
            </div>
          )}
        </form>

        {/* Login Link */}
        <p className="text-sm text-gray-500 font-medium mt-6">
          Already have account ?{" "}
          <a
            href="#"
            className="font-semibold tracking-wide ml-1 transition-colors"
            style={{ color: isHoverLink ? Colors.linkHover : Colors.link }}
            onMouseEnter={() => setIsHoverLink(true)}
            onMouseLeave={() => setIsHoverLink(false)}
            onClick={GotoLogin}
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}