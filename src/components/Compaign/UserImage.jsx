import React from "react";
import { useGetImageQuery } from "@/Services/HandleAPI";

// const UserImage = ({ imageKey, firstName, lastName, className }) => {
//   const isLocalAsset = typeof imageKey === "string" && (imageKey.startsWith("/src") || imageKey.startsWith("@/"));
//   const isUrl =
//     typeof imageKey === "string" &&
//     (imageKey.startsWith("http") || imageKey.startsWith("blob:") || imageKey.startsWith("data:") || isLocalAsset);

//   const { data: imageData, isLoading } = useGetImageQuery(imageKey, {
//     skip: !imageKey || isUrl || imageKey === "null" || typeof imageKey !== "string",
//   });

//   const displayImage = isUrl
//     ? imageKey
//     : (typeof imageData === 'string' ? imageData : (imageData?.data || imageData?.url || imageData?.image || "")) || "";

//   const initials = (firstName?.[0] || "") + (lastName?.[0] || "");

//   return (
//     <div className={`relative flex items-center justify-center bg-gray-200 overflow-hidden ${className}`}>
//       {displayImage ? (
//         <img
//           src={displayImage}
//           alt={firstName}
//           className="w-full h-full object-cover"
//         />
//       ) : (
//         <div className="flex items-center justify-center w-full h-full bg-gray-50 text-gray-400 font-bold">
//            {isLoading ? (
//                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
//            ) : (
//                <span>{initials || "U"}</span>
//            )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserImage;

const UserImage = ({ imageKey, firstName, lastName }) => {
  const isUrl = imageKey?.startsWith("http");

  const { data } = useGetImageQuery(imageKey, {
    skip: !imageKey || isUrl,
  });

  const image = isUrl ? imageKey : data?.url;

  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`;

  return image ? (
    <img src={image} />
  ) : (
    <div>{initials || "U"}</div>
  );
};
export default UserImage;