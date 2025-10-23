"use client";

const resources = [
  { title: "Download Logos", type: "logos" },
  { title: "Download B-Roll", type: "video" },
  { title: "Download Fact Sheet", type: "document" },
  { title: "Download Tasker Images", type: "images" },
  { title: "Download Product Images", type: "images" },
  { title: "Download Client Images", type: "images" },
];

export function MediaResources(): React.JSX.Element {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-6 text-center text-[39px] font-bold text-brand-dark-alt">
          Media Resources
        </h2>
        
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-2 text-[16px] text-brand-dark-alt">
            A collection of brand assets for your use.
          </p>
          <p className="text-[16px] text-brand-dark-alt">
            All logo and media usage must follow the 100Handy brand guidelines. For specific media requests, please contact{" "}
            <a href="mailto:press@100handy.com" className="font-bold underline hover:text-brand-terracotta">
              press@100handy.com
            </a>
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {resources.map((resource, index) => (
            <button
              key={index}
              className="group overflow-hidden rounded-2xl bg-gray-50 transition-all hover:shadow-lg"
            >
              {/* Placeholder image area */}
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-6xl text-gray-400">
                  {resource.type === "logos" && "🏢"}
                  {resource.type === "video" && "🎬"}
                  {resource.type === "document" && "📄"}
                  {resource.type === "images" && "🖼️"}
                </div>
              </div>
              
              {/* Title */}
              <div className="p-6">
                <h3 className="text-[20px] font-bold text-brand-dark-alt group-hover:text-brand-terracotta">
                  {resource.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

