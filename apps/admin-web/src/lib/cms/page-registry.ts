export type FieldType = 'text' | 'rich_text' | 'image_url'

export interface FieldDefinition {
  type: FieldType
  label: string
  placeholder?: string
}

export interface SectionDefinition {
  label: string
  fields: Record<string, FieldDefinition>
}

export interface PageDefinition {
  label: string
  slug: string
  sections: Record<string, SectionDefinition>
}

export const pageRegistry: Record<string, PageDefinition> = {
  'about-us': {
    label: 'About Us',
    slug: '/about-us',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: 'About Us' },
        },
      },
      content: {
        label: 'Main Content',
        fields: {
          heading: { type: 'text', label: 'Heading', placeholder: 'Making life simpler, one neighborhood at a time.' },
          paragraph_1: { type: 'rich_text', label: 'Paragraph 1', placeholder: 'We believe that the best help is local. At the heart of 100 Handy is a simple but powerful idea: connecting people who need time with people who have skills.' },
          paragraph_2: { type: 'rich_text', label: 'Paragraph 2', placeholder: "We know that for every overwhelming to-do list, there is a capable professional nearby ready to get to work. Whether it's hanging a crib for a new arrival, fixing a leaky faucet before the in-laws visit, or simply giving you back your Saturday afternoon, we are the bridge that makes it happen. We aren't just completing tasks; we are building stronger communities where neighbors help neighbors thrive." },
        },
      },
      leadership: {
        label: 'Leadership Team',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Leadership Team' },
          member_1_name: { type: 'text', label: 'Member 1 Name', placeholder: 'Berkay Dasha' },
          member_1_role: { type: 'text', label: 'Member 1 Role', placeholder: 'Chief Executive Officer' },
          member_1_image: { type: 'image_url', label: 'Member 1 Photo', placeholder: '/team/1.jpg' },
          member_2_name: { type: 'text', label: 'Member 2 Name', placeholder: 'Amara Osei' },
          member_2_role: { type: 'text', label: 'Member 2 Role', placeholder: 'Chief Technology Officer' },
          member_2_image: { type: 'image_url', label: 'Member 2 Photo', placeholder: '/team/2.jpg' },
          member_3_name: { type: 'text', label: 'Member 3 Name', placeholder: 'Liam Chen' },
          member_3_role: { type: 'text', label: 'Member 3 Role', placeholder: 'Chief Operating Officer' },
          member_3_image: { type: 'image_url', label: 'Member 3 Photo', placeholder: '/team/3.jpg' },
          member_4_name: { type: 'text', label: 'Member 4 Name', placeholder: 'Sofia Petrov' },
          member_4_role: { type: 'text', label: 'Member 4 Role', placeholder: 'Chief Marketing Officer' },
          member_4_image: { type: 'image_url', label: 'Member 4 Photo', placeholder: '/team/4.jpg' },
          member_5_name: { type: 'text', label: 'Member 5 Name', placeholder: 'Daniel Mora' },
          member_5_role: { type: 'text', label: 'Member 5 Role', placeholder: 'Chief Financial Officer' },
          member_5_image: { type: 'image_url', label: 'Member 5 Photo', placeholder: '/team/5.jpg' },
          member_6_name: { type: 'text', label: 'Member 6 Name', placeholder: 'Priya Sharma' },
          member_6_role: { type: 'text', label: 'Member 6 Role', placeholder: 'VP of Engineering' },
          member_6_image: { type: 'image_url', label: 'Member 6 Photo', placeholder: '/team/6.jpg' },
          member_7_name: { type: 'text', label: 'Member 7 Name', placeholder: 'Marcus Webb' },
          member_7_role: { type: 'text', label: 'Member 7 Role', placeholder: 'VP of Product' },
          member_7_image: { type: 'image_url', label: 'Member 7 Photo', placeholder: '/team/7.jpg' },
          member_8_name: { type: 'text', label: 'Member 8 Name', placeholder: 'Elena Rossi' },
          member_8_role: { type: 'text', label: 'Member 8 Role', placeholder: 'Head of Design' },
          member_8_image: { type: 'image_url', label: 'Member 8 Photo', placeholder: '/team/8.jpg' },
          member_9_name: { type: 'text', label: 'Member 9 Name', placeholder: 'James Okoro' },
          member_9_role: { type: 'text', label: 'Member 9 Role', placeholder: 'Head of Operations' },
          member_9_image: { type: 'image_url', label: 'Member 9 Photo', placeholder: '/team/9.jpg' },
        },
      },
    },
  },
  'for-good': {
    label: '100 Handy Cares',
    slug: '/for-good',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          badge: { type: 'text', label: 'Badge Text', placeholder: '100 Handy Cares' },
          title: { type: 'text', label: 'Page Title', placeholder: '100 Handy Cares' },
          paragraph: { type: 'rich_text', label: 'Main Paragraph', placeholder: 'Content coming soon.' },
          supporting_text: { type: 'rich_text', label: 'Supporting Text', placeholder: "We're working on sharing our community initiatives and giving-back programs. Check back soon to learn how 100 Handy is making a positive impact in neighborhoods across the country." },
        },
      },
    },
  },
  careers: {
    label: 'Careers',
    slug: '/careers',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: "Let's Build the Future of Local Help." },
          paragraph: { type: 'rich_text', label: 'Hero Paragraph', placeholder: "Join the team that is redefining how the world gets work done. We're connecting neighbors, empowering professionals, and simplifying lives - one click at a time." },
        },
      },
      mission: {
        label: 'Mission Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Empowering neighborhoods, one job at a time.' },
          paragraph_1: { type: 'rich_text', label: 'Paragraph 1', placeholder: 'In 2025, we said: Everyone should have the chance to have their services found more easily, without breaking their head over how to promote themselves. At 100 Handy, we aren\'t just fixing squeaky doors; we are supporting those who have been overlooked.' },
          paragraph_2: { type: 'rich_text', label: 'Paragraph 2', placeholder: 'We are on a mission to bring trust and transparency back to home services. By connecting millions of customers with skilled Pros, we are creating flexible income opportunities for thousands and giving people back their most valuable resource: time.' },
          paragraph_3: { type: 'rich_text', label: 'Paragraph 3', placeholder: 'Imagine a world where the friction of daily life - from mounting a TV to moving house - is removed instantly. That is the magic we build every day. Whether you code, design, market, or support, your work here has a tangible impact on real lives.' },
          paragraph_4: { type: 'rich_text', label: 'Closing Statement', placeholder: 'Join us at 100 Handy, where your ideas travel from the whiteboard to the real world, fast.' },
        },
      },
      culture: {
        label: 'Culture Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Flexible Work, Stronger Connections.' },
          paragraph_1: { type: 'rich_text', label: 'Paragraph 1', placeholder: 'At 100 Handy, we believe work should fit into your life, not the other way around. That\'s why we\'ve adopted a "Remote-First, Office-Optional" policy. We trust our employees to work where they are most productive, while also creating meaningful moments to come together.' },
          paragraph_2: { type: 'rich_text', label: 'Paragraph 2', placeholder: 'Whether you are logging in from a home office in London or a coworking space, we use technology to foster connection, make decisions in real-time, and celebrate wins. It\'s the best of both worlds: the freedom of remote work with the fun of in-person retreats.' },
        },
      },
      roles: {
        label: 'Open Roles Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Open Roles' },
          paragraph: { type: 'rich_text', label: 'Description', placeholder: "We're always looking for talented people to join our team. Check back soon for open positions, or reach out to us directly." },
        },
      },
    },
  },
  'elite-taskers': {
    label: '100 Handy Star',
    slug: '/elite-taskers',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          badge: { type: 'text', label: 'Badge Text', placeholder: '100 Handy Star' },
          title: { type: 'text', label: 'Page Title', placeholder: 'The 100 Handy Star' },
          subtitle: { type: 'text', label: 'Subtitle', placeholder: 'Our top-rated 100 Handy Pros, ready when you are.' },
          description: { type: 'rich_text', label: 'Description', placeholder: 'The 100 Handy Star badge highlights 100 Handy Pros who consistently deliver outstanding workmanship, clear communication, and a smooth customer experience - task after task.' },
        },
      },
      benefits: {
        label: 'Benefits Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Why Customers Choose a 100 Handy Star' },
          benefit_1_title: { type: 'text', label: 'Benefit 1 Title', placeholder: 'Consistently high ratings' },
          benefit_1_description: { type: 'rich_text', label: 'Benefit 1 Description', placeholder: 'Customers regularly leave glowing reviews for 100 Handy Stars - because they go above and beyond to ensure the job is completed to the highest standard, showcasing their expertise.' },
          benefit_2_title: { type: 'text', label: 'Benefit 2 Title', placeholder: 'Reliable and responsive' },
          benefit_2_description: { type: 'rich_text', label: 'Benefit 2 Description', placeholder: "On-time arrivals, quick replies, and updates you can count on - so you're never left guessing." },
          benefit_3_title: { type: 'text', label: 'Benefit 3 Title', placeholder: 'Experienced and active' },
          benefit_3_description: { type: 'rich_text', label: 'Benefit 3 Description', placeholder: '100 Handy Stars complete a high number of tasks and bring real, hands-on experience to every booking.' },
        },
      },
      trust: {
        label: 'Trust Statement',
        fields: {
          statement: { type: 'rich_text', label: 'Trust Statement', placeholder: "They're also trusted and dependable, with a strong record of following 100 Handy's Marketplace Guidelines." },
        },
      },
      hire: {
        label: 'How to Hire Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'How Do I Hire a 100 Handy Star?' },
          description: { type: 'rich_text', label: 'Description', placeholder: "It's simple. When you search for a service, look for the Star badge on a 100 Handy Pro's profile or in your search results. Then compare reviews, rates, and availability to book the right match." },
          cta: { type: 'text', label: 'CTA Button Text', placeholder: 'Find your Star today' },
        },
      },
    },
  },
  legal: {
    label: 'Legal',
    slug: '/legal',
    sections: {
      content: {
        label: 'Page Content',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: 'Legal' },
          paragraph: { type: 'rich_text', label: 'Main Text', placeholder: "Content coming soon. We're preparing our legal documentation." },
          contact_text: { type: 'rich_text', label: 'Contact Text', placeholder: 'If you have any legal inquiries in the meantime, please contact us at' },
        },
      },
    },
  },
  terms: {
    label: 'Terms & Privacy',
    slug: '/terms',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: 'Terms & Privacy' },
          last_updated: { type: 'text', label: 'Last Updated', placeholder: 'Last updated: March 2026' },
        },
      },
      terms_of_service: {
        label: 'Terms of Service',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Terms of Service' },
          content: { type: 'rich_text', label: 'Content', placeholder: 'The Terms of Service explain the legal agreement between 100 Handy and its users.\n\nThis includes:\n\n• How the 100 Handy platform can be used\n• How service agreements are formed between Clients and 100 Handy Pros\n• Rules for booking services\n• Payment and fee policies\n• Cancellation and refund conditions\n• Responsibilities of both Clients and Pros\n• Platform rights and limitations\n\nAll users must agree to the Terms of Service before using the platform.' },
        },
      },
      privacy_policy: {
        label: 'Privacy Policy',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Privacy Policy' },
          content: { type: 'rich_text', label: 'Content', placeholder: 'The Privacy Policy explains how 100 Handy collects, uses, stores, and protects personal information.\n\nThis includes:\n\n• What personal data is collected\n• How your information is used\n• How data is stored securely\n• When information may be shared\n• Your rights regarding personal data\n• How to request updates or deletion of your data\n\n100 Handy is committed to protecting user privacy and handling information responsibly.' },
        },
      },
      service_protection: {
        label: 'Service Protection',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Service Protection Terms & Conditions' },
          content: { type: 'rich_text', label: 'Content', placeholder: '100 Handy may offer service protection measures designed to support Clients and Pros when issues occur.\n\nThis section explains:\n\n• What types of issues may be covered\n• How to submit a claim\n• How claims are reviewed\n• What users must agree to before compensation is issued\n• Conditions that may limit coverage\n\nProtection policies help ensure fairness when unexpected issues arise.' },
        },
      },
      trust_and_safety: {
        label: 'Trust & Safety',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Trust & Safety' },
          content: { type: 'rich_text', label: 'Content', placeholder: 'Keeping your account secure\n\nProtecting your account helps prevent unauthorised access.\n\nWe recommend:\n\n• Using strong passwords\n• Keeping login details private\n• Updating passwords regularly\n• Logging out on shared devices\n• Reporting suspicious activity immediately\n\nIf unusual activity is detected, security checks may be applied to protect your account.\n\nUser safety guidance\n\nSafety is a priority for everyone using 100 Handy.\n\nRecommended safety practices include:\n\n• Keeping communication within the platform\n• Reporting unsafe behaviour immediately\n• Avoiding sharing sensitive personal information\n\nFollowing safety guidance helps create a trusted working environment.\n\nBackground checks and verification\n\n100 Handy uses verification processes to support trust between users.\n\nThese may include:\n\n• Identity verification\n• Profile checks\n• Background screening (where required)\n• Service-related credential verification\n\nVerification helps maintain platform quality and safety.' },
        },
      },
      platform_rules: {
        label: 'Platform Rules',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Platform Rules' },
          content: { type: 'rich_text', label: 'Content', placeholder: 'Acceptable use and platform rules\n\nAll users must follow platform rules when using 100 Handy.\n\nAcceptable use includes:\n\n• Providing accurate information\n• Communicating respectfully\n• Using the platform only for legitimate services\n• Following booking and payment procedures\n• Maintaining professional behaviour\n\nProhibited activities include:\n\n• Fraudulent behaviour\n• Misuse of accounts\n• Harassment or threatening behaviour\n• Sexual misconduct, harassment, or inappropriate behaviour of any kind\n• Discrimination based on gender, race, religion, nationality, disability, sexual orientation, or any protected characteristic\n• Attempting to bypass platform processes\n• Providing false information\n\nViolations of these rules may lead to account action.\n\nClient and Pro responsibilities\n\nBoth Clients and 100 Handy Pros have responsibilities when using the platform.\n\nClient responsibilities include:\n\n• Providing clear job descriptions\n• Giving accurate location details\n• Making payments as agreed\n• Respecting professional conduct\n\n100 Handy Pro responsibilities include:\n\n• Delivering services professionally\n• Communicating clearly\n• Arriving on time\n• Completing work as agreed\n• Following safety and service guidelines\n\nShared responsibility helps maintain quality across the platform.\n\nAccount action and enforcement\n\nIf platform rules are broken, action may be taken to protect the platform and its users.\n\nPossible actions include:\n\n• Account warnings\n• Temporary suspension\n• Service restrictions\n• Permanent account termination\n\nEnforcement decisions are made based on the severity of the issue and user history.' },
        },
      },
      country_specific: {
        label: 'Country-Specific Policies',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Country-Specific Policies' },
          content: { type: 'rich_text', label: 'Content', placeholder: 'UK-specific legal and tax guidance\n\n100 Handy Pros operating in the UK may have additional responsibilities.\n\nThese may include:\n\n• Registering as self-employed or operating as a business\n• Managing tax responsibilities\n• Keeping records of earnings\n• Following local employment and service laws\n\n100 Handy Pros are responsible for ensuring compliance with local tax and legal obligations.\n\nLocal service terms\n\nSome policies may vary depending on:\n\n• The region where services are delivered\n• The type of service being offered\n• Local safety or licensing requirements\n\nUsers will be informed if additional conditions apply to specific services.\n\nRegulatory and compliance information\n\n100 Handy operates in accordance with applicable laws and regulations.\n\nThis includes:\n\n• Consumer protection requirements\n• Data protection regulations\n• Platform safety standards\n• Regional service regulations\n\nCompliance ensures the platform operates responsibly and legally.' },
        },
      },
      contact_section: {
        label: 'Contact Us',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Contact Us' },
          content: { type: 'rich_text', label: 'Content', placeholder: 'If you have questions about policies or need assistance with safety or compliance matters, you can contact our support team directly.\n\nFor policy-related enquiries, please email:\n\nhelp@100handy.com\n\nOur team will review your message and respond with the appropriate guidance.' },
        },
      },
    },
  },
  blog: {
    label: 'Blog',
    slug: '/blog',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: 'Blog' },
          subtitle: { type: 'text', label: 'Subtitle', placeholder: 'Tips, guides, and stories from the 100 Handy community' },
          image: { type: 'image_url', label: 'Hero Background Image', placeholder: '/images/hero/heroimage2.jpeg' },
        },
      },
    },
  },
  contact: {
    label: 'Contact Us',
    slug: '/contact',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          breadcrumb: { type: 'text', label: 'Breadcrumb Text', placeholder: '100Handy Support / Submit a request' },
          title: { type: 'text', label: 'Page Title', placeholder: 'Contact Us' },
        },
      },
      cards: {
        label: 'Contact Cards',
        fields: {
          card_1_title: { type: 'text', label: 'Card 1 Title', placeholder: 'Message us' },
          card_1_text: { type: 'text', label: 'Card 1 Text', placeholder: 'Click here to reach out!' },
          card_2_title: { type: 'text', label: 'Card 2 Title', placeholder: 'Send us an email' },
          card_2_text: { type: 'text', label: 'Card 2 Text', placeholder: 'Available every day' },
          card_3_title: { type: 'text', label: 'Card 3 Title', placeholder: 'Give us a call' },
          card_3_text: { type: 'text', label: 'Card 3 Text', placeholder: 'Toll free for US and Canada' },
        },
      },
      form: {
        label: 'Email Form',
        fields: {
          title: { type: 'text', label: 'Form Title', placeholder: 'Send us an email' },
          subtitle: { type: 'text', label: 'Form Subtitle', placeholder: 'Please provide detailed information below and our agents will reply via email as soon as possible.' },
        },
      },
    },
  },
}

/** Get all page keys */
export function getPageKeys(): string[] {
  return Object.keys(pageRegistry)
}

/** Get a flat list of all field keys for a page (e.g. "hero.title") */
export function getPageFieldKeys(pageKey: string): string[] {
  const page = pageRegistry[pageKey]
  if (!page) return []
  const keys: string[] = []
  for (const [sectionKey, section] of Object.entries(page.sections)) {
    for (const fieldKey of Object.keys(section.fields)) {
      keys.push(`${sectionKey}.${fieldKey}`)
    }
  }
  return keys
}
