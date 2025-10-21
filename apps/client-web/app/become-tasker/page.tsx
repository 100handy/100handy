import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import {
  TaskerHero,
  FlexibleWork,
  WhatIsHandy,
  GettingStarted,
  TaskerTestimonial,
  TaskerFAQs,
} from "@/components/become-tasker";

export default function BecomeTaskerPage(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <TaskerHero />
        <FlexibleWork />
        <WhatIsHandy />
        <GettingStarted />
        <TaskerTestimonial />
        <TaskerFAQs />
      </main>
      <Footer />
    </div>
  );
}

