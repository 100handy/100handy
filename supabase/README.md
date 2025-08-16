# Supabase Edge Functions

This directory contains the Supabase configuration and Edge Functions for the 100handy project.

## Prerequisites

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Make sure Docker is installed and running (required for local development)

## Getting Started

### 1. Initialize Supabase (if not already done)
```bash
supabase login
```

### 2. Start Local Development
```bash
# Start all Supabase services locally
pnpm supabase:start

# Or use the CLI directly
supabase start
```

This will start:
- Database on `http://localhost:54322`
- API on `http://localhost:54321`
- Studio on `http://localhost:54323`
- Inbucket (email testing) on `http://localhost:54324`

### 3. Serve Edge Functions Locally
```bash
# Serve all functions
pnpm supabase:functions:serve

# Or serve a specific function
supabase functions serve hello-world --no-verify-jwt
```

### 4. Test Your Functions

#### Hello World Function
```bash
curl -X POST 'http://localhost:54321/functions/v1/hello-world' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"name": "World"}'
```

#### API Example Function (requires authentication)
```bash
curl -X GET 'http://localhost:54321/functions/v1/api-example' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json'
```

## Available Functions

### hello-world
A simple function that demonstrates basic Edge Function structure with CORS handling.

### api-example
A more comprehensive example showing:
- Authentication with Supabase Auth
- Different HTTP methods (GET, POST)
- Database operations (commented examples)
- Error handling

## Deployment

### Deploy to Supabase Cloud
```bash
# Deploy all functions
pnpm supabase:functions:deploy

# Deploy a specific function
supabase functions deploy hello-world
```

### Environment Variables
Set environment variables in your Supabase dashboard under Settings > Edge Functions.

Common variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Development Tips

1. **Hot Reload**: Functions automatically reload when you save changes during local development.

2. **Logs**: View function logs in the Supabase Studio or use:
   ```bash
   supabase functions logs hello-world
   ```

3. **TypeScript**: All functions support TypeScript out of the box.

4. **Shared Code**: Use the `_shared` directory for common utilities and types.

5. **Database Access**: Use the Supabase client within functions to interact with your database.

## File Structure

```
supabase/
├── config.toml              # Supabase configuration
├── functions/
│   ├── _shared/
│   │   └── cors.ts          # Shared CORS headers
│   ├── hello-world/
│   │   └── index.ts         # Simple example function
│   └── api-example/
│       └── index.ts         # Advanced example with auth
├── seed.sql                 # Database seed data
└── README.md               # This file
```

## Useful Commands

```bash
# Start local Supabase
pnpm supabase:start

# Stop local Supabase
pnpm supabase:stop

# Reset local database
pnpm supabase:reset

# Serve functions locally
pnpm supabase:functions:serve

# Deploy functions
pnpm supabase:functions:deploy
```