"use client";

import Image from "next/image";
import { Check } from "lucide-react";

interface ContentSectionProps {
  title: string;
  longDescription: string;
  benefits?: Array<{ title: string; description: string }>;
  tasks?: Array<{ title: string; description: string }>;
  contentImage?: string;
}

export function ContentSection({ title, longDescription, benefits, tasks, contentImage }: ContentSectionProps): React.JSX.Element {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        {/* Title */}
        <h2 className="mb-10 text-[29px] font-bold text-brand-dark-alt">
          {title} Services
        </h2>

        {/* Main content grid */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left column - Text content */}
          <div>
            <h3 className="mb-6 text-[39px] font-bold leading-tight text-brand-dark-alt">
              Need Help with {title}?
              <br />
              100Handy Has You Covered!
            </h3>
            <p className="mb-8 text-[20px] leading-relaxed text-brand-dark-alt">
              {longDescription}
            </p>

            {benefits && benefits.length > 0 && (
              <>
                <h3 className="mb-8 text-[39px] font-bold leading-tight text-brand-dark-alt">
                  Why Choose 100Handy for {title}?
                </h3>
                {benefits.map((benefit, index) => (
                  <p key={index} className="mb-4 text-[20px] leading-relaxed text-brand-dark-alt">
                    <span className="font-bold">{benefit.title}</span> – {benefit.description}
                  </p>
                ))}
              </>
            )}
          </div>

          {/* Right column - Image or decorative card */}
          {contentImage ? (
            <div className="relative h-[351px] overflow-hidden rounded-3xl">
              <Image
                src={contentImage}
                alt={title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          ) : (
            <div className="relative h-[351px] overflow-hidden rounded-3xl bg-brand-dark">
              <div className="absolute left-[15%] top-[25%] h-[101px] w-[101px] rounded-full bg-[#5A6357]/50" />
              <div
                className="absolute bottom-[15%] right-[20%] h-[205px] w-[238px] bg-[#5A6357]/50"
                style={{
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                }}
              />
            </div>
          )}
        </div>

        {/* What Kind of Tasks section - only show when tasks exist */}
        {tasks && tasks.length > 0 && (
          <div className="mt-16">
            <h3 className="mb-6 text-[39px] font-bold leading-tight text-brand-dark-alt">
              What Kind of {title}
              <br />
              Can a 100 Handy Pro Help With?
            </h3>
            <p className="mb-6 text-[20px] text-brand-dark-alt">
              100 Handy Pros are skilled in a variety of {title.toLowerCase()} services, including:
            </p>

            <div className="space-y-4">
              {tasks.map((task, index) => (
                <p key={index} className="text-[20px] text-brand-dark-alt">
                  <Check className="mr-2 inline h-5 w-5 text-brand-dark-alt" strokeWidth={2} />
                  <span className="font-bold">{task.title}</span> – {task.description}
                </p>
              ))}
            </div>

            <p className="mt-8 text-[20px] text-brand-dark-alt">
              No wonder more people trust 100Handy as the go-to solution for professional, affordable services that fit your schedule.
            </p>

            <p className="mt-6 text-[20px] text-brand-dark-alt">
              A licensed contractor? Be sure to check your 100 Handy Pro's qualifications when booking to ensure they meet your project's requirements.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
