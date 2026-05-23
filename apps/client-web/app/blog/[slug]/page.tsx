import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPostBySlug, getSurfaceSeoMetadata } from "@/lib/content-platform";

interface Section {
  heading?: string;
  body: string;
}

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  intro: string;
  sections: Section[];
  relatedSlugs: string[];
}

const posts: Record<string, Post> = {
  "tips-furniture-assembly": {
    slug: "tips-furniture-assembly",
    title: "10 Tips for a Stress-Free Furniture Assembly",
    date: "April 10, 2026",
    category: "Assembly",
    readTime: "6 min read",
    image: "/images/services/assembly/furniture-assembly.jpeg",
    intro:
      "Flat-pack furniture has a reputation for testing patience. But with a bit of preparation and the right approach, assembly can be quick and satisfying. Here are ten tips to help you get it right every time.",
    sections: [
      {
        heading: "1. Read the Instructions First",
        body: "It sounds obvious, but many people dive straight in and spend twice as long fixing mistakes. Scan all the pages before picking up a single tool. Understand the full build sequence so you are not caught out mid-way through.",
      },
      {
        heading: "2. Check All Parts Before You Start",
        body: "Lay out every part and cross-reference with the parts list. Missing a bolt halfway through is frustrating. Doing a parts check upfront takes two minutes and saves you a trip to the store or a long wait for a replacement.",
      },
      {
        heading: "3. Clear a Large, Clean Workspace",
        body: "Give yourself room. A cluttered floor leads to lost screws and scratched surfaces. If possible, work on a carpet or lay down a blanket to protect both the floor and your new furniture.",
      },
      {
        heading: "4. Use the Right Tools",
        body: "Most flat-pack furniture comes with an Allen key, but a powered screwdriver with the right bit will save your wrists on larger builds. A rubber mallet is also useful for gently persuading dowels and cam locks without causing damage.",
      },
      {
        heading: "5. Follow the Numbered Steps in Order",
        body: "Assembly instructions are sequenced deliberately. Skipping ahead — especially on wardrobes and bed frames — can leave you having to backtrack. Trust the process.",
      },
      {
        heading: "6. Don't Fully Tighten Until the End",
        body: "Keep screws and bolts finger-tight until the final piece is in place. This gives you flexibility to adjust alignment as you go. Once the structure is complete, do a final tighten-up all round.",
      },
      {
        heading: "7. Get a Second Pair of Hands for Large Pieces",
        body: "Wardrobes, bed frames, and large bookshelves are genuinely two-person jobs. Trying to hold a panel upright while inserting a dowel alone is how things get scratched, dropped, or assembled crooked.",
      },
      {
        heading: "8. Keep Small Parts in a Bowl or Tray",
        body: "Screws, cam locks, and dowels are tiny and easy to kick across the room. Use a bowl or small container to keep them organised. Group them by type so you can grab what you need without hunting.",
      },
      {
        heading: "9. Check for Squareness Before Tightening",
        body: "Before your final tighten, step back and check the frame looks square and level. A slight nudge now is far easier than trying to correct a twisted wardrobe after everything is locked down.",
      },
      {
        heading: "10. Know When to Call a Pro",
        body: "Some builds — particularly large wardrobes, multi-section shelving units, or anything involving wall fixings — are genuinely worth handing over. A 100 Handy Pro can complete most flat-pack builds in under two hours, and you get to skip the whole experience entirely.",
      },
    ],
    relatedSlugs: ["ikea-assembly-tips", "choose-right-handyman", "tv-mounting-guide"],
  },

  "spring-cleaning-checklist": {
    slug: "spring-cleaning-checklist",
    title: "Spring Cleaning Checklist: Room by Room",
    date: "March 25, 2026",
    category: "Cleaning",
    readTime: "7 min read",
    image: "/images/services/cleaning/deep-clean.jpeg",
    intro:
      "Spring cleaning is more than a deep dust. It is a reset — a chance to clear the clutter, freshen every corner, and start the warmer months feeling organised. Here is your room-by-room guide.",
    sections: [
      {
        heading: "Kitchen",
        body: "Start at the top and work down. Clear out all cupboards and wipe the insides. Degrease the oven, hob, and extractor fan filter — these are often ignored through the winter. Descale the kettle, clean behind the fridge, and wipe down every appliance. Finish with the floor, getting right into the corners.",
      },
      {
        heading: "Bathroom",
        body: "Descale the showerhead, taps, and toilet cistern. Re-caulk around the bath or shower if the sealant has gone mouldy. Scrub the grout between tiles with a stiff brush and a bicarbonate of soda paste. Clean inside the medicine cabinet and throw out anything expired.",
      },
      {
        heading: "Living Room",
        body: "Move the sofa and chairs to vacuum underneath and behind. Wash cushion covers, throws, and curtains. Clean light fittings and lampshades. Dust skirting boards, picture rails, and the tops of door frames — areas that collect dust all year. Wipe down the TV, remote controls, and any shelving.",
      },
      {
        heading: "Bedrooms",
        body: "Flip or rotate the mattress. Wash duvets, pillows, and mattress protectors. Clear under the bed — it is a magnet for dust and forgotten items. Wipe down wardrobe interiors and donate anything you have not worn in twelve months.",
      },
      {
        heading: "Hallway and Stairs",
        body: "This is the first thing guests see and the last thing owners tend to clean. Wipe down the skirting boards and bannisters. Clean the front door inside and out, including the letterbox and handle. Organise shoes, bags, and coats.",
      },
      {
        heading: "Windows",
        body: "Clean glass inside and out. Wipe down frames, sills, and tracks. If you have blinds, wipe each slat individually. This one task makes a visible difference to how much light comes into your home.",
      },
      {
        heading: "When to Bring in Professional Help",
        body: "Carpet cleaning, end-of-tenancy deep cleans, and oven cleaning are areas where a professional will always outperform a DIY effort. A 100 Handy cleaning Pro brings the tools and products that get results you simply cannot replicate with a supermarket spray.",
      },
    ],
    relatedSlugs: ["end-of-tenancy-cleaning", "choose-right-handyman", "signs-you-need-a-plumber"],
  },

  "choose-right-handyman": {
    slug: "choose-right-handyman",
    title: "How to Choose the Right Handyman for Your Project",
    date: "March 12, 2026",
    category: "Home Repairs",
    readTime: "5 min read",
    image: "/images/services/home-repairs/minor-home-repairs.jpeg",
    intro:
      "Hiring someone to work in your home requires trust. Whether you need a shelf put up or a bathroom renovated, choosing the right professional makes the difference between a job well done and a costly redo. Here is what to look for.",
    sections: [
      {
        heading: "Check Reviews and Ratings",
        body: "Always read reviews from real customers. Look for consistent patterns — not just the overall star rating. A professional with 50 four-star reviews is often more reliable than one with three five-star reviews. Pay attention to comments about punctuality, communication, and tidiness.",
      },
      {
        heading: "Match the Pro to the Job",
        body: "A general handyman is ideal for minor repairs, flat-pack assembly, shelf fitting, and odd jobs. For electrical work, plumbing, or structural changes, you need a specialist with the relevant certifications. Using the wrong person for the job creates risk.",
      },
      {
        heading: "Ask About Insurance",
        body: "Any professional working in your home should carry public liability insurance. This protects you if something goes wrong — a damaged wall, a broken fitting, or an accidental injury. On 100 Handy, every Pro is verified before they can accept bookings.",
      },
      {
        heading: "Get a Clear Scope Upfront",
        body: "Vague briefs lead to unexpected costs. Before the job starts, agree on exactly what is included: the tasks, the materials (who supplies them), the estimated time, and the price. A good professional will ask clarifying questions — that is a positive sign, not an annoyance.",
      },
      {
        heading: "Availability and Response Time",
        body: "How quickly someone responds to your enquiry tells you a lot about how they will handle the job itself. Slow communication, vague answers, or reluctance to confirm details are warning signs.",
      },
      {
        heading: "Why a Platform Makes It Easier",
        body: "Platforms like 100 Handy do the vetting work for you. Pros are identity-checked, reviewed by real customers, and backed by our satisfaction guarantee. You book online, confirm the scope, and the Pro shows up ready to work — no cold-calling tradespeople or chasing replies.",
      },
    ],
    relatedSlugs: ["tips-furniture-assembly", "tv-mounting-guide", "signs-you-need-a-plumber"],
  },

  "tv-mounting-guide": {
    slug: "tv-mounting-guide",
    title: "The Safe Way to Mount a TV on Any Wall Type",
    date: "February 28, 2026",
    category: "Mounting",
    readTime: "6 min read",
    image: "/images/services/mounting/tv-mounting.jpeg",
    intro:
      "A wall-mounted TV transforms a living room — but get it wrong and you are looking at a cracked screen, a damaged wall, or worse. Different wall types require very different approaches. Here is what you need to know.",
    sections: [
      {
        heading: "Identify Your Wall Type First",
        body: "Before you pick up a drill, tap the wall and listen. A hollow sound means plasterboard (stud wall). A solid thud means brick or concrete. Each requires different fixings, and using the wrong ones is how TVs fall.",
      },
      {
        heading: "Plasterboard Walls",
        body: "Plasterboard alone cannot support the weight of a large TV. You must either fix into the timber studs behind the board (use a stud finder) or use specialist cavity wall anchors rated for the load. For TVs over 40 inches, always fix into studs — not just the board.",
      },
      {
        heading: "Brick and Concrete Walls",
        body: "These are the most forgiving for TV mounting. Use a masonry drill bit and hammer setting, then insert rawl plugs before screwing in the bracket. The key mistake here is using plugs that are too small for the screw diameter.",
      },
      {
        heading: "Choosing the Right Bracket",
        body: "Fixed brackets are the slimmest and most stable. Tilt brackets let you angle the screen down — useful for high mounting positions. Full-motion arms give the most flexibility but put the most stress on fixings. Always check the bracket's VESA compatibility and weight rating against your TV.",
      },
      {
        heading: "Cable Management",
        body: "Leaving cables dangling is the one thing that ruins the look of a wall-mounted TV. Options include surface-run cable tidies, in-wall cable routing (requires an electrician if near a socket), or a recessed media plate. Plan this before you drill.",
      },
      {
        heading: "Height and Viewing Angle",
        body: "The centre of the screen should sit at roughly eye level when seated — typically 100–110cm from the floor for most sofas. Mounting too high is one of the most common mistakes and leads to neck strain over time.",
      },
      {
        heading: "When to Book a Pro",
        body: "TV mounting is one of the most popular services on 100 Handy for good reason. A professional brings the right fixings for your wall type, a spirit level, and cable management — and the whole job is typically done in under an hour.",
      },
    ],
    relatedSlugs: ["tips-furniture-assembly", "choose-right-handyman", "ikea-assembly-tips"],
  },

  "signs-you-need-a-plumber": {
    slug: "signs-you-need-a-plumber",
    title: "5 Signs You Need a Plumber (Don't Ignore These)",
    date: "February 14, 2026",
    category: "Plumbing",
    readTime: "5 min read",
    image: "/images/services/plumbing/leak-fixing.jpeg",
    intro:
      "Plumbing problems rarely fix themselves. A small leak ignored becomes a mould problem. A slow drain ignored becomes a blockage. Here are five signs that it is time to stop waiting and book a plumber.",
    sections: [
      {
        heading: "1. Low Water Pressure Across Multiple Taps",
        body: "If a single tap has low pressure, it is likely a blocked aerator — a five-minute fix. But if pressure is low across the whole house, you could be looking at a leak in the main supply pipe, a build-up of limescale in older pipes, or a failing pressure regulator. This needs a professional diagnosis.",
      },
      {
        heading: "2. Water Draining Slowly",
        body: "A slow-draining sink or shower is usually a partial blockage. Many can be cleared with a plunger or drain cleaner. But if multiple drains in the house are slow, the blockage is likely deeper in the system — in the main drain or soil stack — and needs professional equipment to clear safely.",
      },
      {
        heading: "3. Unusual Sounds in the Pipes",
        body: "Banging pipes (water hammer), rattling behind walls, or a gurgling noise from drains after flushing are all signs of problems that are easier to address early. Banging typically means a loose pipe or pressure issue. Gurgling usually means a venting problem or a blocked drain.",
      },
      {
        heading: "4. Visible Damp or Water Stains",
        body: "Brown water stains on ceilings, damp patches on walls, or bubbling paint around pipes are never cosmetic issues — they are symptoms of an active leak. Even a slow drip can rot joists, feed mould growth, and cause structural damage over months. Do not wait.",
      },
      {
        heading: "5. Your Water Bill Has Suddenly Increased",
        body: "A spike in your water bill with no change in habits almost always means water is going somewhere it should not. Check visible pipes and the toilet (a running cistern wastes up to 400 litres per day). If you cannot find the source, you may have a leak underground or behind a wall.",
      },
      {
        heading: "Act Early, Save Money",
        body: "The cost of a plumber call-out is almost always less than the cost of repairing water damage. A 100 Handy plumbing Pro can diagnose, quote, and resolve most common household plumbing issues in a single visit.",
      },
    ],
    relatedSlugs: ["choose-right-handyman", "spring-cleaning-checklist", "end-of-tenancy-cleaning"],
  },

  "garden-spring-prep": {
    slug: "garden-spring-prep",
    title: "How to Prepare Your Garden for Spring",
    date: "January 30, 2026",
    category: "Gardening",
    readTime: "6 min read",
    image: "/images/services/outdoor/gardening.jpeg",
    intro:
      "After months of cold weather, your garden needs attention before it can thrive again. The work you do in late winter and early spring sets the foundation for the whole growing season. Here is where to start.",
    sections: [
      {
        heading: "Clear Winter Debris",
        body: "Dead leaves, fallen branches, and frost-damaged plant material left over winter can harbour pests and disease. Clear beds, borders, and lawns thoroughly before doing anything else. Compost healthy material and bin anything diseased.",
      },
      {
        heading: "Cut Back Perennials and Shrubs",
        body: "Most herbaceous perennials that were left standing over winter (for structure and wildlife value) should be cut back to ground level now. For shrubs, remove any dead, diseased, or crossing branches. For roses, prune to an outward-facing bud.",
      },
      {
        heading: "Feed and Aerate the Lawn",
        body: "Lawns take a beating over winter. Once the ground is workable, spike the lawn with a fork or aerator to improve drainage and air circulation. Apply a spring lawn feed to encourage growth. If there are bare patches, re-seed now.",
      },
      {
        heading: "Prepare Your Beds",
        body: "Turn over border soil to break up compaction. Add a generous layer of well-rotted compost or soil conditioner and work it in. This improves structure, drainage, and nutrient availability — the foundation of a productive growing season.",
      },
      {
        heading: "Service Your Tools and Equipment",
        body: "Sharpen spades, forks, and hoe blades. Clean and oil secateurs. Check your lawnmower — clean the blade, change the oil if applicable, and test the engine before the grass starts growing in earnest.",
      },
      {
        heading: "Plan What You Are Planting",
        body: "Work out what is going where before you buy plants and seeds. Consider sunlight levels in different parts of the garden, what did well last year, and what you want to achieve. A simple sketch saves a lot of rearranging later.",
      },
      {
        heading: "When to Get Help",
        body: "Hedge trimming, tree work, and large-scale clearances are often better handled by professionals with the right equipment. A 100 Handy outdoor Pro can tackle the heavy-lifting jobs so you can focus on the parts you enjoy.",
      },
    ],
    relatedSlugs: ["spring-cleaning-checklist", "choose-right-handyman", "moving-house-guide"],
  },

  "moving-house-guide": {
    slug: "moving-house-guide",
    title: "Moving House? Here's How to Make It Less Stressful",
    date: "January 15, 2026",
    category: "Moving",
    readTime: "7 min read",
    image: "/images/services/moving/packing-and-moving.jpeg",
    intro:
      "Moving house consistently ranks as one of life's most stressful events. But most of the stress comes from poor preparation. With the right plan and the right help, the day itself can run smoothly. Here is how.",
    sections: [
      {
        heading: "Start Earlier Than You Think",
        body: "Most people underestimate how long packing takes. Begin with rooms you use least — spare bedrooms, loft storage, garage — at least four weeks out. Leave everyday essentials until the final 48 hours.",
      },
      {
        heading: "Declutter Before You Pack",
        body: "Moving is the perfect opportunity to get rid of things you do not use. Donate, sell, or dispose of anything you would not bother unpacking in your new home. Every item you cut from the move saves time on both ends.",
      },
      {
        heading: "Label Every Box — Including the Room and Contents",
        body: "A box labelled 'Kitchen — pots, pans, utensils' is infinitely more useful than one labelled 'Kitchen'. Include a brief contents list on the top and side of each box. This makes unpacking systematic rather than chaotic.",
      },
      {
        heading: "Pack a Moving Day Essentials Bag",
        body: "Keep a separate bag with everything you will need on day one: phone charger, toiletries, a change of clothes, important documents, keys, snacks, and kettle with teabags. This should travel in your personal vehicle, not the removal van.",
      },
      {
        heading: "Book Help Early",
        body: "Removal vans, van hire, and moving help all get booked up — especially at month ends and on Fridays. Book at least three weeks ahead if possible. For smaller moves or heavy lifting help, a 100 Handy moving Pro can be booked at short notice.",
      },
      {
        heading: "Protect Your Furniture",
        body: "Wrap furniture corners with bubble wrap or moving blankets. Disassemble what you can — bed frames, large shelves, and dining tables move much more easily in parts. Keep all fixings in labelled zip-lock bags taped to the relevant piece.",
      },
      {
        heading: "On the Day",
        body: "Walk through every room, cupboard, loft hatch, and outdoor space before you leave. Check meters and take photos. Hand keys over and confirm your new address with your bank, GP, and any subscription services.",
      },
    ],
    relatedSlugs: ["end-of-tenancy-cleaning", "tips-furniture-assembly", "choose-right-handyman"],
  },

  "end-of-tenancy-cleaning": {
    slug: "end-of-tenancy-cleaning",
    title: "End-of-Tenancy Cleaning: A Complete Guide for Renters",
    date: "December 20, 2025",
    category: "Cleaning",
    readTime: "6 min read",
    image: "/images/services/cleaning/end-of-tenancy.jpeg",
    intro:
      "Getting your full deposit back hinges on leaving your rental in the same condition you found it. Landlords and letting agents check closely. Here is a comprehensive guide to make sure nothing gets missed.",
    sections: [
      {
        heading: "Start with the Inventory Check-In Report",
        body: "Before you start cleaning, pull up your original check-in inventory. This is the definitive record of the property's condition when you moved in. Your cleaning should address any difference between then and now — not anything that was pre-existing.",
      },
      {
        heading: "Kitchen: The Most Scrutinised Room",
        body: "Degrease the oven inside and out — letting agencies check this without fail. Clean the hob, extractor, and all inside surfaces of cupboards and drawers. Defrost the freezer and clean the fridge. Limescale on taps and sinks is expected to be removed.",
      },
      {
        heading: "Bathroom",
        body: "Remove all limescale from tiles, taps, showerhead, and toilet. Regrout or clean grout if it has gone dark. Clean inside the toilet cistern if accessible. Wipe behind and underneath the toilet and sink.",
      },
      {
        heading: "Walls and Ceilings",
        body: "Scuff marks can often be removed with a magic eraser. Small nail holes should be filled with decorator's filler and touched up with matching paint. If you have repainted a wall during your tenancy without permission, you may need to return it to the original colour.",
      },
      {
        heading: "Carpets and Flooring",
        body: "Vacuuming is not enough if there are stains. Professional carpet cleaning is often stipulated in tenancy agreements — and it is almost always worth the cost to avoid a deduction. Hard floors should be mopped, including underneath any furniture.",
      },
      {
        heading: "Windows",
        body: "Clean inside glass thoroughly. External glass is typically not the tenant's responsibility unless specifically stated in the agreement. Wipe window frames, sills, and tracks.",
      },
      {
        heading: "The Professional Clean Option",
        body: "Many tenancy agreements require a professional end-of-tenancy clean on checkout. Even where not required, it is often the safest choice. A 100 Handy cleaning Pro will produce a clean that meets the standards letting agents expect, and can issue a receipt as evidence.",
      },
    ],
    relatedSlugs: ["spring-cleaning-checklist", "moving-house-guide", "signs-you-need-a-plumber"],
  },

  "ikea-assembly-tips": {
    slug: "ikea-assembly-tips",
    title: "IKEA Assembly Tips: The Mistakes Everyone Makes",
    date: "December 5, 2025",
    category: "Assembly",
    readTime: "5 min read",
    image: "/images/services/assembly/ikea-assembly.jpeg",
    intro:
      "IKEA furniture is designed to be assembled by anyone. In practice, millions of people make the same avoidable mistakes every year. Here are the most common ones — and how to sidestep them.",
    sections: [
      {
        heading: "Skipping the Instructions",
        body: "IKEA instructions are actually excellent — visual, detailed, and carefully sequenced. The most common mistake is assuming you know better. Even if you have assembled this piece before, things change between versions and component layouts vary. Read through before you start.",
      },
      {
        heading: "Overtightening Cam Locks",
        body: "Cam locks (the disc-and-peg fittings used in most IKEA carcasses) should be turned until snug — roughly a quarter turn past the point of resistance. Overtightening cracks the MDF and leaves you with a weakened joint that cannot be fixed.",
      },
      {
        heading: "Getting Panels the Wrong Way Round",
        body: "Many IKEA pieces have subtle differences between sides — a pre-drilled hole in a slightly different position, or a veneer direction. Check the diagrams carefully before inserting any dowels or fittings. Reversing a panel once dowels are glued in is very difficult.",
      },
      {
        heading: "Working on a Hard Floor",
        body: "Hard floors scratch surfaces and make panels slide around. Lay down a blanket or duvet before you start. It also makes finding dropped screws much easier.",
      },
      {
        heading: "Assembling in the Wrong Room",
        body: "Check the assembled dimensions before you start. Large wardrobes and bookcases are sometimes impossible to carry through a door once assembled. In some cases you need to partially assemble, move, then complete the build in situ.",
      },
      {
        heading: "Not Attaching the Wall Fixing",
        body: "IKEA includes wall fixings with most tall furniture for a reason. Bookshelves, wardrobes, and high units are a tip hazard without them — especially in homes with children. Always use the anti-tip fixing, even if the unit seems stable.",
      },
      {
        heading: "Trying to Assemble Alone",
        body: "A second pair of hands is not optional for larger pieces. Trying to hold a side panel upright while inserting back panel fixings is how things go crooked or get dropped. For any wardrobe or large shelving unit, get help — or book a 100 Handy Pro who brings the experience to do it cleanly and quickly.",
      },
    ],
    relatedSlugs: ["tips-furniture-assembly", "tv-mounting-guide", "choose-right-handyman"],
  },
};

const allPosts = Object.values(posts);

function getRelatedPosts(relatedSlugs: string[]) {
  return relatedSlugs.map((s) => posts[s]).filter(Boolean) as Post[];
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const livePost = await getBlogPostBySlug(slug);
  const fallbackPost = posts[slug];
  const post = livePost
    ? {
        title: livePost.title,
        intro: livePost.excerpt ?? fallbackPost?.intro ?? '',
        image: livePost.cover_image_url ?? fallbackPost?.image,
      }
    : fallbackPost;

  if (!post) return { title: "Post Not Found | 100 Handy" };

  return getSurfaceSeoMetadata('blog_post', slug, {
    title: `${post.title} | 100 Handy Blog`,
    description: post.intro,
    openGraph: post.image ? { images: [{ url: post.image }] } : undefined,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const livePost = await getBlogPostBySlug(slug);
  const fallbackPost = posts[slug];

  let post = fallbackPost;

  if (livePost) {
    let parsedBody: { intro?: string; readTime?: string; sections?: Section[]; relatedSlugs?: string[] } = {}
    try {
      parsedBody = livePost.body ? JSON.parse(livePost.body) : {}
    } catch {
      parsedBody = {}
    }

    post = {
      slug: livePost.slug,
      title: livePost.title,
      date: livePost.published_at
        ? new Date(livePost.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : fallbackPost?.date ?? '',
      category: livePost.category ?? fallbackPost?.category ?? 'General',
      readTime: parsedBody.readTime ?? fallbackPost?.readTime ?? '5 min read',
      image: livePost.cover_image_url ?? fallbackPost?.image ?? '/images/hero/heroimage2.jpeg',
      intro: parsedBody.intro ?? livePost.excerpt ?? fallbackPost?.intro ?? '',
      sections: parsedBody.sections && parsedBody.sections.length > 0 ? parsedBody.sections : fallbackPost?.sections ?? [],
      relatedSlugs: parsedBody.relatedSlugs ?? fallbackPost?.relatedSlugs ?? [],
    };
  }

  if (!post) notFound();

  const related = getRelatedPosts(post.relatedSlugs);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative h-[420px] bg-[#3D4539]">
          <div className="absolute inset-0">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover opacity-40"
              sizes="100vw"
              priority
            />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
            <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-[13px] font-semibold text-white uppercase tracking-widest">
              {post.category}
            </span>
            <h1 className="max-w-3xl text-[42px] md:text-[52px] font-bold leading-tight text-white">
              {post.title}
            </h1>
            <div className="mt-5 flex items-center gap-4 text-white/70 text-[14px]">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </section>

        {/* Article Body */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-6">

            {/* Breadcrumb */}
            <div className="mb-10 flex items-center gap-2 text-[13px] text-brand-dark-alt/50">
              <Link href="/blog" className="hover:text-brand-terracotta transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-brand-dark-alt">{post.title}</span>
            </div>

            {/* Intro */}
            <p className="text-[20px] leading-relaxed text-brand-dark-alt font-medium mb-10 border-l-4 border-brand-terracotta pl-5">
              {post.intro}
            </p>

            {/* Sections */}
            <div className="space-y-10">
              {post.sections.map((section, i) => (
                <div key={i}>
                  {section.heading && (
                    <h2 className="text-[22px] font-bold text-brand-dark-alt mb-3">
                      {section.heading}
                    </h2>
                  )}
                  <p className="text-[17px] leading-relaxed text-brand-dark-alt/80">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Inline CTA */}
            <div className="mt-16 rounded-2xl bg-brand-cream p-8 text-center">
              <h3 className="text-[24px] font-bold text-brand-dark-alt mb-3">
                Need a hand with this?
              </h3>
              <p className="text-[16px] text-brand-dark-alt/70 mb-6">
                Book a trusted 100 Handy Pro and get it done today — no hassle, no guesswork.
              </p>
              <Button variant="terracotta" size="lg" asChild>
                <Link href="/services">Book a Pro</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="mx-auto max-w-[1920px] px-8">
              <h2 className="mb-8 text-[28px] font-bold text-brand-dark-alt">Related Articles</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="group block">
                    <div className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
                      <div className="relative h-44 overflow-hidden">
                        <Image
                          src={r.image}
                          alt={r.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-6">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="rounded-full bg-brand-cream px-3 py-1 text-[12px] font-semibold text-brand-dark-alt">
                            {r.category}
                          </span>
                          <span className="text-[12px] text-brand-dark-alt/50">{r.readTime}</span>
                        </div>
                        <h3 className="text-[17px] font-bold leading-tight text-brand-dark-alt group-hover:text-brand-terracotta transition-colors">
                          {r.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Button variant="outline" asChild>
                  <Link href="/blog">← Back to Blog</Link>
                </Button>
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
}
