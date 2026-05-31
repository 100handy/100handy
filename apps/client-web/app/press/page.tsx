import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import {
  PressHero,
  GetInTouch,
  PressReleases,
  PressKit,
  MediaResources,
  WhatsHappening,
} from "@/components/press";
import { getPageContent, getPageSeoMetadata } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("press", {
    title: "Press | 100 Handy",
    description:
      "Press resources, media contacts, and company updates from 100 Handy.",
    canonicalUrl: "/press",
  });
}

export default async function PressPage(): Promise<React.JSX.Element> {
  const c = await getPageContent("press");
  const contacts = [1, 2, 3, 4].map((index) => ({
    category: c(
      `contact.item_${index}_title`,
      [
        "PR Inquiries or Brand Partnerships",
        "Social Media or Influencer Collaborations",
        "Blog Inquiries",
        "Business Partnerships",
      ][index - 1]!
    ),
    email: c(
      `contact.item_${index}_email`,
      [
        "press@100handy.com",
        "social@100handy.com",
        "blog@100handy.com",
        "partnership@100handy.com",
      ][index - 1]!
    ),
  }));
  const releases = [1, 2, 3].map((index) => ({
    date: c(
      `releases.item_${index}_date`,
      ["September 16, 2025", "August 5, 2025", "June 18, 2025"][index - 1]!
    ),
    title: c(
      `releases.item_${index}_title`,
      [
        "100Handy for Businesses Powers Retail Growth with On-Demand Assembly and Installation",
        "100Handy Expands Nationwide, Bringing Trusted Home Services Across the UK and Europe",
        "100Handy Reinvents the Customer Experience with Integrated Solutions for Partners",
      ][index - 1]!
    ),
    link: c(`releases.item_${index}_link`, "#"),
  }));
  const resources = [1, 2, 3, 4, 5, 6].map((index) => ({
    title: c(
      `resources.item_${index}_title`,
      [
        "Download Logos",
        "Download B-Roll",
        "Download Fact Sheet",
        "Download 100 Handy Pro Images",
        "Download Product Images",
        "Download Client Images",
      ][index - 1]!
    ),
    href: c(`resources.item_${index}_link`, "mailto:press@100handy.com"),
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <PressHero
          title={c("hero.title", "Press")}
          image={c("hero.image", "/images/press/pressheroimage.jpeg")}
        />
        <GetInTouch
          title={c("contact.title", "Get in Touch")}
          intro={c(
            "contact.intro",
            "The 100Handy team is available to connect for media inquiries and partnership opportunities. If you'd like to get in touch, please reach out to the appropriate contact below."
          )}
          contacts={contacts}
        />
        <PressReleases
          title={c("releases.title", "Press Release Highlights")}
          ctaText={c("releases.cta_text", "Explore")}
          releases={releases}
        />
        <PressKit
          title={c("kit.title", "Press Kit")}
          description={c(
            "kit.description",
            "Download 100Handy logos, brand visuals, and app screenshots."
          )}
          ctaText={c("kit.cta_text", "Download press kit")}
        />
        <MediaResources
          title={c("resources.title", "Media Resources")}
          introOne={c(
            "resources.intro_1",
            "A collection of brand assets for your use."
          )}
          introTwo={c(
            "resources.intro_2",
            "All logo and media usage must follow the 100 Handy brand guidelines. For specific media requests, please contact press@100handy.com"
          )}
          resources={resources}
        />
        <WhatsHappening
          title={c("story.title", "What's happening at 100 Handy")}
          description={c(
            "story.description",
            "We bring people together. It's at the heart of everything we do. We know that for every person who needs their radiator fixed before winter, the nursery set up for their newborn, or a TV mounted in time for game day, there's someone nearby who is ready, willing, and able to help."
          )}
          image={c("story.image", "/images/press/we-bring-people-together.jpeg")}
          ctaText={c("story.cta_text", "Read the Blog")}
        />
      </main>
      <Footer />
    </div>
  );
}
