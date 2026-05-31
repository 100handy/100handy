"use client";

interface PressContact {
  category: string;
  email: string;
}

interface GetInTouchProps {
  title: string;
  intro: string;
  contacts: PressContact[];
}

export function GetInTouch({
  title,
  intro,
  contacts,
}: GetInTouchProps): React.JSX.Element {
  return (
    <section className="bg-[#F5F0E8] py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-12 text-center text-[32px] font-bold text-brand-dark-alt">
          {title}
        </h2>

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-[20px] leading-relaxed text-brand-dark-alt">
              {intro}
            </p>
          </div>

          <div className="grid gap-x-16 gap-y-8 md:grid-cols-2">
            {contacts.map((contact, index) => (
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
