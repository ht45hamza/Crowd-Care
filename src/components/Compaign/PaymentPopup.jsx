import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Colors } from "@/colors";
import {  AnimatePresence } from "framer-motion";
import { useDonateMutation } from '@/Services/HandleAPI';

const DEFAULT_AMOUNTS = [10, 20, 50, 100, 200, 500];

function formatAmount(value) {
  return `$${Number(value).toLocaleString()}`;
}

export default function PaymentPopup({
  isOpen,
  onClose,
  onSubmit,
  title = "Select Donation Amount",
  amounts = DEFAULT_AMOUNTS,
}) {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [Donate, {isLoading : Loading}] = useDonateMutation();

  if (!isOpen) return null;

  const finalAmount = customAmount.trim() !== "" ? Number(customAmount) : selectedAmount;
  const isValidAmount = Number.isFinite(finalAmount) && finalAmount > 0;

  
  const handleSelectAmount = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setCustomAmount(val);
      setSelectedAmount(null);
    }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!isValidAmount) return;
    onSubmit?.(finalAmount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl overflow-hidden rounded-[24px] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative border-b border-gray-100 bg-gray-50/50 px-6 py-5">
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-sm font-medium text-gray-500 mt-1">Choose an amount to help victims</p>
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-all hover:bg-gray-200 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="space-y-6">
                {/* Amount Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {amounts.map((amount) => {
                    const isActive = selectedAmount === amount;
                    return (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleSelectAmount(amount)}
                        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 py-4 transition-all duration-200 ${
                          isActive
                            ? "border-transparent bg-primary text-white shadow-lg ring-2 ring-primary ring-offset-2"
                            : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-white hover:shadow-md"
                        }`}
                        style={{
                          backgroundColor: isActive ? Colors.primary : undefined,
                        }}
                      >
                        {isActive && (
                          <div className="absolute top-2 right-2">
                            <Check size={14} className="text-white" />
                          </div>
                        )}
                        <span className={`text-lg font-bold ${isActive ? "text-white" : "text-gray-800"}`}>
                          {formatAmount(amount)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Enter Custom Amount</label>
                  <div className={`relative flex items-center rounded-2xl border-2 bg-gray-50 px-4 py-1 transition-all duration-300 ${
                    isFocused ? "border-primary bg-white ring-4 ring-primary/10" : "border-gray-100"
                  }`}
                  style={{ borderColor: isFocused ? Colors.primary : undefined }}
                  >
                    <span className="text-xl font-bold text-gray-400">$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={customAmount}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onChange={handleCustomChange}
                      placeholder="Other amount"
                      className="w-full bg-transparent px-2 py-3 text-xl font-bold text-gray-900 outline-none placeholder:text-gray-300"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-500">Tocal Commitment</span>
                    <span className="text-2xl font-black text-gray-900" style={{ color: Colors.primary }}>
                      {formatAmount(finalAmount || 0)}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  type="submit"
                  disabled={!isValidAmount}
                  className="relative h-14 w-full overflow-hidden rounded-2xl text-lg font-bold tracking-tight text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  style={{ 
                    backgroundColor: Colors.primary,
                    boxShadow: `0 10px 20px -5px ${Colors.primary}4D`
                  }}
                >
                  <span className="relative z-10">Donate Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity hover:opacity-100" />
                </Button>
                
                <p className="text-center text-[11px] font-medium text-gray-400">
                  100% of your donation goes directly to the cause.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
