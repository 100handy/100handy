"use client";

const contactInfo = [
  {
    category: "PR Inquiries or Brand Partnerships",
    email: "press@100handy.com",
  },
  {
    category: "Social Media or Influencer Collaborations",
    email: "social@100handy.com",
  },
  {
    category: "Blog Inquiries",
    email: "blog@100handy.com",
  },
  {
    category: "Business Partnerships",
    email: "partnership@100handy.com",
  },
];

export function GetInTouch(): React.JSX.Element {
  return (
    <section className="bg-[#F5F0E8] py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-12 text-center text-[32px] font-bold text-brand-dark-alt">
          Get in Touch
        </h2>

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_2fr]">
          {/* Left side - Intro text */}
          <div>
            <p className="text-[20px] leading-relaxed text-brand-dark-alt">
              The 100Handy team is available to connect for media inquiries and partnership opportunities. If you'd like to get in touch, please reach out to the appropriate contact below.
            </p>
          </div>

          {/* Right side - Contact grid */}
          <div className="grid gap-x-16 gap-y-8 md:grid-cols-2">
            {contactInfo.map((contact, index) => (
              <div key={index}>
                <h3 className="mb-2 text-[20px] font-medium text-brand-dark-alt">
                  {contact.category}
                </h3>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[20px] font-medium text-brand-dark-alt hover:text-brand-terracotta"
                >
                  {contact.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

