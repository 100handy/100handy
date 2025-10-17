import Link from "next/link";

interface HeaderProps {
  currentPage?: "get-10" | "book-task" | "my-tasks" | "account";
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
              href="/get-10"
              className={`font-bold hover:text-brand-terracotta transition-colors text-sm sm:text-base ${
                currentPage === "get-10" ? "text-brand-terracotta" : "text-brand-dark"
              }`}
            >
              Get £10
            </Link>
            <Link
              href="/book-task"
              className={`font-bold hover:text-brand-terracotta transition-colors text-sm sm:text-base ${
                currentPage === "book-task" ? "text-brand-terracotta" : "text-brand-dark"
              }`}
            >
              Book a Task
            </Link>
            <Link
              href="/my-tasks"
              className={`font-bold hover:text-brand-terracotta transition-colors text-sm sm:text-base ${
                currentPage === "my-tasks" ? "text-brand-terracotta" : "text-brand-dark"
              }`}
            >
              My Tasks
            </Link>
            <Link
              href="/account"
              className={`font-bold hover:text-brand-terracotta transition-colors text-sm sm:text-base ${
                currentPage === "account" ? "text-brand-terracotta" : "text-brand-dark"
              }`}
            >
              Account
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
