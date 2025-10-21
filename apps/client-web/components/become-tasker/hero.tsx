"use client";

import Image from "next/image";
import { Check } from "lucide-react";

export function TaskerHero(): React.JSX.Element {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_1fr]">
          {/* Left side - Phone mockup with terracotta background */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative w-fit rounded-3xl bg-brand-terracotta px-10 py-6">
              <Image
                src="/images/phone-mockup.png"
                alt="100Handy Tasker App"
                width={320}
                height={520}
                className="h-auto w-full"
              />
            </div>
          </div>

          {/* Right side - Account Created info */}
          <div className="flex flex-col justify-start pt-4">
            <div className="mb-8 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-sage">
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </div>
              <h1 className="text-[45px] font-bold leading-none text-brand-dark-alt">
                Account Created
              </h1>
            </div>

            <h2 className="mb-6 text-[35px] font-bold text-brand-dark-alt">
              Next Steps:
            </h2>

            <div className="space-y-4">
              <p className="text-[23px] font-medium leading-relaxed text-brand-dark-alt">
                1. Download the tasker app and<br />
                sign in to your account.
              </p>

              <p className="text-[23px] font-medium leading-relaxed text-brand-dark-alt">
                2. Complete and submit your<br />
                profile for verification.
              </p>

              <p className="text-[23px] font-medium leading-relaxed text-brand-dark-alt">
                3. Once it's approved, start earning<br />
                money your way!
              </p>
            </div>

            {/* App Store Badges */}
            <div className="mt-8 flex gap-3">
              <a href="#" className="block">
                <div className="flex h-14 w-44 items-center justify-center rounded-lg bg-black">
                  <span className="text-sm font-bold text-white">App Store</span>
                </div>
              </a>
              <a href="#" className="block">
                <div className="flex h-14 w-44 items-center justify-center rounded-lg bg-black">
                  <span className="text-sm font-bold text-white">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
