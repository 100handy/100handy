import {
  TaskerCard,
  BrowseFilters,
  StepIndicator,
  PeaceOfMindCard,
} from "@/components/browse-pros";

const mockTaskers = Array.from({ length: 7 }, (_, i) => ({
  id: `tasker-${i}`,
  name: "Mike W.",
  rating: 5.0,
  reviewCount: 124,
  hourlyRate: 70.27,
  minimumHours: 2,
  tasksCompleted: 438,
  overallTasks: 548,
  vehicle: "Car",
  profileImage: "/images/tasker-placeholder.jpg",
  bio: "I have 8 years of experience. I come with all the right rawlplugs, fixings and tools and not forgetting my trust…",
  recentReview: {
    text: "Great Work, very considerate and excellent Attention to detail.",
    author: "Ana B.",
    date: "Thursday, Oct 2",
  },
}));

export default function BrowseProsPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Step Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <StepIndicator currentStep={2} />
        </div>
      </div>
      <div className="bg-[#F9F5F1]">
        <div className="max-w-7xl mx-auto px-6 py-3 text-center">
          <p className="text-[#30352D] text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline-block mr-2 align-text-bottom"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.084-1.282-.24-1.88M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.084-1.282.24-1.88m11.52 1.88l-4.52-4.52m-4.52 4.52l4.52-4.52M9 11a3 3 0 100-6 3 3 0 000 6z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 11a3 3 0 100-6 3 3 0 000 6z"
              />
            </svg>
            Filter and sort to find your 100Handy Pro. Then view their
            availability to request your date and time.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-80 flex-shrink-0 space-y-6">
            <BrowseFilters />
            <PeaceOfMindCard />
          </aside>

          {/* Taskers List */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-medium text-[#30352D]">
                  Browse Pros & Prices
                </h1>
                <p className="text-[#30352D] text-base leading-relaxed mt-1">
                  Filter and sort to find your 100Handy Pro. Then view their
                  availability to request your date and time.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Sorted by:
                </span>
                <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm">
                  <option>Recommended</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {mockTaskers.map((tasker) => (
                <TaskerCard key={tasker.id} tasker={tasker} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
