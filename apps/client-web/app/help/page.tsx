import { Search, BookOpen, Globe, CheckSquare, Handshake, User } from "lucide-react";

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-brand-dark border-b border-gray-500 border-opacity-20">
                <div className="max-w-[1920px] mx-auto px-8">
                    <div className="flex items-center justify-between h-[70px]">
                        <div className="flex items-center gap-8">
                            <div className="text-white font-bold text-base">100 HANDY</div>
                        </div>
                        <div className="flex items-center gap-12">
                            <button className="text-white font-bold text-base hover:text-brand-terracotta transition-colors">
                                Submit a request
                            </button>
                            <button className="text-white font-bold text-base hover:text-brand-terracotta transition-colors">
                                Sign in
                            </button>
                            <Search className="w-[14.56px] h-[14.56px] text-white" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-white to-brand-cream/47 pt-[98px] pb-[112px]">
                <div className="max-w-[1920px] mx-auto px-8 text-center">
                    <h1 className="text-[68px] font-bold text-brand-dark-alt leading-[1.221] mb-[39px]">
                        How can we help?
                    </h1>
                    <p className="text-base font-bold text-brand-dark-alt leading-[1.221] mb-[24px]">
                        Are you a Tasker? Sign in to view additional resources.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-[592px] mx-auto mb-[10px]">
                        <div className="relative bg-white rounded-lg shadow-[0px_3px_6px_0px_rgba(0,0,0,0.16)]">
                            <Search className="absolute left-[24px] top-1/2 -translate-y-1/2 w-[14.56px] h-[14.56px] text-brand-dark" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full pl-[56px] pr-[30px] py-[19px] text-xl font-medium text-brand-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                            />
                        </div>
                    </div>

                    {/* Popular Searches */}
                    <div className="mb-4">
                        <p className="text-base font-bold text-brand-dark-alt leading-[1.221] mb-[14px]">Popular searches:</p>
                        <div className="flex flex-wrap justify-center gap-[8px]">
                            <span className="px-[16px] py-[10px] bg-brand-terracotta text-white text-[10px] font-bold leading-[1.221] rounded">
                                Invoice
                            </span>
                            <span className="px-[18px] py-[10px] bg-brand-terracotta text-white text-[10px] font-bold leading-[1.221] rounded">
                                Payment
                            </span>
                            <span className="px-[18px] py-[10px] bg-brand-terracotta text-white text-[10px] font-bold leading-[1.221] rounded">
                                How to book
                            </span>
                            <span className="px-[24px] py-[10px] bg-brand-terracotta text-white text-[10px] font-bold leading-[1.221] rounded">
                                Cancellation policy
                            </span>
                            <span className="px-[24px] py-[10px] bg-brand-terracotta text-white text-[10px] font-bold leading-[1.221] rounded">
                                100Handy Assembly
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-[111px] bg-white">
                <div className="max-w-[1920px] mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[164px] gap-y-0 mb-[130px] justify-items-center">
                        {/* Client */}
                        <CategoryCard
                            icon={<BookOpen className="w-[33.7px] h-[33.7px]" />}
                            title="Client"
                            bgColor="bg-brand-terracotta"
                        />

                        {/* Tasker */}
                        <CategoryCard
                            icon={<Globe className="w-[33.76px] h-[33.76px]" />}
                            title="Tasker"
                            bgColor="bg-brand-terracotta"
                        />

                        {/* Registration */}
                        <CategoryCard
                            icon={<CheckSquare className="w-[33.59px] h-[37.44px]" />}
                            title="Registration"
                            bgColor="bg-brand-terracotta"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[154px] gap-y-0 justify-items-center max-w-[616px] mx-auto">
                        {/* Account */}
                        <CategoryCard
                            icon={<User className="w-[32.06px] h-[32.09px]" />}
                            title="Account"
                            bgColor="bg-brand-terracotta"
                        />

                        {/* Policy Center */}
                        <CategoryCard
                            icon={<Handshake className="w-[50.79px] h-[32.09px]" />}
                            title="Policy Center"
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

            {/* Footer */}
            <footer className="bg-brand-dark text-white py-[67px]">
                <div className="max-w-[1920px] mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-medium text-gray-200 leading-[1.221] mb-[35px]">Discover</h3>
                            <ul className="space-y-[24px] text-brand-sage text-base font-bold leading-[1.221]">
                                <li><a href="#" className="hover:text-white transition-colors">Become a Tasker</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Services By City</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">All Services</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Elite Taskers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Help</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-200 leading-[1.221] mb-[35px]">Company</h3>
                            <ul className="space-y-[24px] text-brand-sage text-base font-bold leading-[1.221]">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Partner with 100 Handy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">100 Handy for Good</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms & Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Legal</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Cookies Settings</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-200 leading-[1.221] mb-[25px]">Download our app</h3>
                            <p className="text-brand-sage text-base font-medium leading-[1.221] mb-4">
                                Tackle your to-do list wherever you are with our mobile app.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-200 leading-[1.221] mb-[6px]">Follow us! We're friendly:</h3>
                            <div className="flex gap-[10px] mt-[22px]">
                                {/* Social icons would go here */}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function CategoryCard({ icon, title, bgColor }: { icon: React.ReactNode; title: string; bgColor: string }) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className={`w-[101px] h-[99px] ${bgColor} rounded-full flex items-center justify-center text-white mb-[40px]`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-brand-dark-alt leading-[1.221]">{title}</h3>
        </div>
    );
}

function CTACard({ title, description }: { title: string; description: string }) {
    return (
        <div className="bg-white rounded-lg shadow-[0px_3px_6px_0px_rgba(0,0,0,0.16)] hover:shadow-lg transition-shadow">
            <div className="pt-[99px] pb-[0px] px-8">
                <h3 className="text-xl font-bold text-brand-dark leading-[1.221] mb-[43px]">{title}</h3>
                <p className="text-xl font-medium text-brand-dark leading-[1.221]">{description}</p>
            </div>
        </div>
    );
}
