"use client";

import { useState } from "react";

export function ConfirmDetails() {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [cardNumber, setCardNumber] = useState("1234 1234 1234 1234");
  const [expiryDate, setExpiryDate] = useState("MM / YY");
  const [securityCode, setSecurityCode] = useState("CVC");
  const [country, setCountry] = useState("United Kingdom");
  const [postalCode, setPostalCode] = useState("WS11 1DB");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8">
      <h2 className="mb-6 text-[30px] font-bold text-[#333A31]">
        Confirm details
      </h2>

      {/* Payment Method Section */}
      <div className="mb-8">
        <h3 className="mb-4 text-[24px] font-bold text-[#333A31]">
          Payment method
        </h3>

        <p className="mb-4 text-[16px] text-[#333A31]">
          You may see a temporary hold on your payment method in the amount of your Tasker's hourly rate. Don't worry - you're only billed when your task is complete!
        </p>

        {/* Payment Method Buttons */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => setPaymentMethod("card")}
            className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 transition-colors ${
              paymentMethod === "card"
                ? "border-[#C1856A] bg-white"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="text-[16px] font-bold text-[#333A31]">Card</span>
          </button>

          <button
            onClick={() => setPaymentMethod("paypal")}
            className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 transition-colors ${
              paymentMethod === "paypal"
                ? "border-[#C1856A] bg-white"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
          >
            <svg className="h-4 w-4 text-[#003087]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.653h5.555c3.033 0 5.143 1.289 5.634 3.844.484 2.522-.836 4.173-3.442 4.835v.028c2.896.524 4.399 2.375 3.783 5.229-.763 3.537-3.187 5.311-6.884 5.311H7.076z" />
            </svg>
            <span className="text-[16px] font-bold text-[#333A31]">PayPal</span>
          </button>
        </div>

        {/* Card Form */}
        {paymentMethod === "card" && (
          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="mb-2 block text-[16px] text-[#333A31]">
                Card number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 text-[16px] text-[#333A31] focus:border-[#C1856A] focus:outline-none focus:ring-2 focus:ring-[#C1856A]/20"
                  placeholder="1234 1234 1234 1234"
                />
                {/* Small payment logos */}
                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 gap-0.5">
                  <div className="h-4 w-6 rounded-sm bg-[#1434CB]" />
                  <div className="h-4 w-6 rounded-sm bg-gradient-to-r from-[#EB001B] to-[#F79E1B]" />
                  <div className="h-4 w-6 rounded-sm bg-[#006FCF]" />
                </div>
              </div>
            </div>

            {/* Expiry Date and Security Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[16px] text-[#333A31]">
                  Expiry date
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[16px] text-[#333A31] focus:border-[#C1856A] focus:outline-none focus:ring-2 focus:ring-[#C1856A]/20"
                  placeholder="MM / YY"
                />
              </div>
              <div>
                <label className="mb-2 block text-[16px] text-[#333A31]">
                  Security code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 text-[16px] text-[#333A31] focus:border-[#C1856A] focus:outline-none focus:ring-2 focus:ring-[#C1856A]/20"
                    placeholder="CVC"
                  />
                  <svg
                    className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Country and Postal Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[16px] text-[#333A31]">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[16px] text-[#333A31] focus:border-[#C1856A] focus:outline-none focus:ring-2 focus:ring-[#C1856A]/20"
                >
                  <option>United Kingdom</option>
                  <option>United States</option>
                  <option>Canada</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[16px] text-[#333A31]">
                  Postal code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[16px] text-[#333A31] focus:border-[#C1856A] focus:outline-none focus:ring-2 focus:ring-[#C1856A]/20"
                  placeholder="WS11 1DB"
                />
              </div>
            </div>

            {/* Terms */}
            <p className="text-[16px] text-[#333A31]">
              By providing your card information, you allow 100Handy Inc. to charge your card for future payments in accordance with their terms.
            </p>
          </div>
        )}
      </div>

      {/* Promo Code */}
      <div className="mb-8">
        <button className="text-[16px] font-bold text-[#C1856A] hover:underline">
          Do you have a promo code?
        </button>
      </div>

      {/* Divider */}
      <div className="my-8 h-px bg-gray-200" />

      {/* Pricing Details */}
      <div className="space-y-2 text-[16px]">
        <p className="text-[#333A31]">
          <span>Pricing is inclusive of a </span>
          <span className="font-medium text-[#C1856A]">£10.68/hr Trust & Support fee.</span>
          <span className="font-medium text-[#C1856A]"> Pricing includes VAT </span>
          <span>which is billed on the Trust & Support Fee and our Service Fee.</span>
        </p>

        <p className="text-[#333A31]">
          You will not be billed until your task is complete. Tasks have a one-hour minimum. You can cancel or reschedule anytime.
        </p>

        <p className="text-[#333A31]">
          If you cancel your task within 24 hours of the scheduled start time, you may be billed a one-hour cancellation fee at the Pro's hourly rate.
        </p>

        <p className="text-[#333A31]">
          <span className="font-medium text-[#C1856A]">Learn more</span>
          <span> about our cancellation policy.</span>
        </p>
      </div>
    </div>
  );
}
