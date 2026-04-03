"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchEntry {
  title: string;
  category: string;
  href: string;
  keywords: string;
}

const searchIndex: SearchEntry[] = [
  // Client Support
  { title: "How to book a job", category: "Client", href: "/help/client#getting-started", keywords: "booking service select professional confirm step by step" },
  { title: "What happens after I book?", category: "Client", href: "/help/client#getting-started", keywords: "confirmation email chat instructions arrival" },
  { title: "Changing or cancelling a booking", category: "Client", href: "/help/client#getting-started", keywords: "reschedule cancel free charge 24 hours refund cancellation" },
  { title: "How pricing works", category: "Client", href: "/help/client#payments-pricing-refunds", keywords: "price cost rate materials extra work hidden costs transparent" },
  { title: "Payment methods", category: "Client", href: "/help/client#payments-pricing-refunds", keywords: "visa mastercard american express pay online card" },
  { title: "Refunds & service guarantees", category: "Client", href: "/help/client#payments-pricing-refunds", keywords: "refund money back incomplete quality guarantee claim" },
  { title: "Invoices & receipts", category: "Client", href: "/help/client#payments-pricing-refunds", keywords: "invoice receipt pdf download billing charges" },
  { title: "Using the chat", category: "Client", href: "/help/client#communicating-with-professionals", keywords: "chat message communicate share photos instructions secure" },
  { title: "What information do I see about a professional?", category: "Client", href: "/help/client#communicating-with-professionals", keywords: "profile reviews ratings skills verified response time" },
  { title: "What if my professional is late or doesn't arrive?", category: "Client", href: "/help/client#issues-disputes-safety", keywords: "late no show delayed replacement support" },
  { title: "Reporting damages or problems", category: "Client", href: "/help/client#issues-disputes-safety", keywords: "damage report problem issue compensation corrective" },
  { title: "Safety guidelines", category: "Client", href: "/help/client#issues-disputes-safety", keywords: "safety secure meeting well lit suspicious behaviour verification" },
  { title: "Managing your profile", category: "Client", href: "/help/client#account-settings", keywords: "email phone password notification preferences saved addresses update" },
  { title: "Deleting or deactivating your account", category: "Client", href: "/help/client#account-settings", keywords: "delete deactivate close account data retained" },
  { title: "Promo codes & discounts", category: "Client", href: "/help/client#account-settings", keywords: "promo code discount coupon checkout promotion offer" },
  { title: "Booking assembly or specialist services", category: "Client", href: "/help/client#furniture-assembly-specialist-services", keywords: "furniture assembly garden landscaping cleaning repairs seasonal" },
  { title: "What's included in assembly services", category: "Client", href: "/help/client#furniture-assembly-specialist-services", keywords: "assembly unpacking setup packaging wall mounting electrical plumbing" },
  { title: "How to contact us", category: "Client", href: "/help/client#contacting-support", keywords: "contact support live chat email in-app messaging hours" },
  { title: "Submit a support request", category: "Client", href: "/help/client#contacting-support", keywords: "submit request booking billing account complaint" },

  // 100 Handy Pro
  { title: "How do I receive job invitations?", category: "100 Handy Pro", href: "/help/pro#receiving-managing-job-invitations", keywords: "invitation notification dashboard job request skills area" },
  { title: "Accepting or declining a job", category: "100 Handy Pro", href: "/help/pro#receiving-managing-job-invitations", keywords: "accept decline respond invitation visibility reliability" },
  { title: "Managing your availability", category: "100 Handy Pro", href: "/help/pro#receiving-managing-job-invitations", keywords: "availability working hours block dates service area pause schedule" },
  { title: "Using the secure chat system (Pro)", category: "100 Handy Pro", href: "/help/pro#communicating-with-clients", keywords: "chat client communicate confirm arrival questions delays" },
  { title: "Confirming job details before arrival", category: "100 Handy Pro", href: "/help/pro#communicating-with-clients", keywords: "confirm requirements access parking tools materials duration" },
  { title: "Preparing for a job", category: "100 Handy Pro", href: "/help/pro#scheduling-completing-jobs", keywords: "prepare tools equipment travel clothing professional" },
  { title: "Marking a job as complete", category: "100 Handy Pro", href: "/help/pro#scheduling-completing-jobs", keywords: "complete finish status dashboard notes payment" },
  { title: "Handling changes during a job", category: "100 Handy Pro", href: "/help/pro#scheduling-completing-jobs", keywords: "changes additional work approve extra time materials" },
  { title: "How payments work (Pro)", category: "100 Handy Pro", href: "/help/pro#payments-earnings-invoicing", keywords: "payment payout earnings funds transferred dashboard" },
  { title: "Viewing earnings and payment history", category: "100 Handy Pro", href: "/help/pro#payments-earnings-invoicing", keywords: "earnings history track completed pending download summary" },
  { title: "Resolving payment issues", category: "100 Handy Pro", href: "/help/pro#payments-earnings-invoicing", keywords: "payment issue problem delay payout support" },
  { title: "Delivering high-quality service", category: "100 Handy Pro", href: "/help/pro#professional-standards-client-experience", keywords: "quality service standards on time communicate clean professional" },
  { title: "Receiving reviews and ratings", category: "100 Handy Pro", href: "/help/pro#professional-standards-client-experience", keywords: "reviews ratings feedback quality communication punctuality" },
  { title: "Handling cancellations (Pro)", category: "100 Handy Pro", href: "/help/pro#professional-standards-client-experience", keywords: "cancel cancellation notify visibility reputation frequent" },
  { title: "What if a problem occurs during a job?", category: "100 Handy Pro", href: "/help/pro#issues-disputes-safety", keywords: "problem issue pause inform support photos documentation" },
  { title: "Reporting safety concerns (Pro)", category: "100 Handy Pro", href: "/help/pro#issues-disputes-safety", keywords: "safety unsafe leave location report" },
  { title: "Reporting accidental damage", category: "100 Handy Pro", href: "/help/pro#issues-disputes-safety", keywords: "damage accidental inform photos report honest" },
  { title: "Managing your 100 Handy Pro profile", category: "100 Handy Pro", href: "/help/pro#account-profile-settings", keywords: "profile contact skills services areas pricing availability images" },
  { title: "Updating payment details (Pro)", category: "100 Handy Pro", href: "/help/pro#account-profile-settings", keywords: "payment bank details payout update delay" },
  { title: "Deactivating your Pro account", category: "100 Handy Pro", href: "/help/pro#account-profile-settings", keywords: "deactivate stop services outstanding jobs download records" },
  { title: "How to contact Pro support", category: "100 Handy Pro", href: "/help/pro#contacting-100-handy-pro-support", keywords: "contact support in-app chat help centre messaging hours" },
  { title: "Submitting a support request (Pro)", category: "100 Handy Pro", href: "/help/pro#contacting-100-handy-pro-support", keywords: "submit request job issue client payment account" },

  // Registration
  { title: "How to become a 100 Handy Pro", category: "Registration", href: "/help/registration#getting-started", keywords: "become pro register account services location sign up join" },
  { title: "What you need before you start", category: "Registration", href: "/help/registration#getting-started", keywords: "identification proof address photo contact details bank account" },
  { title: "Are 100 Handy Pros employees?", category: "Registration", href: "/help/registration#eligibility-requirements", keywords: "employee independent self-employed contractor business" },
  { title: "Eligibility requirements", category: "Registration", href: "/help/registration#eligibility-requirements", keywords: "eligibility legal work identification verification age skills" },
  { title: "Verifying your identity", category: "Registration", href: "/help/registration#identity-verification", keywords: "identity verification upload documents photo background check" },
  { title: "Identity verification process", category: "Registration", href: "/help/registration#identity-verification", keywords: "verification process upload confirm checks review approval days" },
  { title: "Background checks", category: "Registration", href: "/help/registration#identity-verification", keywords: "background check screening trust safety DBS" },
  { title: "Create your 100 Handy Pro profile", category: "Registration", href: "/help/registration#account-setup", keywords: "profile services photo description skills pricing setup" },
  { title: "Set your schedule and work area", category: "Registration", href: "/help/registration#account-setup", keywords: "schedule working hours service locations availability" },
  { title: "Updating or upgrading your account", category: "Registration", href: "/help/registration#account-setup", keywords: "update upgrade add services expand area pricing" },
  { title: "Finish registration", category: "Registration", href: "/help/registration#completing-registration", keywords: "complete finish registration identity documents profile availability review" },
  { title: "Start receiving jobs", category: "Registration", href: "/help/registration#completing-registration", keywords: "approved visible invitations accept reputation reviews" },
  { title: "Help with registration issues", category: "Registration", href: "/help/registration#support-during-registration", keywords: "registration issues documents verification profile technical problems" },

  // Account
  { title: "Updating your account details", category: "Account", href: "/help/account#profile-management", keywords: "update name email phone address photo service details" },
  { title: "Notification preferences", category: "Account", href: "/help/account#profile-management", keywords: "notifications booking messages job updates payment alerts promotional" },
  { title: "Changing your password", category: "Account", href: "/help/account#profile-management", keywords: "password change update security settings" },
  { title: "Signing in to your account", category: "Account", href: "/help/account#access-and-login", keywords: "sign in login email password access" },
  { title: "Trouble accessing your account", category: "Account", href: "/help/account#access-and-login", keywords: "login trouble access email password internet reset" },
  { title: "Account recovery", category: "Account", href: "/help/account#access-and-login", keywords: "forgot password recovery reset email verify identity" },
  { title: "Updating account information", category: "Account", href: "/help/account#account-changes", keywords: "update personal contact payment service saved addresses" },
  { title: "Managing linked details", category: "Account", href: "/help/account#account-changes", keywords: "linked contact payment preferences booking history locations" },
  { title: "Closing your account", category: "Account", href: "/help/account#account-changes", keywords: "close account delete active bookings archived retained permanent" },
  { title: "Keeping your account secure", category: "Account", href: "/help/account#security-and-privacy", keywords: "security strong password private logout shared devices activity" },
  { title: "Privacy settings", category: "Account", href: "/help/account#security-and-privacy", keywords: "privacy data bookings payments communication quality security" },
  { title: "Account verification", category: "Account", href: "/help/account#security-and-privacy", keywords: "verify identity sensitive details payment registration" },

  // Policies
  { title: "Terms of Service", category: "Policy Center", href: "/help/policies#legal-terms", keywords: "terms service legal agreement booking payment cancellation refund" },
  { title: "Privacy Policy", category: "Policy Center", href: "/help/policies#legal-terms", keywords: "privacy policy data collect use store share rights deletion" },
  { title: "Service Protection Terms & Conditions", category: "Policy Center", href: "/help/policies#legal-terms", keywords: "service protection claim coverage compensation issues" },
  { title: "User safety guidance", category: "Policy Center", href: "/help/policies#trust-and-safety", keywords: "safety communication platform reporting unsafe personal information" },
  { title: "Background checks and verification", category: "Policy Center", href: "/help/policies#trust-and-safety", keywords: "background check identity profile screening credential" },
  { title: "Acceptable use and platform rules", category: "Policy Center", href: "/help/policies#platform-rules", keywords: "rules acceptable use prohibited fraudulent harassment discrimination" },
  { title: "Client and Pro responsibilities", category: "Policy Center", href: "/help/policies#platform-rules", keywords: "responsibilities client pro job descriptions payments professional" },
  { title: "Account action and enforcement", category: "Policy Center", href: "/help/policies#platform-rules", keywords: "enforcement warning suspension termination restriction rules" },
  { title: "UK-specific legal and tax guidance", category: "Policy Center", href: "/help/policies#country-specific-policies", keywords: "UK tax self-employed business records earnings legal obligations" },
  { title: "Regulatory and compliance information", category: "Policy Center", href: "/help/policies#country-specific-policies", keywords: "regulatory compliance consumer protection data safety" },

  // Partnerships
  { title: "Offering 100 Handy services at checkout", category: "Partnerships", href: "/help/partnerships#retail-partnerships", keywords: "retail checkout furniture assembly installation mounting repairs" },
  { title: "Partner landing pages", category: "Partnerships", href: "/help/partnerships#retail-partnerships", keywords: "partner page branded booking customer journey" },
  { title: "Fixed-price service options", category: "Partnerships", href: "/help/partnerships#retail-partnerships", keywords: "fixed price transparent simple booking pricing" },
  { title: "100 Handy for Business", category: "Partnerships", href: "/help/partnerships#business-integrations", keywords: "business integration post-purchase support installation maintenance" },
  { title: "API and platform integrations", category: "Partnerships", href: "/help/partnerships#business-integrations", keywords: "API integration checkout support automated service" },
  { title: "Promotions and co-marketing", category: "Partnerships", href: "/help/partnerships#marketing-and-brand-collaborations", keywords: "marketing promotions joint campaigns cross-promotions digital content" },
  { title: "Promo code partnerships", category: "Partnerships", href: "/help/partnerships#marketing-and-brand-collaborations", keywords: "promo code discount reward campaign retention" },
  { title: "Pro perks and development", category: "Partnerships", href: "/help/partnerships#100-handy-pro-partnerships", keywords: "pro perks professional development tools resources growth" },
  { title: "How to become a partner", category: "Partnerships", href: "/help/partnerships#getting-in-touch", keywords: "partner enquiry contact checkout marketing pro development" },
  { title: "Partnership enquiries", category: "Partnerships", href: "/help/partnerships#getting-in-touch", keywords: "enquiry contact help@100handy.com business partnership" },
];

const popularSearches = [
  "Invoice",
  "Payment",
  "How to book",
  "Cancellation policy",
  "100Handy Assembly",
];

export function HelpSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const results = query.trim().length >= 2
    ? searchIndex.filter((entry) => {
        const q = query.toLowerCase();
        return (
          entry.title.toLowerCase().includes(q) ||
          entry.category.toLowerCase().includes(q) ||
          entry.keywords.toLowerCase().includes(q)
        );
      }).slice(0, 8)
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(href: string) {
    setQuery("");
    setIsOpen(false);
    router.push(href);
  }

  function handlePopularClick(term: string) {
    setQuery(term);
    setIsOpen(true);
  }

  return (
    <>
      {/* Search Bar */}
      <div ref={wrapperRef} className="relative max-w-[592px] mx-auto mb-[10px]">
        <div className="relative flex bg-white rounded-lg shadow-[0px_3px_6px_0px_rgba(0,0,0,0.16)]">
          <Search className="absolute left-[24px] top-1/2 -translate-y-1/2 w-[14.56px] h-[14.56px] text-brand-dark" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search"
            className="flex-1 pl-[56px] pr-[16px] py-[19px] text-xl font-medium text-brand-dark rounded-l-lg focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
          />
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-[24px] py-[19px] bg-brand-dark text-white text-base font-bold rounded-r-lg hover:bg-brand-dark/90 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Results dropdown */}
        {isOpen && query.trim().length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-[0px_4px_12px_rgba(0,0,0,0.15)] z-50 max-h-[400px] overflow-y-auto">
            {results.length > 0 ? (
              <ul>
                {results.map((result, i) => (
                  <li key={i}>
                    <button
                      onClick={() => handleSelect(result.href)}
                      className="w-full text-left px-6 py-4 hover:bg-brand-cream/40 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <p className="text-[15px] font-semibold text-brand-dark-alt">
                        {result.title}
                      </p>
                      <p className="text-[12px] text-gray-500 mt-0.5">
                        {result.category}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-4 text-[15px] text-gray-500">
                No results found for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popular Searches */}
      <div className="mb-4">
        <p className="text-base font-bold text-brand-dark-alt leading-[1.221] mb-[14px]">
          Popular searches:
        </p>
        <div className="flex flex-wrap justify-center gap-[8px]">
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => handlePopularClick(term)}
              className="px-[18px] py-[10px] bg-brand-terracotta text-white text-[10px] font-bold leading-[1.221] rounded hover:bg-brand-terracotta/85 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
