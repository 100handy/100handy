"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@shared/query";
import { ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

