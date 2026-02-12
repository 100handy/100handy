import { Header, Footer } from "@/components/layout";
import {
  ServiceHero,
  Breadcrumb,
  ContentSection,
  ServiceHowItWorks,
  CTASection,
  FAQs,
  Cities,
} from "@/components/service-detail";
import { notFound } from "next/navigation";

// Allow dynamic paths beyond the statically generated ones
export const dynamicParams = true;

// Service data structure
interface ServiceData {
  title: string;
  description: string;
  category: string;
  categoryDisplay: string;
  longDescription: string;
  benefits: Array<{ title: string; description: string }>;
  tasks: Array<{ title: string; description: string }>;
  faqs?: Array<{ question: string; answer: string }>;
}

// Service database - map of category/service to data
const servicesData: Record<string, Record<string, ServiceData>> = {
  "furniture-assembly": {
    "furniture-assembly": {
      title: "Furniture Assembly",
      description: "New furniture, zero stress. Book an experienced 100 Handy to assemble it quickly, correctly, and with care.",
      category: "furniture-assembly",
      categoryDisplay: "Furniture Assembly",
      longDescription: "Unboxing new furniture feels exciting until you're staring at a mountain of panels, tiny screws, and instructions that somehow skip step 6. Furniture assembly often takes far longer than you think. What looks like a \"quick 30-minute job\" can turn into an entire evening of trial and error, missing tools, and pieces that don't line up the way you expected. Our Pros make it easy to skip the frustration and get it done right. Hire a skilled Pro for furniture assembly and enjoy a smooth, hassle-free setup - whether it's a single chair, a full bedroom set, or a tricky flat-pack build. Search in the app or on our website, compare an operative by reviews, skills, and pricing, then book a time that fits your schedule. Less time building. More time enjoying your space.",
      benefits: [
        { title: "Trusted & Vetted Pros", description: "Every Pro on 100 Handy is background-checked, reviewed, and rated by real users." },
        { title: "Seamless Booking", description: "Find, hire, and pay your Pro seamlessly through our secure platform." },
        { title: "Reliable Service", description: "From IKEA to custom furniture, Pros can handle all your assembly needs." },
        { title: "Happiness Pledge", description: "We stand by the quality of our services. If something isn't right, we'll work to make it right." },
      ],
      tasks: [
        { title: "Furniture Assembly", description: "Assembly of all types of furniture pieces." },
        { title: "IKEA Assembly", description: "Expert assembly of IKEA furniture collections." },
        { title: "Office Furniture Assembly", description: "Setting up your home office or workspace." },
        { title: "Wardrobe Assembly", description: "Closet systems and wardrobes assembled with care." },
        { title: "Crib Assembly", description: "Safe and secure assembly for baby furniture." },
      ],
      faqs: [
        { question: "What tools do I need for furniture assembly?", answer: "Most handymen bring common tools needed for assembly. If your item requires a specialty tool (or wall anchors, brackets, etc.), mention it in your task details so your Pro can come prepared." },
        { question: "How much does furniture assembly cost?", answer: "Pricing varies by handymen and depends on the type of furniture, complexity, and estimated time. You'll see rates upfront when you browse available Handymen in your area." },
        { question: "Can a 100 Handy Pro help me with office furniture installation?", answer: "Yes, your handyman can assemble desks, chairs, filing cabinets, conference tables, and other office furniture - whether it's one piece or a full workspace setup." },
        { question: "How long does furniture assembly take?", answer: "Time depends on the size and complexity of the item. A simple piece can be quick, while larger or multi-part builds take longer. Share the product details (or a photo/link) for a more accurate estimate." },
      ],
    },
  },
  "tv-wall-mounting": {
    "tv-mounting": {
      title: "Professional TV & Wall Mounting Service",
      description: "Turn your living room into a clean, cinema-worthy setup - without the stress, the crooked screen, or the mystery wires.",
      category: "tv-wall-mounting",
      categoryDisplay: "TV & Wall Mounting",
      longDescription: "We are aware that it is a nerve-wracking task to mount a TV, and it may be physically challenging. The fact that something that appears to be an easy task turns into a nightmare of having to move heavy things, deal with incomprehensible brackets, and the possibility of digging a hole in the wrong location is not new. The last thing one wants to have after purchasing a beautiful new 4K TV is to have a hard time adjusting it, or, even worse, trashing your wall or even the gadget itself. Choose from a range of popular services, all completed with the right fixings, tools, and care for your walls. 100 Handy will provide you with a chance to skip that stress and a chance to avoid jeopardizing your time by matching you with a skilled worker who provides expert services in TV installation.",
      benefits: [
        { title: "Professional Installation", description: "Pros have the right tools and experience to mount your TV safely." },
        { title: "Cable Management", description: "Hide cables and wires for a clean, professional look." },
        { title: "Wall Assessment", description: "Pros can assess your wall type and use appropriate mounting hardware." },
        { title: "Happiness Guarantee", description: "All backed by the 100 Handy Happiness Guarantee." },
      ],
      tasks: [
        { title: "TV Mounting", description: "Flat, tilt, or full-motion brackets; all TV sizes." },
        { title: "Put Up Shelves", description: "Floating shelves, storage units, display shelves." },
        { title: "Hanging Pictures and Artwork", description: "Secure and level hanging for all wall art." },
        { title: "Light Installation", description: "Ceiling lights, wall lights, fittings, LED features." },
        { title: "Install Curtains and Blinds", description: "Measured, aligned, and installed for smooth operation." },
      ],
      faqs: [
        { question: "How long does TV mounting take?", answer: "Most installations take around 1–2 hours, depending on wall type, bracket style, and whether cable hiding or add-ons are included." },
        { question: "Can you mount on plasterboard/stud walls?", answer: "Yes - installers use the correct anchors or mount into studs where needed to ensure a safe, stable fit." },
        { question: "Do you provide cable management?", answer: "Yes. You can request neat cable routing, including trunking or in-wall concealment where appropriate." },
        { question: "Can I book shelves, lights, and curtains/blinds at the same time?", answer: "Absolutely. Many customers combine TV mounting with shelf mounting, lighting installs, and blinds and curtains installation in one visit." },
        { question: "Do you cover all of London?", answer: "Yes - TV mounting service in London is available across central, North, South, East, and West London (and often nearby areas too)." },
      ],
    },
  },
  "home-repairs": {
    "home-repairs": {
      title: "Home Repairs & Fixes",
      description: "Need help fixing broken items around the house? Skilled experts can handle repairs and maintenance quickly and efficiently.",
      category: "home-repairs",
      categoryDisplay: "Home Repairs & Fixes",
      longDescription: "We get it: small problems rarely stay small for long. A loose hinge turns into a crooked door. A wobbly drawer becomes a daily annoyance. And a \"quick fix\" can easily stretch into hours if you're missing tools, time, or the right know-how. That's where 100 Handy comes in. Our experienced Pros can handle a wide range of fixes in one visit - from kitchen cabinet repair to window blinds and shades repair, plus touch-ups, tightening, patching, and those odd jobs you've been putting off. Need something more specific? We also offer leather furniture repair for scuffs, splits, and wear that's bringing down your favourite pieces. Renovating or refreshing a room? Ask about our B&Q laminate flooring fitting service to help get a clean, level finish without the guesswork. However big or small the issue, we make it simple to get it sorted the right way. Help is on the way.",
      benefits: [
        { title: "Trusted & Vetted Pros", description: "Every handyman on 100 Handy is background-checked, reviewed, and rated by real users." },
        { title: "Seamless Booking", description: "Find, hire, and pay your Pro seamlessly through our secure platform." },
        { title: "Wide Range of Repairs", description: "From minor fixes to larger handyman projects, Pros can help with a variety of home maintenance needs." },
        { title: "Happiness Pledge", description: "We stand by the quality of our services. If something isn't right, we'll work to make it right." },
      ],
      tasks: [
        { title: "Minor Home Repairs", description: "Quick fixes and touch-ups around the house." },
        { title: "Door, Cabinet, and Furniture Repairs", description: "Fixing hinges, handles, and structural issues." },
        { title: "Window and Blinds Repair", description: "Restoring smooth operation to windows and blinds." },
        { title: "Sealing and Caulking", description: "Waterproofing and finishing gaps and joints." },
        { title: "Flooring and Tiling Help", description: "Repairs and installation assistance." },
        { title: "Light Carpentry", description: "Custom cuts, fixes, and small builds." },
      ],
      faqs: [
        { question: "What tools do I need for minor home repairs?", answer: "You don't need any - your 100 Handy Pro arrives with the right tools and fixings for the job." },
        { question: "How much do home repairs & fixes usually cost?", answer: "Pricing depends on the task and time needed, and we'll confirm the cost upfront before work begins." },
        { question: "Can you help with kitchen cabinet repair, blinds, and leather items?", answer: "Yes - 100 Handy covers kitchen cabinet repair, window blinds and shades repair, and leather furniture repair in one convenient visit." },
        { question: "Do you offer B&Q laminate flooring fitting service?", answer: "Yes - ask for our B&Q laminate flooring fitting service, and we'll help you get a clean, professional finish." },
      ],
    },
  },
  "plumbing": {
    "plumbers": {
      title: "Plumbing Services",
      description: "Got a leak or a blockage that needs fixing? Experienced plumbers can help with repairs quickly and efficiently.",
      category: "plumbing",
      categoryDisplay: "Plumbers",
      longDescription: "We know that plumbing issues can often be messy and take longer than expected to resolve. That's why we offer these common solutions: Drip Hunt and Zap - We track down and crush leaks fast to dodge water havoc, mold monsters, and sky-high bills through expert leaking tap repair and comprehensive leak repair solutions. Gutter Guts Clear-Out - We blast blockages from sinks, loos, and pipes for seamless surges and zero backup blues with professional drain unblocking services. Pipe Patch and Swap - From quick fixes to total tube triumphs, we craft tough systems with pipe leak repair and water leak repair expertise that ace every code. Hot Water Wizards - We tweak, tune, and drop in heaters for endless steamy bliss and eco-smart savings with precision installations. Gadget Glow-Ups - Expert replacement kitchen tap services, washing machine installation, and water filter installation, fitted with pro polish for forever flair.",
      benefits: [
        { title: "Fast Response", description: "Quick turnaround for emergency plumbing issues." },
        { title: "Experienced Plumbers", description: "Skilled pros who know how to diagnose and fix issues efficiently." },
        { title: "Transparent Pricing", description: "Know the cost upfront before work begins." },
        { title: "Quality Guaranteed", description: "All work backed by our satisfaction guarantee." },
      ],
      tasks: [
        { title: "Leak Fixing", description: "Expert leaking tap repair and comprehensive leak solutions." },
        { title: "Drain Unblocking", description: "Professional drain unblocking services for all pipes." },
        { title: "Tap Replacement", description: "Kitchen and bathroom tap replacement services." },
        { title: "Washing Machine Installation", description: "Proper plumbing connections for your appliances." },
        { title: "Water Filter Installation", description: "Clean water solutions installed correctly." },
      ],
      faqs: [
        { question: "How do I fix a dripping faucet?", answer: "Trust 100 Handy for swift leaking tap repair and replace kitchen tap services to seal drips and restore flawless flow." },
        { question: "What causes drains to block and how to clear them?", answer: "100 Handy masters drain unblocking techniques to obliterate clogs and keep your pipes purring without backups." },
        { question: "How can I install a washing machine properly?", answer: "100 Handy handles washing machine installation with precision plumbing connections to prevent leaks and ensure peak performance." },
        { question: "What's the best way to address water leaks in pipes?", answer: "100 Handy excels in leak repair, pipe leak repair, water leak repair, and water filter installation for dry, pure protection." },
      ],
    },
  },
  "electrical": {
    "electricians": {
      title: "Professional Electricians - Safe & Reliable Electrical Services",
      description: "Expert electrical solutions for your home and business - from quick repairs to complete installations, our certified electricians deliver quality finishing.",
      category: "electrical",
      categoryDisplay: "Electricians",
      longDescription: "Flickering lights, faulty sockets, or buzzing switches? 100 Handy electricians deliver fast, reliable fixes to keep your home powered safely and brightly. We handle everything from lighting installation and outdoor lighting installation to electrical socket installation, electrical socket and switch repair, electric switch repair, electrical switch installation, cable repair, and fiber optic cable repair - all with expert precision and code-compliant standards. Don't let electrical issues spark worry or risk fires from worn wiring, overloaded circuits, or damaged cables. Our pros provide thorough diagnostics, quality materials, and lasting solutions for homes and businesses, ensuring steady power and peace of mind every time.",
      benefits: [
        { title: "Certified Electricians", description: "All pros are qualified and experienced in electrical work." },
        { title: "Safety First", description: "Code-compliant work that prioritizes your home's safety." },
        { title: "Quick Diagnostics", description: "Fast identification and resolution of electrical issues." },
        { title: "Quality Materials", description: "We use reliable, long-lasting components." },
      ],
      tasks: [
        { title: "Light Installation", description: "Indoor and outdoor lighting installation services." },
        { title: "Sockets Installation and Repair", description: "Electrical socket installation and repair." },
        { title: "Switches Installation and Repair", description: "Electric switch repair and installation." },
        { title: "Cables Repair", description: "Cable repair and fiber optic cable repair services." },
      ],
      faqs: [
        { question: "Why are my lights flickering or dimming?", answer: "Loose connections or overloads are common culprits. 100 Handy experts perform lighting installation or outdoor lighting installation to diagnose and deliver steady, safe light." },
        { question: "What if an outlet stops working?", answer: "Reset breakers first, then call us for electrical socket installation or electrical socket and switch repair to uncover wiring problems and restore reliable power." },
        { question: "How do I fix a buzzing or sparking switch?", answer: "Wear or loose wires cause hazards. Let 100 Handy handle electric switch repair, electrical switch installation, or electrical socket and switch repair for safe results." },
        { question: "What about damaged cables?", answer: "Frayed lines risk fires or outages. Trust 100 Handy for urgent cable repair or fibre optic cable repair to reconnect and protect your home's electrical system." },
      ],
    },
  },
  "cleaning": {
    "sparkle-clean": {
      title: "Professional Sparkle Clean Services",
      description: "Does the thought of scrubbing floors and dusting shelves feel overwhelming? 100 Handy connects you with top-rated cleaners to make your space shine without you lifting a finger.",
      category: "cleaning",
      categoryDisplay: "Sparkle Clean",
      longDescription: "Tired of dust bunnies, sticky floors, and endless chores? 100 Handy's Sparkle Clean pros bring professional cleaning services that shine, from house cleaning services to deep clean house cleaning services, end-of-tenancy cleaning, office cleaning, and Airbnb cleaning service. We scrub away the mess so you reclaim your time and sparkle. Say goodbye to stress from cluttered spaces, pet hair chaos, or post-party disasters - our eco-friendly, thorough teams use safe, powerful products for spotless results every time. Perfect for busy families, renters, hosts, and offices seeking reliable freshness.",
      benefits: [
        { title: "Vetted Cleaners", description: "All cleaning pros are background-checked and highly rated." },
        { title: "Eco-Friendly Products", description: "Safe, powerful cleaning products for spotless results." },
        { title: "Flexible Scheduling", description: "Book regular cleans or one-time deep cleans." },
        { title: "Satisfaction Guaranteed", description: "We ensure you're happy with every clean." },
      ],
      tasks: [
        { title: "Clean", description: "Standard house cleaning services." },
        { title: "Deep Clean", description: "Thorough deep clean house cleaning services." },
        { title: "Party Clean Up", description: "Post-event and after-party cleaning." },
        { title: "End of Tenancy", description: "Move-out cleaning to get your deposit back." },
        { title: "Office Cleaning", description: "Professional office cleaning services." },
        { title: "AirBnB Cleaning", description: "Turnover cleaning for vacation rentals." },
      ],
      faqs: [
        { question: "What is included in a standard clean versus a deep clean?", answer: "Our standard house cleaning service covers dusting and wiping surfaces, while our deep clean house cleaning services tackle neglected areas like baseboards and behind appliances." },
        { question: "Do you offer services for moving in or out of a property?", answer: "Yes, we specialise in end-of-tenancy cleaning to help you get your deposit back, ensuring the property meets the highest standards of professional cleaning services." },
        { question: "Can you help clean up after a celebration or event?", answer: "Absolutely, we offer specialized after-party cleaning to handle the post-event mess, or you can book our house deep cleaning services to restore order immediately." },
        { question: "Do you provide cleaning for commercial spaces or holiday rentals?", answer: "We provide thorough office cleaning for businesses and a dedicated Airbnb cleaning service designed to prepare your rental perfectly for the next guest check-in." },
      ],
    },
  },
  "packing-moving": {
    "moving": {
      title: "Professional Packing and Moving Service",
      description: "Professional moving solutions that make relocating effortless - from single-item transport to complete home moves.",
      category: "packing-moving",
      categoryDisplay: "Packing & Moving",
      longDescription: "Moving house is often cited as one of life's most stressful events, but it doesn't have to be. 100 Handy is here to turn that mountain of boxes into a smooth, organised transition. Whether you are relocating your entire home, shifting a few items to storage, or just need an extra pair of hands, we have the right professionals for the job. Our flexible moving solutions include: Man and van rental - Cost-effective transport for small to medium moves. Man and van services - Fully equipped teams with professional drivers. Moving help - Experienced movers for loading, transport, and unloading. Moving and packing services - Complete end-to-end relocation solutions. Same-day and scheduled moves available 7 days a week.",
      benefits: [
        { title: "Flexible Options", description: "From single items to full home moves, we have the right solution." },
        { title: "Professional Teams", description: "Experienced movers who handle your belongings with care." },
        { title: "Same-Day Available", description: "Urgent moves? We can help on short notice." },
        { title: "Full Service", description: "Packing, loading, transport, unloading - all covered." },
      ],
      tasks: [
        { title: "Van Assisted Moving Help", description: "Transport with professional drivers." },
        { title: "Moving Help", description: "Loading, transport, and unloading assistance." },
        { title: "Waste and Furniture Removal", description: "Junk removals and rubbish clearance." },
        { title: "Heavy Lifting and Loading", description: "Moving heavy furniture through tight spaces." },
        { title: "Packing and Moving", description: "Complete packing services included." },
        { title: "Full Service Movers", description: "End-to-end relocation solutions." },
      ],
      faqs: [
        { question: "Do you offer transport options for small moves or single items?", answer: "Yes, we provide flexible man and van rental options and comprehensive man and van services perfect for studio moves or transporting individual pieces." },
        { question: "Can you help dispose of unwanted items before or after the move?", answer: "Our teams can handle efficient junk removals and rubbish removals to ensure your property is left clean and clutter-free." },
        { question: "Are your movers able to handle large, bulky items like pianos?", answer: "Our professionals specialise in moving heavy furniture through tight spaces without causing damage." },
        { question: "Do you offer full packing assistance along with transport?", answer: "We offer complete moving and packing services to save you time, including high-quality packing services in London for a fully hands-off experience." },
      ],
    },
  },
  "outdoor": {
    "great-outdoors": {
      title: "The Great Outdoors Care Service",
      description: "Your garden is more than just a patch of grass - it's a place to relax, entertain, and connect with nature. Let 100 Handy care for your great outdoors.",
      category: "outdoor",
      categoryDisplay: "The Great Outdoors",
      longDescription: "Whether you are looking for a reliable gardening company near me or a specialist for a complex project, our network of skilled professionals is ready to transform your outdoor space. Choose the help you need, when you need it: Lawn care services include mowing, edging, feeding, and ongoing maintenance. Lawn autumn treatment to strengthen grass and reduce moss before winter. Garden landscaping for design, planting, and garden transformations. Leaf raking services for seasonal clear-ups and neat, usable lawns. Roof cleaning to remove moss, debris, and buildup safely. Hedge trimming and pruning to keep boundaries sharp and plants healthy.",
      benefits: [
        { title: "Local Experts", description: "Vetted, local professionals with a track record of quality work." },
        { title: "Flexible Service", description: "One-time jobs or regular maintenance schedules." },
        { title: "Full Range", description: "From lawn care to landscaping to seasonal clean-ups." },
        { title: "Quality Guaranteed", description: "Work completed to the highest standards." },
      ],
      tasks: [
        { title: "Gardening", description: "General garden care and maintenance." },
        { title: "Lawn Care", description: "Mowing, edging, feeding, and ongoing maintenance." },
        { title: "Landscaping", description: "Design, planting, and garden transformations." },
        { title: "Leaf Raking and Removal", description: "Seasonal clear-ups for neat lawns." },
        { title: "Roof and Gutter Cleaning", description: "Safe removal of moss, debris, and buildup." },
        { title: "Branch and Hedge Trimming", description: "Keep boundaries sharp and plants healthy." },
      ],
      faqs: [
        { question: "How do I find a reliable gardener near me?", answer: "We make it easy. Instead of searching endlessly, 100 Handy connects you directly with vetted, local experts in your area who have a track record of quality work." },
        { question: "What is included in your lawn care services?", answer: "Our service is flexible. It generally includes mowing, edging, and weeding. However, we also offer specific treatments like fertilising and scarifying upon request." },
        { question: "Why is lawn autumn treatment necessary?", answer: "Autumn is a critical time for your grass. Treating it now helps it survive winter frost and ensures it grows back thick and healthy in the spring." },
        { question: "Do you offer cleanup services?", answer: "Yes! Our leaf raking services are very popular in autumn. We can rake, bag, and remove garden waste so your lawn can breathe." },
        { question: "How often do I need hedge trimming and pruning?", answer: "This depends on the species of your plants, but generally, we recommend a trim in spring and late summer to maintain shape and health." },
      ],
    },
  },
  "handyman": {
    "general": {
      title: "General Handyman Services",
      description: "Expert help for every odd job, repair, and upgrade in your home.",
      category: "handyman",
      categoryDisplay: "Handyman Services",
      longDescription: "From assembly and furniture setup to painting, light installation, plumbing, wall mounting, gardening, electrical work, home renovation, general repairs, and carpentry - our skilled Pros handle it all. Whatever the job, big or small, we connect you with trusted handymen who arrive prepared with the right tools and expertise to get it done right.",
      benefits: [
        { title: "Trusted & Vetted Pros", description: "Every Pro is background-checked, reviewed, and rated." },
        { title: "Wide Range of Services", description: "Assembly, mounting, repairs, painting, and more." },
        { title: "Seamless Booking", description: "Find, hire, and pay through our secure platform." },
        { title: "Happiness Pledge", description: "If something isn't right, we'll work to make it right." },
      ],
      tasks: [
        { title: "Assembly", description: "Build it right the first time. We assemble furniture, shelves, desks, cabinets, and more." },
        { title: "Furniture Assembly", description: "From flat-packs to heavy pieces, our pros handle setup with care." },
        { title: "Painting", description: "Refresh a room or fix scuffs and marks. Get clean edges and smooth coats." },
        { title: "Light Installation", description: "Swap, install, or replace light fixtures safely." },
        { title: "Plumbing", description: "Drips, leaks, replacements, and small plumbing jobs done efficiently." },
        { title: "Wall Mounting", description: "Mount TVs, mirrors, shelves, frames - straight, secure, and built to last." },
        { title: "Gardening", description: "Quick tidy-ups or ongoing care for your outdoor space." },
        { title: "Electrical Work", description: "Switches, sockets, small fixes handled safely." },
        { title: "Home Renovation", description: "Small upgrades that make a big difference." },
        { title: "General Repair Service", description: "Loose handles, broken latches, sticking doors - fixed properly." },
        { title: "Home Painting", description: "Walls, ceilings, touch-ups with clean, even coverage." },
        { title: "Carpentry", description: "Cuts, fixes, adjustments, and small builds." },
        { title: "Hanging Curtains, Installing Blinds", description: "Measured, aligned, and installed for smooth operation." },
      ],
      faqs: [
        { question: "How much do handyman services cost?", answer: "Prices vary by task complexity, but you can see hourly rates upfront before you book." },
        { question: "Do I need to provide any tools or equipment?", answer: "Most pros bring their own tools, but if you have specific materials (like the paint or the light bulb), let them know!" },
        { question: "Do you offer painting and decorating services?", answer: "Yes! We handle everything from touch-ups to full room painting." },
        { question: "Do you offer same-day handyman services?", answer: "Absolutely. Many of our pros are available for same-day bookings." },
        { question: "Can a Pro mount my TV on a wall bracket?", answer: "Yes, just make sure you have the correct bracket for your TV model, or ask your Pro for advice." },
      ],
    },
  },
};

// Find a category key that partially matches the given slug
function findCategoryKey(slug: string): string | undefined {
  // Exact match first
  if (servicesData[slug]) return slug;
  // Try partial match: check if any key contains the slug or vice versa
  return Object.keys(servicesData).find(
    (key) => key.includes(slug) || slug.includes(key)
  );
}

// Find a service key within a category that partially matches
function findServiceKey(
  categoryData: Record<string, ServiceData>,
  slug: string
): string | undefined {
  if (categoryData[slug]) return slug;
  return Object.keys(categoryData).find(
    (key) => key.includes(slug) || slug.includes(key)
  );
}

interface ServicePageProps {
  params: Promise<{
    category: string;
    service: string;
  }>;
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { category, service } = await params;

  // Find the service data with fuzzy slug matching
  const categoryKey = findCategoryKey(category);
  if (!categoryKey) {
    notFound();
  }

  const categoryData = servicesData[categoryKey];
  if (!categoryData) {
    notFound();
  }

  const serviceKey = findServiceKey(categoryData, service);
  if (!serviceKey) {
    notFound();
  }

  const serviceData = categoryData[serviceKey];
  if (!serviceData) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ServiceHero
          title={serviceData.title}
          description={serviceData.description}
        />
        <Breadcrumb
          category={serviceData.categoryDisplay}
          service={serviceData.title}
          categorySlug={category}
        />
        <ContentSection
          title={serviceData.title}
          longDescription={serviceData.longDescription}
          benefits={serviceData.benefits}
          tasks={serviceData.tasks}
        />
        <ServiceHowItWorks />
        <CTASection categoryName={serviceData.title} />
        <FAQs service={serviceData.title} faqs={serviceData.faqs} />
        <Cities service={serviceData.title} />
      </main>
      <Footer />
    </div>
  );
}

// Generate static params for all services
export async function generateStaticParams() {
  const params: Array<{ category: string; service: string }> = [];

  Object.keys(servicesData).forEach((category) => {
    const categoryData = servicesData[category];
    if (categoryData) {
      Object.keys(categoryData).forEach((service) => {
        params.push({ category, service });
      });
    }
  });

  return params;
}
