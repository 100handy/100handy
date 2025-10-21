import Image from "next/image";

export function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: "Describe Your Task" },
    { number: 2, label: "Browse Pros & Prices" },
    { number: 3, label: "Confirm & Book" },
    { number: 4, label: "Get It Done" },
  ];

  return (
    <div className="relative flex items-center justify-center w-full">
      <div className="absolute left-0">
        <Image
          src="/logo-100-handy.svg"
          alt="100Handy"
          width={120}
          height={30}
          style={{ filter: 'invert(1)' }}
        />
      </div>
      <div className="flex items-center w-full max-w-lg">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center w-full">
            <div className="flex flex-col items-center relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium z-10 ${
                  step.number < currentStep
                    ? "bg-[#C1856A] text-white"
                    : step.number === currentStep
                    ? "bg-white border-2 border-[#C1856A] text-[#30352D]"
                    : "bg-[#D1D5DB] text-gray-800"
                }`}
              >
                {step.number < currentStep ? "✔" : step.number}
              </div>
              {step.number === currentStep && (
                <span className="text-xs text-[#C1856A] mt-1 whitespace-nowrap absolute top-full">
                  {step.number}: {step.label}
                </span>
              )}
            </div>

            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 ${
                  step.number < currentStep ? "bg-[#C1856A]" : "bg-[#D1D5DB]"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
