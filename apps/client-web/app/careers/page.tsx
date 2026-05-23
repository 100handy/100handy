import { Header, Footer } from "@/components/layout";
import { ValuesCarousel } from "@/components/careers";
import { getPageContent, getPageSeoMetadata } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata('careers', {
    title: "Careers | 100 Handy",
    description: "Join the team that is redefining how the world gets work done. We're connecting neighbors, empowering professionals, and simplifying lives.",
    canonicalUrl: "/careers",
  })
}


export default async function CareersPage() {
  const c = await getPageContent('careers')
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-brand-dark py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-[52px] font-bold leading-tight text-white">
                {c('hero.title', "Let's Build the Future of Local Help.")}
              </h1>
              <p className="mt-6 text-[22px] leading-relaxed text-white/90">
                {c('hero.paragraph', "Join the team that is redefining how the world gets work done. We're connecting neighbors, empowering professionals, and simplifying lives - one click at a time.")}
              </p>
              <div className="mt-10">
                <Button variant="terracotta" size="lg" asChild>
                  <a href="#open-roles">See Open Roles</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-center text-[36px] font-bold text-brand-dark-alt">
                {c('mission.title', 'Empowering neighborhoods, one job at a time.')}
              </h2>
              <div className="space-y-6 text-[18px] leading-relaxed text-brand-dark-alt">
                <p>
                  {c('mission.paragraph_1', "In 2025, we said: Everyone should have the chance to have their services found more easily, without breaking their head over how to promote themselves. At 100 Handy, we aren't just fixing squeaky doors; we are supporting those who have been overlooked.")}
                </p>
                <p>
                  {c('mission.paragraph_2', 'We are on a mission to bring trust and transparency back to home services. By connecting millions of customers with skilled Pros, we are creating flexible income opportunities for thousands and giving people back their most valuable resource: time.')}
                </p>
                <p>
                  {c('mission.paragraph_3', 'Imagine a world where the friction of daily life - from mounting a TV to moving house - is removed instantly. That is the magic we build every day. Whether you code, design, market, or support, your work here has a tangible impact on real lives.')}
                </p>
                <p className="font-medium">
                  {c('mission.paragraph_4', 'Join us at 100 Handy, where your ideas travel from the whiteboard to the real world, fast.')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section - Carousel */}
        <ValuesCarousel />

        {/* Culture Section */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-8 text-[36px] font-bold text-brand-dark-alt">
                {c('culture.title', 'Flexible Work, Stronger Connections.')}
              </h2>
              <p className="text-[18px] leading-relaxed text-brand-dark-alt">
                {c('culture.paragraph_1', 'At 100 Handy, we believe work should fit into your life, not the other way around. That\'s why we\'ve adopted a "Remote-First, Office-Optional" policy. We trust our employees to work where they are most productive, while also creating meaningful moments to come together.')}
              </p>
              <p className="mt-6 text-[18px] leading-relaxed text-brand-dark-alt">
                {c('culture.paragraph_2', "Whether you are logging in from a home office in London or a coworking space, we use technology to foster connection, make decisions in real-time, and celebrate wins. It's the best of both worlds: the freedom of remote work with the fun of in-person retreats.")}
              </p>
            </div>
          </div>
        </section>

        {/* Open Roles Section */}
        <section id="open-roles" className="bg-gray-50 py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-8 text-[36px] font-bold text-brand-dark-alt">
                {c('roles.title', 'Open Roles')}
              </h2>
              <p className="mb-8 text-[18px] leading-relaxed text-brand-dark-alt/80">
                {c('roles.paragraph', "We're always looking for talented people to join our team. Check back soon for open positions, or reach out to us directly.")}
              </p>
              <Button variant="terracotta-outline" size="lg" asChild>
                <a href="mailto:careers@100handy.com">Contact Us</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
