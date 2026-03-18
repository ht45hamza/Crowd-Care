import React from "react";
import { useGetImageQuery } from "@/Services/HandleAPI";

const CampaignImage = ({ imageKey, alt, fallbackImage, className }) => {
  const isLocalAsset = typeof imageKey === "string" && (imageKey.startsWith("/src") || imageKey.startsWith("@/"));
  const isUrl =
    typeof imageKey === "string" &&
    (imageKey.startsWith("http") || imageKey.startsWith("blob:") || imageKey.startsWith("data:") || isLocalAsset);

  const { data: imageData, isLoading } = useGetImageQuery(imageKey, {
    skip: !imageKey || isUrl || imageKey === "null" || typeof imageKey !== "string",
  });

  const displayImage = isUrl
    ? imageKey
    : (typeof imageData === 'string' ? imageData : (imageData?.data || imageData?.url || imageData?.image || "")) || fallbackImage;

  return (
    <div className={`relative ${className}`}>
      {displayImage ? (
        <img
          src={displayImage}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            if (fallbackImage) e.target.src = fallbackImage;
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
            {isLoading ? (
               <div className="relative flex items-center justify-center">
                   <div className="w-10 h-10 border-4 border-[#1a391e]/10 border-t-[#1a391e] rounded-full animate-spin"></div>
                   <div className="absolute inset-0 w-10 h-10 border-4 border-transparent border-b-[#1a391e]/40 rounded-full animate-spin [animation-duration:1.5s]"></div>
               </div>
            ) : (
                <img src={fallbackImage} alt={alt} className="w-full h-full object-cover opacity-60" />
            )}
        </div>
      )}
    </div>
  );
};

export default CampaignImage;
