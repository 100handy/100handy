import { Header, Footer } from "@/components/layout";
import {
  TaskerHero,
  FlexibleWork,
  WhatIsHandy,
  GettingStarted,
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
        <TaskerFAQs />
      </main>
      <Footer />
    </div>
  );
}
