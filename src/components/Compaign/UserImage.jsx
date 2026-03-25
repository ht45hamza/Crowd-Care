import React from "react";
import { useGetImageQuery } from "@/Services/HandleAPI";

const UserImage = ({ imageKey, firstName, lastName, className }) => {
  const isUrl =
    typeof imageKey === "string" &&
    (imageKey.startsWith("http") || imageKey.startsWith("blob:") || imageKey.startsWith("data:"));

  const { data } = useGetImageQuery(imageKey, {
    skip: !imageKey || isUrl || imageKey === "null" || typeof imageKey !== "string",
  });

  const image = isUrl
    ? imageKey
    : (typeof data === "string" ? data : data?.url || data?.data || "");

  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`;

  return image ? (
    <img src={image} alt={initials || "User"} className={className} />
  ) : (
    <div className={`flex items-center justify-center ${className}`}>
      {initials || "U"}
    </div>
  );
};

export default UserImage;