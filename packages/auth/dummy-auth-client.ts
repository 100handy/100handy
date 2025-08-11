/**
 * Dummy auth client implementation to replace Better Auth
 */

type AuthResponse = {
  data?: any;
  error?: { message: string };
};

type SignInParams = {
  email: string;
  password: string;
};

type SignUpParams = SignInParams & {
  name?: string;
};

type CallbackOptions = {
  onRequest?: (ctx: any) => void;
  onResponse?: (ctx: any) => void;
};

export const createAuthClient = (config: { baseURL: string, plugins?: any[] }) => {
  console.log('Creating dummy auth client with config:', config);
  
  return {
    signIn: {
      email: async (params: SignInParams, options?: CallbackOptions): Promise<AuthResponse> => {
        console.log('Dummy signIn.email called with:', params);
        options?.onRequest?.({});
        
        // Simulate successful sign-in for test@example.com
        const success = params.email === 'test@example.com' && params.password === 'password';
        
        const result = success 
          ? { data: { user: { email: params.email } } }
          : { error: { message: 'Invalid email or password' } };
          
        options?.onResponse?.({});
        return result;
      }
    },
    signUp: {
      email: async (params: SignUpParams): Promise<AuthResponse> => {
        console.log('Dummy signUp.email called with:', params);
        
        // Simulate successful sign-up
        return { data: { user: { email: params.email, name: params.name } } };
      }
    },
    signOut: async (): Promise<void> => {
      console.log('Dummy signOut called');
    },
    getUser: async () => {
      console.log('Dummy getUser called');
      return null; // Not authenticated by default
    },
    // Add any other methods that might be needed
  };
};

export const toNextJsHandler = (auth: any) => {
  return {
    GET: auth.handler,
    POST: auth.handler
  };
};