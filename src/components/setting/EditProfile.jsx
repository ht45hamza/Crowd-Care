import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Colors } from "@/colors";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadImageMutation,
  useGetImageQuery,
} from "@/Services/HandleAPI";
import { Pencil } from "lucide-react";
import Sidebar from "../Home/Sidebar";
import Header from "../Home/Header";
import { useNavigate } from "react-router-dom";
import { editProfileSchema } from "@/utils/validationSchemas";
import toast from "react-hot-toast";

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const hasInitialized = useRef(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    data: userprofile,
    isLoading: profileLoading,
    refetch: refetchUserProfile,
  } = useGetUserProfileQuery();

  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
  const [uploadImage, { isLoading: imageUploading }] = useUploadImageMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    aboutMe: "",
    profileImage: "",
    previewImage: "",
    rawImageFile: null,
    countryCode: "+92",
    phone: "",
    address: "",
    dob: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userprofile?.data && !hasInitialized.current) {
      const data = userprofile.data;

      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        aboutMe: data.aboutMe || "",
        profileImage: data.profileImage || "",
        previewImage: "",
        rawImageFile: null,
        countryCode: data.countryCode || "+92",
        phone: data.phone || "",
        address: data.address || "",
        dob: data.dob ? String(data.dob).split("T")[0] : "",
        gender: data.gender ? data.gender.toLowerCase() : "",
      });

      hasInitialized.current = true;
    }
  }, [userprofile]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      previewImage: previewUrl,
      rawImageFile: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      editProfileSchema.validateSync(formData, { abortEarly: false });
      setErrors({});
    } catch (validationErr) {
      const newErrors = {};
      validationErr.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    let uploadedImageName = formData.profileImage;

    try {
      if (formData.rawImageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", formData.rawImageFile);

        const uploadResponse = await uploadImage(imageFormData).unwrap();

        // Extract path from response (handling various potential structures)
        let path = "";
        let dataObj = uploadResponse?.data;
        if (Array.isArray(dataObj) && dataObj.length > 0) dataObj = dataObj[0];

        if (typeof uploadResponse?.data === "string") {
          path = uploadResponse.data;
        } else if (typeof dataObj === "string") {
          path = dataObj;
        } else {
          path =
            dataObj?.profileImage ||
            dataObj?.image ||
            dataObj?.url ||
            uploadResponse?.profileImage ||
            uploadResponse?.image ||
            uploadResponse?.url ||
            "";
        }

        if (path) {
          uploadedImageName = path; // Just store the key/path as per requirement
        } else {
          throw new Error("Could not extract image path from upload response");
        }
      }

      const payload = {
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        aboutMe: formData.aboutMe || "",
        profileImage: uploadedImageName || "",
        countryCode: formData.countryCode || "+92",
        phone: formData.phone || "",
        address: formData.address || "",
        dob: formData.dob || "",
        gender: formData.gender || "",
      };

      await updateUserProfile(payload).unwrap();

      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err?.data?.message || "Failed to update profile.");
    }
  };

  if (profileLoading) {
    return (
      <div className="p-8 text-center text-gray-500 font-medium">
        Loading Profile Data...
      </div>
    );
  }

  const profileImageKeyFromState = formData.profileImage;
  const { data: serverImageData } = useGetImageQuery(profileImageKeyFromState, {
    skip:
      !profileImageKeyFromState ||
      profileImageKeyFromState.startsWith("http") ||
      profileImageKeyFromState.startsWith("blob:") ||
      profileImageKeyFromState.startsWith("data:") ||
      profileImageKeyFromState === "null",
  });

  const resolvedProfileImage = profileImageKeyFromState?.startsWith("http") || profileImageKeyFromState?.startsWith("blob:")
    ? profileImageKeyFromState
    : serverImageData?.data || serverImageData?.url || serverImageData || "";

  const previewImageToShow = formData.previewImage || resolvedProfileImage;

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
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
          <div className="w-full max-w-[800px] mt-2 sm:mt-5">
            <div className="mb-10 text-center sm:text-left">
              <h2 className="text-[24px] sm:text-[32px] font-bold font-serif text-black mb-2">
                Edit Profile
              </h2>
              <p className="text-gray-500 font-medium">
                Update your professional and personal information below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col items-center sm:items-start mb-10">
                <label className="block text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
                  Profile Picture
                </label>

                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-50 flex items-center justify-center transition-all group-hover:shadow-lg">
                    {previewImageToShow ? (
                      <img
                        src={previewImageToShow}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-300 font-bold text-4xl">
                        {(formData.firstName?.[0] || "") +
                          (formData.lastName?.[0] || "")}
                      </span>
                    )}

                    {imageUploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-2.5 shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-all"
                    style={{ backgroundColor: Colors.primary }}
                  >
                    <Pencil size={14} strokeWidth={2.5} />
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                <p className="text-xs text-gray-400 mt-3 font-medium">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                <div>
                  <label className="block text-sm font-medium text-black mb-3">
                    First Name
                  </label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="h-16.25 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-6 text-[15px] font-medium text-black focus-visible:ring-1 focus-visible:ring-gray-300 transition-colors bg-white w-full"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1 ml-2">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-3">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="h-16.25 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-6 text-[15px] font-medium text-black focus-visible:ring-1 focus-visible:ring-gray-300 transition-colors bg-white w-full"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1 ml-2">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-3">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="h-16.25 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-6 text-[15px] font-medium text-black focus-visible:ring-1 focus-visible:ring-gray-300 transition-colors bg-white w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-3">
                    Phone Number
                  </label>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-3">
                      <div className="w-24 sm:w-28 shrink-0">
                        <Input
                          type="text"
                          name="countryCode"
                          placeholder="+92"
                          value={formData.countryCode}
                          onChange={handleChange}
                          className={`h-14 sm:h-16.25 border ${errors.countryCode ? "border-red-500" : "border-gray-100"} shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-4 text-center text-[14px] sm:text-[15px] font-medium text-black focus-visible:ring-1 focus-visible:ring-gray-300 transition-colors bg-white w-full`}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="text"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`h-14 sm:h-16.25 border ${errors.phone ? "border-red-500" : "border-gray-100"} shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-6 text-[14px] sm:text-[15px] font-medium text-black focus-visible:ring-1 focus-visible:ring-gray-300 transition-colors bg-white w-full`}
                        />
                      </div>
                    </div>
                    {errors.countryCode && (
                      <p className="text-red-500 text-xs mt-1 ml-2">{errors.countryCode}</p>
                    )}
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 ml-2">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-3">
                    About Me
                  </label>
                  <textarea
                    name="aboutMe"
                    value={formData.aboutMe}
                    onChange={handleChange}
                    className="w-full min-h-35 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-6 py-5 resize-y text-[14px] sm:text-[15px] font-medium text-black focus-visible:ring-1 focus-visible:ring-gray-300 transition-colors bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-3">
                    Location
                  </label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="h-14 sm:h-16.25 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-6 text-[14px] sm:text-[15px] font-medium text-black focus-visible:ring-1 focus-visible:ring-gray-300 transition-colors bg-white w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-3">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender?.toLowerCase() || ""}
                    onChange={handleChange}
                    className="w-full h-14 sm:h-16.25 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-2xl px-6 text-[14px] sm:text-[15px] font-medium text-black focus-visible:ring-1 focus-visible:ring-gray-300 transition-colors bg-white outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 pt-6 mt-4 w-full justify-center items-center bg-white rounded-b-3xl">
                <Button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="w-full sm:w-55 h-12 sm:h-13.75 rounded-2xl bg-white text-[16px] font-semibold hover:bg-gray-50 transition-colors shadow-none order-2 sm:order-1"
                  style={{
                    border: `1px solid ${Colors.secondary}`,
                    color: Colors.secondary,
                  }}
                >
                  Back
                </Button>

                <Button
                  type="submit"
                  disabled={isUpdating || imageUploading}
                  className="w-full sm:w-55 h-12 sm:h-13.75 rounded-2xl text-white text-[16px] font-semibold shadow-sm hover:opacity-90 transition-opacity order-1 sm:order-2"
                  style={{ backgroundColor: Colors.primary }}
                >
                  {isUpdating || imageUploading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}