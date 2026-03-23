import { Header, Footer } from "@/components/layout";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | 100 Handy",
  description: "Tips, guides, and news from 100 Handy.",
};

const blogPosts = [
  {
    date: "March 10, 2026",
    title: "10 Tips for a Stress-Free Furniture Assembly",
    excerpt:
      "From organising your workspace to choosing the right tools, here are our top tips for making furniture assembly a breeze.",
    slug: "tips-furniture-assembly",
  },
  {
    date: "February 25, 2026",
    title: "Spring Cleaning Checklist: Room by Room",
    excerpt:
      "Get your home sparkling with our comprehensive spring cleaning guide. We cover every room so nothing gets missed.",
    slug: "spring-cleaning-checklist",
  },
  {
    date: "February 12, 2026",
    title: "How to Choose the Right Handyman for Your Project",
    excerpt:
      "Not all jobs are the same. Learn what to look for when hiring a professional for your next home improvement project.",
    slug: "choose-right-handyman",
  },
];

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-brand-dark py-16">
          <div className="relative flex min-h-[470px] items-center justify-center">
            {/* Decorative shapes */}
            <div className="absolute left-[10%] top-[15%] h-[217px] w-[218px] rounded-full bg-[#5A6357]/60" />
            <div
              className="absolute bottom-[5%] right-[8%] h-[442px] w-[512px] bg-[#5A6357]/60"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
            />

            <div className="relative z-10 text-center">
              <h1 className="mb-6 text-[67px] font-bold leading-none text-white">
                Blog
              </h1>
              <p className="text-[22px] text-white/80">
                Tips, guides, and stories from the 100 Handy community
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="grid gap-8 md:grid-cols-3">
              {blogPosts.map((post) => (
                <div
                  key={post.slug}
                  className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <p className="mb-3 text-[14px] font-medium text-brand-dark-alt/60">
                    {post.date}
                  </p>
                  <h3 className="mb-4 text-[24px] font-bold leading-tight text-brand-dark-alt">
                    {post.title}
                  </h3>
                  <p className="mb-6 text-[18px] leading-relaxed text-brand-dark-alt/70">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[16px] font-semibold text-brand-terracotta hover:underline"
                  >
                    Read More
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
