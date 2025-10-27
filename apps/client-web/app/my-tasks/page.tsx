"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MyTasksPage() {
  const [activeTab, setActiveTab] = useState<"current" | "completed">("current");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8">
          {/* Tabs */}
          <div className="flex gap-8 mb-12 border-b border-gray-300">
            <button
              onClick={() => setActiveTab("current")}
              className={`pb-3 font-medium text-base relative ${
                activeTab === "current"
                  ? "text-brand-dark"
                  : "text-gray-500 hover:text-brand-dark"
              }`}
            >
              Current
              {activeTab === "current" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-dark" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`pb-3 font-medium text-base relative ${
                activeTab === "completed"
                  ? "text-brand-dark"
                  : "text-gray-500 hover:text-brand-dark"
              }`}
            >
              Completed
              {activeTab === "completed" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-dark" />
              )}
            </button>
          </div>

          {/* Empty State */}
          <div className="text-center py-20">
            <h2 className="text-brand-dark font-bold text-3xl sm:text-4xl mb-4">
              Have something else on your to - do list?
            </h2>
            <p className="text-brand-dark text-lg mb-8">
              Book your next task or manage future to - dos with 100 Handy
            </p>
            <Button
              asChild
              className="bg-brand-terracotta hover:bg-brand-coral text-white font-medium px-8 py-6 rounded-full text-lg"
            >
              <Link href="/book-task">Check It Off Your List</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
