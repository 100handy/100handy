import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { MessageSquare } from "lucide-react";
import { PolygonIcon, CircleIcon } from "@/components/icons";

// Data for the leadership team to avoid repetition
const leadershipTeam = [
  { name: "Berkay Dasha", role: "Chief Executives Officer", image: "/team/1.jpg" },
  { name: "Berkay Dasha", role: "Chief Executives Officer", image: "/team/2.jpg" },
  { name: "Berkay Dasha", role: "Chief Executives Officer", image: "/team/3.jpg" },
  { name: "Berkay Dasha", role: "Chief Executives Officer", image: "/team/4.jpg" },
  { name: "Berkay Dasha", role: "Chief Executives Officer", image: "/team/5.jpg" },
  { name: "Berkay Dasha", role: "Chief Executives Officer", image: "/team/6.jpg" },
  { name: "Berkay Dasha", role: "Chief Executives Officer", image: "/team/7.jpg" },
  { name: "Berkay Dasha", role: "Chief Executives Officer", image: "/team/8.jpg" },
  { name: "Berkay Dasha", role: "Chief Executives Officer", image: "/team/9.jpg" },
];

// NOTE: For the images to work, create a `public/team` directory
// and add 9 placeholder images named 1.jpg, 2.jpg, etc.
// You can get them from a site like unsplash.com.

export default function AboutUsPage() {
  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-darkGreen min-h-[280px] py-12 px-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Decorative Icons */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              <PolygonIcon 
                className="absolute -top-8 -left-8 opacity-30" 
                size={96} 
              />
              <CircleIcon 
                className="absolute -bottom-4 -right-4 opacity-40" 
                size={96} 
              />
            </div>
          </div>
          
          {/* Hero Text */}
          <h1 className="text-[38px] font-bold text-white relative z-10">
            About Us
          </h1>
        </section>

        {/* Content Section */}
        <section className="bg-white py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-[32px] font-medium text-darkGreen mb-6">
              Transforming lives, one task at a time
            </h2>
            <p className="text-[20px] font-medium text-darkGreen leading-relaxed">
              We bring people together. It's at the heart of everything we do. We know that for every person who needs their radiator fixed before winter, the nursery set up for their firstborn, or their house tidied in time for guests, there is another trusted person who is ready, willing, and able to help, without delay. When these two people come together, they help one another in a way that lets them both enjoy a better way of living.
            </p>
          </div>
        </section>

        {/* Leadership Team Section */}
        <section className="bg-white py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-[35px] font-bold text-darkGreen text-center mb-12">
              Leadership Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {leadershipTeam.map((member, index) => (
                <div key={index} className="flex flex-col items-center text-center pb-4">
                  <div className="w-[235px] h-[234px] rounded-lg overflow-hidden mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={235}
                      height={234}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-[26px] font-bold text-darkGreen">
                    {member.name}
                  </h3>
                  <p className="text-[19px] font-medium text-darkGreen">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Floating Help Button */}
      <Button className="fixed bottom-4 right-4.5 bg-darkGreen text-white rounded-lg px-4 py-3 h-auto text-[17px] font-bold flex items-center gap-2 hover:bg-darkGreen/90">
        <MessageSquare size={20} /> Help
      </Button>
    </>
  );
}
