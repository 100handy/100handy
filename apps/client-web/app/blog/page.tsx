import { Header, Footer } from "@/components/layout";
import { getPageContent } from "@/lib/cms";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic'

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

export default async function BlogPage() {
  const c = await getPageContent('blog')

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[470px] bg-gray-900">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={c('hero.image', '/images/hero/heroimage2.jpeg')}
              alt="100 Handy Blog"
              fill
              className="object-cover opacity-70"
              sizes="100vw"
              priority
            />
          </div>
          {/* White card overlay */}
          <div className="relative h-full flex items-center justify-center">
            <div className="bg-white rounded-2xl px-12 py-10 text-center max-w-2xl mx-auto shadow-xl">
              <h1 className="text-[56px] font-bold text-brand-dark-alt mb-4 leading-tight">
                {c('hero.title', 'Blog')}
              </h1>
              <p className="text-[22px] text-brand-dark-alt font-medium">
                {c('hero.subtitle', 'Tips, guides, and stories from the 100 Handy community')}
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
