import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '../../../../packages/shared/query';

interface QueryProviderProps {
  children: React.ReactNode;
}

// Create a singleton query client for the app
const queryClient = createQueryClient();

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}