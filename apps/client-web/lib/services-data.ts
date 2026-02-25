export interface ServiceData {
  title: string;
  description: string;
  category: string;
  categoryDisplay: string;
  longDescription: string;
  heroImage?: string;
  contentImage?: string;
  benefits?: Array<{ title: string; description: string }>;
  tasks?: Array<{ title: string; description: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  isSubcategory?: boolean;
}

export const servicesData: Record<string, Record<string, ServiceData>> = {
  "furniture-assembly": {
    "furniture-assembly": {
      title: "Furniture Assembly",
      description:
        "New furniture, zero stress. Book an experienced 100 Handy to assemble it quickly, correctly, and with care.",
      category: "furniture-assembly",
      categoryDisplay: "Furniture Assembly",
      heroImage: "/images/services/assembly/hero.jpeg",
      contentImage: "/images/services/assembly/furniture-assembly.jpeg",
      longDescription:
        "Unboxing new furniture feels exciting until you're staring at a mountain of panels, tiny screws, and instructions that somehow skip step 6. Furniture assembly often takes far longer than you think. What looks like a \"quick 30-minute job\" can turn into an entire evening of trial and error, missing tools, and pieces that don't line up the way you expected. Our Pros make it easy to skip the frustration and get it done right. Hire a skilled Pro for furniture assembly and enjoy a smooth, hassle-free setup - whether it's a single chair, a full bedroom set, or a tricky flat-pack build. Search in the app or on our website, compare an operative by reviews, skills, and pricing, then book a time that fits your schedule. Less time building. More time enjoying your space.",
      benefits: [
        {
          title: "Trusted & Vetted Pros",
          description:
            "Every Pro on 100 Handy is background-checked, reviewed, and rated by real users.",
        },
        {
          title: "Seamless Booking",
          description:
            "Find, hire, and pay your Pro seamlessly through our secure platform.",
        },
        {
          title: "Reliable Service",
          description:
            "From IKEA to custom furniture, Pros can handle all your assembly needs.",
        },
        {
          title: "Happiness Pledge",
          description:
            "We stand by the quality of our services. If something isn't right, we'll work to make it right.",
        },
      ],
      tasks: [
        {
          title: "Furniture Assembly",
          description: "Assembly of all types of furniture pieces.",
        },
        {
          title: "IKEA Assembly",
          description: "Expert assembly of IKEA furniture collections.",
        },
        {
          title: "Office Furniture Assembly",
          description: "Setting up your home office or workspace.",
        },
        {
          title: "Wardrobe Assembly",
          description: "Closet systems and wardrobes assembled with care.",
        },
        {
          title: "Crib Assembly",
          description: "Safe and secure assembly for baby furniture.",
        },
      ],
      faqs: [
        {
          question: "What tools do I need for furniture assembly?",
          answer:
            "Most handymen bring common tools needed for assembly. If your item requires a specialty tool (or wall anchors, brackets, etc.), mention it in your task details so your Pro can come prepared.",
        },
        {
          question: "How much does furniture assembly cost?",
          answer:
            "Pricing varies by handymen and depends on the type of furniture, complexity, and estimated time. You'll see rates upfront when you browse available Handymen in your area.",
        },
        {
          question:
            "Can a 100 Handy Pro help me with office furniture installation?",
          answer:
            "Yes, your handyman can assemble desks, chairs, filing cabinets, conference tables, and other office furniture - whether it's one piece or a full workspace setup.",
        },
        {
          question: "How long does furniture assembly take?",
          answer:
            "Time depends on the size and complexity of the item. A simple piece can be quick, while larger or multi-part builds take longer. Share the product details (or a photo/link) for a more accurate estimate.",
        },
      ],
    },
    "ikea-assembly": {
      title: "IKEA Assembly",
      description:
        "Flat-pack furniture can be tricky to build alone, especially with larger pieces and detailed instructions. Our professional IKEA assembly service helps you get furniture set up quickly, safely, and ready to use.",
      category: "furniture-assembly",
      categoryDisplay: "Furniture Assembly",
      heroImage: "/images/services/assembly/hero.jpeg",
      contentImage: "/images/services/assembly/ikea-assembly.jpeg",
      longDescription:
        "Flat-pack furniture can be time-consuming and frustrating. Our IKEA furniture assembly service makes it simple to set up beds, wardrobes, desks, and storage quickly and correctly. Whether you need an IKEA furniture assembly service London, a service to assemble IKEA furniture near me, or full IKEA furniture assembly services UK, we handle every step so your furniture is ready to use. From single items to full room setups, our experts provide a reliable assemble IKEA furniture service at a transparent IKEA furniture assembly service cost. If you are searching for a furniture assembly service IKEA, an assembling IKEA furniture service, or an IKEA furniture assembly service near me for your home or office, we deliver efficient installations with attention to detail.",
      isSubcategory: true,
      faqs: [
        {
          question: "What furniture can you assemble from IKEA?",
          answer:
            "We assemble wardrobes, beds, sofas, storage units, desks, and more.",
        },
        {
          question: "Do you offer same-day IKEA assembly?",
          answer:
            "Yes, same-day and next-day bookings are often available.",
        },
        {
          question: "Do I need tools for IKEA furniture assembly?",
          answer:
            "No, our professionals arrive fully equipped with all required tools.",
        },
        {
          question: "How much does IKEA furniture assembly cost?",
          answer:
            "Costs vary depending on item size and complexity, but transparent pricing is always provided.",
        },
      ],
    },
    "office-furniture-assembly": {
      title: "Office Furniture Assembly",
      description:
        "Setting up office furniture properly helps create a comfortable and productive workspace. Our assembly service ensures desks, chairs, and storage are installed safely and ready for daily use.",
      category: "furniture-assembly",
      categoryDisplay: "Furniture Assembly",
      heroImage: "/images/services/assembly/hero.jpeg",
      contentImage: "/images/services/assembly/office-furniture-assembly.jpeg",
      longDescription:
        "Office setups can be time-consuming and difficult without the right tools. Our office furniture assembly service makes it easy to install desks, chairs, shelving, and workstations quickly and correctly. Whether you need office furniture assembly London, experienced office furniture assemblers, or help with assembled home office furniture, we handle every step so your workspace is ready to use. From single desks to complete workplace setups, we provide one of the best office furniture assembly service experiences with flexible booking options. If you are searching for best office furniture assembly services UK or a reliable office furniture assembly service, our team delivers efficient installations with attention to detail.",
      isSubcategory: true,
      faqs: [
        {
          question: "What office furniture do you assemble?",
          answer:
            "We assemble desks, chairs, storage units, shelving, and meeting room furniture.",
        },
        {
          question: "Do you assemble home office furniture?",
          answer:
            "Yes, we assemble all types of home office desks, chairs, and storage.",
        },
        {
          question: "Can you assemble full office setups?",
          answer:
            "Absolutely — we handle everything from single items to full office installations.",
        },
        {
          question: "How quickly can I book office furniture assembly?",
          answer: "Same-day and next-day bookings are often available.",
        },
      ],
    },
    "wardrobe-assembly": {
      title: "Wardrobe Assembly",
      description:
        "Wardrobes can be large and complex to assemble, especially sliding and fitted designs. Our wardrobe assembly service ensures secure installation and a tidy finish.",
      category: "furniture-assembly",
      categoryDisplay: "Furniture Assembly",
      heroImage: "/images/services/assembly/hero.jpeg",
      contentImage: "/images/services/assembly/wardrobe-assembly.png",
      longDescription:
        "Large wardrobes can be difficult to assemble alone. Our wardrobe assembly service makes it easy to build hinged, sliding, and fitted wardrobes quickly and correctly. Whether you need wardrobe assembly near me, a reliable wardrobe assembly service near me, or specialist IKEA wardrobe assembly, we handle every step so your storage is ready to use. From compact bedroom units to full wardrobe systems, our team delivers careful and efficient wardrobe assembly with attention to safety and stability.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you assemble IKEA wardrobes?",
          answer:
            "Yes, we assemble IKEA and all major wardrobe brands.",
        },
        {
          question: "Can wardrobes be secured to the wall?",
          answer: "Yes, we safely anchor wardrobes when required.",
        },
        {
          question: "How long does wardrobe assembly take?",
          answer:
            "Most wardrobes take 2\u20134 hours depending on size.",
        },
        {
          question: "Do you offer same-day wardrobe assembly?",
          answer:
            "Same-day availability is possible in many areas.",
        },
      ],
    },
    "crib-assembly": {
      title: "Crib Assembly",
      description:
        "Setting up nursery furniture safely is essential for your baby's comfort and security. Our crib assembly service ensures careful installation following manufacturer guidelines.",
      category: "furniture-assembly",
      categoryDisplay: "Furniture Assembly",
      heroImage: "/images/services/assembly/hero.jpeg",
      contentImage: "/images/services/assembly/crib-assembly.jpeg",
      longDescription:
        "Nursery furniture must be assembled correctly for safety and stability. Our crib assembly service helps you assemble crib units quickly and securely so your baby's space is ready. Whether you need full crib assembly for a new nursery or assistance building multiple nursery items, we follow instructions carefully and ensure all fittings are secure. From standard cribs to convertible designs, our professionals deliver reliable assembly with attention to detail and safety.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you assemble all crib brands?",
          answer:
            "Yes, we assemble cribs from all major brands.",
        },
        {
          question: "Is crib assembly safe?",
          answer:
            "Our professionals follow manufacturer instructions for secure assembly.",
        },
        {
          question: "How long does crib assembly take?",
          answer: "Typically between 1\u20132 hours.",
        },
        {
          question: "Can you assemble other nursery furniture?",
          answer:
            "Yes, we can assemble changing tables, drawers, and storage units.",
        },
      ],
    },
  },
  "tv-wall-mounting": {
    "tv-mounting": {
      title: "Professional TV & Wall Mounting Service",
      description:
        "Turn your living room into a clean, cinema-worthy setup - without the stress, the crooked screen, or the mystery wires.",
      category: "tv-wall-mounting",
      categoryDisplay: "TV & Wall Mounting",
      heroImage: "/images/services/mounting/hero.png",
      contentImage: "/images/services/mounting/tv-mounting.jpeg",
      longDescription:
        "We are aware that it is a nerve-wracking task to mount a TV, and it may be physically challenging. The fact that something that appears to be an easy task turns into a nightmare of having to move heavy things, deal with incomprehensible brackets, and the possibility of digging a hole in the wrong location is not new. The last thing one wants to have after purchasing a beautiful new 4K TV is to have a hard time adjusting it, or, even worse, trashing your wall or even the gadget itself. Choose from a range of popular services, all completed with the right fixings, tools, and care for your walls. 100 Handy will provide you with a chance to skip that stress and a chance to avoid jeopardizing your time by matching you with a skilled worker who provides expert services in TV installation.",
      benefits: [
        {
          title: "Professional Installation",
          description:
            "Pros have the right tools and experience to mount your TV safely.",
        },
        {
          title: "Cable Management",
          description:
            "Hide cables and wires for a clean, professional look.",
        },
        {
          title: "Wall Assessment",
          description:
            "Pros can assess your wall type and use appropriate mounting hardware.",
        },
        {
          title: "Happiness Guarantee",
          description:
            "All backed by the 100 Handy Happiness Guarantee.",
        },
      ],
      tasks: [
        {
          title: "TV Mounting",
          description:
            "Flat, tilt, or full-motion brackets; all TV sizes.",
        },
        {
          title: "Put Up Shelves",
          description:
            "Floating shelves, storage units, display shelves.",
        },
        {
          title: "Hanging Pictures and Artwork",
          description: "Secure and level hanging for all wall art.",
        },
        {
          title: "Light Installation",
          description:
            "Ceiling lights, wall lights, fittings, LED features.",
        },
        {
          title: "Install Curtains and Blinds",
          description:
            "Measured, aligned, and installed for smooth operation.",
        },
      ],
      faqs: [
        {
          question: "How long does TV mounting take?",
          answer:
            "Most installations take around 1\u20132 hours, depending on wall type, bracket style, and whether cable hiding or add-ons are included.",
        },
        {
          question: "Can you mount on plasterboard/stud walls?",
          answer:
            "Yes - installers use the correct anchors or mount into studs where needed to ensure a safe, stable fit.",
        },
        {
          question: "Do you provide cable management?",
          answer:
            "Yes. You can request neat cable routing, including trunking or in-wall concealment where appropriate.",
        },
        {
          question:
            "Can I book shelves, lights, and curtains/blinds at the same time?",
          answer:
            "Absolutely. Many customers combine TV mounting with shelf mounting, lighting installs, and blinds and curtains installation in one visit.",
        },
        {
          question: "Do you cover all of London?",
          answer:
            "Yes - TV mounting service in London is available across central, North, South, East, and West London (and often nearby areas too).",
        },
      ],
    },
    "tv-wall-mounting": {
      title: "TV Mounting",
      description:
        "Mount your TV safely and enjoy a clean, modern setup without visible cables or unstable brackets. Our TV mounting service ensures secure installation on all wall types.",
      category: "tv-wall-mounting",
      categoryDisplay: "TV & Wall Mounting",
      heroImage: "/images/services/mounting/hero.png",
      contentImage: "/images/services/mounting/tv-mounting.jpeg",
      longDescription:
        "Mounting a TV requires precision, the right tools, and safe positioning. Our TV mounting service makes it easy to install all screen sizes quickly and securely. Whether you need a TV wall mounting service London, a TV wall mounting service near me, or reliable TV mounting service near me, we handle every step so your viewing setup is ready. From standard brackets to full installations, we provide professional TV wall mounting services, including TV mount service near me, TV wall mount service, and help to mount TV on wall service requests. If you are searching for same day TV wall mounting service, TV mounting service London, or dependable TV wall mounting services near me, our experts deliver efficient installations with tidy results.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you supply TV brackets?",
          answer:
            "We can install your bracket or recommend suitable options.",
        },
        {
          question: "Can you hide cables during TV mounting?",
          answer: "Yes, we offer cable management solutions.",
        },
        {
          question: "Do you mount TVs on all wall types?",
          answer:
            "Yes, including plasterboard, brick, and concrete walls.",
        },
        {
          question: "How long does TV mounting take?",
          answer: "Most installations take under an hour.",
        },
      ],
    },
    "wall-mounting": {
      title: "Wall Mounting",
      description:
        "Wall mounting helps maximise space while keeping your home organised and visually clean. Our service ensures shelves and fixtures are securely fitted.",
      category: "tv-wall-mounting",
      categoryDisplay: "TV & Wall Mounting",
      heroImage: "/images/services/mounting/hero.png",
      contentImage: "/images/services/mounting/wall-mounting.jpeg",
      longDescription:
        "Wall fixtures must be installed safely to prevent damage and ensure stability. Whether you need a book shelf mounted on wall or help with a wall mount wall shelf, our professionals handle accurate measurements, drilling, and secure fittings. From decorative pieces to practical storage, we deliver reliable wall mounting that keeps your space organised and functional.",
      isSubcategory: true,
      faqs: [
        {
          question: "What items can you wall mount?",
          answer:
            "Shelves, cabinets, mirrors, TVs, and decorative pieces.",
        },
        {
          question: "Do you mount on plasterboard walls?",
          answer:
            "Yes, we use the correct fixings for each wall type.",
        },
        {
          question: "Can you mount multiple items in one visit?",
          answer:
            "Yes, multiple installations can be completed in one booking.",
        },
        {
          question: "Do you provide fixings?",
          answer:
            "We bring standard fixings and tools required.",
        },
      ],
    },
    "shelf-mounting": {
      title: "Shelf Mounting",
      description:
        "Shelves add both storage and style but need careful installation for safety and durability. Our shelf mounting service ensures secure and level results.",
      category: "tv-wall-mounting",
      categoryDisplay: "TV & Wall Mounting",
      heroImage: "/images/services/mounting/hero.png",
      contentImage: "/images/services/mounting/shelf-mounting.jpeg",
      longDescription:
        "Installing shelves without the right tools can lead to uneven or unsafe results. Our shelf mounting service provides accurate measurements and secure fittings for all shelf types. Whether you need floating shelves, wall storage, or multiple installations, our shelf mounting services ensure your shelves are level, stable, and ready to use.",
      isSubcategory: true,
      faqs: [
        {
          question: "What shelves can you install?",
          answer:
            "Floating shelves, bracket shelves, and heavy-duty storage shelves.",
        },
        {
          question: "Do you mount shelves on all wall types?",
          answer:
            "Yes, we install shelves on plasterboard, brick, and concrete walls.",
        },
        {
          question: "How long does shelf mounting take?",
          answer:
            "Most shelf installations take under an hour.",
        },
        {
          question: "Can you install multiple shelves?",
          answer:
            "Yes, we can install several shelves in one visit.",
        },
      ],
    },
    "hanging-pictures": {
      title: "Hanging Pictures and Artwork",
      description:
        "Display artwork and photos beautifully with secure and level installations. Our service ensures your walls stay damage-free while your d\u00e9cor looks perfect.",
      category: "tv-wall-mounting",
      categoryDisplay: "TV & Wall Mounting",
      heroImage: "/images/services/mounting/hero.png",
      contentImage: "/images/services/mounting/hanging-pictures.jpeg",
      longDescription:
        "Hanging pictures and artwork evenly can be challenging without the right tools. Our professionals provide accurate placement, secure fixings, and clean installations so your d\u00e9cor looks balanced and professionally displayed. Whether it's a gallery wall or a single statement piece, we ensure safe and precise hanging.",
      isSubcategory: true,
      faqs: [
        {
          question: "Can you hang large artwork?",
          answer:
            "Yes, we safely hang large and heavy artwork.",
        },
        {
          question: "Do you help with picture placement?",
          answer:
            "Yes, we can assist with layout and positioning.",
        },
        {
          question: "Will hanging pictures damage my wall?",
          answer:
            "We use suitable fixings to minimise wall damage.",
        },
        {
          question: "Can you hang multiple pictures in one visit?",
          answer:
            "Yes, gallery walls and multiple pieces can be installed.",
        },
      ],
    },
    "light-fixture-installation": {
      title: "Light Fixture Installation",
      description:
        "Installing light fixtures improves both functionality and ambience in your home. Our service ensures safe and professional electrical installation.",
      category: "tv-wall-mounting",
      categoryDisplay: "TV & Wall Mounting",
      heroImage: "/images/services/mounting/hero.png",
      contentImage: "/images/services/mounting/light-fixture-installation.jpeg",
      longDescription:
        "Lighting installation requires careful handling and electrical knowledge. Our lighting installation services include fitting ceiling lights, wall lights, and decorative fixtures safely and efficiently. Whether you need ceiling light installation service, LED lighting installation services, light fixture installation services near me, or specialist IKEA light installation service, we handle every step so your lighting works perfectly. From recessed lighting installation service to outdoor lighting installation services and lighting installation services London, our experts provide secure installations with attention to detail.",
      isSubcategory: true,
      faqs: [
        {
          question: "What light fixtures do you install?",
          answer:
            "Ceiling lights, wall lights, pendant lights, and LED fixtures.",
        },
        {
          question: "Do you install outdoor lighting?",
          answer:
            "Yes, we install garden and exterior lighting.",
        },
        {
          question: "Can you replace existing light fixtures?",
          answer:
            "Yes, we remove old fixtures and install new ones.",
        },
        {
          question: "How long does light fixture installation take?",
          answer: "Most installations take 30\u201390 minutes.",
        },
      ],
    },
    "curtains-and-blinds": {
      title: "Install Curtains and Blinds",
      description:
        "Curtains and blinds enhance privacy, light control, and interior style. Our installation service ensures smooth operation and secure fittings.",
      category: "tv-wall-mounting",
      categoryDisplay: "TV & Wall Mounting",
      heroImage: "/images/services/mounting/hero.png",
      contentImage: "/images/services/mounting/curtains-and-blinds.jpeg",
      longDescription:
        "Fitting window coverings can be tricky without proper tools and measurements. Our service covers blinds and curtains installation, including curtain and blind installation near me, blind and curtain installers, and curtains and blinds installation near me. Whether you need a curtain and blind installer, blinds and curtain rod installation service near me, or reliable curtain and blinds installer support, we handle accurate fitting and alignment. From single windows to full property installations, our professionals deliver neat and secure results.",
      isSubcategory: true,
      faqs: [
        {
          question: "What window coverings do you install?",
          answer:
            "Curtains, roller blinds, Venetian blinds, and blackout blinds.",
        },
        {
          question: "Do you install curtain rods?",
          answer:
            "Yes, we install rods, tracks, and fittings.",
        },
        {
          question: "Can you install blinds on all window types?",
          answer:
            "Yes, including standard and bay windows.",
        },
        {
          question: "How long does curtain and blind installation take?",
          answer:
            "Most installations take under an hour per window.",
        },
      ],
    },
  },
  "home-repairs": {
    "home-repairs": {
      title: "Home Repairs & Fixes",
      description:
        "Need help fixing broken items around the house? Skilled experts can handle repairs and maintenance quickly and efficiently.",
      category: "home-repairs",
      categoryDisplay: "Home Repairs & Fixes",
      heroImage: "/images/services/home-repairs/hero.jpeg",
      contentImage: "/images/services/home-repairs/minor-home-repairs.jpeg",
      longDescription:
        "We get it: small problems rarely stay small for long. A loose hinge turns into a crooked door. A wobbly drawer becomes a daily annoyance. And a \"quick fix\" can easily stretch into hours if you're missing tools, time, or the right know-how. That's where 100 Handy comes in. Our experienced Pros can handle a wide range of fixes in one visit - from kitchen cabinet repair to window blinds and shades repair, plus touch-ups, tightening, patching, and those odd jobs you've been putting off. Need something more specific? We also offer leather furniture repair for scuffs, splits, and wear that's bringing down your favourite pieces. Renovating or refreshing a room? Ask about our B&Q laminate flooring fitting service to help get a clean, level finish without the guesswork. However big or small the issue, we make it simple to get it sorted the right way. Help is on the way.",
      benefits: [
        {
          title: "Trusted & Vetted Pros",
          description:
            "Every handyman on 100 Handy is background-checked, reviewed, and rated by real users.",
        },
        {
          title: "Seamless Booking",
          description:
            "Find, hire, and pay your Pro seamlessly through our secure platform.",
        },
        {
          title: "Wide Range of Repairs",
          description:
            "From minor fixes to larger handyman projects, Pros can help with a variety of home maintenance needs.",
        },
        {
          title: "Happiness Pledge",
          description:
            "We stand by the quality of our services. If something isn't right, we'll work to make it right.",
        },
      ],
      tasks: [
        {
          title: "Minor Home Repairs",
          description: "Quick fixes and touch-ups around the house.",
        },
        {
          title: "Door, Cabinet, and Furniture Repairs",
          description: "Fixing hinges, handles, and structural issues.",
        },
        {
          title: "Window and Blinds Repair",
          description:
            "Restoring smooth operation to windows and blinds.",
        },
        {
          title: "Sealing and Caulking",
          description: "Waterproofing and finishing gaps and joints.",
        },
        {
          title: "Flooring and Tiling Help",
          description: "Repairs and installation assistance.",
        },
        {
          title: "Light Carpentry",
          description: "Custom cuts, fixes, and small builds.",
        },
      ],
      faqs: [
        {
          question: "What tools do I need for minor home repairs?",
          answer:
            "You don't need any - your 100 Handy Pro arrives with the right tools and fixings for the job.",
        },
        {
          question: "How much do home repairs & fixes usually cost?",
          answer:
            "Pricing depends on the task and time needed, and we'll confirm the cost upfront before work begins.",
        },
        {
          question:
            "Can you help with kitchen cabinet repair, blinds, and leather items?",
          answer:
            "Yes - 100 Handy covers kitchen cabinet repair, window blinds and shades repair, and leather furniture repair in one convenient visit.",
        },
        {
          question: "Do you offer B&Q laminate flooring fitting service?",
          answer:
            "Yes - ask for our B&Q laminate flooring fitting service, and we'll help you get a clean, professional finish.",
        },
      ],
    },
    "minor-home-repairs": {
      title: "Minor Home Repairs",
      description:
        "Small issues around the home can quickly build up. Our minor home repair service helps keep your property safe, functional, and well maintained.",
      category: "home-repairs",
      categoryDisplay: "Home Repairs & Fixes",
      heroImage: "/images/services/home-repairs/hero.jpeg",
      contentImage: "/images/services/home-repairs/minor-home-repairs.jpeg",
      longDescription:
        "Everyday household issues can be inconvenient without the right tools or skills. Our minor home repairs and minor home repair services cover everything from fittings and adjustments to general maintenance tasks. Whether you are searching for minor home repairs near me, support with home maintenance minor repairs, or reliable minor home repair help, our professionals handle small jobs efficiently. From general fixes to minor adjustments, we provide dependable solutions that keep your home running smoothly.",
      isSubcategory: true,
      faqs: [
        {
          question: "What counts as minor home repairs?",
          answer:
            "Tasks like fixing fittings, adjustments, small installations, and general maintenance.",
        },
        {
          question: "Do you offer same-day minor repairs?",
          answer:
            "Yes, same-day availability is often possible.",
        },
        {
          question: "Can multiple repairs be completed in one visit?",
          answer:
            "Yes, several small jobs can be handled together.",
        },
        {
          question: "Do I need to supply tools?",
          answer:
            "No, our professionals arrive fully equipped.",
        },
      ],
    },
    "door-cabinet-furniture-repairs": {
      title: "Door, Cabinet and Furniture Repairs",
      description:
        "Worn hinges, loose doors, and damaged furniture can affect daily comfort. Our repair service restores functionality and extends the life of your fixtures.",
      category: "home-repairs",
      categoryDisplay: "Home Repairs & Fixes",
      heroImage: "/images/services/home-repairs/hero.jpeg",
      contentImage:
        "/images/services/home-repairs/door-cabinet-furniture-repairs.jpeg",
      longDescription:
        "Damaged fixtures and furniture can be frustrating without professional help. Our furniture repair near me and furniture repairs near me service covers everything from leather furniture repair to general repair furniture solutions. Whether you need kitchen cabinet repair, kitchen cabinet hinge repair, kitchen cabinet door repair, or reliable cabinet repair near me, we restore stability and function. We also handle door repair, door lock repair near me, door frame repair, door handle repair, and patio door repairs near me, ensuring smooth operation across your home. If you are searching for furniture repair London, cabinet repair, or general door repairs, our experts deliver careful and efficient results.",
      isSubcategory: true,
      faqs: [
        {
          question: "What furniture can you repair?",
          answer:
            "Tables, chairs, cabinets, wardrobes, and upholstered furniture.",
        },
        {
          question: "Do you fix kitchen cabinet hinges?",
          answer:
            "Yes, we repair hinges, doors, and alignment issues.",
        },
        {
          question: "Can you repair door locks and handles?",
          answer:
            "Yes, we fix locks, handles, and door mechanisms.",
        },
        {
          question: "Do you offer same-day repairs?",
          answer: "Same-day bookings are often available.",
        },
      ],
    },
    "window-blinds-repair": {
      title: "Window and Blinds Repair",
      description:
        "Faulty blinds and window coverings can affect privacy and comfort. Our repair service restores smooth operation and functionality.",
      category: "home-repairs",
      categoryDisplay: "Home Repairs & Fixes",
      heroImage: "/images/services/home-repairs/hero.jpeg",
      contentImage: "/images/services/home-repairs/window-blinds-repair.jpeg",
      longDescription:
        "Broken blinds and window coverings can be inconvenient. Our service covers window blinds and shades repair, window blind cleaning and repair near me, and general repair window blinds and shades support. Whether you need repair house window blinds and shades, repair residential window blinds and shades, or specialist window blind and curtain repairs London, we provide efficient solutions. From cleaning and adjustments to full repairs, our professionals restore function and appearance.",
      isSubcategory: true,
      faqs: [
        {
          question: "What blinds can you repair?",
          answer:
            "Roller, Venetian, vertical, and blackout blinds.",
        },
        {
          question: "Do you repair window shades?",
          answer:
            "Yes, we repair shades and blind mechanisms.",
        },
        {
          question: "Can you clean and repair blinds?",
          answer:
            "Yes, cleaning and repair can be combined.",
        },
        {
          question: "How long does blind repair take?",
          answer:
            "Most repairs are completed within an hour.",
        },
      ],
    },
    "sealing-and-caulking": {
      title: "Sealing and Caulking",
      description:
        "Proper sealing helps prevent leaks, drafts, and moisture damage. Our caulking service keeps bathrooms, kitchens, and windows protected.",
      category: "home-repairs",
      categoryDisplay: "Home Repairs & Fixes",
      heroImage: "/images/services/home-repairs/hero.jpeg",
      contentImage: "/images/services/home-repairs/sealing-and-caulking.jpeg",
      longDescription:
        "Gaps and worn sealant can lead to moisture and energy loss. Our caulking and sealing services provide neat, durable finishes around sinks, baths, windows, and surfaces. Whether you are searching for caulking and sealing services near me or general sealing support, our professionals remove old sealant and apply clean, long-lasting caulking to protect your home.",
      isSubcategory: true,
      faqs: [
        {
          question: "Where can caulking be applied?",
          answer:
            "Bathrooms, kitchens, windows, doors, and flooring edges.",
        },
        {
          question: "Do you remove old sealant?",
          answer:
            "Yes, we remove and replace worn sealant.",
        },
        {
          question: "Is caulking waterproof?",
          answer:
            "Yes, we use waterproof sealants for wet areas.",
        },
        {
          question: "How long does sealing take?",
          answer:
            "Most jobs take under an hour depending on area size.",
        },
      ],
    },
    "flooring-and-tiling": {
      title: "Flooring and Tiling Help",
      description:
        "Damaged flooring or uneven tiles can impact both safety and appearance. Our service provides installation, repair, and finishing support for all floor types.",
      category: "home-repairs",
      categoryDisplay: "Home Repairs & Fixes",
      heroImage: "/images/services/home-repairs/hero.jpeg",
      contentImage: "/images/services/home-repairs/flooring-and-tiling.jpeg",
      longDescription:
        "Flooring projects can be complex without the right tools. Our flooring services near me and tiling services near me cover installation, repairs, and finishing. Whether you need wood floor installation service, floor repair services, laminate floor repair near me, or specialist bathroom tiling services, we deliver reliable results. From tile cutting service near me to floor sanding services, floor refinishing service, and london tiling services, our professionals handle every step. If you are searching for floor repair, wood floor repair near me, vinyl floor repair, or general flooring services London, we provide efficient solutions for durable and attractive flooring.",
      isSubcategory: true,
      faqs: [
        {
          question: "What flooring types do you work with?",
          answer:
            "Laminate, hardwood, vinyl, tile, and engineered flooring.",
        },
        {
          question: "Do you repair squeaky floors?",
          answer:
            "Yes, we fix squeaky and damaged flooring.",
        },
        {
          question: "Can you replace broken tiles?",
          answer:
            "Yes, we remove and replace individual tiles.",
        },
        {
          question: "Do you offer floor sanding?",
          answer:
            "Yes, sanding and refinishing services are available.",
        },
      ],
    },
    "light-carpentry": {
      title: "Light Carpentry",
      description:
        "Light carpentry helps improve storage, fixtures, and finishing details around your home. Our service provides precise adjustments and small woodwork tasks.",
      category: "home-repairs",
      categoryDisplay: "Home Repairs & Fixes",
      heroImage: "/images/services/home-repairs/hero.jpeg",
      contentImage: "/images/services/home-repairs/light-carpentry.jpeg",
      longDescription:
        "Small woodwork tasks can require specialist tools and skills. Our light carpentry services include adjustments, fittings, and minor woodworking projects. Whether you are searching for light carpentry near me or general light carpentry support, our professionals deliver careful and accurate work to improve functionality and finish.",
      isSubcategory: true,
      faqs: [
        {
          question: "What is light carpentry?",
          answer:
            "Minor woodworking tasks such as fittings, adjustments, and small builds.",
        },
        {
          question: "Do you install wooden fixtures?",
          answer:
            "Yes, shelves, trims, and small woodwork projects.",
        },
        {
          question: "Can carpentry be combined with repairs?",
          answer:
            "Yes, carpentry can be booked alongside other services.",
        },
        {
          question: "How long does light carpentry take?",
          answer:
            "Most tasks are completed within a few hours.",
        },
      ],
    },
  },
  plumbing: {
    plumbers: {
      title: "Plumbing Services",
      description:
        "Got a leak or a blockage that needs fixing? Experienced plumbers can help with repairs quickly and efficiently.",
      category: "plumbing",
      categoryDisplay: "Plumbers",
      heroImage: "/images/services/plumbing/hero.jpeg",
      contentImage: "/images/services/plumbing/leak-fixing.jpeg",
      longDescription:
        "We know that plumbing issues can often be messy and take longer than expected to resolve. That's why we offer these common solutions: Drip Hunt and Zap - We track down and crush leaks fast to dodge water havoc, mold monsters, and sky-high bills through expert leaking tap repair and comprehensive leak repair solutions. Gutter Guts Clear-Out - We blast blockages from sinks, loos, and pipes for seamless surges and zero backup blues with professional drain unblocking services. Pipe Patch and Swap - From quick fixes to total tube triumphs, we craft tough systems with pipe leak repair and water leak repair expertise that ace every code. Hot Water Wizards - We tweak, tune, and drop in heaters for endless steamy bliss and eco-smart savings with precision installations. Gadget Glow-Ups - Expert replacement kitchen tap services, washing machine installation, and water filter installation, fitted with pro polish for forever flair.",
      benefits: [
        {
          title: "Fast Response",
          description:
            "Quick turnaround for emergency plumbing issues.",
        },
        {
          title: "Experienced Plumbers",
          description:
            "Skilled pros who know how to diagnose and fix issues efficiently.",
        },
        {
          title: "Transparent Pricing",
          description: "Know the cost upfront before work begins.",
        },
        {
          title: "Quality Guaranteed",
          description:
            "All work backed by our satisfaction guarantee.",
        },
      ],
      tasks: [
        {
          title: "Leak Fixing",
          description:
            "Expert leaking tap repair and comprehensive leak solutions.",
        },
        {
          title: "Drain Unblocking",
          description:
            "Professional drain unblocking services for all pipes.",
        },
        {
          title: "Tap Replacement",
          description:
            "Kitchen and bathroom tap replacement services.",
        },
        {
          title: "Washing Machine Installation",
          description:
            "Proper plumbing connections for your appliances.",
        },
        {
          title: "Water Filter Installation",
          description: "Clean water solutions installed correctly.",
        },
      ],
      faqs: [
        {
          question: "How do I fix a dripping faucet?",
          answer:
            "Trust 100 Handy for swift leaking tap repair and replace kitchen tap services to seal drips and restore flawless flow.",
        },
        {
          question:
            "What causes drains to block and how to clear them?",
          answer:
            "100 Handy masters drain unblocking techniques to obliterate clogs and keep your pipes purring without backups.",
        },
        {
          question:
            "How can I install a washing machine properly?",
          answer:
            "100 Handy handles washing machine installation with precision plumbing connections to prevent leaks and ensure peak performance.",
        },
        {
          question:
            "What's the best way to address water leaks in pipes?",
          answer:
            "100 Handy excels in leak repair, pipe leak repair, water leak repair, and water filter installation for dry, pure protection.",
        },
      ],
    },
    "leak-fixing": {
      title: "Leak Fixing Help",
      description:
        "Leaks can cause serious damage to walls, ceilings, and floors if left untreated. Our leak fixing services provide fast detection and repair for taps, pipes, and hidden plumbing problems.",
      category: "plumbing",
      categoryDisplay: "Plumbers",
      heroImage: "/images/services/plumbing/hero.jpeg",
      contentImage: "/images/services/plumbing/leak-fixing.jpeg",
      longDescription:
        "Leaks can escalate quickly without professional repair. Our leaking tap repair, leak repair, and pipe leak repair services cover kitchen, bathroom, and ceiling leaks. Whether you need repair mixer tap leak, leaking pipe repair, water pipe leak repair, ceiling leak repair, or general plumbing leak repair, we deliver reliable solutions. From fixing mixer taps to repairing hidden leaks, our experts handle every step to protect your home and restore safe plumbing systems.",
      isSubcategory: true,
      faqs: [
        {
          question: "What types of leaks do you repair?",
          answer:
            "We repair leaking taps, pipes, mixer taps, and ceiling leaks.",
        },
        {
          question: "Can you fix leaking mixer taps?",
          answer:
            "Yes, our service covers repairing leaking mixer taps quickly and efficiently.",
        },
        {
          question: "Do you handle hidden pipe leaks?",
          answer:
            "Yes, we detect and repair hidden leaks inside walls and floors.",
        },
        {
          question: "Is emergency leak repair available?",
          answer:
            "Yes, we offer urgent leak fixing for critical situations.",
        },
      ],
    },
    "drain-unblocking": {
      title: "Drain Unblocking Help",
      description:
        "Blocked drains can disrupt your home, causing slow drainage, foul odors, and water damage. Our drain unblocking services clear stubborn blockages efficiently.",
      category: "plumbing",
      categoryDisplay: "Plumbers",
      heroImage: "/images/services/plumbing/hero.jpeg",
      contentImage: "/images/services/plumbing/drain-unblocking.jpeg",
      longDescription:
        "Drain unblocking can be challenging without the right tools. Our drain unblocker services near me cover sinks, showers, toilets, and outdoor drains. Whether you need emergency drain unblocking, unblock shower drain, unblock sink drain, bathroom drain unblocker, or external drain unblocker, we provide reliable solutions. From toilet drain unblocker services to unblock bath drains, our professionals restore smooth drainage quickly and safely.",
      isSubcategory: true,
      faqs: [
        {
          question: "What drains can you unblock?",
          answer:
            "Sinks, baths, showers, toilets, and external drains.",
        },
        {
          question: "Do you offer emergency drain unblocking?",
          answer:
            "Yes, urgent drain problems are cleared quickly.",
        },
        {
          question: "Can you unblock shower drains?",
          answer:
            "Yes, we remove hair, soap scum, and debris from shower drains.",
        },
        {
          question: "Do you provide outdoor drain services?",
          answer:
            "Yes, our external drain unblocker service handles garden and yard drains.",
        },
      ],
    },
    "tap-replacement": {
      title: "Tap Replacement Help",
      description:
        "Old or damaged taps waste water and reduce pressure. Our tap replacement service ensures proper function in kitchens and bathrooms.",
      category: "plumbing",
      categoryDisplay: "Plumbers",
      heroImage: "/images/services/plumbing/hero.jpeg",
      contentImage: "/images/services/plumbing/tap-replacement.jpeg",
      longDescription:
        "Replacing taps requires expertise and precision. Our services include replace tap washer, replace kitchen tap, tap valve replacement, and mixer tap washer replacement. Whether you need replacement tap handles, bath tap replacement, kitchen tap replacement near me, or tap washer replacement, our team provides complete solutions. From fixing leaking taps to installing new kitchen and bathroom taps, we make your plumbing reliable and efficient.",
      isSubcategory: true,
      faqs: [
        {
          question: "Can you replace kitchen and bathroom taps?",
          answer:
            "Yes, we handle all types of tap replacements.",
        },
        {
          question: "Do you fix dripping taps?",
          answer:
            "Yes, we repair leaks by replacing washers and valves.",
        },
        {
          question: "Can you install supplied taps?",
          answer:
            "Yes, we install customer-provided taps safely.",
        },
        {
          question: "Is emergency tap repair available?",
          answer:
            "Yes, urgent tap replacement is provided when needed.",
        },
      ],
    },
    "washing-machine-installation": {
      title: "Washing Machine Installation Help",
      description:
        "Incorrect washing machine installation can cause leaks, drainage issues, and electrical problems. Our experts ensure safe, efficient setup.",
      category: "plumbing",
      categoryDisplay: "Plumbers",
      heroImage: "/images/services/plumbing/hero.jpeg",
      contentImage:
        "/images/services/plumbing/washing-machine-installation.jpeg",
      longDescription:
        "Proper appliance installation prevents costly problems. Our washing machine installation services near me include installing washing machine connections, washing machine plumbing installation, and drain hose installation. Whether you need integrated washing machine installation, Currys washing machine installation, John Lewis washing machine installation, or washing machine installer near me, we provide reliable solutions. From connecting water supply and drainage to testing your machine, our professionals ensure your appliance works safely and efficiently.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you install integrated washing machines?",
          answer:
            "Yes, we handle both integrated and freestanding washing machines.",
        },
        {
          question: "Do you connect plumbing and drainage?",
          answer:
            "Yes, we connect supply lines, drainage hoses, and test the machine.",
        },
        {
          question: "Can you remove old washing machines?",
          answer:
            "Yes, removal and disposal services are available.",
        },
        {
          question:
            "Do you provide same-day washing machine installation?",
          answer:
            "Yes, installations are available depending on availability.",
        },
      ],
    },
    "water-filter-installation": {
      title: "Water Filter Installation Help",
      description:
        "Clean, filtered water protects your family and improves taste. Our water filter installation service ensures proper setup and performance.",
      category: "plumbing",
      categoryDisplay: "Plumbers",
      heroImage: "/images/services/plumbing/hero.jpeg",
      contentImage:
        "/images/services/plumbing/water-filter-installation.jpeg",
      longDescription:
        "Installing water filters requires precision and plumbing expertise. Our services include water filter installation, filtered water tap installation, water filter system installation, and whole house water filter installation. Whether you need faucet water filter installation, water filter installation London, or help installing under-sink or kitchen water filters, our professionals provide reliable, safe, and efficient solutions.",
      isSubcategory: true,
      faqs: [
        {
          question: "What types of filters do you install?",
          answer:
            "Tap filters, under-sink systems, and whole-house filters.",
        },
        {
          question: "Do you install filtered water taps?",
          answer:
            "Yes, we install filtered water taps for kitchens and appliances.",
        },
        {
          question: "Can you install customer-supplied filters?",
          answer:
            "Yes, we can install recommended or supplied systems.",
        },
        {
          question: "How long does installation take?",
          answer:
            "Typically one to two hours depending on the system.",
        },
      ],
    },
  },
  electrical: {
    electricians: {
      title:
        "Professional Electricians - Safe & Reliable Electrical Services",
      description:
        "Expert electrical solutions for your home and business - from quick repairs to complete installations, our certified electricians deliver quality finishing.",
      category: "electrical",
      categoryDisplay: "Electricians",
      heroImage: "/images/services/electrical/hero.jpeg",
      contentImage: "/images/services/electrical/light-installation.jpeg",
      longDescription:
        "Flickering lights, faulty sockets, or buzzing switches? 100 Handy electricians deliver fast, reliable fixes to keep your home powered safely and brightly. We handle everything from lighting installation and outdoor lighting installation to electrical socket installation, electrical socket and switch repair, electric switch repair, electrical switch installation, cable repair, and fiber optic cable repair - all with expert precision and code-compliant standards. Don't let electrical issues spark worry or risk fires from worn wiring, overloaded circuits, or damaged cables. Our pros provide thorough diagnostics, quality materials, and lasting solutions for homes and businesses, ensuring steady power and peace of mind every time.",
      benefits: [
        {
          title: "Certified Electricians",
          description:
            "All pros are qualified and experienced in electrical work.",
        },
        {
          title: "Safety First",
          description:
            "Code-compliant work that prioritizes your home's safety.",
        },
        {
          title: "Quick Diagnostics",
          description:
            "Fast identification and resolution of electrical issues.",
        },
        {
          title: "Quality Materials",
          description:
            "We use reliable, long-lasting components.",
        },
      ],
      tasks: [
        {
          title: "Light Installation",
          description:
            "Indoor and outdoor lighting installation services.",
        },
        {
          title: "Sockets Installation and Repair",
          description:
            "Electrical socket installation and repair.",
        },
        {
          title: "Switches Installation and Repair",
          description: "Electric switch repair and installation.",
        },
        {
          title: "Cables Repair",
          description:
            "Cable repair and fiber optic cable repair services.",
        },
      ],
      faqs: [
        {
          question: "Why are my lights flickering or dimming?",
          answer:
            "Loose connections or overloads are common culprits. 100 Handy experts perform lighting installation or outdoor lighting installation to diagnose and deliver steady, safe light.",
        },
        {
          question: "What if an outlet stops working?",
          answer:
            "Reset breakers first, then call us for electrical socket installation or electrical socket and switch repair to uncover wiring problems and restore reliable power.",
        },
        {
          question:
            "How do I fix a buzzing or sparking switch?",
          answer:
            "Wear or loose wires cause hazards. Let 100 Handy handle electric switch repair, electrical switch installation, or electrical socket and switch repair for safe results.",
        },
        {
          question: "What about damaged cables?",
          answer:
            "Frayed lines risk fires or outages. Trust 100 Handy for urgent cable repair or fibre optic cable repair to reconnect and protect your home's electrical system.",
        },
      ],
    },
    "light-installation": {
      title: "Light Installation Help",
      description:
        "Proper lighting improves visibility, safety, and aesthetics indoors and outdoors. Our experts install lighting systems efficiently and safely.",
      category: "electrical",
      categoryDisplay: "Electricians",
      heroImage: "/images/services/electrical/hero.jpeg",
      contentImage: "/images/services/electrical/light-installation.jpeg",
      longDescription:
        "Lighting installation requires expertise and safe electrical work. Our services include LED light installation, ceiling light installation, ambient lighting installation near me, outdoor lighting installation, and bespoke lighting installation. Whether you need garden lighting installer services, roof light installation, or commercial lighting installation, our team provides complete solutions. From LED lighting setups to landscape and ceiling light installation, we ensure your space is bright, safe, and stylish.",
      isSubcategory: true,
      faqs: [
        {
          question: "What types of lighting do you install?",
          answer:
            "Indoor, outdoor, LED, ceiling, and bespoke lighting.",
        },
        {
          question: "Do you replace old light fixtures?",
          answer:
            "Yes, removal and replacement is included.",
        },
        {
          question:
            "Can you install garden and landscape lighting?",
          answer:
            "Yes, we install outdoor, pathway, and garden lights.",
        },
        {
          question: "Is the installation safe?",
          answer:
            "Yes, all work is completed to electrical safety standards.",
        },
      ],
    },
    "sockets-installation-repair": {
      title: "Sockets Installation and Repair",
      description:
        "Reliable power access is essential for every home and workplace. Our experts ensure sockets are installed and repaired safely for everyday use.",
      category: "electrical",
      categoryDisplay: "Electricians",
      heroImage: "/images/services/electrical/hero.jpeg",
      contentImage:
        "/images/services/electrical/sockets-installation-repair.jpeg",
      longDescription:
        "Electrical socket installation and wall socket installation require proper tools and experience. Our services include how to install a plug socket, installing a plug socket, how to install a power socket, how to install electric socket, and how to install wall socket correctly. Whether you need socket installation indoors or installing an outside plug socket, installing outside socket, or outdoor socket installation, we deliver dependable results. From plug socket installation to electrical socket repair and electrical socket and switch repair, our professionals manage every step safely and efficiently.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you install new wall sockets?",
          answer:
            "Yes, we provide full electrical socket installation and wall socket installation services.",
        },
        {
          question: "Can you install outdoor sockets?",
          answer:
            "Yes, we handle installing an outside plug socket, installing outside socket, and outdoor socket installation.",
        },
        {
          question: "Do you repair faulty sockets?",
          answer:
            "Yes, we offer electrical socket repair and electrical socket and switch repair.",
        },
        {
          question:
            "Is professional installation safer than DIY?",
          answer:
            "Yes, professional socket installation ensures safety and compliance with electrical standards.",
        },
      ],
    },
    "switches-installation-repair": {
      title: "Switches Installation and Repair",
      description:
        "Functional switches improve lighting control and household safety. Our technicians ensure switches work reliably throughout your property.",
      category: "electrical",
      categoryDisplay: "Electricians",
      heroImage: "/images/services/electrical/hero.jpeg",
      contentImage:
        "/images/services/electrical/switches-installation-repair.jpeg",
      longDescription:
        "Our electrical switch installation and electric light switch installation services handle both new fittings and replacements. We provide electric switch repair, electrical switch repair, and how to repair electric switch solutions for faulty systems. Whether you need electrical outlet & switch installation or electrical outlet & switch repair, we ensure smooth operation. From installing an electrical switch to electrical transfer switch installation and how to install electrical plugs and switches, we manage every task professionally.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you repair light switches?",
          answer:
            "Yes, we provide electric switch repair and electrical switch repair.",
        },
        {
          question: "Can you install new switches?",
          answer:
            "Yes, we handle electrical switch installation and installing an electrical switch.",
        },
        {
          question: "Do you install transfer switches?",
          answer:
            "Yes, we offer electrical transfer switch installation services.",
        },
        {
          question:
            "Do you handle outlet and switch jobs together?",
          answer:
            "Yes, we provide electrical outlet & switch installation and repair services.",
        },
      ],
    },
    "cables-repair": {
      title: "Cables Repair",
      description:
        "Damaged cables can cause safety risks and service interruptions. Our technicians repair cables efficiently to restore function and safety.",
      category: "electrical",
      categoryDisplay: "Electricians",
      heroImage: "/images/services/electrical/hero.jpeg",
      contentImage: "/images/services/electrical/cables-repair.jpeg",
      longDescription:
        "Our cable repair services include fiber cable repair, fiber optic cable repair, fibre optic cable repair, and telephone cable repair. We also specialize in garage door cable repair, garage door repair cable replacement, and repair garage door cable solutions. Whether you are concerned about cost of garage door cable repair or need guidance on how to repair garage door cable, we provide secure and lasting repairs. From communication lines to mechanical cables, we restore reliability fast.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you repair garage door cables?",
          answer:
            "Yes, we offer garage door cable repair and replacement services.",
        },
        {
          question: "Can you fix fiber optic cables?",
          answer:
            "Yes, we provide fiber optic cable repair and fibre optic cable repair.",
        },
        {
          question: "Do you repair phone cables?",
          answer: "Yes, we handle telephone cable repair.",
        },
        {
          question: "Is pricing transparent?",
          answer:
            "Yes, we explain garage door cable repair cost before work begins.",
        },
      ],
    },
  },
  cleaning: {
    "sparkle-clean": {
      title: "Professional Sparkle Clean Services",
      description:
        "Does the thought of scrubbing floors and dusting shelves feel overwhelming? 100 Handy connects you with top-rated cleaners to make your space shine without you lifting a finger.",
      category: "cleaning",
      categoryDisplay: "Sparkle Clean",
      heroImage: "/images/services/cleaning/hero.png",
      contentImage: "/images/services/cleaning/clean.jpeg",
      longDescription:
        "Tired of dust bunnies, sticky floors, and endless chores? 100 Handy's Sparkle Clean pros bring professional cleaning services that shine, from house cleaning services to deep clean house cleaning services, end-of-tenancy cleaning, office cleaning, and Airbnb cleaning service. We scrub away the mess so you reclaim your time and sparkle. Say goodbye to stress from cluttered spaces, pet hair chaos, or post-party disasters - our eco-friendly, thorough teams use safe, powerful products for spotless results every time. Perfect for busy families, renters, hosts, and offices seeking reliable freshness.",
      benefits: [
        {
          title: "Vetted Cleaners",
          description:
            "All cleaning pros are background-checked and highly rated.",
        },
        {
          title: "Eco-Friendly Products",
          description:
            "Safe, powerful cleaning products for spotless results.",
        },
        {
          title: "Flexible Scheduling",
          description:
            "Book regular cleans or one-time deep cleans.",
        },
        {
          title: "Satisfaction Guaranteed",
          description:
            "We ensure you're happy with every clean.",
        },
      ],
      tasks: [
        {
          title: "Clean",
          description: "Standard house cleaning services.",
        },
        {
          title: "Deep Clean",
          description:
            "Thorough deep clean house cleaning services.",
        },
        {
          title: "Party Clean Up",
          description: "Post-event and after-party cleaning.",
        },
        {
          title: "End of Tenancy",
          description:
            "Move-out cleaning to get your deposit back.",
        },
        {
          title: "Office Cleaning",
          description: "Professional office cleaning services.",
        },
        {
          title: "AirBnB Cleaning",
          description:
            "Turnover cleaning for vacation rentals.",
        },
      ],
      faqs: [
        {
          question:
            "What is included in a standard clean versus a deep clean?",
          answer:
            "Our standard house cleaning service covers dusting and wiping surfaces, while our deep clean house cleaning services tackle neglected areas like baseboards and behind appliances.",
        },
        {
          question:
            "Do you offer services for moving in or out of a property?",
          answer:
            "Yes, we specialise in end-of-tenancy cleaning to help you get your deposit back, ensuring the property meets the highest standards of professional cleaning services.",
        },
        {
          question:
            "Can you help clean up after a celebration or event?",
          answer:
            "Absolutely, we offer specialized after-party cleaning to handle the post-event mess, or you can book our house deep cleaning services to restore order immediately.",
        },
        {
          question:
            "Do you provide cleaning for commercial spaces or holiday rentals?",
          answer:
            "We provide thorough office cleaning for businesses and a dedicated Airbnb cleaning service designed to prepare your rental perfectly for the next guest check-in.",
        },
      ],
    },
    clean: {
      title: "Clean",
      description:
        "A clean home improves comfort and wellbeing. Our professional cleaners maintain hygiene and freshness in every room.",
      category: "cleaning",
      categoryDisplay: "Sparkle Clean",
      heroImage: "/images/services/cleaning/hero.png",
      contentImage: "/images/services/cleaning/clean.jpeg",
      longDescription:
        "Our cleaning services and cleaning services near me provide dependable support for busy households. We offer cleaning service options including house cleaning service, home cleaning services, and professional cleaning services. From domestic cleaning to domestic housekeeping cleaning, we work with trusted domestic cleaning companies near me. Whether you need domestic cleaning service or regular domestic cleaning services, we ensure spotless and healthy living spaces.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you offer domestic cleaning?",
          answer:
            "Yes, we provide full domestic cleaning and housekeeping services.",
        },
        {
          question: "Are you a local cleaning company?",
          answer:
            "Yes, we operate as domestic cleaning companies near me.",
        },
        {
          question: "Do you offer professional cleaning?",
          answer:
            "Yes, we provide professional cleaning services.",
        },
        {
          question: "Is regular cleaning available?",
          answer:
            "Yes, our cleaning service can be scheduled weekly or monthly.",
        },
      ],
    },
    "deep-clean": {
      title: "Deep Clean",
      description:
        "Deep cleaning removes hidden dirt and bacteria for a healthier environment. Our service refreshes homes and workplaces thoroughly.",
      category: "cleaning",
      categoryDisplay: "Sparkle Clean",
      heroImage: "/images/services/cleaning/hero.png",
      contentImage: "/images/services/cleaning/deep-clean.jpeg",
      longDescription:
        "Our deep clean and deep cleaning services eliminate stubborn grime and buildup. We provide house deep cleaning services, deep cleaning services near me, and deep clean house cleaning services for residential needs. From office deep cleaning services to commercial deep cleaning services, we deliver professional deep cleaning services. Whether you need one off deep clean or domestic deep cleaning services, every surface is carefully treated.",
      isSubcategory: true,
      faqs: [
        {
          question: "What does deep cleaning include?",
          answer:
            "It includes kitchens, bathrooms, floors, and hard-to-reach areas.",
        },
        {
          question: "Do you offer one-off deep cleans?",
          answer:
            "Yes, we provide one off deep clean services.",
        },
        {
          question: "Is it suitable for offices?",
          answer:
            "Yes, we offer office deep cleaning services.",
        },
        {
          question: "Is it available for homes?",
          answer:
            "Yes, we provide domestic deep cleaning services.",
        },
      ],
    },
    "party-clean-up": {
      title: "Party Clean Up",
      description:
        "After events, fast cleaning restores comfort and order. Our team clears mess efficiently so you can relax.",
      category: "cleaning",
      categoryDisplay: "Sparkle Clean",
      heroImage: "/images/services/cleaning/hero.png",
      contentImage: "/images/services/cleaning/party-clean-up.jpeg",
      longDescription:
        "Our after party cleaning and party clean up service handle all post-event mess. We provide deep home cleaning after a party and complete after party cleaning services for fast recovery. Whether you need an after party clean up service or full property refresh, we remove rubbish, stains, and clutter efficiently.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you clean after house parties?",
          answer:
            "Yes, we offer after party cleaning services.",
        },
        {
          question: "Do you remove rubbish?",
          answer:
            "Yes, after party clean up service includes waste removal.",
        },
        {
          question: "Can you deep clean after parties?",
          answer:
            "Yes, we provide deep home cleaning after a party.",
        },
        {
          question: "Is urgent service available?",
          answer: "Yes, we offer flexible scheduling.",
        },
      ],
    },
    "end-of-tenancy": {
      title: "End of Tenancy",
      description:
        "Move-outs require professional-level cleaning for successful inspections. Our team prepares properties to landlord standards.",
      category: "cleaning",
      categoryDisplay: "Sparkle Clean",
      heroImage: "/images/services/cleaning/hero.png",
      contentImage: "/images/services/cleaning/end-of-tenancy.jpeg",
      longDescription:
        "Our end of tenancy cleaning and end of tenancy cleaning near me services ensure properties meet rental requirements. We provide professional cleaning end of tenancy, end of tenancy cleaning services, and professional cleaning after tenancy. From end of tenancy carpet cleaning to end of tenancy window cleaning, we cover every area. Whether you need end of tenancy cleaning contracts or one-time service, we help protect your deposit.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you clean entire properties?",
          answer:
            "Yes, our end of tenancy cleaning services cover full homes.",
        },
        {
          question: "Is carpet cleaning included?",
          answer:
            "Yes, we offer end of tenancy carpet cleaning.",
        },
        {
          question: "Do you clean windows?",
          answer:
            "Yes, we provide end of tenancy window cleaning.",
        },
        {
          question: "Do you work with agents?",
          answer:
            "Yes, we offer end of tenancy cleaning contracts.",
        },
      ],
    },
    "office-cleaning": {
      title: "Office Cleaning",
      description:
        "A clean office creates a healthier and more productive working environment. Our team maintains professional standards across all types of workplaces.",
      category: "cleaning",
      categoryDisplay: "Sparkle Clean",
      heroImage: "/images/services/cleaning/hero.png",
      contentImage: "/images/services/cleaning/office-cleaning.jpeg",
      longDescription:
        "Our office cleaning and office cleaning services provide reliable solutions for businesses of all sizes. We work with a cleaner for office cleaning and trusted office cleaning agency London teams. Whether you need office cleaning London, London office cleaning, or support from an office cleaning company London, we deliver high-quality results. From daily maintenance to commercial office cleaning services, we keep workspaces hygienic and welcoming.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you offer commercial office cleaning?",
          answer:
            "Yes, we provide commercial office cleaning services for all business types.",
        },
        {
          question: "Are your services available in London?",
          answer:
            "Yes, we specialize in office cleaning London and London office cleaning.",
        },
        {
          question: "Do you provide office cleaners?",
          answer:
            "Yes, we supply a cleaner for office cleaning.",
        },
        {
          question: "Can cleaning be scheduled regularly?",
          answer:
            "Yes, our office cleaning services are available daily, weekly, or monthly.",
        },
      ],
    },
    "airbnb-cleaning": {
      title: "AirBnB Cleaning",
      description:
        "Short-term rentals require fast, consistent cleaning between guests. Our service ensures your property is always ready for check-in.",
      category: "cleaning",
      categoryDisplay: "Sparkle Clean",
      heroImage: "/images/services/cleaning/hero.png",
      contentImage: "/images/services/cleaning/airbnb-cleaning.jpeg",
      longDescription:
        "Our Airbnb cleaning and Airbnb cleaning services keep rental properties spotless and guest-ready. We provide Airbnb cleaning service near me, Airbnb cleaning companies, and Airbnb cleaning services near me for flexible scheduling. From cleaning Airbnb units to managing the cleaning fee Airbnb and following a strict Airbnb cleaning checklist, we handle every detail. We also offer Airbnb cleaning and linen service London for complete turnover support.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you follow an Airbnb cleaning checklist?",
          answer:
            "Yes, we use a full Airbnb cleaning checklist for every booking.",
        },
        {
          question: "Do you provide linen service?",
          answer:
            "Yes, we offer Airbnb cleaning and linen service London.",
        },
        {
          question: "Are you available locally?",
          answer:
            "Yes, we provide Airbnb cleaning service near me and nearby areas.",
        },
        {
          question: "Can you manage guest turnover?",
          answer:
            "Yes, we clean Airbnb properties between stays.",
        },
      ],
    },
  },
  "packing-moving": {
    moving: {
      title: "Professional Packing and Moving Service",
      description:
        "Professional moving solutions that make relocating effortless - from single-item transport to complete home moves.",
      category: "packing-moving",
      categoryDisplay: "Packing & Moving",
      heroImage: "/images/services/moving/hero.jpeg",
      contentImage: "/images/services/moving/moving-help.png",
      longDescription:
        "Moving house is often cited as one of life's most stressful events, but it doesn't have to be. 100 Handy is here to turn that mountain of boxes into a smooth, organised transition. Whether you are relocating your entire home, shifting a few items to storage, or just need an extra pair of hands, we have the right professionals for the job. Our flexible moving solutions include: Man and van rental - Cost-effective transport for small to medium moves. Man and van services - Fully equipped teams with professional drivers. Moving help - Experienced movers for loading, transport, and unloading. Moving and packing services - Complete end-to-end relocation solutions. Same-day and scheduled moves available 7 days a week.",
      benefits: [
        {
          title: "Flexible Options",
          description:
            "From single items to full home moves, we have the right solution.",
        },
        {
          title: "Professional Teams",
          description:
            "Experienced movers who handle your belongings with care.",
        },
        {
          title: "Same-Day Available",
          description:
            "Urgent moves? We can help on short notice.",
        },
        {
          title: "Full Service",
          description:
            "Packing, loading, transport, unloading - all covered.",
        },
      ],
      tasks: [
        {
          title: "Van Assisted Moving Help",
          description: "Transport with professional drivers.",
        },
        {
          title: "Moving Help",
          description:
            "Loading, transport, and unloading assistance.",
        },
        {
          title: "Waste and Furniture Removal",
          description: "Junk removals and rubbish clearance.",
        },
        {
          title: "Heavy Lifting and Loading",
          description:
            "Moving heavy furniture through tight spaces.",
        },
        {
          title: "Packing and Moving",
          description: "Complete packing services included.",
        },
        {
          title: "Full Service Movers",
          description: "End-to-end relocation solutions.",
        },
      ],
      faqs: [
        {
          question:
            "Do you offer transport options for small moves or single items?",
          answer:
            "Yes, we provide flexible man and van rental options and comprehensive man and van services perfect for studio moves or transporting individual pieces.",
        },
        {
          question:
            "Can you help dispose of unwanted items before or after the move?",
          answer:
            "Our teams can handle efficient junk removals and rubbish removals to ensure your property is left clean and clutter-free.",
        },
        {
          question:
            "Are your movers able to handle large, bulky items like pianos?",
          answer:
            "Our professionals specialise in moving heavy furniture through tight spaces without causing damage.",
        },
        {
          question:
            "Do you offer full packing assistance along with transport?",
          answer:
            "We offer complete moving and packing services to save you time, including high-quality packing services in London for a fully hands-off experience.",
        },
      ],
    },
    "van-assisted-moving": {
      title: "Van Assisted Moving Help",
      description:
        "Small moves need reliable transport and lifting support. Our team helps move items safely and efficiently.",
      category: "packing-moving",
      categoryDisplay: "Packing & Moving",
      heroImage: "/images/services/moving/hero.jpeg",
      contentImage: "/images/services/moving/van-assisted-moving.jpeg",
      longDescription:
        "Our man and van services provide flexible transport and removal support. We offer man and van, man and a van, man and van near me, and man and van hire for local and short-distance moves. From man and van removals and man and van removals company services to man and van rental and man and van rubbish removal, we cover all needs. Whether you need quick man and van, van and man assistance, or want to compare man and van services, we deliver reliable solutions.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you provide man and van hire?",
          answer:
            "Yes, we offer man and van hire and rental services.",
        },
        {
          question: "Do you remove rubbish?",
          answer:
            "Yes, we provide man and van rubbish removal.",
        },
        {
          question: "Do you handle removals?",
          answer:
            "Yes, our man and van removals company handles small moves.",
        },
        {
          question: "Is fast service available?",
          answer:
            "Yes, we offer quick man and van options.",
        },
      ],
    },
    "moving-help": {
      title: "Moving Help",
      description:
        "Moving can be stressful without extra support. Our team assists with lifting, packing, and transport.",
      category: "packing-moving",
      categoryDisplay: "Packing & Moving",
      heroImage: "/images/services/moving/hero.jpeg",
      contentImage: "/images/services/moving/moving-help.png",
      longDescription:
        "Our moving help services provide help with moving home and help moving house at every stage. We also support help with moving costs through efficient planning and flexible service options. Whether you need moving help for a single room or a full property, we make relocation easier and safer.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you help with moving house?",
          answer:
            "Yes, we provide help moving house and help with moving home.",
        },
        {
          question: "Do you assist with costs?",
          answer:
            "Yes, we offer help with moving costs.",
        },
        {
          question: "Is packing included?",
          answer:
            "Packing can be added to our moving help services.",
        },
        {
          question: "Do you offer short-notice help?",
          answer: "Yes, we provide flexible scheduling.",
        },
      ],
    },
    "waste-furniture-removal": {
      title: "Waste and Furniture Removal",
      description:
        "Removing unwanted items improves space and safety. Our team clears properties quickly and responsibly.",
      category: "packing-moving",
      categoryDisplay: "Packing & Moving",
      heroImage: "/images/services/moving/hero.jpeg",
      contentImage: "/images/services/moving/waste-furniture-removal.jpeg",
      longDescription:
        "Our junk removals and rubbish removals services handle bulky and unwanted items efficiently. We provide getting rid rubbish removals, removal and disposal of unwanted items, and pick up the rubbish solutions for homes and businesses. From old furniture to general waste, we ensure responsible disposal and clean results.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you remove large furniture?",
          answer:
            "Yes, our junk removals include bulky furniture.",
        },
        {
          question: "Do you dispose of waste properly?",
          answer:
            "Yes, our rubbish removals follow disposal regulations.",
        },
        {
          question: "Can you pick up rubbish?",
          answer:
            "Yes, we provide pick up the rubbish services.",
        },
        {
          question: "Do you clear unwanted items?",
          answer:
            "Yes, we handle removal and disposal of unwanted items.",
        },
      ],
    },
    "heavy-lifting-loading": {
      title: "Heavy Lifting and Loading",
      description:
        "Moving heavy items requires strength and proper technique. Our team lifts safely to avoid damage and injury.",
      category: "packing-moving",
      categoryDisplay: "Packing & Moving",
      heroImage: "/images/services/moving/hero.jpeg",
      contentImage: "/images/services/moving/heavy-lifting-loading.jpeg",
      longDescription:
        "Our heavy lifting services assist with moving heavy furniture and moving heavy objects safely. We provide heaving lifting and app lifting services for difficult jobs and help moving furniture during relocation or renovation. From loading vans to repositioning large items, we protect both property and people.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you move heavy furniture?",
          answer:
            "Yes, we specialize in moving heavy furniture.",
        },
        {
          question: "Can you lift large objects?",
          answer:
            "Yes, we handle moving heavy objects.",
        },
        {
          question: "Do you help with loading?",
          answer:
            "Yes, help moving furniture includes loading support.",
        },
        {
          question: "Is safety a priority?",
          answer:
            "Yes, our heavy lifting follows safety standards.",
        },
      ],
    },
    "packing-and-moving": {
      title: "Packing and Moving",
      description:
        "Careful packing protects belongings during transport. Our team packs efficiently to prevent damage.",
      category: "packing-moving",
      categoryDisplay: "Packing & Moving",
      heroImage: "/images/services/moving/hero.jpeg",
      contentImage: "/images/services/moving/packing-and-moving.jpeg",
      longDescription:
        "Our packing services in London and packing services London help prepare belongings for relocation. We provide packing helper, packing services near me, and professional packing services for secure transport. From home packing services and house packing services to packers and movers London and moving packing company solutions, we handle everything. Whether you need packing and removals London, packing and moving services London, or moving and packing service, we simplify the process.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you offer packing services in London?",
          answer:
            "Yes, we provide packing services in London.",
        },
        {
          question: "Do you supply packing materials?",
          answer:
            "Yes, packing materials can be provided.",
        },
        {
          question: "Do you combine packing and moving?",
          answer:
            "Yes, we offer packing and moving services together.",
        },
        {
          question: "Are professional packers available?",
          answer:
            "Yes, we provide professional packing services.",
        },
      ],
    },
    "full-service-movers": {
      title: "Full Service Movers",
      description:
        "A complete moving solution reduces stress and saves time. Our team handles packing, lifting, and transport.",
      category: "packing-moving",
      categoryDisplay: "Packing & Moving",
      heroImage: "/images/services/moving/hero.jpeg",
      contentImage: "/images/services/moving/full-service-movers.jpg",
      longDescription:
        "Our full service movers combine packing, moving, heavy lifting, and van assisted moving into one package. We provide professional packing services, moving and packing services London, and packing services near me for convenience. From moving heavy furniture and help moving furniture to man and van removals and quick man and van transport, we manage every stage. Whether you need moving packing services or a moving packing company, we deliver smooth and reliable relocation.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you include packing?",
          answer:
            "Yes, our full service movers include packing services.",
        },
        {
          question: "Do you handle heavy lifting?",
          answer:
            "Yes, moving heavy furniture is included.",
        },
        {
          question: "Is transport provided?",
          answer:
            "Yes, we include man and van services.",
        },
        {
          question: "Do you manage full moves?",
          answer:
            "Yes, we manage the entire moving process.",
        },
      ],
    },
  },
  outdoor: {
    "great-outdoors": {
      title: "The Great Outdoors Care Service",
      description:
        "Your garden is more than just a patch of grass - it's a place to relax, entertain, and connect with nature. Let 100 Handy care for your great outdoors.",
      category: "outdoor",
      categoryDisplay: "The Great Outdoors",
      heroImage: "/images/services/outdoor/hero.jpeg",
      contentImage: "/images/services/outdoor/gardening.jpeg",
      longDescription:
        "Whether you are looking for a reliable gardening company near me or a specialist for a complex project, our network of skilled professionals is ready to transform your outdoor space. Choose the help you need, when you need it: Lawn care services include mowing, edging, feeding, and ongoing maintenance. Lawn autumn treatment to strengthen grass and reduce moss before winter. Garden landscaping for design, planting, and garden transformations. Leaf raking services for seasonal clear-ups and neat, usable lawns. Roof cleaning to remove moss, debris, and buildup safely. Hedge trimming and pruning to keep boundaries sharp and plants healthy.",
      benefits: [
        {
          title: "Local Experts",
          description:
            "Vetted, local professionals with a track record of quality work.",
        },
        {
          title: "Flexible Service",
          description:
            "One-time jobs or regular maintenance schedules.",
        },
        {
          title: "Full Range",
          description:
            "From lawn care to landscaping to seasonal clean-ups.",
        },
        {
          title: "Quality Guaranteed",
          description:
            "Work completed to the highest standards.",
        },
      ],
      tasks: [
        {
          title: "Gardening",
          description: "General garden care and maintenance.",
        },
        {
          title: "Lawn Care",
          description:
            "Mowing, edging, feeding, and ongoing maintenance.",
        },
        {
          title: "Landscaping",
          description:
            "Design, planting, and garden transformations.",
        },
        {
          title: "Leaf Raking and Removal",
          description: "Seasonal clear-ups for neat lawns.",
        },
        {
          title: "Roof and Gutter Cleaning",
          description:
            "Safe removal of moss, debris, and buildup.",
        },
        {
          title: "Branch and Hedge Trimming",
          description:
            "Keep boundaries sharp and plants healthy.",
        },
      ],
      faqs: [
        {
          question: "How do I find a reliable gardener near me?",
          answer:
            "We make it easy. Instead of searching endlessly, 100 Handy connects you directly with vetted, local experts in your area who have a track record of quality work.",
        },
        {
          question:
            "What is included in your lawn care services?",
          answer:
            "Our service is flexible. It generally includes mowing, edging, and weeding. However, we also offer specific treatments like fertilising and scarifying upon request.",
        },
        {
          question: "Why is lawn autumn treatment necessary?",
          answer:
            "Autumn is a critical time for your grass. Treating it now helps it survive winter frost and ensures it grows back thick and healthy in the spring.",
        },
        {
          question: "Do you offer cleanup services?",
          answer:
            "Yes! Our leaf raking services are very popular in autumn. We can rake, bag, and remove garden waste so your lawn can breathe.",
        },
        {
          question:
            "How often do I need hedge trimming and pruning?",
          answer:
            "This depends on the species of your plants, but generally, we recommend a trim in spring and late summer to maintain shape and health.",
        },
      ],
    },
    gardening: {
      title: "Gardening",
      description:
        "Well-maintained gardens improve outdoor comfort and property value. Our team keeps green spaces tidy and healthy.",
      category: "outdoor",
      categoryDisplay: "The Great Outdoors",
      heroImage: "/images/services/outdoor/hero.jpeg",
      contentImage: "/images/services/outdoor/gardening.jpeg",
      longDescription:
        "Our gardening company near me services handle garden work and gardening works for all property types. We provide cleaning and gardening services, skilled gardening workers, and a garden labourer for hire when needed. Whether you need garden work near me or support using a clear garden maintenance price list, we deliver dependable results.",
      isSubcategory: true,
      faqs: [
        {
          question:
            "Do you provide regular garden maintenance?",
          answer:
            "Yes, we offer garden work and maintenance services.",
        },
        {
          question: "Can I hire a garden worker?",
          answer:
            "Yes, we provide a garden labourer for hire.",
        },
        {
          question: "Are your services local?",
          answer:
            "Yes, we operate as a gardening company near me.",
        },
        {
          question: "Do you combine cleaning and gardening?",
          answer:
            "Yes, we offer cleaning and gardening services.",
        },
      ],
    },
    "lawn-care": {
      title: "Lawn Care",
      description:
        "Healthy lawns require seasonal care and treatment. Our service keeps grass strong and green.",
      category: "outdoor",
      categoryDisplay: "The Great Outdoors",
      heroImage: "/images/services/outdoor/hero.jpeg",
      contentImage: "/images/services/outdoor/lawn-care.jpeg",
      longDescription:
        "Our lawn care and lawn care services improve grass health year-round. We provide lawn treatment, lawn treatments, and lawn treatment services for different seasons. From autumn lawn care and lawn autumn treatment to spring lawn treatment and winter lawn treatment, we tailor solutions. We also handle moss treatment for lawns, lawn fungus treatment, and best weed treatment for lawns to protect your lawn.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you provide seasonal lawn care?",
          answer:
            "Yes, we offer autumn lawn care and spring lawn treatment.",
        },
        {
          question: "Do you treat weeds and moss?",
          answer:
            "Yes, we provide best weed treatment for lawns and moss treatment for lawns.",
        },
        {
          question: "Can damaged lawns be repaired?",
          answer:
            "Yes, we offer lawn care repair services.",
        },
        {
          question: "Are treatments safe?",
          answer:
            "Yes, we use professional lawn treatments safely.",
        },
      ],
    },
    landscaping: {
      title: "Landscaping",
      description:
        "Landscaping transforms outdoor areas into usable and attractive spaces. Our team designs and builds functional gardens.",
      category: "outdoor",
      categoryDisplay: "The Great Outdoors",
      heroImage: "/images/services/outdoor/hero.jpeg",
      contentImage: "/images/services/outdoor/landscaping.jpeg",
      longDescription:
        "Our landscapers and landscape gardener services deliver full landscape gardening solutions. We provide garden landscaping ideas and complete garden landscaping projects for homes and businesses. Whether you need landscape gardeners for design or landscape for construction, we ensure attractive and practical outdoor results.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you design gardens?",
          answer:
            "Yes, we provide garden landscaping ideas.",
        },
        {
          question: "Are professional landscapers available?",
          answer:
            "Yes, we offer skilled landscapers and landscape gardeners.",
        },
        {
          question: "Do you handle full projects?",
          answer:
            "Yes, we deliver full landscape gardening projects.",
        },
        {
          question: "Do you offer maintenance?",
          answer:
            "Yes, ongoing landscaping support is available.",
        },
      ],
    },
    "leaf-raking-removal": {
      title: "Leaf Raking and Removal",
      description:
        "Seasonal leaf buildup can affect safety, lawn health, and outdoor appearance. Our team clears leaves efficiently to keep your property clean.",
      category: "outdoor",
      categoryDisplay: "The Great Outdoors",
      heroImage: "/images/services/outdoor/hero.jpeg",
      contentImage: "/images/services/outdoor/leaf-raking-removal.jpeg",
      longDescription:
        "Fallen leaves can damage lawns and pathways if left untreated. Our leaf removal and leaf raking service keep outdoor spaces tidy and safe throughout the year. Whether you need leaf raking service near me or full leaf raking services, we use the best leaf removal tools for fast and efficient cleanup. From gardens to driveways, we manage seasonal debris to protect your property and improve appearance.",
      isSubcategory: true,
      faqs: [
        {
          question: "What areas do you clear?",
          answer:
            "We remove leaves from gardens, lawns, paths, and driveways.",
        },
        {
          question: "Do you offer local service?",
          answer:
            "Yes, we provide leaf raking service near me options.",
        },
        {
          question: "What tools do you use?",
          answer:
            "We use the best leaf removal tools.",
        },
        {
          question: "Is waste removal included?",
          answer:
            "Yes, all leaf raking services include disposal.",
        },
      ],
    },
    "roof-gutter-cleaning": {
      title: "Roof and Gutter Cleaning",
      description:
        "Clean roofs and gutters prevent water damage and structural issues. Our service protects your property from buildup and blockages.",
      category: "outdoor",
      categoryDisplay: "The Great Outdoors",
      heroImage: "/images/services/outdoor/hero.jpeg",
      contentImage: "/images/services/outdoor/roof-gutter-cleaning.jpeg",
      longDescription:
        "Our roof cleaning and roof and gutter cleaning services remove moss and debris efficiently. We provide roof gutter cleaning, gutter cleaning, gutter cleaning services, and rain gutter cleaning service for full protection. Whether you need roof cleaning cost guidance, roof cleaning prices, or advice on how to clean moss off roof, we ensure thorough and safe results.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you clean gutters?",
          answer:
            "Yes, we provide roof gutter cleaning and gutter cleaning services.",
        },
        {
          question: "Can you remove moss from roofs?",
          answer:
            "Yes, we handle how to clean moss off roof safely.",
        },
        {
          question: "Is pricing clear?",
          answer:
            "Yes, we explain roof cleaning cost and roof cleaning prices upfront.",
        },
        {
          question: "Is regular cleaning available?",
          answer:
            "Yes, scheduled roof and gutter cleaning is available.",
        },
      ],
    },
    "branch-hedge-trimming": {
      title: "Branch and Hedge Trimming",
      description:
        "Overgrown trees and hedges affect safety and appearance. Our team trims and shapes greenery professionally.",
      category: "outdoor",
      categoryDisplay: "The Great Outdoors",
      heroImage: "/images/services/outdoor/hero.jpeg",
      contentImage: "/images/services/outdoor/branch-hedge-trimming.jpeg",
      longDescription:
        "Our branch trimming and hedge trimming services improve safety and garden structure. We provide trimming tree branches, trimming of hedges, hedge trimming and pruning, and affordable hedge trimming options. Whether you need guidance on how to trim branches from a tree, when to trim hedges, best time to trim hedges, or when can you trim hedges, we ensure clean and controlled results.",
      isSubcategory: true,
      faqs: [
        {
          question: "Do you trim tree branches?",
          answer:
            "Yes, we offer trimming tree branches and branch trimming.",
        },
        {
          question: "Do you shape hedges?",
          answer:
            "Yes, we provide hedge trimming and pruning.",
        },
        {
          question:
            "When is the best time to trim hedges?",
          answer:
            "We advise on best time to trim hedges based on season.",
        },
        {
          question: "Are services affordable?",
          answer:
            "Yes, we offer affordable hedge trimming services.",
        },
      ],
    },
  },
  handyman: {
    general: {
      title: "General Handyman Services",
      description:
        "Expert help for every odd job, repair, and upgrade in your home.",
      category: "handyman",
      categoryDisplay: "Handyman Services",
      longDescription:
        "From assembly and furniture setup to painting, light installation, plumbing, wall mounting, gardening, electrical work, home renovation, general repairs, and carpentry - our skilled Pros handle it all. Whatever the job, big or small, we connect you with trusted handymen who arrive prepared with the right tools and expertise to get it done right.",
      benefits: [
        {
          title: "Trusted & Vetted Pros",
          description:
            "Every Pro is background-checked, reviewed, and rated.",
        },
        {
          title: "Wide Range of Services",
          description:
            "Assembly, mounting, repairs, painting, and more.",
        },
        {
          title: "Seamless Booking",
          description:
            "Find, hire, and pay through our secure platform.",
        },
        {
          title: "Happiness Pledge",
          description:
            "If something isn't right, we'll work to make it right.",
        },
      ],
      tasks: [
        {
          title: "Assembly",
          description:
            "Build it right the first time. We assemble furniture, shelves, desks, cabinets, and more.",
        },
        {
          title: "Furniture Assembly",
          description:
            "From flat-packs to heavy pieces, our pros handle setup with care.",
        },
        {
          title: "Painting",
          description:
            "Refresh a room or fix scuffs and marks. Get clean edges and smooth coats.",
        },
        {
          title: "Light Installation",
          description:
            "Swap, install, or replace light fixtures safely.",
        },
        {
          title: "Plumbing",
          description:
            "Drips, leaks, replacements, and small plumbing jobs done efficiently.",
        },
        {
          title: "Wall Mounting",
          description:
            "Mount TVs, mirrors, shelves, frames - straight, secure, and built to last.",
        },
        {
          title: "Gardening",
          description:
            "Quick tidy-ups or ongoing care for your outdoor space.",
        },
        {
          title: "Electrical Work",
          description:
            "Switches, sockets, small fixes handled safely.",
        },
        {
          title: "Home Renovation",
          description:
            "Small upgrades that make a big difference.",
        },
        {
          title: "General Repair Service",
          description:
            "Loose handles, broken latches, sticking doors - fixed properly.",
        },
        {
          title: "Home Painting",
          description:
            "Walls, ceilings, touch-ups with clean, even coverage.",
        },
        {
          title: "Carpentry",
          description:
            "Cuts, fixes, adjustments, and small builds.",
        },
        {
          title: "Hanging Curtains, Installing Blinds",
          description:
            "Measured, aligned, and installed for smooth operation.",
        },
      ],
      faqs: [
        {
          question: "How much do handyman services cost?",
          answer:
            "Prices vary by task complexity, but you can see hourly rates upfront before you book.",
        },
        {
          question:
            "Do I need to provide any tools or equipment?",
          answer:
            "Most pros bring their own tools, but if you have specific materials (like the paint or the light bulb), let them know!",
        },
        {
          question:
            "Do you offer painting and decorating services?",
          answer:
            "Yes! We handle everything from touch-ups to full room painting.",
        },
        {
          question: "Do you offer same-day handyman services?",
          answer:
            "Absolutely. Many of our pros are available for same-day bookings.",
        },
        {
          question:
            "Can a Pro mount my TV on a wall bracket?",
          answer:
            "Yes, just make sure you have the correct bracket for your TV model, or ask your Pro for advice.",
        },
      ],
    },
  },
};
