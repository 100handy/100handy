import { BookOpen, Globe, CheckSquare, Handshake, User, Briefcase } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { HelpSearch } from "@/components/help/help-search";

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Full-page geometric background wrapper (between header and footer) */}
            <div className="relative overflow-hidden">
                {/* Geometric starburst background — covers hero + categories + CTAs */}
                <div className="absolute inset-0" aria-hidden="true">
                    <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 1920 1760"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Background base */}
                        <rect width="1920" height="1760" fill="#F3E3D3" fillOpacity="0.25" />

                        {/* === LEFT SIDE === */}
                        {/* Dark green — left upper facet (darker) */}
                        <polygon points="0,0 480,0 280,700 0,460" fill="#333A31" />
                        {/* Dark green — left lower facet (slightly lighter for fold) */}
                        <polygon points="0,460 280,700 340,1760 0,1760" fill="#2D3229" />

                        {/* Terracotta — top-left corner */}
                        <polygon points="0,0 480,0 0,320" fill="#C1856A" />

                        {/* === RIGHT SIDE === */}
                        {/* Dark green — far right upper */}
                        <polygon points="1580,0 1920,0 1920,460 1680,700" fill="#333A31" />
                        {/* Dark green — far right lower */}
                        <polygon points="1920,460 1680,700 1720,1760 1920,1760" fill="#2D3229" />

                        {/* Terracotta — top-right corner */}
                        <polygon points="1440,0 1920,0 1920,320" fill="#C1856A" />

                        {/* Sage green — right band (prominent, asymmetric) */}
                        <polygon points="1280,0 1580,0 1680,700 1720,1760 1380,1760 1340,700" fill="#A0B194" />

                        {/* Sage green — bottom-right extension (lighter) */}
                        <polygon points="1340,700 1380,1760 1180,1760 1240,900" fill="#A0B194" fillOpacity="0.45" />

                        {/* === CENTER === */}
                        {/* White content area — asymmetric: tighter left, wider right */}
                        <polygon points="480,0 1280,0 1340,700 1180,1760 340,1760 280,700" fill="white" />
                    </svg>
                </div>

                {/* Hero Section */}
                <section className="relative z-10 pt-[98px] pb-[112px]">
                    <div className="max-w-[1920px] mx-auto px-8 text-center">
                        <h1 className="text-[68px] font-bold text-brand-dark-alt leading-[1.221] mb-[39px]">
                            How can we help?
                        </h1>
                        <p className="text-base font-bold text-brand-dark-alt leading-[1.221] mb-[24px]">
                            Are you a 100 Handy Pro? Sign in to view additional resources.
                        </p>

                        <HelpSearch />
                    </div>
                </section>

                {/* Categories Section */}
                <section className="relative z-10 py-[111px]">
                    <div className="max-w-[900px] mx-auto px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[80px] gap-y-[60px] mb-[60px] justify-items-center">
                            <CategoryCard
                                icon={<BookOpen className="w-[33.7px] h-[33.7px]" />}
                                title="Client"
                                href="/help/client"
                                bgColor="bg-brand-terracotta"
                            />
                            <CategoryCard
                                icon={<Globe className="w-[33.76px] h-[33.76px]" />}
                                title="Tasker"
                                href="/help/pro"
                                bgColor="bg-brand-terracotta"
                            />
                            <CategoryCard
                                icon={<CheckSquare className="w-[33.59px] h-[37.44px]" />}
                                title="Registration"
                                href="/help/registration"
                                bgColor="bg-brand-terracotta"
                            />
                            <CategoryCard
                                icon={<User className="w-[32.06px] h-[32.09px]" />}
                                title="Account"
                                href="/help/account"
                                bgColor="bg-brand-terracotta"
                            />
                            <CategoryCard
                                icon={<Handshake className="w-[50.79px] h-[32.09px]" />}
                                title="Policy Center"
                                href="/help/policies"
                                bgColor="bg-brand-terracotta"
                            />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative z-10 py-[83px]">
                    <div className="max-w-[1920px] mx-auto px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[29px] max-w-[1076px] mx-auto">
                            <CTACard
                                title="Can't find what you need? →"
                                description="Contact us and we'll get back to you as soon as we can."
                            />
                            <CTACard
                                title="Ready to book a task? →"
                                description="Head over to our website to see our available categories!"
                            />
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}

function CategoryCard({ icon, title, href, bgColor }: { icon: React.ReactNode; title: string; href: string; bgColor: string }) {
    return (
        <Link href={href} className="flex flex-col items-center text-center group">
            <div className={`w-[101px] h-[99px] ${bgColor} rounded-full flex items-center justify-center text-white mb-[40px] group-hover:opacity-85 transition-opacity`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-brand-dark-alt leading-[1.221] group-hover:text-brand-terracotta transition-colors">{title}</h3>
        </Link>
    );
}

function CTACard({ title, description }: { title: string; description: string }) {
    return (
        <div className="bg-white rounded-lg shadow-[0px_3px_6px_0px_rgba(0,0,0,0.16)] hover:shadow-lg transition-shadow">
            <div className="p-10">
                <h3 className="text-xl font-bold text-brand-dark leading-[1.221] mb-[43px]">{title}</h3>
                <p className="text-xl font-medium text-brand-dark leading-[1.221]">{description}</p>
            </div>
        </div>
    );
}
