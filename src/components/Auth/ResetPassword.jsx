import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import bgImage from "../../assets/startingimage.jpeg";
import logoImage from "../../assets/Logo.png";
import { Colors } from "@/colors";
import { useNavigate, useLocation } from "react-router-dom";
import { useResetPasswordMutation } from "@/Services/HandleAPI";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isHoverBtn, setIsHoverBtn] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const [resetPassword, { isLoading: Changing }] = useResetPasswordMutation();


  const email = location.state?.email;


  const passwordChange = async () => {
    try {
      setError("");

      if (!newPassword || !confirmPassword) {
        setError("Please fill all fields.");
        return;
      }

      if (newPassword.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return
      }

      const payload = {
        email,
        newPassword: newPassword,
      };

      const res = await resetPassword(payload).unwrap();
      console.log("Password reset success:", res);

      navigate("/popup");
    } catch (err) {
      console.log("Reset password error:", err);
      setError(err?.data?.message || "Something went wrong while changing password.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center p-4 sm:p-8">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 opacity-70 mix-blend-multiply"
          style={{ backgroundColor: Colors.primary }}
        ></div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[600px] min-h-fit bg-white rounded-xl shadow-2xl p-6 sm:p-12 flex flex-col justify-center items-center ml-0 lg:ml-[2%] my-8 sm:my-0">
        {/* Logo */}
        <div className="mb-6 sm:mb-8 mt-2">
          <img
            src={logoImage}
            alt="CrowdCareAid Logo"
            className="h-[50px] sm:h-[60px] object-contain"
          />
        </div>

        {/* Heading */}
        <h2
          className="text-[24px] sm:text-[32px] font-bold font-serif mb-4 sm:mb-6 tracking-wide text-center"
          style={{ color: Colors.textMain }}
        >
          Reset Password
        </h2>

        {/* Subtext */}
        <p className="text-[#858585] text-sm sm:text-base mb-8 sm:mb-10 text-center max-w-[420px] leading-relaxed">
          To change your account password,
          <br />
          please fill in the fields below.
        </p>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg animate-in fade-in duration-300 mb-6 w-full max-w-[400px]">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
             <p className="text-red-600 text-sm font-medium leading-none">
                 {error}
             </p>
          </div>
        )}

        {/* Form fields */}
        <form
          className="w-full flex flex-col flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            passwordChange();
          }}
        >
          <div className="space-y-4 sm:space-y-6 w-full">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                className="border-gray-200 focus-visible:ring-1 focus-visible:ring-orange-500 h-14 sm:h-16 rounded-lg px-4 pr-12 bg-white text-black placeholder:text-gray-400 font-medium text-[16px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff strokeWidth={1.5} size={22} />
                ) : (
                  <Eye strokeWidth={1.5} size={22} />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                className="border-gray-200 focus-visible:ring-1 focus-visible:ring-orange-500 h-14 sm:h-16 rounded-lg px-4 pr-12 bg-white text-black placeholder:text-gray-400 font-medium text-[16px]"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff strokeWidth={1.5} size={22} />
                ) : (
                  <Eye strokeWidth={1.5} size={22} />
                )}
              </button>
            </div>
          </div>

          <div className="mt-8 sm:mt-16 w-full pb-4">
            <Button
              type="submit"
              disabled={Changing}
              className="w-full h-14 sm:h-16 text-white rounded-lg text-lg sm:text-xl font-medium shadow-none transition-colors disabled:opacity-60"
              style={{
                backgroundColor: isHoverBtn
                  ? Colors.secondaryHover
                  : Colors.secondary,
              }}
              onMouseEnter={() => setIsHoverBtn(true)}
              onMouseLeave={() => setIsHoverBtn(false)}
            >
              {Changing ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}