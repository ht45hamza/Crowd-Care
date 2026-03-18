import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Colors } from "@/colors";
import Logo from "@/assets/Logo.png";
import { motion } from "framer-motion";

export default function DonationReceipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount = 500, campaignName = "Flood Victim", transactionId = "#12345678" } = location.state || {}; // Default for demo if no state

  const receiptId = transactionId;
  const date = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-[#f5f7f9] flex flex-col items-center justify-center p-6 font-sans">
      {/* Brand Logo */}
      <div className="absolute top-10 left-10">
        <img src={Logo} alt="CrowdCareAid" className="h-10 md:h-12 object-contain" />
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: "#1a391e" }} // Dark green from image
        >
          <Check className="text-white" size={48} strokeWidth={3} />
        </motion.div>

        <h1 className="text-[22px] font-bold text-gray-900 mb-10">Successfully Send Amount</h1>

        {/* Receipt Card */}
        <div className="w-full bg-white rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden relative">
          <div className="p-8 md:p-12 space-y-6">
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-gray-400 font-medium">Campaign Name</span>
              <span className="text-gray-900 font-extrabold text-right">{campaignName}</span>
            </div>
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-gray-400 font-medium">Send Amount</span>
              <span className="text-gray-900 font-extrabold text-right">$ {Number(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-gray-400 font-medium">Status</span>
              <span className="text-gray-900 font-extrabold text-right">Success</span>
            </div>
          </div>

          {/* Dotted Separator with Cutouts */}
          <div className="relative h-px flex items-center justify-center">
            <div className="absolute -left-4 w-8 h-8 rounded-full bg-[#f5f7f9]" />
            <div className="w-full border-t-2 border-dashed border-gray-100 mx-4" />
            <div className="absolute -right-4 w-8 h-8 rounded-full bg-[#f5f7f9]" />
          </div>

          <div className="p-8 md:p-12 space-y-6">
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-gray-400 font-medium">Send Date</span>
              <span className="text-gray-900 font-extrabold text-right">{date}</span>
            </div>
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-gray-400 font-medium">transaction ID</span>
              <span className="text-gray-900 font-extrabold text-right">{receiptId}</span>
            </div>
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-gray-400 font-medium">Category</span>
              <span className="text-gray-900 font-extrabold text-right">Donation</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-6 w-full mt-10">
          <Button
            onClick={() => navigate("/home")}
            className="h-14 bg-[#f1f3f4] text-[#1a391e] border border-gray-200 rounded-[14px] font-bold text-base hover:bg-gray-200 transition-all shadow-none"
          >
            Back to Home
          </Button>
          <Button
            className="h-14 rounded-[14px] text-white font-bold text-base transition-all flex gap-3 shadow-md"
            style={{ backgroundColor: "#1a391e" }}
          >
            <Download size={20} />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
