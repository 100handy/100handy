import { BookOpen, Globe, CheckSquare, Handshake, User, Shield } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { HelpSearch } from "@/components/help/help-search";

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-white to-brand-cream/47 pt-[98px] pb-[112px]">
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
            <section className="py-[111px] bg-white">
                <div className="max-w-[1920px] mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[164px] gap-y-[60px] mb-[60px] justify-items-center">
                        {/* Client */}
                        <CategoryCard
                            icon={<BookOpen className="w-[33.7px] h-[33.7px]" />}
                            title="Client"
                            href="/help/client"
                            bgColor="bg-brand-terracotta"
                        />

                        {/* 100 Handy Pro */}
                        <CategoryCard
                            icon={<Globe className="w-[33.76px] h-[33.76px]" />}
                            title="100 Handy Pro"
                            href="/help/pro"
                            bgColor="bg-brand-terracotta"
                        />

                        {/* Registration */}
                        <CategoryCard
                            icon={<CheckSquare className="w-[33.59px] h-[37.44px]" />}
                            title="Registration"
                            href="/help/registration"
                            bgColor="bg-brand-terracotta"
                        />

                        {/* Account */}
                        <CategoryCard
                            icon={<User className="w-[32.06px] h-[32.09px]" />}
                            title="Account"
                            href="/help/account"
                            bgColor="bg-brand-terracotta"
                        />

                        {/* Policy Center */}
                        <CategoryCard
                            icon={<Shield className="w-[33.7px] h-[33.7px]" />}
                            title="Policy Center"
                            href="/help/policies"
                            bgColor="bg-brand-terracotta"
                        />

                        {/* Partnerships */}
                        <CategoryCard
                            icon={<Handshake className="w-[50.79px] h-[32.09px]" />}
                            title="Partnerships"
                            href="/help/partnerships"
                            bgColor="bg-brand-terracotta"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-[83px] bg-brand-cream/47">
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
