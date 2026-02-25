"use client";

import { Search } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "@shared/supabase";

const FALLBACK_SUBCATEGORIES = [
  "Furniture assembly",
  "IKEA assembly",
  "TV mounting",
  "Put up shelves",
  "Minor home repairs",
  "Deep clean",
  "Moving help",
  "Gardening",
  "Leak fixing",
  "Light installation",
];

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: allCategories } = useCategories();

  const subcategories = useMemo(() => {
    if (allCategories && allCategories.length > 0) {
      return allCategories.filter((c) => c.level === 1);
    }
    return FALLBACK_SUBCATEGORIES.map((name, i) => ({
      id: `fallback-${i}`,
      name,
      description: null,
      icon_url: null,
      parent_id: null,
      level: 1,
      display_order: i,
    }));
  }, [allCategories]);

  const matches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return subcategories.filter((c) =>
      c.name.toLowerCase().includes(q)
    );
  }, [searchQuery, subcategories]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery, matches.length]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectCategory = (categoryName: string) => {
    router.push(`/task-form?category=${encodeURIComponent(categoryName)}`);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (matches.length > 0) {
        selectCategory(matches[highlightedIndex]?.name ?? matches[0]?.name ?? searchQuery.trim());
      } else {
        router.push(`/task-form?category=${encodeURIComponent(searchQuery.trim())}`);
      }
    } else {
      router.push("/all-services");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || matches.length === 0) {
      if (e.key === "Enter") handleSearch(e as unknown as React.FormEvent);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => (i - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectCategory(matches[highlightedIndex]?.name ?? "");
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Hero Title */}
          <h1 className="text-[59px] font-bold leading-tight text-brand-dark-alt">
            Book trusted help for your home — fast.
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-[20px] leading-relaxed text-brand-dark-alt/80">
            Assembly, repairs, cleaning, moving, and more—handled by vetted pros, scheduled when it suits you, and paid securely in one place.
          </p>

          {/* Search Bar with Suggestions */}
          <div className="mt-10" ref={containerRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="What do you need help with?"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => searchQuery && setIsOpen(true)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                className="h-[52px] w-full rounded-lg border border-gray-300 bg-white py-3 pl-6 pr-14 text-[18px] text-brand-dark-alt placeholder:font-light placeholder:text-gray-400 focus:border-brand-terracotta focus:outline-none focus:ring-2 focus:ring-brand-terracotta/20"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-brand-terracotta p-3 text-white transition-colors hover:bg-brand-terracotta/90"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Matching options dropdown */}
              {isOpen && searchQuery.trim() && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[280px] overflow-auto rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                  {matches.length > 0 ? (
                    matches.map((cat, i) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => selectCategory(cat.name)}
                        onMouseEnter={() => setHighlightedIndex(i)}
                        className={`w-full px-6 py-3 text-left text-[16px] transition-colors ${
                          i === highlightedIndex
                            ? "bg-brand-terracotta/10 text-brand-terracotta"
                            : "text-brand-dark-alt hover:bg-gray-50"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-6 py-4 text-[16px] text-gray-500">
                      No matching services. Try &quot;assembly&quot;, &quot;cleaning&quot;, or{" "}
                      <button
                        type="button"
                        onClick={() => router.push("/all-services")}
                        className="font-medium text-brand-terracotta hover:underline"
                      >
                        browse all services
                      </button>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
