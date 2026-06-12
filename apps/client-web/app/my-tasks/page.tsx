"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/marketing/footer";
import { BookingCard } from "@/components/my-tasks/booking-card";
import { getUserBookings, type Booking } from "@/lib/supabase/bookings";
import { createClient } from "@/lib/supabase-client";

export default function MyTasksPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"current" | "completed" | "cancelled">("current");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check auth
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/sign-in');
          return;
        }

        // Fetch bookings
        const userBookings = await getUserBookings(user.id);
        setBookings(userBookings);
      } catch (err) {
        console.error('Error loading bookings:', err);
        setError('Failed to load your tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [router]);

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === "completed") {
      return booking.status === "completed";
    } else if (activeTab === "cancelled") {
      return booking.status === "cancelled";
    } else {
      // Current includes: pending, accepted, in_progress
      return ["pending", "accepted", "in_progress"].includes(booking.status);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8">
          {/* Page Title */}
          <h1 className="text-brand-dark font-bold text-3xl mb-8">Tasks</h1>

          {/* Tabs */}
          <div className="flex gap-8 mb-8 border-b border-gray-300">
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
            <button
              onClick={() => setActiveTab("cancelled")}
              className={`pb-3 font-medium text-base relative ${
                activeTab === "cancelled"
                  ? "text-brand-dark"
                  : "text-gray-500 hover:text-brand-dark"
              }`}
            >
              Cancelled
              {activeTab === "cancelled" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-dark" />
              )}
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-terracotta"></div>
              <p className="mt-4 text-gray-600">Loading your tasks...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Bookings List */}
          {!loading && !error && filteredBookings.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {filteredBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredBookings.length === 0 && (
            <div className="text-center py-20">
              <h2 className="text-brand-dark font-bold text-3xl sm:text-4xl mb-4">
                {activeTab === "current"
                  ? "Have something else on your to-do list?"
                  : activeTab === "completed"
                  ? "No completed tasks yet"
                  : "No cancelled tasks"
                }
              </h2>
              <p className="text-brand-dark text-lg mb-8">
                {activeTab === "current"
                  ? "Book your next task or manage future to-dos with 100 Handy"
                  : activeTab === "completed"
                  ? "Once you complete a task, it will appear here"
                  : "Cancelled tasks will appear here"
                }
              </p>
              {activeTab === "current" && (
                <Button
                  asChild
                  className="bg-brand-terracotta hover:bg-brand-coral text-white font-medium px-8 py-6 rounded-full text-lg"
                >
                  <Link href="/dashboard">Check It Off Your List</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
