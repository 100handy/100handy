"use client";

const faqsColumn1 = [
  "What's required to become a Handy Pro?",
  "How do I get jobs?",
  "Where does 100Handy operate?",
  "How long does it take for my registration to be processed?",
];

const faqsColumn2 = [
  "Do I need experience to task?",
  "How do I get paid?",
  "What categories can I task in on 100Handy?",
];

export function TaskerFAQs(): React.JSX.Element {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-16 text-center text-[36px] font-bold text-brand-dark-alt">
          Your questions, answered
        </h2>

        <div className="grid gap-x-16 gap-y-2 md:grid-cols-2">
          {/* Column 1 */}
          <div className="space-y-8">
            {faqsColumn1.map((question, index) => (
              <div key={index}>
                <button className="w-full border-b border-gray-200 pb-4 text-left transition-colors hover:text-brand-terracotta">
                  <p className="text-[21px] font-medium text-brand-terracotta">
                    {question}
                  </p>
                </button>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-8">
            {faqsColumn2.map((question, index) => (
              <div key={index}>
                <button className="w-full border-b border-gray-200 pb-4 text-left transition-colors hover:text-brand-terracotta">
                  <p className="text-[21px] font-medium text-brand-terracotta">
                    {question}
                  </p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

