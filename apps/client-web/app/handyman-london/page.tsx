import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { HelpIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getPageContent, getPageSeoMetadata } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("handyman-london", {
    title: "Handyman Services in London | 100 Handy",
    description:
      "Find local handyman services in London, compare trusted pros, and book help through 100 Handy.",
    canonicalUrl: "/handyman-london",
  });
}

function splitLines(value: string): string[] {
  return value.split("\n").filter(Boolean);
}

export default async function HandymanLondonPage() {
  const c = await getPageContent("handyman-london");

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

  const seoBlocks = [1, 2, 3, 4].map((index) => ({
    title: c(
      `seo.item_${index}_title`,
      ["Save money", "The expertise you need", "Same-day service available", "There's a better way"][index - 1]!
    ),
    description: c(
      `seo.item_${index}_description`,
      [
        "Hiring a skilled worker to complete a job may sound costly, but finishing a project correctly the first time is far more economical than wasting time and materials while attempting to learn on the job.",
        "Whatever type of home maintenance service you're looking for, you'll find the right handyman in London on 100Handy. From simple tasks like fixture repair to more complex projects like installing new kitchen cabinets, there's a Pro with the experience you need.",
        "Not everyone has repair jobs in an emergency, but if damage threatens your home's safety or security, you should address it immediately. When you shop around for local handyman services, you'll find Pros who provide last-minute appointments for urgent cases.",
        "Local handyman services are easy to find on 100Handy. You can chat with, hire, schedule, pay, and even tip your Pro — all on the secure 100Handy website or app.",
      ][index - 1]!
    ),
  }));
  const reviews = [1, 2, 3, 4, 5, 6].map((index) => ({
    name: c(`reviews.item_${index}_name`, "Michelle D."),
    service: c(`reviews.item_${index}_service`, "Handyman"),
    text: c(
      `reviews.item_${index}_text`,
      "Thanks to Ken for a great and efficient job fixing our fridge! He knew the problem immediately and worked efficiently and effectively!"
    ),
  }));

  const handymanServices = [1, 2, 3, 4, 5, 6, 7].map((index) =>
    c(
      `services.item_${index}`,
      [
        "Painting and drywall",
        "Door and lock installation or repair",
        "Tile installation and backsplash installation",
        "Furniture assembly",
        "Deck and stair repair",
        "Bathroom plumbing repair",
        "Window installation and repair roofing",
      ][index - 1]!
    )
  );

  const relatedServices = [1, 2, 3, 4, 5, 6].map((index) => ({
    name: c(
      `links.related_${index}_name`,
      ["Furniture Removal", "Hang Pictures", "Tree Trimming", "Electrical Help", "Heavy Lifting", "Handyman"][index - 1]!
    ),
    href: c(`links.related_${index}_link`, "/all-services"),
  }));
  const popularServices = [1, 2, 3, 4, 5].map((index) => ({
    name: c(
      `links.popular_${index}_name`,
      ["TV Mounting", "Furniture Assembly", "House Cleaning", "Help Moving", "Lawn Mowing"][index - 1]!
    ),
    href: c(`links.popular_${index}_link`, "/all-services"),
  }));
  const otherServices = [1, 2, 3, 4, 5].map((index) => ({
    name: c(
      `links.other_${index}_name`,
      ["Furniture Disassembly", "Move Out Cleaning", "Landscaping Services", "Help Moving", "Plumbing"][index - 1]!
    ),
    href: c(`links.other_${index}_link`, "/all-services"),
  }));

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <div className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-8">
          <p className="text-brand-terracotta text-sm">
            <Link href="/" className="hover:underline">Home</Link> &gt; <Link href="/services-by-city" className="hover:underline">Locations</Link> &gt; <Link href="/locations/london" className="hover:underline">London</Link> &gt; Handyman
          </p>
        </div>
      </div>

      <section className="bg-brand-dark py-16">
        <div className="max-w-[1920px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h1 className="text-white font-bold text-[44px] leading-tight mb-6">
                {splitLines(c("hero.title", "Get Matched With\nHandyman Services in\nLondon")).map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </h1>

              <p className="text-white text-[24px] mb-6 leading-relaxed">
                {splitLines(c("hero.subtitle", `If you're looking for local handyman services to\nhelp with home maintenance projects, just\nsearch "handyman near me" on 100Handy.`)).map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>

              <div className="flex items-center gap-2 mb-8">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white text-[24px] font-semibold">
                  {c("hero.reviews_label", "500k Reviews")}
                </span>
              </div>

              <div className="space-y-4 mb-8">
                {[c("hero.feature_1", "Browse 2,500+ handyman Pros with a variety of\nskills."), c("hero.feature_2", "All Pros bring their own tools and equipment.")].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-white text-[24px]">
                      {splitLines(feature).map((line, lineIndex) => (
                        <span key={lineIndex}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>

              <Button variant="terracotta" size="lg" className="font-semibold">
                {c("hero.cta_text", "Book Now")}
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

      <section className="bg-white py-20">
        <div className="max-w-[1920px] mx-auto px-8">
          <h2 className="text-brand-dark-alt font-bold text-[37px] mb-12">
            {c("featured.title", "3744 featured Handyman Pros in London")}
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
              {c("featured.cta_text", "Search all 100 Handy Pros")}
            </button>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-20">
        <div className="max-w-[1920px] mx-auto px-8">
          <h2 className="text-brand-dark-alt font-bold text-[44px] mb-16 text-center">
            {c("satisfaction.title", "Your satisfaction, guaranteed")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-8">
            {[1, 2, 3].map((index) => (
              <div key={index}>
                <h3 className="text-brand-dark-alt font-bold text-[32px] mb-4">
                  {c(`satisfaction.item_${index}_title`, ["Happiness Pledge", "Vetted Pros", "Dedicated Support"][index - 1]!)}
                </h3>
                <p className="text-brand-dark-alt text-[21px] leading-relaxed whitespace-pre-line">
                  {c(
                    `satisfaction.item_${index}_description`,
                    [
                      "If you're not satisfied, we'll work\nto make it right.",
                      "Pros are always background\nchecked before joining the\nplatform.",
                      "Friendly service when you need us\n— every day of the week.",
                    ][index - 1]!
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <svg className="w-9 h-10 text-brand-dark-alt" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-brand-dark-alt font-semibold text-[23px]">
              {c("satisfaction.pledge_label", "Happiness pledge")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-[1920px] mx-auto px-8">
          <h2 className="text-brand-dark-alt font-bold text-[44px] mb-12">
            {c("faq.title", "Frequently asked questions about Handyman services in London")}
          </h2>

          <div className="border-t border-gray-300">
            <details className="border-b border-gray-300 group">
              <summary className="w-full flex justify-between items-center py-6 text-left hover:bg-gray-50 transition-colors cursor-pointer list-none">
                <span className="text-brand-dark-alt font-semibold text-[21px]">
                  {c("faq.question", "Q: What do most handyman charge per hour in London?")}
                </span>
                <svg className="w-6 h-6 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="py-6">
                <p className="text-brand-dark-alt text-[18px] leading-relaxed">
                  {c("faq.answer", "Handyman rates in London typically range from £30-£60 per hour, depending on the complexity of the task and the experience level of the professional.")}
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section className="bg-brand-dark py-20 relative">
        <div className="max-w-[1920px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="bg-white rounded-2xl p-12 shadow-2xl">
              <h2 className="text-brand-dark-alt font-bold text-[33px] mb-10">
                {c("how_it_works.title", "How it works")}
              </h2>

              <div className="space-y-8">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-[51px] h-[51px] rounded-full flex items-center justify-center flex-shrink-0 ${index === 1 ? "bg-brand-terracotta" : "bg-brand-sage"}`}>
                      <span className="text-white text-[33px] font-bold">{index}</span>
                    </div>
                    <p className="text-brand-dark-alt text-[20px] leading-relaxed pt-2 whitespace-pre-line">
                      {c(
                        `how_it_works.step_${index}`,
                        [
                          "Choose a 100 Handy Pro by price,\nskills, and reviews.",
                          "Schedule a Pro as early\nas today.",
                          "Chat, pay, tip, and review,\nall in one place.",
                        ][index - 1]!
                      )}
                    </p>
                  </div>
                ))}
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

      <section className="bg-white py-20">
        <div className="max-w-[1920px] mx-auto px-8">
          <h2 className="text-brand-dark-alt font-bold text-[44px] mb-12">
            {c("reviews.title", "See what happy customers are saying about handyman services in London")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {reviews.map((review, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <h4 className="text-brand-dark-alt font-bold text-[24px] mb-2">{review.name}</h4>
                <p className="text-brand-dark-alt text-[24px] mb-3">{review.service}</p>
                <p className="text-brand-dark-alt text-[21px] leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="terracotta" size="lg" className="font-semibold">
              {c("reviews.cta_text", "Get started")}
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-20">
        <div className="max-w-[1920px] mx-auto px-8">
          <h2 className="text-brand-dark-alt font-bold text-[37px] mb-8">
            {c("seo.title", "Handyman in London")}
          </h2>

          <div className="space-y-8">
            {seoBlocks.map((block, index) => (
              <div key={index}>
                <h3 className="text-brand-dark-alt font-bold text-[29px] mb-3">{block.title}</h3>
                <p className="text-brand-dark-alt text-[21px] leading-relaxed">{block.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-[1920px] mx-auto px-8">
          <h2 className="text-brand-dark-alt font-bold text-[37px] mb-6">
            {c("services.title", "Handyman Services on 100Handy")}
          </h2>

          <p className="text-brand-dark-alt text-[21px] mb-6 leading-relaxed">
            {c("services.intro", "London handyman services include (but are not limited to):")}
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
            {c("services.closing", "Discuss the services you need with your Pro. There's a good chance they can check off everything on your home maintenance list.")}
          </p>
        </div>
      </section>

      <section className="bg-gray-100 py-20">
        <div className="max-w-[1920px] mx-auto px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-16">
            {[
              { title: c("links.related_title", "Related Services"), items: relatedServices },
              { title: c("links.popular_title", "Popular Services in London"), items: popularServices },
              { title: c("links.other_title", "Other Services"), items: otherServices },
            ].map((group, index) => (
              <div key={index}>
                <h3 className="text-brand-dark-alt font-bold text-[22px] mb-6">{group.title}</h3>
                <ul className="space-y-3">
                  {group.items.map((service, itemIndex) => (
                    <li key={itemIndex}>
                      <Link href={service.href} className="text-brand-dark-alt text-[22px] hover:text-brand-terracotta transition-colors">
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/all-services" className="text-brand-terracotta text-[22px] font-semibold inline-block mt-6 hover:underline">
                  {c("links.cta_text", "See more")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <button aria-label="Get help" className="fixed bottom-6 left-6 bg-brand-sage text-white p-4 rounded-full shadow-lg hover:bg-brand-sage/85 transition-colors flex items-center justify-center">
        <HelpIcon />
      </button>
    </div>
  );
}
