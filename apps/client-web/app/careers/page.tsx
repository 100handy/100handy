import { Header, Footer } from "@/components/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | 100 Handy",
  description: "Join the team that is redefining how the world gets work done. We're connecting neighbors, empowering professionals, and simplifying lives.",
};

const values = [
  {
    title: "Dare to Innovate",
    description: "We don't settle for \"good enough.\" We approach every problem with fresh eyes and fearless curiosity. We aren't afraid to break things if it means building something better. Failure is just data gathering for the next big win.",
  },
  {
    title: "Win as One Team",
    description: "We check our egos at the door. We work passionately under one roof (physical or digital), elevating our peers and inspiring trust. We are kind, candid, and assume good intent. When one of us wins, we all win.",
  },
  {
    title: "Own the Outcome",
    description: "We are all responsible for the success of 100 Handy. We don't pass the buck. We take smart risks, make decisions faster, and deliver results that make a lasting impact on our business and the planet.",
  },
  {
    title: "Simplicity is Speed",
    description: "Complex problems require simple solutions. We value momentum over perfection. We strive to strip away the noise and focus on what truly matters to get our mission to more people, faster.",
  },
  {
    title: "Champion the User",
    description: "Our community is the heartbeat of our company. We build solutions that start with the customer's needs. We are a force for good and we make every decision with Clients and Pros in mind.",
  },
];

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-brand-dark py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-[52px] font-bold leading-tight text-white">
                Let&apos;s Build the Future of Local Help.
              </h1>
              <p className="mt-6 text-[22px] leading-relaxed text-white/90">
                Join the team that is redefining how the world gets work done. We&apos;re connecting neighbors, empowering professionals, and simplifying lives - one click at a time.
              </p>
              <div className="mt-10">
                <a
                  href="#open-roles"
                  className="inline-block rounded-lg bg-brand-terracotta px-8 py-4 text-[18px] font-semibold text-white transition-colors hover:bg-brand-terracotta/90"
                >
                  See Open Roles
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-center text-[36px] font-bold text-brand-dark-alt">
                Empowering neighborhoods, one job at a time.
              </h2>
              <div className="space-y-6 text-[18px] leading-relaxed text-brand-dark-alt">
                <p>
                  In 2025, we said: <em>Everyone should have the chance to have their services found more easily, without breaking their head over how to promote themselves.</em> At 100 Handy, we aren&apos;t just fixing squeaky doors; we are supporting those who have been overlooked.
                </p>
                <p>
                  We are on a mission to bring trust and transparency back to home services. By connecting millions of customers with skilled Pros, we are creating flexible income opportunities for thousands and giving people back their most valuable resource: time.
                </p>
                <p>
                  Imagine a world where the friction of daily life - from mounting a TV to moving house - is removed instantly. That is the magic we build every day. Whether you code, design, market, or support, your work here has a tangible impact on real lives.
                </p>
                <p className="font-medium">
                  Join us at 100 Handy, where your ideas travel from the whiteboard to the real world, fast.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-5xl">
              <div className="mb-12 text-center">
                <h2 className="text-[36px] font-bold text-brand-dark-alt">
                  We live by our values.
                </h2>
                <p className="mt-4 text-[18px] italic text-brand-dark-alt/80">
                  Our culture is our operating system. It guides how we hire, how we build, and how we treat each other.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {values.map((value) => (
                  <div key={value.title} className="rounded-2xl bg-white p-8 shadow-sm">
                    <h3 className="mb-4 text-[24px] font-bold text-brand-dark-alt">
                      {value.title}
                    </h3>
                    <p className="text-[16px] leading-relaxed text-brand-dark-alt/80">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <a
                  href="#open-roles"
                  className="inline-block rounded-lg bg-brand-terracotta px-8 py-4 text-[18px] font-semibold text-white transition-colors hover:bg-brand-terracotta/90"
                >
                  See Open Roles
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Culture Section */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-8 text-[36px] font-bold text-brand-dark-alt">
                Flexible Work, Stronger Connections.
              </h2>
              <p className="text-[18px] leading-relaxed text-brand-dark-alt">
                At 100 Handy, we believe work should fit into your life, not the other way around. That&apos;s why we&apos;ve adopted a &quot;Remote-First, Office-Optional&quot; policy. We trust our employees to work where they are most productive, while also creating meaningful moments to come together.
              </p>
              <p className="mt-6 text-[18px] leading-relaxed text-brand-dark-alt">
                Whether you are logging in from a home office in London or a coworking space, we use technology to foster connection, make decisions in real-time, and celebrate wins. It&apos;s the best of both worlds: the freedom of remote work with the fun of in-person retreats.
              </p>
            </div>
          </div>
        </section>

        {/* Open Roles Section */}
        <section id="open-roles" className="bg-gray-50 py-20">
          <div className="mx-auto max-w-[1920px] px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-8 text-[36px] font-bold text-brand-dark-alt">
                Open Roles
              </h2>
              <p className="mb-8 text-[18px] leading-relaxed text-brand-dark-alt/80">
                We&apos;re always looking for talented people to join our team. Check back soon for open positions, or reach out to us directly.
              </p>
              <a
                href="mailto:careers@100handy.com"
                className="inline-block rounded-lg border-2 border-brand-terracotta px-8 py-4 text-[18px] font-semibold text-brand-terracotta transition-colors hover:bg-brand-terracotta hover:text-white"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
