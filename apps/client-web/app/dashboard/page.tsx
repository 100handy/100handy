"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/marketing/footer";

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const taskCategories = [
    "Furniture Assembly",
    "Garden Assembly",
    "Office Furniture Assembly",
    "Bed Assembly",
    "Wardrobe Assembly",
    "Crib Assembly",
    "Tv mounting",
    "Home Repair",
    "Electrical work",
    "General Mounting",
  ];

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    // Navigate to task form with the selected category
    router.push(`/task-form?category=${encodeURIComponent(category)}`);
  };

  const accountTypes = ["Personal", "Business", "Both"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header currentPage="book-task" />

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          {/* Title */}
          <h1 className="text-brand-dark font-bold text-3xl sm:text-4xl text-center mb-8">
            Book Your Next Task
          </h1>

          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto mb-8">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe one task, e.g. fix the hole in my wall"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-brand-terracotta"
            />
          </div>

          {/* Task Category Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto">
            {taskCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="px-6 py-2 rounded-full border transition-colors bg-white text-brand-dark border-gray-300 hover:border-brand-terracotta hover:text-brand-terracotta"
              >
                {category}
              </button>
            ))}
            <button className="px-6 py-2 rounded-full bg-white text-brand-terracotta border border-gray-300 hover:border-brand-terracotta font-medium">
              See more
            </button>
          </div>
        </div>

        {/* Account Type Section with Different Background */}
        <div className="bg-[#F5F0EB] py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 flex items-start gap-6">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-[160px] h-[160px] bg-[#C1856A]/20 rounded-2xl flex items-center justify-center">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="30" cy="25" r="8" fill="#C1856A"/>
                  <path d="M20 50c0-5.5 4.5-10 10-10s10 4.5 10 10v5H20v-5z" fill="#C1856A"/>
                  <circle cx="55" cy="30" r="10" fill="#D17852"/>
                  <path d="M43 60c0-6.6 5.4-12 12-12s12 5.4 12 12v7H43v-7z" fill="#D17852"/>
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pt-2">
              <h2 className="text-brand-dark font-medium text-xl mb-2">
                How do you use your 100Handy account?
              </h2>
              <p className="text-brand-dark text-base mb-6">
                Select below to receive special offers!
              </p>

              {/* Account Type Buttons */}
              <div className="flex flex-wrap gap-3">
                {accountTypes.map((type) => (
                  <button
                    key={type}
                    className="px-8 py-2.5 rounded-lg border-2 border-gray-300 bg-white text-brand-terracotta font-medium hover:bg-brand-terracotta hover:text-white hover:border-brand-terracotta transition-colors"
                  >
                    {type}
                  </button>
                ))}
                <button className="text-brand-terracotta font-medium hover:underline transition-colors ml-2">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
