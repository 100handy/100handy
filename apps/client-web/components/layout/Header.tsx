import Link from "next/link";

interface HeaderProps {
  currentPage?: "become-tasker" | "services" | "sign-up";
}

export default function Header({ currentPage }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-[70px]">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-brand-dark-alt font-bold text-lg sm:text-xl font-display">
              100<span className="font-normal">HANDY</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6 lg:gap-8">
            <Link
              href="/become-tasker"
              className={`font-bold hover:text-brand-terracotta transition-colors text-sm sm:text-base ${
                currentPage === "become-tasker" ? "text-brand-terracotta" : "text-brand-dark"
              }`}
            >
              Become a Tasker
            </Link>
            <Link
              href="/services"
              className={`font-bold hover:text-brand-terracotta transition-colors text-sm sm:text-base ${
                currentPage === "services" ? "text-brand-terracotta" : "text-brand-dark"
              }`}
            >
              Services
            </Link>
            <Link
              href="/sign-up"
              className={`font-bold hover:text-brand-terracotta transition-colors text-sm sm:text-base ${
                currentPage === "sign-up" ? "text-brand-terracotta" : "text-brand-dark"
              }`}
            >
              Sign up / Log in
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
