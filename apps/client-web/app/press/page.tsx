import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import {
  PressHero,
  GetInTouch,
  PressReleases,
  PressKit,
  MediaResources,
  WhatsHappening,
} from "@/components/press";

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

