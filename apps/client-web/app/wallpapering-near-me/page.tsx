"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/marketing/footer";
import { useState } from "react";

export default function WallpaperingNearMe() {
  const [zipCode, setZipCode] = useState("");

  const taskers = [
    {
      name: "Maria R.",
      tasks: "90 tv mounting tasks",
      rating: "5.0",
      reviews: 124,
      description:
        "From start to finish, I communicate clearly and work carefully to deliver exactly what you need",
      image: "/images/tasker-1.png",
    },
    {
      name: "Lucas P.",
      tasks: "31 tv mounting tasks",
      rating: "5.0",
      reviews: 124,
      description:
        "Friendly, punctual, and experienced—I focus on providing quality service and customer satisfaction every time.",
      image: "/images/tasker-2.png",
    },
    {
      name: "Marcus R.",
      tasks: "90 tv mounting tasks",
      rating: "5.0",
      reviews: 124,
      description:
        "From start to finish, I communicate clearly and work carefully to deliver exactly what you need",
      image: "/images/tasker-3.png",
    },
    {
      name: "Lore V.",
      tasks: "64 tv mounting tasks",
      rating: "5.0",
      reviews: 124,
      description:
        "Whether it's a quick fix or a larger project, I'm committed to delivering dependable, professional results.",
      image: "/images/tasker-4.png",
    },
    {
      name: "Ahmet P.",
      tasks: "31 tv mounting tasks",
      rating: "5.0",
      reviews: 124,
      description:
        "Friendly, punctual, and experienced—I focus on providing quality service and customer satisfaction every time.",
      image: "/images/tasker-5.png",
    },
    {
      name: "Lisa O.",
      tasks: "73 tv mounting tasks",
      rating: "5.0",
      reviews: 124,
      description:
        "With over 6 years of experience, I bring the right tools and skills to ensure your job is completed safely.",
      image: "/images/tasker-6.png",
    },
  ];

  const blogPosts = [
    {
      title: "Smart Ways to Refresh Your Walls",
      description:
        "Wallpapering can easily transform any room in your home, enhancing its beauty...",
      image: "/images/blog-1.png",
    },
    {
      title: "Smart Ways to Refresh Your Walls",
      description:
        "Wallpapering can easily transform any room in your home, enhancing its beauty...",
      image: "/images/blog-2.png",
    },
    {
      title: "Smart Ways to Refresh Your Walls",
      description:
        "Wallpapering can easily transform any room in your home, enhancing its beauty...",
      image: "/images/blog-3.png",
    },
    {
      title: "Smart Ways to Refresh Your Walls",
      description:
        "Wallpapering can easily transform any room in your home, enhancing its beauty...",
      image: "/images/blog-4.png",
    },
    {
      title: "Smart Ways to Refresh Your Walls",
      description:
        "Wallpapering can easily transform any room in your home, enhancing its beauty...",
      image: "/images/blog-5.png",
    },
    {
      title: "Smart Ways to Refresh Your Walls",
      description:
        "Wallpapering can easily transform any room in your home, enhancing its beauty...",
      image: "/images/blog-6.png",
    },
  ];

  const relatedServices = [
    { name: "Furniture Rearranging", image: "/images/service-1.png" },
    { name: "Blinds Repair", image: "/images/service-2.png" },
    { name: "Ceiling Fan Installation", image: "/images/service-3.png" },
    { name: "Drywall Repair", image: "/images/service-4.png" },
    { name: "Door Repair", image: "/images/service-5.png" },
    { name: "Window Repair", image: "/images/service-6.png" },
  ];

  const faqItems = [
    {
      question: "How much will wallpapering near me cost?",
      answer:
        "The cost of wallpapering depends on various factors including the size of the room, type of wallpaper, and complexity of the project. On average, you can expect to pay between £30-£80 per hour for professional wallpapering services.",
    },
    {
      question: "How long does wallpapering take?",
      answer:
        "The time required for wallpapering varies based on room size and complexity. A standard bedroom typically takes 4-6 hours, while larger rooms or complex patterns may take 1-2 days.",
    },
    {
      question: "What's included in 100Handy wallpaper task?",
      answer:
        "Our wallpaper service includes surface preparation, professional wallpaper application, trimming, and cleanup. You provide the wallpaper, and our skilled Taskers handle the rest!",
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white py-4 border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <p className="text-brand-terracotta text-sm font-medium">
              Home &gt; Locations &gt; London &gt; Wallpapering Near Me
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-[#3E4840] py-12 lg:py-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Form */}
              <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
                <h1 className="text-[#30352D] font-bold text-4xl mb-4 leading-tight">
                  Wallpapering Near
                  <br />
                  Me
                </h1>
                <p className="text-[#30352D] mb-6 text-base leading-relaxed">
                  Transform your space with expert wallpapering! Find a local
                  100Handy pro for quick and seamless wall decor.
                </p>
                <div className="mb-4">
                  <label
                    htmlFor="zipCode"
                    className="text-[#30352D] text-sm font-semibold mb-2 block"
                  >
                    ZIP code
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Enter your zip code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-transparent transition-all"
                  />
                </div>
                <button className="w-full bg-brand-terracotta hover:bg-brand-coral text-white font-semibold py-3.5 rounded-md transition-colors shadow-md hover:shadow-lg">
                  Get quote in secs
                </button>
              </div>

              {/* Right Side - Features */}
              <div className="text-white space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-lg leading-relaxed">
                    Skilled Taskers provide precise and flawless wallpaper
                    application.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-lg leading-relaxed">
                    Tasker can handle all types of wallpaper patterns and
                    textures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Wallpaper Services */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h2 className="text-[#30352D] font-bold text-3xl lg:text-4xl mb-12">
              Top Wallpaper Services near you
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {taskers.map((tasker, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-brand-terracotta"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full overflow-hidden flex-shrink-0">
                      {/* Avatar placeholder */}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#333A31] font-bold text-xl mb-1">
                        {tasker.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        <svg
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-[#333A31] text-sm font-medium">
                          {tasker.rating} ({tasker.reviews} reviews)
                        </span>
                      </div>
                      <p className="text-[#333A31] font-semibold text-xs">
                        {tasker.tasks}
                      </p>
                    </div>
                  </div>
                  <p className="text-[#333A31] text-sm mb-4 leading-relaxed">
                    {tasker.description}
                  </p>
                  <Link
                    href="#"
                    className="text-brand-terracotta font-medium text-sm hover:underline inline-block"
                  >
                    Book now
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button className="text-brand-terracotta border-2 border-brand-terracotta rounded-md px-10 py-2.5 hover:bg-brand-terracotta hover:text-white transition-all font-semibold">
                See all
              </button>
            </div>
          </div>
        </section>

        {/* Your satisfaction, guaranteed */}
        <section className="py-12 lg:py-16 bg-[#F9FAFB]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h2 className="text-[#30352D] font-bold text-3xl lg:text-4xl mb-12 text-center">
              Your satisfaction,{" "}
              <span className="text-brand-terracotta">guaranteed</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  title: "Vetted Pros",
                  description:
                    "Pros are always background checked before joining the platform.",
                },
                {
                  icon: (
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  ),
                  title: "Happiness Pledge",
                  description:
                    "If you're not satisfied, we'll work to make it right.",
                },
                {
                  icon: (
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ),
                  title: "Dedicated Support",
                  description:
                    "Friendly service when you need us — every day of the week.",
                },
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-brand-sage rounded-full flex items-center justify-center shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-[#333A31] font-bold text-2xl mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#333A31] text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h2 className="text-[#30352D] font-bold text-3xl lg:text-4xl mb-12">
              See what happy customers are saying about handyman services in
              London
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <h4 className="text-[#333A31] font-bold text-xl mb-3">
                    Michelle D.
                  </h4>
                  <p className="text-[#333A31] text-base leading-relaxed">
                    Thanks to Ken for a great and efficient job fixing our
                    fridge! He knew the problem immediately and worked
                    efficiently and effectively!
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button className="text-brand-terracotta border-2 border-brand-terracotta rounded-md px-10 py-2.5 hover:bg-brand-terracotta hover:text-white transition-all font-semibold">
                See all
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 lg:py-16 bg-[#F9FAFB]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h2 className="text-[#30352D] font-bold text-3xl lg:text-4xl mb-10">
              Frequently asked questions about Wallpaper Installation
            </h2>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <details
                  key={index}
                  className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <summary className="flex justify-between items-center cursor-pointer p-6 list-none">
                    <span className="text-[#30352D] font-semibold text-lg pr-4">
                      {item.question}
                    </span>
                    <svg
                      className="w-6 h-6 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-[#333A31] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Explore our blog */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h2 className="text-[#30352D] font-bold text-3xl lg:text-4xl mb-6">
              Explore our blog
            </h2>

            <p className="text-[#30352D] mb-10 text-lg">
              We're unlocking community knowledge in a new way. Experts add
              insights directly into each article, started with the help of AI.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-105 transition-transform duration-300" />
                  <div className="p-6">
                    <h3 className="text-[#30352D] font-bold text-lg mb-3 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-[#30352D] text-sm mb-4 leading-relaxed">
                      {post.description}
                    </p>
                    <Link
                      href="#"
                      className="text-brand-terracotta font-semibold text-sm hover:underline inline-flex items-center gap-1"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join millions */}
        <section className="py-16 lg:py-20 bg-[#F9FAFB]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h2 className="text-[#30352D] font-bold text-3xl lg:text-4xl mb-16 text-center">
              Join millions in enjoying easy Wallpaper Installation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: (
                    <svg
                      className="w-12 h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  ),
                  value: "1.4 million",
                  label: "Customers",
                },
                {
                  icon: (
                    <svg
                      className="w-12 h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ),
                  value: "4.5 Stars",
                  label: "Average Rating",
                },
                {
                  icon: (
                    <svg
                      className="w-12 h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                  value: "500K Reviews",
                  label: "Verified",
                },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-brand-terracotta rounded-full flex items-center justify-center shadow-xl">
                    {stat.icon}
                  </div>
                  <h3 className="text-[#30352D] font-bold text-4xl mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-[#333A31] text-lg">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* You Might Also Like */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h2 className="text-[#30352D] font-bold text-3xl lg:text-4xl mb-10">
              You Might Also Like
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {relatedServices.slice(0, 4).map((service, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="h-40 bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-105 transition-transform duration-300" />
                  <div className="p-5">
                    <h3 className="text-[#30352D] font-bold text-lg">
                      {service.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {relatedServices.slice(4, 6).map((service, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="h-40 bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-105 transition-transform duration-300" />
                  <div className="p-5">
                    <h3 className="text-[#30352D] font-bold text-lg">
                      {service.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button className="text-brand-terracotta border-2 border-brand-terracotta rounded-md px-10 py-2.5 hover:bg-brand-terracotta hover:text-white transition-all font-semibold">
                See more services
              </button>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 lg:py-20 bg-[#F9FAFB]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h2 className="text-[#30352D] font-bold text-3xl lg:text-4xl mb-6">
              Handyman in London
            </h2>

            <div className="prose prose-lg max-w-none">
              <h3 className="text-[#30352D] font-bold text-2xl mb-4 mt-8">
                Where money
              </h3>
              <p className="text-[#333A31] mb-6 leading-relaxed">
                Whatever it is that needs doing, chances are great that there's
                a Tasker in London who'd love to help you with it! Since there's
                a wide variety of home improvement tasks available, here's a
                brief list of the most popular ones on 100handy:
              </p>

              <h3 className="text-[#30352D] font-bold text-2xl mb-4 mt-8">
                The expertise you need
              </h3>
              <p className="text-[#333A31] mb-6 leading-relaxed">
                Before hiring a Tasker on 100handy, check out their reviews,
                ratings, and the tasks they've completed for other customers.
                Get more information on each Tasker by going to their unique
                profile page. When you like what you see, pick the Tasker that's
                right for you, and they'll get to work on your home project!
              </p>

              <h3 className="text-[#30352D] font-bold text-2xl mb-4 mt-8">
                When day service available
              </h3>
              <p className="text-[#333A31] mb-6 leading-relaxed">
                Same-day booking is available on 100handy. You can also browse
                prices and choose a time that works best for you and your
                Tasker. Need help? Rely on our dedicated customer support team
                to assist with any questions. Communication with your Tasker is
                easy on 100handy—you can chat to sort out the details before
                booking, or contact them after the job.
              </p>

              <h3 className="text-[#30352D] font-bold text-2xl mb-4 mt-8">
                There's a tasker map
              </h3>
              <p className="text-[#333A31] leading-relaxed">
                Convenient services that fit your schedule and budget are just a
                click away. You can book online, knowing that you're backed by
                our Happiness Pledge.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
