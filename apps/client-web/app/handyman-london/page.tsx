"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { HelpIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

// --- Data --- //
const taskers = [
  {
    name: "Maria R.",
    tasks: "90 tv mounting tasks",
    rating: "5.0",
    reviews: 124,
    description: "From start to finish, I communicate clearly and work carefully to deliver exactly what you need"
  },
  {
    name: "Lucas P.",
    tasks: "31 tv mounting tasks",
    rating: "5.0",
    reviews: 124,
    description: "Friendly, punctual, and experienced—I focus on providing quality service and customer satisfaction every time."
  },
  {
    name: "Marcus R.",
    tasks: "90 tv mounting tasks",
    rating: "5.0",
    reviews: 124,
    description: "From start to finish, I communicate clearly and work carefully to deliver exactly what you need"
  },
  {
    name: "Lore V.",
    tasks: "64 tv mounting tasks",
    rating: "5.0",
    reviews: 124,
    description: "Whether it's a quick fix or a larger project, I'm committed to delivering dependable, professional results."
  },
  {
    name: "Ahmet P.",
    tasks: "31 tv mounting tasks",
    rating: "5.0",
    reviews: 124,
    description: "Friendly, punctual, and experienced—I focus on providing quality service and customer satisfaction every time."
  },
  {
    name: "Lisa O.",
    tasks: "73 tv mounting tasks",
    rating: "5.0",
    reviews: 124,
    description: "With over 6 years of experience, I bring the right tools and skills to ensure your job is completed safely."
  }
];

const handymanServices = [
  "Painting and drywall",
  "Door and lock installation or repair",
  "Tile installation and backsplash installation",
  "Furniture assembly",
  "Deck and stair repair",
  "Bathroom plumbing repair",
  "Window installation and repair roofing"
];

const relatedServices = [
  { name: "Furniture Removal", href: "/services/furniture-assembly/furniture-assembly" },
  { name: "Hang Pictures", href: "/services/home-repair/home-repair" },
  { name: "Tree Trimming", href: "/services/gardening/gardening" },
  { name: "Electrical Help", href: "/services/electrical/electrical" },
  { name: "Heavy Lifting", href: "/services/moving/moving" },
  { name: "Handyman", href: "/services/home-repair/home-repair" },
];

const popularServices = [
  { name: "TV Mounting", href: "/services/home-repair/home-repair" },
  { name: "Furniture Assembly", href: "/services/furniture-assembly/furniture-assembly" },
  { name: "House Cleaning", href: "/services/cleaning/sparkle-clean" },
  { name: "Help Moving", href: "/services/moving/moving" },
  { name: "Lawn Mowing", href: "/services/gardening/gardening" },
];

const otherServices = [
  { name: "Furniture Disassembly", href: "/services/furniture-assembly/furniture-assembly" },
  { name: "Move Out Cleaning", href: "/services/cleaning/sparkle-clean" },
  { name: "Landscaping Services", href: "/services/gardening/gardening" },
  { name: "Help Moving", href: "/services/moving/moving" },
  { name: "Plumbing", href: "/services/plumbing/plumbers" },
];

// --- Components --- //

const BreadcrumbSection = () => {
  return (
    <div className="bg-white py-4 border-b border-gray-200">
      <div className="max-w-[1920px] mx-auto px-8">
        <p className="text-brand-terracotta text-sm">
          <Link href="/" className="hover:underline">Home</Link> &gt; <Link href="/services-by-city" className="hover:underline">Locations</Link> &gt; <Link href="/locations/london" className="hover:underline">London</Link> &gt; Handyman
        </p>
      </div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="bg-brand-dark py-16">
      <div className="max-w-[1920px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h1 className="text-white font-bold text-[44px] leading-tight mb-6">
              Get Matched With<br />
              Handyman Services in<br />
              London
            </h1>

            <p className="text-white text-[24px] mb-6 leading-relaxed">
              If you're looking for local handyman services to<br />
              help with home maintenance projects, just<br />
              search "handyman near me" on 100Handy.
            </p>

            <div className="flex items-center gap-2 mb-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white text-[24px] font-semibold">500k Reviews</span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-white text-[24px]">Browse 2,500+ handyman Pros with a variety of<br />skills.</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-white text-[24px]">All Pros bring their own tools and equipment.</p>
              </div>
            </div>

            <Button variant="terracotta" size="lg" className="font-semibold">
              Book Now
            </Button>
          </div>

          <div className="flex items-center justify-center">
            <svg width="289" height="220" viewBox="0 0 289 220" className="text-brand-sage">
              <circle cx="50" cy="50" r="50" fill="currentColor" opacity="0.6" />
              <polygon points="145,0 289,220 0,220" fill="currentColor" opacity="0.6" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturedTaskersSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-[1920px] mx-auto px-8">
        <h2 className="text-brand-dark-alt font-bold text-[37px] mb-12">
          3744 featured Handyman Pros in London
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {taskers.map((tasker, index) => (
            <div key={index} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-brand-dark-alt font-bold text-[26px] mb-1">{tasker.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-brand-dark-alt text-[18px]">{tasker.rating} ({tasker.reviews} reviews)</span>
                  </div>
                  <p className="text-brand-dark-alt text-[18px]">{tasker.tasks}</p>
                </div>
              </div>
              <p className="text-brand-dark-alt text-[19px] leading-relaxed mb-4">{tasker.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="border-2 border-brand-dark-alt text-brand-dark-alt hover:bg-brand-dark-alt hover:text-white font-semibold py-3 px-10 rounded-md transition-colors text-[18px]">
            Search all 100 Handy Pros
          </button>
        </div>
      </div>
    </section>
  );
};

const SatisfactionSection = () => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-[1920px] mx-auto px-8">
        <h2 className="text-brand-dark-alt font-bold text-[44px] mb-16 text-center">
          Your satisfaction, guaranteed
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-8">
          <div>
            <h3 className="text-brand-dark-alt font-bold text-[32px] mb-4">Happiness Pledge</h3>
            <p className="text-brand-dark-alt text-[21px] leading-relaxed">
              If you're not satisfied, we'll work<br />
              to make it right.
            </p>
          </div>
          <div>
            <h3 className="text-brand-dark-alt font-bold text-[32px] mb-4">Vetted Pros</h3>
            <p className="text-brand-dark-alt text-[21px] leading-relaxed">
              Pros are always background<br />
              checked before joining the<br />
              platform.
            </p>
          </div>
          <div>
            <h3 className="text-brand-dark-alt font-bold text-[32px] mb-4">Dedicated Support</h3>
            <p className="text-brand-dark-alt text-[21px] leading-relaxed">
              Friendly service when you need us<br />
              — every day of the week.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <svg className="w-9 h-10 text-brand-dark-alt" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-brand-dark-alt font-semibold text-[23px]">Happiness pledge</p>
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="bg-white py-20">
      <div className="max-w-[1920px] mx-auto px-8">
        <h2 className="text-brand-dark-alt font-bold text-[44px] mb-12">
          Frequently asked questions about Handyman services in London
        </h2>

        <div className="border-t border-gray-300">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex justify-between items-center py-6 text-left border-b border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <span className="text-brand-dark-alt font-semibold text-[21px]">
              Q: What do most handyman charge per hour in London?
            </span>
            <svg
              className={`w-6 h-6 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpen && (
            <div className="py-6 border-b border-gray-300">
              <p className="text-brand-dark-alt text-[18px] leading-relaxed">
                Handyman rates in London typically range from £30-£60 per hour, depending on the complexity of the task and the experience level of the professional.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  return (
    <section className="bg-brand-dark py-20 relative">
      <div className="max-w-[1920px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="bg-white rounded-2xl p-12 shadow-2xl">
            <h2 className="text-brand-dark-alt font-bold text-[33px] mb-10">How it works</h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-brand-terracotta w-[51px] h-[51px] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[33px] font-bold">1</span>
                </div>
                <p className="text-brand-dark-alt text-[20px] leading-relaxed pt-2">
                  Choose a 100 Handy Pro by price,<br />
                  skills, and reviews.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-sage w-[51px] h-[51px] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[33px] font-bold">2</span>
                </div>
                <p className="text-brand-dark-alt text-[20px] leading-relaxed pt-2">
                  Schedule a Pro as early<br />
                  as today.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-sage w-[51px] h-[51px] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[33px] font-bold">3</span>
                </div>
                <p className="text-brand-dark-alt text-[20px] leading-relaxed pt-2">
                  Chat, pay, tip, and review,<br />
                  all in one place.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <svg width="289" height="220" viewBox="0 0 289 220" className="text-brand-sage opacity-60">
              <circle cx="50" cy="50" r="50" fill="currentColor" />
              <polygon points="145,0 289,220 0,220" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

const ReviewsSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-[1920px] mx-auto px-8">
        <h2 className="text-brand-dark-alt font-bold text-[44px] mb-12">
          See what happy customers are saying about handyman services in London
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="border border-gray-200 rounded-2xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <h4 className="text-brand-dark-alt font-bold text-[24px] mb-2">Michelle D.</h4>
              <p className="text-brand-dark-alt text-[24px] mb-3">Handyman</p>
              <p className="text-brand-dark-alt text-[21px] leading-relaxed">
                Thanks to Ken for a great and efficient job fixing our fridge! He knew the problem immediately and worked efficiently and effectively!
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="terracotta" size="lg" className="font-semibold">
            Get started
          </Button>
        </div>
      </div>
    </section>
  );
};

const SEOContentSection = () => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-[1920px] mx-auto px-8">
        <h2 className="text-brand-dark-alt font-bold text-[37px] mb-8">Handyman in London</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-brand-dark-alt font-bold text-[29px] mb-3">Save money</h3>
            <p className="text-brand-dark-alt text-[21px] leading-relaxed">
              Hiring a skilled worker to complete a job may sound costly, but finishing a project correctly the first time is far more economical<br />
              than wasting time and materials while attempting to learn on the job.
            </p>
          </div>

          <div>
            <h3 className="text-brand-dark-alt font-bold text-[29px] mb-3">The expertise you need</h3>
            <p className="text-brand-dark-alt text-[21px] leading-relaxed">
              Whatever type of home maintenance service you're looking for, you'll find the right handyman in London on 100Handy. From simple<br />
              tasks like fixture repair to more complex projects like installing new kitchen cabinets, there's a Pro with the experience you need.
            </p>
          </div>

          <div>
            <h3 className="text-brand-dark-alt font-bold text-[29px] mb-3">Same-day service available</h3>
            <p className="text-brand-dark-alt text-[21px] leading-relaxed">
              Not everyone has repair jobs in an emergency, but if damage threatens your home's safety or security, you should address it immediately.<br />
              When you shop around for local handyman services, you'll find Pros who provide last-minute appointments for urgent cases.
            </p>
          </div>

          <div>
            <h3 className="text-brand-dark-alt font-bold text-[29px] mb-3">There's a better way</h3>
            <p className="text-brand-dark-alt text-[21px] leading-relaxed">
              Local handyman services are easy to find on 100Handy. You can chat with, hire, schedule, pay, and even tip your Pro — all on the secure<br />
              100Handy website or app.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const HandymanServicesSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-[1920px] mx-auto px-8">
        <h2 className="text-brand-dark-alt font-bold text-[37px] mb-6">Handyman Services on 100Handy</h2>

        <p className="text-brand-dark-alt text-[21px] mb-6 leading-relaxed">
          London handyman services include (but are not limited to):
        </p>

        <ul className="space-y-2 mb-6">
          {handymanServices.map((service, index) => (
            <li key={index} className="text-brand-dark-alt text-[21px] flex items-start">
              <span className="mr-3">•</span>
              {service}
            </li>
          ))}
        </ul>

        <p className="text-brand-dark-alt text-[21px] leading-relaxed">
          Discuss the services you need with your Pro. There's a good chance they can check off everything on your home maintenance list.
        </p>
      </div>
    </section>
  );
};

const ServicesLinksSection = () => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-[1920px] mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-16">
          <div>
            <h3 className="text-brand-dark-alt font-bold text-[22px] mb-6">Related Services</h3>
            <ul className="space-y-3">
              {relatedServices.map((service, index) => (
                <li key={index}>
                  <Link href={service.href} className="text-brand-dark-alt text-[22px] hover:text-brand-terracotta transition-colors">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/all-services" className="text-brand-terracotta text-[22px] font-semibold inline-block mt-6 hover:underline">
              See more
            </Link>
          </div>

          <div>
            <h3 className="text-brand-dark-alt font-bold text-[22px] mb-6">Popular Services in London</h3>
            <ul className="space-y-3">
              {popularServices.map((service, index) => (
                <li key={index}>
                  <Link href={service.href} className="text-brand-dark-alt text-[22px] hover:text-brand-terracotta transition-colors">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/all-services" className="text-brand-terracotta text-[22px] font-semibold inline-block mt-6 hover:underline">
              See more
            </Link>
          </div>

          <div>
            <h3 className="text-brand-dark-alt font-bold text-[22px] mb-6">Other Services</h3>
            <ul className="space-y-3">
              {otherServices.map((service, index) => (
                <li key={index}>
                  <Link href={service.href} className="text-brand-dark-alt text-[22px] hover:text-brand-terracotta transition-colors">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/all-services" className="text-brand-terracotta text-[22px] font-semibold inline-block mt-6 hover:underline">
              See more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const HelpButton = () => {
  return (
    <button aria-label="Get help" className="fixed bottom-6 left-6 bg-brand-sage text-white p-4 rounded-full shadow-lg hover:bg-brand-sage/85 transition-colors flex items-center justify-center">
      <HelpIcon />
    </button>
  );
};

// --- Main Page Component --- //

export default function HandymanLondonPage() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <BreadcrumbSection />
      <HeroSection />
      <FeaturedTaskersSection />
      <SatisfactionSection />
      <FAQSection />
      <HowItWorksSection />
      <ReviewsSection />
      <SEOContentSection />
      <HandymanServicesSection />
      <ServicesLinksSection />
      <Footer />
      <HelpButton />
    </div>
  );
}
