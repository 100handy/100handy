import { Search } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  showSearch?: boolean;
}

export default function Header({ showSearch = true }: HeaderProps) {
  return (
    <header className="bg-brand-dark border-b border-gray-500 border-opacity-20">
      <div className="max-w-[1920px] mx-auto px-8">
        <div className="flex items-center justify-between h-[70px]">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Image 
                src="/logo-100-handy.svg" 
                alt="100 HANDY" 
                width={24} 
                height={24}
                className="text-white"
              />
              <div className="text-white font-bold text-base font-display">100 HANDY</div>
            </div>
          </div>
          <div className="flex items-center gap-12">
            <button className="text-white font-bold text-base hover:text-brand-terracotta transition-colors">
              Submit a request
            </button>
            <button className="text-white font-bold text-base hover:text-brand-terracotta transition-colors">
              Sign in
            </button>
            {showSearch && (
              <Search className="w-[14.56px] h-[14.56px] text-white" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
