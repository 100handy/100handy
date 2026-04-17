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

export const metadata: Metadata = {
  title: "Press | 100 Handy",
};

export default function PressPage(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <PressHero />
        <GetInTouch />
        <PressReleases />
        <PressKit />
        <MediaResources />
        <WhatsHappening />
      </main>
      <Footer />
    </div>
  );
}

