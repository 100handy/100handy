"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type HomeCategoryContextValue = {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
};

const HomeCategoryContext = createContext<HomeCategoryContextValue | null>(null);

export function HomeCategoryProvider({ children }: { children: ReactNode }) {
  const [activeCategory, setActiveCategoryState] = useState<string>("Assembly");
  const setActiveCategory = useCallback((category: string) => {
    setActiveCategoryState(category);
  }, []);
  const value = useMemo(
    () => ({ activeCategory, setActiveCategory }),
    [activeCategory, setActiveCategory]
  );
  return (
    <HomeCategoryContext.Provider value={value}>
      {children}
    </HomeCategoryContext.Provider>
  );
}

export function useHomeCategory() {
  const ctx = useContext(HomeCategoryContext);
  return ctx;
}
