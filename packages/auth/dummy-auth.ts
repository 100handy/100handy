/**
 * Dummy auth implementation to replace Better Auth
 */

export const createAuth = (databaseUrl: string) => {
  console.log('Using dummy auth with connection string:', databaseUrl);
  
  return {
    handler: async (req: Request) => {
      console.log('Dummy auth handler called');
      return new Response(JSON.stringify({ success: true, message: 'Dummy auth endpoint' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    },
    // Add any other methods that might be needed
  };
};