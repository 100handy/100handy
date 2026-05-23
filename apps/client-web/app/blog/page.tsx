import { Header, Footer } from "@/components/layout";
import { getPageContent } from "@/lib/cms";
import { getPublishedBlogPosts, getSurfaceSeoMetadata } from "@/lib/content-platform";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return getSurfaceSeoMetadata('page', 'blog', {
    title: "Blog | 100 Handy",
    description: "Tips, guides, and news from 100 Handy.",
  })
}

const featuredPost = {
  date: "April 10, 2026",
  category: "Assembly",
  title: "10 Tips for a Stress-Free Furniture Assembly",
  excerpt:
    "From organising your workspace to choosing the right tools, here are our top tips for making furniture assembly a breeze — whether you are tackling a flat-pack wardrobe or a full home office setup.",
  image: "/images/services/assembly/furniture-assembly.jpeg",
  slug: "tips-furniture-assembly",
};

const blogPosts = [
  {
    date: "March 25, 2026",
    category: "Cleaning",
    title: "Spring Cleaning Checklist: Room by Room",
    excerpt:
      "Get your home sparkling with our comprehensive spring cleaning guide. We cover every room so nothing gets missed.",
    image: "/images/services/cleaning/deep-clean.jpeg",
    slug: "spring-cleaning-checklist",
  },
  {
    date: "March 12, 2026",
    category: "Home Repairs",
    title: "How to Choose the Right Handyman for Your Project",
    excerpt:
      "Not all jobs are the same. Learn what to look for when hiring a professional for your next home improvement project.",
    image: "/images/services/home-repairs/minor-home-repairs.jpeg",
    slug: "choose-right-handyman",
  },
  {
    date: "February 28, 2026",
    category: "Mounting",
    title: "The Safe Way to Mount a TV on Any Wall Type",
    excerpt:
      "Plasterboard, brick, or stud walls — each requires a different approach. Here is everything you need to know before you drill.",
    image: "/images/services/mounting/tv-mounting.jpeg",
    slug: "tv-mounting-guide",
  },
  {
    date: "February 14, 2026",
    category: "Plumbing",
    title: "5 Signs You Need a Plumber (Don't Ignore These)",
    excerpt:
      "A dripping tap might seem minor, but it could be the first sign of something bigger. Spot the warning signs before a small issue becomes a costly one.",
    image: "/images/services/plumbing/leak-fixing.jpeg",
    slug: "signs-you-need-a-plumber",
  },
  {
    date: "January 30, 2026",
    category: "Gardening",
    title: "How to Prepare Your Garden for Spring",
    excerpt:
      "Winter takes a toll on outdoor spaces. Follow our expert checklist to get your garden thriving again as soon as the temperature rises.",
    image: "/images/services/outdoor/gardening.jpeg",
    slug: "garden-spring-prep",
  },
  {
    date: "January 15, 2026",
    category: "Moving",
    title: "Moving House? Here's How to Make It Less Stressful",
    excerpt:
      "From packing strategies to booking the right help, a little preparation goes a long way. Our guide covers everything from first box to final unpack.",
    image: "/images/services/moving/packing-and-moving.jpeg",
    slug: "moving-house-guide",
  },
  {
    date: "December 20, 2025",
    category: "Cleaning",
    title: "End-of-Tenancy Cleaning: A Complete Guide for Renters",
    excerpt:
      "Losing your deposit over cleaning is more common than you think. Here is how to leave your rental spotless and get every penny back.",
    image: "/images/services/cleaning/end-of-tenancy.jpeg",
    slug: "end-of-tenancy-cleaning",
  },
  {
    date: "December 5, 2025",
    category: "Assembly",
    title: "IKEA Assembly Tips: The Mistakes Everyone Makes",
    excerpt:
      "Missing a step in the instructions, overtightening screws, losing a dowel — sound familiar? We round up the most common IKEA assembly mistakes and how to avoid them.",
    image: "/images/services/assembly/ikea-assembly.jpeg",
    slug: "ikea-assembly-tips",
  },
];

const categories = ["All", "Assembly", "Cleaning", "Home Repairs", "Mounting", "Plumbing", "Moving", "Gardening"];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category && categories.includes(category) ? category : "All";
  const c = await getPageContent('blog');
  const publishedPosts = await getPublishedBlogPosts();

  const livePosts = publishedPosts.map((post) => ({
    date: post.published_at
      ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : '',
    category: post.category ?? 'General',
    title: post.title,
    excerpt: post.excerpt ?? '',
    image: post.cover_image_url ?? '/images/hero/heroimage2.jpeg',
    slug: post.slug,
  }));

  const featured = livePosts[0] ?? featuredPost;
  const allListPosts = livePosts.length > 1 ? livePosts.slice(1) : blogPosts;
  const filteredPosts = activeCategory === "All"
    ? allListPosts
    : allListPosts.filter((p) => p.category === activeCategory);

  const showFeatured = activeCategory === "All" || featured.category === activeCategory;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative h-[470px] bg-[#3D4539]">
          <div className="absolute inset-0">
            <Image
              src={c('hero.image', '/images/hero/heroimage2.jpeg')}
              alt="100 Handy Blog"
              fill
              className="object-cover opacity-40"
              sizes="100vw"
              priority
            />
          </div>
          <div className="relative h-full flex items-center justify-center">
            <div className="relative z-10 text-center">
              <h1 className="text-[67px] font-bold leading-none text-white">
                {c('hero.title', 'Blog')}
              </h1>
              <p className="mt-4 text-[22px] text-white/80 font-medium">
                {c('hero.subtitle', 'Tips, guides, and stories from the 100 Handy community')}
              </p>
            </div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
              {categories.map((cat) => {
                const isActive = cat === activeCategory;
                const href = cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`;
                return (
                  <Link
                    key={cat}
                    href={href}
                    className={`shrink-0 rounded-full px-5 py-2 text-[14px] font-medium transition-colors ${
                      isActive
                        ? "bg-brand-dark text-white"
                        : "bg-gray-100 text-brand-dark-alt hover:bg-brand-cream"
                    }`}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Post — hidden when filtered category doesn't match */}
        {showFeatured && (
          <section className="bg-white pt-16 pb-4">
            <div className="mx-auto max-w-[1920px] px-8">
              <p className="mb-6 text-[13px] font-semibold uppercase tracking-widest text-brand-terracotta">
                Featured
              </p>
              <Link href={`/blog/${featured.slug}`} className="group block">
                <div className="grid gap-8 overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition-shadow hover:shadow-lg md:grid-cols-2">
                  <div className="relative h-72 md:h-auto">
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-10">
                    <span className="mb-3 inline-block rounded-full bg-brand-cream px-4 py-1 text-[13px] font-semibold text-brand-dark-alt">
                      {featured.category}
                    </span>
                    <h2 className="mb-4 text-[32px] font-bold leading-tight text-brand-dark-alt group-hover:text-brand-terracotta transition-colors">
                      {featured.title}
                    </h2>
                    <p className="mb-6 text-[18px] leading-relaxed text-brand-dark-alt/70">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-[14px] text-brand-dark-alt/50">{featured.date}</p>
                      <span className="text-[15px] font-semibold text-brand-terracotta group-hover:underline">
                        Read More →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Posts Grid */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-[1920px] px-8">
            <h2 className="mb-10 text-[28px] font-bold text-brand-dark-alt">
              {activeCategory === "All"
                ? c('posts.title', 'Latest Articles')
                : activeCategory}
            </h2>

            {filteredPosts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-[18px] text-brand-dark-alt/60">No articles in this category yet.</p>
                <Link href="/blog" className="mt-4 inline-block text-brand-terracotta font-semibold hover:underline">
                  View all articles →
                </Link>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {filteredPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                    <div className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                      <div className="p-6">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="rounded-full bg-brand-cream px-3 py-1 text-[12px] font-semibold text-brand-dark-alt">
                            {post.category}
                          </span>
                          <p className="text-[12px] text-brand-dark-alt/50">{post.date}</p>
                        </div>
                        <h3 className="mb-3 text-[18px] font-bold leading-tight text-brand-dark-alt group-hover:text-brand-terracotta transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-[14px] leading-relaxed text-brand-dark-alt/70 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-dark py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-[42px] font-bold leading-tight text-white">
                {c('cta.title', 'Ready to get the job done?')}
              </h2>
              <p className="mt-4 text-[20px] leading-relaxed text-white/80">
                {c('cta.subtitle', 'Stop reading about it — book a trusted 100 Handy Pro and get your to-do list done today.')}
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button variant="terracotta" size="lg" asChild>
                  <Link href="/dashboard">Book a Task</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-white text-white hover:bg-white/10 hover:text-white">
                  <Link href="/become-100-handy-pro">Become a Pro</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
