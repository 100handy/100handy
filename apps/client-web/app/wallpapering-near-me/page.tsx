import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { getPageContent, getPageSeoMetadata } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("wallpapering-near-me", {
    title: "Wallpapering Near Me | 100 Handy",
    description:
      "Find local wallpaper installation help, compare trusted pros, and book wallpapering services through 100 Handy.",
    canonicalUrl: "/wallpapering-near-me",
  });
}

function splitLines(value: string): string[] {
  return value.split("\n").filter(Boolean);
}

export default async function WallpaperingNearMe() {
  const c = await getPageContent("wallpapering-near-me");

  const taskers = [1, 2, 3, 4, 5, 6].map((index) => ({
    name: c(`featured.item_${index}_name`, ["Maria R.", "Lucas P.", "Marcus R.", "Lore V.", "Ahmet P.", "Lisa O."][index - 1]!),
    tasks: c(`featured.item_${index}_tasks`, ["90 tv mounting tasks", "31 tv mounting tasks", "90 tv mounting tasks", "64 tv mounting tasks", "31 tv mounting tasks", "73 tv mounting tasks"][index - 1]!),
    rating: c(`featured.item_${index}_rating`, "5.0"),
    reviews: c(`featured.item_${index}_reviews`, "124"),
    description: c(
      `featured.item_${index}_description`,
      [
        "From start to finish, I communicate clearly and work carefully to deliver exactly what you need",
        "Friendly, punctual, and experienced—I focus on providing quality service and customer satisfaction every time.",
        "From start to finish, I communicate clearly and work carefully to deliver exactly what you need",
        "Whether it's a quick fix or a larger project, I'm committed to delivering dependable, professional results.",
        "Friendly, punctual, and experienced—I focus on providing quality service and customer satisfaction every time.",
        "With over 6 years of experience, I bring the right tools and skills to ensure your job is completed safely.",
      ][index - 1]!
    ),
  }));

  const faqItems = [1, 2, 3].map((index) => ({
    question: c(
      `faq.item_${index}_question`,
      [
        "How much will wallpapering near me cost?",
        "How long does wallpapering take?",
        "What's included in 100Handy wallpaper task?",
      ][index - 1]!
    ),
    answer: c(
      `faq.item_${index}_answer`,
      [
        "The cost of wallpapering depends on various factors including the size of the room, type of wallpaper, and complexity of the project. On average, you can expect to pay between £30-£80 per hour for professional wallpapering services.",
        "The time required for wallpapering varies based on room size and complexity. A standard bedroom typically takes 4-6 hours, while larger rooms or complex patterns may take 1-2 days.",
        "Our wallpaper service includes surface preparation, professional wallpaper application, trimming, and cleanup. You provide the wallpaper, and our skilled 100 Handy Pros handle the rest!",
      ][index - 1]!
    ),
  }));

  const blogPosts = [1, 2, 3, 4, 5, 6].map((index) => ({
    title: c(`blog.item_${index}_title`, "Smart Ways to Refresh Your Walls"),
    description: c(`blog.item_${index}_description`, "Wallpapering can easily transform any room in your home, enhancing its beauty..."),
    image: c(`blog.item_${index}_image`, `/images/blog-${index}.png`),
  }));
  const reviews = [1, 2, 3, 4, 5, 6].map((index) => ({
    name: c(`reviews.item_${index}_name`, "Michelle D."),
    text: c(
      `reviews.item_${index}_text`,
      "Thanks to Ken for a great and efficient job fixing our fridge! He knew the problem immediately and worked efficiently and effectively!"
    ),
  }));

  const relatedServices = [1, 2, 3, 4, 5, 6].map((index) => ({
    name: c(
      `related.item_${index}_name`,
      ["Furniture Rearranging", "Blinds Repair", "Ceiling Fan Installation", "Drywall Repair", "Door Repair", "Window Repair"][index - 1]!
    ),
    image: c(`related.item_${index}_image`, `/images/service-${index}.png`),
  }));

  const stats = [1, 2, 3].map((index) => ({
    value: c(`stats.item_${index}_value`, ["1.4 million", "4.5 Stars", "500K Reviews"][index - 1]!),
    label: c(`stats.item_${index}_label`, ["Customers", "Average Rating", "Verified"][index - 1]!),
  }));

  const seoBlocks = [1, 2, 3, 4].map((index) => ({
    title: c(
      `seo.item_${index}_title`,
      ["Where money", "The expertise you need", "When day service available", "There's a pro map"][index - 1]!
    ),
    description: c(
      `seo.item_${index}_description`,
      [
        "Whatever it is that needs doing, chances are great that there's a 100 Handy Pro in London who'd love to help you with it! Since there's a wide variety of home improvement tasks available, here's a brief list of the most popular ones on 100handy:",
        "Before hiring a 100 Handy Pro on 100handy, check out their reviews, ratings, and the tasks they've completed for other customers. Get more information on each 100 Handy Pro by going to their unique profile page. When you like what you see, pick the 100 Handy Pro that's right for you, and they'll get to work on your home project!",
        "Same-day booking is available on 100handy. You can also browse prices and choose a time that works best for you and your 100 Handy Pro. Need help? Rely on our dedicated customer support team to assist with any questions. Communication with your 100 Handy Pro is easy on 100handy—you can chat to sort out the details before booking, or contact them after the job.",
        "Convenient services that fit your schedule and budget are just a click away. You can book online, knowing that you're backed by our Happiness Pledge.",
      ][index - 1]!
    ),
  }));

  return (
    <>
      <Header />

      <main className="min-h-screen">
        <div className="bg-white py-4 border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <p className="text-brand-terracotta text-sm font-medium">
              <Link href="/" className="hover:underline">Home</Link> &gt; <Link href="/services-by-city" className="hover:underline">Locations</Link> &gt; <Link href="/locations/london" className="hover:underline">London</Link> &gt; Wallpapering Near Me
            </p>
          </div>
        </div>

        <section className="bg-brand-dark py-12 lg:py-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
                <h1 className="text-brand-dark-alt font-bold text-4xl mb-4 leading-tight">
                  {splitLines(c("hero.title", "Wallpapering Near\nMe")).map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </h1>
                <p className="text-brand-dark-alt mb-6 text-base leading-relaxed">
                  {c("hero.subtitle", "Transform your space with expert wallpapering! Find a local 100Handy pro for quick and seamless wall decor.")}
                </p>
                <div className="mb-4">
                  <label htmlFor="zipCode" className="text-brand-dark-alt text-sm font-semibold mb-2 block">
                    {c("hero.zip_label", "ZIP code")}
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    placeholder={c("hero.zip_placeholder", "Enter your zip code")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-transparent transition-all"
                  />
                </div>
                <Button variant="terracotta" size="full">
                  {c("hero.cta_text", "Get quote in secs")}
                </Button>
              </div>

              <div className="text-white space-y-5">
                {[c("hero.feature_1", "Skilled 100 Handy Pros provide precise and flawless wallpaper application."), c("hero.feature_2", "100 Handy Pro can handle all types of wallpaper patterns and textures.")].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-white mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-lg leading-relaxed">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h2 className="text-brand-dark-alt font-bold text-3xl lg:text-4xl mb-12">
              {c("featured.title", "Top Wallpaper Services near you")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {taskers.map((tasker, index) => (
                <div key={index} className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-brand-terracotta">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full overflow-hidden flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-brand-dark font-bold text-xl mb-1">{tasker.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-brand-dark text-sm font-medium">
                          {tasker.rating} ({tasker.reviews} reviews)
                        </span>
                      </div>
                      <p className="text-brand-dark font-semibold text-xs">{tasker.tasks}</p>
                    </div>
                  </div>
                  <p className="text-brand-dark text-sm mb-4 leading-relaxed">{tasker.description}</p>
                  <Link href="/sign-up" className="text-brand-terracotta font-medium text-sm hover:underline inline-block">
                    Book now
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button variant="terracotta-outline" size="md">
                {c("featured.cta_text", "See all")}
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h2 className="text-brand-dark-alt font-bold text-3xl lg:text-4xl mb-12 text-center">
              {splitLines(c("satisfaction.title", "Your satisfaction,\nguaranteed")).map((line, index) => (
                <span key={index}>
                  {index === 1 ? <span className="text-brand-terracotta">{line}</span> : line}
                  {index === 0 ? " " : null}
                </span>
              ))}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-brand-sage rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={index === 1 ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : index === 2 ? "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" : "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"} />
                    </svg>
                  </div>
                  <h3 className="text-brand-dark font-bold text-2xl mb-3">
                    {c(`satisfaction.item_${index}_title`, ["Vetted Pros", "Happiness Pledge", "Dedicated Support"][index - 1]!)}
                  </h3>
                  <p className="text-brand-dark text-lg leading-relaxed">
                    {c(
                      `satisfaction.item_${index}_description`,
                      [
                        "Pros are always background checked before joining the platform.",
                        "If you're not satisfied, we'll work to make it right.",
                        "Friendly service when you need us — every day of the week.",
                      ][index - 1]!
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h2 className="text-brand-dark-alt font-bold text-3xl lg:text-4xl mb-10">
              {c("faq.title", "Frequently asked questions about Wallpaper Installation")}
            </h2>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <details key={index} className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <summary className="flex justify-between items-center cursor-pointer p-6 list-none">
                    <span className="text-brand-dark-alt font-semibold text-lg pr-4">{item.question}</span>
                    <svg className="w-6 h-6 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-brand-dark leading-relaxed">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h2 className="text-brand-dark-alt font-bold text-3xl lg:text-4xl mb-12">
              {c("reviews.title", "See what happy customers are saying about handyman services in London")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {reviews.map((review, index) => (
                <div key={index} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <h4 className="text-brand-dark font-bold text-xl mb-3">{review.name}</h4>
                  <p className="text-brand-dark text-base leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button variant="terracotta-outline" size="md">
                {c("reviews.cta_text", "See all")}
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h2 className="text-brand-dark-alt font-bold text-3xl lg:text-4xl mb-6">
              {c("blog.title", "Explore our blog")}
            </h2>
            <p className="text-brand-dark-alt mb-10 text-lg">
              {c("blog.intro", "We're unlocking community knowledge in a new way. Experts add insights directly into each article, started with the help of AI.")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-brand-dark-alt font-bold text-lg mb-3 leading-tight">{post.title}</h3>
                    <p className="text-brand-dark-alt text-sm mb-4 leading-relaxed">{post.description}</p>
                    <Link href="/blog" className="text-brand-terracotta font-semibold text-sm hover:underline inline-flex items-center gap-1">
                      Read more
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h2 className="text-brand-dark-alt font-bold text-3xl lg:text-4xl mb-16 text-center">
              {c("stats.title", "Join millions in enjoying easy Wallpaper Installation")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-brand-terracotta rounded-full flex items-center justify-center shadow-xl">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d={index === 0 ? "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" : index === 1 ? "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" : "M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z"} />
                    </svg>
                  </div>
                  <h3 className="text-brand-dark-alt font-bold text-4xl mb-2">{stat.value}</h3>
                  <p className="text-brand-dark text-lg">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h2 className="text-brand-dark-alt font-bold text-3xl lg:text-4xl mb-10">
              {c("related.title", "You Might Also Like")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {relatedServices.slice(0, 4).map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <div className="relative h-40 overflow-hidden">
                    <Image src={service.image} alt={service.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-brand-dark-alt font-bold text-lg">{service.name}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {relatedServices.slice(4, 6).map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <div className="relative h-40 overflow-hidden">
                    <Image src={service.image} alt={service.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(min-width: 640px) 50vw, 100vw" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-brand-dark-alt font-bold text-lg">{service.name}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button variant="terracotta-outline" size="md">
                {c("related.cta_text", "See more services")}
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <h2 className="text-brand-dark-alt font-bold text-3xl lg:text-4xl mb-6">
              {c("seo.title", "Handyman in London")}
            </h2>

            <div className="prose prose-lg max-w-none">
              {seoBlocks.map((block, index) => (
                <div key={index}>
                  <h3 className="text-brand-dark-alt font-bold text-2xl mb-4 mt-8">{block.title}</h3>
                  <p className="text-brand-dark mb-6 leading-relaxed">{block.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
