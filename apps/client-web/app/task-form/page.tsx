"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/marketing/footer";
import Link from "next/link";

export default function TaskFormPage() {
  const [streetAddress, setStreetAddress] = useState("");
  const [unitFlat, setUnitFlat] = useState("");
  const [taskOptionsOpen, setTaskOptionsOpen] = useState(false);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const [taskSize, setTaskSize] = useState("");
  const [vehicleRequirement, setVehicleRequirement] = useState("");
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  const handleLocationContinue = () => {
    if (streetAddress.trim()) {
      setLocationConfirmed(true);
      setTaskOptionsOpen(true);
    }
  };

  const steps = [
    { number: 1, label: "Describe your task", active: true },
    { number: 2, label: "", active: false },
    { number: 3, label: "", active: false },
    { number: 4, label: "", active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Progress Stepper */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-[70px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-brand-dark-alt font-bold text-lg sm:text-xl font-display">
                100<span className="font-normal">HANDY</span>
              </span>
            </Link>

            {/* Progress Stepper */}
            <div className="flex items-center gap-2 flex-1 max-w-2xl mx-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  {/* Step Circle */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        step.active
                          ? "bg-brand-terracotta text-white"
                          : "bg-gray-300 text-white"
                      }`}
                    >
                      {step.number}
                    </div>
                    {step.label && (
                      <span className="text-xs text-brand-dark whitespace-nowrap">
                        {step.label}
                      </span>
                    )}
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-px bg-gray-300 mx-2" />
                  )}
                </div>
              ))}
            </div>

            {/* Empty space for balance */}
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-[#F5E6D3] py-4">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="w-5 h-5 text-brand-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-brand-dark text-sm">
                Tell us about your task. We use these details to show Taskers in your area
              </p>
              <p className="text-brand-dark text-sm">Who fit your needs.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Task Title */}
            <h1 className="text-brand-dark font-bold text-2xl sm:text-3xl">
              General Mounting
            </h1>

            {/* Your task location */}
            <div className="bg-white rounded-lg border border-gray-300 p-6">
              {!locationConfirmed ? (
                // Edit Mode - Show input fields
                <>
                  <h2 className="text-brand-dark font-semibold text-lg mb-4">
                    Your task location
                  </h2>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Street address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-full text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-brand-terracotta"
                    />
                    <input
                      type="text"
                      value={unitFlat}
                      onChange={(e) => setUnitFlat(e.target.value)}
                      placeholder="Unit or Flat #"
                      className="w-full px-4 py-3 border border-gray-300 rounded-full text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-brand-terracotta"
                    />

                    <div className="flex justify-center pt-2">
                      <Button 
                        onClick={handleLocationContinue}
                        className="bg-brand-terracotta hover:bg-brand-coral text-white px-8 py-2 rounded-full"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                // Confirmed Mode - Show confirmed location
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-brand-dark font-semibold text-lg mb-2">
                        Your task location
                      </h2>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-600 text-sm">{streetAddress}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-brand-terracotta text-sm">
                    Good news! Taskrabbit is available in your area
                  </p>
                </>
              )}
            </div>

            {/* Task Options */}
            <div className="bg-white rounded-lg border border-gray-300">
              <button
                onClick={() => setTaskOptionsOpen(!taskOptionsOpen)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
              >
                <h2 className="text-brand-dark font-semibold text-lg">Task Options</h2>
                {taskOptionsOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {taskOptionsOpen && (
                <div className="px-6 pb-6 space-y-6">
                  {/* Task Size */}
                  <div>
                    <h3 className="text-brand-dark font-semibold text-base mb-3">
                      Task Size
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="taskSize"
                          value="small"
                          checked={taskSize === "small"}
                          onChange={(e) => setTaskSize(e.target.value)}
                          className="w-4 h-4 text-brand-terracotta focus:ring-brand-terracotta"
                        />
                        <span className="text-brand-dark text-sm">Small – Est. 1 hr</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="taskSize"
                          value="medium"
                          checked={taskSize === "medium"}
                          onChange={(e) => setTaskSize(e.target.value)}
                          className="w-4 h-4 text-brand-terracotta focus:ring-brand-terracotta"
                        />
                        <span className="text-brand-dark text-sm">Medium – Est. 2-3 hrs</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="taskSize"
                          value="large"
                          checked={taskSize === "large"}
                          onChange={(e) => setTaskSize(e.target.value)}
                          className="w-4 h-4 text-brand-terracotta focus:ring-brand-terracotta"
                        />
                        <span className="text-brand-dark text-sm">Large – Est. 4+ hrs</span>
                      </label>
                    </div>
                  </div>

                  {/* Vehicle Requirements */}
                  <div>
                    <h3 className="text-brand-dark font-semibold text-base mb-3">
                      Vehicle Requirements
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="vehicle"
                          value="not-needed"
                          checked={vehicleRequirement === "not-needed"}
                          onChange={(e) => setVehicleRequirement(e.target.value)}
                          className="w-4 h-4 text-brand-terracotta focus:ring-brand-terracotta"
                        />
                        <span className="text-brand-dark text-sm">Not needed for task</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="vehicle"
                          value="car"
                          checked={vehicleRequirement === "car"}
                          onChange={(e) => setVehicleRequirement(e.target.value)}
                          className="w-4 h-4 text-brand-terracotta focus:ring-brand-terracotta"
                        />
                        <span className="text-brand-dark text-sm">Task requires a car</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="vehicle"
                          value="truck"
                          checked={vehicleRequirement === "truck"}
                          onChange={(e) => setVehicleRequirement(e.target.value)}
                          className="w-4 h-4 text-brand-terracotta focus:ring-brand-terracotta"
                        />
                        <span className="text-brand-dark text-sm">Task requires a truck</span>
                      </label>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div className="flex justify-center pt-4">
                    <Button className="bg-brand-terracotta hover:bg-brand-coral text-white px-8 py-2 rounded-full">
                      Continue
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Tell us the details of your task */}
            <div className="bg-white rounded-lg border border-gray-300">
              <button
                onClick={() => setTaskDetailsOpen(!taskDetailsOpen)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
              >
                <h2 className="text-brand-dark font-semibold text-lg">
                  Tell us the details of your task
                </h2>
                {taskDetailsOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {taskDetailsOpen && (
                <div className="px-6 pb-6">
                  <p className="text-gray-500 text-sm">
                    Task details content will go here...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
