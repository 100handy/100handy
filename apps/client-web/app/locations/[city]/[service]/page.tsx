import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { HelpIcon } from "@/components/icons";
import { notFound } from "next/navigation";
import { FAQSection } from "@/components/location-service/faq-section";
import { getCategoryIcon } from "@/components/icons/category-icons";

// Service data mapping
const serviceData: Record<string, { name: string; description: string; category: string }> = {
  "furniture-assembly": {
    name: "Furniture Assembly",
    description: "Need someone to put together furniture? Hire a 100 Handy Pro to assemble your furniture and leave the building to them.",
    category: "Assembly"
  },
  "tv-mounting": {
    name: "TV Mounting",
    description: "Mount your TV safely and professionally with expert help from local 100 Handy Pros.",
    category: "Mounting"
  },
  "handyman": {
    name: "Handyman",
    description: "If you're looking for local handyman services to help with home maintenance projects, just search \"handyman near me\" on 100 Handy.",
    category: "Home Repairs"
  },
  "home-cleaning": {
    name: "Home Cleaning",
    description: "Get professional home cleaning services from trusted 100 Handy Pros in your area.",
    category: "Cleaning"
  },
  "help-moving": {
    name: "Help Moving",
    description: "Get help with your move from experienced 100 Handy Pros who can handle heavy lifting and transport.",
    category: "Moving"
  },
  "home-repairs-and-fixes": {
    name: "Home Repairs & Fixes",
    description: "Small issues can become big headaches. Our pros handle quick fixes and touch-ups that keep your home feeling solid, smooth, and well maintained.",
    category: "Home Repairs"
  },
  "home-repairs": {
    name: "Home Repairs",
    description: "From minor fixes to major repairs, our skilled 100 Handy Pros can handle all your home maintenance needs.",
    category: "Home Repairs"
  },
  "plumbing": {
    name: "Plumbing",
    description: "Whether it's a drip, a leak, or a drain that won't cooperate, our plumbing pros get things back to normal—cleanly and efficiently.",
    category: "Plumbing"
  },
  "electrical": {
    name: "Electrical",
    description: "Power problems? New lights? Socket acting up? Our electricians handle installations and repairs with safety, care, and attention to detail.",
    category: "Electrical"
  },
  "cleaning": {
    name: "Cleaning",
    description: "A cleaner space changes everything. From regular cleans to deep refreshes, our pros leave homes looking sharp and feeling brand new.",
    category: "Cleaning"
  },
  "sparkle-clean": {
    name: "Sparkle Clean",
    description: "A cleaner space changes everything. From regular cleans to deep refreshes, our pros leave homes, offices, and rentals looking sharp.",
    category: "Cleaning"
  },
  "packing-moving": {
    name: "Packing & Moving",
    description: "Moving doesn't have to be chaos. Get help packing, lifting, loading, and shifting—so you can move faster with less effort.",
    category: "Moving"
  },
  "outdoor": {
    name: "Outdoor Services",
    description: "From quick tidy-ups to full garden care, our outdoor pros help you keep things clean, trimmed, and looking their best.",
    category: "Outdoor help"
  },
  "great-outdoors": {
    name: "The Great Outdoors",
    description: "From quick tidy-ups to full garden care, our outdoor pros help you keep things clean, trimmed, and looking their best—season after season.",
    category: "Outdoor help"
  },
  // Assembly sub-services
  "ikea-assembly": {
    name: "IKEA Assembly",
    description: "Expert IKEA furniture assembly by trusted 100 Handy Pros. We handle the instructions so you don't have to.",
    category: "Assembly"
  },
  "office-furniture-assembly": {
    name: "Office Furniture Assembly",
    description: "Get your workspace set up quickly with professional office furniture assembly from local 100 Handy Pros.",
    category: "Assembly"
  },
  "wardrobe-assembly": {
    name: "Wardrobe Assembly",
    description: "Professional wardrobe assembly services. Our 100 Handy Pros build wardrobes of all sizes with precision.",
    category: "Assembly"
  },
  "crib-assembly": {
    name: "Crib Assembly",
    description: "Safe, secure crib assembly by experienced 100 Handy Pros. Peace of mind for your little one.",
    category: "Assembly"
  },
  // Mounting sub-services
  "tv-wall-mounting": {
    name: "TV & Wall Mounting",
    description: "Professional TV and wall mounting services. Get that perfectly straight finish with the right tools and expertise.",
    category: "Mounting"
  },
  "wall-mounting": {
    name: "Wall Mounting",
    description: "Secure wall mounting for shelves, art, mirrors, and more. Our 100 Handy Pros bring the right tools for every surface.",
    category: "Mounting"
  },
  "shelf-mounting": {
    name: "Shelf Mounting",
    description: "Get shelves mounted securely and level by experienced 100 Handy Pros in your area.",
    category: "Mounting"
  },
  "put-up-shelves": {
    name: "Put Up Shelves",
    description: "Professional shelf installation services. Our 100 Handy Pros ensure your shelves are level and secure.",
    category: "Mounting"
  },
  "hanging-pictures": {
    name: "Hanging Pictures and Artwork",
    description: "Hang pictures, mirrors, and artwork with precision. Our 100 Handy Pros ensure everything is straight and secure.",
    category: "Mounting"
  },
  "hanging-pictures-and-artwork": {
    name: "Hanging Pictures and Artwork",
    description: "Hang pictures, mirrors, and artwork with precision. Our 100 Handy Pros ensure everything is straight and secure.",
    category: "Mounting"
  },
  "light-fixture-installation": {
    name: "Light Fixture Installation",
    description: "Professional light fixture installation. Our 100 Handy Pros handle ceiling lights, pendant lights, and more.",
    category: "Mounting"
  },
  "curtains-and-blinds": {
    name: "Install Curtains and Blinds",
    description: "Get curtains and blinds installed professionally. Our 100 Handy Pros ensure a perfect fit every time.",
    category: "Mounting"
  },
  "install-curtains-and-blinds": {
    name: "Install Curtains and Blinds",
    description: "Get curtains and blinds installed professionally. Our 100 Handy Pros ensure a perfect fit every time.",
    category: "Mounting"
  },
  // Home Repairs sub-services
  "minor-home-repairs": {
    name: "Minor Home Repairs",
    description: "Quick fixes and small repairs handled efficiently by experienced 100 Handy Pros.",
    category: "Home Repairs"
  },
  "door-cabinet-furniture-repairs": {
    name: "Door, Cabinet, and Furniture Repairs",
    description: "Professional repair services for doors, cabinets, and furniture. Our 100 Handy Pros restore them to working order.",
    category: "Home Repairs"
  },
  "door-cabinet-and-furniture-repairs": {
    name: "Door, Cabinet, and Furniture Repairs",
    description: "Professional repair services for doors, cabinets, and furniture. Our 100 Handy Pros restore them to working order.",
    category: "Home Repairs"
  },
  "window-blinds-repair": {
    name: "Window and Blinds Repair",
    description: "Expert window and blinds repair by trusted 100 Handy Pros in your area.",
    category: "Home Repairs"
  },
  "window-and-blinds-repair": {
    name: "Window and Blinds Repair",
    description: "Expert window and blinds repair by trusted 100 Handy Pros in your area.",
    category: "Home Repairs"
  },
  "sealing-and-caulking": {
    name: "Sealing and Caulking",
    description: "Professional sealing and caulking services to keep your home watertight and well-maintained.",
    category: "Home Repairs"
  },
  "flooring-and-tiling": {
    name: "Flooring and Tiling Help",
    description: "Get help with flooring and tiling projects from experienced 100 Handy Pros.",
    category: "Home Repairs"
  },
  "flooring-and-tiling-help": {
    name: "Flooring and Tiling Help",
    description: "Get help with flooring and tiling projects from experienced 100 Handy Pros.",
    category: "Home Repairs"
  },
  "light-carpentry": {
    name: "Light Carpentry",
    description: "Skilled carpentry for shelving, trim, minor woodwork, and more. Our 100 Handy Pros handle it with care.",
    category: "Home Repairs"
  },
  // Plumbing sub-services
  "leak-fixing": {
    name: "Leak Fixing",
    description: "Fast, reliable leak repair from experienced plumbing 100 Handy Pros in your area.",
    category: "Plumbing"
  },
  "drain-unblocking": {
    name: "Drain Unblocking",
    description: "Professional drain unblocking to get your pipes flowing freely again.",
    category: "Plumbing"
  },
  "tap-replacement": {
    name: "Tap Replacement",
    description: "Expert tap replacement services. Our 100 Handy Pros install new taps quickly and leak-free.",
    category: "Plumbing"
  },
  "washing-machine-installation": {
    name: "Washing Machine Installation",
    description: "Professional washing machine installation and connection by experienced 100 Handy Pros.",
    category: "Plumbing"
  },
  "water-filter-installation": {
    name: "Water Filter Installation",
    description: "Get water filters installed professionally for clean, filtered water at home.",
    category: "Plumbing"
  },
  // Electrical sub-services
  "light-installation": {
    name: "Light Installation",
    description: "Professional light installation services. Our electricians handle all types of light fixtures safely.",
    category: "Electrical"
  },
  "sockets-installation-repair": {
    name: "Sockets Installation and Repair",
    description: "Expert socket installation and repair by qualified 100 Handy Pros.",
    category: "Electrical"
  },
  "sockets-installation-and-repair": {
    name: "Sockets Installation and Repair",
    description: "Expert socket installation and repair by qualified 100 Handy Pros.",
    category: "Electrical"
  },
  "switches-installation-repair": {
    name: "Switches Installation and Repair",
    description: "Professional switch installation and repair services from trusted 100 Handy Pros.",
    category: "Electrical"
  },
  "switches-installation-and-repair": {
    name: "Switches Installation and Repair",
    description: "Professional switch installation and repair services from trusted 100 Handy Pros.",
    category: "Electrical"
  },
  "cables-repair": {
    name: "Cables Repair",
    description: "Safe cable repair services from experienced electricians on the 100 Handy platform.",
    category: "Electrical"
  },
  // Cleaning sub-services
  "deep-clean": {
    name: "Deep Clean",
    description: "Thorough deep cleaning services that leave every corner spotless. Book a trusted 100 Handy Pro today.",
    category: "Cleaning"
  },
  "deep-cleaning": {
    name: "Deep Cleaning",
    description: "Thorough deep cleaning services that leave every corner spotless. Book a trusted 100 Handy Pro today.",
    category: "Cleaning"
  },
  "clean": {
    name: "Home Cleaning",
    description: "Professional home cleaning from trusted 100 Handy Pros. A cleaner space changes everything.",
    category: "Cleaning"
  },
  "party-clean-up": {
    name: "Party Clean Up",
    description: "Post-party clean up handled quickly and thoroughly by local 100 Handy Pros.",
    category: "Cleaning"
  },
  "end-of-tenancy": {
    name: "End of Tenancy Cleaning",
    description: "Professional end of tenancy cleaning to help you get your deposit back.",
    category: "Cleaning"
  },
  "office-cleaning": {
    name: "Office Cleaning",
    description: "Keep your workspace spotless with professional office cleaning from 100 Handy Pros.",
    category: "Cleaning"
  },
  "airbnb-cleaning": {
    name: "Airbnb Cleaning",
    description: "Reliable Airbnb turnover cleaning to keep your guests happy and your reviews stellar.",
    category: "Cleaning"
  },
  // Moving sub-services
  "van-assisted-moving": {
    name: "Van Assisted Moving Help",
    description: "Moving help with a van. Our 100 Handy Pros make your move easier with vehicle-assisted transport.",
    category: "Moving"
  },
  "van-assisted-moving-help": {
    name: "Van Assisted Moving Help",
    description: "Moving help with a van. Our 100 Handy Pros make your move easier with vehicle-assisted transport.",
    category: "Moving"
  },
  "moving-help": {
    name: "Moving Help",
    description: "Get reliable moving help from experienced 100 Handy Pros in your area.",
    category: "Moving"
  },
  "waste-furniture-removal": {
    name: "Waste and Furniture Removal",
    description: "Professional waste and furniture removal services. Our 100 Handy Pros handle the heavy lifting.",
    category: "Moving"
  },
  "waste-and-furniture-removal": {
    name: "Waste and Furniture Removal",
    description: "Professional waste and furniture removal services. Our 100 Handy Pros handle the heavy lifting.",
    category: "Moving"
  },
  "heavy-lifting-loading": {
    name: "Heavy Lifting and Loading",
    description: "Need help with heavy items? Our 100 Handy Pros handle lifting and loading with care.",
    category: "Moving"
  },
  "heavy-lifting-and-loading": {
    name: "Heavy Lifting and Loading",
    description: "Need help with heavy items? Our 100 Handy Pros handle lifting and loading with care.",
    category: "Moving"
  },
  "packing-and-moving": {
    name: "Packing and Moving",
    description: "Full packing and moving support from experienced 100 Handy Pros to make your move stress-free.",
    category: "Moving"
  },
  "full-service-movers": {
    name: "Full Service Movers",
    description: "End-to-end moving services. Our 100 Handy Pros handle everything from packing to unpacking.",
    category: "Moving"
  },
  // Outdoor sub-services
  "gardening": {
    name: "Gardening",
    description: "Professional gardening services from local 100 Handy Pros to keep your garden looking beautiful.",
    category: "Outdoor help"
  },
  "lawn-care": {
    name: "Lawn Care",
    description: "Expert lawn care services. Our 100 Handy Pros keep your lawn healthy and well-maintained.",
    category: "Outdoor help"
  },
  "landscaping": {
    name: "Landscaping",
    description: "Transform your outdoor space with professional landscaping from experienced 100 Handy Pros.",
    category: "Outdoor help"
  },
  "leaf-raking-removal": {
    name: "Leaf Raking and Removal",
    description: "Efficient leaf raking and removal services to keep your garden tidy all year round.",
    category: "Outdoor help"
  },
  "leaf-raking-and-removal": {
    name: "Leaf Raking and Removal",
    description: "Efficient leaf raking and removal services to keep your garden tidy all year round.",
    category: "Outdoor help"
  },
  "roof-gutter-cleaning": {
    name: "Roof and Gutter Cleaning",
    description: "Professional roof and gutter cleaning to prevent blockages and water damage.",
    category: "Outdoor help"
  },
  "roof-and-gutter-cleaning": {
    name: "Roof and Gutter Cleaning",
    description: "Professional roof and gutter cleaning to prevent blockages and water damage.",
    category: "Outdoor help"
  },
  "branch-hedge-trimming": {
    name: "Branch and Hedge Trimming",
    description: "Expert branch and hedge trimming to keep your garden neat and well-shaped.",
    category: "Outdoor help"
  },
  "branch-and-hedge-trimming": {
    name: "Branch and Hedge Trimming",
    description: "Expert branch and hedge trimming to keep your garden neat and well-shaped.",
    category: "Outdoor help"
  },
};

// City data mapping
const cityData: Record<string, { name: string; taskerCount: number; reviewCount: string }> = {
  "london": { name: "London", taskerCount: 3744, reviewCount: "500k" },
  "manchester": { name: "Manchester", taskerCount: 2100, reviewCount: "300k" },
  "birmingham": { name: "Birmingham", taskerCount: 1800, reviewCount: "250k" },
  "leeds": { name: "Leeds", taskerCount: 1200, reviewCount: "180k" },
  "liverpool": { name: "Liverpool", taskerCount: 1400, reviewCount: "200k" },
  "glasgow": { name: "Glasgow", taskerCount: 1100, reviewCount: "150k" },
  "edinburgh": { name: "Edinburgh", taskerCount: 900, reviewCount: "130k" },
  "bristol": { name: "Bristol", taskerCount: 1300, reviewCount: "190k" },
  "sheffield": { name: "Sheffield", taskerCount: 800, reviewCount: "120k" },
  "nottingham": { name: "Nottingham", taskerCount: 750, reviewCount: "110k" },
  "leicester": { name: "Leicester", taskerCount: 680, reviewCount: "95k" },
  "newcastle-upon-tyne": { name: "Newcastle upon Tyne", taskerCount: 950, reviewCount: "140k" },
  "cardiff": { name: "Cardiff", taskerCount: 720, reviewCount: "100k" },
  "belfast": { name: "Belfast", taskerCount: 650, reviewCount: "90k" },
  "coventry": { name: "Coventry", taskerCount: 580, reviewCount: "80k" },
  "brighton": { name: "Brighton", taskerCount: 870, reviewCount: "125k" },
  "southampton": { name: "Southampton", taskerCount: 640, reviewCount: "88k" },
  "reading": { name: "Reading", taskerCount: 560, reviewCount: "78k" },
  "cambridge": { name: "Cambridge", taskerCount: 620, reviewCount: "85k" },
  "oxford": { name: "Oxford", taskerCount: 600, reviewCount: "82k" },
  "norwich": { name: "Norwich", taskerCount: 430, reviewCount: "60k" },
  "exeter": { name: "Exeter", taskerCount: 380, reviewCount: "52k" },
  // London — Central
  "city-of-london": { name: "City of London", taskerCount: 620, reviewCount: "85k" },
  "soho": { name: "Soho", taskerCount: 580, reviewCount: "78k" },
  "holborn": { name: "Holborn", taskerCount: 540, reviewCount: "72k" },
  "bloomsbury": { name: "Bloomsbury", taskerCount: 510, reviewCount: "68k" },
  "fitzrovia": { name: "Fitzrovia", taskerCount: 490, reviewCount: "65k" },
  "covent-garden": { name: "Covent Garden", taskerCount: 530, reviewCount: "71k" },
  "marylebone": { name: "Marylebone", taskerCount: 560, reviewCount: "75k" },
  // London — North
  "camden-town": { name: "Camden Town", taskerCount: 640, reviewCount: "88k" },
  "islington": { name: "Islington", taskerCount: 610, reviewCount: "83k" },
  "highgate": { name: "Highgate", taskerCount: 420, reviewCount: "56k" },
  "finsbury-park": { name: "Finsbury Park", taskerCount: 480, reviewCount: "64k" },
  "holloway": { name: "Holloway", taskerCount: 450, reviewCount: "60k" },
  "tottenham": { name: "Tottenham", taskerCount: 520, reviewCount: "69k" },
  "wood-green": { name: "Wood Green", taskerCount: 460, reviewCount: "61k" },
  "barnet": { name: "Barnet", taskerCount: 500, reviewCount: "67k" },
  // London — South
  "brixton": { name: "Brixton", taskerCount: 590, reviewCount: "80k" },
  "clapham": { name: "Clapham", taskerCount: 630, reviewCount: "86k" },
  "peckham": { name: "Peckham", taskerCount: 520, reviewCount: "69k" },
  "greenwich": { name: "Greenwich", taskerCount: 570, reviewCount: "76k" },
  "lewisham": { name: "Lewisham", taskerCount: 510, reviewCount: "68k" },
  "crystal-palace": { name: "Crystal Palace", taskerCount: 430, reviewCount: "57k" },
  "dulwich": { name: "Dulwich", taskerCount: 440, reviewCount: "59k" },
  "croydon": { name: "Croydon", taskerCount: 600, reviewCount: "82k" },
  // London — East
  "shoreditch": { name: "Shoreditch", taskerCount: 580, reviewCount: "78k" },
  "bethnal-green": { name: "Bethnal Green", taskerCount: 510, reviewCount: "68k" },
  "hackney": { name: "Hackney", taskerCount: 560, reviewCount: "75k" },
  "dalston": { name: "Dalston", taskerCount: 490, reviewCount: "65k" },
  "hoxton": { name: "Hoxton", taskerCount: 470, reviewCount: "63k" },
  "whitechapel": { name: "Whitechapel", taskerCount: 500, reviewCount: "67k" },
  "canary-wharf": { name: "Canary Wharf", taskerCount: 620, reviewCount: "85k" },
  "bow": { name: "Bow", taskerCount: 430, reviewCount: "57k" },
  "leyton": { name: "Leyton", taskerCount: 440, reviewCount: "59k" },
  "stratford": { name: "Stratford", taskerCount: 520, reviewCount: "69k" },
  // London — West
  "notting-hill": { name: "Notting Hill", taskerCount: 590, reviewCount: "80k" },
  "kensington": { name: "Kensington", taskerCount: 640, reviewCount: "88k" },
  "chelsea": { name: "Chelsea", taskerCount: 660, reviewCount: "91k" },
  "hammersmith": { name: "Hammersmith", taskerCount: 570, reviewCount: "76k" },
  "shepherds-bush": { name: "Shepherd's Bush", taskerCount: 530, reviewCount: "71k" },
  "ealing": { name: "Ealing", taskerCount: 560, reviewCount: "75k" },
  "acton": { name: "Acton", taskerCount: 480, reviewCount: "64k" },
  "chiswick": { name: "Chiswick", taskerCount: 510, reviewCount: "68k" },
  "richmond": { name: "Richmond", taskerCount: 540, reviewCount: "72k" },
  // Greater London
  "wembley": { name: "Wembley", taskerCount: 550, reviewCount: "74k" },
  "harrow": { name: "Harrow", taskerCount: 490, reviewCount: "65k" },
  "watford": { name: "Watford", taskerCount: 460, reviewCount: "61k" },
  "enfield": { name: "Enfield", taskerCount: 510, reviewCount: "68k" },
  "ilford": { name: "Ilford", taskerCount: 520, reviewCount: "69k" },
  "romford": { name: "Romford", taskerCount: 480, reviewCount: "64k" },
  "kingston-upon-thames": { name: "Kingston upon Thames", taskerCount: 530, reviewCount: "71k" },
  "twickenham": { name: "Twickenham", taskerCount: 490, reviewCount: "65k" },
  "bexley": { name: "Bexley", taskerCount: 440, reviewCount: "59k" },
  "sutton": { name: "Sutton", taskerCount: 460, reviewCount: "61k" },
};

interface LocationServicePageProps {
  params: Promise<{
    city: string;
    service: string;
  }>;
}

// Sample taskers data
const generateTaskers = (serviceName: string, count: number = 6): Array<{
  name: string;
  tasks: string;
  rating: string;
  reviews: number;
  description: string;
}> => {
  const names = ["Maria R.", "Lucas P.", "Marcus R.", "Lore V.", "Ahmet P.", "Lisa O."];
  const descriptions = [
    "From start to finish, I communicate clearly and work carefully to deliver exactly what you need",
    "Friendly, punctual, and experienced—I focus on providing quality service and customer satisfaction every time.",
    "Whether it's a quick fix or a larger project, I'm committed to delivering dependable, professional results.",
    "With over 6 years of experience, I bring the right tools and skills to ensure your job is completed safely."
  ];

  return names.slice(0, count).map((name, index) => {
    const description = descriptions[index % descriptions.length] ?? descriptions[0] ?? "";
    return {
      name,
      tasks: `${Math.floor(Math.random() * 90) + 10} ${serviceName.toLowerCase()} tasks`,
      rating: "5.0",
      reviews: 124,
      description
    };
  });
};

export default async function LocationServicePage({ params }: LocationServicePageProps) {
  const { city, service } = await params;

  // Validate city and service
  const cityInfo = cityData[city];
  const serviceInfo = serviceData[service];

  if (!cityInfo || !serviceInfo) {
    notFound();
  }

  const taskers = generateTaskers(serviceInfo.name);

  return (
    <LocationServiceContent
      city={cityInfo}
      service={serviceInfo}
      citySlug={city}
      serviceSlug={service}
      taskers={taskers}
    />
  );
}

interface LocationServiceContentProps {
  city: { name: string; taskerCount: number; reviewCount: string };
  service: { name: string; description: string; category: string };
  citySlug: string;
  serviceSlug: string;
  taskers: Array<{
    name: string;
    tasks: string;
    rating: string;
    reviews: number;
    description: string;
  }>;
}

function LocationServiceContent({ city, service, citySlug, taskers }: LocationServiceContentProps) {
  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-8">
          <p className="text-brand-terracotta text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            {" > "}
            <Link href="/services-by-city" className="hover:underline">Locations</Link>
            {" > "}
            <Link href={`/locations/${citySlug}`} className="hover:underline">{city.name}</Link>
            {" > "}
            <span>{service.name}</span>
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-brand-dark py-16">
        <div className="max-w-[1920px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h1 className="text-white font-bold text-[44px] leading-tight mb-6">
                {service.name} Services in<br />
                {city.name}
              </h1>

              <p className="text-white text-[24px] mb-6 leading-relaxed">
                {service.description}
              </p>

              <div className="flex items-center gap-2 mb-8">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white text-[24px] font-semibold">{city.reviewCount} Reviews</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white text-[24px]">Browse {city.taskerCount.toLocaleString()}+ 100 Handy Pros with a variety of skills.</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-white mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-white text-[24px]">All 100 Handy Pros bring their own tools and equipment.</p>
                </div>
              </div>

              <Link href={`/task-form?category=${encodeURIComponent(service.category)}`} className="inline-block bg-brand-terracotta hover:bg-brand-coral text-white font-semibold py-3 px-8 rounded-full transition-colors text-[20px]">
                Book Now
              </Link>
            </div>

            <div className="flex items-center justify-center">
              {(() => {
                const ServiceIcon = getCategoryIcon(service.name);
                return (
                  <div className="flex h-52 w-52 items-center justify-center rounded-full bg-white/10">
                    <ServiceIcon className="h-28 w-28 text-white" />
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Taskers */}
      <section className="bg-white py-20">
        <div className="max-w-[1920px] mx-auto px-8">
          <h2 className="text-brand-dark-alt font-bold text-[37px] mb-12">
            {city.taskerCount.toLocaleString()} featured {service.name} 100 Handy Pros in {city.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {taskers.map((tasker, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-brand-dark-alt font-bold text-[26px] mb-1">{tasker.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-brand-dark-alt text-[18px]">{tasker.rating} ({tasker.reviews} reviews)</span>
                    </div>
                    <p className="text-brand-dark-alt text-[18px]">{tasker.tasks}</p>
                  </div>
                </div>
                <p className="text-brand-dark-alt text-[19px] leading-relaxed mb-4">{tasker.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="border-2 border-brand-dark-alt text-brand-dark-alt hover:bg-brand-dark-alt hover:text-white font-semibold py-3 px-10 rounded-md transition-colors text-[18px]">
              Search all 100 Handy Pros
            </button>
          </div>
        </div>
      </section>

      {/* Satisfaction Guarantee */}
      <section className="bg-[#F5F3F1] py-20">
        <div className="max-w-[1920px] mx-auto px-8">
          <h2 className="text-brand-dark-alt font-bold text-[44px] mb-16 text-center">
            Your satisfaction, guaranteed
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            <div>
              <h3 className="text-brand-dark-alt font-bold text-[32px] mb-4">Happiness Pledge</h3>
              <p className="text-brand-dark-alt text-[21px] leading-relaxed">
                If you're not satisfied, we'll work to make it right.
              </p>
            </div>
            <div>
              <h3 className="text-brand-dark-alt font-bold text-[32px] mb-4">Vetted 100 Handy Pros</h3>
              <p className="text-brand-dark-alt text-[21px] leading-relaxed">
                100 Handy Pros are always background checked before joining the platform.
              </p>
            </div>
            <div>
              <h3 className="text-brand-dark-alt font-bold text-[32px] mb-4">Dedicated Support</h3>
              <p className="text-brand-dark-alt text-[21px] leading-relaxed">
                Friendly service when you need us — every day of the week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-brand-dark py-20">
        <div className="max-w-[1920px] mx-auto px-8">
          <div className="bg-white rounded-2xl p-12 shadow-2xl max-w-2xl mx-auto">
            <h2 className="text-brand-dark-alt font-bold text-[33px] mb-10">How it works</h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-brand-terracotta w-[51px] h-[51px] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[33px] font-bold">1</span>
                </div>
                <p className="text-brand-dark-alt text-[20px] leading-relaxed pt-2">
                  Choose a 100 Handy Pro by price, skills, and reviews.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-sage w-[51px] h-[51px] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[33px] font-bold">2</span>
                </div>
                <p className="text-brand-dark-alt text-[20px] leading-relaxed pt-2">
                  Schedule a 100 Handy Pro as early as today.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-sage w-[51px] h-[51px] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[33px] font-bold">3</span>
                </div>
                <p className="text-brand-dark-alt text-[20px] leading-relaxed pt-2">
                  Chat, pay, tip, and review, all in one place.
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link href={`/task-form?category=${encodeURIComponent(service.category)}`} className="inline-block bg-brand-terracotta hover:bg-brand-terracotta/90 text-white font-semibold py-3 px-10 rounded-full transition-colors text-[20px]">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection serviceName={service.name} cityName={city.name} />

      <Footer />

      {/* Help Button */}
      <button className="fixed bottom-6 left-6 bg-brand-sage text-white p-4 rounded-full shadow-lg hover:bg-brand-sage/85 transition-colors flex items-center justify-center">
        <HelpIcon />
      </button>
    </div>
  );
}

// Generate static params for common city/service combinations
export async function generateStaticParams() {
  const cities = Object.keys(cityData);
  const services = Object.keys(serviceData);
  const params: Array<{ city: string; service: string }> = [];

  cities.forEach((city) => {
    services.forEach((service) => {
      params.push({ city, service });
    });
  });

  return params;
}
